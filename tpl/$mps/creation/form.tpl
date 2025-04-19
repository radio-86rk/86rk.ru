<form>
<table class=text cellpadding=0 cellspacing=0>
<tr><th colspan=2>%MPS_TITLE% &mdash; %SWITCH("написать", "комментировать", "редактировать")%</th></tr>
<tr><td colspan=2>
%SWITCH("Название произведения:", "Тема:")%
<br>
%input("title", "", 0, 50, "class=inp")%
</td></tr>
<tr><td colspan=2 height=100%>
<div class="trans fright">транслитерация %checkbox("trans", 0, null, "")%</div>
%SWITCH("Произведение:", "Комментарий:")%
%text("mess", "", 0, 20, 0, "class=inp")%
</td></tr>
%?%PROFILE%%:%
<tr class=auth>
<td>
Автор:<br>%input("name", "", 0, 50, "class=inp")%
</td><td>
Пароль:<br>%input("pass", "", 0, 50, "class=inp type=password")%
</td></tr>
?%
<tr class=rules><td colspan=2>
<hr noshade size=1>
<h3>Правила раздела</h3>
<p>Этот раздел предназначен для публикации произведений пользователей,
являющихся их личным творчеством как в стихотворной форме, так и в форме прозы.
Использования раздела в иных целях не допускается.
<br>
<p>Публикации подлежат удалению в следующих случаях:<br>
<dd>&mdash; содержат ненормативную лексику;</dd>
<dd>&mdash; являются оскорбительными;</dd>
<dd>&mdash; являются произведением общеизвестных авторов;</dd>
<dd>&mdash; содежат орфографические ошибки;</dd>
<dd>&mdash; тексты в латинице.</dd>
<p>Администратор оставляет за собой право удалять тексты по своему усмотрению.
<hr noshade size=1>
</td></tr>
<tr><td colspan=2 align=center>
%button("preview", "посмотреть, что получилось")%
%button("send", "записать")%
<br><br>
<a data-a=contents>содержание</a>
</td></tr>
</table>
</form>
