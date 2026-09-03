import { siHtml5, siJavascript, siNodedotjs, siPython, siReact, siTypescript } from "simple-icons";
import { BufferAttribute, BufferGeometry, DataTexture, FloatType, NearestFilter, RGBAFormat } from "three";

import { FIGURE_COUNT } from "./choreography";

// Wireframe tetrahedron built from six square-section beams: 20 vertices, 48 triangles.
const TETRA_POS = new Float32Array([
	0.0002, 0.6776, 0, -0.0002, 0.8276, 0, 0.2973, -0.2238, 0.4425, 0.3717, -0.278, 0.561, 0.2973, -0.2238, -0.4425, 0.3717, -0.278, -0.561, -0.5985, -0.2253, 0, -0.7395,
	-0.2764, 0, 0.0553, 0.5866, 0, 0.3108, -0.1797, 0.3832, 0.3108, -0.1797, -0.3832, -0.0242, 0.6004, -0.0386, 0.2355, -0.179, -0.4283, -0.5438, -0.179, -0.0386,
	-0.0242, 0.6004, 0.0386, -0.5438, -0.179, 0.0386, 0.2355, -0.179, 0.4283, -0.5013, -0.2509, 0, 0.2595, -0.2509, -0.3804, 0.2595, -0.2509, 0.3804,
]);
const TETRA_IDX = new Uint16Array([
	8, 9, 2, 8, 2, 0, 9, 8, 1, 9, 1, 3, 9, 10, 4, 9, 4, 2, 10, 9, 3, 10, 3, 5, 10, 8, 0, 10, 0, 4, 8, 10, 5, 8, 5, 1, 11, 12, 4, 11, 4, 0, 12, 11, 1, 12, 1, 5, 12, 13, 6,
	12, 6, 4, 13, 12, 5, 13, 5, 7, 13, 11, 0, 13, 0, 6, 11, 13, 7, 11, 7, 1, 14, 15, 6, 14, 6, 0, 15, 14, 1, 15, 1, 7, 15, 16, 2, 15, 2, 6, 16, 15, 7, 16, 7, 3, 16, 14,
	0, 16, 0, 2, 14, 16, 3, 14, 3, 1, 17, 18, 4, 17, 4, 6, 18, 17, 7, 18, 7, 5, 18, 19, 2, 18, 2, 4, 19, 18, 5, 19, 5, 3, 19, 17, 6, 19, 6, 2, 17, 19, 3, 17, 3, 7,
]);

export function createTetraGeometry(): BufferGeometry {
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(TETRA_POS, 3));
	geometry.setIndex(new BufferAttribute(TETRA_IDX, 1));
	return geometry;
}

type Pt = [number, number, number];
type Inside = (x: number, y: number, z: number) => boolean;
type Rgb = [number, number, number];
type Mask = (u: number, v: number) => boolean;

const ORIGIN: Pt = [0.5, 0.5, 0.5];

function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = arr[i];
		const b = arr[j];
		if (a !== undefined && b !== undefined) {
			arr[i] = b;
			arr[j] = a;
		}
	}
	return arr;
}

// Regular cubic lattice intersected with a solid's surface: one cell thick, evenly spaced.
function voxelShell(inside: Inside, h: number, lo: Pt, hi: Pt): Pt[] {
	const pts: Pt[] = [];
	for (let x = lo[0] + h / 2; x < hi[0]; x += h) {
		for (let y = lo[1] + h / 2; y < hi[1]; y += h) {
			for (let z = lo[2] + h / 2; z < hi[2]; z += h) {
				if (!inside(x, y, z)) continue;
				const buried = inside(x + h, y, z) && inside(x - h, y, z) && inside(x, y + h, z) && inside(x, y - h, z) && inside(x, y, z + h) && inside(x, y, z - h);
				if (!buried) pts.push([x, y, z]);
			}
		}
	}
	return pts;
}

