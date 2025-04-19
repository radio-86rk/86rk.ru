{{{
<mps-comment>
<div class=user>
%AVATAR%
%NAME%
<div class=date>%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%</div>
</div>
%?
<div class=del>Сообщение удалил %DEL_NAME%, %DEL_DATE("d mmmg yyyy в HH:ii:ss")%</div>
?%
%MESS%
%?%EDIT_MODE%%PREVIEW_MODE%%COMMENT_MODE%%MODER_MODE%%:%%?
<div class=ctrl>
%checkbox("", "", "", "")%
<div>
%EDIT("редактировать")%
%?:1%OWNER%%?
%ACCEPT("принять")%
%DELETE("удалить")%
%RESTORE("восстановить")%
?%?%
</div>
</div>
?%?%
</mps-comment>
}}}
