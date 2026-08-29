"use client";

import { useEffect, useRef } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  /** Usa <input> em vez de <textarea> (para textos que nunca quebram linha, ex.: nome no cabeçalho). */
  as?: "textarea" | "input";
}

/**
 * Campo editável "invisível": sem borda nem fundo, herda a MESMA classe de
 * texto do site público (fonte/tamanho/cor idênticos) e cresce
 * automaticamente conforme o texto quebra linha. Em foco, mostra um contorno
 * pontilhado fino (efeito "alinhavado para costurar").
 */
export default function EditableText({
  value,
  onChange,
  className = "",
  placeholder,
  ariaLabel,
  as = "textarea",
}: EditableTextProps) {
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const autosize = () => {
    const el = ref.current;
    if (el && "scrollHeight" in el && as === "textarea") {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autosize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const sharedClassName = `editable-text block w-full bg-transparent border-0 outline-none resize-none p-0 m-0 ${className}`;

  if (as === "input") {
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={sharedClassName}
      />
    );
  }

  return (
    <textarea
      ref={ref as React.RefObject<HTMLTextAreaElement>}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={autosize}
      placeholder={placeholder}
      aria-label={ariaLabel}
      rows={1}
      className={sharedClassName}
    />
  );
}