function fitShell(inside: Inside, lo: Pt, hi: Pt, h0: number, count: number): Pt[] {
	let h = h0;
	let pts = voxelShell(inside, h, lo, hi);
	for (let i = 0; i < 6 && (pts.length < count || pts.length > count * 1.12); i += 1) {
		const ratio = pts.length ? Math.sqrt(pts.length / count) : 0.5;
		h *= pts.length < count ? ratio * 0.985 : ratio;
		pts = voxelShell(inside, h, lo, hi);
	}
	shuffle(pts);
	while (pts.length < count) {
		const p = pts[Math.floor(Math.random() * pts.length)] ?? ORIGIN;
		pts.push([p[0] + (Math.random() - 0.5) * h, p[1] + (Math.random() - 0.5) * h, p[2] + (Math.random() - 0.5) * h]);
	}
	return pts.slice(0, count);
}

// Trefoil knot, the (2,3) torus knot: x = sin t + 2sin 2t, y = cos t - 2cos 2t, z = -sin 3t.
const KNOT_SAMPLES = 4000;
const KNOT_GRID = 128;
const KNOT_TUBE = 0.048;
const KNOT_FIT = 0.33;
// Sits above the box centre so the knot frames like the bust's head did, rather than
// hanging off the bottom of the viewport.
const KNOT_CENTER: Pt = [0.5, 0.6, 0.5];

// The curve is stamped once into a coarse occupancy grid, so the lattice sampler gets O(1)
// lookups. Testing each voxel against the curve directly is ~600M distance checks and stalls
// scene init; this builds in a few ms and the grid is dropped once the shell is extracted.
function knotInside(): Inside {
	const n = KNOT_GRID;
	const grid = new Uint8Array(n * n * n);
	const curve: Pt[] = [];
	for (let i = 0; i < KNOT_SAMPLES; i += 1) {
		const t = (i / KNOT_SAMPLES) * 2 * Math.PI;
		curve.push([Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t), -Math.sin(3 * t)]);
	}
	let extent = 0;
	for (const p of curve) extent = Math.max(extent, Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2]));
	const scale = KNOT_FIT / extent;
	const radius = Math.ceil(KNOT_TUBE * n);
	for (const p of curve) {
		const cx = Math.floor((p[0] * scale + KNOT_CENTER[0]) * n);
		const cy = Math.floor((p[1] * scale + KNOT_CENTER[1]) * n);
		const cz = Math.floor((p[2] * scale + KNOT_CENTER[2]) * n);
		for (let i = -radius; i <= radius; i += 1) {
			for (let j = -radius; j <= radius; j += 1) {
				for (let k = -radius; k <= radius; k += 1) {
					if (i * i + j * j + k * k > radius * radius) continue;
					const x = cx + i;
					const y = cy + j;
					const z = cz + k;
					if (x < 0 || y < 0 || z < 0 || x >= n || y >= n || z >= n) continue;
					grid[(x * n + y) * n + z] = 1;
				}
			}
		}
	}
	return (x, y, z) => {
		const gx = Math.floor(x * n);
		const gy = Math.floor(y * n);
		const gz = Math.floor(z * n);
		if (gx < 0 || gy < 0 || gz < 0 || gx >= n || gy >= n || gz >= n) return false;
		return grid[(gx * n + gy) * n + gz] === 1;
	};
}

function glyphCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
	const s = 256;
	const canvas = document.createElement("canvas");
	canvas.width = s;
	canvas.height = s;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return null;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, s, s);
	ctx.fillStyle = "#fff";
	return [canvas, ctx];
}

function maskFrom(ctx: CanvasRenderingContext2D, s: number): Mask {
	const { data } = ctx.getImageData(0, 0, s, s);
	return (u, v) => {
		const px = Math.floor(u * s);
		const py = Math.floor((1 - v) * s);
		if (px < 0 || py < 0 || px >= s || py >= s) return false;
		return (data[(py * s + px) * 4] ?? 0) > 100;
	};
}

// Renders an SVG path (given its viewBox size and an optional pre-transform) into a centred silhouette mask.
function pathMask(d: string, viewW: number, viewH: number, fit: number, transform?: [number, number, number, number, number, number]): Mask {
	const made = glyphCanvas();
	if (!made) return () => false;
	const [canvas, ctx] = made;
	const s = canvas.width;
	const scale = (s * fit) / Math.max(viewW, viewH);
	ctx.translate(s / 2 - (viewW * scale) / 2, s / 2 - (viewH * scale) / 2);
	ctx.scale(scale, scale);
	if (transform) ctx.transform(...transform);
	ctx.fill(new Path2D(d));
	return maskFrom(ctx, s);
}

