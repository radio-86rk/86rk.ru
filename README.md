# 86rk.ru

Сайт посвящён ретро-компьютеру "**Радио-86РК**"

Полные исходники моего сайта [`86rk.ru`](https://86rk.ru/), вы можете создать копию сайта на своём сервере.

Исходники включают все приложения сайта:
* ассемблер (пока не написан);
* дизассемблер;
* редактор растровых шрифтов;
* утилиты;
* эмулятор;
* чат.

Для работы сайта база данных не требуется.

## Скриншоты

![Screenshot of disassm](https://86rk.ru/disassm/images/disassm.png)

![Screenshot of raster font editor](https://86rk.ru/zeditor/images/zeditor.png)

![Screenshot of emulator](https://86rk.ru/emulator/images/emulator.png)

## Настройка веб-сервера

Для веб-сервера `Apache` настройки находятся в корне в файле `.htaccess`.

Для веб-сервера `Nginx` в файл конфигурации надо добавить следующие настройки:

```
rewrite ^/(wall|blog)/(\d+)(/(\d\d-\d\d-\d\d\d\d))?$ /mps.php?mps=$1&sid=$2&day=$4 break;
rewrite ^/(gb|creation)/(\d+)$ /mps.php?mps=$1&m=$2 break;
rewrite ^/(gb|creation|blog|wall)/(\d+)/(\d+)?$ /mps.php?mps=$1&sid=$2&m=$3 break;
rewrite ^/(gb|creation|blog|wall)(/(\?.*)?)?$ /mps.php?mps=$1 break;
rewrite ^/(who|whowas|online|offline)$ /userlist.php break;
rewrite ^/(people|info|form|mps|help|rules)\b(?!/) /$1.php break;
rewrite ^/people/ /people.php break;
rewrite ^/user/(\d+)$ /info.php?profile=$1 break;
rewrite ^/img/(\d+/\d+/.+)$ /php/img.php?$1 break;

charset        utf-8;

error_page 403 403.php;
error_page 404 404.php;

location ~* \.(js|css)$ {
	expires 1M;
	add_header Cache-Control public;
}

location ~* \.(gif|jpg|jpeg|png|webp|webm|svg|svgz|ani|cur|wav|au|ico|swf|mp3|mp4|ogg|ogv|wasm)$ {
	expires 1y;
	add_header Cache-Control public;
	location ~ \.svgz$ {
		add_header Content-Encoding gzip;
	}
}
```

## Лицензия

[**MIT**](https://github.com/radio-86rk/86rk.ru/blob/main/LICENSE) © [**Vital72**](https://86rk.ru/)
