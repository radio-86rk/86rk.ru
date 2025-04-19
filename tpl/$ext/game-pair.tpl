<table class="t list games" cellpadding=0 cellspacing=0>
<tr><th colspan=5>..:: %NAME% / %?пары с игроком %PLAYER%%:%таблица пар?% ::..</th></tr>
<tr><td colspan=5 class=ctrl>
<a name=ctrl class="ctrl right" data-a=game data-g=%ID% data-c=%CMD_GAMES%>назад</a>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_NEW%>создать новую игру</a>
<br>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_STAT%>статистика по дням</a>
| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PLAYERS%>таблица игроков</a>
<div class=right>всего пар: %TOTAL%</div>
</td></tr>
%?%HEADER%
<tr class=capt>
<td>
<td colspan=2>пары
<td width=100%>
<td width=1%>сыграно игр
</tr>
?%
{{{
<tr>
<td class=num>%NUM%.
<td nowrap>%PLAYER1% (%WIN1%)
<td nowrap>%PLAYER2% (%WIN2%)
<td>
<td>[<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_GAMES2% data-p="[%PLAYER_ID1%,%PLAYER_ID2%]">%COUNT%</a>]
</tr>
|||
<tr><td class=empty colspan=5>[ игр нет ]</tr>
}}}
</table>