function extruded(mask: Mask, depth: number, inset = 0.08): Inside {
	const span = 1 - 2 * inset;
	return (x, y, z) => Math.abs(z - 0.5) <= depth && mask((x - inset) / span, (y - inset) / span);
}

// Shared glyph path of public/logo/m.svg (viewBox 392×470), which offsets it by (5, 5). Keep the two in sync.
const MARK_PATH = "M25 435L25 25L191 262L357 25L357 435L303 435L303 189L191 349L79 189L79 435Z";

// The MM mark as nav.tsx draws it: two identical M glyphs in square boxes, the second overlapping the first by 12/56 of a box.
function markMask(): Mask {
	const made = glyphCanvas();
	if (!made) return () => false;
	const [canvas, ctx] = made;
	const s = canvas.width;
	const overlap = 12 / 56;
	const box = (s * 0.98) / (2 - overlap);
	const scale = box / 470;
	const x0 = (s - box * (2 - overlap)) / 2;
	const y0 = (s - box) / 2;
	const glyph = (bx: number, transform: [number, number, number, number, number, number]) => {
		ctx.save();
		ctx.translate(bx + (box - 392 * scale) / 2, y0);
		ctx.scale(scale, scale);
		ctx.transform(...transform);
		ctx.fill(new Path2D(MARK_PATH));
		ctx.restore();
	};
	glyph(x0, [1, 0, 0, 1, 5, 5]);
	glyph(x0 + box * (1 - overlap), [1, 0, 0, 1, 5, 5]);
	return maskFrom(ctx, s);
}

const LOGOS = [siTypescript, siJavascript, siHtml5, siPython, siReact, siNodedotjs];

function buildFigures(count: number): Pt[][] {
	const glyphBounds: [Pt, Pt] = [
		[0.08, 0.06, 0.42],
		[0.92, 0.94, 0.58],
	];
	return [
		fitShell(knotInside(), [0.14, 0.20, 0.32], [0.86, 1, 0.68], 0.013, count),
		...LOGOS.map((icon) => fitShell(extruded(pathMask(icon.path, 24, 24, 0.82), 0.07), glyphBounds[0], glyphBounds[1], 0.01, count)),
		fitShell(extruded(markMask(), 0.09, 0), [0, 0, 0.4], [1, 1, 0.6], 0.01, count),
	];
}

type Weighted = [string, number][];

const LAVENDERS: Weighted = [
	["#b1a0b6", 55],
	["#a99bb1", 25],
	["#7f939c", 10],
	["#b19fb6", 10],
];
const ACCENTS: Weighted = [
	["#00755c", 22],
	["#a6597b", 16],
	["#8433a8", 15],
	["#640ab8", 14],
	["#36598e", 12],
	["#3c24ab", 11],
	["#607e74", 10],
	["#c88d00", 20],
];
const MARK_STOPS: [number, string][] = [
	[0, "#a86b42"],
	[0.3, "#884c0d"],
	[0.55, "#692d7c"],
	[0.8, "#441470"],
	[1, "#1e4584"],
];

function hex(c: string): Rgb {
	const h = c.startsWith("#") ? c.slice(1) : c;
	return [Number.parseInt(h.slice(0, 2), 16) / 255, Number.parseInt(h.slice(2, 4), 16) / 255, Number.parseInt(h.slice(4, 6), 16) / 255];
}

function weightedPicker(palette: Weighted): () => Rgb {
	const colors = palette.map(([c]) => hex(c));
	const total = palette.reduce((sum, [, w]) => sum + w, 0);
	const fallback = colors[0] ?? [1, 1, 1];
	return () => {
		let r = Math.random() * total;
		for (let i = 0; i < palette.length; i += 1) {
			r -= palette[i]?.[1] ?? 0;
			if (r <= 0) return colors[i] ?? fallback;
		}
		return fallback;
	};
}

const pickLavender = weightedPicker(LAVENDERS);
const pickAccent = weightedPicker(ACCENTS);

