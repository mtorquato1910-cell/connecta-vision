import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import logoUrl from "@/assets/conecta-logo.png";
import { useLocale } from "@/hooks/useLocale";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { buildWaLink, useSiteConfig } from "@/hooks/useSiteConfig";
import { SITE } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const { config } = useSiteConfig();

  const NAV_I18N = [
    { to: "/produtos", labelKey: "nav.products" },
    { to: "/solucoes", labelKey: "nav.solutions" },
    { to: "/blog", labelKey: "nav.blog" },
    { to: "/eventos", labelKey: "nav.events" },
    { to: "/sobre", labelKey: "nav.about" },
    { to: "/contato", labelKey: "nav.contact" },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-paper/85 backdrop-blur border-b border-line"
          : "bg-paper border-b border-transparent"
      }`}
    >
      <div className="container-edge flex h-[72px] items-center justify-between gap-4 sm:gap-6">
        <Link to="/" className="flex items-center shrink-0" aria-label="Conecta, Home">
          <img
            src={logoUrl}
            alt="Conecta Equipamentos Veterinários"
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_I18N.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-ink hover:text-conecta-blue transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-conecta-orange after:transition-all hover:after:w-full"
              activeProps={{ className: "text-conecta-blue after:!w-full" }}
            >
              {t(n.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <LocaleSwitcher />
          <a
            href={`tel:+${config.contato.telefone_principal_raw || SITE.phoneRaw}`}
            className="hidden xl:flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
          >
            <Phone className="h-4 w-4" />
            {config.contato.telefone_principal || SITE.phone}
          </a>
          <a
            href={buildWaLink()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-medium px-4 py-2 transition"
          >
            {t("nav.whatsapp")}
          </a>
        </div>

        <button
          className="lg:hidden h-10 w-10 rounded-full border border-line-strong flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <nav className="container-edge flex flex-col py-4 gap-2">
            {NAV_I18N.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-2 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {t(n.labelKey)}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-line">
              <p className="text-xs font-mono uppercase tracking-wider text-ink-soft mb-2">
                Idioma
              </p>
              <LocaleSwitcher variant="drawer" />
            </div>
            <a
              href={buildWaLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 btn-primary justify-center"
            >
              {t("nav.whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
