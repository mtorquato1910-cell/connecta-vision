import { createFileRoute } from "@tanstack/react-router";
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

function HomePage() {
  return (
    <div className="min-h-screen bg-bone">
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <CategoriesBanner />
        <FeaturedProducts />
        <Principles />
        <AboutBanner />
        <Testimonial />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
