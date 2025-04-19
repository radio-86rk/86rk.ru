%CFG({
	DEFAULT_DESIGN:		"86rk",
	KEY_HANDLER:		[{
		KEY:	{ CODE: 13 },
		ACTION:	"auth"
	}, {
		KEY:	{ CODE: 13, CTRL: 1 },
		ACTION:	"form"
	}]
})%
<mps-top-menu>
<ul>
<li><a name=emulator href=/emulator>Эмулятор</a>
<li><a name=zeditor href=/zeditor>Редактор знакогенератора</a>
<li><a name=disassm href=/disassm>Дизассемблер</a>
<li><a name=assm href=/assm>Ассемблер</a>
<li><a name=utils href=/utils>Утилиты</a>
<li><a name=donate>Донат</a>
</ul>
</mps-top-menu>
<mps-body>
%TEXT%
</mps-body>
<mps-app id=app></mps-app>
<mps-form-container></mps-form-container>
<div id=app_chat>
<a name=win-chat class=new-window title="открыть чат в новом окне"></a>
</div>
%NAV%
%NOTICE%
%LOADER%
