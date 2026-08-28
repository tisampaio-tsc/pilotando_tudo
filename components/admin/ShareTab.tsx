"use client";

import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";
import { resolveHref } from "@/lib/resolve-links";

interface ShareItem {
  id: string;
  title: string;
  link: string;
  message: string;
}

interface ShareTabProps {
  content: SiteContent;
}

export default function ShareTab({ content }: ShareTabProps) {
  const items = useMemo(() => buildShareItems(content), [content]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2">Divulgar</h2>
        <p className="text-white/70 text-base leading-relaxed">
          Escolha o que você quer divulgar. O texto já vem pronto — se quiser,
          é só mudar. Ao tocar em <strong>Enviar pelo WhatsApp</strong>, você
          escolhe para quem mandar.
        </p>
      </div>

      {items.map((item) => (
        <ShareCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ShareCard({ item }: { item: ShareItem }) {
  const [message, setMessage] = useState(item.message);
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
      <div>
        <h3 className="font-display font-bold text-lg">{item.title}</h3>
        <p className="text-white/40 text-xs break-all">{item.link}</p>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        aria-label={`Mensagem para divulgar ${item.title}`}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-base text-white leading-relaxed resize-y"
      />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-base"
      >
        <MessageCircle size={22} /> Enviar pelo WhatsApp
      </a>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm min-h-[44px]"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-400" /> Copiado!
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
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm min-h-[44px]"
          >
            <Share2 size={18} /> Outros apps
          </button>
        )}
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
      title: "Meu site",
      link: siteUrl,
      message: `Oi! Dá uma olhada no meu site, lá você vê todos os meus cursos de costura:\n\n${siteUrl}`,
    },
  ];

  for (const section of content.secoes) {
    if (section.type !== "cursos") continue;
    for (const curso of section.cursos) {
      const link = resolveHref(curso.href, content.contatos).url;
      items.push({
        id: curso.id,
        title: curso.title,
        link,
        message: `Oi! Quero te contar sobre o curso ${curso.title}.\n\n${curso.description}\n\nPara saber mais e se inscrever:\n${link}`,
      });
    }
  }

  return items;
}
