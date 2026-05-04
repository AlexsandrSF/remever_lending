from flask import Flask, render_template
# Инициализация приложения Flask
# # Flask автоматически ищет шаблоны в папке /templates и статику в /static

app = Flask(__name__)


@app.route('/')
def index():
    # Рендерим главную страницу лендинга
    return render_template('index.html')


if __name__ == '__main__':
    # Запуск сервера в режиме отладки
    # host='0.0.0.0' позволяет обращаться к серверу по IP-адресу в локальной сети
    app.run(debug=True, host='0.0.0.0', port=5001)
