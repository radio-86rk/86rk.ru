{{{
<table class=comment cellpadding=0 cellspacing=0>
<tr>
<td class=mess-name rowspan=2>
%NAME%
%SVOTE_POINTS("&minus;1", "+1")%
<div class=date>
%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
</td>
<td height=100%>
<div class="views fright">%VIEWS%</div>
%TITLE%
%MESS%
%?
<div class=edit>
Сообщение отредактировал %EDIT_NAME%
%EDIT_COUNT% раз(а) - %EDIT_DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
?%
</td>
</tr>
%?
<tr>
<td class=ctrl>
%? :: %EDIT("редактировать")%?%
%? :: %DELETE("удалить")%?%
%? :: %RESTORE("восстановить")%?%
%? :: %INFO("инфо")%?%
%? :: %ACCEPT("принять")%?%
</td>
</tr>
?%
</table>
}}}
