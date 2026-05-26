"""
Baixa 5 imagens variadas (1 produto por 5 categorias diferentes) da Shinova.
Salva em images/teste-originais/.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
import requests

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
PRODUTOS = ROOT / "src" / "data" / "produtos.json"
OUT = ROOT / "images" / "teste-originais"
OUT.mkdir(parents=True, exist_ok=True)

# Pegar 1 produto de 5 categorias diferentes para diversidade visual
TARGET_CATEGORIES = [
    "anestesia-monitorizacao",
    "imagem-diagnostico",
    "laboratorio-clinico",
    "odontologia-veterinaria",
    "pet-grooming-estetica",
]


def main() -> None:
    produtos = json.loads(PRODUTOS.read_text(encoding="utf-8"))
    print(f"Total produtos: {len(produtos)}")

    selected = []
    for cat_slug in TARGET_CATEGORIES:
        for p in produtos:
            if p["categoria_slug"] == cat_slug and p.get("imagem_principal"):
                selected.append(p)
                break

    print(f"Selecionados: {len(selected)} produtos\n")

    for p in selected:
        url = p["imagem_principal"]
        # nome do arquivo: slug.jpg
        outfile = OUT / f"{p['slug']}.jpg"
        try:
            r = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
            r.raise_for_status()
            outfile.write_bytes(r.content)
            print(f"  ✅ {p['slug']:<30} ({len(r.content) / 1024:.0f} KB) — categoria: {p['categoria_slug']}")
        except Exception as e:
            print(f"  ❌ {p['slug']:<30} FALHOU: {e}")

    print(f"\n📁 Salvas em {OUT}")


if __name__ == "__main__":
    main()
