"use client";

import { useState } from "react";
import type { ParaVoceSection } from "@/lib/content-schema";
import { createId } from "@/lib/content-schema";
import { DEFAULT_ICON } from "@/lib/icons";
import { paraVoceText } from "@/components/ParaVoce";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";
import IconPicker from "./IconPicker";

interface ParaVoceEditProps {
  data: ParaVoceSection;
  onChange: (data: ParaVoceSection) => void;
}

/**
 * Irmã editável do ParaVoce: título e, em cada card, ícone (escolhido numa
 * grade de opções), título/descrição editáveis + mover/excluir + adicionar.
 */
export default function ParaVoceEdit({ data, onChange }: ParaVoceEditProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState<string | null>(null);

  const moveCard = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= data.cards.length) return;
    const cards = [...data.cards];
    [cards[index], cards[target]] = [cards[target], cards[index]];
    onChange({ ...data, cards });
  };

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <EditableText
            as="input"
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={`${paraVoceText.title} text-center`}
            ariaLabel="Título da seção"
          />
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {data.cards.map(({ id, icon, title, description }, i) => {
            return (
              <div key={id} className={`editable-item ${paraVoceText.card}`}>
                <ItemToolbar
                  onMoveUp={() => moveCard(i, -1)}
                  onMoveDown={() => moveCard(i, 1)}
                  onDelete={() =>
                    onChange({
                      ...data,
                      cards: data.cards.filter((c) => c.id !== id),
                    })
                  }
                  canMoveUp={i > 0}
                  canMoveDown={i < data.cards.length - 1}
                />
                <IconPicker
                  className="mb-4"
                  value={icon}
                  open={iconPickerOpen === id}
                  onToggle={() =>
                    setIconPickerOpen((prev) => (prev === id ? null : id))
                  }
                  onChange={(newIcon) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], icon: newIcon };
                    onChange({ ...data, cards });
                    setIconPickerOpen(null);
                  }}
                />
                <EditableText
                  as="input"
                  value={title}
                  onChange={(v) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], title: v };
                    onChange({ ...data, cards });
                  }}
                  className={`${paraVoceText.cardTitle} text-center`}
                  ariaLabel={`Título do card ${i + 1}`}
                />
                <EditableText
                  value={description}
                  onChange={(v) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], description: v };
                    onChange({ ...data, cards });
                  }}
                  className={`${paraVoceText.cardDescription} text-center`}
                  ariaLabel={`Descrição do card ${i + 1}`}
                />
              </div>
            );
          })}
        </div>
        <AddGhostCard
          className="mt-6"
          label="Adicionar card"
          onClick={() =>
            onChange({
              ...data,
              cards: [
                ...data.cards,
                {
                  id: createId("card"),
                  icon: DEFAULT_ICON,
                  title: "Novo card",
                  description: "Descrição...",
                },
              ],
            })
          }
        />
      </div>
    </section>
  );
}
