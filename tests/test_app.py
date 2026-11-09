"""Smoke tests: python -m pytest (pip install pytest)."""
from app import create_app


def client():
    return create_app().test_client()


def test_pages_ok():
    c = client()
    for path in ["/", "/privacy", "/cookie", "/healthz", "/sitemap.xml"]:
        assert c.get(path).status_code == 200


def test_csp_has_no_unfilled_nonce_and_no_inline():
    r = client().get("/")
    csp = r.headers["Content-Security-Policy"]
    assert "{{" not in csp and "unsafe-inline" not in csp
    assert 'style="' not in r.data.decode()


def test_prefix_from_proxy_header():
    r = client().get("/", headers={"X-Forwarded-Prefix": "/landing"})
    assert "/landing/static/css/style.css" in r.data.decode()


def test_no_removed_claims():
    html = client().get("/").data.decode().lower()
    for bad in ["в 3 раза быстрее", "гарантия запоминания", "получайте бонусы", "ответ..."]:
        assert bad not in html
