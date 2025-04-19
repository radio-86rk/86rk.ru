<table class="t compinfo" cellpadding=0 cellspacing=0>
<tr><th colspan=2>Компьютер</th></tr>
<tr><td>
<div>Браузер:</div><div><img src=images/$logo/%AGENT_NAME%.png width=34 height=30 align=absmiddle> %AGENT%</div>
<div>Операционная система:</div><div><img src=images/$logo/%OS_NAME%.png width=34 height=30 align=absmiddle> %OS%</div>
<div>Платформа:</div><div>%CPU%</div>
<div>Экран:</div><div>%SCREEN%</div>
<div>Часовой пояс:</div><div>%TIMEZONE%</div>
<div>CompID:</div><div>%CID1%-%CID2%</div>
<div valign=top>Proxy:</div><div>%?%PROXY_INFO("%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?% &mdash; %NETNAME%<br>%DESCR%%?<br>%FLAG% %COUNTRY%?%%? &mdash; %CITY%?%")%%:%-----?%</div>
<div valign=top>IP:</div><div>%?%IP_INFO("%IP%%?%TOR% (<font color=red>TOR NETWORK</font>)?%<br>%IP1% &mdash; %IP2% %NETNAME%<br>%DESCR%%?<br>%FLAG% %COUNTRY%?%%? &mdash; %CITY%?%")%%:%-----?%</div>
</td></tr>
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
