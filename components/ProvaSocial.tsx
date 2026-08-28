"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { ProvaSocialSection } from "@/lib/content-schema";

interface ProvaSocialProps {
  data: ProvaSocialSection;
}

export default function ProvaSocial({ data }: ProvaSocialProps) {
  const [index, setIndex] = useState(0);
  const total = data.depoimentos.length;

  if (total === 0) return null;

  const prev = () => setIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setIndex((i) => (i === total - 1 ? 0 : i + 1));
  const current = data.depoimentos[index];

  return (
    <section id="alunas" className="py-16 md:py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-extrabold text-white text-2xl md:text-3xl">
            {data.title}
          </h2>
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>

        <div className="relative">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 max-w-2xl mx-auto min-h-[220px] flex flex-col justify-center">
            <div className="flex gap-1 mb-4 justify-center">
              {Array.from({ length: current.estrelas }).map((_, i) => (
                <Star key={i} className="text-gold fill-gold" size={20} />
              ))}
            </div>
            <blockquote className="text-white/95 text-base md:text-lg leading-relaxed text-center mb-6">
              &ldquo;{current.texto}&rdquo;
            </blockquote>
            <cite className="text-gold font-semibold text-center not-italic">
              — {current.nome}
            </cite>
          </div>

          {total > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                aria-label="Depoimento anterior"
                onClick={prev}
                className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                {data.depoimentos.map((dep, i) => (
                  <button
                    key={dep.id}
                    type="button"
                    aria-label={`Ir ao depoimento ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === index ? "bg-gold" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Próximo depoimento"
                onClick={next}
                className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
