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
    # ROI canto superior esquerdo (logo preto sobre branco)
    "logo": {
        "x_start": 0.00,
        "x_end":   0.32,
        "y_start": 0.00,
        "y_end":   0.16,
        # tudo que NÃO é branco-puro na ROI vira branco. Funciona porque o
        # fundo dessas imagens é sempre branco puro (255,255,255).
        "white_threshold": 245,  # luminância >= 245 = mantém; < 245 = vira branco
        "dilate_iter": 2,
    },
    # ROI central (selo diagonal "SHINOVA Veterinary")
    # Estratégia: marca d'água é "quase branco sobre fundo escuro" (selo
    # semi-transparente). Em escala de cinza, fica em range bem estreito:
    # 215–245 sobre regiões escuras do produto. Pegar só isso evita
    # mascarar elementos reais.
    "central": {
        "x_start": 0.18,
        "x_end":   0.82,
        "y_start": 0.32,
        "y_end":   0.72,
        # range estreito do "branco fantasma" do selo
        "gray_min": 200,
        "gray_max": 240,
        # mas só conta se vizinhança for ESCURA (selo sempre fica sobre área escura)
        "dark_neighborhood_max": 100,
        "dilate_iter": 1,
    },
    "inpaint_radius": 8,
    # cv2.INPAINT_TELEA (mais rápido) | cv2.INPAINT_NS (melhor com bordas suaves)
    "inpaint_method": cv2.INPAINT_NS,
}


def build_mask_logo(gray: np.ndarray, w: int, h: int) -> np.ndarray:
    """Máscara para a logo preta no canto superior esquerdo.
    Como o fundo é sempre branco puro, mascara tudo que não é branco na ROI."""
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
    """Máscara para selo diagonal cinza-claro no centro.

    Estratégia: o selo aparece como pixels claros (200-240) SOBRE área escura.
    Para cada pixel candidato, verificamos se a vizinhança 13x13 é predominante
    escura. Se sim → é selo sobre fundo escuro → mascarar.
    """
    p = PARAMS["central"]
    x0, x1 = int(w * p["x_start"]), int(w * p["x_end"])
    y0, y1 = int(h * p["y_start"]), int(h * p["y_end"])

    mask = np.zeros((h, w), dtype=np.uint8)
    roi = gray[y0:y1, x0:x1]

    # 1. Candidatos: cor do selo
    in_range = ((roi >= p["gray_min"]) & (roi <= p["gray_max"])).astype(np.uint8) * 255

    # 2. Filtro: vizinhança escura (média 13x13 < dark_neighborhood_max)
    avg = cv2.blur(roi, (13, 13))
    dark_neighborhood = (avg < p["dark_neighborhood_max"]).astype(np.uint8) * 255

    # AND: pixel é candidato E está em vizinhança escura
    m = cv2.bitwise_and(in_range, dark_neighborhood)

    # Conecta letras
    kernel = np.ones((3, 3), np.uint8)
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
        debug[mask_logo > 0] = (255, 0, 0)     # azul = região logo
        debug[mask_central > 0] = (0, 0, 255)  # vermelho = região selo
        cv2.imwrite(str(out_path.parent / f"_debug_{img_path.name}"), debug)

    # Estratégia diferente por região:
    # 1. LOGO canto: substitui por branco puro (mais limpo que inpaint)
    result = img.copy()
    result[mask_logo > 0] = (255, 255, 255)

    # 2. SELO central: inpaint Navier-Stokes (preserva gradientes do fundo)
    if mask_central.sum() > 0:
        result = cv2.inpaint(result, mask_central, PARAMS["inpaint_radius"], PARAMS["inpaint_method"])

    cv2.imwrite(str(out_path), result, [cv2.IMWRITE_JPEG_QUALITY, 92])

    logo_px = int(mask_logo.sum() / 255)
    central_px = int(mask_central.sum() / 255)
    print(f"  ✅ {img_path.name:<35} logo:{logo_px:>6}px  selo:{central_px:>6}px")
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
