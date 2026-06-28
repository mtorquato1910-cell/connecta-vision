import type { SiteConfig, Product } from "@/lib/types";

const CE = "SHINOVA · China · CE/ISO 13485";
const JM = "JeetMed · China";

const endoProducts: Product[] = [
  {
    id: "rae-105",
    model: "RAE-105",
    category: "ENDOSCOPIA FLEXÍVEL",
    name: "Endoscópio Veterinário Flexível RAE-105",
    shortName: "Endoscópio Flexível",
    productUrl: "http://www.jeetmed.com/pid18436779/RAE-105-Animal-Endoscope.htm",
    images: ["/products/rae-105.jpg", "/products/rae-105-2.png"],
    description: [
      "O RAE-105 é o endoscópio veterinário flexível da JeetMed, indicado para endoscopia respiratória, lavagem pulmonar, remoção de corpo estranho de vias aéreas, biópsia e cirurgia minimamente invasiva em animais.",
      "Tubo de inserção de 5,8 mm de diâmetro externo com canal de trabalho de 2,0 mm para passagem de instrumentos, comprimento útil de 750 mm e articulação de 180° com direcionamento de 360°, alcance e manobrabilidade para exames das vias aéreas e do trato digestivo alto.",
    ],
    specs: [
      { label: "Tipo", value: "Endoscópio flexível veterinário" },
      { label: "Diâmetro externo", value: "5,8 mm" },
      { label: "Canal de trabalho", value: "2,0 mm" },
      { label: "Comprimento útil", value: "750 mm" },
      { label: "Angulação", value: "180°" },
      { label: "Direcionamento", value: "360°" },
      { label: "Aplicações", value: "Lavagem pulmonar, corpo estranho em via aérea, endoscopia respiratória, biópsia" },
      { label: "Origem", value: JM },
    ],
  },
  {
    id: "endotop",
    model: "EndoTop",
    category: "SISTEMA DE VÍDEO ENDOSCOPIA",
    name: "Sistema de Vídeo Endoscopia Veterinária 3-em-1 EndoTop",
    shortName: "Vídeo Endoscopia 3-em-1",
    productUrl: "https://www.shinova.com/product/detailp/3-in-1-Laptop-Veterinary-Video-Endoscope-EndoTop",
    images: [
      "/products/endotop.jpg",
      "/products/endotop-2.jpg",
      "/products/endotop-3.jpg",
      "/products/endotop-4.jpg",
      "/products/endotop-5.jpg",
      "/products/endotop-6.jpg",
      "/products/endotop-7.jpg",
      "/products/endotop-8.jpg",
    ],
    description: [
      "O EndoTop é o sistema de vídeo endoscopia veterinária 3-em-1 da Shinova, um processador de imagem em formato notebook (apenas 8,5 kg, com bateria de lítio) que une tela touch de 15,6\", processamento Full HD 1080p e fonte de luz LED com bomba de água e ar. Dobrável e portátil, atende cenários internos e externos.",
      "Plataforma única compatível com endoscópios flexíveis e rígidos, com sistema de gestão de prontuário integrado. A linha HiScope de gastroscópios (Full HD 1080p) cobre diâmetros de 6,8 a 11,5 mm e comprimentos de 1500 a 3500 mm para pequenos e grandes animais; a linha MiniScope de broncoscópios (HD 720p) cobre 2,8 a 5,8 mm.",
      "Aceita ainda kits rígidos veterinários, laparoscópio 5 mm, artroscópio equino 4 mm, otoscópio 2,7 mm, uretrocistoscópio e ureterorrenoscópio, transformando um único sistema em plataforma para cirurgia minimamente invasiva, ortopedia, otorrino e urologia veterinária.",
    ],
    specs: [
      { label: "Processador", value: "Notebook 8,5 kg com bateria de lítio" },
      { label: "Display", value: 'Touch 15,6"' },
      { label: "Imagem", value: "Full HD 1080p" },
      { label: "Fonte de luz", value: "LED com bomba de água e ar" },
      { label: "Compatibilidade", value: "Endoscópios flexíveis e rígidos" },
      { label: "Gastroscópios (HiScope)", value: "FHD 1080p · Ø 6,8–11,5 mm · canal 2,2–3,2 mm · 1500–3500 mm" },
      { label: "Broncoscópios (MiniScope)", value: "HD 720p · Ø 2,8–5,8 mm · canal 1,2–2,8 mm · 610–1500 mm" },
      { label: "Angulação", value: "210°(C) / 130°(B) / 100°(D) / 100°(E)" },
      { label: "Kits rígidos", value: "Laparoscópio 5mm, artroscópio 4mm, otoscópio 2,7mm, cistoscópio, ureterorrenoscópio" },
      { label: "Gestão", value: "Sistema de prontuário integrado" },
      { label: "Aplicações", value: "Cães, gatos, equinos e grandes animais" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "bronchoscope",
    model: "VE-8015P",
    category: "BRONCOSCOPIA",
    name: "Broncoscópio Veterinário Equino Portátil HD",
    shortName: "Broncoscópio Equino",
    productUrl: "https://www.shinova.com/product/detailp/Handheld-High-definition-Equine-Bronchoscope",
    images: [
      "/products/bronchoscope.jpg",
      "/products/bronchoscope-2.jpg",
      "/products/bronchoscope-3.jpg",
      "/products/bronchoscope-4.jpg",
      "/products/bronchoscope-5.jpg",
    ],
    description: [
      "O VE-8015P é o broncoscópio veterinário equino portátil da Shinova, sistema all-in-one com tela IPS touch de 4\", processador de imagem integrado e bateria recarregável, pensado para exame de vias aéreas no haras e na clínica. Imagem HD 720p com sensor CMOS, reprodução 1:1 e fonte de luz LED estável, com campo de visão de 120°.",
      "Comprimento útil de 1500 mm para acesso às vias aéreas equinas, tubo de inserção de 8,3 mm e canal de trabalho de 2,8 mm para passagem de instrumentos. Angulação em 4 direções (cima 210°, baixo 90°, esquerda e direita 100°) para navegação precisa.",
      "Tela touch com botões de atalho para captura de imagem, gravação e reprodução de vídeo, congelamento, balanço de branco com um toque, ajuste de brilho/cor e zoom. Armazena em cartão TF de até 32 GB, com saída USB 2.0 e HDMI para monitor externo (exibição simultânea). Indicado para exame respiratório equino, broncoscopia e detecção de corpo estranho.",
    ],
    specs: [
      { label: "Tipo", value: "Broncoscópio veterinário (equino)" },
      { label: "Display", value: 'IPS touch 4"' },
      { label: "Resolução", value: "HD 720p (sensor CMOS)" },
      { label: "Comprimento útil", value: "1500 mm" },
      { label: "Diâmetro do tubo", value: "8,3 mm" },
      { label: "Canal de trabalho", value: "2,8 mm" },
      { label: "Angulação", value: "4 direções (C 210° / B 90° / E–D 100°)" },
      { label: "Campo de visão", value: "120°" },
      { label: "Profundidade de campo", value: "3–100 mm" },
      { label: "Armazenamento", value: "Cartão TF até 32 GB" },
      { label: "Saídas", value: "HDMI + LCD (exibição simultânea)" },
      { label: "Bateria", value: "2600 mAh recarregável" },
      { label: "Garantia", value: "12 meses" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "flex-endo",
    model: "VE-D5860",
    category: "ENDOSCOPIA FLEXÍVEL",
    name: "Endoscópio Veterinário Flexível Descartável",
    shortName: "Endoscópio Descartável",
    productUrl: "https://www.shinova.com/product/detailp/Veterinary-Disposable-Flexible-Endoscope",
    images: [
      "/products/flex-endo.jpg",
      "/products/flex-endo-2.jpg",
      "/products/flex-endo-3.jpg",
      "/products/flex-endo-4.jpg",
      "/products/flex-endo-5.jpg",
      "/products/flex-endo-6.jpg",
      "/products/flex-endo-7.jpg",
    ],
    description: [
      "O VE-D5860 é o endoscópio veterinário flexível descartável da Shinova, altamente integrado, portátil e com tela touch de alta resolução (1280×800). Pensado para praticidade e segurança: a parte de inserção descartável reduz o risco de contaminação cruzada entre pacientes.",
      "Tubo fino de 5,8 mm de diâmetro com canal de trabalho de 2,8 mm e comprimento útil de 600 mm. Articulação composta de 210° para cima e 210° para baixo, rotação de 120° para cada lado e trava de ângulo, manobrabilidade alta para exames precisos. Campo de visão de 120° e profundidade de 3 a 100 mm.",
      "Bateria recarregável destacável com 4 horas de operação, cartão SD destacável e funções de foto, vídeo, congelamento de imagem e sucção. Saídas HDMI e BNC (CVBS) para monitor externo. Indicado para cães, gatos e equinos na sala de exame.",
    ],
    specs: [
      { label: "Tipo", value: "Endoscópio flexível descartável" },
      { label: "Display", value: "Touch 1280×800 (HD)" },
      { label: "Diâmetro do tubo", value: "5,8 mm" },
      { label: "Canal de trabalho", value: "2,8 mm" },
      { label: "Comprimento útil", value: "600 mm" },
      { label: "Campo de visão", value: "120°" },
      { label: "Profundidade de campo", value: "3–100 mm" },
      { label: "Articulação", value: "210° cima / 210° baixo" },
      { label: "Rotação", value: "120° esquerda/direita + trava de ângulo" },
      { label: "Bateria", value: "Destacável recarregável, 4 h" },
      { label: "Armazenamento", value: "Cartão SD destacável" },
      { label: "Saídas", value: "HDMI + BNC (CVBS)" },
      { label: "Funções", value: "Foto, vídeo, congelamento, sucção" },
      { label: "Animais", value: "Cães, gatos, equinos" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "rae-109",
    model: "RAE-109",
    category: "ENDOSCOPIA GASTROINTESTINAL",
    name: "Endoscópio Gastrointestinal Veterinário RAE-109",
    shortName: "Endoscópio GI",
    productUrl: "http://www.jeetmed.com/pid18436776/RAE-109-Animal-Gastrointestinal-Endoscope.htm",
    images: ["/products/rae-109.png", "/products/rae-109-2.jpg"],
    description: [
      "O RAE-109 é o endoscópio gastrointestinal veterinário da JeetMed, indicado para remoção de corpo estranho e exame de estômago e duodeno de animais.",
      "Tubo de inserção de 5,8 mm com canal de trabalho de 2,0 mm e comprimento útil de 1200 mm, alcance estendido para chegar ao trato digestivo de cães, gatos e outros animais. Articulação de 180° e direcionamento de 360° para navegação precisa.",
    ],
    specs: [
      { label: "Tipo", value: "Endoscópio gastrointestinal veterinário" },
      { label: "Diâmetro externo", value: "5,8 mm" },
      { label: "Canal de trabalho", value: "2,0 mm" },
      { label: "Comprimento útil", value: "1200 mm" },
      { label: "Angulação", value: "180°" },
      { label: "Direcionamento", value: "360°" },
      { label: "Aplicações", value: "Remoção de corpo estranho, exame de estômago e duodeno" },
      { label: "Origem", value: JM },
    ],
  },
  {
    id: "wireless-cam",
    model: "WE-1080",
    category: "CÂMERA DE ENDOSCOPIA",
    name: "Sistema de Câmera de Endoscopia Veterinária Sem Fio",
    shortName: "Câmera Sem Fio",
    productUrl: "https://www.shinova.com/product/detailp/Wireless-Endoscope-Camera-System",
    images: [
      "/products/wireless-cam.jpg",
      "/products/wireless-cam-2.jpg",
      "/products/wireless-cam-3.jpg",
      "/products/wireless-cam-4.jpg",
      "/products/wireless-cam-5.jpg",
      "/products/wireless-cam-6.jpg",
      "/products/wireless-cam-7.jpg",
      "/products/wireless-cam-8.jpg",
    ],
    description: [
      "O WE-1080 é o sistema de câmera de endoscopia veterinária sem fio da Shinova, portátil, móvel e wireless, transmite imagem por Wi-Fi (RTSP) para tablet ou celular (iOS e Android), liberando o profissional dos cabos durante o procedimento.",
      "Sensor Sony CMOS de 1/2.9\" com resolução de 800 linhas de TV para imagem nítida, iluminação ajustável (3000K–8000K) e design à prova d'água. Botões no cabo para foto, vídeo e balanço de branco; armazenamento no dispositivo ou em cartão TF de alta velocidade (até 64 GB).",
      "Bateria de lítio recarregável e substituível (DC 3,7V 3400 mAh) com 4 horas de uso contínuo e desligamento automático após 10 minutos parado. Leve (250 g), com leitura de dados via USB ou pelo app. Acopla a endoscópios para transformar o exame em uma estação móvel sem fio.",
    ],
    specs: [
      { label: "Sensor", value: 'Sony CMOS 1/2.9"' },
      { label: "Resolução", value: "800 linhas de TV" },
      { label: "Transmissão", value: "Wi-Fi (RTSP)" },
      { label: "App", value: "iOS e Android" },
      { label: "Iluminação", value: "3000K–8000K" },
      { label: "Sensibilidade mínima", value: "20 Lx F1.4" },
      { label: "Proteção", value: "Design à prova d'água" },
      { label: "Armazenamento", value: "Dispositivo ou cartão TF até 64 GB" },
      { label: "Balanço de branco", value: "Manual" },
      { label: "Bateria", value: "Lítio 3,7V 3400 mAh (recarregável/substituível)" },
      { label: "Autonomia", value: "4 h contínuas (desliga após 10 min parado)" },
      { label: "Alimentação", value: "AC 100–240V 50/60 Hz · carga DC 5V 2A" },
      { label: "Peso", value: "250 g" },
      { label: "Origem", value: CE },
    ],
  },
];

export const endoscopiaveterinario: SiteConfig = {
  id: "endoscopiaveterinario",
  domain: "endoscopiaveterinario.com.br",
  lineName: "Linha de Endoscopia",
  countWord: "6 equipamentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Endoscopia Veterinária",
    description:
      "Endoscopia veterinária, endoscópios flexíveis, broncoscópio equino, sistema de vídeo 3-em-1 e câmera sem fio. Diagnóstico minimamente invasivo, representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Equipamentos veterinários importados · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Endoscopia Veterinária",
    kicker: "Linha de Endoscopia Premium · Distribuição Conecta · Representação oficial",
    titleHtml: 'Endoscopia veterinária, <em class="text-accent">diagnóstico por dentro, sem cirurgia aberta.</em>',
    subtitle:
      "Seis equipamentos de endoscopia veterinária, endoscópios flexíveis, broncoscópio equino, sistema de vídeo 3-em-1 e câmera sem fio, para diagnóstico e procedimentos minimamente invasivos, com representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Flexíveis, broncoscópio, vídeo 3-em-1 e câmera sem fio em <strong>uma só linha</strong>",
      "Imagem <strong>HD e Full HD</strong> com canal de trabalho para biópsia e instrumentos",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional + garantia 12 meses + treinamento da equipe",
    ],
    ctaPrimary: "Ver os 6 equipamentos",
    cardTag: "LINHA DE ENDOSCOPIA 2026",
    cardTitle: "Endoscopia",
    cardImage: "/banco/endoscopia/endoscopia-cao-torre-video.png",
    cardStats: [
      ["6", "Equipamentos"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas e hospitais <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Linha de endoscopia completa, fornecedor único",
        p: "Do endoscópio flexível descartável ao sistema de vídeo 3-em-1, seis soluções que cobrem endoscopia respiratória, gastrointestinal e minimamente invasiva em uma única origem. Você simplifica compra, treinamento, manutenção e suporte.",
      },
      {
        n: "ii.",
        title: "Equipamentos veterinários de origem",
        p: "Fabricantes de referência (Shinova e JeetMed), com endoscópios e processadores pensados para fisiologia animal e multiespécie, de cães e gatos a equinos e grandes animais. Diâmetros, canais e comprimentos para cada procedimento.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha de endoscopia · 6 equipamentos",
    titleHtml: 'Toque em qualquer equipamento <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Seis equipamentos que cobrem endoscopia flexível, broncoscopia, vídeo endoscopia 3-em-1 e câmera sem fio, fornecidos como linha integrada pela Conecta.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha de endoscopia Conecta <em class="text-accent">se encaixa na sua operação.</em>',
    cards: [
      {
        title: "Endoscopia respiratória",
        p: "Avaliação de vias aéreas, lavagem pulmonar e remoção de corpo estranho. Broncoscópio equino VE-8015P + endoscópio flexível RAE-105.",
        img: "/banco/endoscopia/broncoscopia-equina-cavalo.png",
      },
      {
        title: "Gastrointestinal",
        p: "Exame de estômago e duodeno e remoção de corpo estranho com alcance estendido. Endoscópio GI RAE-109 (1200 mm).",
        img: "/banco/endoscopia/vet-endoscopio-flexivel.png",
      },
      {
        title: "Cirurgia minimamente invasiva",
        p: "Laparoscopia, artroscopia, otorrino e urologia em um só sistema. Plataforma de vídeo EndoTop com kits rígidos e flexíveis.",
        img: "/banco/endoscopia/equipe-endoscopia-sala.png",
      },
      {
        title: "Procedimento móvel e sem fio",
        p: "Imagem transmitida por Wi-Fi para tablet ou celular, sem cabos. Câmera sem fio WE-1080 e endoscópio descartável VE-D5860.",
        img: "/banco/endoscopia/torre-video-monitor-imagem.png",
      },
    ],
  },

  testimonial: {
    quote:
      "A endoscopia mudou meu diagnóstico de corpo estranho e via aérea, antes era cirurgia exploratória, hoje resolvo por dentro. A linha da Conecta me deu o flexível para o dia a dia e o sistema de vídeo para os casos complexos, com treinamento e suporte que respondem.",
    name: "Dr. Bruno Carvalho",
    role: "Hospital Veterinário Animalia · Belo Horizonte/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os 6 equipamentos juntos ou só alguns?",
      a: "Pode comprar como achar melhor. Trabalhamos com pacote (com condição comercial diferenciada) e com aquisição individual. Muitos clientes começam com um endoscópio flexível e o sistema de vídeo, e expandem depois. Faz orçamento da configuração que faz sentido para sua operação.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Quais procedimentos e espécies são atendidos?",
      a: "A linha cobre endoscopia respiratória, gastrointestinal e minimamente invasiva (laparoscopia, artroscopia, otorrino e urologia), conforme o endoscópio e os kits escolhidos, de pets a equinos e grandes animais. Indicamos a configuração ideal na proposta.",
    },
    {
      q: "Os equipamentos têm certificação Anvisa?",
      a: "Os equipamentos têm certificação do fabricante (CE / ISO 13485 nos itens Shinova). Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica que acompanha cada equipamento.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica e o treinamento da equipe.",
    },
  ],

  quote: {
    titleHtml: 'Cada rotina de endoscopia é única. <em class="text-accent">Sua proposta também precisa ser.</em>',
    subtitle:
      "Conta o que você precisa, endoscópio flexível, broncoscópio, sistema de vídeo ou câmera sem fio. Devolvemos uma proposta sob medida com instrumentos, treinamento e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com endoscópios, instrumentos, treinamento e condições",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["300+", "clientes atendidos"],
    ],
    packageLabel: "Pacote completo (todos os 6)",
  },

  footerCatalog: [
    "Endoscópio flexível",
    "Endoscópio gastrointestinal",
    "Broncoscópio",
    "Vídeo endoscopia 3-em-1",
    "Câmera sem fio",
    "Acessórios e instrumentos",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: endoProducts,
};
