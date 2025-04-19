%CFG({
	MAX_IMAGE_WIDTH:	400,
	MAX_IMAGE_HEIGHT:	400,
	MAX_EMPTY_LINES:	3,
	LOAD_COMMENTS:		1,
	CENSOR:			"[ censored ]",
	MATOTESTER:		"******",
	DEFAULT_DESIGN:		"wall-0",
	KEY_HANDLER:		[{
		KEY:	{ CODE: 13 },
		ACTION:	"auth"
	}, {
		KEY:	{ CODE: 13, CTRL: 1 },
		ACTION:	"form"
	}]
})%
<mps-body>
%?%WIDGET%%:%
%WINDOW_TITLE("Личная гостевая книга %OWNER%")%
<h1>Личная гостевая книга <mps-owner>%OWNER%</mps-owner></h1>
?%
%TEXT(50)%
</mps-body>
%NAV%
%NOTICE%
%LOADER("загружается...")%
