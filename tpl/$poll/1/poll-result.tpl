<poll-result class="normalize sort">
<poll-question>%QUESTION%</poll-question>
%?%STOPPED%
<poll-notice class=stopped>Опрос остановлен</poll-notice>
%:%%?%VOTED%
<poll-notice class=voted>Ваш голос учтён</poll-notice>
?%?%
%?%HIDDEN%
<poll-notice class=hidden>Данные опроса недоступны</poll-notice>
%:%
{{{
%BARS<<<END
<opt-bar id=%ID% count=%COUNT% percent=%PERCENT%></opt-bar>
END%
%OPTIONS<<<END
<poll-option id=%ID%>
%IMAGE%
<opt-text>%ANSWER% &mdash; <opt-count>%COUNT%</opt-count></opt-text>
</poll-option>
END%
}}}
<poll-chart>
<poll-bars>
%BARS%
</poll-bars>
<poll-options>
%OPTIONS%
</poll-options>
<poll-stat>
<div>Всего голосов:</div><div>%TOTAL%</div>
<div>Первый голос:</div><div>%?%DATE(%FIRST%, "d mmm yyyy")%%:%-----?%</div>
<div>Последний голос:</div><div>%?%DATE(%LAST%, "d mmm yyyy")%%:%-----?%</div>
</poll-stat>
</poll-chart>
?%
%?%STOPPED%%:%
<div class=ctrl>
[ <a name=poll-form class=ctrl>Форма опроса</a> ]
</div>
?%
</poll-result>
