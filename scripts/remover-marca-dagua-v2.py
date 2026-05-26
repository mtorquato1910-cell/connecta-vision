#!/usr/bin/env python3
"""
v2 — Remove marca d'água SHINOVA usando LaMa (deep learning inpainting).

Diferenças vs v1:
- Logo canto: mesma técnica (substitui por branco — funciona perfeito)
- Selo diagonal central: usa LaMa neural inpainting em vez de cv2.inpaint
  Resultado muito superior em áreas com texturas complexas (tela de monitor,
  grades de gaiola, gradientes do produto).

Uso:
    python scripts/remover-marca-dagua-v2.py <input_dir> <output_dir> [--debug]

Primeira execução baixa modelo LaMa (~200MB).
"""

from __future__ import annotations
import sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
from simple_lama_inpainting import SimpleLama

sys.stdout.reconfigure(encoding="utf-8")

# Estratégia para o selo: mascara uma faixa diagonal generosa onde
# sabemos que o selo está localizado, e deixa o LaMa reconstruir o fundo.
PARAMS = {
    "logo": {
        # ROI canto superior esquerdo (logo preta sobre branco)
        "x_start": 0.00, "x_end": 0.32,
        "y_start": 0.00, "y_end": 0.16,
        "white_threshold": 245,
        "dilate_iter": 2,
    },
    "central_band": {
        # Banda horizontal generosa onde o selo SHINOVA Veterinary fica.
        # O selo é diagonal/horizontal levemente inclinado, ocupando cerca de
        # 50% da largura e 12% da altura no centro vertical.
        "x_start": 0.20, "x_end": 0.80,
        "y_start": 0.42, "y_end": 0.62,
        # Dentro dessa banda, identifica pixels "anormalmente claros" comparados
        # ao fundo médio local. Texto da marca = pixels mais claros que a região.
        "brightness_diff": 25,   # pixel mais claro que média local em 25+
        "dilate_iter": 2,
    },
}

print("🔄 Inicializando LaMa (primeira execução baixa modelo ~200MB)...")
LAMA = SimpleLama()
print("✅ LaMa pronto\n")


def build_mask_logo(gray: np.ndarray, w: int, h: int) -> np.ndarray:
    p = PARAMS["logo"]
    x0, x1 = int(w * p["x_start"]), int(w * p["x_end"])
    y0, y1 = int(h * p["y_start"]), int(h * p["y_end"])
    mask = np.zeros((h, w), dtype=np.uint8)
    roi = gray[y0:y1, x0:x1]
    _, m = cv2.threshold(roi, p["white_threshold"], 255, cv2.THRESH_BINARY_INV)
    kernel = np.ones((3, 3), np.uint8)
    m = cv2.dilate(m, kernel, iterations=p["dilate_iter"])
    mask[y0:y1, x0:x1] = m
    return mask


def build_mask_central(gray: np.ndarray, w: int, h: int) -> np.ndarray:
    """
    Detecta o selo usando subtração local: o selo é texto SEMPRE mais claro
    que o fundo subjacente (independente se o fundo é preto ou branco-acinzentado).
    Calcula a média local com blur grande, subtrai, e pega onde a diferença
    é positiva (pixel claro sobre fundo mais escuro).
    """
    p = PARAMS["central_band"]
    x0, x1 = int(w * p["x_start"]), int(w * p["x_end"])
    y0, y1 = int(h * p["y_start"]), int(h * p["y_end"])

    mask = np.zeros((h, w), dtype=np.uint8)
    roi = gray[y0:y1, x0:x1].astype(np.int16)

    # Blur grande = média local (representa fundo subjacente)
    avg = cv2.blur(roi.astype(np.uint8), (35, 35)).astype(np.int16)
    diff = roi - avg

    # pixel mais claro que vizinhança = candidato a texto
    m = (diff > p["brightness_diff"]).astype(np.uint8) * 255

    # Conecta letras adjacentes
    kernel = np.ones((4, 4), np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, kernel)
    m = cv2.dilate(m, kernel, iterations=p["dilate_iter"])

    mask[y0:y1, x0:x1] = m
    return mask


def remover_marca_dagua(img_path: Path, out_path: Path, save_debug: bool = False) -> bool:
    img = cv2.imread(str(img_path))
    if img is None:
        print(f"  ❌ Falha ao carregar: {img_path.name}")
        return False

    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    mask_logo = build_mask_logo(gray, w, h)
    mask_central = build_mask_central(gray, w, h)

    if save_debug:
        debug = img.copy()
        debug[mask_logo > 0] = (255, 0, 0)
        debug[mask_central > 0] = (0, 0, 255)
        cv2.imwrite(str(out_path.parent / f"_debug_{img_path.name}"), debug)

    # 1. Logo canto: branco direto
    result = img.copy()
    result[mask_logo > 0] = (255, 255, 255)

    # 2. Selo central: LaMa neural inpainting
    if mask_central.sum() > 0:
        # LaMa precisa PIL RGB + máscara PIL L
        result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(result_rgb)
        pil_mask = Image.fromarray(mask_central, mode="L")
        lama_result = LAMA(pil_img, pil_mask)
        result_rgb = np.array(lama_result)
        result = cv2.cvtColor(result_rgb, cv2.COLOR_RGB2BGR)

    cv2.imwrite(str(out_path), result, [cv2.IMWRITE_JPEG_QUALITY, 92])

    logo_px = int(mask_logo.sum() / 255)
    central_px = int(mask_central.sum() / 255)
    print(f"  ✅ {img_path.name:<35} logo:{logo_px:>6}px  selo:{central_px:>6}px")
    return True


def processar_pasta(input_dir: Path, output_dir: Path, debug: bool = False) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    exts = (".jpg", ".jpeg", ".png", ".webp")
    arquivos = sorted([f for f in input_dir.iterdir()
                       if f.suffix.lower() in exts and not f.name.startswith("_debug_")])

    print(f"📁 {len(arquivos)} imagens em {input_dir}")
    print(f"📁 Saída em {output_dir}\n")

    sucesso = 0
    for arquivo in arquivos:
        if remover_marca_dagua(arquivo, output_dir / arquivo.name, save_debug=debug):
            sucesso += 1

    print(f"\n✅ Concluído: {sucesso}/{len(arquivos)} processadas")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python remover-marca-dagua-v2.py <input> <output> [--debug]")
        sys.exit(1)
    debug = "--debug" in sys.argv
    processar_pasta(Path(sys.argv[1]), Path(sys.argv[2]), debug=debug)
