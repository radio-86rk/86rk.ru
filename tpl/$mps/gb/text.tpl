{{{
<div>
<div>
<div class=gbdate>%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%</div>
<div class=gbnum>
%?<div>комментариев: %COMMENT_COUNT%</div>?%
сообщение %NUM("gb/%?%NSID%/?%%MESS_ID%")%
</div>
</div>
<div>
<div class=gbuser>
%NAME%
%AVATAR%
%?%TRUE(%PROFILE%)%
<mps-profile>
Регистрация:
<span>
%?%REG_DATE("d mmmg yyyy")%%:%[ анкета удалена ]?%
</span>
</mps-profile>
?%
%?
<div class=contact>
%?%EMAIL("e-mail")%<br>?%
%?%WWW("www")%<br>?%
</div>
?%
</div>
<div class=gbmess>
<div>
%MESS(1000, " ...", "далее")%
%?
<div class=edit>
%?:&%GT(%EDIT_COUNT%, 1)%
Отредактировано %EDIT_COUNT% %ENDING(%EDIT_COUNT%, ["раз", "раза", "раз"])%.
?%
%?%EQ(%PROFILE%, %EDIT_PROFILE%)%
Последнее редактирование:
%:%
Сообщение отредактировал %EDIT_NAME%:
?%
%EDIT_DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
?%
%COMMENTS%
</div>
%?
<mps-ctrl>
<div>
%SHOW_COMMENTS("комментарии")%%COMMENT("ответить")%%QUOTE("цитата")%
</div>
%?
<div>
%EDIT("редактировать")%%DELETE("удалить")%%RESTORE("восстановить")%%INFO("инфо")%%ACCEPT("принять")%
</div>
?%
</mps-ctrl>
?%
</div>
</div>
</div>
<div></div>
}}}
