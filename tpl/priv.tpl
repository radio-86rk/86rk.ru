%PRIV_LIST({
	COLOR_NICK:		"цветной ник",
	GRADIENT_NICK:		"градиентный цвет ника",
	STYLE_NICK:		"стилизованный ник",
	COLOR_MESS:		"цветные сообщения",
	GRADIENT_MESS:		"градиентный цвет сообщений",
	STYLE_MESS:		"стилизованные сообщения",
	NICK_SMILES:		"смайлики в нике",
	NICK_PICTURE:		"графический ник",
	PUBLIC_HTML:		"доступ к общим HTML тэгам",
	STYLE_HTML:		"доступ к стилям в HTML тэгах",
	PERSONAL_HTML:		"индивидуальные HTML тэги",
	SPECIAL_CHARS:		"специальные символы HTML",
	ACCESS:			"свободный доступ в чат",
	NO_LIMIT_NICKS:		"неограниченное количество ников",
	PHRASES:		"личные фразы входа/выхода",
	ICON:			"личная иконка",
	SMILES:			"смайлики",
	PERSONAL_SMILES:	"личные смайлики",
	STATUS:			"статусы",
	MYSTATUS:		"личный статус",
	MYSTATUS_SMILES:	"смайлики в личном статусе",
	TAGS:			"тэги",
	AUTO_ANSWER:		"автоответчик",
	INVISIBLE:		"невидимость",
	PRIVATE:		"личка",
	PRIVATE_WIN:		"приватные окна",
	MINI_ROOM:		"мини-комнаты",
	NOTEBOOK:		"записная книжка",
	PHOTO_ALBUM:		"фотоальбом",
	AVATAR:			"аватарка",
	VOTE:			"функция голосования",
	CENSOR_OFF:		"отключенный автоцензор",
	TIMEOUT_OFF:		"неограниченное время молчания",
	FORM_ACCESS:		"ограничение доступа к анкете",
	FORM_NO_DEL:		"неудаляемая анкета",
	HIDE_VIEWS:		"скрывать просмотры анкет",
	INCOGNITO:		"режим \"инкогнито\"",
	ARMOUR:			"режим \"броня\"",
	BOT_MEDIA:		"медиа-боты",
	BOT_INFO:		"инфо-боты",
	BOT_EXTERNAL:		"внешний бот",
	WEBCAM:			"веб-камера",
	DICTAPHONE:		"диктофон",
	ATTACHMENTS:		"вставка картинок"
})%
<table cellspacing=0 cellpadding=0>
<tr><th colspan=4>Привилегии %NICK%</th></tr>
{{{:2
%?%CC(1)%<tr>?%
%?
<td><div class=%?%ALLOW%allow%:%deny?%></div>
<td>%PRIV%
%:%
<td>
?%
%?%CC(2)%</tr>?%
}}}
</table>
