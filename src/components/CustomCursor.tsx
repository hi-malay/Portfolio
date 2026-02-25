"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if(window.matchMedia("(pointer: coarse)").matches) return;

    if (!cursorRef.current || !followerRef.current) return;

    const followerX = gsap.quickTo(followerRef.current, "x", { duration: 0.35, ease: "power2" });
    const followerY = gsap.quickTo(followerRef.current, "y", { duration: 0.35, ease: "power2" });

    const onMouseMove = (e: MouseEvent) => {
      // Dot tracks mouse instantly — no tween
      gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
      followerX(e.clientX);
      followerY(e.clientY);
    };

    // Add pointer tracking to magnetic/interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.classList.contains('magnetic-wrap')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // Hide cursor element globally if JS is working
  useEffect(() => {
    document.documentElement.classList.add('hide-default-cursor');
    return () => {
      document.documentElement.classList.remove('hide-default-cursor');
    };
  }, []);

  return (
    <>
      <style>{`
        .hide-default-cursor {
          cursor: none !important;
        }
        .hide-default-cursor a,
        .hide-default-cursor button {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/50 pointer-events-none z-100 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out items-center justify-center max-md:hidden flex ${
          isHovering ? "w-16 h-16 bg-accent/10 border-accent scale-150" : ""
        }`}
        style={{ mixBlendMode: "difference" }}
      >
        <div 
          className={`w-1 h-1 bg-accent rounded-full opacity-0 transition-opacity duration-300 ${isHovering ? "opacity-100" : ""}`}
        />
      </div>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-100 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 max-md:hidden block ${
          isHovering ? "scale-0" : ""
        }`}
        style={{ mixBlendMode: "difference" }}
      />
    </>
  );
}
