<table class=t cellpadding=0 cellspacing=0>
<col width=30%><col width=70%>
<tr><th colspan=2>Компьютер</th></tr>
<tbody class=t>
<tr><td>Браузер:</td><td>%?<img src=images/$logo/%AGENT_NAME%.png width=34 height=30 align=right>?%%AGENT%</td></tr>
<tr><td>Операционная система:</td><td>%?<img src=images/$logo/%OS_NAME%.png width=34 height=30 align=right>?%%OS%</td></tr>
<tr><td>Платформа:</td><td>%CPU%</td></tr>
<tr><td>Экран:</td><td>%SCREEN%</td></tr>
<tr><td>Часовой пояс:</td><td>%TIMEZONE%</td></tr>
<tr><td>CompID:</td><td class=selectable>%CID1%-%CID2%</td></tr>
<tr><td valign=top>Proxy:</td><td class=selectable>%?%PROXY_INFO("%IP%%?%TOR% (<span class=red>TOR NETWORK</span>)?%%?%CLOUD% (<span class=red>CLOUD NETWORK</span>)?%<br>%NETNAME%<br>%DESCR%%?<br>%FLAG% %COUNTRY%?%%? &mdash; %CITY%?%")%%:%-----?%</td></tr>
<tr><td valign=top>IP:</td><td class=selectable>%?%IP_INFO("%IP%%?%TOR% (<span class=red>TOR NETWORK</span>)?%%?%CLOUD% (<span class=red>CLOUD NETWORK</span>)?%<br>%IP1% &mdash; %IP2%<br>%NETNAME%<br>%DESCR%%?<br>%FLAG% %COUNTRY%?%%? &mdash; %CITY%?%")%%:%-----?%</td></tr>
</tbody>
</table>
<br>
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
