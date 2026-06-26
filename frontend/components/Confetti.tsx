"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BITS = ["⭐", "🎉", "✨", "🌟", "💫", "🎈"];

// To'g'ri javob feedback'i (Faza 5 ishlatadi). reduced-motion'da bitta statik yulduz.
export function Confetti({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {show && (
        <div
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
          data-confetti
        >
          {reduce ? (
            <span className="text-7xl">⭐</span>
          ) : (
            Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-3xl"
                initial={{ y: 0, x: 0, opacity: 1, scale: 0.4 }}
                animate={{
                  y: (i % 2 ? -1 : 1) * (130 + i * 9),
                  x: (i - 7) * 30,
                  opacity: 0,
                  scale: 1.3,
                  rotate: i * 45,
                }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                {BITS[i % BITS.length]}
              </motion.span>
            ))
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
