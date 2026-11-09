# Remever landing

Одностраничный лендинг (Flask + Jinja, без сборщика). Публикация: `remever.ru/landing` (путь задаётся прокси, см. ниже).

## Запуск локально
```
python3 -m venv venv && venv/bin/pip install -r requirements.txt
cp .env.example .env
venv/bin/python app.py          # http://127.0.0.1:5001
venv/bin/python -m pytest       # smoke-тесты (pip install pytest)
```

## Структура
- `app.py` — приложение, CSP и заголовки безопасности, конфиг из env. `wsgi.py` — вход для gunicorn.
- `templates/base.html` — шапка, меню, подвал, cookie-баннер; `index.html` — секции; `_macros.html` — бейдж RuStore, соцсети, картинки; `legal/` — политика конфиденциальности и cookie.
- `static/css` (`fonts.css` — шрифты локально, без Google), `static/js` (`main.js` — интерактив, `analytics.js` — согласие и Метрика), `static/images/webp` — сжатые копии (оригиналы в `static/images` не используются в разметке).
- `tools/make_webp.py` — пересборка webp (нужен Pillow); `tools/check_release.py` — проверка перед публикацией.

## Публикация (чек-лист)
1. На сервере: `.env` по образцу `.env.example` (SITE_URL, ссылки, YM_ID, реквизиты `LEGAL_*`).
2. `gunicorn -w 2 -b 127.0.0.1:5001 wsgi:app` (пример юнита: `deploy/remever-landing.service.example`).
3. nginx по `deploy/nginx.conf.example`: префикс передаётся заголовком `X-Forwarded-Prefix`, менять код при смене пути не нужно.
4. `python3 tools/check_release.py` должен завершиться без ERRORS (иначе не заполнены реквизиты или есть inline-скрипты).
5. `LEGAL_*` заполняются после регистрации ИП/юрлица; тексты политик проверяет юрист.

## Правила
- Без inline `<script>` и `style="..."`: CSP их блокирует. Стили в CSS, скрипты в `static/js`.
- Внешние ресурсы только по необходимости (Яндекс Метрика, только после согласия). Шрифты и картинки свои.
- Новые картинки добавлять через `tools/make_webp.py`, не коммитить многомегабайтные PNG.
