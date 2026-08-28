import Link from "next/link";
import Image from "next/image";
import { Check, Lock } from "lucide-react";
import type { Contatos, CursosSection } from "@/lib/content-schema";
import { resolveHref } from "@/lib/resolve-links";

interface CursosProps {
  data: CursosSection;
  contatos: Contatos;
}

export default function Cursos({ data, contatos }: CursosProps) {
  return (
    <section id="cursos" className="py-16 md:py-24 bg-navy-900">
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
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {data.cursos.map((curso, index) => {
            const href = resolveHref(curso.href, contatos);
            const isPilotando = index === 1;

            return (
              <article
                key={curso.id}
                className="bg-gold/10 border border-gold/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 sm:h-56 w-full bg-navy-800 overflow-hidden">
                  <Image
                    src={curso.image}
                    alt={curso.imageAlt}
                    fill
                    className={`object-cover w-full h-full ${
                      isPilotando ? "object-[center_calc(100%+40px)]" : ""
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0">
                    <p
                      className={`text-sm font-medium uppercase tracking-wide mb-1 ${
                        isPilotando
                          ? "text-gold-light font-bold"
                          : "text-gold"
                      }`}
                    >
                      {curso.subtitle}
                    </p>
                    <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-3">
                      {curso.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed">
                      {curso.description}
                    </p>
                    <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                      {curso.learnLabel}
                    </p>
                    <ul className="space-y-1.5 mb-3 text-white/85 text-sm">
                      {curso.learnList.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="flex-shrink-0 text-gold mt-0.5"
                            size={16}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gold/90 text-xs font-semibold uppercase tracking-wide mb-2">
                      {curso.bonusLabel}
                    </p>
                    <ul className="space-y-1.5 mb-6 text-white/80 text-sm">
                      {curso.bonusList.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="flex-shrink-0 text-gold mt-0.5"
                            size={16}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-auto">
                    <Link
                      href={href.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-cta hover:bg-cta-hover text-cta-text font-bold rounded-[12px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgb(var(--c-cta)/0.5)]"
                    >
                      {curso.buttonText}
                    </Link>
                    <p className="text-white/60 text-xs text-center inline-flex items-center justify-center gap-1.5">
                      <Lock size={12} className="flex-shrink-0" />
                      Sua compra é segura.
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
