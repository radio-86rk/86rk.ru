%COLORS(
	"белый", "чеpный", "синий", "кpасный", "желтый"
)%
%ANIMALS(
	"Обезьяны", "Петуха", "Собаки", "Кабана", "Кpысы", "Коpовы",
	"Тигpа", "Зайца", "Дpакона", "Змеи", "Лошади", "Овцы"
)%
<cal-caption>
<div class=ctrl>
<a class=ctrl name=prev-year>%PREV_YEAR%</a>
<a class=ctrl name=next-year>%NEXT_YEAR%</a>
<h1>%YEAR%</h1>
</div>
По восточному календарю <span-year>%YEAR%</span-year> год &mdash; год <span-animal>%ANIMAL%</span-animal>,
цвет года &mdash; <span-color class=color-%COLORID%>%COLOR%</span-color>
</cal-caption>
<calendar>
{{{
<cal-month>
<header><a name=cal-month data-m=%MONTH_NUM%>%MONTH%</a></header>
{{{
<div><div>%DOW("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")%</div>
{{{
<div%?%CUR% class=cur?%>%DAY%</div>
}}}
</div>
}}}
</cal-month>
}}}
</calendar>
