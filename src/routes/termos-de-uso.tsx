import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de uso — Conecta Equipamentos Veterinários" },
      {
        name: "description",
        content:
          "Termos e condições de uso do site da Conecta Equipamentos Veterinários.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  const { config } = useSiteConfig();
  const dataAtualizacao = "26 de maio de 2026";

  return (
    <SiteShell>
      <article>
        <header className="container-edge pt-16 md:pt-24 pb-10">
          <Reveal>
            <span className="eyebrow">Termos</span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.05] max-w-3xl">
              Termos de uso
            </h1>
            <p className="mt-5 text-sm text-ink-soft">
              Última atualização: {dataAtualizacao}
            </p>
          </Reveal>
        </header>

        <div className="container-edge pb-24">
          <div className="max-w-3xl space-y-8 text-ink leading-relaxed">
            <Section title="1. Aceite dos termos">
              <p>
                Ao acessar e utilizar o site da {config.empresa.nome}, você
                concorda com estes termos. Se não concordar com algum item, por
                favor não utilize nossos serviços.
              </p>
            </Section>

            <Section title="2. Sobre o site">
              <p>
                Este site é uma vitrine institucional dos equipamentos
                veterinários distribuídos pela Conecta. Não é um site de
                e-commerce — não realizamos vendas diretamente pelo site. Todas
                as cotações passam por nosso time comercial após contato pelos
                formulários ou WhatsApp.
              </p>
            </Section>

            <Section title="3. Propriedade intelectual">
              <p>
                Marca, logo, textos, imagens e código deste site são de
                propriedade da Conecta ou licenciados a ela (por exemplo, imagens
                de produtos cedidas pela fabricante Shinova). Reprodução
                comercial sem autorização prévia por escrito é proibida.
              </p>
            </Section>

            <Section title="4. Conteúdo de terceiros (blog)">
              <p>
                Aceitamos submissões de artigos para o blog. Toda submissão
                passa por revisão editorial antes de publicação. Ao submeter um
                artigo, o autor:
              </p>
              <ul>
                <li>
                  Garante ser detentor dos direitos autorais ou ter autorização
                  para publicação.
                </li>
                <li>
                  Concede à Conecta o direito não-exclusivo de publicar,
                  formatar e distribuir o conteúdo no site.
                </li>
                <li>
                  Concorda que a Conecta pode rejeitar ou solicitar ajustes
                  editoriais antes da publicação.
                </li>
              </ul>
            </Section>

            <Section title="5. Disponibilidade e modificações">
              <p>
                Nos esforçamos para manter o site sempre disponível, mas não
                garantimos ausência de interrupções por manutenção, falha
                técnica ou força maior. Podemos modificar conteúdo, produtos
                ofertados ou estes termos a qualquer momento.
              </p>
            </Section>

            <Section title="6. Limitação de responsabilidade">
              <p>
                As informações técnicas dos produtos são fornecidas em boa fé,
                baseadas em material da fabricante Shinova. Recomendamos sempre
                confirmar especificações com nossa equipe comercial antes da
                aquisição. A Conecta não se responsabiliza por decisões
                comerciais tomadas exclusivamente com base no conteúdo do site.
              </p>
            </Section>

            <Section title="7. Foro">
              <p>
                Qualquer controvérsia relacionada ao uso deste site será dirimida
                no foro da comarca de {config.empresa.cidade}/
                {config.empresa.estado}, com renúncia a qualquer outro.
              </p>
            </Section>

            <div className="pt-4 hairline" />
            <p className="text-sm text-ink-soft">
              Veja também nossa{" "}
              <Link to="/politica-privacidade" className="underline text-conecta-blue">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-ink mb-3">{title}</h2>
      <div className="space-y-3 text-ink-soft [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
