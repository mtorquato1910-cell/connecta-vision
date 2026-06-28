import type { SiteConfig, Product } from "@/lib/types";

const DE = "A. KRÜSS · Alemanha";
const FR = "GoyaLab · França";

const gemProducts: Product[] = [
  {
    id: "ka41krs",
    model: "KA41KRS",
    category: "LABORATÓRIO GEMOLÓGICO",
    name: "Laboratório Gemológico Móvel Completo KA41KRS",
    shortName: "Laboratório Móvel",
    productUrl: "https://kruess-shop.de/produkte/edelsteinlabore/kleines-mobiles-edelsteinlabor-ka41krs/",
    images: ["/products/ka41krs.jpg"],
    description: [
      "O KA41KRS é um laboratório gemológico móvel completo da A. KRÜSS (Alemanha), uma maleta de alumínio à prova de choque com todos os instrumentos padrão para avaliar gemas com segurança fora do laboratório fixo. Permite distinguir com confiança pedras naturais, sintéticas e imitações.",
      "Inclui microscópio com campo escuro (KSW4000-K-W, 10× e 30×), fontes de luz fria (incidente e transmitida), cuba com aparato de polarização, refratômetro com filtro de sódio e líquido de contato (RI 1,79), espectroscópio 1501, polariscópio, dicroscópio HD10, lâmpada UV de mão, lâmpada de luz do dia, bandeja de triagem e óleo de imersão. Alimentação universal 100–240V.",
    ],
    specs: [
      { label: "Maleta", value: "Alumínio à prova de choque" },
      { label: "Microscópio", value: "KSW4000-K-W (10×/30×, expansível 20×/60×)" },
      { label: "Refratômetro", value: "Com filtro de sódio + líquido de contato (RI 1,79)" },
      { label: "Inclui", value: "Espectroscópio 1501, polariscópio, dicroscópio HD10, lâmpada UV, luz fria, luz do dia, óleo de imersão" },
      { label: "Alimentação", value: "100–240V (uso mundial)" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "ksw6000",
    model: "KSW6000",
    category: "MICROSCOPIA GEMOLÓGICA",
    name: "Microscópio Estéreo Gemológico KSW6000",
    shortName: "Microscópio Estéreo",
    productUrl: "https://kruess-shop.de/produkte/edelstein-mikroskope/stereo-mikroskope/stereo-edelstein-mikroskop/",
    images: ["/products/ksw6000.jpg"],
    description: [
      "O KSW6000 é o microscópio estéreo gemológico da A. KRÜSS para exame de gemas, pedras preciosas e minerais. Zoom contínuo, cabeça inclinável e giratória e múltiplos modos de iluminação, luz transmitida, campo escuro, LED de pescoço de ganso e lâmpada fluorescente.",
      "Cabeçote trinocular permite acoplar câmera para foto e vídeo, documentando inclusões e características da pedra. Acompanha pinça de pedras. Ampliação de 7× a 45×, expansível até 180× com acessórios.",
    ],
    specs: [
      { label: "Ampliação", value: "7×–45× (até 180× com acessórios)" },
      { label: "Zoom", value: "0,7×–4,5× (relação 6,4:1)" },
      { label: "Inclinação / rotação", value: "Até 38° / 325°" },
      { label: "Iluminação", value: "6V/20W transmitida + campo escuro, LED pescoço de ganso, fluorescente 9W" },
      { label: "Cabeçote", value: "Trinocular (tubo de foto 23 mm)" },
      { label: "Acessório", value: "Pinça de pedras inclusa" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "ksw4000",
    model: "KSW4000-K-W",
    category: "MICROSCOPIA GEMOLÓGICA",
    name: "Microscópio de Imersão Gemológico KSW4000-K-W",
    shortName: "Microscópio de Imersão",
    productUrl: "https://kruess-shop.de/produkte/edelstein-mikroskope/immersions-mikroskope/immersionsmikroskop/",
    images: ["/products/ksw4000.jpg"],
    description: [
      "O KSW4000-K-W é o microscópio estéreo horizontal de imersão da A. KRÜSS, usa líquido de imersão para eliminar reflexos da superfície e das facetas, entregando máxima clareza em pedras facetadas e apresentação de inclusões em alto contraste.",
      "Imagem nítida em amplo campo de visão para identificação, verificação de autenticidade e controle de qualidade. Iluminação por luz fria com fibra óptica, cuba de imersão com suporte de pedra rotativo e dispositivo de polarização.",
    ],
    specs: [
      { label: "Ampliação", value: "10× e 30×" },
      { label: "Iluminação", value: "Luz fria com fibra óptica" },
      { label: "Imersão", value: "Cuba com suporte de pedra rotativo" },
      { label: "Oculares", value: "10× campo amplo" },
      { label: "Revólver", value: "2 posições (objetivas 1× e 3×)" },
      { label: "Polarização", value: "Sim" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "er601",
    model: "ER601-LED",
    category: "REFRATÔMETRO",
    name: "Refratômetro de Gemas ER601-LED",
    shortName: "Refratômetro",
    productUrl: "https://kruess-shop.de/produkte/edelstein-refraktometer/edelstein-refraktometer-er601-led/",
    images: ["/products/er601.jpg"],
    description: [
      "O ER601-LED é o refratômetro de gemas profissional da A. KRÜSS, com iluminação LED, mede o índice de refração da pedra para identificação, teste de autenticidade e classificação de qualidade. Óptica de alto nível para leituras precisas mesmo em uso intenso.",
      "Permite técnicas avançadas de leitura como visão à distância (distant vision) e ponto (spot). Acompanha filtro de polarização. Carcaça em alumínio fundido, compacto e robusto para bancada.",
    ],
    specs: [
      { label: "Faixa de medição", value: "1,33–1,83 nD" },
      { label: "Resolução da escala", value: "0,01 nD" },
      { label: "Luz", value: "LED 589 nm" },
      { label: "Prisma", value: "Vidro óptico de alto nível" },
      { label: "Carcaça", value: "Alumínio fundido" },
      { label: "Dimensões", value: "30 × 80 × 125 mm · 358 g" },
      { label: "Acessório", value: "Filtro de polarização incluso" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "pk14",
    model: "PK14-LED",
    category: "POLARISCÓPIO",
    name: "Polariscópio de Mesa PK14-LED",
    shortName: "Polariscópio",
    productUrl: "https://kruess-shop.de/produkte/polariskope/polariskop-pk14-led/",
    images: ["/products/pk14.jpg"],
    description: [
      "O PK14-LED é o polariscópio de mesa da A. KRÜSS, revela as propriedades ópticas da pedra (isotropia, anisotropia, pleocroísmo) para determinar rapidamente se ela é natural, sintética ou imitação. Iluminação LED integrada e operação simples, com resultado profissional.",
    ],
    specs: [
      { label: "Luz", value: "LED integrado (alimentação de rede)" },
      { label: "Placa de amostra", value: "Vidro giratório Ø 44 mm" },
      { label: "Lente conoscópica", value: "Ø 10 mm" },
      { label: "Acessórios", value: "Suporte de pedra + lente conoscópica auxiliar" },
      { label: "Dimensões", value: "70 × 142 × 132 mm · 600 g" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "specset",
    model: "KL14-1504",
    category: "ESPECTROSCÓPIO",
    name: "Conjunto Espectroscópio Gemológico KL14-1504",
    shortName: "Espectroscópio",
    productUrl: "https://kruess-shop.de/produkte/spektroskope/spektroskop-geraete-set/",
    images: ["/products/specset.jpg"],
    description: [
      "O KL14-1504 é o conjunto espectroscópio gemológico da A. KRÜSS, espectroscópio de mão HS1504 com prisma de visão direta Amici (sistema de 5 prismas) que entrega espectros nítidos e de alto contraste. Mede os comprimentos de onda absorvidos pela pedra para determinar composição, qualidade e tipo.",
      "Conjunto completo com suporte ST1513 (mesa giratória e placa de vidro), fonte de luz fria KL5120 (halógena 20W, 3050K, brilho ajustável sem alteração de cor), componentes de polariscópio (polarizador, analisador e lente conoscópica), escala com iluminação e fibra óptica. Alimentação 110–230V automática.",
    ],
    specs: [
      { label: "Espectroscópio", value: "HS1504 com prisma Amici (5 prismas)" },
      { label: "Suporte", value: "ST1513 (mesa + vidro giratório)" },
      { label: "Luz fria", value: "KL5120 halógena 20W · 3050K" },
      { label: "Polarização", value: "Polarizador + analisador + lente conoscópica" },
      { label: "Escala", value: "Com iluminação" },
      { label: "Fibra óptica", value: "Inclusa" },
      { label: "Alimentação", value: "110–230V (automática)" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "dsp30",
    model: "DSP30",
    category: "TESTADOR DE DIAMANTE",
    name: "Testador de Diamante SmartPro Screen I DSP30",
    shortName: "Testador de Diamante",
    productUrl: "https://kruess-shop.de/produkte/diamant-testgeraete/diamant-testgeraet-dsp30/",
    images: ["/products/dsp30.jpg"],
    description: [
      "O DSP30 (SmartPro Screen I) é o testador de diamante distribuído pela A. KRÜSS, testa diamantes naturais incolores (cores D-J) e verifica a permeabilidade UV de pedras soltas e montadas, sem tempo de aquecimento. Distingue diamantes sintéticos (CVD/HPHT) de naturais por tecnologia de absorção UV.",
      "A pedra é colocada na plataforma de medição e o resultado aparece em até 2 segundos, com sinal sonoro. Compacto e portátil, ideal para triagem rápida na bancada ou no balcão.",
    ],
    specs: [
      { label: "Cores testadas", value: "D-J (Tipo Ia, Ib, CVD/HPHT IIa, IIb)" },
      { label: "Sensor", value: "Tecnologia LED (absorção UV)" },
      { label: "Tempo de resultado", value: "≤ 2 segundos" },
      { label: "Display", value: "Indicador LED + sinal sonoro" },
      { label: "Faixa de quilates", value: "0,01 ct a 12 ct" },
      { label: "Alimentação", value: "Micro USB ou 4× AAA" },
      { label: "Dimensões", value: "100 × 130 × 80 mm · 191 g" },
      { label: "Origem", value: "SmartPro · distribuído por A. KRÜSS (Alemanha)" },
    ],
  },
  {
    id: "hd10",
    model: "HD10",
    category: "DICROSCÓPIO",
    name: "Dicroscópio de Mão HD10",
    shortName: "Dicroscópio",
    productUrl: "https://kruess-shop.de/produkte/dichroskope/handdichroskop-hd10/",
    images: ["/products/hd10.jpg"],
    description: [
      "O HD10 é o dicroscópio de mão da A. KRÜSS, observa o pleocroísmo (variação de cor conforme a direção) em gemas transparentes. Usa um cristal de calcita que divide a luz em dois raios polarizados perpendiculares, exibidos lado a lado.",
      "Ferramenta essencial para identificar gemas e distinguir naturais de imitações, especialmente quando o pleocroísmo é fraco. Compacto e leve, cabe no bolso.",
    ],
    specs: [
      { label: "Elemento óptico", value: "Cristal de calcita" },
      { label: "Janela de visão", value: "Ø 15 mm" },
      { label: "Dimensões", value: "Ø 20 × 60 mm · 22 g" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "uv240",
    model: "UV240",
    category: "LÂMPADA UV",
    name: "Lâmpada UV de Análise UV240",
    shortName: "Lâmpada UV",
    productUrl: "https://kruess-shop.de/produkte/uv-analyselampe/uv-analyselampe-uv240/",
    images: ["/products/uv240.jpg"],
    description: [
      "A UV240 é a lâmpada UV de análise da A. KRÜSS, com onda longa e curta e filtro especial, identifica gemas pelos efeitos de luminescência, distinguindo fluorescência (não persistente) de fosforescência (brilho persistente).",
      "Também útil para detectar documentos falsos (cédulas, passaportes) por marcações sensíveis ao UV. Com alça, para uso na bancada.",
    ],
    specs: [
      { label: "Onda curta", value: "254 nm" },
      { label: "Onda longa", value: "366 nm" },
      { label: "Potência", value: "6 W por fonte" },
      { label: "Alimentação", value: "240 VAC" },
      { label: "Dimensões", value: "260 × 70 × 60 mm · 1233 g" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "coldlight",
    model: "KL5120 / KL5125",
    category: "FONTE DE LUZ FRIA",
    name: "Fonte de Luz Fria com Controle de Brilho",
    shortName: "Luz Fria",
    productUrl: "https://www.kruess.com/en/products/cold-light-sources/cold-light-sources-with-brightness-control/",
    images: ["/products/coldlight.jpg"],
    description: [
      "Fontes de luz fria da A. KRÜSS para iluminação de microscopia e fotografia, brilho ajustável de forma contínua e sem alteração de cor, com lâmpada halógena que mantém a fidelidade cromática (importante para análise de gemas).",
      "Disponível em dois modelos: KL5120 (compacto, 20W, 3050K) e KL5125 (alta potência, 150W, 3350K). Acoplam fibras ópticas e pescoços de ganso para dirigir a luz onde for preciso.",
    ],
    specs: [
      { label: "Modelos", value: "KL5120 (8V/20W · 3050K) · KL5125 (15V/150W · 3350K)" },
      { label: "Brilho", value: "Ajustável contínuo, sem mudança de cor" },
      { label: "Lâmpada", value: "Halógena com refletor" },
      { label: "Alimentação", value: "100–240V" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "gospectro",
    model: "GoSpectro",
    category: "ESPECTRÔMETRO",
    name: "Espectrômetro Portátil GoSpectro",
    shortName: "Espectrômetro de Bolso",
    productUrl: "https://www.goyalab.com/product/handheld-spectrometer-gospectro/",
    images: ["/products/gospectro.jpg", "/products/gospectro-2.jpg", "/products/gospectro-3.jpg"],
    description: [
      "O GoSpectro é o espectrômetro portátil da GoyaLab (França) que transforma qualquer smartphone ou tablet em um espectrômetro ultracompacto e potente. Mede espectros em emissão, transmissão ou reflexão, ideal para caracterizar a luz e analisar materiais em campo.",
      "Acompanha o aplicativo SpectroLab (Android e iOS) para leitura e registro dos espectros. Fibra óptica com adaptador disponível como opcional.",
    ],
    specs: [
      { label: "Faixa de comprimento de onda", value: "400–750 nm (visível)" },
      { label: "Resolução espectral", value: "< 10 nm" },
      { label: "Reprodutibilidade", value: "1 nm" },
      { label: "App", value: "SpectroLab (Android e iOS)" },
      { label: "Opcional", value: "Fibra óptica com adaptador" },
      { label: "Origem", value: FR },
    ],
  },
  {
    id: "indigo-fluo",
    model: "Indigo Fluo UVA-C",
    category: "ESPECTRÔMETRO DE FLUORESCÊNCIA",
    name: "Espectrômetro de Fluorescência Indigo Fluo UVA-C",
    shortName: "Fluorescência",
    productUrl: "https://www.goyalab.com/product/indigo-fluo-uva-c-a-fluorescence-spectrometer-with-uvauvc-excitation/",
    images: ["/products/indigo-fluo.jpg", "/products/indigo-fluo-2.jpg", "/products/indigo-fluo-3.jpg"],
    description: [
      "O Indigo Fluo UVA-C é o espectrômetro de fluorescência modular e portátil da GoyaLab (França), conecta por Bluetooth a smartphone ou tablet. Combina o módulo Indigo com um módulo de excitação de 4 LEDs UVA (365 nm) e 2 LEDs UVC (255 nm).",
      "Por um toque de botão, dispara a excitação e mede o espectro de fluorescência, recurso valioso para análise gemológica e identificação de pedras por sua resposta à luz UV.",
    ],
    specs: [
      { label: "Excitação", value: "UVA 365 nm (onda longa) + UVC 255 nm (onda curta)" },
      { label: "Faixa de medição", value: "380–780 nm" },
      { label: "Resolução espectral", value: "1,5 nm (FWHM)" },
      { label: "Conectividade", value: "Bluetooth 5.0" },
      { label: "Formato", value: "De mão (cabe na palma)" },
      { label: "Origem", value: FR },
    ],
  },
  {
    id: "indigo-raman",
    model: "Indigo Raman 532",
    category: "ESPECTRÔMETRO RAMAN",
    name: "Espectrômetro Raman Portátil Indigo Raman 532",
    shortName: "Raman",
    productUrl: "https://www.goyalab.com/product/indigo-raman-532nm-a-portable-raman-spectrometer-with-a-532nm-laser-excitation/",
    images: ["/products/indigo-raman.jpg"],
    description: [
      "O Indigo Raman 532 é o espectrômetro Raman portátil da GoyaLab (França), com excitação a laser de 532 nm, modular e leve, cabe na mão. Controla por Bluetooth (app SpectroLab Android) ou por PC Windows.",
      "Combina um espectrômetro visível de alta resolução e uma cabeça Raman com laser integrado. Analisa sólidos, pós ou líquidos (porta-amostra retrátil) e exporta os espectros em .txt, .csv ou .spc. Ideal para análise de matriz inorgânica, sem autofluorescência.",
    ],
    specs: [
      { label: "Excitação", value: "Laser 532 nm" },
      { label: "Faixa espectral", value: "150–4000 cm⁻¹" },
      { label: "Resolução", value: "12 cm⁻¹" },
      { label: "Controle", value: "Bluetooth (app) ou PC Windows" },
      { label: "Exportação", value: ".txt, .csv, .spc" },
      { label: "Origem", value: FR },
    ],
  },
  {
    id: "lb010",
    model: "LB010",
    category: "LUPA",
    name: "Óculos-Lupa Triplet LB010",
    shortName: "Óculos-Lupa",
    productUrl: "https://kruess-shop.de/produkte/lupen/spezial-lupen/lupenbrille-triplet-lb010/",
    images: ["/products/lb010.jpg"],
    description: [
      "O LB010 é o óculos-lupa da A. KRÜSS, com armação de titânio, magnificador de cabeça para exame de gemas com visão binocular, deixando as duas mãos livres para o trabalho. Leve, para uso prolongado.",
    ],
    specs: [
      { label: "Ampliação", value: "2,3×" },
      { label: "Distância de trabalho", value: "270–300 mm" },
      { label: "Distância dos olhos", value: "56–74 mm" },
      { label: "Campo de visão", value: "Ø 50 mm" },
      { label: "Sistema", value: "Triplet (3 elementos)" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "hsl10",
    model: "HSL10",
    category: "LUPA",
    name: "Lupa Hastings Triplet 10× HSL10",
    shortName: "Lupa 10×",
    productUrl: "https://kruess-shop.de/produkte/lupen/lupenmodelle-10-fache-vergroesserung/hastings-lupe-triplet-hsl10/",
    images: ["/products/hsl10.jpg"],
    description: [
      "A HSL10 é a clássica lupa Hastings triplet 10× da A. KRÜSS, três lentes acromáticas (corrigidas em cor) e aplanáticas (sem distorção) entregam contraste e nitidez excepcionais em todo o campo. Ferramenta essencial e padrão do exame gemológico.",
    ],
    specs: [
      { label: "Ampliação", value: "10×" },
      { label: "Lente", value: "Ø 17,5 mm" },
      { label: "Sistema", value: "Triplet (acromático e aplanático)" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "kof20f",
    model: "KOF20F",
    category: "ACESSÓRIO",
    name: "Pinça para Pedras KOF20F (com trava)",
    shortName: "Pinça de Pedras",
    productUrl: "https://kruess-shop.de/produkte/pinzetten/steinpinzetten-kof20f/",
    images: ["/products/kof20f.jpg"],
    description: [
      "A KOF20F é a pinça para pedras da A. KRÜSS, em aço inox com mecanismo de trava e ponta fina, segura a gema com firmeza e precisão durante o exame, sem risco de soltar. Antiestática e não magnética.",
    ],
    specs: [
      { label: "Comprimento", value: "16 cm" },
      { label: "Material", value: "Aço inox" },
      { label: "Ponta", value: "Fina (F), com trava" },
      { label: "Propriedades", value: "Antiestática, não magnética" },
      { label: "Origem", value: DE },
    ],
  },
  {
    id: "kop30",
    model: "KOP30",
    category: "ACESSÓRIO",
    name: "Pinça de Garra KOP30",
    shortName: "Pinça de Garra",
    productUrl: "https://kruess-shop.de/produkte/pinzetten/krallenpinzette-kop30/",
    images: ["/products/kop30.jpg"],
    description: [
      "A KOP30 é a pinça de garra (3 garras) da A. KRÜSS, em latão cromado, segura a gema pelas laterais como uma garra de joalheiro, ideal para posicionar a pedra na frente da luz durante o exame. Antiestática e não magnética.",
    ],
    specs: [
      { label: "Comprimento", value: "10 cm" },
      { label: "Material", value: "Latão cromado" },
      { label: "Design", value: "3 garras" },
      { label: "Propriedades", value: "Antiestática, não magnética" },
      { label: "Origem", value: DE },
    ],
  },
];

export const gemafalsa: SiteConfig = {
  id: "gemafalsa",
  domain: "gemafalsa.com.br",
  lineName: "Linha de Gemologia",
  countWord: "17 instrumentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
    companyName: "Conecta · Instrumentos de Gemologia",
  },

  meta: {
    title: "Conecta · Instrumentos de Gemologia e Perícia de Gemas",
    description:
      "Instrumentos de gemologia para identificar gemas, classificar qualidade e detectar imitações e sintéticos, refratômetros, polariscópios, espectrômetros Raman e mais. Representação oficial da A. KRÜSS (Alemanha) e GoyaLab (França).",
  },

  topbarHtml:
    "💎 Instrumentos de gemologia importados · <strong>Representação oficial</strong> · A. KRÜSS (Alemanha) e GoyaLab (França)",

  hero: {
    eyebrow: "Gemologia & Perícia de Gemas",
    kicker: "Instrumentos Gemológicos · Distribuição Conecta · Representação oficial",
    titleHtml: 'Identifique a gema, <em class="text-accent">e desmascare a falsa.</em>',
    h2: "Instrumentos profissionais de gemologia para identificação, classificação e perícia de gemas.",
    subtitle:
      "Instrumentos profissionais de gemologia para identificar pedras, classificar qualidade e detectar imitações e sintéticos, de refratômetros e polariscópios a espectrômetros Raman. Representação da A. KRÜSS (Alemanha) e GoyaLab (França).",
    bulletsHtml: [
      "Refratômetro, polariscópio, espectroscópio, dicroscópio e mais em <strong>uma só linha</strong>",
      "Detecte <strong>imitações e sintéticos</strong> com instrumentos de referência mundial",
      "Representação oficial da <strong>Europa</strong>, sem intermediário inflando preço",
      "Do testador de diamante de bolso ao <strong>laboratório gemológico completo</strong>",
    ],
    ctaPrimary: "Ver os instrumentos",
    cardTag: "GEMOLOGIA 2026",
    cardTitle: "Gemologia",
    cardImage: "https://images.unsplash.com/photo-1560427450-00fa9481f01e?auto=format&fit=crop&w=1100&q=80",
    cardStats: [
      ["17", "Instrumentos"],
      ["DE · FR", "Origem europeia"],
      ["100%", "Representação oficial"],
    ],
    socialProofHtml:
      'Instrumentos da <strong class="text-foreground">A. KRÜSS (Alemanha)</strong> e <strong class="text-foreground">GoyaLab (França)</strong>, referências mundiais em gemologia, representados pela Conecta no Brasil.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões para montar sua perícia <em class="text-accent">com a nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Da bancada ao laboratório completo",
        p: "Do testador de diamante de bolso ao laboratório gemológico móvel KA41, instrumentos que cobrem toda a identificação e perícia de gemas em uma única origem. Você monta a bancada certa para o seu nível, sem juntar fornecedor de cinco lugares.",
      },
      {
        n: "ii.",
        title: "Marcas de referência mundial",
        p: "A. KRÜSS (Alemanha) e GoyaLab (França) são referências em instrumentação gemológica e espectroscopia. Óptica e precisão de nível profissional, não é instrumento amador de marketplace.",
      },
      {
        n: "iii.",
        title: "Representação oficial com atendimento brasileiro",
        p: "Representação oficial da Europa, sem intermediário inflando preço. Orientação técnica no Brasil para escolher os instrumentos certos. Documentação fiscal completa e entrega nacional com seguro.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha de gemologia · 17 instrumentos",
    titleHtml: 'Toque em qualquer instrumento <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Instrumentos que cobrem identificação, classificação e perícia de gemas, refração, polarização, espectroscopia, fluorescência e Raman.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha de gemologia Conecta <em class="text-accent">entra no seu trabalho.</em>',
    cards: [
      {
        title: "Identificação de gemas",
        p: "Determine a espécie da pedra com refratômetro, polariscópio e dicroscópio, o tripé clássico da identificação gemológica.",
        img: "https://images.unsplash.com/photo-1613843351058-1dd06fda7c02?auto=format&fit=crop&w=700&q=80",
      },
      {
        title: "Detecção de sintéticos e imitações",
        p: "Flagre a falsa: testador de diamante por UV, lâmpada UV de luminescência e espectrômetros que revelam o que o olho não vê.",
        img: "https://images.unsplash.com/photo-1605821628253-8120cd950c03?auto=format&fit=crop&w=700&q=80",
      },
      {
        title: "Análise espectral avançada",
        p: "Espectrômetros Raman e de fluorescência da GoyaLab para identificação inequívoca, ligados ao smartphone.",
        img: "https://images.unsplash.com/photo-1605821771565-35e0d046a2fb?auto=format&fit=crop&w=700&q=80",
      },
      {
        title: "Laboratório móvel e a campo",
        p: "Maleta gemológica completa KA41 para fazer perícia onde o cliente estiver, feira, joalheria ou avaliação externa.",
        img: "https://images.unsplash.com/photo-1597177586824-33bda0c29325?auto=format&fit=crop&w=700&q=80",
      },
    ],
  },

  testimonial: {
    quote:
      "Numa avaliação, errar a pedra custa caro. Montei minha bancada de perícia com a linha da Conecta, refratômetro, polariscópio e o testador de diamante, e parei de depender de laboratório terceiro para bater o martelo. A representação oficial deixou o investimento viável.",
    name: "Ricardo Salem",
    role: "Avaliação e Perícia de Gemas · São Paulo/SP",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Que instrumentos eu preciso para começar a periciar gemas?",
      a: "O básico é refratômetro, polariscópio, dicroscópio, lâmpada UV e uma boa lupa ou microscópio. Se quiser tudo em um, o laboratório móvel KA41 já vem completo. Montamos a configuração ideal para o seu nível e orçamento.",
    },
    {
      q: "Dá para identificar diamante sintético (CVD/HPHT)?",
      a: "O testador SmartPro DSP30 faz a triagem de diamantes incolores e indica a permeabilidade UV; para análise mais profunda, os espectrômetros de fluorescência e Raman ajudam a caracterizar a pedra. Orientamos o fluxo de teste na proposta.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "São instrumentos importados da Europa (A. KRÜSS, na Alemanha, e GoyaLab, na França). O prazo depende do item e do lote de importação e é informado com clareza no orçamento, sem surpresa.",
    },
    {
      q: "Os instrumentos têm garantia?",
      a: "Sim, contam com a garantia do fabricante. As condições específicas de cada item seguem detalhadas na proposta, junto com a documentação fiscal completa.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional com transportadora especializada e seguro. Orientamos a melhor configuração à distância e acompanhamos a entrega.",
    },
  ],

  quote: {
    titleHtml: 'Vai montar sua bancada de perícia? <em class="text-accent">Faça seu orçamento.</em>',
    subtitle:
      "Conta o que você precisa, identificar pedras, detectar falsas ou montar um laboratório completo. Devolvemos uma proposta sob medida com os instrumentos certos e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com os instrumentos certos para o seu nível",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["DE · FR", "instrumentos europeus"],
    ],
    packageLabel: "Laboratório gemológico completo (KA41)",
    assurances: [
      "Garantia do fabricante (A. KRÜSS / GoyaLab)",
      "Representação oficial da Europa · sem intermediário",
      "Entrega Brasil inteiro com seguro completo",
    ],
  },

  footerCatalog: [
    "Refratômetro",
    "Polariscópio",
    "Espectroscópio",
    "Dicroscópio",
    "Testador de diamante",
    "Microscópio gemológico",
    "Lâmpada UV",
    "Espectrômetros Raman / Fluorescência",
  ],
  footerBlurb:
    "Distribuição de instrumentos de gemologia e perícia de gemas, marcas europeias de referência, representação oficial e atendimento brasileiro.",

  form: {
    funcaoOptions: ["Gemólogo", "Joalheiro", "Perito / avaliador", "Lojista", "Colecionador", "Outro"],
    tipoOptions: ["Joalheria", "Laboratório gemológico", "Perito autônomo", "Casa de leilão"],
    volumeLabel: "Volume de avaliações",
    volumeOptions: ["Até 20/mês", "20-100", "100-500", "+500"],
    itemsLabel: "Quais instrumentos te interessam?",
  },

  products: gemProducts,
};
