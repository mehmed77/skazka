"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl2 border border-input bg-background px-4 py-3 text-base outline-none transition focus:ring-4 focus:ring-ring/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
