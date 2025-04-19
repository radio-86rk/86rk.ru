<table class="t list ignore" cellpadding=0 cellspacing=0>
<tr><th colspan=4>..:: в личном игноре ::..</th></tr>
{{{:IGNORE
<tr>
<td class=num>%NUM%.
<td>%NICK%<br>[<a name=ctrl class=ctrl data-a=ignore data-id=%ID% data-cmd=3>убрать из игнора</a>]
<td width=180 nowrap>%DATE2(["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<td align=center width=50>%?%ON%<span class=on>online</span>%:%%?%OFF%<span class=off>offline</span>?%?%
</tr>
|||
<tr><td colspan=4 class=empty>[ никого нет ]</tr>
}}}
</table>
<table class="t list total" cellpadding=0 cellspacing=0>
<tr><th colspan=7>..:: в тотальном игноре ::..</th></tr>
{{{:TOTAL
<tr>
<td class=num>%NUM%.
<td class=nick>%NICK%%?<br><span>личная отмена игнора</span>%VISIBLE%?%
<div>
%?%VISIBLE%%:%[<a name=ctrl class=ctrl data-a=ignore data-id=%ID% data-cmd=4>личная отмена игнора</a>]?%
%?%VISIBLE%[<a name=ctrl class=ctrl data-a=ignore data-id=%ID% data-cmd=5>вернуть в игнор</a>]?%
%?%REMOVE%[<a name=ctrl class=ctrl data-a=ignore data-id=%ID% data-cmd=6>убрать из игнора</a>]?%
</div>
%?<td>%IP%<br>%PROXY%?%
%?<td>матотестер%MATOTESTER%?%
%?<td>по голосованию%VOTE%?%
%?<td>%KILLER%?%
%?<td>%LOCK%?%
<td nowrap>
%DATE(%LOCKDATE%, ["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<br>
%DATE(%FREEDATE%, ["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<td align=center width=50>%?%ON%<span class=on>online</span>%:%%?%OFF%<span class=off>offline</span>?%?%
</tr>
|||
<tr><td colspan=6 class=empty>[ никого нет ]</tr>
}}}
</table>
