<h3>Статистика по дням</h3>
<hr>
<div class=table id=__scroll>
<table width=100% cellspacing=1 cellpadding=1>
<tr class=header>
<th>
<th>День
<th>Вход/Выход
<th>Время
<th>ОФ
<th>ЛФ
<th>ПФ
<th>IP/Proxy
<th>CompID
</tr>
{{{
<tr>
<td align=right>%NUM%.
<td>%DAY("d mmmg", "ru", 1)%
<td>%ENTER%<br>%QUIT%
<td>%TIME%
<td>%COUNT1%
<td>%COUNT2%
<td>%COUNT3%
<td>%IP%<br>%PROXY%
<td>%CID1%<br>%CID2%
</tr>
|||
<tr><td colspan=9 class=empty>[ записей нет ]</tr>
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
