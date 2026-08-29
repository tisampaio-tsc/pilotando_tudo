"use client";

import { Instagram, MessageCircle, BookOpen, Eye, EyeOff } from "lucide-react";
import type { FooterContent } from "@/lib/content-schema";
import { footerText } from "@/components/Footer";
import EditableText from "./EditableText";

interface FooterEditProps {
  footer: FooterContent;
  onChange: (footer: FooterContent) => void;
}

function VisibilityBadge({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Ocultar" : "Mostrar"}
      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-denim-dark flex items-center justify-center shadow"
    >
      {visible ? <Eye size={11} /> : <EyeOff size={11} />}
    </button>
  );
}

/**
 * Irmã editável do Footer: copyright e link de política tornam-se campos
 * editáveis; os 3 interruptores (Instagram, WhatsApp, links Hotmart) ganham
 * um selinho "olho" sobreposto no canto do ícone/botão real correspondente.
 */
export default function FooterEdit({ footer, onChange }: FooterEditProps) {
  return (
    <footer className="bg-navy-900 text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className={footerText.copyright}>
            © {new Date().getFullYear()}{" "}
            <EditableText
              as="input"
              value={footer.copyrightName}
              onChange={(v) => onChange({ ...footer, copyrightName: v })}
              className="inline-block w-40 text-white"
              ariaLabel="Nome no copyright"
            />
            . Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <div
              className={`relative p-2 rounded-full text-white/90 ${
                footer.showInstagram ? "" : "opacity-35"
              }`}
            >
              <Instagram size={22} />
              <VisibilityBadge
                visible={footer.showInstagram}
                onToggle={() =>
                  onChange({ ...footer, showInstagram: !footer.showInstagram })
                }
              />
            </div>
            <div
              className={`relative inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-full ${
                footer.showWhatsapp ? "" : "opacity-35"
              }`}
            >
              <MessageCircle size={20} />
              <span className="text-sm">Falar no WhatsApp</span>
              <VisibilityBadge
                visible={footer.showWhatsapp}
                onToggle={() =>
                  onChange({ ...footer, showWhatsapp: !footer.showWhatsapp })
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <div
            className={`relative inline-flex items-center gap-2 text-white/80 text-sm ${
              footer.showHotmartLinks ? "" : "opacity-35"
            }`}
          >
            <BookOpen size={16} />
            Oficina da Calça Jeans
            <BookOpen size={16} className="ml-2" />
            Pilotando Tudo
            <VisibilityBadge
              visible={footer.showHotmartLinks}
              onToggle={() =>
                onChange({
                  ...footer,
                  showHotmartLinks: !footer.showHotmartLinks,
                })
              }
            />
          </div>
          <EditableText
            as="input"
            value={footer.politicaLabel}
            onChange={(v) => onChange({ ...footer, politicaLabel: v })}
            className={`${footerText.politicaLabel} w-32 text-center`}
            ariaLabel="Texto do link de política"
          />
        </div>
      </div>
    </footer>
  );
}
