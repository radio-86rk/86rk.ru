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
<poll-option id=%ID%>
%IMAGE%
<opt-text>%ANSWER% &mdash; <opt-count>%COUNT%</opt-count></opt-text>
<opt-bar count=%COUNT% percent=%PERCENT%></opt-bar>
</poll-option>
}}}
<poll-stat>
<div>Всего голосов:</div><div>%TOTAL%</div>
<div>Первый голос:</div><div>%?%DATE(%FIRST%, "d mmm yyyy")%%:%-----?%</div>
<div>Последний голос:</div><div>%?%DATE(%LAST%, "d mmm yyyy")%%:%-----?%</div>
</poll-stat>
?%
%?%STOPPED%%:%
<div class=ctrl>
[ <a name=poll-form class=ctrl>Форма опроса</a> ]
</div>
?%
</poll-result>
