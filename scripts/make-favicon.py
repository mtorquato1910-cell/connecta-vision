"""
Gera favicons a partir do segundo 'c' (com o erlenmeyer ciano) da logo Conecta.

1. Lê public/logo-conecta.png (já com fundo transparente)
2. Detecta região do erlenmeyer (procura pelo ciano #4FAFE0-ish)
3. Recorta um quadrado em torno do 'c' que contém o erlenmeyer
4. Salva favicons em 16/32/48/180/512 + favicon.ico multi-size
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo-conecta.png"
PUBLIC = ROOT / "public"

# A logo "conecta" tem 7 letras. O segundo 'c' (com erlenmeyer) é a 5ª letra,
# centralizada aproximadamente em x ~ 4.5/7 da largura total.
# Vou detectar o ciano para localização precisa.
CYAN_RANGE = ((40, 100), (160, 220), (200, 250))  # R, G, B de 'ciano do erlenmeyer'


def find_erlenmeyer_center(img: Image.Image) -> tuple[int, int]:
    """Encontra o centro de massa de pixels ciano (erlenmeyer)."""
    img_rgba = img.convert("RGBA")
    pixels = img_rgba.load()
    w, h = img_rgba.size

    xs: list[int] = []
    ys: list[int] = []
    rl, rh = CYAN_RANGE[0]
    gl, gh = CYAN_RANGE[1]
    bl, bh = CYAN_RANGE[2]

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128:
                continue
            if rl <= r <= rh and gl <= g <= gh and bl <= b <= bh:
                xs.append(x)
                ys.append(y)

    if not xs:
        # fallback: centro da imagem
        return (w // 2, h // 2)

    cx = sum(xs) // len(xs)
    cy = sum(ys) // len(ys)
    print(f"  Centro do erlenmeyer detectado: ({cx}, {cy}) — {len(xs)} pixels ciano")
    return cx, cy


def crop_letter_c(img: Image.Image) -> Image.Image:
    """Recorta um quadrado em torno do segundo 'c' (com erlenmeyer).
    Usa o bounding box dos pixels ciano (erlenmeyer) + margem da letra 'c'
    (que circunda o frasco com ~30% de raio extra)."""
    img_rgba = img.convert("RGBA")
    pixels = img_rgba.load()
    w, h = img_rgba.size

    rl, rh = CYAN_RANGE[0]
    gl, gh = CYAN_RANGE[1]
    bl, bh = CYAN_RANGE[2]

    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128:
                continue
            if rl <= r <= rh and gl <= g <= gh and bl <= b <= bh:
                if x < minx: minx = x
                if y < miny: miny = y
                if x > maxx: maxx = x
                if y > maxy: maxy = y
                found = True

    if not found:
        cx, cy = w // 2, h // 2
        minx, maxx = cx - 110, cx + 110
        miny, maxy = cy - 110, cy + 110

    # bounding box do erlenmeyer
    flask_w = maxx - minx
    flask_h = maxy - miny
    flask_cx = (minx + maxx) // 2
    flask_cy = (miny + maxy) // 2
    print(f"  Erlenmeyer bbox: ({minx},{miny})-({maxx},{maxy}) → {flask_w}x{flask_h}, centro ({flask_cx},{flask_cy})")

    # Letras de "conecta" estão grudadas — não há gap transparente entre elas.
    # Uso dimensões absolutas: largura ~13% da logo, altura ~65% da logo.
    flask_cx = (minx + maxx) // 2

    # Letra 'c' (com erlenmeyer) mede aprox:
    #   largura = 14% da largura total (~168px na logo 1198px)
    #   altura = 65% da altura total (~250px na logo 386px)
    crop_w = int(w * 0.115)  # mais apertado para não pegar o 't'
    crop_h = int(h * 0.66)

    # centro X um pouco à esquerda do frasco (o 'c' se estende mais à esquerda)
    cx_letter = flask_cx - int(w * 0.010)
    cy_letter = int(h * 0.36)  # vertical um pouco acima do meio (compensa sombra)

    left = max(0, cx_letter - crop_w // 2)
    right = min(w, left + crop_w)
    top = max(0, cy_letter - crop_h // 2)
    bottom = min(h, top + crop_h)

    print(f"  Bbox da letra c: ({left},{top})-({right},{bottom})  {right-left}x{bottom-top}")

    rect = img.crop((left, top, right, bottom))
    # Coloca esse retângulo num canvas quadrado transparente
    side = max(rect.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    px = (side - rect.size[0]) // 2
    py = (side - rect.size[1]) // 2
    canvas.paste(rect, (px, py), rect)
    crop = canvas
    print(f"  Recorte: ({left}, {top}, {right}, {bottom}) → {crop.size}")
    return crop


def make_padded_square(img: Image.Image, padding_ratio: float = 0.12) -> Image.Image:
    """Adiciona padding transparente para o ícone respirar."""
    w, h = img.size
    pad = int(max(w, h) * padding_ratio)
    new_size = max(w, h) + pad * 2
    canvas = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    x = (new_size - w) // 2
    y = (new_size - h) // 2
    canvas.paste(img, (x, y), img if img.mode == "RGBA" else None)
    return canvas


def main() -> None:
    print(f"Lendo {SRC}")
    img = Image.open(SRC).convert("RGBA")
    print(f"Tamanho original: {img.size}")

    crop = crop_letter_c(img)
    padded = make_padded_square(crop)
    print(f"Quadrado com padding: {padded.size}")

    # Salva o crop "puro" como referência
    (PUBLIC / "favicon-source.png").parent.mkdir(exist_ok=True)
    padded.save(PUBLIC / "favicon-source.png", "PNG", optimize=True)

    # Vários tamanhos
    sizes = [16, 32, 48, 96, 180, 192, 512]
    for s in sizes:
        resized = padded.resize((s, s), Image.LANCZOS)
        if s == 180:
            resized.save(PUBLIC / "apple-touch-icon.png", "PNG", optimize=True)
            print(f"  apple-touch-icon.png ({s}x{s})")
        elif s == 192:
            resized.save(PUBLIC / "icon-192.png", "PNG", optimize=True)
            print(f"  icon-192.png")
        elif s == 512:
            resized.save(PUBLIC / "icon-512.png", "PNG", optimize=True)
            print(f"  icon-512.png")
        else:
            resized.save(PUBLIC / f"favicon-{s}.png", "PNG", optimize=True)
            print(f"  favicon-{s}.png")

    # favicon.ico (multi-size embutido)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [padded.resize(s, Image.LANCZOS) for s in ico_sizes]
    ico_imgs[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_imgs[1:],
    )
    print(f"  favicon.ico (multi-size 16/32/48)")

    print("\n✅ Favicons gerados em public/")


if __name__ == "__main__":
    main()
