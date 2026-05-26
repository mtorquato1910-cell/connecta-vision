"""
Gera favicons a partir da imagem do Gemini (C + erlenmeyer já recortado).

Diferente do v1 (que detectava ciano na logo inteira), aqui a fonte já é o
ícone pronto com fundo transparente — só precisa de padding + resize.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Gemini_Generated_Image_kmx6flkmx6flkmx6.png"
PUBLIC = ROOT / "public"


def trim_transparent_borders(img: Image.Image) -> Image.Image:
    """Remove margens transparentes para centralizar o ícone."""
    rgba = img.convert("RGBA")
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    return rgba.crop(bbox)


def make_padded_square(img: Image.Image, padding_ratio: float = 0.08) -> Image.Image:
    """Centra o ícone num canvas quadrado transparente, com folga."""
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
    img = Image.open(SRC).convert("RGBA")
    print(f"Tamanho original: {img.size}")

    trimmed = trim_transparent_borders(img)
    print(f"Após remover bordas transparentes: {trimmed.size}")

    padded = make_padded_square(trimmed)
    print(f"Quadrado com padding: {padded.size}")

    padded.save(PUBLIC / "favicon-source.png", "PNG", optimize=True)
    print("  favicon-source.png (referência)")

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

    print("\n✅ Favicons regenerados em public/")


if __name__ == "__main__":
    main()