function gradient(stops: [number, string][], t: number): Rgb {
	for (let i = 1; i < stops.length; i += 1) {
		const prev = stops[i - 1];
		const next = stops[i];
		if (prev && next && t <= next[0]) {
			const a = hex(prev[1]);
			const b = hex(next[1]);
			const k = (t - prev[0]) / (next[0] - prev[0]);
			return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
		}
	}
	return hex(stops.at(-1)?.[1] ?? "#ffffff");
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Violet through indigo to amber, so the tube reads as one continuous ramp against the black.
const KNOT_STOPS: [number, string][] = [
	[0, "#2a1b6e"],
	[0.3, "#3c24ab"],
	[0.55, "#8433a8"],
	[0.8, "#c88d00"],
	[1, "#e8d3a4"],
];

// Ramp along the knot's height, with occasional lavender and accent specks so the tube keeps
// the same grain as the logo figures rather than reading as a flat gradient.
function knotColor(p: Pt): Rgb {
	const r = Math.random();
	if (r < 0.13) return pickLavender();
	if (r < 0.19) return pickAccent();
	return gradient(KNOT_STOPS, clamp01((p[1] - 0.22) / 0.76));
}

function brandColor(hexColor: string): () => Rgb {
	const brand = hex(hexColor);
	return () => {
		const r = Math.random();
		if (r < 0.65) return brand;
		if (r < 0.85) return pickLavender();
		return pickAccent();
	};
}

// Only a share of each figure renders at full size; the rest become dust specks, the way dala's globe hides its ocean.
const VISIBLE_SHARE = [0.62, ...LOGOS.map(() => 0.45), 0.45];
const dust = () => 0.03 + 0.05 * Math.random();
const bigScale = (s: number) => (s === 0 ? 0.2 + 0.15 * (Math.random() + Math.random()) : 0.34 + 0.16 * Math.random());

function texture(data: Float32Array, width: number, height: number): DataTexture {
	const tex = new DataTexture(data, width, height, RGBAFormat, FloatType);
	tex.minFilter = NearestFilter;
	tex.magFilter = NearestFilter;
	tex.generateMipmaps = false;
	tex.needsUpdate = true;
	return tex;
}

export interface FigureTextures {
	color: DataTexture;
	data: DataTexture;
	params: DataTexture;
}

export function buildFigureTextures(grid: number): FigureTextures {
	const count = grid * grid;
	const figures = buildFigures(count);
	const colorOf: ((p: Pt) => Rgb)[] = [knotColor, ...LOGOS.map((icon) => brandColor(icon.hex)), (p) => gradient(MARK_STOPS, clamp01((p[1] - 0.06) / 0.88))];
	const data = new Float32Array(count * FIGURE_COUNT * 4);
	const color = new Float32Array(count * FIGURE_COUNT * 4);
	for (let s = 0; s < FIGURE_COUNT; s += 1) {
		const pts = figures[s] ?? [];
		const paint = colorOf[s] ?? (() => pickLavender());
		const share = VISIBLE_SHARE[s] ?? 0.5;
		for (let i = 0; i < count; i += 1) {
			const p = pts[i] ?? ORIGIN;
			const k = (s * count + i) * 4;
			data[k] = p[0];
			data[k + 1] = p[1];
			data[k + 2] = p[2];
			data[k + 3] = Math.random() < share ? bigScale(s) : dust();
			const [r, g, b] = paint(p);
			color[k] = r;
			color[k + 1] = g;
			color[k + 2] = b;
			color[k + 3] = 1;
		}
	}
	// x: reveal radius jitter, y: explode factor, w: per-particle spring offset
	const params = new Float32Array(count * 4);
	for (let i = 0; i < count; i += 1) {
		const k = i * 4;
		params[k] = i % 2 === 0 ? Math.random() : -Math.random();
		params[k + 1] = 1 + 5 * Math.random();
		params[k + 2] = 0;
		params[k + 3] = 2e-4 * Math.random() - 1e-4;
	}
	return {
		color: texture(color, grid, grid * FIGURE_COUNT),
		data: texture(data, grid, grid * FIGURE_COUNT),
		params: texture(params, grid, grid),
	};
}
