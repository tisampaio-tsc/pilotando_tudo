import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteContent } from "@/lib/get-content";

const content = getSiteContent();
const { politica } = content;

export const metadata = {
  title: politica.pageTitle,
  description: politica.pageDescription,
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PoliticaPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-navy-900 hover:text-gold font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar ao site
        </Link>

        <h1 className="font-display font-bold text-navy-900 text-2xl md:text-3xl mb-2">
          Política de Direitos Reservados e Termos de Uso
        </h1>
        <p className="text-navy-700 text-sm mb-10">
          Última atualização: {formatDate(politica.lastUpdated)}
        </p>

        <div className="space-y-8 text-navy-700 text-base leading-relaxed">
          {politica.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-900/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
