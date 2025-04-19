<div id=title class=title>ПРЕДПОЧТЕНИЯ</div>
<section>
<div>Отношение к курению:</div><div>%input("uf[_0020]", "", 0, 250, "class=inp")%</div>
<div>Отношение к спиртному:</div><div>%input("uf[_0021]", "", 0, 250, "class=inp")%</div>
<div>Любимая еда:</div><div>%input("uf[_0022]", "", 0, 250, "class=inp")%</div>
<div>Люблю ли я готовить:</div><div>%input("uf[_0023]", "", 0, 250, "class=inp")%</div>
<div>Любимый напиток:</div><div>%input("uf[_0024]", "", 0, 250, "class=inp")%</div>
<div>Любимый вид отдыха:</div><div>%input("uf[_0025]", "", 0, 250, "class=inp")%</div>
<div>Любимое животное:</div><div>%input("uf[_0026]", "", 0, 250, "class=inp")%</div>
<div>Любимый фильм:</div><div>%input("uf[_0027]", "", 0, 250, "class=inp")%</div>
<div>Любимое в литературе:</div><div>%input("uf[_0028]", "", 0, 250, "class=inp")%</div>
<div>Любимое время года:</div><div>%input("uf[_0029]", "", 0, 250, "class=inp")%</div>
<div>Любимая радиостанция:</div><div>%input("uf[_0030]", "", 0, 250, "class=inp")%</div>
<div>Любимая телепрограмма:</div><div>%input("uf[_0031]", "", 0, 250, "class=inp")%</div>
<div>Любимый вид спорта:</div><div>%input("uf[_0032]", "", 0, 250, "class=inp")%</div>
<div>Любимая музыка:</div><div>%input("uf[_0033]", "", 0, 250, "class=inp")%</div>
<div>Любимое домашнее занятие:</div><div>%input("uf[_0034]", "", 0, 250, "class=inp")%</div>
<div>Любимое занятие вне дома:</div><div>%input("uf[_0035]", "", 0, 250, "class=inp")%</div>
<div>Хобби:</div><div>%input("uf[_0036]", "", 0, 250, "class=inp")%</div>
<div>Я ищу:</div><div>
%checkbox("uf[_0037][]", 0, 1, "женщину")%
%checkbox("uf[_0037][]", 0, 2, "мужчину")%
</div>
<div>Мои намерения:</div><div>
%checkbox("uf[_0038][]", 0, 1, "переписка")%
%checkbox("uf[_0038][]", 0, 2, "совместное времяпрепровождение")%
%checkbox("uf[_0038][]", 0, 4, "интимное общение")%
%checkbox("uf[_0038][]", 0, 8, "духовное общение")%
%checkbox("uf[_0038][]", 0, 16, "долгосрочные отношения")%
</div>
<div>Что ищу в кандидате:</div><div>%text("uf[_0039]", "", 0, 6, 0, "class=inp")%</div>
</section>
<div class=btns>
%button("cancel", "ОТМЕНА")%
%button("section", "&#xab; НАЗАД", "", "section=section1 action=prev")%
%button("section", "ДАЛЕЕ &#xbb;", "", "section=section3 action=next")%
</div>
