<div-hdr>%SWITCH("Ваше сообщение", "Комментарий к сообщению", "Редактирование сообщения")%</div-hdr>
<div class=pad>
Текст:
<div class="count fright">символов осталось: %COUNTDOWN%</div>
%PANEL%
%SMILES%
%text("mess", "", 0, 10, 0, "class=inp")%
</div>
<div class="cont flex pad">
<inp-cell>E-mail:<br>%input("email", "", 0, 50, "class=inp")%</inp-cell>
<inp-cell>HomePage:<br>%input("www", "", 0, 200, "class=inp")%</inp-cell>
</div>
%?%PROFILE%%:%
<div class="auth flex pad">
<inp-cell>Имя:<br>%input("name", "", 0, 50, "class=inp")%</inp-cell>
<inp-cell>Пароль для зарегистрированых:<br>%input("pass", "", 0, 50, "class=inp type=password")%</inp-cell>
</div>
?%
<div class="flex pad">
<div class=trans>%checkbox("trans", 0, 0, " транслитерация")%</div>
%button("cancel", "не хочу")%%button("preview", "превью")%%button("send", "готово")%
</div>
