import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-blob bg-card p-5 shadow-soft", className)} {...props}>
      {children}
    </div>
  );
}
