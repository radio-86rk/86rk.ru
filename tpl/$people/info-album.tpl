<album>
%?
<img name=album src=%PHOTO% album=%ID%>
%:%
<img name=album src=images/nophoto.svgz class=deny>
?%
<h2>%NAME%</h2>
%DESCRIPTION%
<div>
фоток: %COUNT%
|
доступ: <span class=access_%ACCESS%>%ACCESS({
	a: "для всех",
	r: "для зарегистрированных",
	s: "для избранных",
	x: "недоступен",
})%</span>
</div>
</album>
