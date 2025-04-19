<div-hdr>Опции удаления</div-hdr>
<div class=pad>
%radio("replace", 0, {
	0: " удалить сообщение",
	1: " заменить текст"
}, "<br>")%
%text("text", "", 0, 2, 1, "class=inp")%
</div>
%?%SELF%%:%
<mps-collapse class="collapse pad">
<h4>черный список%COLLAPSE%</h4>
<mps-collapse class=blacklist>
<inp-cell>
%radio("bl", 0, {
	0: " не заносить в чёрный список",
	1: " блокировать пользователя",
	2: " блокировать компьютер"
}, "<br>")%
</inp-cell>
<inp-cell>
%?%MODER%
%radio("bl", 0, {
	3: " блокировать прокси",
	4: " блокировать IP",
	5: " блокировать сеть"
}, "<br>")%
?%
</inp-cell>
<inp-cell>
<h4>срок блокировки</h4>
%radio("period", 0, {
	0: " навсегда",
	1: " на несколько месяцев:"
}, "<br>")%
%input("mon", "", 0, 3, "class=inp")%
</inp-cell>
<inp-cell>
<h4>блокировка доступа</h4>
%radio("lock", 0, {
	0: " только на запись",
	1: " полный доступ"
}, "<br>")%
</inp-cell>
<inp-cell class=comm>
<h4>комментарий</h4>
%text("comm", "", 0, 2, 1, "class=inp")%
</inp-cell>
</mps-collapse>
</mps-collapse>
?%
%?:&
<mps-collapse class="collapse pad">
<h4>компьютер%COLLAPSE("mps-compinfo")%</h4>
<mps-collapse>
%COMPINFO%
</mps-collapse>
</mps-collapse>
?%
<div class="pad btn">
%button("cancel", "отмена")%%button("del", "удалить")%
</dib>
