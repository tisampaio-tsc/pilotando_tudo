"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import type { Contatos, FaqSection } from "@/lib/content-schema";
import { getWhatsappUrl } from "@/lib/resolve-links";

interface FAQProps {
  data: FaqSection;
  contatos: Contatos;
}

export default function FAQ({ data, contatos }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsappUrl = getWhatsappUrl(contatos);

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
            {data.title}
          </h2>
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          {data.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden transition-all duration-200 min-h-[3.5rem] border-l-4 ${
                  isOpen
                    ? "border-l-gold bg-gold/10 border border-gold/30 shadow-sm"
                    : "border-l-gold/40 border border-navy-900/10 bg-white hover:bg-gold/5 hover:border-gold/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 transition-colors duration-200 rounded-xl ${
                    isOpen ? "bg-gold/5" : ""
                  }`}
                >
                  <span>{item.pergunta}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gold transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-navy-700 text-sm md:text-base leading-relaxed border-t border-gold/20">
                    {item.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold rounded-md transition-all duration-300"
          >
            <MessageCircle size={22} />
            {data.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
