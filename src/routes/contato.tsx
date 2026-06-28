import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { ContactSection } from "@/components/site/ContactSection";
import { SITE } from "@/lib/site-data";
import { buildWaLink, useSiteConfig } from "@/hooks/useSiteConfig";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Conecta Equipamentos Veterinários" },
      { name: "description", content: "Fale com nosso time comercial e técnico. Atendimento por WhatsApp, telefone e e-mail em todo o Brasil." },
      { property: "og:title", content: "Fale com a Conecta" },
      { property: "og:description", content: "Atendimento técnico-comercial em todo o Brasil." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const { config } = useSiteConfig();
  const c = config.contato;
  const e = config.empresa;
  const telefone = c.telefone_principal || SITE.phone;
  const whatsapp = c.whatsapp || SITE.phone;
  const email = c.email_comercial || SITE.email;
  const cidade = e.cidade ? `${e.cidade}/${e.estado}` : SITE.city;
  const cnpj = e.cnpj || SITE.cnpj;

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-12">
        <Reveal>
          <span className="eyebrow">Contato</span>
          <h1 className="mt-5 font-serif text-5xl md:text-7xl text-ink leading-[1.02] max-w-4xl">
            Fale com gente que entende de equipamento veterinário.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Atendemos clínicas em todo o Brasil. Escolha o canal mais confortável — respondemos rápido.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Info icon={MessageCircle} t="WhatsApp" v={whatsapp} href={buildWaLink()} cta="Conversar agora" />
          <Info icon={Phone} t="Telefone" v={telefone} href={`tel:+${c.telefone_principal_raw || SITE.phoneRaw}`} cta="Ligar" />
          <Info icon={Mail} t="E-mail comercial" v={email} href={`mailto:${email}`} cta="Enviar e-mail" />
          <Info icon={MapPin} t="Sede" v={cidade} cta={cnpj} />
        </div>
      </section>

      <ContactSection />
    </SiteShell>
  );
}

function Info({ icon: Icon, t, v, href, cta }: { icon: typeof Mail; t: string; v: string; href?: string; cta: string }) {
  const body = (
    <div className="bg-paper border border-line rounded-3xl p-6 h-full transition hover:border-conecta-blue/30 hover:-translate-y-1">
      <div className="h-10 w-10 rounded-full bg-conecta-orange/15 text-conecta-orange flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-5 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft">{t}</div>
      <div className="mt-1 font-serif text-xl text-ink">{v}</div>
      <div className="mt-4 text-sm text-conecta-blue">{cta}</div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{body}</a> : <div>{body}</div>;
}
