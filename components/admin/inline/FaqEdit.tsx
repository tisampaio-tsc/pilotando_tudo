"use client";

import { MessageCircle } from "lucide-react";
import type { FaqSection } from "@/lib/content-schema";
import { createId } from "@/lib/content-schema";
import { faqText } from "@/components/FAQ";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";

interface FaqEditProps {
  data: FaqSection;
  onChange: (data: FaqSection) => void;
}

/**
 * Irmã editável do FAQ: em vez do acordeão (1 aberta por vez), mostra TODAS
 * as perguntas abertas e editáveis ao mesmo tempo.
 */
export default function FaqEdit({ data, onChange }: FaqEditProps) {
  const move = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= data.items.length) return;
    const items = [...data.items];
    [items[i], items[target]] = [items[target], items[i]];
    onChange({ ...data, items });
  };

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            as="input"
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={`${faqText.title} text-center`}
            ariaLabel="Título da seção"
          />
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          {data.items.map((item, i) => (
            <div
              key={item.id}
              className="editable-item rounded-xl border-l-4 border-l-gold bg-gold/10 border border-gold/30 shadow-sm"
            >
              <ItemToolbar
                onMoveUp={() => move(i, -1)}
                onMoveDown={() => move(i, 1)}
                onDelete={() =>
                  onChange({
                    ...data,
                    items: data.items.filter((it) => it.id !== item.id),
                  })
                }
                canMoveUp={i > 0}
                canMoveDown={i < data.items.length - 1}
              />
              <div className="px-5 py-4">
                <EditableText
                  as="input"
                  value={item.pergunta}
                  onChange={(v) => {
                    const items = [...data.items];
                    items[i] = { ...item, pergunta: v };
                    onChange({ ...data, items });
                  }}
                  className={faqText.pergunta}
                  ariaLabel={`Pergunta ${i + 1}`}
                />
              </div>
              <div className="px-5 pb-4 pt-0 border-t border-gold/20">
                <EditableText
                  value={item.resposta}
                  onChange={(v) => {
                    const items = [...data.items];
                    items[i] = { ...item, resposta: v };
                    onChange({ ...data, items });
                  }}
                  className="text-navy-700 text-sm md:text-base leading-relaxed pt-3"
                  ariaLabel={`Resposta ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
        <AddGhostCard
          className="mt-4"
          label="Adicionar pergunta"
          onClick={() =>
            onChange({
              ...data,
              items: [
                ...data.items,
                {
                  id: createId("faq"),
                  pergunta: "Nova pergunta?",
                  resposta: "Resposta...",
                },
              ],
            })
          }
        />

        <div className="mt-12 md:mt-16 flex justify-center">
          <div className={faqText.button}>
            <MessageCircle size={22} />
            <EditableText
              as="input"
              value={data.ctaText}
              onChange={(v) => onChange({ ...data, ctaText: v })}
              ariaLabel="Texto do botão de dúvidas"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
