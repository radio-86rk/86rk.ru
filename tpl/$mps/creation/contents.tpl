%WINDOW_TITLE("%MPS_TITLE% – страница %PAGE%")%
<table class=contents cellpadding=0 cellspacing=0>
<tr><th colspan=6 class=mps-name><span>%MPS_TITLE%</span></th></tr>
<tr><td colspan=6 class=title>%?%DEL_MODE%Удаленные тексты%:%Содержание?%</td></tr>
{{{
<tr%?%CHECK% class=check?%>
<td class=mess-num>%NUM%.
<td class=mess-rating>%RATING(10)%
<td class=mess-title title='%TITLE_TEXT%'>%TITLE("[ без названия ]")%
<td class=mess-name>%NAME%
<td class=mess-date>%DATE(["сегодня", "вчера", "dd.mm.yy"])%
%?%NODEL%<td>NO?%
</tr>
}}}
<tr><td colspan=6 height=100%>
<tr><td colspan=6>
<table class=nav cellspacing=0 cellpadding=0 width=100%>
<tr>
<td width=10%>%PREV("&#9664;&#9664;")%<br>%PREV("Ctrl &larr;")%
<td width=80% align=center valign=top class=pages>
{{{:FORWARD:12
%?:&%CURRENT% [<span class=cur-page>%PAGE%</span>] %:%:%PAGE%:?%
}}}
<td width=10% align=right>%NEXT("&#9654;&#9654;")%<br>%NEXT("Ctrl &rarr;")%
</tr>
</table>
<table class=nav cellspacing=0 cellpadding=0 width=100%>
<tr>
<td width=33%>
<td width=33% align=center>%?%BACK("содержание")%%:%%FORM("написать")%?%
<td width=33% align=right>%DEL_TEXT("Удаленных текстов: %COUNT%")%
</tr>
</table>
</td></tr>
</table>
