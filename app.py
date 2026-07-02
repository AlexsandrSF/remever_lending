from flask import Flask, render_template
import os
from dotenv import load_dotenv
from flask_wtf.csrf import CSRFProtect

# Load environment variables
load_dotenv()

# Инициализация приложения Flask
# # Flask автоматически ищет шаблоны в папке /templates и статику в /static

app = Flask(__name__)
csrf = CSRFProtect(app)

# Set secret key from environment variable
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key-change-in-production')

@app.route('/')
def index():
    # Рендерим главную страницу лендинга
    return render_template('index.html')

# Add security headers middleware
@app.after_request
def after_request(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'nonce-{{csp_nonce}}'; style-src 'self' 'nonce-{{csp_nonce}}';"
    # response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

if __name__ == '__main__':
    # Запуск сервера в режиме отладки только для разработки
    import os
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True, host='127.0.0.1', port=5001)
    else:
        # Для продакшена использовать gunicorn или другой WSGI сервер
        app.run(host='127.0.0.1', port=5001)