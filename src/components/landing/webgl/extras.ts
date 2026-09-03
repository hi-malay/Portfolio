import gsap from "gsap";
import {
	BufferAttribute,
	BufferGeometry,
	Color,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	type IUniform,
	LinearFilter,
	type Material,
	Matrix4,
	Mesh,
	type PerspectiveCamera,
	Quaternion,
	type Scene,
	ShaderMaterial,
	type Texture,
	UniformsUtils,
	Vector2,
	Vector3,
	type WebGLRenderer,
	WebGLRenderTarget,
} from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { BokehShader } from "three/examples/jsm/shaders/BokehShader2.js";
import { frustumSize } from "./cones";
import { createTetraGeometry } from "./figures";
import { DEPTH_FRAGMENT, ROTATION_MATRIX } from "./glsl";

const FRONT_VERTEX = /* glsl */ `
attribute vec4 a_param;
attribute vec4 a_angle;
attribute vec4 a_color;
uniform float u_time;
uniform float u_scale;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec4 v_color;
varying float v_depth;
${ROTATION_MATRIX}
float map(float value, float min1, float max1, float min2, float max2) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
void main() {
	mat4 rotMat = rotationMatrix(a_angle.xyz, mod(a_angle.w * u_time * 0.15, 3.1416 * 2.0));
	v_color = a_color;
	mat4 im = instanceMatrix;
	float zFactor = map(im[3][2], 0.0, 9.0, 0.5, 0.2);
	im[3][0] = im[3][0] * u_resolution.x * zFactor - u_mouse.x * a_param.x + sin(u_time * a_param.w * 0.5) * a_param.y * 0.15;
	im[3][1] = im[3][1] * u_resolution.y * zFactor - u_mouse.y * a_param.x + cos(u_time * a_param.w * 0.5) * a_param.z * 0.15;
	im[0][0] *= u_scale;
	im[1][1] *= u_scale;
	im[2][2] *= u_scale;
	im *= rotMat;
	vec4 mv = modelViewMatrix * im * vec4(position, 1.0);
	v_depth = -mv.z;
	gl_Position = projectionMatrix * mv;
}
`;

const FRONT_FRAGMENT = /* glsl */ `
varying vec4 v_color;
void main() {
	gl_FragColor = vec4(v_color.rgb, v_color.a);
}
`;

const FRONT_COLORS: [number, number, number][] = [
	[93, 57, 154],
	[186, 136, 43],
	[40, 116, 100],
	[164, 148, 175],
];
const FRONT_COUNT = 250;

export class FrontCones {
	readonly group = new Group();
	private readonly mesh: InstancedMesh;
	private readonly material: ShaderMaterial;
	private readonly depthMaterial: ShaderMaterial;
	private readonly uniforms = {
		u_far: { value: 13 },
		u_mouse: { value: new Vector2() },
		u_near: { value: 0.1 },
		u_resolution: { value: new Vector2(1, 1) },
		u_scale: { value: 1 },
		u_time: { value: 0 },
	};
	private readonly mouseTarget = new Vector2();
	private baseX = 0;

