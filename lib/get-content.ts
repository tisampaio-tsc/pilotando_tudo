import type { SiteContent } from "./content-schema";
import { normalizeTheme } from "./theme";
import siteContent from "@/content/site.json";

export function getSiteContent(): SiteContent {
  const content = siteContent as unknown as SiteContent;
  return { ...content, tema: normalizeTheme(content.tema) };
}
