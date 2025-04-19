%ACTION% %CMD%:
<table class=list cellspacing=0 cellpadding=0>
{{{
<tr>
<td align=right>%NUM%.
<td>%DATE(%TIME%, ["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<td>%?%PROXY%<br>?%%IP%
<td nowrap>%COUNTRY%%?, %CITY%?%
<td nowrap width=100%>%?%NICK%%:%[ no user ]?%
</tr>
}}}
</table>
