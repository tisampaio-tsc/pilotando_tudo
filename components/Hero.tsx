"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/links";

const trustBadges = [
  "MÉTODO VALIDADO",
  "PARA QUEM?",
  "ACESSO VITALÍCIO",
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-navy-900"
    >
      {/* Imagem de fundo em todo o hero */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Assets/hero.jpg"
          alt=""
          fill
          className="object-cover object-top border-0 outline-none"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-navy-900/75"
          aria-hidden
        />
      </div>

      {/* Conteúdo à esquerda */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 md:mb-6">
            Domine a arte da costura e conquiste sua independência financeira.
          </h1>
          <p className="text-white/95 text-base sm:text-lg mb-6 md:mb-8">
            Aprenda com Adriana Barbosa as técnicas que transformam retalhos em
            alto padrão. Do zero ao acabamento profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
            <Link
              href="#cursos"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-gold hover:bg-gold-light text-white font-semibold rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              QUERO CONHECER OS CURSOS
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold rounded-md transition-all duration-300"
            >
              Falar no WhatsApp
            </a>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 text-sm sm:text-base">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <Check className="flex-shrink-0 text-gold" size={20} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
