<table class=send cellpadding=0 cellspacing=0><tr>
%?%MOBILE_DEVICE%%:%
<td nowrap class=greeting>Привет!
?%
<td nowrap width=100% class=mess>%input("imess", "", 0, %MAXMESSLEN%, "class=inp autocomplete=off")%
<td nowrap class=fs0>
%button("send", "Send", "Отправить", "class=btn")%
%?%MOBILE_DEVICE%%:%
%button("clear", "Clear", "Очистить", "class=btn")%
%button("xmm", "2RUS", "Преобразовать в русский текст", "class=btn accesskey=r")%
?%
<button type=button name=attach title="Загрузить картинку" class=btn>
<svg viewBox="0 0 300 300">
<path d="M245.9 130.2c25.2-25.1 25.2-65.6 0-90.6s-66.1-25.1-91.3 0L32.9 160.4l-15-15L139.5 24.6c33.7-32.9 87.7-32.8 121.2.4s33.5 86.9.4 120.3L124.3 281.2c-25.2 25.1-66.1 25.1-91.3 0s-25.2-65.6 0-90.6L167.2 58.8c16.5-15.9 42.8-15.7 59.2.4 16.3 16.2 16.4 42.2.4 58.5v.1l-89.5 88.5-14.9-14.8 89.5-88.5c8.2-8.1 8.2-21.3 0-29.5-8.2-8.1-21.6-8.1-29.9 0L47.7 206.2c-16.8 16.7-16.8 43.7 0 60.4s44 16.7 60.8 0l137.4-136.4z"/>
</svg>
</button>
<button type=button name=dictaphone title="Диктофон" class=btn module=1>
<svg viewBox="0 0 300 300">
<path style="fill: var(--btn-mic-path1)" d="M93 85V60c0-33 24-60 57-60s57 27 57 60v25"/>
<path style="fill: var(--btn-mic-path2)" d="M207 103v25c0 33-24 60-57 60s-57-27-57-60v-25"/>
<path style="fill: var(--btn-mic-path3)" d="M225 103v25c0 42-32 78-75 78-42 0-75-36-75-78v-25H39v25c0 30 8 59 29 81 17 17 40 28 64 32v22H96v37h108v-37h-36v-22c23-4 44-15 62-32 22-22 31-51 31-81v-25h-36z"/>
</svg>
</button>
%?%MOBILE_DEVICE%%:%
%?%GUEST%
<td><a class=abtn name=fast-reg module=1>регистрация</a>
%:%
<td>%TIMER_CLOCK%
?%
?%
</tr></table>
