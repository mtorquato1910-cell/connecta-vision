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
import { getConteudoPublic } from "@/lib/admin.functions";
import { DEFAULT_HOME, type HomeConfig, type SecaoHome } from "@/lib/admin-home-repo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conecta | Equipamentos Veterinários Premium, Distribuidor Shinova" },
      {
        name: "description",
        content:
          "Distribuidor oficial Shinova no Brasil, com 300 clientes ativos. 230+ equipamentos veterinários importados, instalados, calibrados e com treinamento incluso. Entrega para todo o Brasil.",
      },
      {
        property: "og:title",
        content: "Conecta, Equipamentos Veterinários Premium | Distribuidor Shinova",
      },
      {
        property: "og:description",
        content:
          "230+ equipamentos veterinários Shinova instalados, calibrados e com treinamento incluso. 300 clientes ativos, entrega para todo o Brasil.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

// Mapeia cada seção configurável no admin (mesmos IDs de admin-home-repo)
// para o componente real da home. `marquee_top` não tem componente dedicado.
const BLOCK_COMPONENTS: Record<SecaoHome, React.ComponentType | null> = {
  hero: Hero,
  marquee_top: null,
  categorias: CategoriesBanner,
  destaques: FeaturedProducts,
  principios: Principles,
  sobre: AboutBanner,
  depoimento: Testimonial,
  cta_final: ContactSection,
};

function HomePage() {
  // Lê a MESMA chave/estrutura que o admin salva (home_config) via server fn
  // com service role — o role anon não tem mais SELECT em conteudo_site.
  const { data: config } = useQuery({
    queryKey: ["home-config"],
    queryFn: async () => {
      const rows = (await getConteudoPublic()) as Array<{ chave: string; valor: unknown }>;
      const row = rows.find((r) => r.chave === "home_config");
      return (row?.valor as HomeConfig) ?? DEFAULT_HOME;
    },
    initialData: DEFAULT_HOME,
  });

  const secoes = (config ?? DEFAULT_HOME).secoes.slice().sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen bg-bone">
      <TopBar />
      <Navbar />
      <main>
        {secoes
          .filter((s) => s.ativa)
          .map((s) => {
            const Comp = BLOCK_COMPONENTS[s.id];
            return Comp ? <Comp key={s.id} /> : null;
          })}
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
