{{{
<div id=__mps_root_%MESS_ID%>
<div class=lock-icon>
%NAME%
%?%SINGLE%%:%
<div class=num>сообщение %NUM("wall/%SID%/%MESS_ID%")%</div>
?%
</div>
<div>
<div class=user>
%AVATAR%
<div class=views>%VIEWS%</div>
</div>
<div id=__mps_mess_%MESS_ID% class=mess
access-x="запись никому недоступна"
access-r="запись доступна только для зарегистрированых"
access-s="доступ к записи ограничен"
>
%?
<div class=del>Сообщение удалил %DEL_NAME%, %DEL_DATE("d mmmg yyyy в HH:ii:ss")%</div>
?%
%MESS%
%?%EDIT_MODE%%PREVIEW_MODE%%COMMENT_MODE%%MODER_MODE%%:%%?
<div class=ctrl>
%checkbox("", "", "", "")%
<div>
%LINK("wall/%SID%/%MESS_ID%", "Сообщение отдельно")%
%ACCEPT("Принять")%
%COMMENT("Комментировать")%
%QUOTE("Цитата")%
%INFO("Инфо")%
%EDIT("Редактировать")%
%DELETE("Удалить")%
%RESTORE("Восстановить")%
%ACCESS_READ("Доступ на чтение")%
%ACCESS_WRITE("Доступ на запись")%
</div>
</div>
?%?%
<div class=date>%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%</div>
%COMMENTS%
</div>
</div>
</div>
}}}
