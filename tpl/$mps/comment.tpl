{{{
<mps-comment>
<div class=mps-user>
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
%EDIT("редактировать")%%INFO("инфо")%%RESTORE("восстановить")%%DELETE("удалить")%%ACCEPT("принять")%
</mps-ctrl>
?%
</mps-comment>
}}}
