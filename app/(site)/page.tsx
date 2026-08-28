import SectionRenderer from "@/components/SectionRenderer";
import { getSiteContent } from "@/lib/get-content";

export default function Home() {
  const content = getSiteContent();

  return (
    <>
      {content.secoes.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          contatos={content.contatos}
        />
      ))}
    </>
  );
}
