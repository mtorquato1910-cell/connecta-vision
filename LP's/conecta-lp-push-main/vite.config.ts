import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Metadados por site (injetados no index.html no build, conforme VITE_SITE).
// Títulos keyword-first conforme documento do cliente.
const META: Record<string, { title: string; description: string }> = {
  analiseveterinaria: {
    title: "Análises Clínicas Veterinárias: Analisadores Importados | Conecta",
    description:
      "Analisadores veterinários de hematologia, bioquímica, gasometria, coagulação e urinálise. Representação oficial, suporte nacional e garantia de 12 meses.",
  },
  cirugiavet: {
    title: "Material Cirúrgico Veterinário: Centro Cirúrgico | Conecta",
    description:
      "Equipamentos para o centro cirúrgico veterinário: anestesia, ventilação, monitoramento, foco LED e bisturi ultrassônico. Representação oficial e suporte nacional.",
  },
  equipamentodentalvet: {
    title: "Odontologia Veterinária: Equipamentos e Raio-X | Conecta",
    description:
      "Equipamentos de odontologia veterinária: unidade odontológica móvel, raio-X intraoral digital e CR, e canetas de alta e baixa rotação. Representação oficial.",
  },
  veterinarioultrassom: {
    title: "Ultrassom Veterinário: Portátil, de Mão e Doppler | Conecta",
    description:
      "Ultrassom veterinário color doppler, portátil e de mão. Do diagnóstico abdominal e cardíaco à gestação no campo. Representação oficial e suporte nacional.",
  },
  ultrassomdoppler: {
    title: "Ultrassom Color Doppler Veterinário DopScan 10V | Conecta",
    description:
      "DopScan 10V: ultrassom color doppler veterinário digital, com estação de trabalho de 500 GB e DICOM 3.0. Representação oficial e suporte técnico nacional.",
  },
  endoscopiaveterinario: {
    title: "Endoscopia Veterinária: Endoscópios e Vídeo | Conecta",
    description:
      "Endoscopia veterinária: endoscópios flexíveis, broncoscópio equino, sistema de vídeo 3-em-1 e câmera sem fio. Representação oficial e suporte técnico nacional.",
  },
  microscopiodermatologico: {
    title: "Microscopia Veterinária: Biológico, Digital e Cirúrgico | Conecta",
    description:
      "Microscopia veterinária: microscópio biológico, digital com tela e cirúrgico. Para dermatologia, citologia, patologia e microcirurgia. Representação oficial.",
  },
  equipamentovet: {
    title: "Equipamentos Veterinários Importados: Catálogo | Conecta",
    description:
      "Catálogo de equipamentos veterinários: cirurgia, anestesia, monitoramento, odontologia, ultrassom, laboratório, endoscopia e microscopia. Representação oficial.",
  },
  gemafalsa: {
    title: "Instrumentos de Gemologia e Perícia de Gemas | Conecta",
    description:
      "Instrumentos de gemologia para identificar gemas e detectar imitações e sintéticos: refratômetros, polariscópios e espectrômetros Raman da A. KRÜSS e GoyaLab.",
  },
};

const SITE = process.env.VITE_SITE || "cirugiavet";
const meta = META[SITE] ?? META.cirugiavet;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "inject-site-meta",
      transformIndexHtml(html) {
        return html
          .replaceAll("%SITE_TITLE%", meta.title)
          .replaceAll("%SITE_DESC%", meta.description);
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Preview local exposto via túnel cloudflared aceita qualquer host (preview temporário).
  preview: { allowedHosts: true },
});
