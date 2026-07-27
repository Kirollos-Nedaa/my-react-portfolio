import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white-100 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-white-200 mt-1">{hint}</p>}
    </div>
  );
}

export const inputCls = cn(
  "w-full px-3 py-2.5 rounded-lg text-sm",
  "bg-black-100 border border-black-300 text-white",
  "placeholder:text-white-200/40",
  "focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent",
  "transition-all duration-150"
);
