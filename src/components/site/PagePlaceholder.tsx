import { TopBar } from "./TopBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

export function PagePlaceholder({ title, eyebrow, children }: { title: string; eyebrow: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone">
      <TopBar />
      <Navbar />
      <main className="container-edge py-24 md:py-32 min-h-[60vh]">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl text-ink leading-[1.05] max-w-3xl">{title}</h1>
        <div className="mt-8 text-ink-soft text-lg max-w-2xl">
          {children ?? (
            <p>
              Esta seção está em construção. Em breve você poderá navegar pelos detalhes completos aqui mesmo.
              Enquanto isso, fale com a gente pelo WhatsApp para qualquer informação.
            </p>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
