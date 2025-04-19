%CFG({
	CENSOR:			"[ censored ]",
	MATOTESTER:		"******",
	DEFAULT_DESIGN:		"creation",
	LOAD_COMMENTS:		1,
	KEY_HANDLER:		[{
		KEY:	{ CODE: 13 },
		ACTION:	"contents"
	}, {
		KEY:	{ CODE: 13, CTRL: 1 },
		ACTION:	"form"
	}]
})%
<mps-body>
<div class=ornament-top></div>
%TEXT(100)%
<div class=ornament-bottom></div>
</mps-body>

%NOTICE%
%LOADER%