	constructor(mobile: boolean) {
		this.material = new ShaderMaterial({ fragmentShader: FRONT_FRAGMENT, transparent: true, uniforms: this.uniforms, vertexShader: FRONT_VERTEX });
		this.depthMaterial = new ShaderMaterial({ fragmentShader: DEPTH_FRAGMENT, transparent: true, uniforms: this.uniforms, vertexShader: FRONT_VERTEX });
		const geometry = createTetraGeometry();
		const color = new Float32Array(FRONT_COUNT * 4);
		const angle = new Float32Array(FRONT_COUNT * 4);
		const param = new Float32Array(FRONT_COUNT * 4);
		this.mesh = new InstancedMesh(geometry, this.material, FRONT_COUNT);
		const m = new Matrix4();
		const q = new Quaternion();
		const size = mobile ? 0.05 : 0.075;
		for (let i = 0; i < FRONT_COUNT; i += 1) {
			m.compose(new Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 9 * Math.random()), q, new Vector3(size, size, size));
			this.mesh.setMatrixAt(i, m);
			const c = FRONT_COLORS[i % 4] ?? [255, 255, 255];
			color[i * 4] = c[0] / 255;
			color[i * 4 + 1] = c[1] / 255;
			color[i * 4 + 2] = c[2] / 255;
			color[i * 4 + 3] = Math.random();
			angle[i * 4] = 2 * Math.random() - 1;
			angle[i * 4 + 1] = 2 * Math.random() - 1;
			angle[i * 4 + 2] = 2 * Math.random() - 1;
			angle[i * 4 + 3] = 2 * Math.random() - Math.PI;
			param[i * 4] = Math.random();
			param[i * 4 + 1] = Math.random();
			param[i * 4 + 2] = Math.random();
			param[i * 4 + 3] = Math.random();
		}
		geometry.setAttribute("a_color", new InstancedBufferAttribute(color, 4));
		geometry.setAttribute("a_angle", new InstancedBufferAttribute(angle, 4));
		geometry.setAttribute("a_param", new InstancedBufferAttribute(param, 4));
		this.mesh.frustumCulled = false;
		this.mesh.userData.depthMaterial = this.depthMaterial;
		this.group.add(this.mesh);
		this.group.position.set(0, 0, 0.1);
	}

	resize(camera: PerspectiveCamera) {
		this.uniforms.u_resolution.value.copy(frustumSize(camera, 9.9));
	}

	onPointerMove(m: Vector2) {
		this.mouseTarget.copy(m);
	}

	update(t: number, offsetX: number) {
		this.uniforms.u_time.value = t;
		const mouse = this.uniforms.u_mouse.value;
		mouse.x += (0.25 * this.mouseTarget.x - mouse.x) * 0.1;
		mouse.y += (0.25 * this.mouseTarget.y - mouse.y) * 0.1;
		this.baseX = offsetX;
		this.group.position.x += (this.baseX - this.group.position.x) * 0.1;
	}

	dispose() {
		this.mesh.geometry.dispose();
		this.material.dispose();
		this.depthMaterial.dispose();
	}
}

const GRAIN_FRAGMENT = /* glsl */ `
uniform float u_show;
uniform float u_bright;
uniform float u_alpha;
uniform float u_scale;
uniform float u_time;
varying vec2 vUv;
float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float pattern() {
	float s = sin(0.5);
	float c = cos(0.5);
	vec2 center = vec2(random(vUv + u_time));
	vec2 tex = vUv * vec2(4096.0, 4096.0) * u_scale - center;
	vec2 point = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y);
	return (sin(point.x) * sin(point.y)) * 4.0;
}
void main() {
	float dist = distance(vec2(0.5), vUv) * 2.0;
	vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
	float pat = pattern();
	vec4 grain = vec4(pat, pat, pat, u_alpha);
	grain.rgb *= u_bright;
	gl_FragColor = mix(grain, black, smoothstep(u_show - 0.1, u_show + 0.1, dist));
}
`;

export class GrainLayer {
	readonly mesh: Mesh;
	private readonly uniforms;

