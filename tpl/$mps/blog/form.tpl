<div-hdr>%SWITCH("Новая запись в дневнике", "Комментарий", "Редактирование")%</div-hdr>
%PANEL%
%SMILES%
%?%OWNER%
%input("title", "", 0, 100, "class=inp placeholder='Заголовок'")%
?%
%text("mess", "", 0, 10, 0, "class=inp")%
%?:1%OWNER%
<div class="access flex">
<div>
<div>Кто видит эту запись:</div>
%select(
	"ar",
	2,
	{
		"+2": "доступно для всех",
		"+1": "доступно только для зарегистрированых",
		"-1": "никому недоступно",
		%?"доступ открыт только группе:": %GROUPLIST("%GROUP_NAME% (%GROUP_COUNT%)")%?%
	},
	"class=inp"
)%
</div><div>
<div>Кто может комментировать:</div>
%select(
	"aw",
	2,
	{
		"+2": "доступно для всех",
		"+1": "доступно только для зарегистрированых",
		"-1": "никому недоступно",
		%?"доступ открыт только группе:": %GROUPLIST("%GROUP_NAME% (%GROUP_COUNT%)")%?%
	},
	"class=inp"
)%
</div>
</div>
?%
%?%PROFILE%%:%
<div class="auth flex">
<inp-cell><div>Имя:</div>%input("name", "", 0, 50, "class=inp")%</inp-cell>
<inp-cell><div>Пароль для зарегистрированых:</div>%input("pass", "", 0, 50, "class=inp type=password")%</inp-cell>
</div>
?%
<div class=flex>
<div class=trans>%checkbox("trans", 0, 0, " транслитерация")%</div>
%button("cancel", "не хочу")%%button("preview", "превью")%%button("send", "готово")%
</div>
