"use client";

import { Plus } from "lucide-react";

interface AddGhostCardProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

/**
 * Cartão fantasma (borda tracejada) usado no fim de cada lista editável para
 * adicionar um novo item, com a mesma silhueta aproximada do item real.
 */
export default function AddGhostCard({
  onClick,
  label = "Adicionar",
  className = "",
}: AddGhostCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`add-ghost-card flex items-center justify-center gap-2 w-full border-2 border-dashed border-denim/40 rounded-xl text-denim-dark font-semibold text-sm hover:border-denim hover:bg-denim-light/40 transition-colors min-h-[44px] py-3 ${className}`}
    >
      <Plus size={18} />
      {label}
    </button>
  );
}
