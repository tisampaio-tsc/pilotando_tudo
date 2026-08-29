"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { Contatos, HeroSection } from "@/lib/content-schema";
import { resolveHref } from "@/lib/resolve-links";

interface HeroProps {
  data: HeroSection;
  contatos: Contatos;
}

export default function Hero({ data, contatos }: HeroProps) {
  const primary = resolveHref(data.primaryButton.href, contatos);
  const secondary = resolveHref(data.secondaryButton.href, contatos);

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-navy-900"
    >
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
          <h1 className={heroText.title}>{data.title}</h1>
          <p className={heroText.subtitle}>{data.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
            {primary.external ? (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className={heroText.primaryButton}
              >
                {data.primaryButton.text}
              </a>
            ) : (
              <Link href={primary.url} className={heroText.primaryButton}>
                {data.primaryButton.text}
              </Link>
            )}
            <a
              href={secondary.url}
              target={secondary.external ? "_blank" : undefined}
              rel={secondary.external ? "noopener noreferrer" : undefined}
              className={heroText.secondaryButton}
            >
              {data.secondaryButton.text}
            </a>
          </div>
          <div className={heroText.badgeGrid}>
            {data.trustBadges.map((badge) => (
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

/** Classes de texto reaproveitadas por HeroEdit.tsx no painel, para edição in-place idêntica ao site. */
export const heroText = {
  title:
    "font-display font-extrabold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 md:mb-6",
  subtitle: "text-white/95 text-base sm:text-lg mb-6 md:mb-8",
  primaryButton:
    "inline-flex items-center justify-center px-6 py-3.5 bg-action hover:bg-action-hover text-white font-semibold rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
  secondaryButton:
    "inline-flex items-center justify-center px-6 py-3.5 border-2 border-gold text-gold bg-transparent hover:bg-gold/10 font-semibold rounded-md transition-all duration-300",
  badgeGrid: "grid grid-cols-2 gap-x-4 gap-y-3 text-white/90 text-sm sm:text-base",
};
