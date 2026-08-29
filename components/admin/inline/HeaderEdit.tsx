"use client";

import Image from "next/image";
import type { HeaderContent } from "@/lib/content-schema";
import { headerText } from "@/components/Header";
import EditableText from "./EditableText";

interface HeaderEditProps {
  header: HeaderContent;
  onChange: (header: HeaderContent) => void;
}

/**
 * Irmã editável do Header: mesma barra, mesma fonte, mas nome, tagline e
 * itens do menu tornam-se campos editáveis no lugar. Sem menu mobile (não
 * faz sentido abrir dropdown durante a edição).
 */
export default function HeaderEdit({ header, onChange }: HeaderEditProps) {
  return (
    <header className="relative bg-cream/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 md:h-24 gap-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={header.logo}
              alt={header.logoAlt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <EditableText
            as="input"
            value={header.name}
            onChange={(v) => onChange({ ...header, name: v })}
            className={`${headerText.name} min-w-[6rem]`}
            ariaLabel="Nome no menu"
          />
          <EditableText
            as="input"
            value={header.tagline}
            onChange={(v) => onChange({ ...header, tagline: v })}
            className={`${headerText.tagline} min-w-[5rem]`}
            placeholder="Tagline"
            ariaLabel="Tagline"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 shrink-0">
          {header.navLinks.map((link, i) => (
            <EditableText
              key={link.id}
              as="input"
              value={link.label}
              onChange={(v) => {
                const navLinks = [...header.navLinks];
                navLinks[i] = { ...link, label: v };
                onChange({ ...header, navLinks });
              }}
              className={`${headerText.navLink} text-center w-24`}
              ariaLabel={`Item de menu ${i + 1}`}
            />
          ))}
        </nav>
      </div>

      <div className="md:hidden px-4 pb-3 flex flex-wrap gap-2">
        {header.navLinks.map((link, i) => (
          <EditableText
            key={link.id}
            as="input"
            value={link.label}
            onChange={(v) => {
              const navLinks = [...header.navLinks];
              navLinks[i] = { ...link, label: v };
              onChange({ ...header, navLinks });
            }}
            className={`${headerText.navLink} bg-white/60 rounded-md px-2 py-1 w-24 text-center`}
            ariaLabel={`Item de menu ${i + 1}`}
          />
        ))}
      </div>
    </header>
  );
}
