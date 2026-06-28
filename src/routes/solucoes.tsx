import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Hospital, Stethoscope, Scissors } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções por perfil | Conecta Equipamentos Veterinários" },
      { name: "description", content: "Estruture clínica, hospital, centro de especialidade ou pet shop com a Conecta. Pacotes de equipamentos Shinova sob medida, instalados, calibrados e com treinamento incluso." },
      { property: "og:title", content: "Soluções Conecta por perfil de clínica" },
      { property: "og:description", content: "Pacotes técnicos sob medida por perfil de operação veterinária, com instalação, calibração e treinamento inclusos." },
    ],
  }),
  component: SolucoesPage,
});

const ITENS = [
  { icon: Stethoscope, t: "Clínicas Veterinárias", d: "Equipe a clínica geral em um só fornecedor: consultório, atendimento, pequenos procedimentos e laboratório de rotina, tudo instalado e com a equipe treinada.", linhas: ["Monitoração", "Bioquímica", "Hematologia", "Imagem ambulatorial"] },
  { icon: Hospital, t: "Hospitais Veterinários", d: "Estruture centro cirúrgico, UTI e diagnóstico avançado com equipamentos integrados, comissionados e calibrados para operação de alto giro.", linhas: ["Centro cirúrgico", "UTI", "Anestesia", "Imagem completa"] },
  { icon: Building2, t: "Centros de Especialidade", d: "Equipamentos dedicados para oftalmologia, cardiologia, oncologia e reprodução, com a precisão que a especialidade exige.", linhas: ["Oftalmologia", "Cardiologia", "Reprodução", "Diagnóstico avançado"] },
  { icon: Scissors, t: "Pet Shops e Estética", d: "Estética veterinária completa com mesas hidráulicas, secadores e estruturas de banho e tosa robustas para o uso diário.", linhas: ["Mesas hidráulicas", "Banheiras inox", "Secadores", "Suporte"] },
];

function SolucoesPage() {
  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-12">
        <Reveal>
          <span className="eyebrow">Soluções por perfil</span>
          <h1 className="mt-5 font-serif text-5xl md:text-7xl text-ink leading-[1.02] max-w-4xl">
            Pacotes técnicos sob medida para cada operação veterinária.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Da clínica de bairro ao hospital de referência, montamos o conjunto de equipamentos certo para o tamanho, o foco clínico e o orçamento do seu projeto, com instalação, calibração e treinamento da equipe inclusos. Você equipa em etapas, sem precisar decidir tudo de uma vez.
          </p>
        </Reveal>
      </section>

      <section className="container-edge pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {ITENS.map((i) => (
            <Reveal key={i.t}>
              <div className="bg-paper border border-line rounded-3xl p-8 h-full">
                <div className="h-12 w-12 rounded-2xl bg-conecta-blue/10 text-conecta-blue flex items-center justify-center">
                  <i.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 font-serif text-3xl text-ink">{i.t}</h2>
                <p className="mt-3 text-ink-soft leading-relaxed">{i.d}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {i.linhas.map((l) => (
                    <li key={l} className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full bg-bone border border-line text-ink-soft">{l}</li>
                  ))}
                </ul>
                <Link to="/contato" className="mt-7 inline-flex text-sm text-conecta-blue hover:underline">
                  Montar um projeto →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
