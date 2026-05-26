import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import logoUrl from "@/assets/conecta-logo.png";
import { CATEGORIAS, SITE, waLink } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-edge py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="bg-white/95 inline-block rounded-md px-3 py-2">
            <img src={logoUrl} alt="Conecta" className="h-10 w-auto" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/65 max-w-sm">
            Distribuidora brasileira oficial da linha Shinova de equipamentos veterinários. Importação direta, suporte
            técnico nacional, curadoria de catálogo.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Instagram, Linkedin, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-conecta-orange hover:border-conecta-orange transition" aria-label="Rede social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-conecta-orange-light mb-4">Catálogo</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link to="/produtos/categoria/$slug" params={{ slug: c.slug }} className="text-white/70 hover:text-white">
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-conecta-orange-light mb-4">Conecta</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="text-white/70 hover:text-white">Sobre</Link></li>
            <li><Link to="/solucoes" className="text-white/70 hover:text-white">Soluções</Link></li>
            <li><Link to="/contato" className="text-white/70 hover:text-white">Contato</Link></li>
            <li><Link to="/admin/login" className="text-white/50 hover:text-white">Acesso admin</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-conecta-orange-light mb-4">Atendimento</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-conecta-orange-light" /><a href={`tel:+${SITE.phoneRaw}`} className="hover:text-white text-white/75">{SITE.phone}</a></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-conecta-orange-light" /><a href={`mailto:${SITE.email}`} className="hover:text-white text-white/75">{SITE.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-conecta-orange-light" /><span className="text-white/75">{SITE.city}</span></li>
            <li>
              <a href={waLink()} target="_blank" rel="noreferrer" className="mt-1 inline-flex bg-[#25D366] text-white text-sm rounded-full px-4 py-2 hover:bg-[#1ebe57]">WhatsApp comercial</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-edge py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {SITE.name} · CNPJ {SITE.cnpj}</span>
          <span>Desenvolvido por <span className="text-white/70">Adabtech</span></span>
        </div>
      </div>
    </footer>
  );
}
