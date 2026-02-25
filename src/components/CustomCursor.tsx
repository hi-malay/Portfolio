"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    if (!dot) return;

    const onMouseMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.classList.add("hide-default-cursor");

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.classList.remove("hide-default-cursor");
    };
  }, []);

  return (
    <>
      <style>{`
        .hide-default-cursor { cursor: none !important; }
        .hide-default-cursor a, .hide-default-cursor button { cursor: none !important; }
      `}</style>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 border border-accent rounded-full pointer-events-none z-9999 max-md:hidden"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
