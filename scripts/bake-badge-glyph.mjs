// Bakes the Devanagari म out of public/thumbnail_cropped.png into a 1-bit
// bitmap for the WebGL scene's closing figure (see webgl/figures.ts).
//
// The badge is a cream ring around a maroon disc with the glyph in the middle.
// The ring is a perfect circle, so figures.ts derives it analytically; only the
// glyph needs baking. Everything is expressed in "badge space": the badge's
// bounding square normalised to 0..1, origin top-left, so the figure fills its
// bounds instead of sitting in dead margin.
//
//   node scripts/bake-badge-glyph.mjs
//
// Paste the printed constants into figures.ts.

import sharp from "sharp";

const SRC = "public/thumbnail_cropped.png";
const N = 64; // baked glyph resolution; the voxel grid is 84-100, the glyph ~30% of it
const LIGHT_LUM = 170; // splits cream/white (~240) from maroon (~90)
const GLYPH_MAX_R = 0.55; // ignore the ring when locating the glyph
const COVERAGE = 0.5;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = (x, y) => {
	const i = (y * W + x) * C;
	return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
};
const isLight = (x, y) => {
	const p = px(x, y);
	return p.a > 128 && 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b > LIGHT_LUM;
};

// Badge circle from the alpha bounds.
let minX = W, maxX = -1, minY = H, maxY = -1;
for (let y = 0; y < H; y++) {
	for (let x = 0; x < W; x++) {
		if (px(x, y).a <= 128) continue;
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
	}
}
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const R = Math.max(maxX - minX, maxY - minY) / 2;
const toBadge = (v, c) => (v - c) / (2 * R) + 0.5;

// Ring band: sample rings outward and keep the fully-lit span.
let ringInner = 1;
for (let k = 50; k <= 100; k++) {
	const rr = k / 100;
	let tot = 0, lit = 0;
	for (let a = 0; a < 720; a++) {
		const th = (a * Math.PI) / 360;
		const x = Math.round(cx + Math.cos(th) * rr * R);
		const y = Math.round(cy + Math.sin(th) * rr * R);
		if (x < 0 || y < 0 || x >= W || y >= H) continue;
		tot++;
		if (isLight(x, y)) lit++;
	}
	if (tot && lit / tot > 0.9) { ringInner = rr; break; }
}

// Glyph bounds.
let gx0 = W, gx1 = -1, gy0 = H, gy1 = -1;
for (let y = 0; y < H; y++) {
	for (let x = 0; x < W; x++) {
		if (!isLight(x, y)) continue;
		if (Math.hypot(x - cx, y - cy) / R >= GLYPH_MAX_R) continue;
		if (x < gx0) gx0 = x;
		if (x > gx1) gx1 = x;
		if (y < gy0) gy0 = y;
		if (y > gy1) gy1 = y;
	}
}

// Rasterise the glyph box to N×N by area coverage.
const bits = new Uint8Array(Math.ceil((N * N) / 8));
for (let ry = 0; ry < N; ry++) {
	for (let rx = 0; rx < N; rx++) {
		const sx0 = gx0 + ((gx1 + 1 - gx0) * rx) / N;
		const sx1 = gx0 + ((gx1 + 1 - gx0) * (rx + 1)) / N;
		const sy0 = gy0 + ((gy1 + 1 - gy0) * ry) / N;
		const sy1 = gy0 + ((gy1 + 1 - gy0) * (ry + 1)) / N;
		let tot = 0, lit = 0;
		for (let y = Math.floor(sy0); y < Math.ceil(sy1); y++) {
			for (let x = Math.floor(sx0); x < Math.ceil(sx1); x++) {
				if (x < 0 || y < 0 || x >= W || y >= H) continue;
				tot++;
				if (isLight(x, y)) lit++;
			}
		}
		if (tot && lit / tot >= COVERAGE) {
			const i = ry * N + rx;
			bits[i >> 3] |= 0x80 >> (i & 7);
		}
	}
}

const set = [...bits].reduce((n, b) => n + b.toString(2).split("1").length - 1, 0);
console.log(`source ${W}x${H}  badge centre ${cx},${cy} R ${R}`);
console.log(`glyph px bbox ${gx0},${gy0} → ${gx1},${gy1}  (${gx1 - gx0 + 1}x${gy1 - gy0 + 1})`);
console.log(`baked ${N}x${N}, ${set}/${N * N} bits set (${((100 * set) / (N * N)).toFixed(1)}%)\n`);
console.log(`const BADGE_RING_INNER = ${ringInner};`);
console.log(
	`const BADGE_GLYPH_BOX = [${toBadge(gx0, cx).toFixed(4)}, ${toBadge(gy0, cy).toFixed(4)}, ${toBadge(gx1 + 1, cx).toFixed(4)}, ${toBadge(gy1 + 1, cy).toFixed(4)}] as const;`
);
console.log(`const BADGE_GLYPH_N = ${N};`);
console.log(`const BADGE_GLYPH_BITS =\n\t"${Buffer.from(bits).toString("base64")}";`);

// Console preview so a bad bake is obvious.
console.log("\npreview:");
for (let y = 0; y < N; y += 2) {
	let row = "";
	for (let x = 0; x < N; x++) {
		const i = y * N + x;
		row += bits[i >> 3] & (0x80 >> (i & 7)) ? "#" : ".";
	}
	console.log("  " + row);
}
