#!/usr/bin/env python3
"""Make compressed WebP copies of landing images (originals stay untouched).
Usage: python3 tools/make_webp.py   (needs Pillow: pip install pillow; dev-only, not a runtime dependency)"""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "static" / "images"
DST = SRC / "webp"
# source -> [(output name, width, quality)]
JOBS = {
    "hero-phones-hd-mobile.png": [("hero-phones-1600", 1600, 82), ("hero-phones-900", 900, 82)],
    "audience-student.png": [("audience-student-820", 820, 80)],
    "audience-teacher.png": [("audience-teacher-820", 820, 80)],
    "audience-schoolboy.png": [("audience-schoolboy-820", 820, 80)],
    "audience-profi.png": [("audience-profi-820", 820, 80)],
    "audience-parent.png": [("audience-parent-820", 820, 80)],
    "subway-guy.png": [("subway-guy-1000", 1000, 80), ("subway-guy-600", 600, 80)],
    "app-notificatioins.png": [("app-notifications-630", 630, 86)],
    "1600/app-statistics.png": [("app-statistics-635", 635, 88)],
}

for src, outs in JOBS.items():
    im = Image.open(SRC / src)
    im.load()
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    for name, w, q in outs:
        r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        out = DST / f"{name}.webp"
        r.save(out, "WEBP", quality=q, method=6)
        print(f"{out.name}: {r.width}x{r.height} {out.stat().st_size // 1024} KB (orig {(SRC / src).stat().st_size // 1024} KB)")
