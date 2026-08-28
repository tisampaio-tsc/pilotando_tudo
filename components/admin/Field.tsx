"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
  inputMode?: "text" | "numeric" | "url";
}

export default function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
  inputMode = "text",
}: FieldProps) {
  const className =
    "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:border-gold min-h-[48px]";

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${className} resize-y`}
        />
      ) : (
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
      {hint && <p className="text-white/40 text-xs mt-1">{hint}</p>}
    </div>
  );
}
