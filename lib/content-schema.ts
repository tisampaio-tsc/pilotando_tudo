import type { ThemeName } from "./theme";

export type IconName = "scissors" | "shirt" | "dollarSign";

export type SectionType =
  | "hero"
  | "paraVoce"
  | "cursos"
  | "autoridade"
  | "provaSocial"
  | "faq";

export interface NavLink {
  id: string;
  href: string;
  label: string;
  visible: boolean;
}

export interface ButtonLink {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "cta";
  external?: boolean;
}

export interface HeroSection {
  id: string;
  type: "hero";
  visible: boolean;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButton: ButtonLink;
  secondaryButton: ButtonLink;
  trustBadges: string[];
}

export interface ParaVoceCard {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

export interface ParaVoceSection {
  id: string;
  type: "paraVoce";
  visible: boolean;
  title: string;
  cards: ParaVoceCard[];
}

export interface CursoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  learnLabel: string;
  learnList: string[];
  bonusLabel: string;
  bonusList: string[];
  buttonText: string;
}

export interface CursosSection {
  id: string;
  type: "cursos";
  visible: boolean;
  title: string;
  cursos: CursoItem[];
}

export interface AutoridadeSection {
  id: string;
  type: "autoridade";
  visible: boolean;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  highlightsTitle: string;
  highlights: string[];
  buttonText: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  estrelas: number;
}

export interface ProvaSocialSection {
  id: string;
  type: "provaSocial";
  visible: boolean;
  title: string;
  depoimentos: Depoimento[];
}

export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface FaqSection {
  id: string;
  type: "faq";
  visible: boolean;
  title: string;
  items: FaqItem[];
  ctaText: string;
}

export type SiteSection =
  | HeroSection
  | ParaVoceSection
  | CursosSection
  | AutoridadeSection
  | ProvaSocialSection
  | FaqSection;

export interface SiteMeta {
  title: string;
  description: string;
  favicon: string;
  /** Endereço público do site, usado nos textos de divulgação. */
  url?: string;
}

export interface Contatos {
  whatsappNumber: string;
  whatsappMessage: string;
  instagram: string;
  hotmartOficina: string;
  hotmartPilotando: string;
}

export interface HeaderContent {
  logo: string;
  logoAlt: string;
  name: string;
  tagline: string;
  navLinks: NavLink[];
}

export interface FooterContent {
  copyrightName: string;
  showInstagram: boolean;
  showWhatsapp: boolean;
  showHotmartLinks: boolean;
  politicaLabel: string;
}

export interface PoliticaSection {
  title: string;
  content: string;
}

export interface PoliticaContent {
  pageTitle: string;
  pageDescription: string;
  lastUpdated: string;
  sections: PoliticaSection[];
}

export interface SiteContent {
  site: SiteMeta;
  tema: ThemeName;
  contatos: Contatos;
  header: HeaderContent;
  secoes: SiteSection[];
  footer: FooterContent;
  politica: PoliticaContent;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Destaque principal",
  paraVoce: "Este site é para você",
  cursos: "Cursos",
  autoridade: "Sobre Adriana",
  provaSocial: "Depoimentos",
  faq: "Perguntas frequentes",
};

export function createId(prefix = "item"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
