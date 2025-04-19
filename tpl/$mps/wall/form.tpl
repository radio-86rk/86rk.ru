<div-hdr>%SWITCH("Запись на стене", "Комментарий", "Редактирование")%</div-hdr>
%PANEL%
%SMILES%
%text("mess", "", 0, 10, 0, "class=inp")%
%?%PROFILE%%:%
<div class="auth flex">
<inp-cell>Имя:<br>%input("name", "", 0, 50, "class=inp")%</inp-cell>
<inp-cell>Пароль для зарегистрированых:<br>%input("pass", "", 0, 50, "class=inp type=password")%</inp-cell>
</div>
?%
<div class=flex>
<div class=trans>%checkbox("trans", 0, 0, " транслитерация")%</div>
%button("cancel", "не хочу")%%button("preview", "превью")%%button("send", "готово")%
</div>
