%DEF_DOW("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")%
<cal-single-month>
%?<month-title>%TITLE%</month-title>?%
<header>
<a name=prev-month>&#9664;&#9664;</a>
<span>%MONTH% %YEAR%</span>
<a name=next-month>&#9654;&#9654;</a>
</header>
{{{
<div>
{{{
<div%?%CUR% class=cur?% day="%DAY%" dow="%DOW%">
%THEME({
	BIRTHDAY:	"<a class=nick name=ctrl data-a=user data-nickid=%NICKID% data-profile=%PROFILE%>%NICK%</a><br>"
})%
</div>
}}}
</div>
}}}
<footer>
Календарь:
%CALENDAR({
	"":		"",
	BIRTHDAY:	"Дни рождения"
})%
</footer>
</cal-single-month>
