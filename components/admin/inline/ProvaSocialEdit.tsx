"use client";

import { Star } from "lucide-react";
import type { ProvaSocialSection } from "@/lib/content-schema";
import { createId } from "@/lib/content-schema";
import { provaSocialText } from "@/components/ProvaSocial";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";

interface ProvaSocialEditProps {
  data: ProvaSocialSection;
  onChange: (data: ProvaSocialSection) => void;
}

/**
 * Irmã editável do ProvaSocial: em vez do carrossel (1 por vez), mostra
 * TODOS os depoimentos empilhados e editáveis (nome, texto, estrelas).
 */
export default function ProvaSocialEdit({
  data,
  onChange,
}: ProvaSocialEditProps) {
  const move = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= data.depoimentos.length) return;
    const depoimentos = [...data.depoimentos];
    [depoimentos[i], depoimentos[target]] = [
      depoimentos[target],
      depoimentos[i],
    ];
    onChange({ ...data, depoimentos });
  };

  return (
    <section className="py-16 md:py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            as="input"
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={`${provaSocialText.title} text-center`}
            ariaLabel="Título da seção"
          />
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {data.depoimentos.map((dep, i) => (
            <div key={dep.id} className={`editable-item ${provaSocialText.card}`}>
              <ItemToolbar
                onMoveUp={() => move(i, -1)}
                onMoveDown={() => move(i, 1)}
                onDelete={() =>
                  onChange({
                    ...data,
                    depoimentos: data.depoimentos.filter(
                      (d) => d.id !== dep.id
                    ),
                  })
                }
                canMoveUp={i > 0}
                canMoveDown={i < data.depoimentos.length - 1}
              />
              <div className="flex gap-1 mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} estrela(s)`}
                    onClick={() => {
                      const depoimentos = [...data.depoimentos];
                      depoimentos[i] = { ...dep, estrelas: n };
                      onChange({ ...data, depoimentos });
                    }}
                  >
                    <Star
                      className={
                        n <= dep.estrelas
                          ? "text-gold fill-gold"
                          : "text-white/30"
                      }
                      size={22}
                    />
                  </button>
                ))}
              </div>
              <EditableText
                value={dep.texto}
                onChange={(v) => {
                  const depoimentos = [...data.depoimentos];
                  depoimentos[i] = { ...dep, texto: v };
                  onChange({ ...data, depoimentos });
                }}
                className={`${provaSocialText.quote} text-center`}
                ariaLabel="Texto do depoimento"
              />
              <div className="flex justify-center items-center gap-1">
                <span className={provaSocialText.nome}>—</span>
                <EditableText
                  as="input"
                  value={dep.nome}
                  onChange={(v) => {
                    const depoimentos = [...data.depoimentos];
                    depoimentos[i] = { ...dep, nome: v };
                    onChange({ ...data, depoimentos });
                  }}
                  className={`${provaSocialText.nome} text-center w-40`}
                  ariaLabel="Nome"
                />
              </div>
            </div>
          ))}
        </div>
        <AddGhostCard
          className="mt-6 max-w-2xl mx-auto"
          label="Adicionar depoimento"
          onClick={() =>
            onChange({
              ...data,
              depoimentos: [
                ...data.depoimentos,
                {
                  id: createId("dep"),
                  nome: "Nome",
                  texto: "Depoimento...",
                  estrelas: 5,
                },
              ],
            })
          }
        />
      </div>
    </section>
  );
}
