"use client";

import { track as trackEvent } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";

// 15×7 sheet of 105 people built from Open Peeps parts (Pablo Stanley, CC0, openpeeps.com),
// with Indian attire drawn on for 63 of them. No fantasy faces.
const SHEET = "/footer/crowd.png";
const COLS = 15;
const ROWS = 7;
const CAST = COLS * ROWS;
// Full-body standing illustration (transparent PNG, ~375×1400). Drawn feet-down in the middle, like a portrait.
const ME_IMAGE = "/footer/me-standing.png";
// Fractions of ME_IMAGE's height: legs band [from, to] (below the hands, above the shoes) and its stretch.
const LEGS = [0.69, 0.84, 1] as const;

// Deterministic 0..1 noise, so every visit shows the same crowd.
const hash = (n: number) => {
	const t = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return t - Math.floor(t);
};

interface Walker {
	cell: number;
	dir: 1 | -1;
	h: number;
	layer: 0 | 1;
	phase: number;
	speed: number;
	top: number;
	w: number;
}

export default function Crowd({ name }: { name: string }) {
	const stage = useRef<HTMLButtonElement>(null);
	const backRef = useRef<HTMLCanvasElement>(null);
	const frontRef = useRef<HTMLCanvasElement>(null);
	const [paused, setPaused] = useState(false);
	const control = useRef({ paused: false, sync: () => {} });

	useEffect(() => {
		control.current.paused = paused;
		control.current.sync();
	}, [paused]);

	useEffect(() => {
		const el = stage.current;
		const ctl = control.current;
		const canvases = [backRef.current, frontRef.current];
		const layers = canvases.map((c) => c?.getContext("2d"));
		if (!el || !canvases[0] || !canvases[1] || !layers[0] || !layers[1]) return;
		const [back, front] = layers as CanvasRenderingContext2D[];
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		const sheet = new Image();
		const meImg = new Image();
		let meReady = false;
		meImg.onload = () => {
			meReady = true;
			sync();
		};

		let ready = false;
		let alive = true;
		let visible = false;
		let raf = 0;
		let last = 0;
		let time = 0;
		let W = 0;
		let H = 0;
		let dpr = 1;
		let pad = 0;
		let track = 0;
		let portrait = 0;
		let walkers: Walker[] = [];

		const peep = (g: CanvasRenderingContext2D, cell: number, x: number, top: number, w: number, h: number, dir: number) => {
			const cw = sheet.naturalWidth / COLS;
			const ch = sheet.naturalHeight / ROWS;
			g.save();
			g.translate(x, top);
			g.scale(dir, 1);
			g.drawImage(sheet, (cell % COLS) * cw, Math.floor(cell / COLS) * ch, cw, ch, -w / 2, 0, w, h);
			g.restore();
		};

		const draw = () => {
			for (const g of [back, front]) {
				g.setTransform(dpr, 0, 0, dpr, 0, 0);
				g.clearRect(0, 0, W, H);
			}
			for (const p of walkers) {
				const pos = p.phase + (time * p.speed) / 10;
				const lap = Math.floor(pos);
				const f = pos - lap;
				const cell = (p.cell + 37 * lap) % CAST;
				const x = (p.dir === 1 ? f : 1 - f) * track - pad;
				const bob = (1 - Math.cos((time * p.speed + 10 * p.phase) * Math.PI * 4)) * 5;
				peep(p.layer ? front : back, cell, x, p.top - bob, p.w, p.h, p.dir);
			}
			// Back canvas sits under front canvas, so drawing "me" last here puts me between the rows.
			if (meReady) {
				// A head taller than the back row, so walkers cross my body but rarely my face.
				const h = Math.min(H - 10, portrait * 1.2);
				const nw = meImg.naturalWidth;
				const nh = meImg.naturalHeight;
				// The illustration's legs are short, so the band between hands and shoes is drawn stretched.
				const a = nh * LEGS[0];
				const b = nh * LEGS[1];
				const s = h / (nh + (b - a) * (LEGS[2] - 1));
				const w = nw * s;
				const x = W / 2 - w / 2;
				const y = H - 6 - h;
				const mid = (b - a) * s * LEGS[2];
				back.drawImage(meImg, 0, 0, nw, a, x, y, w, a * s + 0.5);
				back.drawImage(meImg, 0, a, nw, b - a, x, y + a * s, w, mid + 0.5);
				back.drawImage(meImg, 0, b, nw, nh - b, x, y + a * s + mid, w, (nh - b) * s);
			}
		};

		const tick = (now: number) => {
			if (last) time += Math.min((now - last) / 1000, 0.05);
			last = now;
			draw();
			raf = requestAnimationFrame(tick);
		};

		const sync = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			last = 0;
			if (!ready || !W) return;
			draw();
			if (visible && !document.hidden && !ctl.paused && !reduced.matches) raf = requestAnimationFrame(tick);
		};
		ctl.sync = sync;

		const layout = () => {
			if (!ready || !alive) return;
			const w = el.clientWidth;
			const h = el.clientHeight;
			if (w === W && h === H) return;
			W = w;
			H = h;
			dpr = Math.min(devicePixelRatio || 1, 2);
			for (const c of canvases as HTMLCanvasElement[]) {
				c.width = Math.round(W * dpr);
				c.height = Math.round(H * dpr);
			}
			const aspect = sheet.naturalWidth / COLS / (sheet.naturalHeight / ROWS);
			// Tall stand-in height (desktop ~337px); everything else scales off it.
			portrait = W < 600 ? Math.min(Math.max(220, innerHeight * 0.3), 260, H - 24) : Math.min(365, H - 24);
			const s = Math.min(1, portrait / 310);
			const o = W / (1440 * s);
			// Walkers per row (back, front); kept sparse so there's air between people.
			const rows = W >= 600 ? [19, 9] : [Math.max(5, Math.round(19 * o)), Math.max(4, Math.round(9 * o))];
			const total = rows[0] + rows[1];
			walkers = Array.from({ length: total }, (_, i): Walker => {
				const row = i < rows[0] ? 0 : 1;
				const j = row ? i - rows[0] : i;
				const ph = (row ? 250 + 30 * hash(i + 8) : 170 + 35 * hash(i + 8)) * s;
				return {
					cell: (37 * Math.floor((CAST * i) / total)) % CAST,
					dir: row ? -1 : 1,
					h: ph,
					// Every third back-row walker passes in front of me too.
					layer: row || j % 3 === 0 ? 1 : 0,
					phase: (j + 0.85 * hash(i + 41)) / rows[row],
					speed: [0.7, 1.05][row] * (0.88 + 0.24 * hash(i + 97)),
					top: row ? H - ph + 30 * s + 15 * hash(i + 4) : H - portrait - 12 + 24 * hash(i + 4),
					w: ph * aspect,
				};
			}).sort((a, b) => a.top - b.top);
			pad = Math.max(...walkers.map((p) => p.w));
			track = W + 2 * pad;
			sync();
		};

		// The sheet is big, so it only loads once the footer is near the screen.
		const load = () => {
			if (sheet.src) return;
			sheet.src = SHEET;
			meImg.src = ME_IMAGE;
			sheet
				.decode()
				.then(() => {
					ready = true;
					layout();
				})
				.catch(() => {});
		};
		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible) load();
				sync();
			},
			{ rootMargin: "600px" },
		);
		io.observe(el);
		// The preload observer above fires 600px early, so "reached the footer" gets its own: half the crowd on screen, once per visit.
		const reached = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				trackEvent("footer_reached");
				reached.disconnect();
			},
			{ threshold: 0.5 },
		);
		reached.observe(el);
		const ro = new ResizeObserver(layout);
		ro.observe(el);
		document.addEventListener("visibilitychange", sync);
		reduced.addEventListener("change", sync);

		return () => {
			alive = false;
			cancelAnimationFrame(raf);
			io.disconnect();
			reached.disconnect();
			ro.disconnect();
			document.removeEventListener("visibilitychange", sync);
			reduced.removeEventListener("change", sync);
			ctl.sync = () => {};
		};
	}, []);

	return (
		<button
			aria-label={`${name.toUpperCase()}. ${paused ? "Resume" : "Pause"} crowd animation`}
			aria-pressed={paused}
			className="crowd"
			onClick={() => setPaused((v) => !v)}
			ref={stage}
			type="button"
		>
			<span aria-hidden="true" className="crowd-name">
				{name.toUpperCase()}.
			</span>
			<canvas aria-hidden="true" className="crowd-back" ref={backRef} />
			<canvas aria-hidden="true" className="crowd-front" ref={frontRef} />
		</button>
	);
}
