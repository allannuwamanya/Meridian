"use client";
import { ReactNode } from "react";

interface SmartFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "month" | "email" | "url" | "tel";
  disabled?: boolean;
  hint?: string;
  icon?: ReactNode;
  multiline?: boolean;
  rows?: number;
}

export default function SmartField({
  label, value, onChange, placeholder, type = "text",
  disabled = false, hint, icon, multiline = false, rows = 3,
}: SmartFieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none
              focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
              placeholder:text-gray-400 transition-all resize-none leading-relaxed
              ${icon ? "pl-9" : ""}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none
              focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
              placeholder:text-gray-400 transition-all
              ${icon ? "pl-9" : ""}`}
          />
        )}
      </div>
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
