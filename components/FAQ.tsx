"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/links";

const items = [
  {
    pergunta: "Qual a diferença entre os dois cursos?",
    resposta:
      "Oficina da Calça Jeans: foco em especialização completa na costura de calça jeans — qualquer modelo, do molde ao acabamento profissional. Pilotando Tudo: foco em dominar a máquina (reta e overloque), costurando peças piloto no jeans passo a passo; ideal para quem está começando ou quer montar peças para si, vender ou prestar serviços. Os dois se complementam.",
  },
  {
    pergunta: "Os cursos têm certificado?",
    resposta:
      "Sim. Ao concluir cada curso na Hotmart, você recebe o certificado de conclusão, que pode ser usado para comprovar sua qualificação.",
  },
  {
    pergunta: "Qual o valor do investimento?",
    resposta:
      "Os valores e condições de pagamento estão na página de cada curso na Hotmart. Acesse pelos botões \"Quero me inscrever\" (Oficina da Calça Jeans ou Pilotando Tudo) para ver preços e parcelamento de cada um.",
  },
  {
    pergunta: "Como funciona o acesso na Hotmart?",
    resposta:
      "Após a compra você recebe o acesso pela Hotmart. Pode assistir pelo celular ou computador, com acesso vitalício ao conteúdo.",
  },
  {
    pergunta: "Recebo os materiais?",
    resposta:
      "Todo o material necessário (listas, moldes quando aplicável, e-books no Pilotando Tudo etc.) está disponível dentro da plataforma para download conforme o módulo.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
            Dúvidas Frequentes
          </h2>
          <div className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full" aria-hidden />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
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
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold rounded-md transition-all duration-300"
          >
            <MessageCircle size={22} />
            Ainda tenho dúvidas
          </a>
        </div>
      </div>
    </section>
  );
}
