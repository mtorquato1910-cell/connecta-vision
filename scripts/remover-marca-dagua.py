#!/usr/bin/env python3
"""
Remove marca d'água SHINOVA das imagens de produtos Shinova.

Estratégia (descoberta visual em 2026-05-26):
  Há DUAS marcas d'água em cada imagem:
    1. Logo "SHINOVA Animal Health Solutions" no canto superior ESQUERDO (texto preto sobre branco)
    2. Selo diagonal "SHINOVA Veterinary" no CENTRO (texto cinza claro semi-transparente)
  Usamos máscaras diferentes por região + cv2.inpaint para cobrir cada uma.

Uso:
    python scripts/remover-marca-dagua.py <pasta_input> <pasta_output>

Exemplo:
    python scripts/remover-marca-dagua.py images/teste-originais images/teste-limpas
"""

from __future__ import annotations
import sys
from pathlib import Path
import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")

# Parâmetros (ajustáveis se houver imagens problemáticas)
PARAMS = {
    # ROI canto superior esquerdo (logo preto)
    "logo": {
        "x_start": 0.00,
        "x_end":   0.28,
        "y_start": 0.00,
        "y_end":   0.18,
        # pixels escuros (logo preto sobre branco)
        "threshold_max": 130,  # 0-130 = considerado texto da marca
        "dilate_iter": 2,
    },
    # ROI central (selo diagonal "SHINOVA Veterinary")
    "central": {
        "x_start": 0.15,
        "x_end":   0.85,
        "y_start": 0.30,
        "y_end":   0.75,
        # pixels cinza-médio (selo semi-transparente). Range cuidadoso para
        # não confundir com cinzas reais do produto.
        "gray_min": 150,
        "gray_max": 210,
        "dilate_iter": 1,
    },
    "inpaint_radius": 5,
    # cv2.INPAINT_TELEA (mais rápido) | cv2.INPAINT_NS (melhor com bordas suaves)
    "inpaint_method": cv2.INPAINT_NS,
}


def build_mask_logo(gray: np.ndarray, w: int, h: int) -> np.ndarray:
    """Máscara para a logo preta no canto superior esquerdo."""
    p = PARAMS["logo"]
    x0, x1 = int(w * p["x_start"]), int(w * p["x_end"])
    y0, y1 = int(h * p["y_start"]), int(h * p["y_end"])

    mask = np.zeros((h, w), dtype=np.uint8)
    roi = gray[y0:y1, x0:x1]
    # Pixels MUITO escuros = texto/logo
    _, m = cv2.threshold(roi, p["threshold_max"], 255, cv2.THRESH_BINARY_INV)
    # Dilata para cobrir bordas/anti-aliasing
    kernel = np.ones((3, 3), np.uint8)
    m = cv2.dilate(m, kernel, iterations=p["dilate_iter"])
    mask[y0:y1, x0:x1] = m
    return mask


def build_mask_central(gray: np.ndarray, w: int, h: int) -> np.ndarray:
    """Máscara para selo diagonal cinza no centro."""
    p = PARAMS["central"]
    x0, x1 = int(w * p["x_start"]), int(w * p["x_end"])
    y0, y1 = int(h * p["y_start"]), int(h * p["y_end"])

    mask = np.zeros((h, w), dtype=np.uint8)
    roi = gray[y0:y1, x0:x1]
    # Range de cinza-médio (NÃO branco puro, NÃO preto puro)
    lower = (roi >= p["gray_min"]).astype(np.uint8)
    upper = (roi <= p["gray_max"]).astype(np.uint8)
    m = (lower & upper) * 255

    # Close para conectar letras
    kernel = np.ones((3, 3), np.uint8)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, kernel)
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
    mask = cv2.bitwise_or(mask_logo, mask_central)

    if save_debug:
        debug = img.copy()
        debug[mask > 0] = (0, 0, 255)  # vermelho onde será inpaint
        cv2.imwrite(str(out_path.parent / f"_debug_{img_path.name}"), debug)

    result = cv2.inpaint(img, mask, PARAMS["inpaint_radius"], PARAMS["inpaint_method"])
    cv2.imwrite(str(out_path), result, [cv2.IMWRITE_JPEG_QUALITY, 92])

    print(f"  ✅ {img_path.name:<35} mascarado: {int(mask.sum()/255)} px")
    return True


def processar_pasta(input_dir: Path, output_dir: Path, debug: bool = False) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    exts = (".jpg", ".jpeg", ".png", ".webp")
    arquivos = sorted([f for f in input_dir.iterdir() if f.suffix.lower() in exts])

    print(f"\n📁 {len(arquivos)} imagens em {input_dir}")
    print(f"📁 Saída em {output_dir}")
    if debug:
        print("🐛 modo debug: salvando máscaras vermelhas em _debug_*.jpg")
    print()

    sucesso = 0
    for arquivo in arquivos:
        if arquivo.name.startswith("_debug_"):
            continue
        if remover_marca_dagua(arquivo, output_dir / arquivo.name, save_debug=debug):
            sucesso += 1

    print(f"\n✅ Concluído: {sucesso}/{len(arquivos)} processadas")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python remover-marca-dagua.py <input> <output> [--debug]")
        sys.exit(1)
    debug = "--debug" in sys.argv
    processar_pasta(Path(sys.argv[1]), Path(sys.argv[2]), debug=debug)
