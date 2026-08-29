"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  CheckCheck,
  Copy,
  Globe,
  Link as LinkIcon,
  MessageCircle,
  Share2,
} from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";
import { resolveHref } from "@/lib/resolve-links";
import StitchDivider from "./StitchDivider";
import EditableText from "./inline/EditableText";

interface ShareItem {
  id: string;
  kind: "site" | "curso";
  title: string;
  link: string;
  message: string;
  image?: string;
  imageAlt?: string;
}

interface ShareTabProps {
  content: SiteContent;
}

export default function ShareTab({ content }: ShareTabProps) {
  const items = useMemo(() => buildShareItems(content), [content]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-denim-light text-denim mb-3">
          <Share2 size={26} />
        </div>
        <h2 className="font-semibold text-2xl mb-1 text-panel-ink">Divulgar</h2>
        <StitchDivider className="mx-auto mb-3" />
        <p className="text-panel-muted text-base leading-relaxed max-w-md mx-auto">
          Escolha o que você quer divulgar. O texto já vem pronto — se quiser,
          é só tocar nele e mudar. Depois toque em{" "}
          <strong className="text-panel-ink">Enviar pelo WhatsApp</strong> e
          escolha para quem mandar.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <ShareCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ShareCard({ item }: { item: ShareItem }) {
  const [message, setMessage] = useState(item.message);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const isSite = item.kind === "site";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ text: message });
    } catch {
      /* usuária cancelou o compartilhamento */
    }
  };

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="rounded-2xl border-2 border-dashed border-stitch/35 bg-panel-surface shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-4 pb-3">
        <div
          className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 ${
            isSite ? "border-denim/30 bg-denim-light" : "border-stitch/30 bg-stitch/10"
          }`}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-denim">
              <Globe size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1 ${
              isSite ? "bg-denim-light text-denim-dark" : "bg-stitch/15 text-stitch"
            }`}
          >
            {isSite ? "Seu site" : "Curso"}
          </span>
          <h3 className="font-semibold text-panel-ink leading-snug truncate">
            {item.title}
          </h3>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-panel-muted text-xs mt-0.5 hover:text-denim transition-colors max-w-full"
          >
            <LinkIcon size={12} className="shrink-0" />
            <span className="truncate">{item.link}</span>
            {linkCopied && (
              <span className="text-panel-success shrink-0 font-semibold">
                Copiado!
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-panel-muted text-xs mb-1.5">
          Assim vai aparecer no WhatsApp — toque no texto para mudar:
        </p>
        <div className="rounded-2xl bg-[#e9f5db] p-3">
          <div className="relative ml-auto max-w-[92%] bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-3 py-2 shadow-sm">
            <EditableText
              value={message}
              onChange={setMessage}
              className="text-[#0c1a12] text-sm leading-relaxed whitespace-pre-wrap"
              ariaLabel={`Mensagem para divulgar ${item.title}`}
            />
            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#5b6b63]">
              agora
              <CheckCheck size={13} className="text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fabric w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-base transition-colors"
        >
          <MessageCircle size={22} /> Enviar pelo WhatsApp
        </a>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-panel-bg border border-panel-border hover:bg-denim-light rounded-lg font-semibold text-sm text-panel-ink min-h-[44px] transition-colors"
          >
            {copied ? (
              <>
                <Check size={18} className="text-panel-success" /> Copiado!
              </>
            ) : (
              <>
                <Copy size={18} /> Copiar texto
              </>
            )}
          </button>
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-panel-bg border border-panel-border hover:bg-denim-light rounded-lg font-semibold text-sm text-panel-ink min-h-[44px] transition-colors"
            >
              <Share2 size={18} /> Outros apps
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function buildShareItems(content: SiteContent): ShareItem[] {
  const siteUrl = (
    content.site.url ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/$/, "");

  const items: ShareItem[] = [
    {
      id: "site",
      kind: "site",
      title: "Meu site",
      link: siteUrl,
      message: `Oi! Dá uma olhada no meu site, lá você vê todos os meus cursos de costura:\n\n${siteUrl}`,
      image: content.header.logo,
      imageAlt: content.header.logoAlt,
    },
  ];

  for (const section of content.secoes) {
    if (section.type !== "cursos") continue;
    for (const curso of section.cursos) {
      const link = resolveHref(curso.href, content.contatos).url;
      items.push({
        id: curso.id,
        kind: "curso",
        title: curso.title,
        link,
        message: `Oi! Quero te contar sobre o curso ${curso.title}.\n\n${curso.description}\n\nPara saber mais e se inscrever:\n${link}`,
        image: curso.image,
        imageAlt: curso.imageAlt,
      });
    }
  }

  return items;
}
