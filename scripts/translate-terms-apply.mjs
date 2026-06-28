import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const txt = readFileSync(path, "utf8");
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

// Mapa de tradução EN -> PT-BR (terminologia veterinária).
// Sem travessão "—" (uso vírgula/barra). Idempotente: se o valor já estiver
// em PT-BR (não estiver no mapa), é mantido como está.
const MAP = {
  "Animal Thermometer": "Termômetro para Animais",
  "Autoclave/Sterilizer": "Autoclave/Esterilizador",
  "Biological Microscope": "Microscópio Biológico",
  "Black/White Ultrasound": "Ultrassom Preto e Branco",
  "Blood Gas Electrolyte Analyzer": "Analisador de Gasometria e Eletrólitos",
  "Cabinet": "Armário",
  "Centrifuge": "Centrífuga",
  "Chemistry Analyzer": "Analisador Bioquímico",
  "Coagulometer Analyzer": "Coagulômetro",
  "Colloidal Gold Rapid Test": "Teste Rápido de Ouro Coloidal",
  "Color Doppler Ultrasound": "Ultrassom Doppler Colorido",
  "Curing Light": "Fotopolimerizador",
  "Curing Light Infared/Ultraviolet Lamp": "Fotopolimerizador, Lâmpada Infravermelha/Ultravioleta",
  "Dental Handpiece": "Caneta Odontológica",
  "Dental Unit": "Equipo Odontológico",
  "Dental X-Ray": "Raio-X Odontológico",
  "Digital X-Ray Machine": "Aparelho de Raio-X Digital",
  "Doppler Blood Pressure": "Doppler de Pressão Arterial",
  "Electric Grooming Table": "Mesa de Banho e Tosa Elétrica",
  "ENT Examination": "Exame Otorrinolaringológico",
  "Examination Table": "Mesa de Exame",
  "Grooming Clipper": "Máquina de Tosa",
  "Grooming Scissors & Brush": "Tesouras e Escovas de Tosa",
  "Grooming Table": "Mesa de Banho e Tosa",
  "Grooming Tub/Bath": "Banheira de Banho e Tosa",
  "Head Light": "Foco de Cabeça",
  "Hematology Analyzer": "Analisador Hematológico",
  "Hydraulic Grooming Table": "Mesa de Banho e Tosa Hidráulica",
  "Immunoflurescence Analyzer": "Analisador de Imunofluorescência",
  "Infared/Ultraviolet Lamp": "Lâmpada Infravermelha/Ultravioleta",
  "Infusion Pump": "Bomba de Infusão",
  "LED Surgery Light": "Foco Cirúrgico LED",
  "Nebulizer": "Nebulizador",
  "Operating Microscope": "Microscópio Cirúrgico",
  "Oxygen Concentrator": "Concentrador de Oxigênio",
  "Pet Dryer": "Secador para Pets",
  "Pet Scale": "Balança para Pets",
  "Pet Seat Cover": "Capa de Banco para Pets",
  "Pet Treadmill": "Esteira para Pets",
  "Pre-Vacuum Autoclave": "Autoclave de Pré-Vácuo",
  "Pregnant Test": "Teste de Gestação",
  "Refrigerator": "Refrigerador",
  "Revolving Pendant": "Pendente Giratório",
  "Slit Lamp": "Lâmpada de Fenda",
  "Stainless Steel Cage": "Gaiola de Aço Inoxidável",
  "Stethoscope": "Estetoscópio",
  "Stretcher": "Maca",
  "Suction Unit": "Unidade de Sucção",
  "Surgical Instruments": "Instrumentos Cirúrgicos",
  "Syringe Pump": "Bomba de Seringa",
  "Transfusion Table": "Mesa de Transfusão",
  "Ultrasonic Cleaner": "Lavadora Ultrassônica",
  "Ultrasonic Scaler": "Ultrassom Odontológico",
  "Urine Analyzer": "Analisador de Urina",
  "Vascular Doppler": "Doppler Vascular",
  "Veterinary Anesthesia Machine": "Aparelho de Anestesia Veterinária",
  "Veterinary Anesthesia Ventilator": "Ventilador de Anestesia Veterinária",
  "Veterinary Bone Drill & Saw": "Furadeira e Serra Óssea Veterinária",
  "Veterinary CO2 Monitor": "Monitor de CO2 Veterinário",
  "Veterinary CT Scanner": "Tomógrafo Veterinário",
  "Veterinary Defibrillator Monitor": "Monitor Desfibrilador Veterinário",
  "Veterinary ECG Machine": "Aparelho de ECG Veterinário",
  "Veterinary Electrosurgical Unit": "Bisturi Eletrônico Veterinário",
  "Veterinary Endoscope": "Endoscópio Veterinário",
  "Veterinary ICU Incubator": "Incubadora de UTI Veterinária",
  "Veterinary Laparoscope": "Laparoscópio Veterinário",
  "Veterinary Laser Surgery": "Laser Cirúrgico Veterinário",
  "Veterinary Monitor": "Monitor Veterinário",
  "Veterinary Operating Table": "Mesa Cirúrgica Veterinária",
  "Veterinary Pulse Oximeter": "Oxímetro de Pulso Veterinário",
  "Veterinary Ultrasonic Scalpel": "Bisturi Ultrassônico Veterinário",
  "Veterinary Warmer": "Aquecedor Veterinário",
  "Wood Lamp": "Lâmpada de Wood",
  "X-Ray Machine": "Aparelho de Raio-X",
  "X-Ray Supplies": "Insumos de Raio-X",
};

