"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, easeInOut } from "framer-motion";

/**
 * SplashLayout
 * - Shows `public/thumbnail.png` as a centered splash for 2s with a "breath + tilt" animation
 * - After the 2s animation completes, the splash slides up off-screen to reveal the page
 * - Usage: wrap your app/page with <SplashLayout>{children}</SplashLayout>
 */

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const overlayControls = useAnimation();
  const imgControls = useAnimation();

  useEffect(() => {
    // Sequence: 1) animate thumbnail for 2s, 2) slide overlay up (0.6s), 3) hide overlay
    async function seq() {
      // Thumbnail "intro" animation (2s)
      await imgControls.start({
        scale: [0.85, 1.08, 1],
        rotate: [0, 6, -4, 0],
        opacity: [0, 1],
        transition: { duration: 2, ease: "easeInOut" },
      });

      // Slide overlay away
      await overlayControls.start({
        y: "-100%",
        opacity: 0,
        transition: { duration: 0.6, ease: "easeInOut" },
      });

      // remove from DOM to allow pointer events and focus
      setVisible(false);
    }

    seq();
  }, [imgControls, overlayControls]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* The site content goes behind the splash */}
      <main className="relative z-0">{children}</main>

      {/* Splash overlay */}
      {visible && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={overlayControls}
          className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <motion.div
            className="flex flex-col items-center justify-center px-6"
            aria-hidden="true"
          >
            <motion.img
              src="/thumbnail.png"
              alt="Thumbnail"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={imgControls}
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-2xl shadow-2xl"
              draggable={false}
            />

            {/* Optional small caption or animated loader */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.4 }}
              className="mt-4 text-sm text-slate-300"
            ></motion.span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
