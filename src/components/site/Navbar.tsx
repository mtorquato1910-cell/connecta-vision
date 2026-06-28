import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import logoUrl from "@/assets/conecta-logo.png";
import { useLocale } from "@/hooks/useLocale";
import { buildWaLink, useSiteConfig } from "@/hooks/useSiteConfig";
import { CATEGORIAS, SITE } from "@/lib/site-data";
import { resolveCategoryIcon } from "@/lib/category-icons";
import { homeCatalogo } from "@/lib/catalog.functions";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // drawer mobile
  const [megaOpen, setMegaOpen] = useState(false); // mega-menu desktop
  const [mobileProdutos, setMobileProdutos] = useState(false); // accordion mobile
  const { t } = useLocale();
  const { config } = useSiteConfig();
  const megaRef = useRef<HTMLDivElement | null>(null);

  // Categorias com ícone. Base estática (SSR/sem flicker) + override ao vivo do
  // banco, para refletir imediatamente a escolha de ícone feita no admin.
  const { data: liveCatalogo } = useQuery({
    queryKey: ["home-catalogo"],
    queryFn: () => homeCatalogo(),
    staleTime: 5 * 60 * 1000,
  });
  const categorias = useMemo(() => {
    const iconeBySlug = new Map(
      (liveCatalogo?.categorias ?? []).map((c) => [c.slug, c.icone]),
    );
    return CATEGORIAS.map((c) => ({
      ...c,
      icone: iconeBySlug.get(c.slug) ?? c.icone,
    }));
  }, [liveCatalogo]);

  const NAV_I18N: { to: string; labelKey: string; mega?: boolean }[] = [
    { to: "/produtos", labelKey: "nav.products", mega: true },
    { to: "/solucoes", labelKey: "nav.solutions" },
    { to: "/blog", labelKey: "nav.blog" },
    { to: "/eventos", labelKey: "nav.events" },
    { to: "/sobre", labelKey: "nav.about" },
    { to: "/contato", labelKey: "nav.contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha mega-menu ao clicar fora ou apertar Escape.
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

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
          {NAV_I18N.map((n) =>
            n.mega ? (
              <div
                key={n.to}
                ref={megaRef}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  onClick={() => setMegaOpen((v) => !v)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-conecta-blue transition-colors"
                >
                  {t(n.labelKey)}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>

                {megaOpen && (
                  <div
                    role="menu"
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-3 w-[640px] xl:w-[720px]"
                  >
                    <div className="rounded-2xl border border-line bg-paper shadow-[0_30px_80px_-40px_rgba(28,30,120,0.4)] p-3">
                      <div className="grid grid-cols-2 gap-1">
                        {categorias.map((c) => {
                          const Icon = resolveCategoryIcon(c.icone, c.slug);
                          return (
                            <Link
                              key={c.slug}
                              to="/produtos/categoria/$slug"
                              params={{ slug: c.slug }}
                              role="menuitem"
                              onClick={() => setMegaOpen(false)}
                              className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-bone transition-colors"
                            >
                              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bone text-conecta-teal group-hover:border-conecta-teal/40 group-hover:text-conecta-blue transition">
                                <Icon className="h-4 w-4" aria-hidden />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-ink leading-tight">
                                  {c.nome}
                                </span>
                                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft mt-0.5">
                                  {c.qtd} equipamentos
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-2 border-t border-line pt-2 px-1">
                        <Link
                          to="/produtos"
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-conecta-blue hover:bg-bone transition"
                        >
                          Ver catálogo completo
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                            8 linhas
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-ink hover:text-conecta-blue transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-conecta-orange after:transition-all hover:after:w-full"
                activeProps={{ className: "text-conecta-blue after:!w-full" }}
              >
                {t(n.labelKey)}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
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
          className="lg:hidden h-11 w-11 rounded-full border border-line-strong flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <nav className="container-edge flex flex-col py-4 gap-1">
            {NAV_I18N.map((n) =>
              n.mega ? (
                <div key={n.to}>
                  <button
                    type="button"
                    onClick={() => setMobileProdutos((v) => !v)}
                    aria-expanded={mobileProdutos}
                    className="w-full flex items-center justify-between py-3 text-base font-medium min-h-[44px]"
                  >
                    {t(n.labelKey)}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileProdutos ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {mobileProdutos && (
                    <div className="pb-2 pl-1 flex flex-col">
                      <Link
                        to="/produtos"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-2.5 min-h-[44px] text-sm font-medium text-conecta-blue"
                      >
                        Ver tudo
                      </Link>
                      {categorias.map((c) => {
                        const Icon = resolveCategoryIcon(c.icone, c.slug);
                        return (
                          <Link
                            key={c.slug}
                            to="/produtos/categoria/$slug"
                            params={{ slug: c.slug }}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 py-2.5 min-h-[44px] text-sm text-ink-soft hover:text-ink"
                          >
                            <Icon className="h-4 w-4 text-conecta-teal shrink-0" aria-hidden />
                            {c.nome}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  className="py-3 min-h-[44px] flex items-center text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  {t(n.labelKey)}
                </Link>
              ),
            )}
            <a
              href={buildWaLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 btn-primary justify-center min-h-[44px]"
            >
              {t("nav.whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
