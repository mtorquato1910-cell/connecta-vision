import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Conecta Equipamentos Veterinários" }, { name: "description", content: "Fale com um especialista da Conecta. WhatsApp, e-mail e telefone." }] }),
  component: () => (
    <div className="min-h-screen bg-bone">
      <TopBar />
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  ),
});
