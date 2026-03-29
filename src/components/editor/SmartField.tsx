"use client";

interface SmartFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "month" | "email" | "url" | "tel";
  disabled?: boolean;
  hint?: string;
}

export default function SmartField({
  label, value, onChange, placeholder, type = "text", disabled = false, hint,
}: SmartFieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none
          focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          placeholder:text-gray-400 transition-all"
      />
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
