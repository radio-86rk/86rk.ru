%WINDOW_TITLE("ЛЮДИ ЧАТА – ИМЕНИННИКИ")%
<div class="content people birthday menu">

<div class=title><div class=index name=index></div>ИМЕНИННИКИ</div>

<table class="page list birthday" cellspacing=1 cellpadding=0>

<tr><th colspan=3 class=h2>У кого день рождения сегодня %DATE(%TIME%, "d mmmg")%</tr>
<tr><th colspan=3 class=line></tr>
<tr class=th><th><th>Ник<th>Дата последнего посещения чата</tr>
{{{:BIRTHDAY(0)
<tr class=row><td>%NUM%.<td><a nickid=%NICKID%>%NICK%</a><td>%DATE(%LAST%, "d mmmg yyyy")%</tr>
|||
<tr><td colspan=3 class=empty>никого нет</tr>
}}}
<tr><th colspan=3 class=line></tr>

<tr><th colspan=3 class=h2>У кого день рождения был вчера %DATE(%TIME(-86400)%, "d mmmg")%</tr>
<tr><th colspan=3 class=line></tr>
<tr class=th><th><th>Ник<th>Дата последнего посещения чата</tr>
{{{:BIRTHDAY(-1)
<tr class=row><td>%NUM%.<td><a nickid=%NICKID%>%NICK%</a><td>%DATE(%LAST%, "d mmmg yyyy")%</tr>
|||
<tr><td colspan=3 class=empty>никого нет</tr>
}}}
<tr><th colspan=3 class=line></tr>

<tr><th colspan=3 class=h2>У кого день рождения будет завтра %DATE(%TIME(86400)%, "d mmmg")%</tr>
<tr><th colspan=3 class=line></tr>
<tr class=th><th><th>Ник<th>Дата последнего посещения чата</tr>
{{{:BIRTHDAY(1)
<tr class=row><td>%NUM%.<td><a nickid=%NICKID%>%NICK%</a><td>%DATE(%LAST%, "d mmmg yyyy")%</tr>
|||
<tr><td colspan=3 class=empty>никого нет</tr>
}}}
<tr><th colspan=3 class=line></tr>

</table>

%INCLUDE("menu")%

</div>
