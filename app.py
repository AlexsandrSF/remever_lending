from flask import Flask, render_template
import os
# Инициализация приложения Flask
# # Flask автоматически ищет шаблоны в папке /templates и статику в /static

app = Flask(__name__)

# Настройка безопасности
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

@app.route('/')
def index():
    # Рендерим главную страницу лендинга
    return render_template('index.html')

# Добавляем безопасные заголовки
@app.after_request
def after_request(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

if __name__ == '__main__':
    # Запуск сервера с безопасными настройками
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5001))
    
    app.run(debug=debug_mode, host=host, port=port)