const { PI } = Math;
const HALF = PI / 2;
const QUARTER = PI / 4;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const map = (v: number, a: number, b: number, c: number, d: number) => ((v - a) / (b - a)) * (d - c) + c;
const ramp = (e: number, a: number, b: number) => clamp(map(e, a, b, 0, 1), 0, 1);

export interface FigureTargets {
	explode: number;
	factor: number;
	progress: number;
	progress2: number;
	rotY: number;
	rotZ: number;
	x: number;
	y: number;
}

// Figure index advances through: head → TypeScript → JavaScript → HTML5 → Python → React → Node.js → mark.
const MORPHS: [number, number][] = [
	[2.7, 3],
	[3.3, 3.5],
	[3.65, 3.75],
	[3.9, 4],
	[4.15, 4.25],
	[4.35, 4.45],
	[5.7, 6],
];
const MORPHS_MOBILE: [number, number][] = [
	[2.7, 3],
	[3.3, 3.5],
	[3.65, 3.75],
	[3.9, 4],
	[4.15, 4.25],
	[4.35, 4.45],
	[5.7, 5.8],
];

export const FIGURE_COUNT = MORPHS.length + 1;

// Section progress `e` = stage index + fraction scrolled through that stage.
export function figureTargets(e: number, baseFactor: number, mobile: boolean): FigureTargets {
	const yawEnd = mobile ? 5.8 : 6;
	const rotY =
		clamp(map(e, 0, 1, 0, -HALF), -HALF, 0) +
		clamp(map(e, 2.7, 3, 0, HALF), 0, HALF) +
		clamp(map(e, 3.3, 3.5, 0, QUARTER), 0, QUARTER) -
		clamp(map(e, 4.5, 5, 0, 1.25 * PI), 0, 1.25 * PI) +
		clamp(map(e, 5.7, yawEnd, 0, PI), 0, PI);
	const rotZ = clamp(map(e, 2.7, 3, 0, -0.489), -0.489, 0) + clamp(map(e, 3.3, 3.5, 0, 0.6), 0, 0.6);
	const progress = (mobile ? MORPHS_MOBILE : MORPHS).reduce((sum, [a, b]) => sum + ramp(e, a, b), 0);

	if (mobile) {
		return {
			explode: ramp(e, 1.4, 1.7) - ramp(e, 2.7, 3) + ramp(e, 4.5, 5) - ramp(e, 5.7, 5.8),
			factor: baseFactor,
			progress,
			progress2: 0,
			rotY,
			rotZ,
			x: clamp(map(e, 0, 1, 0.8, 0), 0, 0.8),
			y: 2.6,
		};
	}

	return {
		explode: ramp(e, 1.1, 2.2) - ramp(e, 2.8, 3) + ramp(e, 4.5, 5) - ramp(e, 5.7, 6),
		factor: baseFactor + ramp(e, 0, 1) - ramp(e, 1.25, 1.5) + clamp(map(e, 3.3, 3.5, 0, 0.3), 0, 0.3) - 0.4 * ramp(e, 5.7, 6),
		progress,
		progress2: ramp(e, 0, 1) - ramp(e, 2.7, 3) + ramp(e, 3, 3.5) - (e < 5.5 ? 0 : 1),
		rotY,
		rotZ,
		x:
			clamp(map(e, 0, 1, 3, -4.5), -4.5, 3) +
			clamp(map(e, 1.25, 1.5, 0.905, 5), 0.905, 5) -
			clamp(map(e, 2.8, 3, 0.905, 3), 0.905, 3) +
			clamp(map(e, 3.3, 3.5, 0.905, 6), 0.905, 6) -
			clamp(map(e, 4.5, 5, 0.905, 5), 0.905, 4),
		y: clamp(map(e, 2.7, 3, 0, 0.5), 0, 0.5) - clamp(map(e, 3.3, 3.5, 0, 0.5), 0, 0.5) + clamp(map(e, 5.7, 6, 0, 1.75), 0, 1.75),
	};
}

export function frontConesOffset(e: number): number {
	const t =
		clamp(map(e, 0, 1, 2, -5), -5, 1) +
		clamp(map(e, 1.25, 1.5, 0, 5), 0, 5) -
		clamp(map(e, 2.7, 3, 0, 5), 0, 5) +
		clamp(map(e, 3.3, 3.5, 0, 5), 0, 9) -
		clamp(map(e, 4.5, 5, 0, 5), 0, 4);
	return 0.25 * t;
}