function translate(value) {
  if (value == null) return value;
  const s = String(value);
  if (Object.prototype.hasOwnProperty.call(MAP, s)) return MAP[s];
  return s; // já traduzido ou desconhecido: mantém
}

const env = loadEnv(new URL("../.env.local", import.meta.url));
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await supabase
  .from("produtos")
  .select("id, aplicacoes, subcategoria");

if (error) {
  console.error("ERROR select:", error);
  process.exit(1);
}

console.log("TOTAL PRODUTOS:", data.length);

// Sanity: garante que todo termo EN distinto tem tradução.
const missing = new Set();
for (const row of data) {
  if (Array.isArray(row.aplicacoes)) {
    for (const a of row.aplicacoes) {
      if (a != null && !Object.prototype.hasOwnProperty.call(MAP, String(a)) && /[A-Za-z]/.test(String(a)) && /[a-z]{2,}/.test(String(a))) {
        // heurística leve só pra log; não bloqueia
      }
    }
  }
}

let updated = 0;
let unchanged = 0;
const samples = [];
const failures = [];

for (const row of data) {
  const origApps = Array.isArray(row.aplicacoes) ? row.aplicacoes : row.aplicacoes;
  const origSub = row.subcategoria;

  let newApps = origApps;
  if (Array.isArray(origApps)) {
    newApps = origApps.map((a) => translate(a));
  }
  const newSub = translate(origSub);

  const appsChanged =
    Array.isArray(origApps) &&
    JSON.stringify(origApps) !== JSON.stringify(newApps);
  const subChanged = origSub !== newSub;

  if (!appsChanged && !subChanged) {
    unchanged++;
    continue;
  }

  const payload = {};
  if (appsChanged) payload.aplicacoes = newApps;
  if (subChanged) payload.subcategoria = newSub;

  const { error: upErr } = await supabase
    .from("produtos")
    .update(payload)
    .eq("id", row.id);

  if (upErr) {
    failures.push({ id: row.id, error: upErr.message });
    continue;
  }

  updated++;
  if (samples.length < 5) {
    samples.push({
      id: row.id,
      antes: { aplicacoes: origApps, subcategoria: origSub },
      depois: { aplicacoes: newApps, subcategoria: newSub },
    });
  }
}

console.log("=== RESULTADO ===");
console.log("Atualizados:", updated);
console.log("Sem mudança (já PT-BR / idempotente):", unchanged);
console.log("Falhas:", failures.length);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
console.log("=== AMOSTRA ANTES/DEPOIS ===");
console.log(JSON.stringify(samples, null, 2));
