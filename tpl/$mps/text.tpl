{{{
<div class=mps-mess>
<div class=mps-user>%NAME%</div>
<div class=mps-datenum>
<div class=mps-date>%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%</div>
<div class=mps-num>сообщение %NUM("mps/%SID%/%MESS_ID%")%</div>
</div>

%MESS(500, " ...", "далее")%
%?
<div class=edit>
Сообщение отредактировал %EDIT_NAME% %EDIT_COUNT% раз(а)
 - %EDIT_DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
?%
%COMMENTS%

%?
<mps-ctrl>
<div>
%SHOW_COMMENTS("комментарии (%COMMENT_COUNT%)")%%COMMENT("ответить")%%QUOTE("цитата")%%EDIT("редактировать")%
</div>
%?
<div>
%INFO("инфо")%%ACCEPT("принять")%%DELETE("удалить")%%RESTORE("восстановить")%
</div>
?%
</mps-ctrl>
?%

</div>
}}}
