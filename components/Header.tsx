"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { HeaderContent } from "@/lib/content-schema";

interface HeaderProps {
  header: HeaderContent;
}

export default function Header({ header }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const navLinks = header.navLinks.filter((link) => link.visible);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 md:h-24">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={header.logo}
              alt={header.logoAlt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className={headerText.name}>{header.name}</span>
          {header.tagline ? (
            <span className={headerText.tagline}>{header.tagline}</span>
          ) : null}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={headerText.navLink}>
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="md:hidden p-2 text-navy-900"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream border-b border-navy-900/10 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-2 px-3 text-navy-900 font-medium rounded-md hover:bg-gold/10"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/** Classes de texto reaproveitadas por HeaderEdit.tsx no painel. */
export const headerText = {
  name: "font-display font-semibold text-navy-900 text-sm md:text-base",
  tagline: "hidden sm:inline text-gold text-sm font-medium",
  navLink: "text-navy-900 font-medium text-sm hover:text-gold transition-colors",
};