	constructor(retina: boolean) {
		this.uniforms = {
			u_alpha: { value: retina ? 0.138 : 0.149 },
			u_bright: { value: retina ? 0.185 : 0.252 },
			u_scale: { value: retina ? 1.072 : 1.366 },
			u_show: { value: 0 },
			u_time: { value: 0 },
		};
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new BufferAttribute(new Float32Array([-0.5, -0.5, 0, 1.5, -0.5, 0, -0.5, 1.5, 0]), 3));
		geometry.setAttribute("uv", new BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
		const material = new ShaderMaterial({
			depthTest: false,
			depthWrite: false,
			fragmentShader: GRAIN_FRAGMENT,
			transparent: true,
			uniforms: this.uniforms,
			vertexShader: /* glsl */ `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
		});
		this.mesh = new Mesh(geometry, material);
		this.mesh.position.set(0, 0, 9.6);
		this.mesh.renderOrder = 10;
		this.mesh.frustumCulled = false;
	}

	hide(instant = false) {
		gsap.killTweensOf(this.uniforms.u_show);
		if (instant) {
			this.uniforms.u_show.value = 1;
			return;
		}
		gsap.to(this.uniforms.u_show, { duration: 2, ease: "power2.inOut", value: 1 });
	}

	update(t: number) {
		this.uniforms.u_time.value = t;
	}

	dispose() {
		gsap.killTweensOf(this.uniforms.u_show);
		this.mesh.geometry.dispose();
		(this.mesh.material as Material).dispose();
	}
}

// Bokeh DOF fed by a custom depth pass: objects carrying userData.depthMaterial render with it, everything else is skipped.
export class DepthBokehPass extends Pass {
	private readonly depthTarget: WebGLRenderTarget;
	private readonly material: ShaderMaterial;
	private readonly quad: FullScreenQuad;
	private readonly clearColor = new Color();
	private readonly tColor: { value: Texture | null };
	private readonly size: { height: { value: number }; width: { value: number } };
	private readonly scene: Scene;
	private readonly camera: PerspectiveCamera;

	constructor(scene: Scene, camera: PerspectiveCamera, width: number, height: number) {
		super();
		this.scene = scene;
		this.camera = camera;
		this.depthTarget = new WebGLRenderTarget(width, height, { magFilter: LinearFilter, minFilter: LinearFilter });
		const uniforms = UniformsUtils.clone(BokehShader.uniforms as unknown as Record<string, IUniform>);
		const values: Record<string, number> = {
			bias: 0,
			depthblur: 0,
			dithering: 0.0001,
			focalDepth: 0.125,
			focalLength: 27,
			fringe: 0.7,
			fstop: 2509,
			gain: 0,
			manualdof: 0,
			maxblur: 10,
			noise: 1,
			pentagon: 0,
			shaderFocus: 0,
			showFocus: 0,
			textureHeight: height,
			textureWidth: width,
			threshold: 0.5,
			vignetting: 0,
			zfar: camera.far,
			znear: camera.near,
		};
		for (const [key, value] of Object.entries(values)) {
			const u = uniforms[key];
			if (u) u.value = value;
		}
		uniforms.tDepth = { value: this.depthTarget.texture };
		this.tColor = { value: null };
		uniforms.tColor = this.tColor;
		this.size = { height: { value: height }, width: { value: width } };
		uniforms.textureWidth = this.size.width;
		uniforms.textureHeight = this.size.height;
		this.material = new ShaderMaterial({
			defines: { RINGS: 4, SAMPLES: 6 },
			fragmentShader: BokehShader.fragmentShader,
			uniforms,
			vertexShader: BokehShader.vertexShader,
		});
		this.quad = new FullScreenQuad(this.material);
		this.needsSwap = true;
	}

	override render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
		const restore: [Mesh, Material | Material[], boolean][] = [];
		this.scene.traverse((object) => {
			if (!("isMesh" in object)) {
				return;
			}
			const mesh = object as Mesh;
			restore.push([mesh, mesh.material, mesh.visible]);
			const depthMaterial = mesh.userData.depthMaterial as Material | undefined;
			if (depthMaterial) {
				mesh.material = depthMaterial;
			} else {
				mesh.visible = false;
			}
		});
		renderer.getClearColor(this.clearColor);
		const clearAlpha = renderer.getClearAlpha();
		const { autoClear } = renderer;
		renderer.autoClear = false;
		renderer.setClearColor(0x00_00_00, 1);
		renderer.setRenderTarget(this.depthTarget);
		renderer.clear();
		renderer.render(this.scene, this.camera);
		for (const [mesh, material, visible] of restore) {
			mesh.material = material;
			mesh.visible = visible;
		}
		this.tColor.value = readBuffer.texture;
		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
		} else {
			renderer.setRenderTarget(writeBuffer);
			renderer.clear();
		}
		this.quad.render(renderer);
		renderer.setClearColor(this.clearColor, clearAlpha);
		renderer.autoClear = autoClear;
	}

	override setSize(width: number, height: number) {
		this.depthTarget.setSize(width, height);
		this.size.width.value = width;
		this.size.height.value = height;
	}

	override dispose() {
		this.depthTarget.dispose();
		this.material.dispose();
		this.quad.dispose();
	}
}
