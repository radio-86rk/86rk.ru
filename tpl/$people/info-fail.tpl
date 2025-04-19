<h3>Журнал неудачных авторизаций</h3>
<hr>
<div class=table id=__scroll>
<table width=100% cellspacing=1 cellpadding=0>
<tr class=header>
<th>#
<th>День
<th>Время
<th>Ник
<th>Место/Причина
<th>IP/Proxy
<th>CompID
</tr>
{{{
<tr>
<td>%NUM%.
<td>%DAY("d mmmg", "ru", 1)%
<td>%TIME%
<td>%NICK%
<td>%WHERE("чат", "админка", "анкета", "обновление анкеты", "гостевая", "творчество")%
<br>%ERROR("много ошибок", "быстрый ввод", "неверный пароль", "не админ")%
<td%?%ADMIN%%:% class=select?%>%IP%<br>%PROXY%
<td%?%ADMIN%%:% class=select?%>%CID1%<br>%CID2%
</tr>
|||
<tr><td colspan=7 class=empty>[ записей нет ]</tr>
}}}
</table>
</div>
<hr>
<div class=bottom>
<div><a class=btn name=close>закрыть</a></div>
<div>
<a %PREV_MONTH% class="btn s110 stroke" title="предыдущий месяц">&#9664;&#9664;</a>
|
<a %NEXT_MONTH% class="btn s110 stroke" title="следующий месяц">&#9654;&#9654;</a>
</div>
</div>
