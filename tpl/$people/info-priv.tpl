<h3>Разрешенные привилегии</h3>
<hr>
<div class=panel>
<div class=priv>
%?%checkbox("priv", 0, %PRIV_COLOR_NICK%, "цветной ник")%?%
%?%checkbox("priv", 0, %PRIV_GRADIENT_NICK%, "градиентный ник")%?%
%?%checkbox("priv", 0, %PRIV_STYLE_NICK%, "стилизованный ник")%?%
%?%checkbox("priv", 0, %PRIV_COLOR_MESS%, "цветные сообщения")%?%
%?%checkbox("priv", 0, %PRIV_GRADIENT_MESS%, "градиентные сообщения")%?%
%?%checkbox("priv", 0, %PRIV_STYLE_MESS%, "стилизованные сообщения")%?%
%?%checkbox("priv", 0, %PRIV_NICK_SMILES%, "смайлики в нике")%?%
%?%checkbox("priv", 0, %PRIV_NICK_PICTURE%, "графический ник")%?%
%?%checkbox("priv", 0, %PRIV_PUBLIC_HTML%, "доступ к HTML тэгам")%?%
%?%checkbox("priv", 0, %PRIV_STYLE_HTML%, "доступ к стилям в тэгах")%?%
%?%checkbox("priv", 0, %PRIV_SPECIAL_CHARS%, "специальные символы HTML")%?%
%?%checkbox("priv", 0, %PRIV_ACCESS%, "свободный доступ в чат")%?%
%?%checkbox("priv", 0, %PRIV_STATUS%, "статусы")%?%
%?%checkbox("priv", 0, %PRIV_MYSTATUS%, "личный статус")%?%
%?%checkbox("priv", 0, %PRIV_MYSTATUS_SMILES%, "смайлики в личном статусе")%?%
%?%checkbox("priv", 0, %PRIV_ICON%, "личная иконка")%?%
%?%checkbox("priv", 0, %PRIV_PHRASES%, "личные фразы входа/выхода")%?%
%?%checkbox("priv", 0, %PRIV_PERSONAL_SMILES%, "личные смайлики")%?%
%?%checkbox("priv", 0, %PRIV_WEBCAM%, "веб-камера")%?%
%?%checkbox("priv", 0, %PRIV_DICTAPHONE%, "диктофон")%?%
%?%checkbox("priv", 0, %PRIV_AUTO_ANSWER%, "автоответчик")%?%
%?%checkbox("priv", 0, %PRIV_SMILES%, "смайлики")%?%
%?%checkbox("priv", 0, %PRIV_TAGS%, "тэги")%?%
%?%checkbox("priv", 0, %PRIV_INVISIBLE%, "невидимость")%?%
%?%checkbox("priv", 0, %PRIV_PRIVATE%, "личка")%?%
%?%checkbox("priv", 0, %PRIV_PRIVATE_WIN%, "окно привата")%?%
%?%checkbox("priv", 0, %PRIV_MINI_ROOM%, "мини-комнаты")%?%
%?%checkbox("priv", 0, %PRIV_NOTEBOOK%, "записная книжка")%?%
%?%checkbox("priv", 0, %PRIV_PHOTO_ALBUM%, "фотоальбом")%?%
%?%checkbox("priv", 0, %PRIV_AVATAR%, "аватарка")%?%
%?%checkbox("priv", 0, %PRIV_CENSOR_OFF%, "отключенный автоцензор")%?%
%?%checkbox("priv", 0, %PRIV_TIMEOUT_OFF%, "не выкидывать при молчании")%?%
%?%checkbox("priv", 0, %PRIV_VOTE%, "функция голосования")%?%
%?%checkbox("priv", 0, %PRIV_NO_LIMIT_NICKS%, "ники без ограничений")%?%
%?%checkbox("priv", 0, %PRIV_FORM_ACCESS%, "ограничение доступа к анкете")%?%
%?%checkbox("priv", 0, %PRIV_FORM_NO_DEL%, "неудаляемая анкета")%?%
%?%checkbox("priv", 0, %PRIV_PERSONAL_HTML%, "индивидуальные HTML тэги")%?%
%?%checkbox("priv", 0, %PRIV_INCOGNITO%, "режим \"инкогнито\"")%?%
%?%checkbox("priv", 0, %PRIV_ARMOUR%, "режим \"броня\"")%?%
%?%checkbox("priv", 0, %PRIV_HIDE_VIEWS%, "скрывать просмотры")%?%
%?%checkbox("priv", 0, %PRIV_BOT_MEDIA%, "медиа-боты")%?%
%?%checkbox("priv", 0, %PRIV_BOT_MEDIA_PUBLIC%, "публичные фразы медиа-ботов")%?%
%?%checkbox("priv", 0, %PRIV_BOT_INFO%, "инфо-боты")%?%
%?%checkbox("priv", 0, %PRIV_BOT_INFO_PUBLIC%, "публичные фразы инфо-ботов")%?%
%?%checkbox("priv", 0, %PRIV_BOT_EXTERNAL%, "внешний бот")%?%
%?%checkbox("priv", 0, %PRIV_BOT_EXTERNAL_PUBLIC%, "публичные фразы внешнего бота")%?%
%?%checkbox("priv", 0, %PRIV_ATTACHMENTS%, "вложения")%?%
</div>
<hr>
<div>индивидуальные HTML тэги:<br>%text("html", "", 0, 5, 1, "class=inp")%</div>
<div>Сообщение о входе:<br>%input("entry_mess", "", 0, 0, "class=inp readonly")%</div>
<div>Сообщение о выходе:<br>%input("exit_mess", "", 0, 0, "class=inp readonly")%</div>
%?%TRUE(%PRIV_SET_DATE%)%
<hr>
<div class=date>обновил: %?%USER("%PRIV_ADMIN_NICK%", %PRIV_ADMIN_PROFILE%)%%:%[ анкета удалена ]?% / %DATE(%PRIV_SET_DATE%, "d mmmg yyyy года в HH:ii:ss")%</div>
?%
</div>
<hr>
%button("priv_save", "OK", "", "class=w100")%
