import type { SiteConfig } from "./types";
import { cirugiavet } from "@/sites/cirugiavet";
import { analiseveterinaria } from "@/sites/analiseveterinaria";
import { equipamentodentalvet } from "@/sites/equipamentodentalvet";
import { veterinarioultrassom } from "@/sites/veterinarioultrassom";
import { ultrassomdoppler } from "@/sites/ultrassomdoppler";
import { endoscopiaveterinario } from "@/sites/endoscopiaveterinario";
import { microscopiodermatologico } from "@/sites/microscopiodermatologico";
import { equipamentovet } from "@/sites/equipamentovet";
import { gemafalsa } from "@/sites/gemafalsa";

const configs: Record<string, SiteConfig> = {
  cirugiavet,
  analiseveterinaria,
  equipamentodentalvet,
  veterinarioultrassom,
  ultrassomdoppler,
  endoscopiaveterinario,
  microscopiodermatologico,
  equipamentovet,
  gemafalsa,
};

// VITE_SITE é definido no build (um build por domínio). Default = cirugiavet.
const activeId = (import.meta.env.VITE_SITE as string) || "cirugiavet";

export const site: SiteConfig = configs[activeId] ?? cirugiavet;

export const WHATSAPP_NUMBER = site.brand.whatsapp;
export const PHONE_DISPLAY = site.brand.phoneDisplay;
export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
