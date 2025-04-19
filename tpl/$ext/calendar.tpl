%ACTION% %CMD%:
<calendar>
<header>
%MONTH% %YEAR%
<div>
%PREV(%REGEXP("^(...).+$", "$1", "%PREV_MON%")%)%
%PREV_YEAR%
%NEXT_YEAR%
%NEXT(%REGEXP("^(...).+$", "$1", "%NEXT_MON%")%)%
</div>
</header>
{{{
<div><div>%DOW("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")%</div>
{{{
<div%?%CUR% class=cur?%>%DAY%</div>
}}}
</div>
}}}
</calendar>
