https://gist.github.com/ShilGen/4736422b1b3fdb657652510dc8b53528

### Запуск Gunicorn как служба ОС

Создаём файл настроек /etc/systemd/system/gunicorn.service

```
[Unit]
Description=Gunicorn instance 
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/app
ExecStart=/usr/bin/python3 /usr/local/bin/gunicorn --workers 4 -b 0.0.0.0:5001 --threads 100 app:app
ExecReload=/bin/kill -s HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

Проверка файла gunicorn.service на наличие ошибок

```bash
systemd-analyze verify gunicorn.service
```

Запуск службы gunicorn

```bash
systemctl enable gunicorn
systemctl start gunicorn
```

При изменении файлов настроек службы, перезапускайте демона

```bash
systemctl daemon-reload
```

При изменении любых данных в HTML-шаблонах, перезапускайте сервис gunicorn

```bash
service gunicorn restart
```

Статус запущенной службы

```bash
systemctl status gunicorn
```

## Конфигурация сервера Apache2

Установка сервера Apache2

```bash 
sudo apt-get install apache2 libapache2-mod-wsgi-py3
systemctl enable apache2
```

Сохранение оригинального файла настроек сервера

```bash
cd /etc/apache2/sites-available/ 
cp 000-default.conf 000-default-copy.conf
```

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
Активация домена, перенаправления веб-сокетов

```bash
a2enmod proxy_http
systemctl stop apache2
```
Запуск, перезапуск сервера

```bash
systemctl start apache2
systemctl restart apache2
```
