%WINDOW_TITLE("ЛЮДИ ЧАТА – ТОП 10")%
<div class="content people top menu">

<div class=title><div class=index name=index></div>РЕЙТИНГИ</div>

<table class="page list top" cellspacing=1 cellpadding=0>
<tbody class=top1>
<tr><th colspan=4 class=h1>Текущий месяц</tr>
<tr><th colspan=4 class=h2>Топ по количеству фраз</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Публичные + Личные<th>Скрытность</tr>
{{{:MESS(0)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%NUMERAL(%COUNT1%)% + %NUMERAL(%COUNT2%)%<div class=fright>= %NUMERAL(%COUNT12%)%</div>
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по времени в онлайне</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Время<th>Скрытность</tr>
{{{:TIME(0)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%LONG_TIME(%TIME%)%
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по рефералам</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Рефы<th>Регистрация</tr>
{{{:REFERALS(0)
<tr class=row>
<td>%NUM%.
<td nowrap><a nickid=%NICKID%>%NICK%</a>
<td>%REFERALS%
<td>%DATE2("d mmm yyyy года")%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
</tbody>

<tbody class=top2>
<tr><th colspan=4 class=h1>Прошлый месяц</tr>
<tr><th colspan=4 class=h2>Топ по количеству фраз</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Публичные + Личные<th>Скрытность</tr>
{{{:MESS(-1)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%NUMERAL(%COUNT1%)% + %NUMERAL(%COUNT2%)%<div class=fright>= %NUMERAL(%COUNT12%)%</div>
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по времени в онлайне</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Время<th>Скрытность</tr>
{{{:TIME(-1)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%LONG_TIME(%TIME%)%
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по рефералам</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Рефы<th>Регистрация</tr>
{{{:REFERALS(-1)
<tr class=row>
<td>%NUM%.
<td nowrap><a nickid=%NICKID%>%NICK%</a>
<td>%REFERALS%<td>%DATE2("d mmm yyyy года")%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
</tbody>

<tbody class=top3>
<tr><th colspan=4 class=h1>Весь период</tr>
<tr><th colspan=4 class=h2>Топ по количеству фраз</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Публичные + Личные<th>Скрытность</tr>
{{{:MESS(1)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%NUMERAL(%COUNT1%)% + %NUMERAL(%COUNT2%)%<div class=fright>= %NUMERAL(%COUNT12%)%</div>
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по времени в онлайне</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Время<th>Скрытность</tr>
{{{:TIME(1)
<tr class=row>
<td>%NUM%.
<td><a nickid=%NICKID%>%NICK%</a>
<td>%NUMERAL("%LONG_TIME(%TIME%)%")%
<td>%SECRECY%%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
<tr><th colspan=4 class=h2>Топ по рефералам</tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th>Ник<th>Рефы<th>Регистрация</tr>
{{{:REFERALS(1)
<tr class=row>
<td>%NUM%.
<td nowrap><a nickid=%NICKID%>%NICK%</a>
<td>%REFERALS%
<td>%DATE2("d mmm yyyy года")%
</tr>
|||
<tr><td colspan=4 class=empty>никого нет</tr>
}}}
<tr><th colspan=4 class=line></tr>
</tbody>
</table>

%INCLUDE("menu")%

</div>
