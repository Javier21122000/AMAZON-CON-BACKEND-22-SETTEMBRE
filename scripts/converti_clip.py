"""Converte le GIF delle leggende in WebP animate leggere. Richiede Pillow.

Produce due versioni per ciascuna:

  <nome>.webp         nitida, per la polaroid e la miniatura nel dettaglio capo
  <nome>-sfondo.webp  sfocata e piu' piccola, per lo sfondo della pagina

La sfocatura e' incorporata nel file invece di essere un filtro CSS: applicata
con `filter: blur()` su un'immagine animata verrebbe ricalcolata a ogni
fotogramma, ed e' una delle cose che fanno scattare lo scorrimento.

Usage: python3 scripts/converti_clip.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageSequence, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from film_grain import grade, add_grain, vignette

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/videos'
LARGHEZZA = 384
LARGHEZZA_SFONDO = 320
MAX_FRAME = 26
SFOCATURA = 1.6


def converti(sorgente: Path, nome: str) -> None:
    with Image.open(sorgente) as gif:
        totali = getattr(gif, 'n_frames', 1)
        passo = max(1, -(-totali // MAX_FRAME))  # per eccesso: il tetto va rispettato
        base = gif.info.get('duration', 80) or 80
        nitidi = []
        for i, frame in enumerate(ImageSequence.Iterator(gif)):
            if i % passo:
                continue
            im = frame.convert('RGB')
            altezza = round(im.height * LARGHEZZA / im.width)
            im = im.resize((LARGHEZZA, altezza), Image.LANCZOS)
            # grana leggera: piu' e' marcata, meno il WebP riesce a comprimere
            nitidi.append(vignette(add_grain(grade(im, 6, 10), .45), .18))

    durata = base * passo
    nitidi[0].save(OUT / f'{nome}.webp', 'WEBP', save_all=True, append_images=nitidi[1:],
                   duration=durata, loop=0, quality=62, method=6)

    h = round(nitidi[0].height * LARGHEZZA_SFONDO / nitidi[0].width)
    sfocati = [f.resize((LARGHEZZA_SFONDO, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SFOCATURA))
               for f in nitidi]
    sfocati[0].save(OUT / f'{nome}-sfondo.webp', 'WEBP', save_all=True, append_images=sfocati[1:],
                    duration=durata, loop=0, quality=58, method=6)

    kb = lambda f: (OUT / f).stat().st_size / 1024
    print(f'{nome:<12} {len(nitidi)}/{totali} frame   '
          f'nitida {kb(nome + ".webp"):.0f} KB   sfondo {kb(nome + "-sfondo.webp"):.0f} KB')


def main():
    sorgenti = sorted(OUT.glob('_scarico-*.gif'))
    if not sorgenti:
        sys.exit(f'Nessuna GIF da convertire in {OUT}')
    for sorgente in sorgenti:
        converti(sorgente, sorgente.stem.replace('_scarico-', ''))


if __name__ == '__main__':
    main()
