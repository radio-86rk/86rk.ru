<h3>Группа</h3>
<hr>
<span>Название группы:</span>
%input("name", "", 0, 255, "class=inp")%
<span>Описание группы:</span>
%text("spec", "", 0, 5, 0, "class=inp")%
<span>Кто в группе:</span>
<div class=userlist>
<table cellpadding=0 cellspacing=0 width=100%>
{{{
<tr>
<td>%NUM%.
<td class=w100>%NICK%
<td>%DATE2("d mmm yyyy")%
<td>%checkbox("del", 0, "%ID%", "", 0, "class=del")%
</tr>
|||
<tr><td class=empty>[ пусто ]</tr>
}}}
</table>
</div>
<hr>
%button("edit_group_ok", "OK", "", "class=w100")%
