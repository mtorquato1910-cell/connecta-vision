import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { site } from "@/lib/site";

const products = site.products;

// Miniatura com carrossel no hover: ao passar o mouse pula para a foto 2 e
// avanca a cada 3s em loop; ao sair volta para a foto 1. Produto inteiro via
// object-contain. Se houver apenas 1 imagem, comporta-se como imagem estatica.
function HoverCarouselImg({
  images,
  alt,
  imgClassName,
  showDots = false,
}: {
  images: string[];
  alt: string;
  imgClassName?: string;
  showDots?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const multi = images.length > 1;

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = () => {
    if (!multi) return;
    stop();
    setIdx(1);
    intervalRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  const reset = () => {
    stop();
    setIdx(0);
  };

  // Limpa o interval no unmount.
  useEffect(() => () => stop(), []);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={start}
      onMouseLeave={reset}
      onFocus={start}
      onBlur={reset}
    >
      <img
        src={images[idx]}
        alt={alt}
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/products/placeholder.jpg"; }}
        className={imgClassName}
      />
      {showDots && multi && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === idx ? "w-4 bg-accent" : "w-1 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductGallery() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (selected) {
      setImgIdx(0);
      document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  // Deep-link do rodapé (#produto-<id>) abre o produto correspondente.
  useEffect(() => {
    const openFromHash = () => {
      const m = window.location.hash.match(/^#produto-(.+)$/);
      if (m) {
        const p = products.find((x) => x.id === m[1]);
        if (p) setSelected(p);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section id="galeria" className="py-20 sm:py-24 md:py-32 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto container-x">
        {!selected && (
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="eyebrow mb-4">{site.gallery.eyebrow}</p>
            <h2
              className="font-display fluid-h2 text-primary"
              dangerouslySetInnerHTML={{ __html: site.gallery.titleHtml }}
            />
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl">{site.gallery.subtitle}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap justify-center gap-5"
            >
              {products.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(p)}
                  className="group text-left bg-card rounded-xl overflow-hidden border border-border hover:border-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)] max-w-[420px]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <HoverCarouselImg
                      images={p.images}
                      alt={p.name}
                      showDots
                      imgClassName="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="font-mono-tech text-[10px] tracking-widest text-accent">
                      {p.category}
                    </span>
                    <h3 className="font-display text-2xl text-primary mt-2">{p.model}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.shortName}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-primary group-hover:text-accent transition-colors">
                      Ver detalhes <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <ProductDetail
              key={selected.id}
              product={selected}
              imgIdx={imgIdx}
              setImgIdx={setImgIdx}
              onBack={() => setSelected(null)}
              onSelectOther={(p) => setSelected(p)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProductDetail({
  product,
  imgIdx,
  setImgIdx,
  onBack,
  onSelectOther,
}: {
  product: Product;
  imgIdx: number;
  setImgIdx: (i: number) => void;
  onBack: () => void;
  onSelectOther: (p: Product) => void;
}) {
  const others = products.filter((p) => p.id !== product.id);
  const next = () => setImgIdx((imgIdx + 1) % product.images.length);
  const prev = () => setImgIdx((imgIdx - 1 + product.images.length) % product.images.length);
  const multi = product.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary hover:text-accent mb-6 sm:mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para todos os equipamentos
      </button>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 mb-12 sm:mb-16">
        {/* Image gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden group bg-white min-h-[320px] md:min-h-[500px] aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={product.images[imgIdx]}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/products/placeholder.jpg"; }}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </AnimatePresence>
            {multi && (
              <>
                <button
                  onClick={prev}
                  aria-label="Imagem anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-card transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Próxima imagem"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-card transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === imgIdx ? "w-6 bg-accent" : "w-1.5 bg-card/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {multi && (
          <div className="flex items-center justify-between mt-3">
            <div className="grid grid-cols-8 gap-1.5 flex-1">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition bg-white ${
                    i === imgIdx ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <span className="ml-3 text-xs font-mono-tech text-muted-foreground tabular-nums">
              {imgIdx + 1}/{product.images.length}
            </span>
          </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-widest">
            {product.category}
          </span>
          <h3 className="font-display text-4xl sm:text-5xl text-primary mt-4">{product.model}</h3>
          <p className="text-base sm:text-lg text-foreground/80 mt-2">{product.name}</p>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/80">
            {product.description.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:brightness-110 transition shadow-lg shadow-accent/20"
            >
              Solicitar orçamento deste equipamento →
            </a>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-16">
        <div className="px-5 sm:px-8 py-5 border-b border-border bg-muted/40">
          <h4 className="font-display text-2xl text-primary">Ficha técnica</h4>
          <p className="text-xs text-muted-foreground mt-1 font-mono-tech tracking-wider">
            ESPECIFICAÇÕES FABRICANTE · SHINOVA
          </p>
        </div>
        <dl className="divide-y divide-border">
          {product.specs.map((s) => (
            <div key={s.label} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 px-5 sm:px-8 py-4 hover:bg-muted/30 transition">
              <dt className="text-sm font-medium text-muted-foreground">{s.label}</dt>
              <dd className="text-sm text-foreground font-mono-tech">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Other products */}
      {others.length > 0 && (
      <div>
        <p className="eyebrow mb-4">Outros equipamentos da linha</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {others.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectOther(p)}
              className="group text-left bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition"
            >
              <div className="aspect-square overflow-hidden bg-white">
                <HoverCarouselImg
                  images={p.images}
                  alt={p.name}
                  imgClassName="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <p className="font-display text-sm text-primary truncate">{p.model}</p>
                <p className="text-[10px] text-muted-foreground truncate">{p.shortName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      )}
    </motion.div>
  );
}
