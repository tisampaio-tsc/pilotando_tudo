import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { AutoridadeSection, Contatos } from "@/lib/content-schema";
import { getWhatsappUrl } from "@/lib/resolve-links";
import { renderInlineMarkdown } from "@/lib/render-markdown";

interface AutoridadeProps {
  data: AutoridadeSection;
  contatos: Contatos;
}

export default function Autoridade({ data, contatos }: AutoridadeProps) {
  const whatsappUrl = getWhatsappUrl(contatos);

  return (
    <section id="sobre" className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
            {data.title}
          </h2>
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative rounded-[24px] overflow-hidden aspect-[3/4] max-w-md bg-navy-900/5 border border-navy-800/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_10px_20px_-5px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(0,0,0,0.08)]">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover object-[50%_35%] rounded-[24px]"
              sizes="(max-width: 1024px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-[24px]" />
          </div>
          <div className="max-w-prose">
            <div className="text-navy-700 text-base md:text-lg leading-relaxed [&>p]:mb-5 last:[&>p]:mb-0">
              {data.paragraphs.map((paragraph) => (
                <p key={paragraph}>{renderInlineMarkdown(paragraph)}</p>
              ))}
            </div>
            <p className="mt-8 text-sm font-semibold text-navy-800 uppercase tracking-wide">
              {data.highlightsTitle}
            </p>
            <ul className="mt-2 space-y-2 text-navy-700">
              {data.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-check font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold rounded-md transition-all duration-300"
              >
                <MessageCircle size={22} aria-hidden />
                {data.buttonText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
