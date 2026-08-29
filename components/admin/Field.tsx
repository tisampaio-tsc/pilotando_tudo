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
    "w-full bg-panel-bg border border-panel-border rounded-xl px-4 py-3 text-base text-panel-ink placeholder-panel-muted/60 focus:outline-none focus:border-denim focus:ring-2 focus:ring-denim/20 min-h-[48px]";

  return (
    <div>
      <label className="block text-sm font-medium text-panel-ink/80 mb-1.5">
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
      {hint && <p className="text-panel-muted text-xs mt-1">{hint}</p>}
    </div>
  );
}
