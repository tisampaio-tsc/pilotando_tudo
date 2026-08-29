"use client";

import { Scissors, Shirt, DollarSign } from "lucide-react";
import type { IconName, ParaVoceSection } from "@/lib/content-schema";
import { createId } from "@/lib/content-schema";
import { paraVoceText } from "@/components/ParaVoce";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";

const iconMap = {
  scissors: Scissors,
  shirt: Shirt,
  dollarSign: DollarSign,
};

interface ParaVoceEditProps {
  data: ParaVoceSection;
  onChange: (data: ParaVoceSection) => void;
}

/** Irmã editável do ParaVoce: título e, em cada card, título/descrição editáveis + mover/excluir + adicionar. */
export default function ParaVoceEdit({ data, onChange }: ParaVoceEditProps) {
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
            const Icon = iconMap[icon as IconName] ?? Scissors;
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
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-4">
                  <Icon size={28} />
                </div>
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
                  icon: "scissors",
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
