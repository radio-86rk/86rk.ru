<table class="t list games" cellpadding=0 cellspacing=0>
<tr><th colspan=7>..:: %NAME% / таблица игроков ::..</th></tr>
<tr><td colspan=7 class=ctrl>
<a name=ctrl class="ctrl right" data-a=game data-g=%ID% data-c=%CMD_GAMES%>назад</a>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_NEW%>создать новую игру</a>
<br>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_STAT%>статистика по дням</a>
%?:&%PAIR%| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PAIR%>таблица пар</a>?%
<div class=right>всего игроков: %TOTAL%</div>
</td></tr>
%?%HEADER_PAIR%
<tr class=capt>
<td>
<td>игрок
<td width=1%>сыграно игр
<td width=1%>выигрышей
<td width=1%>проигрышей
<td width=1%>ничьих
<td width=1%>пар
</tr>
?%
%?%HEADER%
<tr class=capt>
<td>
<td>игроки
<td width=1%>сыграно игр
<td width=1%>очки
</tr>
?%
{{{
<tr>
<td class=num>%NUM%.
<td nowrap>%?%PLAYER%%:%#%PLAYER_ID% [ удалён ]?%
<td>%COUNT%
%?<td>%WIN%?%
%?<td>%LOSE%?%
%?<td>%DRAW%?%
%?:&<td>[<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PAIR% data-p=%PLAYER_ID%>%PAIR%</a>]?%
%?<td nowrap align=right>%SCORE%?%
</tr>
|||
<tr><td class=empty colspan=7>[ игр нет ]</tr>
}}}
</table>
