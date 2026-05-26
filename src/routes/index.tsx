import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Hero } from "@/components/site/Hero";
import { CategoriesBanner } from "@/components/site/CategoriesBanner";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { Principles } from "@/components/site/Principles";
import { AboutBanner } from "@/components/site/AboutBanner";
import { Testimonial } from "@/components/site/Testimonial";
import { ContactSection } from "@/components/site/ContactSection";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conecta — Equipamentos Veterinários Premium | Distribuidor oficial Shinova" },
      { name: "description", content: "Distribuidora brasileira oficial da linha Shinova. 230+ equipamentos veterinários em catálogo: anestesia, imagem, laboratório, odontologia, oftalmologia, grooming e mais. Importação direta, suporte técnico nacional." },
      { property: "og:title", content: "Conecta — Equipamentos Veterinários Premium" },
      { property: "og:description", content: "230+ equipamentos veterinários Shinova com importação direta e suporte técnico nacional." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

type Bloco = { id: string; visivel: boolean };

const DEFAULT_BLOCOS: Bloco[] = [
  { id: "hero", visivel: true },
  { id: "marcas", visivel: true },
  { id: "categorias", visivel: true },
  { id: "destaques", visivel: true },
  { id: "diferenciais", visivel: true },
  { id: "depoimentos", visivel: true },
  { id: "cta", visivel: true },
  { id: "contato", visivel: true },
];

const BLOCK_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  marcas: () => null,
  categorias: CategoriesBanner,
  destaques: FeaturedProducts,
  diferenciais: Principles,
  cta: AboutBanner,
  depoimentos: Testimonial,
  contato: ContactSection,
};

function HomePage() {
  const { data: blocos } = useQuery({
    queryKey: ["home-blocos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("conteudo_site")
        .select("valor")
        .eq("chave", "home.blocos")
        .maybeSingle();
      const v = data?.valor as { blocos?: Bloco[] } | null;
      if (!v?.blocos || !Array.isArray(v.blocos)) return DEFAULT_BLOCOS;
      return v.blocos;
    },
  });

  const lista = blocos ?? DEFAULT_BLOCOS;

  return (
    <div className="min-h-screen bg-bone">
      <TopBar />
      <Navbar />
      <main>
        {lista
          .filter((b) => b.visivel)
          .map((b) => {
            const Comp = BLOCK_COMPONENTS[b.id];
            if (!Comp) return null;
            return <Comp key={b.id} />;
          })}
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
