import { Scissors, Shirt, DollarSign } from "lucide-react";

const cards = [
  {
    icon: Scissors,
    title: "É iniciante e nunca usou uma máquina",
    description:
      "Aprenda do zero com um método que já formou milhares de alunas.",
  },
  {
    icon: Shirt,
    title: "É costureira e quer aperfeiçoar a costura",
    description:
      "Técnicas de acabamento profissional e especialização em calça jeans.",
  },
  {
    icon: DollarSign,
    title: "Busca uma nova fonte de renda em casa",
    description:
      "Transforme a costura em negócio ou trabalho remoto com alta demanda.",
  },
];

export default function ParaVoce() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-navy-900 text-2xl md:text-3xl text-center mb-12 md:mb-16">
          Este site é para você que…
        </h2>
        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {cards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
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
          ))}
        </div>
      </div>
    </section>
  );
}
