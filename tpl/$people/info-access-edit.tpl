<h3>Доступ к разделам анкеты</h3>
<table cellpadding=0 cellspacing=0 width=100%>
<col width=50%><col width=50%>
{{{:PAGES:2
%?%CC(1)%<tr>?%
%?%EDIT%
<td>%checkbox("access[]", %ACCESS%, %SECTION%, "%TITLE%")%
%:%
<td>
?%
%?%CC(2)%</tr>?%
}}}
%?
<tr><th colspan=2>Фотоальбомы</th></tr>
{{{:ALBUMS:2
%?%CC(1)%<tr>?%
%?%EDIT%
<td>%checkbox("album_access[]", %ACCESS%, %ID%, "%NAME%")%
%:%
<td>
?%
%?%CC(2)%</tr>?%
}}}
?%
</table>
<hr>
%button("access_save", "OK", "", "class=w100")%
