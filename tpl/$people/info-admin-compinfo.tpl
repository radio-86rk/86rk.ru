<table class=compinfo width=100% cellspacing=1 cellpadding=1>
<col width=35%><col width=65%>
<tr><td>Дата:<td>%DATE2("d mmmg yyyy")%</tr>
<tr><td>Время:<td>%DATE2("HH:ii:ss")%</tr>
<tr><td>Браузер:</td><td class=align>%AGENT%%?<img src=images/$logo/%AGENT_NAME%.png width=34 height=30 align=right>?%</td></tr>
<tr><td>Операционная система:</td><td class=align>%OS%%?<img src=images/$logo/%OS_NAME%.png width=34 height=30 align=right>?%</td></tr>
<tr><td>Платформа:<td>%CPU%</tr>
<tr><td>Параметры экрана:<td>%SCREEN%</tr>
<tr><td>Часовой пояс:<td>%TIMEZONE%</tr>
<tr><td>CompID:<td class=copy>%CID1%-%CID2%</tr>
<tr>
<td>Proxy:%?<br><br>%PROXY_INFO("%?<img src=images/$flags.large/%CO%.png width=27 height=18>?%")%?%</td>
<td>
%?%
%PROXY_INFO("\
<div class=copy>%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?%</div>\
<div class=copy>%NETNAME%</div>\
<div class=copy>%DESCR%</div>\
%?<hr>%COUNTRY%?%\
%?<div class=copy>%CITY%?% %?(%LATITUDE%, %LONGITUDE%)</div>?%\
")%
%:%
- - -
?%
</td>
</tr>
<tr>
<td>IP:%?<br><br>%IP_INFO("%?<img src=images/$flags.large/%CO%.png width=27 height=18>?%")%?%</td>
<td>
%?
%IP_INFO("\
<div class=copy>%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?%</div>\
<div class=copy>%IP1% &mdash; %IP2%</div>\
<div class=copy>%NETNAME%</div>\
<div class=copy>%DESCR%</div>\
%?<hr>%COUNTRY%?%\
%?<div class=copy>%CITY%?% %?(%LATITUDE%, %LONGITUDE%)</div>?%\
")%
%:%
- - -
?%
</td>
</tr>
</table>
%CINFO({
	AGENT_NAME:	"an",
	AGENT:		"a",
	OS_NAME:	"osn",
	OS:		"os",
	CPU:		"cpu",
	SCREEN:		"scr",
	TIMEZONE:	"tz",
	CID1:		"cid1",
	CID2:		"cid2",
	PROXY_INFO:	{ IPINFO: "pr" },
	IP_INFO:	{ IPINFO: "ip" }
})%
%IPINFO({
	IP1:		{ IPv4: "ip1" },
	IP2:		{ IPv4: "ip2"},
	IP:		{ IPv4: "ip" },
	TOR:		{ TRUE: "tor" },
	CLOUD:		{ TRUE: "cloud" },
	COUNTRY:	{ COUNTRY_NAME: "co" },
	FLAG:		{ COUNTRY_FLAG: "co" },
	NETNAME:	"net",
	DESCR:		"dsc",
	CO:		"co",
	CITY:		"city",
	REGION:		"reg",
	LATITUDE:	"lat",
	LONGITUDE:	"lon"
})%
