#!/usr/bin/env python3
"""Pre-publication check: python3 tools/check_release.py  (run from the project root, with the production .env loaded).
Exits 1 if something blocks publication; warnings are informational."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app  # noqa: E402

errors, warnings = [], []
client = app.test_client()
for path in ["/", "/privacy", "/cookie", "/sitemap.xml", "/healthz"]:
    r = client.get(path)
    if r.status_code != 200:
        errors.append(f"{path}: HTTP {r.status_code}")
html = {p: client.get(p).data.decode() for p in ["/", "/privacy", "/cookie"]}
for p, h in html.items():
    todo = re.findall(r'class="todo">\[заполнить: ([^\]]+)\]', h)
    if todo:
        errors.append(f"{p}: незаполненные реквизиты оператора: {sorted(set(todo))}")
    if re.search(r"<[^>]+\sstyle=", h):
        errors.append(f"{p}: inline style (сломает CSP)")
    if "<script>" in h or re.search(r"<script(?![^>]*src=)", h):
        errors.append(f"{p}: inline script (сломает CSP)")
n = html["/"].count('href="#"')
if n:
    warnings.append(f"/: {n} ссылок-заглушек href=\"#\" (RUSTORE_URL, APP_URL, VK_URL, TG_URL, MAX_URL)")
if "data-ym-id" not in html["/"]:
    warnings.append("YM_ID не задан: аналитики и баннера cookie нет")
if "remever.ru" in html["/"] and "localhost" in html["/"]:
    errors.append("canonical указывает на localhost")
for name in ["static/css/style.css", "static/js/main.js"]:
    if not Path(name).exists():
        errors.append(f"нет файла {name}")
print("ERRORS:" if errors else "no blocking errors")
for e in errors:
    print(" -", e)
print("WARNINGS:" if warnings else "no warnings")
for w in warnings:
    print(" -", w)
sys.exit(1 if errors else 0)
