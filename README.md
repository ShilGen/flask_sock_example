https://gist.github.com/ShilGen/4736422b1b3fdb657652510dc8b53528

### Запуск Gunicorn как служба ОС

gunicorn.socket

```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

gunicorn.service
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=root
WorkingDirectory=/app #путь до каталога с файлом app.py
ExecStart=/usr/local/bin/gunicorn -b 194.226.49.31:5001 --workers 4 --threads 100 app:app

[Install]
WantedBy=multi-user.target
```

### Конфигурация сервера Apache2

/etc/apache2/sites-enabled/000-default.conf

```
<VirtualHost *:80>
	ServerName 194.226.49.31

	ServerAdmin admin@shilgen.ru
	DocumentRoot /app


    WSGIDaemonProcess app threads=5
    WSGIScriptAlias / /app/server.wsgi process-group=app

    <Directory /app>
        WSGIProcessGroup app
        WSGIApplicationGroup %{GLOBAL}
        Require all granted
    </Directory>

    # WebSocket proxy
    ProxyPass /ws ws://194.226.49.31:5001/ws
    ProxyPassReverse /ws ws://194.226.49.31:5001/ws


	ErrorLog /app/log/error.log
	CustomLog /app/log/access.log combined

</VirtualHost>
```
