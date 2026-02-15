import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Direitos Reservados e Termos de Uso | Adriana Barbosa",
  description:
    "Política de direitos reservados, termos de uso e informações legais do site Adriana Barbosa - Cursos de costura.",
};

export default function PoliticaPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
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
        <p className="text-navy-600 text-sm mb-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-navy-700 text-base leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              1. Direitos autorais e propriedade intelectual
            </h2>
            <p>
              Todo o conteúdo deste site — textos, imagens, logotipos, layout e demais elementos — é de titularidade de
              Adriana Barbosa ou de licenciantes autorizados. É vedada a reprodução, distribuição, modificação ou uso
              comercial sem autorização prévia e por escrito. O uso permitido limita-se à navegação e à consulta para
              fins informativos e de aquisição dos produtos ofertados.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              2. Uso do site e dos conteúdos
            </h2>
            <p>
              Ao acessar e utilizar este site, você concorda em não utilizar o conteúdo para fins ilícitos, que atentem
              contra a honra ou a imagem de terceiros, ou que violem leis aplicáveis. As informações aqui apresentadas
              têm caráter informativo e podem ser alteradas a qualquer momento, sem aviso prévio, para correção ou
              atualização.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              3. Produtos, pagamento e plataforma de vendas
            </h2>
            <p>
              A venda dos cursos (Oficina da Calça Jeans e Pilotando Tudo) é realizada pela plataforma Hotmart. Ao
              clicar em links de compra, você será direcionado ao site da Hotmart, onde vigoram os termos, políticas de
              privacidade e condições de pagamento da própria plataforma. A responsabilidade pela transação comercial,
              reembolsos e suporte técnico de acesso ao curso é da Hotmart e do produtor, nos termos do contrato de
              adesão à plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              4. Contato e suporte
            </h2>
            <p>
              Para dúvidas sobre esta política, sobre os cursos ou sobre o uso do site, entre em contato por WhatsApp
              (11) 96061-4120 ou pelas redes sociais indicadas no rodapé. Responderemos no prazo razoável possível.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              5. Alterações
            </h2>
            <p>
              Esta política pode ser alterada a qualquer momento. A data da última atualização consta no topo da
              página. O uso continuado do site após alterações constitui aceite das novas condições. Recomenda-se a
              leitura periódica desta página.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">
              6. Lei aplicável e foro
            </h2>
            <p>
              Esta política e o uso do site estão sujeitos às leis da República Federativa do Brasil. Eventuais
              disputas serão submetidas ao foro da comarca do domicílio da produtora, com renúncia a qualquer outro, por
              mais privilegiado que seja.
            </p>
          </section>
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
