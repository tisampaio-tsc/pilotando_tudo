import type { ParaVoceSection } from "@/lib/content-schema";
import { getIcon } from "@/lib/icons";

interface ParaVoceProps {
  data: ParaVoceSection;
}

export default function ParaVoce({ data }: ParaVoceProps) {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className={paraVoceText.title}>{data.title}</h2>
          <div
            className="mt-2 w-16 h-0.5 bg-gold mx-auto rounded-full"
            aria-hidden
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {data.cards.map(({ id, icon, title, description }) => {
            const Icon = getIcon(icon);
            return (
              <div key={id} className={paraVoceText.card}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-4">
                  <Icon size={28} />
                </div>
                <h3 className={paraVoceText.cardTitle}>{title}</h3>
                <p className={paraVoceText.cardDescription}>{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Classes de texto reaproveitadas por ParaVoceEdit.tsx no painel. */
export const paraVoceText = {
  title: "font-display font-extrabold text-navy-900 text-2xl md:text-3xl",
  card:
    "bg-white border border-navy-900/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 text-center",
  cardTitle: "font-display font-semibold text-navy-900 text-lg mb-2",
  cardDescription: "text-navy-700 text-sm md:text-base leading-relaxed",
};
