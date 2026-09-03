import { LinearSRGBColorSpace, PerspectiveCamera, Scene, UnsignedByteType, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";

import { figureTargets, frontConesOffset } from "./choreography";
import { Cones } from "./cones";
import { DepthBokehPass, FrontCones, GrainLayer } from "./extras";
import { buildFigureTextures } from "./figures";

export class ParticleScene {
	sectionProgress = 0;

	private renderer!: WebGLRenderer;
	private camera!: PerspectiveCamera;
	private composer!: EffectComposer;
	private cones!: Cones;
	private front!: FrontCones;
	private layer!: GrainLayer;
	private readonly scene = new Scene();
	private readonly mouse = new Vector2();
	private readonly state: { entered: boolean; instant: boolean; mobile: boolean; ready: boolean } = {
		entered: false,
		instant: false,
		mobile: false,
		ready: false,
	};
	private raf = 0;
	private clockStart = 0;

	init(canvas: HTMLCanvasElement) {
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.state.mobile = w < 768;
		const grid = this.state.mobile ? 84 : 100;
		this.renderer = new WebGLRenderer({ alpha: false, antialias: false, canvas, powerPreference: "high-performance", stencil: false });
		this.renderer.setPixelRatio(this.state.mobile ? Math.min(2, window.devicePixelRatio) : 1);
		this.renderer.setSize(w, h);
		this.renderer.outputColorSpace = LinearSRGBColorSpace;
		this.camera = new PerspectiveCamera(50, w / h, 0.1, 30);
		this.camera.position.set(0, 0, 10);

		this.cones = new Cones(buildFigureTextures(grid), grid, this.state.mobile);
		this.front = new FrontCones(this.state.mobile);
		this.layer = new GrainLayer(window.devicePixelRatio >= 2);
		this.scene.add(this.cones.group, this.front.group, this.layer.mesh);

		const ratio = this.renderer.getPixelRatio();
		this.composer = new EffectComposer(this.renderer, new WebGLRenderTarget(w * ratio, h * ratio, { type: UnsignedByteType }));
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.composer.addPass(new UnrealBloomPass(new Vector2(w, h), 0.4, 1, 0.159));
		if (!this.state.mobile) this.composer.addPass(new DepthBokehPass(this.scene, this.camera, w, h));
		const vignette = new ShaderPass(VignetteShader);
		vignette.uniforms.offset = { value: 0.3 };
		vignette.uniforms.darkness = { value: 4 };
		this.composer.addPass(vignette);

		this.resize();
		this.clockStart = performance.now();

		const point = (e: PointerEvent) => this.mouse.set(2 * (e.clientX / window.innerWidth - 0.5), -2 * (e.clientY / window.innerHeight - 0.5));
		const onMove = (e: PointerEvent) => {
			point(e);
			this.cones.onPointerMove(this.mouse);
			this.front.onPointerMove(this.mouse);
		};
		const onDown = (e: PointerEvent) => {
			point(e);
			this.cones.onPointerDown(this.mouse);
		};
		const onLeave = () => this.cones.onPointerLeave();
		const onVisibility = () => {
			cancelAnimationFrame(this.raf);
			if (!document.hidden) this.raf = requestAnimationFrame(loop);
		};
		const loop = () => {
			this.render();
			this.raf = requestAnimationFrame(loop);
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("pointerdown", onDown, { passive: true });
		document.addEventListener("pointerleave", onLeave);
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("resize", this.resize);
		this.raf = requestAnimationFrame(loop);
		this.state.ready = true;
		if (this.state.entered) this.applyEnter();

		this.dispose = () => {
			this.dispose = () => undefined;
			cancelAnimationFrame(this.raf);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerdown", onDown);
			document.removeEventListener("pointerleave", onLeave);
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("resize", this.resize);
			this.cones.dispose();
			this.front.dispose();
			this.layer.dispose();
			this.composer.dispose();
			this.renderer.dispose();
		};
	}

	dispose: () => void = () => undefined;

	enter(instant = false) {
		this.state.entered = true;
		this.state.instant = instant;
		if (this.state.ready) this.applyEnter();
	}

	private applyEnter() {
		this.layer.hide(this.state.instant);
		this.cones.activate(this.state.instant);
	}

	private readonly resize = () => {
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.renderer.setSize(w, h);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.composer.setSize(w, h);
		this.cones.resize(this.camera);
		this.front.resize(this.camera);
	};

	private render() {
		const t = (performance.now() - this.clockStart) / 1000;
		const e = this.sectionProgress;
		this.camera.rotation.y += 0.1 * (-0.075 * this.mouse.x - this.camera.rotation.y);
		this.camera.rotation.x += 0.1 * (0.05 * this.mouse.y - this.camera.rotation.x);
		this.cones.update(t, figureTargets(e, this.cones.baseFactor, this.state.mobile), this.renderer);
		this.front.update(t, frontConesOffset(e));
		this.layer.update(t);
		this.composer.render();
	}
}
