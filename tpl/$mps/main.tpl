%CFG({
	MAX_IMAGE_WIDTH:	200,
	MAX_IMAGE_HEIGHT:	200,
	CENSOR:			"[ censored ]",
	MATOTESTER:		"******",
	KEY_HANDLER:		[{
		KEY:	{ CODE: 13, CTRL: 1 },
		ACTION:	"form"
	}]
})%
<mps-body>
<h1>%TITLE%</h1>
%TEXT(50)%
</mps-body>
%NAV%
<mps-info>
<div>
управление книгой с клавиатуры:<br>
<span>Ctrl</span> + <span>&larr;</span> / <span>&rarr;</span> / <span>PgUp</span> / <span>PgDn</span> / <span>Home</span> / <span>End</span><br>
<span>Ctrl</span> + <span>Enter</span> &mdash; написать сообщение<br>
<span>Escape</span> &mdash; выход из всех режимов
</div>
<div align=right>
загрузка данных: %MPS_TIME1("?")% сек<br>
создание кода: %MPS_TIME2("?")% сек<br>
вставка кода: %MPS_TIME3("?")% сек<br>
полное время: %MPS_TIME("?")% сек
</div>
</mps-info>

%NOTICE%
%LOADER("загружается...")%
