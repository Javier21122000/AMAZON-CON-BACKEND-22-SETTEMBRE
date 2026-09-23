"""Apply a 2000s film treatment to the culture photographs. Requires Pillow.

Fade, warm grade, grain and vignette, tuned per photo so the set does not look
uniformly filtered: the grain is heavy on the night and bedroom shots, light on
the daylight ones.

Usage: python3 scripts/film_grain.py
"""
from pathlib import Path
import sys
from PIL import Image, ImageChops, ImageEnhance, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'FRONTEND/FRONTEND-22-SETTEMBRE/public/images/culture'
MAX_SIDE = 1400

# nome sorgente -> (nome finale, forza grana, calore, sbiadito)
RECIPES = {
    '4.jpg':  ('ronaldinho-sorriso.jpg', 1.15, 7, 12),
    '5.jpg':  ('balotelli-manchester.jpg', 0.70, 5, 9),
    '6.jpg':  ('cr7-terminal.jpg', 0.85, 6, 11),
    '7.jpg':  ('notte-baile.jpg', 1.30, 8, 7),
    '8.jpg':  ('totti-roma.jpg', 0.75, 6, 10),
    '9.jpg':  ('pes-2007.jpg', 1.25, 9, 13),
    '10.jpg': ('campo-vuoto.jpg', 0.65, 4, 8),
    '11.jpg': ('jackson-campetto.jpg', 1.05, 8, 13),
    '12.jpg': ('tyson-tigre.jpg', 0.80, 5, 9),
    '13.jpg': ('beckham-londra.jpg', 0.90, 6, 10),
    '14.jpg': ('swag.jpg', 0.55, 3, 5),
    '15.jpg': ('garage.jpg', 1.20, 9, 14),
    '16.jpg': ('zidane-ronaldo.jpg', 1.10, 7, 12),
    '17.jpg': ('parla-italiano.jpg', 0.60, 2, 6),
    '18.jpg': ('ronaldinho-caffe.jpg', 0.95, 7, 11),
    # L'hero occupa tutta la larghezza: grana leggera, altrimenti a schermo intero fa rumore.
    '19.jpg': ('ronaldo-bandiera.jpg', 0.55, 3, 8),
}


def grade(im: Image.Image, warm: int, lift: int) -> Image.Image:
    im = ImageEnhance.Color(im).enhance(.93)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    r, g, b = im.split()
    # scalda i mezzitoni senza toccare neri e bianchi puri
    bell = lambda v: 1 - abs(v - 128) / 128
    r = r.point([min(255, round(v + warm * bell(v))) for v in range(256)])
    b = b.point([max(0, round(v - warm * .75 * bell(v))) for v in range(256)])
    im = Image.merge('RGB', (r, g, b))
    # alza le ombre: il nero pieno non esiste su pellicola
    lut = [min(255, round(lift + v * (255 - lift) / 255)) for v in range(256)]
    return im.point(lut * 3)


def add_grain(im: Image.Image, strength: float) -> Image.Image:
    noise = Image.effect_noise(im.size, 26).point(
        lambda v: max(0, min(255, round(128 + (v - 128) * strength))))
    return ImageChops.add(im, Image.merge('RGB', (noise, noise, noise)), scale=1, offset=-128)


def vignette(im: Image.Image, amount: float = .22) -> Image.Image:
    mask = Image.new('L', im.size, 0)
    d = ImageDraw.Draw(mask)
    pad = int(min(im.size) * .10)
    d.ellipse((-pad, -pad, im.width + pad, im.height + pad), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(min(im.size) * .16))
    dark = ImageEnhance.Brightness(im).enhance(1 - amount)
    return Image.composite(im, dark, mask)


def main():
    src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
        '/private/tmp/claude-501/-Users-javiertorresruiz-Desktop-AMAZON-CON-BACKEND-22-SETTEMBRE'
        '/019b3775-1119-425b-a003-9a55a19243ab/images')
    OUT.mkdir(parents=True, exist_ok=True)
    for source, (name, strength, warm, lift) in RECIPES.items():
        path = src_dir / source
        if not path.exists():
            print(f'{source}: non trovata, salto')
            continue
        with Image.open(path) as image:
            im = image.convert('RGB')
            if max(im.size) > MAX_SIDE:
                ratio = MAX_SIDE / max(im.size)
                im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)
            im = vignette(add_grain(grade(im, warm, lift), strength))
            im.save(OUT / name, 'JPEG', quality=86, optimize=True, progressive=True)
            print(f'{name:<28} {im.width}x{im.height}  grana {strength}')
    print(f'\nSalvate in {OUT}')


if __name__ == '__main__':
    main()
