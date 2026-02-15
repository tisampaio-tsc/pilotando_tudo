import Link from "next/link";
import { Instagram, Facebook, Youtube, MessageCircle, BookOpen } from "lucide-react";
import {
  WHATSAPP_URL,
  INSTAGRAM_URL,
  HOTMART_OFICINA_CALCA_JEANS,
  HOTMART_PILOTANDO_TUDO,
} from "@/lib/links";

const socials = [
  { href: INSTAGRAM_URL, icon: Instagram, label: "Instagram" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className="text-white/90 text-sm">
            © {new Date().getFullYear()} Adriana Barbosa. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full text-white/90 hover:text-gold hover:bg-white/10 transition-colors"
              >
                <Icon size={22} />
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-full transition-colors"
            >
              <MessageCircle size={20} />
              <span className="text-sm">Falar no WhatsApp</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <a
            href={HOTMART_OFICINA_CALCA_JEANS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm transition-colors"
          >
            <BookOpen size={16} />
            Oficina da Calça Jeans
          </a>
          <a
            href={HOTMART_PILOTANDO_TUDO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm transition-colors"
          >
            <BookOpen size={16} />
            Pilotando Tudo
          </a>
          <Link
            href="/politica"
            className="text-white/70 hover:text-gold text-sm transition-colors"
          >
            Política de direitos reservados
          </Link>
        </div>
      </div>
    </footer>
  );
}
