"use client";

import { Check, Eye } from "lucide-react";
import { THEMES, type ThemeName } from "@/lib/theme";

interface ThemePickerProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
  onPreview: () => void;
}

export default function ThemePicker({
  value,
  onChange,
  onPreview,
}: ThemePickerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2">Cores do site</h2>
        <p className="text-white/70 text-base leading-relaxed">
          Escolha abaixo como o site vai ficar. Toque no visual que você mais
          gostar — só os textos continuam iguais, nada se perde.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {THEMES.map((theme) => {
          const selected = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              aria-pressed={selected}
              className={`w-full text-left rounded-2xl overflow-hidden border-4 transition-colors ${
                selected
                  ? "border-gold"
                  : "border-white/10 hover:border-white/40"
              }`}
            >
              <ThemeMockup theme={theme.id} />
              <div className="flex items-center gap-3 p-4 bg-white/5">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-lg">{theme.name}</p>
                  <p className="text-white/60 text-sm">{theme.description}</p>
                </div>
                {selected ? (
                  <span className="flex items-center gap-1.5 bg-gold text-navy-900 font-bold text-sm px-3 py-2 rounded-full shrink-0">
                    <Check size={16} /> Em uso
                  </span>
                ) : (
                  <span className="text-white/50 text-sm font-semibold shrink-0">
                    Escolher
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onPreview}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-base"
      >
        <Eye size={20} /> Ver o site inteiro nesta cor
      </button>

      <p className="text-white/70 text-base bg-white/5 rounded-xl p-4 leading-relaxed">
        Escolheu? Agora vá na aba <strong className="text-gold">Publicar</strong>{" "}
        e toque em <strong className="text-gold">Publicar agora</strong> para o
        site mudar de verdade.
      </p>
    </div>
  );
}

/** Miniatura do site. O data-theme faz as cores reais do tema serem aplicadas. */
function ThemeMockup({ theme }: { theme: ThemeName }) {
  return (
    <div data-theme={theme} aria-hidden>
      <div className="bg-navy-900 px-4 pt-5 pb-6">
        <div className="h-2.5 w-2/3 rounded-full bg-white/90" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/40" />
        <div className="mt-4 flex gap-2">
          <div className="h-7 w-20 rounded-md bg-action" />
          <div className="h-7 w-20 rounded-md border-2 border-gold" />
        </div>
      </div>
      <div className="bg-cream px-4 py-5">
        <div className="h-2.5 w-1/3 rounded-full bg-navy-900/80" />
        <div className="mt-2 h-1 w-10 rounded-full bg-gold" />
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-navy-700/40" />
            <div className="h-1.5 w-4/5 rounded-full bg-navy-700/25" />
          </div>
          <div className="h-8 w-24 rounded-lg bg-cta" />
        </div>
      </div>
    </div>
  );
}
