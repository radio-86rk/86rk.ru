{{{
%?%EDIT_MODE%%PREVIEW_MODE%%COMMENT_MODE%
%WINDOW_TITLE("%MPS_TITLE%: %TITLE%")%
?%
<table class=text cellpadding=0 cellspacing=0>
%?%EDIT_MODE%%PREVIEW_MODE%%COMMENT_MODE%
<tr><th class=mps-name><span>%("%MPS_TITLE%")%</span></th></tr>
%:%
<tr><th class=mps-name>
%?%NONAV%%:%
<div class=fleft>%NUM("creation/%?%NSID%/?%%MESS_ID%")%</div>
?%
<span>%MPS_TITLE%</span>
</th></tr>
<tr><td class=info>
<div class=fright>
Рейтинг: %RATING(10)%/%VOTERS%
%VOTE_STARS(10)%
</div>
Просмотров: %VIEWS%
</td></tr>
?%
<tr><td class=mess height=100%>
%TITLE("[ без названия ]")%
<div>%MESS_PARA%</div>
</td></tr>
<tr><td class="mess-name bottom">
%?%PREVIEW_MODE%
<a></a>
%:%
%LINK("//%HOST%/creation/%?%NSID%/?%%MESS_ID%", "%PROTOCOL%//%HOST%/creation/%?%NSID%/?%%MESS_ID%")%
?%
<div align=right>
%NAME%
<br>
%DATE(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmmg yyyy, HH:ii:ss"])%
</div>
</td></tr>
<tr><td class=ctrl>
%?%EDIT_MODE%%PREVIEW_MODE%%COMMENT_MODE%%:%
%? :: %EDIT("редактировать")%?%
%? :: %COMMENT("комментировать")%?%
%? :: %INFO("инфо")%?%
%? :: %DELETE("удалить")%?%
%? :: %RESTORE("восстановить")%?%
?%
%?%MODER_MODE%%:%
%? <div class=fright> :: %SHOW_COMMENTS("комментарии: %COUNT%")%</div>?%
?%
</td></tr>
%?%MODER_MODE%%EDIT_MODE%%:%
<tr><td>
%COMMENTS%
</td></tr>
%?%PREVIEW_MODE%%COMMENT_MODE%%:%
<tr><td>
<table class=nav cellspacing=0 cellpadding=0 width=100%>
<tr>
<td width=33% class=arrow>%PREV("&#9668;&#9668;")%
<td width=33% align=center>%CONTENTS("содержание")%
<td width=33% align=right class=arrow>%NEXT("&#9658;&#9658;")%
</tr>
<tr>
<td width=33%>%PREV("Ctrl &larr;")%
<td width=33% align=center valign=top>%FORM("написать")%
<td width=33% align=right>%NEXT("Ctrl &rarr;")%
</tr>
</table>
</td></tr>
?%
?%
</table>
}}}
