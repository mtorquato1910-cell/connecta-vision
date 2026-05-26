"""
Gera favicons a partir da imagem do Gemini (C + erlenmeyer).

A imagem do Gemini vem com FUNDO XADREZ desenhado (não é transparência real).
Pipeline:
  1. Remove o xadrez via flood-fill a partir dos 4 cantos
     (preserva o branco interno da tampa do erlenmeyer porque ele
     nao esta conectado ao fundo)
  2. Centra num canvas quadrado com padding
  3. Gera todos os tamanhos + favicon.ico multi-size
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Gemini_Generated_Image_kmx6flkmx6flkmx6.png"
PUBLIC = ROOT / "public"

# Cor sentinela que marca onde estava o fundo (improvavel de existir no logo).
MARKER = (255, 0, 255)
# Tolerancia do flood-fill (o xadrez tem branco e cinza claro proximos).
FLOOD_THRESH = 70


def remove_checker_background(img: Image.Image) -> Image.Image:
    """Floor-fill dos 4 cantos com cor sentinela; depois converte para RGBA
    com alpha=0 onde estiver a cor sentinela."""
    rgb = img.convert("RGB").copy()
    w, h = rgb.size

    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(rgb, corner, MARKER, thresh=FLOOD_THRESH)

    rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src_pixels = rgb.load()
    dst_pixels = rgba.load()
    cleared = 0
    for y in range(h):
        for x in range(w):
            r, g, b = src_pixels[x, y]
            if (r, g, b) == MARKER:
                cleared += 1
                continue
            dst_pixels[x, y] = (r, g, b, 255)
    print(f"  Removidos {cleared} pixels de fundo xadrez")
    return rgba


def trim_transparent_borders(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    return rgba.crop(bbox)


def make_padded_square(img: Image.Image, padding_ratio: float = 0.06) -> Image.Image:
    w, h = img.size
    side = max(w, h)
    pad = int(side * padding_ratio)
    new_size = side + pad * 2
    canvas = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    x = (new_size - w) // 2
    y = (new_size - h) // 2
    canvas.paste(img, (x, y), img)
    return canvas


def main() -> None:
    print(f"Lendo {SRC}")
    img = Image.open(SRC)
    print(f"Tamanho original: {img.size}, modo: {img.mode}")

    cleaned = remove_checker_background(img)
    print(f"Fundo removido: {cleaned.size}")

    trimmed = trim_transparent_borders(cleaned)
    print(f"Apos cortar bordas vazias: {trimmed.size}")

    padded = make_padded_square(trimmed)
    print(f"Quadrado com padding: {padded.size}")

    padded.save(PUBLIC / "favicon-source.png", "PNG", optimize=True)
    print("  favicon-source.png")

    sizes = [16, 32, 48, 96, 180, 192, 512]
    for s in sizes:
        resized = padded.resize((s, s), Image.LANCZOS)
        if s == 180:
            resized.save(PUBLIC / "apple-touch-icon.png", "PNG", optimize=True)
            print(f"  apple-touch-icon.png ({s}x{s})")
        elif s == 192:
            resized.save(PUBLIC / "icon-192.png", "PNG", optimize=True)
            print("  icon-192.png")
        elif s == 512:
            resized.save(PUBLIC / "icon-512.png", "PNG", optimize=True)
            print("  icon-512.png")
        else:
            resized.save(PUBLIC / f"favicon-{s}.png", "PNG", optimize=True)
            print(f"  favicon-{s}.png")

    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [padded.resize(s, Image.LANCZOS) for s in ico_sizes]
    ico_imgs[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_imgs[1:],
    )
    print("  favicon.ico (multi-size 16/32/48)")

    print("\nOK Favicons regenerados em public/")


if __name__ == "__main__":
    main()
