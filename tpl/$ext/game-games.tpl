<table class="t list games" cellpadding=0 cellspacing=0>
<tr><th colspan=6>..:: %NAME% / %?%PLAYER1% &ndash; %PLAYER2%?%%DAY("d mmmg yyyy")% ::..</th></tr>
<tr><td colspan=6 class=ctrl>
<a name=ctrl class="ctrl right" data-a=game data-g=%ID% data-c=%CMD_GAMES%>назад</a>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_NEW%>создать новую игру</a>
<br>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_STAT%>статистика по дням</a>
%?| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PLAYERS%>таблица игроков</a>?%
%?:&%PAIR%| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PAIR%>таблица пар</a>?%
<div class=right>сыграно игр: %TOTAL%</div>
</td></tr>
%?%HEADER%
<tr class=capt>
<td>
<td width=1%>дата
<td width=1%>подолжительность
<td>победитель
<td width=1%>
</tr>
?%
%?%HEADER_DAY_PAIR%
<tr class=capt>
<td>
<td width=1%>время
<td width=1%>подолжительность
<td>пара
<td>победитель
<td width=1%>
</tr>
?%
%?%HEADER_DAY%
<tr class=capt>
<td>
<td width=1%>время
<td width=1%>
<td>игроки
<td width=1%>очки
<td width=1%>
</tr>
?%
{{{
<tr>
<td class=num>%NUM%.
%?<td nowrap>%DATE2(["HH:ii:ss", "вчера HH:ii:ss", "d mmm yyyy, HH:ii:ss"])%?%
%?<td nowrap>%TIME%?%
<td nowrap>%LONG_TIME%
%?<td nowrap>%PLAYER1% &ndash; %PLAYER2%?%
%?<td nowrap class=pls>%PLAYERS%?%
<td nowrap class=score>%?%SCORE%%:%%?%WINNER%%:%ничья?%?%
<td>%?[<a name=ctrl class=ctrl data-a=play-game data-g=%NAME_ID% data-w=%WIDTH% data-h=%HEIGHT% data-p=%VIEW_PARAM%>смотреть</a>]?%
</tr>
|||
<tr><td class=empty colspan=6>[ игр нет ]</tr>
}}}
</table>
