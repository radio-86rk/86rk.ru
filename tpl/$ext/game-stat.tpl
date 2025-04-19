<table class="t list games" cellpadding=0 cellspacing=0>
<tr><th>..:: %NAME% / статистика за %YEAR% год ::..</th></tr>
<tr><td class=ctrl>
<a name=ctrl class="ctrl right" data-a=game data-g=%ID% data-c=%CMD_LIST%>назад</a>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_NEW%>создать новую игру</a>
<br>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PLAYERS%>таблица игроков</a>
%?:&%PAIR%| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PAIR%>таблица пар</a>?%
<div class=right>сыграно игр: %TOTAL%</div>
</td></tr>
<tr class=capt><td>
%?<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_STAT% data-p=%PREV_YEAR%>&#9664;&#9664; %PREV_YEAR%</a>?%
%?<a name=ctrl class="ctrl right" data-a=game data-g=%ID% data-c=%CMD_STAT% data-p=%NEXT_YEAR%>%NEXT_YEAR% &#9654;&#9654;</a>?%
</td></tr>
<tr><td align=center>
{{{
<table class=calendar>
<caption>%MONTH%</caption>
{{{
<tr><td>%DOW("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")%</td>
{{{
<td%? count=%COUNT%?%>%?<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_GAMES2% data-p=%DATE%>%DAY%</a>%:%%DAY%?%</td>
}}}
</tr>
}}}
</table>
}}}
</td></tr>
</table>
