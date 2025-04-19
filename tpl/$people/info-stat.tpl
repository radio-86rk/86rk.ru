<h3>Статистика по месяцам</h3>
<hr>
<table cellpadding=0 cellspacing=0 width=100%>
<tr><td colspan=2 class=month>
<a %PREV_MONTH% class="btn s110 stroke fleft" title="предыдущий месяц">&#9664;&#9664;</a>
<a %NEXT_MONTH% class="btn s110 stroke fright" title="следующий месяц">&#9654;&#9654;</a>
%MONTH% %YEAR%
</tr>
<tr><td colspan=2><hr></tr>
<tbody class=stat>
<tr><td>Время, проведённое в чате:<td>%STAT_TIME%</tr>
<tr><td>Количество входов в чат:<td>%STAT_ENTER%</tr>
<tr><td>Публичных фраз:<td>%STAT_COUNT1%</tr>
<tr><td>Личных фраз:<td>%STAT_COUNT2%</tr>
<tr><td>Приватных фраз:<td>%STAT_COUNT3%</tr>
</tbody>
</table>
%?%ADMIN%%SELF%
<hr>
<center>
Подробная статистика по дням
<nobr>
c %input("d1", "", 3, 3)% по %input("d2", "", 3, 3)% %button("show_stat_days", ">>")%
</nobr>
</center>
?%
<hr>
<div class=bottom>
<div><a class=btn name=close>закрыть</a></div>
</div>
