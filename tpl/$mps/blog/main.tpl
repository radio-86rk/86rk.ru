%CFG({
	MAX_IMAGE_WIDTH:	500,
	MAX_IMAGE_HEIGHT:	500,
	MAX_EMPTY_LINES:	3,
	LOAD_COMMENTS:		1,
	CENSOR:			"[ censored ]",
	MATOTESTER:		"******",
	DEFAULT_DESIGN:		"blog-0",
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
%WINDOW_TITLE("Личный блог %OWNER%")%
<h1>Личный блог <mps-owner>%OWNER%</mps-owner></h1>
?%
%TEXT%
</mps-body>
%NAV%
%NOTICE%
%LOADER("загружается...")%
