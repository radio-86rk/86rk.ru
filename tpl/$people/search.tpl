%WINDOW_TITLE("ЛЮДИ ЧАТА – ПОИСК")%
<div class="content people search">

<div class=title><div class=index name=index></div>ПОИСК</div>

%LIST%

<table class="page search" cellspacing=1 cellpadding=0>
<tr><th colspan=2>
Параметры поиска
</th></tr>
<tr class=row><td>
дата регистрации от &ndash; до:
</td><td>
%input("date1", "", 0, 0, "class='inp w50' type=date min='%YEAR_CHAT%-01-01' max='%YEAR_NOW%-12-31'")%%input("date2", "", 0, 0, "class='inp w50' type=date min='%YEAR_CHAT%-01-01' max='%YEAR_NOW%-12-31'")%
</td></tr>
<tr class=row><td>
искать по началу ника:
</td><td>
%input("first", "", 10, 10, "class='inp w100px'")%
</td></tr>
<tr class=row><td>
искать по дате рождения:
</td><td>
%input("bd", "", 10, 10, "class='inp w100px'")%
<small>DD-MM[-YYYY] | YYYY</small>
</td></tr>
<tr class=row><td>
искать по знаку зодиака:
</td><td class=zodiac>
%checkbox("zodiac", "", 1,  "Козерог",	"23 декабря – 20 января")%
%checkbox("zodiac", "", 2,  "Водолей",	"21 января – 19 февраля")%
%checkbox("zodiac", "", 3,  "Рыбы",	"20 февраля – 20 марта")%
%checkbox("zodiac", "", 4,  "Овен",	"21 марта – 20 апреля")%
%checkbox("zodiac", "", 5,  "Телец",	"21 апреля – 21 мая")%
%checkbox("zodiac", "", 6,  "Близнецы",	"22 мая – 21 июня")%
%checkbox("zodiac", "", 7,  "Рак",	"22 июня – 22 июля")%
%checkbox("zodiac", "", 8,  "Лев",	"23 июля – 21 августа")%
%checkbox("zodiac", "", 9,  "Дева",	"22 августа – 23 сентября")%
%checkbox("zodiac", "", 10, "Весы",	"24 сентября – 23 октября")%
%checkbox("zodiac", "", 11, "Скорпион",	"24 октября – 22 ноября	")%
%checkbox("zodiac", "", 12, "Стрелец",	"23 ноября – 22 декабря")%
</td></tr>
<tr class=row><td>
пол:
</td><td>
%checkbox("opt", "", "SEX_MALE", "мужской")%
%checkbox("opt", "", "SEX_FEMALE", "женский")%
</td></tr>
%INCLUDE("search-moder")%
<tr class=row><th colspan=2>
Параметры вывода
</th></tr>
<tr class=row><td>
ники одной анкеты:
</td><td>
%radio("uniq", "", { "": "все ники", UNIQUE: "только один от анкеты" })%
</td></tr>
<tr class=row><td>
сортировать:
</td><td>
%radio("sort", "SORT_NICK", { SORT_NICK: "по никам", SORT_DATE: "по дате регистрации" })%
</td></tr>
<tr class=row><td>
количество записей на страницу:
</td><td>
%input("size", 100, 10, 10, "class='inp w50px'")%
</td></tr>

<tr><td colspan=2>
%button("go_search", "Искать", "", "class=w100")%
</td></tr>
</table>

</div>
