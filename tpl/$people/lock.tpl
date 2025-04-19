%WINDOW_TITLE("ЛЮДИ ЧАТА – ОТКАЗНИКИ")%
<div class="content people lock menu">

<div class=title><div class=index name=index></div>ОТКАЗНИКИ</div>

<table class="page list lock" cellspacing=1 cellpadding=0>
<tr><td align=center colspan=4>
%?%NAV%
<div class=nav>
{{{:PAGE_NAV
<a %?%CURRENT%class=cur?% name=page page=%PAGE%>%PAGE%</a>
}}}
</div>
?%
%?:&
<div class=num>%FIRST% - %LAST%</div>
?%
</td></tr>
<tr><th colspan=4 class=line></tr>
<tr class=th><th><th><a name=lock_sort sort=date>Дата</a><th><a name=lock_sort sort=nick>Ник</a><th>Причина</tr>
{{{:LIST
<tr class=row>
<td>%NUM%.
<td>%DATE(%LOCK%, "dd.mm.yy")%
<td>
%?:&%MODER%
<a nickid=%NICKID%>%NICK%</a>
%:%
%NICK%
?%
<td>%REASON%
</tr>
|||
<tr><td align=center colspan=4><br>Список пуст<br><br></td></tr>
}}}
<tr><th class=line colspan=4></tr>
</table>

%INCLUDE("menu")%

</div>
