import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export const Route = createFileRoute("/politica-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Conecta Equipamentos Veterinários" },
      {
        name: "description",
        content:
          "Política de privacidade e tratamento de dados pessoais conforme LGPD da Conecta Equipamentos Veterinários.",
      },
    ],
  }),
  component: PoliticaPage,
});

function PoliticaPage() {
  const { config } = useSiteConfig();
  const dataAtualizacao = "26 de maio de 2026";

  return (
    <SiteShell>
      <article>
        <header className="container-edge pt-16 md:pt-24 pb-10">
          <Reveal>
            <span className="eyebrow">Política</span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.05] max-w-3xl">
              Política de privacidade
            </h1>
            <p className="mt-5 text-sm text-ink-soft">
              Última atualização: {dataAtualizacao}
            </p>
          </Reveal>
        </header>

        <div className="container-edge pb-24">
          <div className="max-w-3xl space-y-8 text-ink leading-relaxed">
            <Section title="1. Quem somos">
              <p>
                <strong>{config.empresa.nome}</strong> (CNPJ {config.empresa.cnpj}),
                com sede em {config.empresa.endereco}, {config.empresa.cidade}/
                {config.empresa.estado}, CEP {config.empresa.cep}, é responsável
                pelo tratamento dos seus dados pessoais nos termos desta política
                e da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </Section>

            <Section title="2. Dados que coletamos">
              <p>Coletamos as seguintes categorias de dados pessoais:</p>
              <ul>
                <li>
                  <strong>Dados de contato:</strong> nome, e-mail, telefone,
                  WhatsApp, cidade e estado — informados voluntariamente em
                  formulários de orçamento, contato ou submissão de artigo.
                </li>
                <li>
                  <strong>Dados profissionais:</strong> nome do estabelecimento,
                  tipo (clínica, hospital, universidade) e cargo —
                  informados em formulários.
                </li>
                <li>
                  <strong>Dados de navegação:</strong> endereço IP, tipo de
                  dispositivo, sistema operacional, páginas visitadas e tempo de
                  permanência — coletados automaticamente via cookies analíticos.
                </li>
              </ul>
            </Section>

            <Section title="3. Como usamos seus dados">
              <ul>
                <li>Responder solicitações de orçamento e dúvidas técnicas.</li>
                <li>
                  Enviar materiais técnicos sobre nossos produtos (apenas se
                  autorizado).
                </li>
                <li>
                  Melhorar a experiência do site analisando padrões de navegação
                  agregados.
                </li>
                <li>
                  Cumprir obrigações legais e fiscais relacionadas a relações
                  comerciais.
                </li>
              </ul>
            </Section>

            <Section title="4. Cookies">
              <p>Nosso site usa duas categorias de cookies:</p>
              <ul>
                <li>
                  <strong>Essenciais:</strong> necessários para funcionamento do
                  site (sessão, preferência de idioma). Sempre ativos.
                </li>
                <li>
                  <strong>Analíticos:</strong> medições anônimas de uso (visitas,
                  páginas mais acessadas). Você pode aceitar ou rejeitar no
                  banner.
                </li>
              </ul>
            </Section>

            <Section title="5. Compartilhamento">
              <p>
                Não vendemos nem compartilhamos seus dados com terceiros para
                fins comerciais. Compartilhamos apenas com:
              </p>
              <ul>
                <li>
                  Prestadores de serviço técnicos (hospedagem, e-mail) que
                  operam sob obrigações de confidencialidade equivalentes às
                  nossas.
                </li>
                <li>
                  Autoridades quando exigido por lei ou ordem judicial.
                </li>
              </ul>
            </Section>

            <Section title="6. Seus direitos (LGPD Art. 18)">
              <p>Você pode, a qualquer momento, exercer os seguintes direitos:</p>
              <ul>
                <li>Confirmar se tratamos seus dados pessoais.</li>
                <li>Acessar uma cópia dos seus dados.</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>Revogar o consentimento a qualquer momento.</li>
                <li>Solicitar a portabilidade dos seus dados.</li>
              </ul>
              <p className="mt-3">
                Para exercer qualquer direito, envie um e-mail para{" "}
                <a
                  href={`mailto:${config.contato.email_comercial}?subject=LGPD - Solicita%C3%A7%C3%A3o de direito`}
                  className="underline text-conecta-blue"
                >
                  {config.contato.email_comercial}
                </a>{" "}
                com o assunto "LGPD — Solicitação de direito". Responderemos em
                até 15 dias úteis.
              </p>
            </Section>

            <Section title="7. Retenção e segurança">
              <p>
                Mantemos seus dados pelo tempo necessário para as finalidades
                informadas ou conforme exigência legal. Após esse prazo, os dados
                são anonimizados ou excluídos.
              </p>
              <p>
                Adotamos medidas técnicas e organizacionais para proteger seus
                dados contra acesso não autorizado, perda ou alteração.
              </p>
            </Section>

            <Section title="8. Mudanças nesta política">
              <p>
                Podemos atualizar esta política a qualquer momento. Mudanças
                materiais serão informadas no site ou por e-mail aos cadastrados.
              </p>
            </Section>

            <Section title="9. Contato do encarregado de dados (DPO)">
              <p>
                Dúvidas sobre privacidade ou esta política:{" "}
                <a
                  href={`mailto:${config.contato.email_comercial}`}
                  className="underline text-conecta-blue"
                >
                  {config.contato.email_comercial}
                </a>
              </p>
            </Section>

            <div className="pt-4 hairline" />
            <p className="text-sm text-ink-soft">
              Veja também os{" "}
              <Link to="/termos-de-uso" className="underline text-conecta-blue">
                Termos de uso
              </Link>{" "}
              do site.
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
      <div className="space-y-3 text-ink-soft [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
