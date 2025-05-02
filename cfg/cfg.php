<?php
	//
	define ('VERSION',			'10.3.4b');

	//  хост чата, важно! без http:// и завершающего слэша
	define ('CHAT_HOST',			'86rk.august4u.ru');

	//  секретный ключ доступа к API чата
	define ('SECRET_KEY',			'MNonw%[yQ1h(tSH-vXJp@Y*:Qd7r:Fm{Lrsail9Qj0d7[VqGM]');

	//  комната чата по умолчанию
	define ('DEFAULT_ROOM',			0);

	//  шаблоны чата по умолчанию
	define ('DEFAULT_TPL',			'86rk');

	//  дизайн чата по умолчанию для десктопа
	define ('DEFAULT_DESIGN',		'0');

	//  дизайн чата по умолчанию для мобильных устройств
	define ('DEFAULT_DESIGN_MOBILE',	'm');

	//  установите эту константу в 1, если хотите привязать сессию
	//  юзера к его IP-адресу, повышает безопасность сессий
	define ('AUTH_CHECK_IP',		1);

	//  флаг, указывающий на необходимость предварительной проверки
	//  ника на правила чата перед авторизацией
	define ('AUTH_CHECK_NICK',		1);

	//  номер профайла администратора для доступа к админке
	define ('ADMIN_PROFILE',		5);

	//  включение журналирование действий администратора
	define ('ADMIN_LOG_ON',			1);

	//  загружаемые модули для десктопа
	//  имена модулей разделяются двоеточием
	define ('DESKTOP_MODULES',		'init:audio-player:nav:speech2text:emoji');

	//  загружаемые модули для мобильного устройства
	define ('MOBILE_MODULES',		'init:audio-player');

	//  
	define ('MOBILE',			preg_match ("`\bmobile|tablet|opera (?:mini|mobi)\b`i", $_SERVER ['HTTP_USER_AGENT']));

	//  код языка для загрузки файлов конфигурации
	define ('LANG',				'ru');

	//  настраиваемый скроллбар, вид скроллбара определяется картинкой
	//  -- true/1 - использовать
	//  -- false/0 - не использовать
	define ('SCROLLBAR',			true);

	//  кликабельные ссылки
	//  -- true/1 - преобразовывать в ссылки url- и e-mail-адреса
	//  -- false/0 - не преобразовывать
	define ('CLICKABLE_URL',		true);

	//  лог-файлы
	//  -- true/1 - да
	//  -- false/0 - нет
	define ('ACCESS_LOG',			false);

	//  параметры, относящиеся к системе публикации сообщений (СПС)
	$MPS_CFG = [
		//  параметры для СПС "Гостевая книга"
		'gb' => [
			//  ID системы
			'SID' => 0,
			//  шаблоны
			'APL' => 'gb'
		],
		//  параметры для СПС "Творчество"
		'creation' => [
			//  ID системы
			'SID' => 1,
			//  шаблоны
			'APL' => 'creation'
		],
		'86rk' => [
			//  ID системы
			'SID' => 2,
			//  шаблоны
			'APL' => '86rk'
		]
	];
?>
