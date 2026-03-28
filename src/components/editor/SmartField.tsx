"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SmartFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  type?: string;
  large?: boolean;
  disabled?: boolean;
  multiline?: boolean;
}

export default function SmartField({
  label, value, onChange, placeholder, icon, type = "text", large, disabled, multiline
}: SmartFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className={cn(
        "flex items-center gap-2.5 bg-white/4 border rounded-xl px-3 transition-all",
        disabled ? "opacity-40 cursor-not-allowed" : "border-white/7 hover:border-white/14 focus-within:border-violet-500/40",
        large ? "py-3" : "py-2"
      )}>
        {icon && <span className="text-slate-600 flex-shrink-0">{icon}</span>}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            className={cn("flex-1 bg-transparent text-slate-200 placeholder:text-slate-600 resize-none outline-none", large ? "text-base font-semibold" : "text-sm")}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("flex-1 bg-transparent text-slate-200 placeholder:text-slate-600 outline-none w-full", large ? "text-base font-semibold" : "text-sm")}
          />
        )}
      </div>
    </div>
  );
}
