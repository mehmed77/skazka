import { cn } from "@/lib/cn";
import type { ResolvedItem } from "@/lib/games/types";
import { wordEmoji } from "@/lib/wordPlaceholder";

const SIZE = { sm: "text-5xl", md: "text-7xl", lg: "text-8xl" };

// So'z vizuali: real image_url bo'lsa rasm; bo'lmasa emoji placeholder (asset slot).
export function WordVisual({
  item,
  size = "md",
  className,
}: {
  item: ResolvedItem;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (item.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- real rasm slot; next/image (MinIO domeni) Faza 10
      <img
        src={item.image_url}
        alt={item.lemma}
        className={cn("h-24 w-24 rounded-blob object-cover", className)}
      />
    );
  }
  return (
    <span role="img" aria-label={item.lemma} className={cn(SIZE[size], className)}>
      {wordEmoji(item.lemma)}
    </span>
  );
}
