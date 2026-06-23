import type { SiteConfig, Product } from "@/lib/types";

const CE = "SHINOVA · China · CE/ISO 13485";
const CN = "SHINOVA · China";

const dentalProducts: Product[] = [
  {
    id: "du-100",
    model: "DU-100",
    category: "ESTAÇÃO ODONTOLÓGICA",
    name: "Unidade Odontológica Veterinária Móvel",
    shortName: "Estação Odontológica",
    productUrl: "https://www.shinova.com/product/detailp/Mobile-Veterinary-Dental-Unit-DU-100",
    images: [
      "/products/du-100.jpg",
      "/products/du-100-2.jpg",
      "/products/du-100-3.jpg",
      "/products/du-100-4.jpg",
      "/products/du-100-5.jpg",
      "/products/du-100-6.jpg",
      "/products/du-100-7.jpg",
      "/products/du-100-8.jpg",
    ],
    description: [
      "A DU-100 é a unidade odontológica veterinária móvel da linha Shinova, um gabinete sobre rodízios que integra, em um só equipamento, todas as funções para tratar a maioria das afecções odontológicas dos animais. Visual clean e compacto, pensado para circular entre as salas da clínica.",
      "Traz compressor de ar silencioso, reservatório de gás e estabilizador de tensão embutidos, baixo ruído de trabalho para um ambiente tranquilo. Seringa tríplice multifuncional (água, ar e spray) e compartimento oculto para acomodar instrumentais, gazes e materiais.",
      "Acompanha pontas de alta rotação (370.000–420.000 rpm) e baixa rotação (22.000–27.000 rpm) e sugador de saliva por pressão negativa. Rodízios resistentes para mover com facilidade. Solução completa e portátil para odontologia veterinária, sem obra nem instalação fixa.",
    ],
    specs: [
      { label: "Potência do compressor", value: "600 W" },
      { label: "Vazão do compressor", value: "118 L/min" },
      { label: "Pressão da fonte de ar", value: "0–0,7 MPa" },
      { label: "Reservatório de água", value: "650 mL" },
      { label: "Reservatório de drenagem", value: "1000 mL" },
      { label: "Alta rotação", value: "370.000–420.000 rpm" },
      { label: "Baixa rotação", value: "22.000–27.000 rpm" },
      { label: "Seringa tríplice", value: "Água, ar e spray" },
      { label: "Sugador de saliva", value: "Pressão negativa" },
      { label: "Dimensões", value: "440×350×720 mm" },
      { label: "Peso líquido", value: "35 kg" },
      { label: "Alimentação", value: "100–240V, 50–60 Hz" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "dx10d-e",
    model: "DX10D-E",
    category: "RADIOLOGIA ODONTOLÓGICA",
    name: "Sistema de Radiografia Intraoral Veterinária Digital",
    shortName: "Raio-X Intraoral Digital",
    productUrl: "https://www.shinova.com/product/detailp/Digital-Veterinary-Intraoral-X-Ray-Imaging-System-DX10D-E",
    images: [
      "/products/dx10d-e.jpg",
      "/products/dx10d-e-2.jpg",
      "/products/dx10d-e-3.jpg",
      "/products/dx10d-e-4.jpg",
      "/products/dx10d-e-5.jpg",
      "/products/dx10d-e-6.jpg",
    ],
    description: [
      "O DX10D-E é o sistema de radiografia intraoral veterinária digital da Shinova, fonte de raio-X de foco micro com controle por microcomputador, baixa dose de radiação e exposição por toque único. Alarme de baixa tensão e proteção de alta tensão garantem operação segura e estável.",
      "O sensor digital usa tecnologia de placa de fibra óptica (FOP) com ampla faixa dinâmica, entregando imagens nítidas de baixa a alta dose e reduzindo a dependência de experiência no disparo. O sensor tamanho 1.3 cobre 22,5 mm de largura, suficiente para registrar até três dentes em uma única tomada.",
      "Base com modos móvel e fixo e coluna pneumática, deixando o posicionamento mais confortável para o paciente e para o operador. Conecta-se ao sistema de imagem digital, essencial para diagnóstico e endodontia (tratamento de canal). Cabo de dados testado para milhões de flexões, durável.",
    ],
    specs: [
      { label: "Alimentação", value: "220V ±10%, 50 Hz, 1 kVA" },
      { label: "Tensão do tubo", value: "70 kVp" },
      { label: "Corrente do tubo", value: "8 mA" },
      { label: "Foco", value: "0,8 mm (microfoco)" },
      { label: "Filtração total", value: "2,5 mm Al" },
      { label: "Tempo de exposição", value: "0,2–4 s" },
      { label: "Radiação de fuga", value: "≤ 0,002 mGy/h a 1 m (norma: 0,25)" },
      { label: "Sensor", value: "CMOS APS com placa de fibra óptica (FOP)" },
      { label: "Cintilador", value: "GOS" },
      { label: "Área ativa do sensor", value: "30×22,5 mm" },
      { label: "Pixel / resolução", value: "18,5 µm · 1600×1200 · 14–20 lp/mm" },
      { label: "Compatibilidade", value: "Windows 2000/XP/7/8/10/11 (TWAIN)" },
      { label: "Dimensões", value: "152×57×26 cm · 57 kg" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "dx10p-cr",
    model: "DX10P-CR",
    category: "RADIOLOGIA ODONTOLÓGICA",
    name: "Sistema de Radiografia Intraoral Veterinária CR Portátil",
    shortName: "Raio-X Intraoral CR",
    productUrl: "https://www.shinova.com/product/detailp/Digital-Veterinary-Intraoral-CR-X-Ray-Imaging-System-DX10P-CR",
    images: [
      "/products/dx10p-cr.jpg",
      "/products/dx10p-cr-2.jpg",
      "/products/dx10p-cr-3.jpg",
      "/products/dx10p-cr-4.jpg",
      "/products/dx10p-cr-5.jpg",
    ],
    description: [
      "O DX10P-CR é o sistema de radiografia intraoral veterinária por placa de fósforo (CR) portátil da Shinova, leitor altamente integrado e compacto (1,5 kg) para diagnóstico e tratamento móvel, ponto a ponto, dentro e fora do consultório.",
      "Imagem em até 5 segundos com leitura a laser (spot de 35 µm, 660 nm) e conversão de 14 bits. Trabalha com placas de imagem flexíveis em 4 tamanhos (0, 1, 2 e 3), que se adaptam melhor à arcada e tornam a tomada mais confortável e precisa em diferentes cenários.",
      "Operação de um toque, leve e portátil, ideal para clínicas que precisam de mobilidade sem abrir mão de qualidade de imagem. Compatível com Windows 7/10/11.",
    ],
    specs: [
      { label: "Tensão do tubo", value: "60 kV" },
      { label: "Corrente do tubo", value: "1,5 mA" },
      { label: "Tempo de exposição", value: "0,1–2 s" },
      { label: "Frequência", value: "30 kHz" },
      { label: "Foco do tubo", value: "0,3×0,3 mm" },
      { label: "Distância pele–cone", value: "130 mm" },
      { label: "Tempo de imagem (CR)", value: "≤ 5 s" },
      { label: "Laser", value: "660 nm · spot 35 µm" },
      { label: "ADC", value: "14 bits" },
      { label: "Placas de imagem", value: "4 tamanhos (0/1/2/3)" },
      { label: "Bateria", value: "DC 14,8V · 6400 mAh" },
      { label: "Carregador", value: "AC 100–240V" },
      { label: "Sistema", value: "Windows 7/10/11" },
      { label: "Peso", value: "Leitor 1,5 kg · sistema 2,5 kg" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "hp-high",
    model: "401P-M4",
    category: "CANETA DE ALTA ROTAÇÃO",
    name: "Caneta de Alta Rotação Veterinária (Cabeça Padrão)",
    shortName: "Alta Rotação",
    productUrl: "https://www.shinova.com/product/detailp/Standard-Head-High-speed-handpiece-401P-M4",
    images: [
      "/products/hp-high.jpg",
      "/products/hp-high-2.jpg",
      "/products/hp-high-3.jpg",
      "/products/hp-high-4.jpg",
      "/products/hp-high-5.jpg",
      "/products/hp-high-6.jpg",
    ],
    description: [
      "A 401P-M4 é a caneta de alta rotação veterinária da Shinova, de cabeça padrão e conexão M4 (4 furos), turbina de até 420.000 rpm para cortes precisos e remoção eficiente em procedimentos odontológicos veterinários.",
      "Sistema de troca de broca por botão (push button), cabeça compacta (14,6 mm de altura, 11,2 mm de diâmetro) e operação silenciosa (≤ 70 dB). Compatível com brocas de Ø 1,59–1,6 mm × 21–23 mm e acopla na maioria dos equipos com conexão M4.",
    ],
    specs: [
      { label: "Conexão", value: "M4 (4 furos)" },
      { label: "Rotação", value: "370.000–420.000 rpm" },
      { label: "Pressão de ar", value: "180–250 kPa (1,8–2,5 kgf/cm²)" },
      { label: "Pressão de água", value: "198 kPa" },
      { label: "Cabeça", value: "Altura 14,6 mm · Ø 11,2 mm" },
      { label: "Mandril", value: "Troca de broca por botão (push button)" },
      { label: "Brocas compatíveis", value: "Ø 1,59–1,6 mm × 21–23 mm" },
      { label: "Ruído", value: "≤ 70 dB" },
      { label: "Origem", value: CN },
    ],
  },
  {
    id: "hp-low",
    model: "201-M4",
    category: "CANETA DE BAIXA ROTAÇÃO",
    name: "Caneta de Baixa Rotação Veterinária",
    shortName: "Baixa Rotação",
    productUrl: "https://www.shinova.com/product/detailp/Low-speed-handpiece-201-M4",
    images: [
      "/products/hp-low.jpg",
      "/products/hp-low-2.jpg",
      "/products/hp-low-3.jpg",
      "/products/hp-low-4.jpg",
      "/products/hp-low-5.jpg",
      "/products/hp-low-6.jpg",
      "/products/hp-low-7.jpg",
      "/products/hp-low-8.jpg",
    ],
    description: [
      "A 201-M4 é a caneta de baixa rotação veterinária da Shinova, tipo E, relação 1:1, com sistema de refrigeração externa e conexão M4 (4 furos). Indicada para procedimentos odontológicos veterinários que pedem torque e controle em baixa velocidade.",
      "Rotação de 22.000–27.000 rpm dentro das pressões padrão de ar e água, operação silenciosa (≤ 70 dB) e compatibilidade com brocas de Ø 2,334–2,355 mm. Acopla na maioria dos equipos com conexão M4.",
    ],
    specs: [
      { label: "Conexão", value: "M4 (4 furos)" },
      { label: "Tipo", value: "E-type, relação 1:1" },
      { label: "Refrigeração", value: "Externa" },
      { label: "Rotação", value: "22.000–27.000 rpm" },
      { label: "Pressão de ar", value: "245–392 kPa (2,5–4,0 kgf/cm²)" },
      { label: "Pressão de água", value: "198 kPa" },
      { label: "Brocas compatíveis", value: "Ø 2,334–2,355 mm" },
      { label: "Ruído", value: "≤ 70 dB" },
      { label: "Origem", value: CN },
    ],
  },
];

export const equipamentodentalvet: SiteConfig = {
  id: "equipamentodentalvet",
  domain: "equipamentodentalvet.com.br",
  lineName: "Linha Odontológica",
  countWord: "5 equipamentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Odontologia Veterinária",
    description:
      "Equipamentos de odontologia veterinária, unidade odontológica móvel, radiografia intraoral digital e CR, e canetas de alta e baixa rotação. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Distribuição oficial Shinova no Brasil · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Odontologia Veterinária",
    kicker: "Linha Odontológica Premium · Distribuição Conecta · Fabricação Shinova",
    titleHtml: 'Odontologia veterinária completa — <em class="text-accent">do raio-X à profilaxia, em uma linha só.</em>',
    subtitle:
      "Cinco equipamentos de odontologia veterinária: unidade odontológica móvel, radiografia intraoral digital e CR, e canetas de alta e baixa rotação. Representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Estação odontológica, radiologia e canetas em <strong>uma só linha</strong>",
      "Radiografia intraoral <strong>digital e CR</strong> com imagem em segundos",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional + garantia 12 meses + treinamento da equipe",
    ],
    ctaPrimary: "Ver os 5 equipamentos",
    cardTag: "LINHA ODONTOLÓGICA 2026",
    cardTitle: "Odontologia",
    cardImage: "/banco/odontologia/veterinario-exame-dentes-cao.png",
    cardStats: [
      ["5", "Equipamentos"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas odontológicas <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Linha odontológica completa, fornecedor único",
        p: "Da unidade odontológica móvel ao raio-X intraoral, cinco equipamentos que cobrem a odontologia veterinária em uma única origem. Você simplifica compra, treinamento, manutenção e suporte, sem montar a sala com vários fornecedores diferentes.",
      },
      {
        n: "ii.",
        title: "Equipamentos veterinários de origem",
        p: "Pensados para rotina odontológica veterinária: unidade móvel que funciona sem obra, sensores e canetas compatíveis com a prática clínica de cães, gatos e exóticos. Não é equipamento humano adaptado às pressas.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha odontológica · 5 equipamentos",
    titleHtml: 'Toque em qualquer equipamento <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Cinco equipamentos que cobrem estação odontológica, radiografia intraoral e canetas de alta e baixa rotação, fornecidos como linha integrada pela Conecta.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha odontológica Conecta <em class="text-accent">se encaixa na sua operação.</em>',
    cards: [
      {
        title: "Profilaxia e tratamento odontológico",
        p: "Limpeza, extrações e restaurações com a unidade móvel DU-100 + canetas de alta e baixa rotação, tudo na própria clínica.",
        img: "/banco/odontologia/profilaxia-dentaria-gato.png",
      },
      {
        title: "Diagnóstico por imagem intraoral",
        p: "Radiografia digital de foco micro para avaliar raízes e indicar endodontia com precisão. Sistema DX10D-E com sensor de fibra óptica.",
        img: "/banco/odontologia/raio-x-intraoral-cao.png",
      },
      {
        title: "Atendimento móvel e a campo",
        p: "Radiografia CR portátil (1,5 kg) com imagem em 5 segundos para diagnóstico ponto a ponto. Sistema DX10P-CR.",
        img: "/banco/odontologia/odontologia-equina-cavalo.png",
      },
      {
        title: "Corte e acabamento de precisão",
        p: "Caneta de alta rotação (até 420.000 rpm) + baixa rotação 1:1 com refrigeração, para cada etapa do procedimento.",
        img: "/banco/odontologia/instrumental-odontologico-vet.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Antes eu encaminhava os casos odontológicos. Com a unidade móvel e o raio-X intraoral, passei a resolver dentro da própria clínica, diagnóstico, extração e acompanhamento no mesmo lugar. O suporte e o treinamento da Conecta fizeram a diferença na adoção.",
    name: "Dr. Rafael Menezes",
    role: "Clínica Veterinária Pet Center · Contagem/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os 5 equipamentos juntos ou só alguns?",
      a: "Pode comprar como achar melhor. Trabalhamos com pacote completo (com condição comercial diferenciada) e com aquisição parcial. Muitas clínicas começam com a unidade odontológica e as canetas, e adicionam a radiografia depois. Faz orçamento da configuração que faz sentido para sua operação atual.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Preciso de obra ou instalação especial para unidade odontológica?",
      a: "Não. A DU-100 é móvel, com compressor de ar, reservatórios e estabilizador de tensão embutidos, funciona ligada à tomada (100–240V), sem necessidade de ar comprimido externo ou obra. Os rodízios permitem levar o equipamento de uma sala para outra.",
    },
    {
      q: "Os equipamentos têm certificação Anvisa?",
      a: "Os equipamentos têm certificação CE (Conformidade Europeia) e ISO 13485 do fabricante. Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica que acompanha cada equipamento.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica e o treinamento da equipe.",
    },
  ],

  quote: {
    titleHtml: 'Cada clínica odontológica é única. <em class="text-accent">Sua proposta também precisa ser.</em>',
    subtitle:
      "Conta o que você precisa equipar, estação odontológica, radiografia, canetas ou tudo junto. Devolvemos uma proposta sob medida com equipamentos, acessórios, treinamento e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com equipamentos, acessórios, treinamento e condições",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["300+", "clientes atendidos"],
    ],
    packageLabel: "Pacote completo (todos os 5)",
  },

  footerCatalog: [
    "Unidade odontológica",
    "Radiografia intraoral digital",
    "Radiografia intraoral CR",
    "Caneta de alta rotação",
    "Caneta de baixa rotação",
    "Acessórios e brocas",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: dentalProducts,
};
