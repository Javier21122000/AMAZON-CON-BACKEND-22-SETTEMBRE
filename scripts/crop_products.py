"""Extract the supplied studio tiles, excluding captions. Requires Pillow.
Usage: python3 scripts/crop_products.py /path/to/first.jpg /path/to/second.jpg
"""
from pathlib import Path
import sys
from PIL import Image
from statistics import median

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/assets/products'
# Coordinates refer to the supplied 1306 × 816 collages.
TILES = {
    0: {
        'beckham-denim': (25, 23, 222, 237),
        'cargo-denim': (242, 23, 436, 237),
        'acid-denim': (456, 23, 650, 237),
        'carpenter-denim': (671, 23, 864, 237),
        'balotelli-velour': (885, 23, 1077, 237),
        'cristiano-leather': (25, 295, 222, 506),
        'chiodo-leather': (242, 295, 436, 506),
        'trench-leather': (456, 295, 650, 506),
        'biposto-leather': (671, 295, 864, 506),
        'satin-tracksuit': (885, 295, 1077, 506),
        'metallic-puffer': (25, 566, 222, 776),
        'utility-parka': (242, 566, 436, 776),
        'padded-bomber': (456, 566, 650, 776),
        'air-max': (885, 566, 1002, 762),
        'jordan-4': (1022, 566, 1137, 762),
        'climacool': (1158, 566, 1287, 762),
    },
    1: {
        'artistic-denim': (335, 80, 566, 273),
        'pirlo-corduroy': (587, 80, 808, 273),
        'oldculture-cream': (829, 80, 1050, 273),
        'oldculture-black': (1072, 80, 1293, 273),
        'henry-varsity': (335, 353, 566, 530),
        'ronaldinho-tee': (587, 353, 808, 530),
        'striped-brown': (829, 353, 1050, 530),
        'striped-grey': (1072, 353, 1293, 530),
        'wind-shell': (335, 600, 566, 774),
        'salvador-zip': (587, 600, 808, 774),
        'salvador-y2k': (829, 600, 1050, 774),
        'dunk-low': (1072, 600, 1293, 774),
    },
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for source, tiles in TILES.items():
        with Image.open(sys.argv[source + 1]) as image:
            assert image.size == (1306, 816), 'Expected original 1306 × 816 collage'
            for name, box in tiles.items():
                tile = image.crop(box).convert('RGB')
                # Lift each tile's neutral studio background to white. With CSS multiply,
                # it blends into the card instead of displaying a darker rectangular patch.
                border = [tile.getpixel((x, y)) for x in range(tile.width)
                          for y in (0, tile.height - 1)]
                border += [tile.getpixel((x, y)) for y in range(tile.height)
                           for x in (0, tile.width - 1)]
                background = [median(pixel[channel] for pixel in border) for channel in range(3)]
                lookup = [min(255, round(value * 255 / max(1, level - 3)))
                          for level in background for value in range(256)]
                tile = tile.point(lookup)
                tile.save(OUT / f'{name}.jpg', quality=95, subsampling=0)
    print(f'Extracted {sum(map(len, TILES.values()))} individual product images to {OUT}')

if __name__ == '__main__':
    main()
