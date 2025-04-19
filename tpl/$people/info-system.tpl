%?
<div name=collapse collapse=1>Системная информация</div>
<section>

%?<div>Дата регистрации:<div>%DATE(%REG_DATE%, "d mmmg yyyy года в HH:ii:ss")%<span class=sub>%LONG_YEARS(%REG_TIME%, ["год", "года", "лет"])% тому назад</span></div></div>?%
%?<div>Последнее посещение чата:<div>%DATE(%ENTER_DATE%, "d mmmg yyyy года в HH:ii:ss")%<span class=sub>%LONG_YEARS(%ENTER_TIME%, ["год", "года", "лет"])% тому назад</span></div></div>?%
%?<div>Время, проведённое в чате:<div>%NUMERAL(%LONG_TIME(%TIME%)%)%</div></div>?%
%?<div>Публичных фраз:<div>%NUMERAL(%COUNT1%)%</div></div>?%
%?<div>Личных фраз:<div>%NUMERAL(%COUNT2%)%</div></div>?%
%?<div>Приватных фраз:<div>%NUMERAL(%COUNT3%)%</div></div>?%
%?<div>Просмотров анкеты:<div>%NUMERAL(%VIEWS%)% <a class=btn name=show_viewers data-max=33>кто просматривал</a></div></div>?%
%?<div>Сколько раз Вы просматривали эту анкету:<div>%MY_VIEWS%</div></div>?%
%?
<div>Количество нарушений:<div>%BANS%</div></div>
<div>Дата последнего нарушения:<div>%DATE(%LAST_BAN_DATE%, "d mmmg yyyy года в HH:ii:ss")%<span class=sub>%LONG_YEARS(%LAST_BAN_TIME%, ["год", "года", "лет"])% тому назад</span></div></div>
?%
%?<div>Пришел по ссылке от:<div><a href=info?profile=%REFERER_PROFILE% target=_info%REFERER_PROFILE%>%REFERER_NICK%</a></div></div>?%
%?<div>Неудачных авторизаций:<div>%NUMERAL(%AUTH_FAIL%)% <a class=btn name=auth_fail_log>журнал</a></div></div>?%

</section>
?%
