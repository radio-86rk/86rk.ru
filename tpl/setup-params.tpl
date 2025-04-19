<table cellspacing=0 cellpadding=0>
<tr><th>Параметры</th></tr>
<tr><td>
%checkbox("smooth_mess", 0, 1, "медленная прокрутка")%
%checkbox("show_time", 0, 1, "выводить время")%
%checkbox("local_time", 0, 1, "локальное время")%
%checkbox("smiles_off", 0, 1, "отключить смайлы")%
%checkbox("nicks_off", 0, 1, "отключить графники")%
%checkbox("mono", 0, 1, "монохромный цвет")%
<div class=tooltip>
%checkbox("keep_nick", 0, 1, "сохранять ник")%
<tooltip tooltip="после отправки сообщения ник собеседника будет сохраняться в строке ввода"></tooltip>
</div>
<div class=tooltip>
%checkbox("translit", 0, 1, "транслит (Ctrl+Alt)")%
<tooltip tooltip="включает перевод латиницы на русскую раскладку, при активной опции переключение
между раскладками осуществляется комбинацией клавиш Ctrl+Alt"></tooltip>
</div>
<div class=tooltip>
%checkbox("security", 0, 1, "высокая безопасность")%
<tooltip tooltip="сессия привязывается к IP-адресу, защищает сессию от перехвата"></tooltip>
</div>
%?%PRIV_HIDE_VIEWS%
<div class=tooltip>
%checkbox("hide_views", 0, 1, "скрывать просмотры")%
<tooltip tooltip="в разделе &quot;Просмотры анкеты&quot; в анкетах не будет отображаться информация о
просмотрах, но сами просмотры учитываются"></tooltip>
</div>
?%
<div class=tooltip>
%checkbox("ext_menu", 0, 1, "загружать расширенное меню")%
<tooltip tooltip="расширенное меню &mdash; дополнительное меню чата, позволяющее получить доступ ко всем функциям чата"></tooltip>
</div>
%checkbox("win_smiles", 0, 1, "смайлики в отдельном окне")%
%?%USER_PROFILE%
<div class=tooltip>
%checkbox("keep_auth", 0, 1, "запомнить авторизацию")%
<tooltip tooltip="автоматический вход в чат без ввода пароля, функция активируется со следующего входа"></tooltip>
</div>
<div class=tooltip>
%checkbox("auth_bind_ip", 0, 1, "привязать авторизацию к IP")%
<tooltip tooltip="защищает авторизацию, будет запрошен пароль, если изменится IP-адрес последующего входа"></tooltip>
</div>
?%
</td></tr>
<tr><th>Вывод сообщений</th></tr>
<tr><td>
%radio("dir", 0, ["новые сообщения сверху", "новые сообщения снизу"])%
%select("mm", 0, [50, 100, 150, 200, 300, 500, 1000, "без ограничений"], "class=inp")% фраз в окне
</td></tr>
<tr><th>Сообщения для меня</th></tr>
<tr><td>
%radio("my_phrases", 0, ["не выделять", "подчеркивать", "в рамку", "подсвечивать", "отфильтровывать"])%
<div class=tooltip>
%checkbox("exactly_nick", 0, 1, "точное совпадение ника")%
<tooltip tooltip="сообщение будет выделяться, только если в сообщении есть слово в точности соответствующее нику;
при отключенной опции будут выделяться все сообщения, в которых ник является частью слова"></tooltip>
</div>
</td></tr>
</table>
