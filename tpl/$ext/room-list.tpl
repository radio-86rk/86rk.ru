<table class="t list rooms" cellpadding=0 cellspacing=0>
<tr><th colspan=8>..:: мини-комнаты ::..</th></tr>
%?%HEADER%
<tr class=capt>
<td>
<td>дата
<td>название
<td>владелец
<td>доступ
<td>всего
<td>
<td>
</tr>
?%
{{{
<tr>
<td class=num>%NUM%.
<td>%DATE2(["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<td nowrap>%NAME%
<td width=100>%CREATOR%
<td nowrap>%?%PUBLIC%публичная%:%приватная?%
%?%ACCESS%/<a name=ctrl class=ctrl data-a=miniroom data-id=%ID% data-cmd=3>изменить</a>/?%
<td width=30>%COUNT%
<td width=30>%?%OWNER%<a name=ctrl class=ctrl data-a=miniroom data-id=%ID% data-cmd=2>удалить</a>?%
<td width=30>%?%OWNER%%PUBLIC%<a name=ctrl class=ctrl data-a=private data-id=%ID% data-cmd=8>войти</a>?%
</tr>
|||
<tr><td colspan=8 class=empty>[ комнаты отсутствуют ]</tr>
}}}
%?%CREATE%
<tr><td colspan=8 align=right><a name=ctrl class=ctrl data-a=miniroom data-cmd=1>создать свою комнату</a></tr>
?%
</table>
