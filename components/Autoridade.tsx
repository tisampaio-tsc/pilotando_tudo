import Image from "next/image";

const aboutText = `Com mais de 30 anos de experiência na costura e especialização em pilotagem de máquinas de costura, dedico minha vida a ensinar e compartilhar o conhecimento que transforma vidas.

Aos 55 anos, entendo perfeitamente as necessidades e desafios de mulheres que buscam uma nova oportunidade profissional ou querem empreender na área de confecção.

Minha paixão pela costura começou cedo, e ao longo dos anos me especializei em técnicas avançadas de pilotagem e modelagem, especialmente em calças jeans, uma das peças mais desafiadoras e valorizadas do mercado.`;

export default function Autoridade() {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-navy-900 text-2xl md:text-3xl text-center mb-12 md:mb-16">
          Sobre Adriana Barbosa
        </h2>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-md bg-navy-900/5">
            <Image
              src="/Assets/Adriana/A1.jpeg"
              alt="Adriana Barbosa - Piloteira e especialista em costura"
              fill
              className="object-contain object-top rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-2xl" />
          </div>
          <div>
            <div className="space-y-4 text-navy-700 text-base md:text-lg leading-relaxed">
              {aboutText.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-2 text-navy-700">
              {[
                "Experiência comprovada de mais de 30 anos",
                "Metodologia prática e didática",
                "Foco em técnicas de mercado",
                "Acompanhamento e suporte contínuo",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
