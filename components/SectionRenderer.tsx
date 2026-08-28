import Hero from "@/components/Hero";
import ParaVoce from "@/components/ParaVoce";
import Cursos from "@/components/Cursos";
import Autoridade from "@/components/Autoridade";
import ProvaSocial from "@/components/ProvaSocial";
import FAQ from "@/components/FAQ";
import type { Contatos, SiteSection } from "@/lib/content-schema";

interface SectionRendererProps {
  section: SiteSection;
  contatos: Contatos;
}

export default function SectionRenderer({
  section,
  contatos,
}: SectionRendererProps) {
  if (!section.visible) return null;

  switch (section.type) {
    case "hero":
      return <Hero data={section} contatos={contatos} />;
    case "paraVoce":
      return <ParaVoce data={section} />;
    case "cursos":
      return <Cursos data={section} contatos={contatos} />;
    case "autoridade":
      return <Autoridade data={section} contatos={contatos} />;
    case "provaSocial":
      return <ProvaSocial data={section} />;
    case "faq":
      return <FAQ data={section} contatos={contatos} />;
    default:
      return null;
  }
}
