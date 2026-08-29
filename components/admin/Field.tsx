"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
  inputMode?: "text" | "numeric" | "url";
  placeholder?: string;
  name?: string;
}

export default function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
  inputMode = "text",
  placeholder,
  name,
}: FieldProps) {
  const className =
    "w-full bg-panel-bg border border-panel-border rounded-xl px-4 py-3 text-base text-panel-ink placeholder-panel-muted/60 focus:outline-none focus:border-denim focus:ring-2 focus:ring-denim/20 min-h-[48px]";

  // O navegador tenta "adivinhar" o tipo de campo pelo texto do rótulo (ex.:
  // "Endereço" soa como endereço físico) e pode abrir um balão de sugestão
  // de autopreenchimento por cima do campo, travando a digitação. Desligamos
  // esse comportamento em todos os campos deste painel.
  const noAutofillProps = {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false,
    "data-lpignore": "true",
    "data-1p-ignore": "true",
  } as const;

  return (
    <div>
      <label className="block text-sm font-medium text-panel-ink/80 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className={`${className} resize-y`}
          {...noAutofillProps}
        />
      ) : (
        <input
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          {...noAutofillProps}
        />
      )}
      {hint && <p className="text-panel-muted text-xs mt-1">{hint}</p>}
    </div>
  );
}
