"""Converte le GIF delle leggende in WebP animate leggere. Richiede Pillow.

Le GIF originali pesano decine di MB: come sfondo di pagina sono improponibili.
Qui vengono ridotte di scala, alleggerite di fotogrammi e passate nello stesso
trattamento pellicola delle fotografie del diario, cosi' restano coerenti.
Lo sfondo e' coperto da un velo chiaro, quindi la risoluzione conta poco.

Usage: python3 scripts/converti_clip.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageSequence

sys.path.insert(0, str(Path(__file__).resolve().parent))
from film_grain import grade, add_grain, vignette

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/videos'
LARGHEZZA = 384
MAX_FRAME = 26


def converti(sorgente: Path, destinazione: Path) -> None:
    with Image.open(sorgente) as gif:
        totali = getattr(gif, 'n_frames', 1)
        passo = max(1, -(-totali // MAX_FRAME))  # arrotonda per eccesso: il tetto va rispettato
        base = gif.info.get('duration', 80) or 80
        frames = []
        for i, frame in enumerate(ImageSequence.Iterator(gif)):
            if i % passo:
                continue
            im = frame.convert('RGB')
            altezza = round(im.height * LARGHEZZA / im.width)
            im = im.resize((LARGHEZZA, altezza), Image.LANCZOS)
            # grana leggera: piu' e' marcata, meno il WebP riesce a comprimere
            frames.append(vignette(add_grain(grade(im, 6, 10), .45), .18))
    frames[0].save(destinazione, 'WEBP', save_all=True, append_images=frames[1:],
                   duration=base * passo, loop=0, quality=56, method=6)
    peso = destinazione.stat().st_size / 1024
    print(f'{destinazione.name:<20} {frames[0].size}  {len(frames)}/{totali} frame  {peso:.0f} KB')


def main():
    sorgenti = sorted(OUT.glob('_scarico-*.gif'))
    if not sorgenti:
        sys.exit(f'Nessuna GIF da convertire in {OUT}')
    for sorgente in sorgenti:
        converti(sorgente, OUT / f'{sorgente.stem.replace("_scarico-", "")}.webp')


if __name__ == '__main__':
    main()
