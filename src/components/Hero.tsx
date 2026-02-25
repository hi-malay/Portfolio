"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Delay the hero animation to allow the Splash to finish (approx 2s + 0.6s)
    const tl = gsap.timeline({ delay: 2.8 });

    const titleSplit = new SplitText(".hero-title-text", { type: "lines,chars" });
    const descSplit = new SplitText(".hero-desc", { type: "lines" });

    tl.from(titleSplit.chars, {
      yPercent: 120,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
      duration: 1.2,
      ease: "expo.out",
      transformOrigin: "0% 50% -50",
    })
    .from(descSplit.lines, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8")
    .from(".hero-btn", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "-=0.6")
    .from(".hero-scroll", {
      opacity: 0,
      duration: 1
    }, "-=0.4");

    // Scroll indicator bounce
    gsap.to(".scroll-arrow", {
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 1.5
    });

  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20"
      id="home"
    >
      <div className="max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05] mb-8" style={{ perspective: "1000px" }}>
          <div className="overflow-hidden-line">
            <span className="hero-title-text inline-block text-foreground">Hey, I'm</span>
          </div>
          <div className="overflow-hidden-line">
            <span className="hero-title-text inline-block text-accent">Malay Mishra</span>
          </div>
        </h1>
        
        <p className="hero-desc text-lg md:text-xl text-foreground/70 max-w-2xl font-normal leading-relaxed mb-12">
          Fullstack Engineer with 5+ years building high-performance systems. Delivered sub-second APIs, led major frontend revamps, and shipped AI-driven features. Passionate about performance, clean architecture, and mentoring engineers.
        </p>
        
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-semibold tracking-wider">
          <a href="#contact" className="hero-btn magnetic-wrap bg-foreground text-background px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:scale-105 transition-transform duration-300">
            LET'S TALK
          </a>
          <a href="#experience" className="hero-btn magnetic-wrap border border-foreground/20 text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:border-accent hover:text-accent transition-colors duration-300">
            VIEW WORK
          </a>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-10 left-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/50 font-medium z-10 cursor-pointer magnetic-wrap" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
        <span>Scroll to explore</span>
        <ArrowDown size={14} className="scroll-arrow text-accent" />
      </div>

      {/* Decorative abstract elements */}
      <div className="absolute right-0 top-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />
      <div className="absolute left-1/4 bottom-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />
    </section>
  );
}
