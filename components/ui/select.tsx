import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-12 w-full rounded-2xl border border-slate-900/10 bg-white/90 px-4 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(15,118,110,0.12)]",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
