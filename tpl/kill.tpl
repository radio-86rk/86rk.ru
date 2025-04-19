<h3>Нарушитель <nick>%NICK%</nick> %?%ONLINE%<span class=green>online</span>%:%<span class=red>offline</span>?%</h3>

<table class="t kill" cellpadding=0 cellspacing=0>
<col width=50%><col width=50%>
<tr><th colspan=2>Тотальный игнор</th></tr>
<tr><td valign=top>
%?%HIDDEN%
<fieldset>
<legend>скрыть своё имя</legend>
&nbsp;%checkbox("anonym", 0, 1, " вписать себя")%<br>
%input("name", "", 0, 0, "class=inp")%
</fieldset>
?%
<fieldset>
<legend>причина</legend>
&nbsp;<a>плохое поведение</a><br>
&nbsp;<a>реклама</a><br>
&nbsp;<a>ругань</a><br>
&nbsp;<a>флуд</a><br>
&nbsp;<a>ник</a><br>
%input("reason", "", 0, 0, "class=inp")%
</fieldset>
</td><td valign=top>
%ACTION_PANEL%
%KILLER3_PANEL%
%KILLER1_PANEL%
%LOCK_PANEL%
</td></tr>
</table>
<br>
%submit("", "применить", "", "class=btn")%
<br><br>
%COMPINFO%
<table class="t list" cellpadding=0 cellspacing=0>
<col><col width=20%><col width=20%>
%?<tr><th colspan=3>Пользователи этого же прокси</th></tr>%PROXY_LIST%?%
%?<tr><th colspan=3>Пользователи с таким же IP</th></tr>%IP_LIST%?%
%?<tr><th colspan=3>Пользователи из той же сети</th></tr>%NET_LIST%?%
%?<tr><th colspan=3>Пользователи этого же компьютера</th></tr>%CID1_LIST%?%
%?<tr><th colspan=3>Пользователи похожего компьютера</th></tr>%CID2_LIST%?%
</table>
<br>
