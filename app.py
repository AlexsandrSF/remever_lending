"""Remever landing: Flask app.

Config comes from environment variables (see .env.example). Behind a reverse proxy the URL prefix
(e.g. /landing) is taken from the X-Forwarded-Prefix header, so no code change is needed to move it.
"""
import os
from datetime import date

from flask import Flask, Response, render_template, request
from markupsafe import Markup, escape
from werkzeug.middleware.proxy_fix import ProxyFix

try:  # python-dotenv is optional: env vars can come from the process manager
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:  # pragma: no cover
    pass


def _env(name, default=""):
    return os.getenv(name, default).strip()


# Content-Security-Policy: no inline scripts or styles. External hosts only for Yandex Metrika (loaded after consent).
CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self' https://mc.yandex.ru https://yastatic.net",
    "style-src 'self'",
    "font-src 'self'",
    "img-src 'self' data: https://mc.yandex.ru https://mc.yandex.com",
    "connect-src 'self' https://mc.yandex.ru https://mc.yandex.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
])

LEGAL_FIELDS = {
    "operator_name": "полное наименование оператора или ФИО индивидуального предпринимателя",
    "operator_reg": "ОГРН/ОГРНИП и ИНН",
    "operator_address": "адрес оператора",
    "operator_email": "e-mail для обращений по персональным данным",
    "legal_date": "дата вступления редакции в силу",
    "log_retention": "срок хранения технических журналов",
}


def create_app():
    app = Flask(__name__)
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 7 * 24 * 3600
    if _env("TRUST_PROXY", "1") == "1":
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    site_url = _env("SITE_URL", "https://remever.ru/landing").rstrip("/")
    links = {  # external links; "#" until the real URL is provided (placeholder links do nothing)
        "rustore": _env("RUSTORE_URL", "#") or "#",
        "app": _env("APP_URL", "#") or "#",
        "vk": _env("VK_URL", "#") or "#",
        "tg": _env("TG_URL", "#") or "#",
        "max": _env("MAX_URL", "#") or "#",
    }
    site = {
        "description": ("Remever — приложение для запоминания по методу интервальных повторений. "
                        "Учите языки, ПДД, термины, готовьтесь к экзаменам с помощью умных карточек. "
                        "Работает без интернета. Бесплатно."),
        "ym_id": _env("YM_ID") if _env("YM_ID").isdigit() else "",
    }

    def legal_value(key):
        """Operator detail from env; a highlighted TODO marker while it is not set."""
        value = _env("LEGAL_" + key.upper())
        if value:
            return escape(value)
        return Markup('<span class="todo">[заполнить: %s]</span>') % LEGAL_FIELDS[key]

    @app.context_processor
    def inject():
        path = "" if request.path == "/" else request.path
        return {
            "links": links,
            "site": site,
            "year": date.today().year,
            "canonical_url": site_url + path if path else site_url + "/",
            "og_image": site_url + "/static/images/webp/hero-phones-1600.webp",
            "lv": legal_value,
        }

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/privacy")
    def privacy():
        return render_template("legal/privacy.html")

    @app.route("/cookie")
    def cookie():
        return render_template("legal/cookie.html")

    @app.route("/healthz")
    def healthz():
        return Response("ok", mimetype="text/plain")

    @app.route("/sitemap.xml")
    def sitemap():
        urls = [site_url + "/", site_url + "/privacy", site_url + "/cookie"]
        body = "".join(f"<url><loc>{u}</loc></url>" for u in urls)
        xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>'
        return Response(xml, mimetype="application/xml")

    @app.errorhandler(404)
    def not_found(_e):
        return render_template("404.html"), 404

    @app.after_request
    def security_headers(resp):
        resp.headers["Content-Security-Policy"] = CSP
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["X-Frame-Options"] = "DENY"
        resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        resp.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return resp

    return app


app = create_app()

if __name__ == "__main__":
    # Local development only. In production run: gunicorn wsgi:app (see README.md)
    app.run(host="127.0.0.1", port=int(_env("PORT", "5001")), debug=_env("FLASK_ENV") == "development")
