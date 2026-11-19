"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";

// Per-char splitting breaks Devanagari conjuncts, so non-Latin greetings roll as whole words.
const LATIN = /^[\p{Script=Latin}\p{P}\s]*$/u;

function split(el: HTMLElement) {
	const latin = LATIN.test(el.textContent ?? "");
	const s = SplitText.create(el, { aria: "none", type: latin ? "chars" : "words" });
	return latin ? s.chars : s.words;
}

// iPhone-style hello: every 1.3s the greeting rolls up out of its clipped line as the next rolls in.
export default function Greeting({ words }: { words: string[] }) {
	const line = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = line.current;
		if (!el || words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		gsap.registerPlugin(SplitText);
		// Fetch the Devanagari face up front so नमस्ते doesn't swap fonts mid-roll.
		document.fonts.load(`1em ${getComputedStyle(el).fontFamily}`, words.filter((w) => !LATIN.test(w)).join("")).catch(() => {});

		let current = el.firstElementChild as HTMLElement | null;
		let index = 0;
		let anim: gsap.core.Animation = gsap.delayedCall(1.3, next);

		function next() {
			const prev = current;
			if (!el || !prev) return;
			index = (index + 1) % words.length;
			const word = document.createElement("span");
			word.className = "greet-word";
			word.textContent = words[index];
			el.append(word);
			current = word;
			const out = split(prev);
			anim = gsap
				.timeline({
					onComplete: () => {
						prev.remove();
						anim = gsap.delayedCall(1.3, next);
					},
				})
				.to(out, { duration: 0.2, ease: "power1.out", stagger: 0.05, yPercent: 8 })
				.to(out, { duration: 0.95, ease: "power4.inOut", rotate: -6, stagger: 0.05, transformOrigin: "0% 0%", yPercent: -118 }, 0.2)
				.from(split(word), { duration: 0.95, ease: "power4.inOut", rotate: 6, stagger: 0.05, transformOrigin: "0% 100%", yPercent: 118 }, 0.2);
		}

		// Paused while the heading is off screen.
		const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? anim.play() : anim.pause()));
		io.observe(el);
		return () => {
			anim.kill();
			io.disconnect();
		};
	}, [words]);

	return (
		<span aria-hidden="true" className="greet-line" ref={line}>
			<span className="greet-word">{words[0]}</span>
		</span>
	);
}
