<table class="t list games" cellpadding=2 cellspacing=0>
<tr><th colspan=5>..:: %NAME% ::..</th></tr>
<tr class=ctrl><td colspan=5>
<div class=right>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_GAMES%>обновить</a>
|
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_LIST%>назад</a>
</div>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_NEW%>создать новую игру</a>
<br>
<a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_STAT%>статистика по дням</a>
%?| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PLAYERS%>таблица игроков</a>?%
%?:&%PAIR%| <a name=ctrl class=ctrl data-a=game data-g=%ID% data-c=%CMD_PAIR%>таблица пар</a>?%
</td></tr>
%?%HEADER%
<tr class=capt>
<td width=1%>игры
<td width=1%>создана
<td>игроки
<td width=1%>
<td width=1%>
</tr>
?%
{{{
<tr>
<td nowrap>игра #%TABLE%%?%HIDDEN%<div class=small8>скрытая</div>?%
<td nowrap>%DATE2(["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%
<td class=pls>%PLAYERS%
<td>%?:&[<a name=ctrl class=ctrl data-a=game data-g=%ID% data-r=%ROOM% data-c=%CMD_DEL%>удалить</a>]?%
%?:&<br>[<a name=ctrl class=ctrl data-a=game data-g=%ID% data-r=%ROOM% data-c=%CMD_HIDDEN%>%?%HIDDEN%открыть%:%скрыть?%</a>]?%
<td nowrap align=right>%?[<a name=ctrl class=ctrl data-a=play-game data-g=%ID% data-r=%ROOM% data-w=%WIDTH% data-h=%HEIGHT%>%?%JOIN%играть%:%смотреть?%</a>]?%
</tr>
|||
<tr><td class=empty colspan=5>[ активных игр нет ]</tr>
}}}
</table>
