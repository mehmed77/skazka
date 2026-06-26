"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Bolalarbop pastdan chiquvchi modal (bottom-sheet). reduced-motion'da silliq, sakramaydi.
export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-bottomsheet
        >
          <motion.div
            className="w-full max-w-md rounded-t-blob bg-card p-6 pb-10 shadow-pop"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
