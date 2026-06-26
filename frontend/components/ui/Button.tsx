"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

// Bolalar UX: ulkan teginish nishonlari (min ~80–100px), yumaloq shakl (§7.1).
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-500 text-brand-foreground hover:bg-brand-600 shadow-pop",
        accent: "bg-accent text-accent-foreground hover:bg-accent-600 shadow-pop",
        ghost: "bg-muted text-foreground hover:bg-brand-100",
      },
      size: {
        // Kichik barmoqlar uchun yirik nishonlar
        md: "h-14 px-6 text-lg rounded-xl2",
        lg: "h-20 px-10 text-2xl rounded-blob",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
