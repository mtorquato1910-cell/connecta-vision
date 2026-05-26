"""
Processa Logo Conecta.jpeg → PNG transparente.
Remove fundo branco substituindo por alfa transparente.
"""
from PIL import Image
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "public" / "logo-conecta-original.jpeg"
DST_FULL = Path(__file__).resolve().parent.parent / "public" / "logo-conecta.png"

# tolerância para considerar um pixel "branco" (RGB próximo de 255)
WHITE_TOLERANCE = 20  # quanto maior, mais agressivo


def remove_white_bg(img: Image.Image, tolerance: int = WHITE_TOLERANCE) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size

    threshold = 255 - tolerance
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (255, 255, 255, 0)
    return img


def trim_transparent(img: Image.Image) -> Image.Image:
    """Recorta margens completamente transparentes."""
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def main() -> None:
    print(f"Lendo {SRC}")
    img = Image.open(SRC)
    print(f"Tamanho original: {img.size}, modo {img.mode}")

    out = remove_white_bg(img)
    out = trim_transparent(out)
    print(f"Tamanho recortado: {out.size}")

    out.save(DST_FULL, "PNG", optimize=True)
    print(f"Salvo: {DST_FULL} ({DST_FULL.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
