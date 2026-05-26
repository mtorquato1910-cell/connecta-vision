/**
 * Processamento de upload de imagens no client.
 *
 * Enquanto o servidor próprio do cliente não está disponível, imagens
 * enviadas pelo desktop são redimensionadas + comprimidas via Canvas e
 * persistidas como data URL (base64) dentro do mock localStorage.
 *
 * Quando o storage real estiver pronto (Sprint 6), basta trocar
 * `processImageFile` por uma chamada PUT ao servidor — o retorno
 * continua sendo uma string (URL pública).
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const ACCEPTED_IMAGE_EXTS = ".png,.jpg,.jpeg,.webp";

export const MAX_FILE_SIZE_MB = 10;

export type ProcessImageOptions = {
  /** Largura/altura máxima do lado maior (default 1600px). */
  maxDimension?: number;
  /** Qualidade JPEG entre 0 e 1 (default 0.85). */
  quality?: number;
  /** Força saída como JPEG mesmo se entrada for PNG (default true — economiza espaço). */
  forceJpeg?: boolean;
};

/**
 * Lê um File de imagem, redimensiona via Canvas e devolve um data URL
 * (string base64) pronto para armazenar e exibir em `<img src="...">`.
 *
 * Lança erro com mensagem amigável se o arquivo for inválido.
 */
export async function processImageFile(
  file: File,
  options: ProcessImageOptions = {},
): Promise<string> {
  const {
    maxDimension = 1600,
    quality = 0.85,
    forceJpeg = true,
  } = options;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato não suportado. Envie PNG, JPG ou WebP.");
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Arquivo grande demais. Máximo ${MAX_FILE_SIZE_MB} MB.`);
  }

  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const { width, height } = fitWithin(image.width, image.height, maxDimension);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Seu navegador não suporta processar imagens.");

  // PNG com transparência fica feio se viramos JPEG sem fundo.
  // Pintamos branco antes para evitar borda preta.
  if (forceJpeg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(image, 0, 0, width, height);

  const outputType = forceJpeg ? "image/jpeg" : file.type;
  const out = canvas.toDataURL(outputType, quality);

  if (!out || out === "data:,") {
    throw new Error("Não foi possível processar a imagem.");
  }

  return out;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Arquivo de imagem corrompido."));
    img.src = src;
  });
}

function fitWithin(
  width: number,
  height: number,
  max: number,
): { width: number; height: number } {
  if (width <= max && height <= max) return { width, height };
  const ratio = width / height;
  if (width >= height) {
    return { width: max, height: Math.round(max / ratio) };
  }
  return { width: Math.round(max * ratio), height: max };
}

/**
 * Aproximação do tamanho em KB de uma data URL base64. Útil para mostrar
 * ao usuário antes de salvar (alerta de quota do localStorage).
 */
export function dataUrlSizeKb(dataUrl: string): number {
  if (!dataUrl.startsWith("data:")) return 0;
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4 / 1024);
}
