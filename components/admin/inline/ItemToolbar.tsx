"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface ItemToolbarProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  className?: string;
}

/**
 * Cluster pequeno (mover ↑↓ e excluir) em pílula azul-jeans, para grudar no
 * canto de cada item de lista editável (ex.: depoimento, pergunta do FAQ,
 * card de curso).
 */
export default function ItemToolbar({
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
  className = "",
}: ItemToolbarProps) {
  return (
    <div
      className={`item-toolbar inline-flex items-center gap-0.5 bg-denim-dark text-white rounded-full shadow-md px-1 py-1 ${className}`}
    >
      {onMoveUp && (
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label="Mover para cima"
          className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-30"
        >
          <ChevronUp size={14} />
        </button>
      )}
      {onMoveDown && (
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label="Mover para baixo"
          className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-30"
        >
          <ChevronDown size={14} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Excluir"
          className="p-1.5 rounded-full hover:bg-panel-danger/80 text-white/90"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
