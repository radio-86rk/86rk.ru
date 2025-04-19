<table cellspacing=0 cellpadding=0>
<tr><th>%?%EQ("%N%", "n")%Шрифт ника%:%Шрифт сообщений?%</th></tr>
<tr><td class=font nowrap>
%radio("%N%_font", 0,
[
	"по умолчанию",
	"Andale Mono",
	"Arial",
	"Book Antiqua",
	"Comic Sans MS",
	"Courier",
	"Georgia",
	"Lucida Console",
	"Tahoma",
	"Times New Roman",
	"Trebuchet MS",
	"Verdana",
	"%input("%N%_font_user", "", 0, 20, "class='inp font'")%"
])%
</td></tr>
<tr><td>
%radio("%N%_weight", 0, { 1: "тонкий", 2: "нормальный" })%
%checkbox("%N%_italic", 0, 4, "курсив")%
</td></tr>
</table>
