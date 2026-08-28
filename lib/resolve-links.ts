import type { Contatos } from "./content-schema";

export function getWhatsappUrl(contatos: Contatos): string {
  return `https://wa.me/${contatos.whatsappNumber}?text=${encodeURIComponent(contatos.whatsappMessage)}`;
}

export function resolveHref(
  href: string,
  contatos: Contatos
): { url: string; external: boolean } {
  switch (href) {
    case "whatsapp":
      return { url: getWhatsappUrl(contatos), external: true };
    case "hotmart-oficina":
      return { url: contatos.hotmartOficina, external: true };
    case "hotmart-pilotando":
      return { url: contatos.hotmartPilotando, external: true };
    default:
      return {
        url: href,
        external: href.startsWith("http"),
      };
  }
}
