import { motion } from "framer-motion";
import { Check, Phone, ArrowRight, Instagram, ExternalLink } from "lucide-react";
import logo from "@/assets/conecta-logo.png";
import { site, PHONE_DISPLAY, waLink } from "@/lib/site";
import { ProductGallery } from "@/components/ProductGallery";
import { FAQ } from "@/components/FAQ";
import { QuoteForm } from "@/components/QuoteForm";

// Site institucional com todos os produtos (pedido do cliente).
const SITE_URL = "https://conecta2lab.com.br";

// Imagem de aplicação: aceita caminho local (/products/x.jpg), URL completa, ou ID curto do Unsplash.
function appImg(img: string) {
  if (img.startsWith("/") || img.startsWith("http")) return img;
  return `https://images.unsplash.com/photo-${img}?auto=format&fit=crop&w=600&q=80`;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <Hero />
      <Benefits />
      <ProductGallery />
      <Applications />
      <Testimonial />
      <FAQ />
      <QuoteForm />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs py-2">
      <div className="max-w-[1600px] mx-auto px-6 text-center" dangerouslySetInnerHTML={{ __html: site.topbarHtml }} />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Conecta" className="h-20 md:h-24 w-auto" />
        </a>
        <div className="flex items-center gap-2 md:gap-4">
          <a href={`tel:+55${PHONE_DISPLAY.replace(/\D/g, "")}`} className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition">
            <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
          </a>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:border-accent hover:text-accent transition"
          >
            <ExternalLink className="w-4 h-4" /> Conheça nosso site
          </a>
          <a
            href="#orcamento"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition shadow-md hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="hidden sm:inline">Solicitar orçamento</span><span className="sm:hidden">Orçamento</span> →
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const h = site.hero;
  return (
    <section className="relative">
      <div className="max-w-[1600px] mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">{h.eyebrow}</p>
          <p className="text-sm text-muted-foreground mt-3">{h.kicker}</p>
          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl text-primary mt-6 leading-[1.02] tracking-tight"
            dangerouslySetInnerHTML={{ __html: h.titleHtml }}
          />
          {h.h2 && (
            <h2 className="font-display text-2xl md:text-3xl text-primary/80 mt-5 leading-snug max-w-xl">{h.h2}</h2>
          )}
          <p className="mt-8 text-lg text-foreground/75 max-w-xl leading-relaxed">{h.subtitle}</p>
          <ul className="mt-8 space-y-3">
            {h.bulletsHtml.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] text-foreground/85">
                <Check className="w-5 h-5 text-[var(--whatsapp)] shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: b }} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#galeria" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-lg">
              {h.ctaPrimary} <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#orcamento" className="text-sm font-semibold text-primary hover:text-accent transition story-link">
              Falar com especialista →
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                "1559757148-5c350d0d3c56",
                "1612531385446-f7e6d131e1d0",
                "1551601651-2a8555f1a136",
              ].map((id) => (
                <img
                  key={id}
                  src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=80&q=80`}
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                  alt=""
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: h.socialProofHtml }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="lg:sticky lg:top-24"
        >
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#f5f5f0] to-[#ebebe5] border border-border">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> {h.cardTag}
              </span>
              <em className="font-display text-primary">{h.cardTitle}</em>
            </div>
            <div
              className={`aspect-[4/5] rounded-2xl overflow-hidden bg-card shadow-2xl shadow-[var(--brand-navy-deep)]/20 ${
                (h.imageFit ?? "cover") === "contain" ? "flex items-center justify-center p-5" : ""
              }`}
            >
              <img
                src={h.cardImage}
                alt={h.cardTitle}
                className={`w-full h-full ${(h.imageFit ?? "cover") === "contain" ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/60">
              {h.cardStats.map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl text-primary">{n}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Benefits() {
  const b = site.benefits;
  return (
    <section className="py-24 md:py-32 border-y border-border bg-card">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-4">{b.eyebrow}</p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: b.titleHtml }}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
          {b.items.map((it) => (
            <div key={it.n}>
              <p className="font-display italic text-6xl text-accent mb-4">{it.n}</p>
              <h3 className="font-display text-2xl text-primary mb-3">{it.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Applications() {
  const a = site.applications;
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p className="eyebrow mb-4">{a.eyebrow}</p>
          <h2
            className="font-display text-4xl md:text-5xl text-primary leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: a.titleHtml }}
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {a.cards.map((c) => (
            <article key={c.title} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-accent transition">
              <div className="aspect-[4/3] overflow-hidden bg-white">
                <img
                  src={appImg(c.img)}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-primary mb-3">{c.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{c.p}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  const t = site.testimonial;
  return (
    <section className="relative py-28 md:py-36 bg-[var(--brand-navy-deep)] overflow-hidden">
      <span className="absolute top-8 left-6 md:top-12 md:left-16 font-display text-[12rem] md:text-[18rem] leading-none text-accent/15 select-none pointer-events-none">"</span>
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <blockquote className="font-display italic text-2xl md:text-4xl lg:text-5xl text-white leading-[1.25]">
          {t.quote}
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-4">
          <img src={t.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-accent/50" />
          <div className="text-left">
            <p className="text-white font-semibold">{t.name}</p>
            <p className="text-white/60 text-sm">{t.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--brand-navy-deep)] text-white/70 pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        {/* Marca */}
        <div>
          <span className="inline-flex bg-white rounded-2xl px-4 py-3 mb-5 shadow-sm">
            <img src={logo} alt="Conecta" className="h-12 md:h-14 w-auto" />
          </span>
          <p className="text-sm leading-relaxed text-white/60 max-w-xs">{site.footerBlurb}</p>
          <p className="text-xs leading-relaxed text-white/45 max-w-xs mt-5">{site.brand.addressFull}</p>
          <a
            href="https://www.instagram.com/conectavetbsb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-white/80 hover:text-accent transition"
          >
            <Instagram className="w-4 h-4" /> @conectavetbsb
          </a>
        </div>

        {/* Catálogo — cada item abre o produto na galeria */}
        <div>
          <p className="font-mono-tech text-[11px] tracking-widest text-accent uppercase mb-5">Catálogo</p>
          <ul className="space-y-2.5 text-sm">
            {site.products.map((p) => (
              <li key={p.id}>
                <a href={`#produto-${p.id}`} className="hover:text-accent transition">{p.shortName}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Atendimento — apenas informativo, nada clicável */}
        <div>
          <p className="font-mono-tech text-[11px] tracking-widest text-accent uppercase mb-5">Atendimento</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>WhatsApp · {PHONE_DISPLAY}</li>
            <li>Telefone · {PHONE_DISPLAY}</li>
            <li>{site.brand.addressShort}</li>
          </ul>
        </div>

        {/* Site institucional */}
        <div>
          <p className="font-mono-tech text-[11px] tracking-widest text-accent uppercase mb-5">Catálogo completo</p>
          <p className="text-sm text-white/60 mb-4">Veja todos os produtos no nosso site.</p>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition"
          >
            <ExternalLink className="w-4 h-4" /> Conheça nosso site
          </a>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <span>© 2026 {site.brand.companyName ?? "Conecta Equipamentos Veterinários"} · CNPJ {site.brand.cnpj}</span>
        <span>Site por Adabtech</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waLink(`Olá! Quero falar sobre a ${site.lineName.toLowerCase()} da Conecta.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--whatsapp)] text-white shadow-2xl shadow-[var(--whatsapp)]/40 hover:scale-105 transition"
      style={{ animation: "wa-pulse 3s ease-in-out infinite" }}
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.79 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.29.13-.302.244-.617.244-.946 0-.244-1.466-.985-1.706-1.085-.103-.046-.236-.087-.397-.087zM16.5 27.158a10.66 10.66 0 0 1-5.434-1.49l-3.795 1.21 1.234-3.66a10.612 10.612 0 0 1-2.06-6.276c0-5.876 4.78-10.656 10.655-10.656 5.876 0 10.656 4.78 10.656 10.656 0 5.876-4.78 10.656-10.656 10.656z"/>
      </svg>
      <style>{`@keyframes wa-pulse { 0%,90%,100% { transform: translateY(0); } 95% { transform: translateY(-6px); } }`}</style>
    </a>
  );
}
