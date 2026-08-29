"use client";

import Image from "next/image";
import { Check, Lock } from "lucide-react";
import type { CursoItem, CursosSection } from "@/lib/content-schema";
import { cursosText } from "@/components/Cursos";
import EditableText from "./EditableText";

interface CursosEditProps {
  data: CursosSection;
  onChange: (data: CursosSection) => void;
}

function StringList({
  items,
  onChange,
  addLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
}) {
  return (
    <ul className="space-y-1.5 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <Check className="flex-shrink-0 text-gold mt-0.5" size={16} />
          <EditableText
            as="input"
            value={item}
            onChange={(v) => {
              const next = [...items];
              next[i] = v;
              onChange(next);
            }}
            className={`${cursosText.listItem} flex-1`}
            ariaLabel="Item da lista"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Remover item"
            className="text-white/50 hover:text-panel-danger text-xs shrink-0 mt-0.5"
          >
            ✕
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => onChange([...items, "Novo item"])}
          className="text-gold/80 hover:text-gold text-xs font-semibold flex items-center gap-1"
        >
          + {addLabel}
        </button>
      </li>
    </ul>
  );
}

/** Irmã editável do Cursos: título geral e, por curso, todos os textos e listas editáveis. */
export default function CursosEdit({ data, onChange }: CursosEditProps) {
  const updateCurso = (i: number, patch: Partial<CursoItem>) => {
    const cursos = [...data.cursos];
    cursos[i] = { ...cursos[i], ...patch };
    onChange({ ...data, cursos });
  };

  return (
    <section className="py-16 md:py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            as="input"
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={`${cursosText.title} text-center`}
            ariaLabel="Título da seção"
          />
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {data.cursos.map((curso, index) => {
            const isPilotando = index === 1;
            return (
              <article key={curso.id} className={cursosText.card}>
                <div className="relative h-48 sm:h-56 w-full bg-navy-800 overflow-hidden">
                  <Image
                    src={curso.image}
                    alt={curso.imageAlt}
                    fill
                    className={`object-cover w-full h-full ${
                      isPilotando ? "object-[center_calc(100%+40px)]" : ""
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0">
                    <EditableText
                      as="input"
                      value={curso.subtitle}
                      onChange={(v) => updateCurso(index, { subtitle: v })}
                      className={`${cursosText.subtitle} ${
                        isPilotando ? "text-gold-light font-bold" : "text-gold"
                      }`}
                      ariaLabel="Subtítulo do curso"
                    />
                    <EditableText
                      as="input"
                      value={curso.title}
                      onChange={(v) => updateCurso(index, { title: v })}
                      className={cursosText.cardTitle}
                      ariaLabel="Título do curso"
                    />
                    <EditableText
                      value={curso.description}
                      onChange={(v) => updateCurso(index, { description: v })}
                      className={cursosText.description}
                      ariaLabel="Descrição do curso"
                    />
                    <EditableText
                      as="input"
                      value={curso.learnLabel}
                      onChange={(v) => updateCurso(index, { learnLabel: v })}
                      className={cursosText.listLabel}
                      ariaLabel="Rótulo da lista 'o que você vai aprender'"
                    />
                    <StringList
                      items={curso.learnList}
                      onChange={(learnList) => updateCurso(index, { learnList })}
                      addLabel="Adicionar item"
                    />
                    <EditableText
                      as="input"
                      value={curso.bonusLabel}
                      onChange={(v) => updateCurso(index, { bonusLabel: v })}
                      className={cursosText.listLabel}
                      ariaLabel="Rótulo da lista de bônus"
                    />
                    <StringList
                      items={curso.bonusList}
                      onChange={(bonusList) => updateCurso(index, { bonusList })}
                      addLabel="Adicionar bônus"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-auto">
                    <div className={cursosText.button}>
                      <EditableText
                        as="input"
                        value={curso.buttonText}
                        onChange={(v) => updateCurso(index, { buttonText: v })}
                        className="text-center"
                        ariaLabel="Texto do botão"
                      />
                    </div>
                    <p className="text-white/60 text-xs text-center inline-flex items-center justify-center gap-1.5">
                      <Lock size={12} className="flex-shrink-0" />
                      Sua compra é segura.
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-white/50 text-xs text-center">
          Para adicionar ou remover um curso inteiro, peça ajuda — isso ainda
          não está disponível neste editor.
        </p>
      </div>
    </section>
  );
}
