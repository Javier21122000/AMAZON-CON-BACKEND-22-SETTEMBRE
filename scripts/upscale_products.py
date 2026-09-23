"""Rescale the product crops for high-density displays. Requires Pillow.

The tiles come from 1306 x 816 collages, so roughly 200 px per capo: there is no
further detail to recover. This only resamples them cleanly instead of leaving the
stretch to the browser, softens the JPEG blocking first and restores the neutral
white background that `mix-blend-multiply` needs.

Usage: python3 scripts/upscale_products.py [factor]
"""
from pathlib import Path
import sys
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/assets/products'
FACTOR = int(sys.argv[1]) if len(sys.argv) > 1 else 4
WHITE_FLOOR = 249  # near-white stays pure white, so the multiply blend has no halo


def process(path: Path) -> tuple[str, str]:
    with Image.open(path) as image:
        tile = image.convert('RGB')
        before = f'{tile.width}x{tile.height}'
        # Soften the 8x8 JPEG blocks before enlarging them.
        tile = tile.filter(ImageFilter.GaussianBlur(0.4))
        tile = tile.resize((tile.width * FACTOR, tile.height * FACTOR), Image.LANCZOS)
        tile = tile.filter(ImageFilter.UnsharpMask(radius=2.2, percent=95, threshold=3))
        tile = tile.point(lambda v: 255 if v >= WHITE_FLOOR else v)
        tile.save(path, 'JPEG', quality=92, optimize=True, progressive=True, subsampling=0)
        return before, f'{tile.width}x{tile.height}'


def main():
    files = sorted(OUT.glob('*.jpg'))
    if not files:
        sys.exit(f'Nessun JPG in {OUT}')
    for path in files:
        before, after = process(path)
        print(f'{path.name:<28} {before:>9} -> {after}')
    print(f'\n{len(files)} immagini riscalate {FACTOR}x.')


if __name__ == '__main__':
    main()
