"use client";

import { Pencil } from "lucide-react";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  open: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Círculo de ícone do card, que também funciona como botão: toque para abrir
 * uma grade com todas as opções disponíveis e escolher outra.
 */
export default function IconPicker({
  value,
  onChange,
  open,
  onToggle,
  className = "",
}: IconPickerProps) {
  const Icon = getIcon(value);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Escolher ícone do card"
        aria-expanded={open}
        className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
      >
        <Icon size={28} />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white text-denim-dark flex items-center justify-center shadow">
          <Pencil size={11} />
        </span>
      </button>

      {open && (
        <div className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-white border-2 border-denim/20 rounded-xl shadow-lg p-3">
          <p className="text-xs font-semibold text-panel-muted mb-2 text-center">
            Escolha um ícone
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              const selected = option.id === value;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange(option.id)}
                  aria-label={option.label}
                  aria-pressed={selected}
                  className={`flex items-center justify-center w-11 h-11 rounded-lg border-2 transition-colors ${
                    selected
                      ? "border-denim bg-denim-light text-denim-dark"
                      : "border-panel-border text-panel-ink hover:border-denim/40 hover:bg-denim-light/40"
                  }`}
                >
                  <OptionIcon size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
