import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
import logoUrl from "@/assets/conecta-logo.png";
import { NAV, SITE, waLink } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "bg-paper/85 backdrop-blur border-b border-line" : "bg-paper border-b border-transparent"
      }`}
    >
      <div className="container-edge flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="flex items-center" aria-label="Conecta — Home">
          <img src={logoUrl} alt="Conecta Equipamentos Veterinários" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-ink hover:text-conecta-blue transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-conecta-orange after:transition-all hover:after:w-full"
              activeProps={{ className: "text-conecta-blue after:!w-full" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button aria-label="Buscar" className="h-10 w-10 rounded-full border border-line-strong flex items-center justify-center hover:bg-bone transition">
            <Search className="h-4 w-4" />
          </button>
          <a href={`tel:+${SITE.phoneRaw}`} className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
          <a href={waLink()} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-medium px-4 py-2 transition">
            WhatsApp
          </a>
        </div>

        <button className="md:hidden h-10 w-10 rounded-full border border-line-strong flex items-center justify-center" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper">
          <nav className="container-edge flex flex-col py-4 gap-2">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="py-2 text-base font-medium" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <a href={waLink()} target="_blank" rel="noreferrer" className="mt-2 btn-primary justify-center">
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
