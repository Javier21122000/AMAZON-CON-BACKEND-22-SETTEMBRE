"""Install regenerated product photos into the catalogue. Requires Pillow.

Reads the files dropped in ~/Desktop/IMMAGINI-DA-RIGENERARE/rigenerate-qui/,
normalises the studio background to pure white (the cards composite them with
`mix-blend-multiply`, so any off-white fond shows up as a grey rectangle),
trims the surrounding empty space, caps the long side and writes them over the
matching file in public/assets/products/.

Usage: python3 scripts/install_products.py [--dry-run]
"""
from pathlib import Path
import sys
from statistics import median
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/assets/products'
INBOX = Path.home() / 'Desktop/IMMAGINI-DA-RIGENERARE/rigenerate-qui'
MAX_SIDE = 1200
WHITE_FLOOR = 244


def whiten(tile: Image.Image) -> Image.Image:
    """Lift the sampled border colour to pure white, as crop_products.py does."""
    border = [tile.getpixel((x, y)) for x in range(tile.width) for y in (0, tile.height - 1)]
    border += [tile.getpixel((x, y)) for y in range(tile.height) for x in (0, tile.width - 1)]
    background = [median(p[c] for p in border) for c in range(3)]
    if min(background) < 200:
        print('    ! fondo non chiaro: lascio i colori invariati')
        return tile
    scale = [255 / max(v, 1) for v in background]
    tile = tile.point([min(255, int(i * scale[c])) for c in range(3) for i in range(256)])
    return tile.point(lambda v: 255 if v >= WHITE_FLOOR else v)


def trim(tile: Image.Image) -> Image.Image:
    bg = Image.new('RGB', tile.size, (255, 255, 255))
    box = ImageChops.difference(tile, bg).convert('L').point(lambda v: 255 if v > 12 else 0).getbbox()
    if not box:
        return tile
    pad = max(6, int(max(tile.size) * 0.02))
    return tile.crop((max(0, box[0] - pad), max(0, box[1] - pad),
                      min(tile.width, box[2] + pad), min(tile.height, box[3] + pad)))


def main():
    dry = '--dry-run' in sys.argv
    if not INBOX.is_dir():
        sys.exit(f'Cartella non trovata: {INBOX}')
    files = sorted(p for p in INBOX.iterdir() if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'})
    if not files:
        sys.exit(f'Nessuna immagine in {INBOX}')

    done = skipped = 0
    for path in files:
        target = OUT / (path.stem + '.jpg')
        if not target.exists():
            print(f'{path.name:<28} SALTATO — nessun capo con questo nome')
            skipped += 1
            continue
        with Image.open(path) as image:
            tile = whiten(image.convert('RGB'))
            tile = trim(tile)
            if max(tile.size) > MAX_SIDE:
                ratio = MAX_SIDE / max(tile.size)
                tile = tile.resize((round(tile.width * ratio), round(tile.height * ratio)), Image.LANCZOS)
            print(f'{path.name:<28} -> {target.name}  {tile.width}x{tile.height}'
                  + ('  (prova a vuoto)' if dry else ''))
            if not dry:
                tile.save(target, 'JPEG', quality=92, optimize=True, progressive=True, subsampling=0)
        done += 1

    print(f'\n{done} installate, {skipped} saltate.'
          + ('' if dry else '\nRicarica il browser; per il deploy rilancia npm run build.'))


if __name__ == '__main__':
    main()
