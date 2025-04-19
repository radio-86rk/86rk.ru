<table class="notebook read" cellpadding=0 cellspacing=0>
%?%ADMIN%
<tr><td class="panel admin">сообщение от администратора чата</td></tr>
%:%%?%AUGUST%
<tr><td class="panel august">сообщение от администрации Сервиса ~August4u~</td></tr>
%:%%?%NOTICE%
<tr><td class="panel notice">системное уведомление</td></tr>
?%?%?%
<tr><td class="panel flex">
<div>
%?%IN%%DEL%От кого?%%?%OUT%Кому?%:
<br>Дата:
<br>Прочли:
<br>Тема:
</div>
<div>
%NICK%
<br>%DATE(%SENT%, "d mmmg yyyy, HH:ii")%
<br>%?%DATE(%READ%, "d mmmg yyyy, HH:ii")%%:%не прочли?%
<br>%?%SUBJ%%:%&nbsp;?%
</div>
<tr><td class=info>
<div class=view><div class=mess id=mess>%MESS%</div></div>
</td></tr>
<tr><td class=buttons>
%BUTTON_DEL("удалить записку")%
%BUTTON_UNDEL("восстановить записку")%
<nb-div></nb-div>
%BUTTON_UNREAD("следующая непрочитаная записка")%
%BUTTON_TRANS("перевести транслит")%
<nb-div></nb-div>
%?
%BUTTON_FIRST("первая записка")%
%BUTTON_PREV("предыдущая записка")%
%BUTTON_NEXT("следующая записка")%
%BUTTON_LAST("последняя записка")%
<nb-div></nb-div>
?%
%BUTTON_LIST("список записок")%
%BUTTON_FIND("%?%IN%найти все записки от этого пользователя?%%?%OUT%найти все записки для этого пользователя?%")%
%?
<nb-div></nb-div>
%BUTTON_INFO("анкета пользователя")%
%BUTTON_EDIT("исправить записку")%
%BUTTON_REPLY("ответить на записку")%
?%
</td></tr>
</table>
