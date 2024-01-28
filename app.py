from flask import Flask, render_template
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

@app.route('/')
def index():
    return render_template('index.html')

@sock.route('/reverse')
def reverse(ws):
    while True:
        text = ws.receive()
        ws.send(text[::-1])


if __name__ == '__main__':
    app.run()
