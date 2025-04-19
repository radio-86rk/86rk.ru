<poll-form error="Ошибка данных" deny="Доступ запрещён">
<poll-question>%QUESTION%</poll-question>
%?%VOTED%
<poll-notice>
Вы уже принимали участие в опросе.
</poll-notice>
%:%%?:&%FALSE(%USER_AUTH%)%%AUTH%
<poll-notice>
Опрос доступен только для зарегистрированных пользователей.
</poll-notice>
?%?%
{{{
<poll-option>
%IMAGE%
%OPTION%
</poll-option>
}}}
%?%VOTED%%:%%?:&%FALSE(%USER_AUTH%)%%AUTH%%:%
<poll-button>
%submit("ok", "Голосовать", "", "class=btn")%
</poll-button>
?%?%
<div class=ctrl>
[ <a name=poll-result class=ctrl>Результаты опроса</a> ]
</div>
</poll-form>
