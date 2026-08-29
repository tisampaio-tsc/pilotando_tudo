import Link from "next/link";
import { Instagram, MessageCircle, BookOpen } from "lucide-react";
import type { Contatos, FooterContent } from "@/lib/content-schema";
import { getWhatsappUrl } from "@/lib/resolve-links";

interface FooterProps {
  footer: FooterContent;
  contatos: Contatos;
}

export default function Footer({ footer, contatos }: FooterProps) {
  const whatsappUrl = getWhatsappUrl(contatos);

  return (
    <footer className="bg-navy-900 text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className={footerText.copyright}>
            © {new Date().getFullYear()} {footer.copyrightName}. Todos os
            direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {footer.showInstagram && (
              <a
                href={contatos.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full text-white/90 hover:text-gold hover:bg-white/10 transition-colors"
              >
                <Instagram size={22} />
              </a>
            )}
            {footer.showWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-full transition-colors"
              >
                <MessageCircle size={20} />
                <span className="text-sm">Falar no WhatsApp</span>
              </a>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {footer.showHotmartLinks && (
            <>
              <a
                href={contatos.hotmartOficina}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm transition-colors"
              >
                <BookOpen size={16} />
                Oficina da Calça Jeans
              </a>
              <a
                href={contatos.hotmartPilotando}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm transition-colors"
              >
                <BookOpen size={16} />
                Pilotando Tudo
              </a>
            </>
          )}
          <Link href="/politica" className={footerText.politicaLabel}>
            {footer.politicaLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}

/** Classes de texto reaproveitadas por FooterEdit.tsx no painel. */
export const footerText = {
  copyright: "text-white/90 text-sm",
  politicaLabel: "text-white/70 hover:text-gold text-sm transition-colors",
};
