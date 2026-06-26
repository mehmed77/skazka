"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { MISHKA_MANIFEST, type MishkaState } from "@/lib/mishka";

const SIZE: Record<string, string> = {
  sm: "text-4xl",
  md: "text-6xl",
  lg: "text-8xl",
  xl: "text-[9rem]",
};

// Mishka maskot — manifestdan o'qiydi. Hozir placeholder emoji; kelajakda haqiqiy
// render (Lottie/sprite/video) MISHKA_MANIFEST'ga qo'shilsa, shu yerda almashtiriladi
// (komponent API o'zgarmaydi). a11y: role=img + label.
export function Mishka({
  state = "idle",
  size = "lg",
  className,
}: {
  state?: MishkaState;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const asset = MISHKA_MANIFEST[state];
  const reduce = useReducedMotion();

  // ── ASSET SLOT (kelajak): asset.lottie/sprite/video bo'lsa shu yerda render qilinadi ──
  // if (asset.lottie) return <LottiePlayer src={asset.lottie} .../>;

  return (
    <motion.div
      data-mishka-state={state}
      role="img"
      aria-label={asset.label}
      className={cn("relative inline-block select-none leading-none", SIZE[size], !reduce && asset.anim, className)}
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <span aria-hidden>{asset.placeholder}</span>
      {asset.badge && (
        <span aria-hidden className="absolute -right-1 -top-1 text-[0.45em]">
          {asset.badge}
        </span>
      )}
    </motion.div>
  );
}
