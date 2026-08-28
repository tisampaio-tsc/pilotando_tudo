import { Scissors, Shirt, DollarSign } from "lucide-react";
import type { IconName, ParaVoceSection } from "@/lib/content-schema";

const iconMap = {
  scissors: Scissors,
  shirt: Shirt,
  dollarSign: DollarSign,
};

interface ParaVoceProps {
  data: ParaVoceSection;
}

export default function ParaVoce({ data }: ParaVoceProps) {
  return (
    <section className="py-16 md:py-24 bg-[#faf9f7]">
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
        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {data.cards.map(({ id, icon, title, description }) => {
            const Icon = iconMap[icon as IconName] ?? Scissors;
            return (
              <div
                key={id}
                className="bg-white border border-navy-900/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-4">
                  <Icon size={28} />
                </div>
                <h3 className="font-display font-semibold text-navy-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-navy-700 text-sm md:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
