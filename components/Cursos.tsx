import Link from "next/link";
import Image from "next/image";
import { Check, Lock } from "lucide-react";
import {
  HOTMART_OFICINA_CALCA_JEANS,
  HOTMART_PILOTANDO_TUDO,
} from "@/lib/links";

const oficinaCopy = {
  title: "OFICINA DA CALÇA JEANS",
  subtitle: "especialização",
  description:
    "A oficina da calça jeans é um curso pensado para quem deseja se especializar na costura de jeans com qualidade e técnica profissional. Ao concluir, você será capaz de costurar qualquer modelo de calça jeans com segurança, acabamento e estilo, abrindo portas para atuar no mercado da moda, empreender e ou criar peças únicas.",
  image: "/Assets/CapaCursoJeans.jpg",
  href: HOTMART_OFICINA_CALCA_JEANS,
  alt: "Calça jeans - Oficina da Calça Jeans",
  learnList: [
    "Molde e corte para calça jeans (qualquer modelo)",
    "Costura profissional: pesponto, reforços e sequência correta",
    "Cós, passante, zíper e barra com acabamento impecável",
    "Bolsos traseiros e frontais no padrão jeans",
    "Do básico ao avançado: retilínea, overlock e acabamentos",
  ],
  bonus: [
    "Metodologia passo a passo para não pular etapas",
    "Acesso vitalício para estudar no seu ritmo",
    "Suporte para tirar dúvidas",
  ],
};

const pilotandoCopy = {
  title: "PILOTANDO TUDO",
  subtitle: "domínio da máquina",
  description:
    "Neste curso 100% online, você vai aprender a costurar peças piloto no jeans de forma profissional, usando apenas a reta e o overloque — mesmo que esteja começando agora ou tenha pouca experiência. Com aulas práticas e diretas ao ponto, você se torna uma costureira confiante, capaz de montar peças para si, para vender ou prestar serviços para marcas de moda.",
  image: "/Assets/CursoPilotagem.jpg",
  href: HOTMART_PILOTANDO_TUDO,
  alt: "Máquina de costura - Pilotando Tudo",
  learnList: [
    "Costuras básicas, pesponto simples, duplo e triplo",
    "Pregar zíper na vista e bolso chapado",
    "Pala traseiro redonda e reta, fechamento estilo fechadeira",
    "Passante, cós anatômico, barra de calça",
    "Como tirar medidas e caseado na reta",
  ],
  bonus: [
    "E-book: linhas e aparelhos para jeans",
    "E-book: como interpretar ficha técnica",
    "Comunidade no WhatsApp para tirar dúvidas",
  ],
};

export default function Cursos() {
  return (
    <section id="cursos" className="py-16 md:py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-extrabold text-white text-2xl md:text-3xl">
            Nossos Cursos Premium
          </h2>
          <div className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full" aria-hidden />
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Oficina da Calça Jeans */}
          <article className="bg-gold/10 border border-gold/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col">
            <div className="relative h-48 sm:h-56 w-full bg-navy-800 overflow-hidden">
              <Image
                src={oficinaCopy.image}
                alt={oficinaCopy.alt}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <p className="text-gold text-sm font-medium uppercase tracking-wide mb-1">
                  {oficinaCopy.subtitle}
                </p>
                <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-3">
                  {oficinaCopy.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed">
                  {oficinaCopy.description}
                </p>
                <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                  O que você aprende
                </p>
                <ul className="space-y-1.5 mb-3 text-white/85 text-sm">
                  {oficinaCopy.learnList.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="flex-shrink-0 text-gold mt-0.5" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                  Diferenciais
                </p>
                <ul className="space-y-1.5 mb-6 text-white/80 text-sm">
                  {oficinaCopy.bonus.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="flex-shrink-0 text-gold mt-0.5" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-2 mt-auto">
                <Link
                  href={oficinaCopy.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-bold rounded-[12px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]"
                >
                  QUERO SER ESPECIALISTA EM JEANS
                </Link>
                <p className="text-white/60 text-xs text-center inline-flex items-center justify-center gap-1.5">
                  <Lock size={12} className="flex-shrink-0" />
                  Sua compra é segura.
                </p>
              </div>
            </div>
          </article>

          {/* Pilotando Tudo */}
          <article className="bg-gold/10 border border-gold/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col">
            <div className="relative h-48 sm:h-56 w-full bg-navy-800 overflow-hidden">
              <Image
                src={pilotandoCopy.image}
                alt={pilotandoCopy.alt}
                fill
                className="object-cover object-[center_calc(100%+40px)] w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <p className="text-gold-light text-sm font-bold uppercase tracking-wide mb-1">
                  {pilotandoCopy.subtitle}
                </p>
                <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-3">
                  {pilotandoCopy.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed">
                  {pilotandoCopy.description}
                </p>
                <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                  O que você aprende
                </p>
                <ul className="space-y-1.5 mb-3 text-white/85 text-sm">
                  {pilotandoCopy.learnList.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="flex-shrink-0 text-gold mt-0.5" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                  Bônus
                </p>
                <ul className="space-y-1.5 mb-6 text-white/80 text-sm">
                  {pilotandoCopy.bonus.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="flex-shrink-0 text-gold mt-0.5" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-2 mt-auto">
                <Link
                  href={pilotandoCopy.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-bold rounded-[12px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]"
                >
                  QUERO DOMINAR A MÁQUINA
                </Link>
                <p className="text-white/60 text-xs text-center inline-flex items-center justify-center gap-1.5">
                  <Lock size={12} className="flex-shrink-0" />
                  Sua compra é segura.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
