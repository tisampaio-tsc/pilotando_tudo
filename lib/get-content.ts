import type { SiteContent } from "./content-schema";
import siteContent from "@/content/site.json";

export function getSiteContent(): SiteContent {
  return siteContent as SiteContent;
}
