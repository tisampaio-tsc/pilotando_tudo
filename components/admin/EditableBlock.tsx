"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, X } from "lucide-react";

interface EditableBlockProps {
  label: string;
  children: ReactNode;
  /** Conteúdo mostrado NO LUGAR de `children`, dentro da mesma moldura, quando `expanded` for true. */
  editing?: ReactNode;
  expanded?: boolean;
  onToggleExpand?: () => void;
  visible?: boolean;
  onToggleVisible?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  /** Desative quando o bloco tiver um menu/dropdown que precisa "vazar" da moldura (ex.: menu mobile do cabeçalho). */
  clip?: boolean;
}

export default function EditableBlock({
  label,
  children,
  editing,
  expanded = false,
  onToggleExpand,
  visible = true,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  clip = true,
}: EditableBlockProps) {
  const showEditing = expanded && editing;

  return (
    <div
      className={`jeans-frame jeans-label mb-6 ${
        clip ? "overflow-hidden" : ""
      } ${expanded ? "jeans-frame--editing" : ""}`}
    >
      <div className="relative flex items-center gap-1 bg-denim-dark text-white px-2.5 py-2 rounded-t-[16px]">
        <span className="jeans-rivet jeans-rivet-sm shrink-0" aria-hidden />
        <span className="font-semibold text-xs sm:text-sm flex-1 truncate pl-1">
          {label}
        </span>

        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Mover para cima"
            className="p-1.5 rounded-md hover:bg-white/15 disabled:opacity-30 shrink-0"
          >
            <ChevronUp size={16} />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Mover para baixo"
            className="p-1.5 rounded-md hover:bg-white/15 disabled:opacity-30 shrink-0"
          >
            <ChevronDown size={16} />
          </button>
        )}
        {onToggleVisible && (
          <button
            type="button"
            onClick={onToggleVisible}
            aria-label={visible ? "Ocultar do site" : "Mostrar no site"}
            className="p-1.5 rounded-md hover:bg-white/15 shrink-0"
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
        {editing && onToggleExpand && (
          <button
            type="button"
            onClick={onToggleExpand}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              expanded
                ? "bg-white text-denim-dark"
                : "bg-white text-denim-dark hover:bg-denim-light"
            }`}
          >
            {expanded ? (
              <>
                <X size={14} /> Fechar
              </>
            ) : (
              <>
                <Pencil size={14} /> Editar
              </>
            )}
          </button>
        )}
      </div>

      <div className={!visible ? "opacity-40 jeans-hatch" : ""}>
        {showEditing ? editing : children}
      </div>

      {!visible && (
        <p className="bg-panel-warning-bg text-panel-warning text-xs text-center py-1.5 px-2">
          Oculta no site publicado — toque no olho para mostrar
        </p>
      )}

      {showEditing && onToggleExpand && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="btn-fabric w-full py-2.5 bg-denim-light text-denim-dark font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-denim/20 transition-colors border-t-2 border-dashed border-stitch/60"
        >
          <X size={15} /> Concluir edição
        </button>
      )}
    </div>
  );
}
