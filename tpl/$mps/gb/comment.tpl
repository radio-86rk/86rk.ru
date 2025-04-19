{{{
<mps-comment>
<div class=gbuser>
%NAME%
%?%EMAIL("e-mail")%%WWW("www")%?%
<div class=date>%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%</div>
</div>
%MESS%
%?
<div class=edit>
Сообщение отредактировал %EDIT_NAME% %EDIT_COUNT% раз(а) - %EDIT_DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
?%
%?
<mps-ctrl>
&nbsp;
<div>
%EDIT("редактировать")%%DELETE("удалить")%%RESTORE("восстановить")%%INFO("инфо")%%ACCEPT("принять")%
</div>
</mps-ctrl>
?%
</mps-comment>
}}}
