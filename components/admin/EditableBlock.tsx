"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, X } from "lucide-react";

interface EditableBlockProps {
  label: string;
  children: ReactNode;
  editor?: ReactNode;
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

/**
 * Envolve um bloco real do site (Header, uma seção ou o Footer) com uma
 * "moldura costurada" do painel: barra com nome do bloco, botões de mover,
 * mostrar/ocultar e editar. Ao editar, o formulário aparece encaixado logo
 * abaixo do próprio bloco, sem esconder o resto do site.
 */
export default function EditableBlock({
  label,
  children,
  editor,
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
  return (
    <div className={`jeans-frame mb-6 ${clip ? "overflow-hidden" : ""}`}>
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
        {editor && onToggleExpand && (
          <button
            type="button"
            onClick={onToggleExpand}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              expanded
                ? "bg-white/15 text-white"
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

      <div className={!visible ? "opacity-40 jeans-hatch" : ""}>{children}</div>

      {!visible && (
        <p className="bg-panel-warning-bg text-panel-warning text-xs text-center py-1.5 px-2">
          Oculta no site publicado — toque no olho para mostrar
        </p>
      )}

      {expanded && editor && (
        <div className="bg-panel-surface border-t-2 border-dashed border-stitch/70 p-4 space-y-4">
          {editor}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="w-full py-3 bg-denim hover:bg-denim-dark text-white font-bold rounded-xl transition-colors min-h-[44px]"
            >
              Concluir edição
            </button>
          )}
        </div>
      )}
    </div>
  );
}
