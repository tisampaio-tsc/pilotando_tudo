"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const depoimentos = [
  {
    nome: "Maria S.",
    texto: "Curso maravilhoso! Aprendi do zero e hoje costuro calças jeans com qualidade. A Adriana explica com paciência e domínio total.",
    estrelas: 5,
  },
  {
    nome: "Ana Paula",
    texto: "Já era costureira mas queria me especializar. O método da Adriana mudou minha forma de trabalhar. Recomendo demais!",
    estrelas: 5,
  },
  {
    nome: "Carla R.",
    texto: "Consegui uma nova fonte de renda em casa. O conteúdo é completo e o suporte é excelente. Vale cada centavo.",
    estrelas: 5,
  },
];

export default function ProvaSocial() {
  const [index, setIndex] = useState(0);
  const total = depoimentos.length;

  const prev = () => setIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <section id="alunas" className="py-16 md:py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-white text-2xl md:text-3xl text-center mb-12 md:mb-16">
          O que nossas alunas dizem
        </h2>

        <div className="relative">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 max-w-2xl mx-auto min-h-[220px] flex flex-col justify-center">
            <div className="flex gap-1 mb-4 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="text-gold fill-gold"
                  size={20}
                />
              ))}
            </div>
            <blockquote className="text-white/95 text-base md:text-lg leading-relaxed text-center mb-6">
              &ldquo;{depoimentos[index].texto}&rdquo;
            </blockquote>
            <cite className="text-gold font-semibold text-center not-italic">
              — {depoimentos[index].nome}
            </cite>
          </div>

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
              {depoimentos.map((_, i) => (
                <button
                  key={i}
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
        </div>
      </div>
    </section>
  );
}
