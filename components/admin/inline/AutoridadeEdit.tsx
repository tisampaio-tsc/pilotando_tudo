"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { AutoridadeSection } from "@/lib/content-schema";
import { autoridadeText } from "@/components/Autoridade";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";

interface AutoridadeEditProps {
  data: AutoridadeSection;
  onChange: (data: AutoridadeSection) => void;
}

/**
 * Irmã editável do Autoridade: título, parágrafos (lista editável, com dica
 * de **negrito**), título dos diferenciais, lista de diferenciais e texto do
 * botão, todos no lugar exato do site.
 */
export default function AutoridadeEdit({
  data,
  onChange,
}: AutoridadeEditProps) {
  const moveParagraph = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= data.paragraphs.length) return;
    const paragraphs = [...data.paragraphs];
    [paragraphs[i], paragraphs[target]] = [paragraphs[target], paragraphs[i]];
    onChange({ ...data, paragraphs });
  };

  const moveHighlight = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= data.highlights.length) return;
    const highlights = [...data.highlights];
    [highlights[i], highlights[target]] = [highlights[target], highlights[i]];
    onChange({ ...data, highlights });
  };

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            as="input"
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={`${autoridadeText.title} text-center`}
            ariaLabel="Título da seção"
          />
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative rounded-[24px] overflow-hidden aspect-[3/4] max-w-md bg-navy-900/5 border border-navy-800/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_10px_20px_-5px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(0,0,0,0.08)]">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover object-[50%_35%] rounded-[24px]"
              sizes="(max-width: 1024px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-[24px]" />
          </div>
          <div className="max-w-prose">
            <p className="text-xs text-navy-700/60 mb-2">
              Use **texto** para deixar em negrito.
            </p>
            <div className="space-y-2">
              {data.paragraphs.map((paragraph, i) => (
                <div key={i} className="flex items-start gap-2">
                  <EditableText
                    value={paragraph}
                    onChange={(v) => {
                      const paragraphs = [...data.paragraphs];
                      paragraphs[i] = v;
                      onChange({ ...data, paragraphs });
                    }}
                    className={`${autoridadeText.paragraph} flex-1`}
                    ariaLabel={`Parágrafo ${i + 1}`}
                  />
                  <ItemToolbar
                    onMoveUp={() => moveParagraph(i, -1)}
                    onMoveDown={() => moveParagraph(i, 1)}
                    onDelete={() =>
                      onChange({
                        ...data,
                        paragraphs: data.paragraphs.filter((_, j) => j !== i),
                      })
                    }
                    canMoveUp={i > 0}
                    canMoveDown={i < data.paragraphs.length - 1}
                  />
                </div>
              ))}
            </div>
            <AddGhostCard
              className="mt-2"
              label="Adicionar parágrafo"
              onClick={() =>
                onChange({
                  ...data,
                  paragraphs: [...data.paragraphs, "Novo parágrafo..."],
                })
              }
            />

            <EditableText
              as="input"
              value={data.highlightsTitle}
              onChange={(v) => onChange({ ...data, highlightsTitle: v })}
              className={autoridadeText.highlightsTitle}
              ariaLabel="Título dos diferenciais"
            />
            <div className="mt-2 space-y-2">
              {data.highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-check font-bold">✓</span>
                  <EditableText
                    as="input"
                    value={item}
                    onChange={(v) => {
                      const highlights = [...data.highlights];
                      highlights[i] = v;
                      onChange({ ...data, highlights });
                    }}
                    className={`${autoridadeText.highlightItem} flex-1`}
                    ariaLabel={`Diferencial ${i + 1}`}
                  />
                  <ItemToolbar
                    onMoveUp={() => moveHighlight(i, -1)}
                    onMoveDown={() => moveHighlight(i, 1)}
                    onDelete={() =>
                      onChange({
                        ...data,
                        highlights: data.highlights.filter((_, j) => j !== i),
                      })
                    }
                    canMoveUp={i > 0}
                    canMoveDown={i < data.highlights.length - 1}
                  />
                </div>
              ))}
            </div>
            <AddGhostCard
              className="mt-2"
              label="Adicionar diferencial"
              onClick={() =>
                onChange({
                  ...data,
                  highlights: [...data.highlights, "Novo diferencial"],
                })
              }
            />

            <div className="mt-8">
              <div className={autoridadeText.button}>
                <MessageCircle size={22} aria-hidden />
                <EditableText
                  as="input"
                  value={data.buttonText}
                  onChange={(v) => onChange({ ...data, buttonText: v })}
                  ariaLabel="Texto do botão"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
