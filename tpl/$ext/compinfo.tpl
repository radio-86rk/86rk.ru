%ACTION% %CMD%: %NICK%
<table class=info cellspacing=1 cellpadding=1>
<col width=40%><col width=60%>
<tr><td>Браузер:</td><td>%?<img src=images/$logo/%AGENT_NAME%.png width=34 height=30 align=right>?%%AGENT%</td></tr>
<tr><td>Операционная система:</td><td>%?<img src=images/$logo/%OS_NAME%.png width=34 height=30 align=right>?%%OS%</td></tr>
<tr><td>Платформа:<td>%CPU%</tr>
<tr><td>Параметры экрана:<td>%SCREEN%</tr>
<tr><td>Часовой пояс:<td>%TIMEZONE%</tr>
<tr><td>CompID:<td>%CID1%-%CID2%</tr>
<tr>
<td>Proxy:%?<br><br>%PROXY_INFO("%FLAG%")%?%</td>
<td>%?%PROXY_INFO("%IP%%?%TOR% (<span class=red>TOR NETWORK</span>)?%%?%CLOUD% (<span class=red>CLOUD NETWORK</span>)?%<br>%NETNAME%<br>%DESCR%%?<hr noshade size=1>%COUNTRY%?%%?<br>%CITY%?% %?(%LATITUDE%, %LONGITUDE%)?%")%%:%- - - - -?%</td>
</tr>
<tr>
<td>IP:%?<br><br>%IP_INFO("%FLAG%")%?%</td>
<td>%?%IP_INFO("%IP%%?%TOR% (<span class=red>TOR NETWORK</span>)?%%?%CLOUD% (<span class=red>CLOUD NETWORK</span>)?%<br>%IP1% &mdash; %IP2%<br>%NETNAME%<br>%DESCR%%?<hr noshade size=1>%COUNTRY%?%%?<br>%CITY%?% %?(%LATITUDE%, %LONGITUDE%)?%")%%:%- - - - -?%</td>
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
