"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { HeroSection } from "@/lib/content-schema";
import { heroText } from "@/components/Hero";
import EditableText from "./EditableText";
import ItemToolbar from "./ItemToolbar";
import AddGhostCard from "./AddGhostCard";

interface HeroEditProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

/** Irmã editável do Hero: título, subtítulo, textos dos botões e selos de confiança editáveis no lugar. */
export default function HeroEdit({ data, onChange }: HeroEditProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-navy-900">
      <div className="absolute inset-0 z-0">
        <Image
          src={data.backgroundImage}
          alt=""
          fill
          className="object-cover object-top border-0 outline-none"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-navy-900/75" aria-hidden />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <EditableText
            value={data.title}
            onChange={(v) => onChange({ ...data, title: v })}
            className={heroText.title}
            ariaLabel="Título principal"
          />
          <EditableText
            value={data.subtitle}
            onChange={(v) => onChange({ ...data, subtitle: v })}
            className={heroText.subtitle}
            ariaLabel="Subtítulo"
          />
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
            <div className={heroText.primaryButton}>
              <EditableText
                as="input"
                value={data.primaryButton.text}
                onChange={(v) =>
                  onChange({
                    ...data,
                    primaryButton: { ...data.primaryButton, text: v },
                  })
                }
                className="text-center text-white"
                ariaLabel="Texto do botão principal"
              />
            </div>
            <div className={heroText.secondaryButton}>
              <EditableText
                as="input"
                value={data.secondaryButton.text}
                onChange={(v) =>
                  onChange({
                    ...data,
                    secondaryButton: { ...data.secondaryButton, text: v },
                  })
                }
                className="text-center text-gold"
                ariaLabel="Texto do botão WhatsApp"
              />
            </div>
          </div>
          <div className={heroText.badgeGrid}>
            {data.trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="flex-shrink-0 text-gold" size={20} />
                <EditableText
                  as="input"
                  value={badge}
                  onChange={(v) => {
                    const trustBadges = [...data.trustBadges];
                    trustBadges[i] = v;
                    onChange({ ...data, trustBadges });
                  }}
                  className="flex-1"
                  ariaLabel={`Selo de confiança ${i + 1}`}
                />
                <ItemToolbar
                  className="ml-1"
                  onDelete={() => {
                    const trustBadges = data.trustBadges.filter(
                      (_, j) => j !== i
                    );
                    onChange({ ...data, trustBadges });
                  }}
                />
              </div>
            ))}
          </div>
          <AddGhostCard
            className="mt-3 max-w-xs"
            label="Adicionar selo"
            onClick={() =>
              onChange({
                ...data,
                trustBadges: [...data.trustBadges, "Novo selo"],
              })
            }
          />
        </div>
      </div>
    </section>
  );
}
