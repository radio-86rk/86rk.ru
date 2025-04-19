%CFG({
	MAX_IMAGE_WIDTH:	200,
	MAX_IMAGE_HEIGHT:	200,
	MAX_EMPTY_LINES:	3,
	CENSOR:			"[ censored ]",
	MATOTESTER:		"******",
	DEFAULT_DESIGN:		"gb3",
	KEY_HANDLER:		[{
		KEY:	{ CODE: 13, CTRL: 1 },
		ACTION:	"form"
	}]
})%
<mps-top-menu>
<div class="copy fright">&copy; August</div>
<input type=checkbox id=mps-main-menu>
<mps-menu>
<label for=mps-main-menu></label>
<span>оформление:</span>
<ul>
<li>%DESIGN("светлый 1", "gb1")%
<li>%DESIGN("светлый 2", "gb2")%
<li>%DESIGN("светлый 3", "gb3")%
<li>%DESIGN("голубенький", "gb4")%
<li>%DESIGN("синий", "gb5")%
<li>%DESIGN("мрачный", "gb6")%
<li>%DESIGN("hextenstion", "gb7")%
<li>%DESIGN("grey dream", "gb8")%
</ul>
</mps-menu>
</mps-top-menu>
<mps-body>
<h1>%TITLE%</h1>
%TEXT(50)%
</mps-body>
<mps-info>
<div>
управление книгой с клавиатуры:<br>
<span>Ctrl</span> + <span>&larr;</span> / <span>&rarr;</span> /
<span>PgUp</span> / <span>PgDn</span> / <span>Home</span> / <span>End</span><br>
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
%NAV%
%NOTICE%
%LOADER("загружается...")%
%PEN%
