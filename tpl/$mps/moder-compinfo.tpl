<table class=compinfo cellspacing=1 cellpadding=1>
<col width=35%><col width=65%>
<tr><td>Браузер:</td><td>%?<img src=images/$logo/%AGENT_NAME%.png width=34 height=30 align=absmiddle> ?%%AGENT%</td></tr>
<tr><td>Операционная система:</td><td>%?<img src=images/$logo/%OS_NAME%.png width=34 height=30 align=absmiddle> ?%%OS%</td></tr>
<tr><td>Платформа:<td>%CPU%</tr>
<tr><td>Параметры экрана:<td>%SCREEN%</tr>
<tr><td>Часовой пояс:<td>%TIMEZONE%</tr>
<tr><td>CompID:<td>%CID1%-%CID2%</tr>
<tr><td valign=top>Proxy:</td><td>%?%PROXY_INFO("%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?%<br>%NETNAME%<br>%DESCR%%?<hr noshade size=1><img class=flag src=images/$flags.large/%CO%.png width=27 height=18 align=right>?%%?%COUNTRY%<br>?%%CITY% %?(%LATITUDE%, %LONGITUDE%)?%")%%:%- - - -?%</td></tr>
<tr><td valign=top>IP:</td><td>%?%IP_INFO("%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?%<br>%IP1% &mdash; %IP2%<br>%NETNAME%<br>%DESCR%%?<hr noshade size=1><img class=flag src=images/$flags.large/%CO%.png width=27 height=18 align=right>?%%?%COUNTRY%<br>?%%CITY% %?(%LATITUDE%, %LONGITUDE%)?%")%%:%- - - -?%</td></tr>
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
