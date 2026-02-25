"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });

    // Thumbnail "intro" animation (2s)
    tl.fromTo(
      imgRef.current,
      { scale: 0.85, opacity: 0, rotation: 0 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 2,
        ease: "power2.inOut",
        keyframes: [
          { scale: 0.85, opacity: 0, rotation: 0, duration: 0 },
          { scale: 1.08, opacity: 1, rotation: 6, duration: 0.7 },
          { scale: 1.02, rotation: -4, duration: 0.7 },
          { scale: 1, rotation: 0, duration: 0.6 },
        ],
      }
    );

    // Slide overlay away
    tl.to(overlayRef.current, {
      y: "-100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <main className="relative z-0">{children}</main>

      {visible && (
        <div
          ref={overlayRef}
          className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-background"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div
            className="flex flex-col items-center justify-center px-6"
            aria-hidden="true"
          >
            <img
              ref={imgRef}
              src="/thumbnail.png"
              alt="Thumbnail"
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-2xl shadow-2xl"
              style={{ opacity: 0, transform: "scale(0.85)" }}
              draggable={false}
            />
            <span className="mt-4 text-sm text-slate-300"></span>
          </div>
        </div>
      )}
    </div>
  );
}
