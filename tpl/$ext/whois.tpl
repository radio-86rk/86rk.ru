%ACTION% %CMD%: %IP%
<table class=info cellspacing=1 cellpadding=1>
<col width=40%><col width=60%>
<tr><td>Сеть:<td>%IP1% &mdash; %IP2%
<tr><td>Название:<td>%NETNAME%
<tr><td>Описание:<td>%DESCR%
<tr><td>Страна:<td>%COUNTRY% %FLAG%
<tr><td>Город:<td>%CITY% %?(%LATITUDE%, %LONGITUDE%)?%
<tr><td>TOR:<td>%?%TOR%<span class=red>да</span>%:%<span class=green>нет</span>?%
<tr><td>Облачный оператор:<td>%?%CLOUD%<span class=red>да</span>%:%<span class=green>нет</span>?%
</table>
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
