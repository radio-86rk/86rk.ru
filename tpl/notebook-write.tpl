<table class="notebook write" cellpadding=0 cellspacing=0>
<tr><td class=header>Новая записка</td></tr>
<tr><td class=panel id=error>
%?Доступ запрещен%DENY%?%
%?Слишком длинное сообщение%LONG_MESS%?%
%?Слишком много адресатов. Разрешается отправлять не более %SEND_LIMIT% записок?%
%?Пользователь `%USER%` не зарегистрирован?%
%?Пользователи =%USERS%= не зарегистрированы?%
%?:&Некорректный тип файла `%FILE%`%FILE_TYPE%?%
%?:&Файл `%FILE%` слишком большой (%SIZE%k)%FILE_SIZE%?%
%?%ERROR%?%
</td></tr>
<tr><td class=panel>
<table cellpadding=0 cellspacing=0>
<tr><td>Кому:</td><td width=100%>%input("to", "", 0, 0, "class=inp")%</td></tr>
<tr><td>Тема:</td><td width=100%>%input("subj", "", 0, 256, "class=inp")%</td></tr>
</table>
</td></tr>
<tr><td class=info>%text("mess", "", 0, 0, 0, "class=inp")%</td></tr>
<tr><td id=dictaphone class=buttons></td></tr>
<tr><td id=friends_list class=buttons>
<select name=friends class=inp></select>
<div>
<nb-div></nb-div>
%BUTTON_INFO("анкета пользователя")%
%BUTTON_FIND("найти все записки от этого пользователя")%
%BUTTON_DEL("удалить пользователя из друзей")%
%BUTTON_SELECT("выбрать")%
</div>
</td></tr>
<tr><td class=buttons>
%?
%BUTTON_EMOJI("эмодзи")%
<nb-div></nb-div>
?%
%?
%BUTTON_ATTACH("прикрепить картинку")%
<nb-div></nb-div>
?%
%?
%BUTTON_MIC("диктофон")%
<nb-div></nb-div>
?%
%?
%BUTTON_WEBCAM("видеомагнитофон")%
<nb-div></nb-div>
?%
%BUTTON_TRANS("перевести транслит")%
<nb-div></nb-div>
%BUTTON_LIST("список записок")%
<nb-div></nb-div>
%BUTTON_FRIENDS("друзья")%
<nb-div></nb-div>
%BUTTON_SEND("отправить записку")%
</td></tr>
</table>
<nb-panel></nb-panel>
