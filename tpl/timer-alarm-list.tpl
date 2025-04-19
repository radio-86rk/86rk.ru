%TAB_NAME("СПИСОК")%
<table class="timer-alarm list-ta" cellpadding=5 cellspacing=0>
{{{
<tr %ID%>
<td>%NUM%.
<td>%TIME%
<td>%TIMER%
<td title="тип: %?будильник%TYPE%%:%таймер?%, %?однократный%EQ(%MODE%,0)%%:%%?ручной перезапуск%EQ(%MODE%,1)%%:%автоперезапуск?%?%&#x0a;звук: %SOUND%, %?%LOOP% раз(а)%:%бесконечный цикл?%&#x0a;громкость: %?нарастающая%SMOOTH%%:%постоянная?%">[i]
<td class=name width=100%>%NAME%
<td nowrap align=right>%BUTTON_DEL("удалить")%%BUTTON_START("старт")%%BUTTON_STOP("стоп")%
</tr>
}}}
</table>
