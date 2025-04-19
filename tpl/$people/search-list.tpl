<table class="list fixed" cellspacing=1 cellpadding=0>
<col width=50%><col width=50%>
<tr><td colspan=2 class=head>
%?
<div class=nav>
<div class=nav1><div>
{{{:PAGE_NAV
<a %?%CURRENT%class=cur?% name=page page=%PAGE%>%PAGE%</a>
}}}
</div></div>
1 ... %PAGES%
</div>
?%
%?:&
<div class=num>%FIRST% &ndash; %LAST%</div>
?%
%?
<div class=num>%IP1% &ndash; %IP2%</div>
?%
</td></tr>
{{{:LIST:2
%?%CC(1)%<tr class=row>?%
%?
<td %?%LOCK%class=lock%:%%?%CHECK%%:%class=wait?%?%><a %?%DEL%class=del?% nickid=%NICKID%%? photo=%PHOTO%?%>%NICK%</a>
%:%
<td colspan=2>
?%
%?%CC(2)%</tr>?%
|||
<tr><td align=center colspan=2><br>Список пуст<br><br></td></tr>
}}}
<tr><th colspan=2 class=line></tr>
</table>
