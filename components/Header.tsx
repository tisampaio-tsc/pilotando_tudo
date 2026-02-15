"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#cursos", label: "Cursos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#alunas", label: "Alunas" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 md:h-24">
        <Link href="#" className="flex items-center gap-2 md:gap-3">
          <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/Assets/logo.png"
              alt="Adriana Barbosa - Pilotando Tudo"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className="font-display font-semibold text-navy-900 text-sm md:text-base">
            ADRIANA BARBOSA
          </span>
          <span className="hidden sm:inline text-gold text-sm font-medium">
            Pilotando Tudo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-navy-900 font-medium text-sm hover:text-gold transition-colors"
            >
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-navy-900/10 shadow-lg">
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
