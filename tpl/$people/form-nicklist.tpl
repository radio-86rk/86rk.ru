<table class=nicklist width=100% cellspacing=1 cellpadding=0>
<col width=30><col><col width=50><col width=20>
<tr><th colspan=4 height=2></tr>
%?
<tr class=h><th>#<th><th>дата<th>&#x2715;</tr>
{{{
<tr nickid=%NICKID%>
<td>%NUM%.
<td>%NICK%
<td>%DATE2("d mmm yyyy")%
<td>%checkbox("del_nick", 0, "%NICKID%", "", 0, "class=del")%
</tr>
}}}
%:%
<tr><td class=empty colspan=4 align=center>у вас отсутствуют ники</tr>
?%
%?%RESTORE%%:%
<tr><th colspan=4 height=2></tr>
<tr>
<td>
<td>%input("nick", "", 0, 32, "class='inp'")%
<td>%button("add_nick", "добавить")%
<td>
</tr>
?%
<tr><th colspan=4 height=2></tr>
</table>
