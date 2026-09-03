import gsap from "gsap";
import {
	FloatType,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	Matrix4,
	NearestFilter,
	type PerspectiveCamera,
	RGBAFormat,
	ShaderMaterial,
	type Texture,
	Vector2,
	Vector3,
	type WebGLRenderer,
	WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";

import { FIGURE_COUNT, type FigureTargets } from "./choreography";
import { createTetraGeometry, type FigureTextures } from "./figures";
import { DEPTH_FRAGMENT, QUINTIC_IN_OUT, ROTATION_MATRIX, SNOISE3 } from "./glsl";

const N = FIGURE_COUNT;

const SIM_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Figure data lives in one texture, one block of rows per figure: xyz = normalised position, w = particle scale.
const FIGURE_LOOKUP = /* glsl */ `
uniform sampler2D t_data;
vec4 figure(vec2 id, int s) {
	return texture2D(t_data, vec2(id.x, (id.y + float(s)) / ${N.toFixed(1)}));
}
`;

const TARGET = /* glsl */ `
${FIGURE_LOOKUP}
uniform sampler2D t_params;
uniform float u_factor;
uniform float u_length;
uniform float u_show;
uniform float u_explode;
uniform float u_progress;
uniform float u_delay;
varying vec2 vUv;
${QUINTIC_IN_OUT}
float stag(float p, float d, float order) {
	return clamp(p * (1.0 + d * (u_length - 1.0)) - d * order, 0.0, 1.0);
}
// Morph wipes sweep across the destination figure, alternating direction like dala's sorted orders.
float wipeCoord(int s, vec3 q) {
	int m = s % 4;
	if (m == 1) return q.x;
	if (m == 2) return 1.0 - q.x;
	if (m == 3) return 1.0 - q.y;
	return q.y;
}
vec3 targetPos(vec2 uv) {
	vec4 pr = texture2D(t_params, uv);
	vec4 f0 = figure(uv, 0);
	float last = u_length - 1.0;
	float showVal = qinticInOut(stag(u_show, 0.00005, (1.0 - f0.y) * last));
	float radius = mix(u_factor + pr.x * 3.0, u_factor, showVal);
	vec3 pos = f0.xyz - 0.5;
	for (int s = 1; s < ${N}; s++) {
		vec3 dst = figure(uv, s).xyz;
		float p = clamp(u_progress - float(s - 1), 0.0, 1.0);
		pos = mix(pos, dst - 0.5, stag(p, u_delay, wipeCoord(s, dst) * last));
	}
	pos *= 2.0 * radius;
	// Our figures are shallower than dala's brain, so exploded particles travel further along z to leave the same sparse field.
	vec3 burst = pos * vec3(pr.y, pr.y, 1.0 + (pr.y - 1.0) * 1.6);
	return mix(pos, burst, stag(u_explode, 0.00015, f0.y * last));
}
`;

const POSITION_FRAGMENT = /* glsl */ `
${TARGET}
uniform sampler2D t_oPos;
uniform sampler2D t_velocity;
uniform float u_rendered;
void main() {
	vec3 pos = u_rendered > 0.5 ? texture2D(t_oPos, vUv).xyz + texture2D(t_velocity, vUv).xyz : targetPos(vUv);
	gl_FragColor = vec4(pos, 1.0);
}
`;

const VELOCITY_FRAGMENT = /* glsl */ `
${TARGET}
uniform sampler2D t_oPos;
uniform sampler2D t_oVelocity;
uniform float u_spring;
uniform float u_friction;
uniform float u_rendered;
void main() {
	vec3 v = vec3(0.0);
	if (u_rendered > 0.5) {
		vec3 pos = texture2D(t_oPos, vUv).xyz;
		float spring = u_spring + texture2D(t_params, vUv).w;
		v = (texture2D(t_oVelocity, vUv).xyz + (targetPos(vUv) - pos) * spring) * u_friction;
	}
	gl_FragColor = vec4(v, 1.0);
}
`;

const CONE_VERTEX = /* glsl */ `
attribute vec2 a_id;
attribute vec4 a_random;
uniform sampler2D t_simulation;
uniform float u_time;
uniform float u_scale;
uniform float u_amplitude;
uniform float u_explode;
uniform float u_progress;
uniform float u_progress2;
uniform vec2 u_mouse;
uniform vec2 u_delta;
uniform vec2 u_resolution;
uniform vec2 u_resolution2;
uniform vec3 u_offset;
uniform vec3 u_rotation;
varying vec2 v_id;
varying vec3 v_pos;
varying float v_hover;
varying float v_depth;
${FIGURE_LOOKUP}
${ROTATION_MATRIX}
${SNOISE3}
void main() {
	vec3 pos = texture2D(t_simulation, a_id).xyz;

	vec4 mPos = vec4(pos, 1.0);
	mPos *= rotationMatrix(vec3(1.0, 0.0, 0.0), -u_rotation.x);
	mPos *= rotationMatrix(vec3(0.0, 1.0, 0.0), -u_rotation.y);
	mPos *= rotationMatrix(vec3(0.0, 0.0, 1.0), -u_rotation.z);
	mPos.y -= 1.0;
	mPos.xy += u_offset.xy;
	vec2 resolution = mix(u_resolution * 0.5, u_resolution2 * 0.5, clamp(u_progress2, 0.0, 1.0));
	float dist = smoothstep(1.25 + abs(max(u_delta.x, u_delta.y)), 0.0, distance(mPos.xy, u_mouse * resolution));
	float calm = abs(u_explode - 1.0);
	pos.x += dist * sin(u_time * a_random.y) * (a_random.z * 0.35 + u_delta.x) * calm;
	pos.y += dist * cos(u_time * a_random.y) * (a_random.z * 0.35 + u_delta.y) * calm;

	float n = snoise(pos * u_amplitude);
	mat4 spin = rotationMatrix(vec3(0.0, 1.0, 1.0), mod(n + u_time, 6.2832));

	float scale = figure(a_id, 0).w;
	for (int s = 1; s < ${N}; s++) {
		scale = mix(scale, figure(a_id, s).w, clamp(u_progress - float(s - 1), 0.0, 1.0));
	}
	scale = scale * u_scale + dist * 0.75 * calm;

	mat4 im = instanceMatrix;
	im[3].xyz += pos;
	im[0][0] *= scale;
	im[1][1] *= scale;
	im[2][2] *= scale;
	im *= spin;
	vec4 mv = im * vec4(position, 1.0);

	mat4 mvm = modelViewMatrix;
	mvm[3].xy += u_offset.xy;
	mvm *= rotationMatrix(vec3(1.0, 0.0, 0.0), u_rotation.x);
	mvm *= rotationMatrix(vec3(0.0, 1.0, 0.0), u_rotation.y);
	mvm *= rotationMatrix(vec3(0.0, 0.0, 1.0), u_rotation.z);
	mv = mvm * mv;

	v_pos = mv.xyz;
	v_pos.z += 10.0;
	v_depth = -mv.z;
	v_id = a_id;
	v_hover = dist;
	gl_Position = projectionMatrix * mv;
}
`;

const CONE_FRAGMENT = /* glsl */ `
uniform sampler2D t_color;
uniform float u_progress;
uniform float u_explode;
uniform float u_colorFactor;
varying vec2 v_id;
varying vec3 v_pos;
varying float v_hover;
vec3 figureColor(int s) {
	return texture2D(t_color, vec2(v_id.x, (v_id.y + float(s)) / ${N.toFixed(1)})).rgb;
}
void main() {
	vec3 col = figureColor(0);
	for (int s = 1; s < ${N}; s++) {
		col = mix(col, figureColor(s), clamp(u_progress - float(s - 1), 0.0, 1.0));
	}
	col = mix(col, vec3(0.45), max(0.0, v_hover - u_explode) * abs(u_explode - 1.0));
	float alpha = smoothstep(-4.5, 4.0, v_pos.z);
	gl_FragColor = vec4(col * u_colorFactor, alpha);
}
`;

class PingPong {
	read: WebGLRenderTarget;
	write: WebGLRenderTarget;

	constructor(size: number) {
		const opts = {
			depthBuffer: false,
			format: RGBAFormat,
			generateMipmaps: false,
			magFilter: NearestFilter,
			minFilter: NearestFilter,
			stencilBuffer: false,
			type: FloatType,
		};
		this.read = new WebGLRenderTarget(size, size, opts);
		this.write = new WebGLRenderTarget(size, size, opts);
	}

	swap() {
		const t = this.read;
		this.read = this.write;
		this.write = t;
	}

	dispose() {
		this.read.dispose();
		this.write.dispose();
	}
}

export function frustumSize(camera: PerspectiveCamera, distance: number): Vector2 {
	const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance;
	return new Vector2(h * camera.aspect, h);
}

export class Cones {
	readonly group = new Group();
	readonly mesh: InstancedMesh;
	readonly material: ShaderMaterial;
	readonly depthMaterial: ShaderMaterial;
	readonly baseFactor: number;

	private readonly uniforms;
	private readonly pos: PingPong;
	private readonly vel: PingPong;
	private readonly quad = new FullScreenQuad();
	private readonly posMaterial: ShaderMaterial;
	private readonly velMaterial: ShaderMaterial;
	private readonly posInputs = { t_oPos: { value: null as Texture | null }, t_velocity: { value: null as Texture | null } };
	private readonly velInputs = { t_oPos: { value: null as Texture | null }, t_oVelocity: { value: null as Texture | null } };
	private readonly baseRotation = { y: -0.25 * Math.PI };
	private readonly mouseTarget = new Vector2();
	private readonly mousePrev = new Vector2();
	private readonly delta = new Vector2();
	private readonly deltaLimit: number;
	private readonly flags: { rendered: boolean } = { rendered: false };

	constructor(textures: FigureTextures, grid: number, mobile: boolean) {
		const count = grid * grid;
		this.baseFactor = mobile ? 2.5 : 4.35;
		this.deltaLimit = mobile ? 0.1 : 2;
		this.pos = new PingPong(grid);
		this.vel = new PingPong(grid);
		const u = {
			t_color: { value: textures.color as Texture },
			t_data: { value: textures.data as Texture },
			t_params: { value: textures.params as Texture },
			t_simulation: { value: null as Texture | null },
			u_amplitude: { value: 0.619 },
			u_colorFactor: { value: 1.3 },
			u_delay: { value: mobile ? 25e-6 : 5e-4 },
			u_delta: { value: new Vector2() },
			u_explode: { value: 0 },
			u_factor: { value: this.baseFactor },
			u_far: { value: 13 },
			u_length: { value: count },
			u_mouse: { value: new Vector2() },
			u_near: { value: 0.1 },
			u_offset: { value: new Vector3() },
			u_progress: { value: 0 },
			u_progress2: { value: 0 },
			u_rendered: { value: 0 },
			u_resolution: { value: new Vector2(1, 1) },
			u_resolution2: { value: new Vector2(1, 1) },
			u_rotation: { value: new Vector3() },
			u_scale: { value: mobile ? 1.2 : 1.55 },
			u_show: { value: 0 },
			u_time: { value: 0 },
		};
		this.uniforms = u;

		const simUniforms = {
			t_data: u.t_data,
			t_params: u.t_params,
			u_delay: u.u_delay,
			u_explode: u.u_explode,
			u_factor: u.u_factor,
			u_length: u.u_length,
			u_progress: u.u_progress,
			u_rendered: u.u_rendered,
			u_show: u.u_show,
		};
		this.posMaterial = new ShaderMaterial({
			fragmentShader: POSITION_FRAGMENT,
			uniforms: { ...simUniforms, ...this.posInputs },
			vertexShader: SIM_VERTEX,
		});
		this.velMaterial = new ShaderMaterial({
			fragmentShader: VELOCITY_FRAGMENT,
			uniforms: { ...simUniforms, ...this.velInputs, u_friction: { value: 0.892 }, u_spring: { value: 0.006 } },
			vertexShader: SIM_VERTEX,
		});

		this.material = new ShaderMaterial({ fragmentShader: CONE_FRAGMENT, transparent: true, uniforms: u, vertexShader: CONE_VERTEX });
		this.depthMaterial = new ShaderMaterial({ fragmentShader: DEPTH_FRAGMENT, transparent: true, uniforms: u, vertexShader: CONE_VERTEX });

		const geometry = createTetraGeometry();
		const ids = new Float32Array(count * 2);
		const random = new Float32Array(count * 4);
		for (let i = 0; i < count; i += 1) {
			ids[i * 2] = ((i % grid) + 0.5) / grid;
			ids[i * 2 + 1] = (Math.floor(i / grid) + 0.5) / grid;
			random[i * 4] = i % 2 === 0 ? Math.random() : -Math.random();
			random[i * 4 + 1] = 0.8 * Math.random() + 0.2;
			random[i * 4 + 2] = mobile ? 0.5 * Math.random() : 0.5 * Math.random() + 0.5;
			random[i * 4 + 3] = 0;
		}
		geometry.setAttribute("a_id", new InstancedBufferAttribute(ids, 2));
		geometry.setAttribute("a_random", new InstancedBufferAttribute(random, 4));

		this.mesh = new InstancedMesh(geometry, this.material, count);
		const base = new Matrix4().makeScale(0.1, 0.1, 0.1);
		for (let i = 0; i < count; i += 1) this.mesh.setMatrixAt(i, base);
		this.mesh.frustumCulled = false;
		this.mesh.userData.depthMaterial = this.depthMaterial;
		this.group.add(this.mesh);
		this.group.position.set(0, -1.19, 0);
		this.group.rotation.y = this.baseRotation.y;
	}

	resize(camera: PerspectiveCamera) {
		this.uniforms.u_resolution.value.copy(frustumSize(camera, 10));
		this.uniforms.u_resolution2.value.copy(frustumSize(camera, 6.5));
	}

	activate(instant = false) {
		gsap.killTweensOf([this.uniforms.u_show, this.baseRotation]);
		if (instant) {
			this.uniforms.u_show.value = 1;
			this.baseRotation.y = 0;
			return;
		}
		gsap.to(this.uniforms.u_show, { duration: 3, ease: "none", value: 1 });
		gsap.to(this.baseRotation, { duration: 3, ease: "power2.out", y: 0 });
	}

	onPointerDown(m: Vector2) {
		this.mouseTarget.copy(m);
		this.mousePrev.copy(m);
		this.delta.set(0, 0);
	}

	onPointerMove(m: Vector2) {
		this.mouseTarget.copy(m);
		const limit = this.deltaLimit;
		this.delta.set(Math.min(limit, Math.max(-limit, 50 * (m.x - this.mousePrev.x))), Math.min(limit, Math.max(-limit, 50 * (m.y - this.mousePrev.y))));
		this.mousePrev.copy(m);
	}

	onPointerLeave() {
		this.delta.set(0, 0);
	}

	update(t: number, target: FigureTargets, renderer: WebGLRenderer) {
		const u = this.uniforms;
		u.u_time.value = t;

		const rot = u.u_rotation.value;
		rot.x += (0 - rot.x) * 0.075;
		rot.y += (target.rotY - rot.y) * 0.075;
		rot.z += (target.rotZ - rot.z) * 0.075;
		this.group.rotation.y = this.baseRotation.y;

		this.delta.multiplyScalar(0.9);
		u.u_mouse.value.lerp(this.mouseTarget, 0.075);
		u.u_delta.value.lerp(this.delta, 0.075);

		u.u_explode.value += (target.explode - u.u_explode.value) * 0.1;
		u.u_factor.value += (target.factor - u.u_factor.value) * 0.1;
		u.u_progress.value += (target.progress - u.u_progress.value) * 0.1;
		u.u_progress2.value += (target.progress2 - u.u_progress2.value) * 0.1;
		u.u_offset.value.x += (target.x - u.u_offset.value.x) * 0.1;
		u.u_offset.value.y += (target.y - u.u_offset.value.y) * 0.1;

		this.step(renderer);
	}

	private step(renderer: WebGLRenderer) {
		const previous = renderer.getRenderTarget();
		if (this.flags.rendered) {
			this.velInputs.t_oPos.value = this.pos.read.texture;
			this.velInputs.t_oVelocity.value = this.vel.read.texture;
			this.pass(renderer, this.velMaterial, this.vel);
			this.posInputs.t_oPos.value = this.pos.read.texture;
			this.posInputs.t_velocity.value = this.vel.read.texture;
			this.pass(renderer, this.posMaterial, this.pos);
		} else {
			this.pass(renderer, this.posMaterial, this.pos);
			this.pass(renderer, this.velMaterial, this.vel);
			this.uniforms.u_rendered.value = 1;
			this.flags.rendered = true;
		}
		this.uniforms.t_simulation.value = this.pos.read.texture;
		renderer.setRenderTarget(previous);
	}

	private pass(renderer: WebGLRenderer, material: ShaderMaterial, buffer: PingPong) {
		this.quad.material = material;
		renderer.setRenderTarget(buffer.write);
		this.quad.render(renderer);
		buffer.swap();
	}

	dispose() {
		gsap.killTweensOf([this.uniforms.u_show, this.baseRotation]);
		this.mesh.geometry.dispose();
		this.material.dispose();
		this.depthMaterial.dispose();
		this.posMaterial.dispose();
		this.velMaterial.dispose();
		this.pos.dispose();
		this.vel.dispose();
		this.quad.dispose();
	}
}
