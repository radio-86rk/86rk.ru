<div id=title class=title>ЛИЧНАЯ ИНФОРМАЦИЯ</div>
<section>
<div>Имя:</div><div>%input("uf[_0001]", "", 0, 250, "class=inp")%</div>
<div>Отчество:</div><div>%input("uf[_0002]", "", 0, 250, "class=inp")%</div>
<div>Фамилия:</div><div>%input("uf[_0003]", "", 0, 250, "class=inp")%</div>
<div>Пол:</div><div>%radio("uf[Sex]", 0, ["скрываю", "мужской", "женский"])%</div>
<div>Дата рождения:</div><div>%input("uf[Date]", "", 0, 0, "class=inp type=date")%</div>
<div>Место рождения:</div><div>%input("uf[_0004]", "", 0, 250, "class=inp")%</div>
<div>Семейное положение:</div><div>%radio("uf[_0005]", 0, ["скрываю", "холост/не замужем", "женат/замужем", "разведен/разведена", "вдовец/вдова"])%</div>
<div>Наличие детей:</div><div>%radio("uf[_0006]", 0, ["скрываю", "нет", "есть, живут со мной", "есть, живут отдельно"])%</div>
<div>Образование:</div><div>%radio("uf[_0007]", 0, ["скрываю", "среднее", "среднее специальное", "незаконченное высшее", "высшее"])%</div>
<div>Рост:</div><div>%input("uf[_0008]", "", 0, 250, "class='inp w100px'")% см</div>
<div>Вес:</div><div>%input("uf[_0009]", "", 0, 250, "class='inp w100px'")% кг</div>
<div>Цвет глаз:</div><div>%input("uf[_0010]", "", 0, 250, "class=inp")%</div>
<div>Цвет волос:</div><div>%input("uf[_0011]", "", 0, 250, "class=inp")%</div>
<div>Телосложение:</div><div>%input("uf[_0012]", "", 0, 250, "class=inp")%</div>
<div>Основные черты характера:</div><div>%input("uf[_0013]", "", 0, 250, "class=inp")%</div>
<div>Тип темперамента:</div><div>%input("uf[_0014]", "", 0, 250, "class=inp")%</div>
<div>Чувство юмора:</div><div>%input("uf[_0015]", "", 0, 250, "class=inp")%</div>
<div>Мечта:</div><div>%input("uf[_0016]", "", 0, 250, "class=inp")%</div>
<div>Больше всего в человеке ценю:</div><div>%input("uf[_0017]", "", 0, 250, "class=inp")%</div>
<div>Больше всего в человеке ненавижу:</div><div>%input("uf[_0018]", "", 0, 250, "class=inp")%</div>
<div>Немного обо мне:</div><div>%text("uf[_0019]", "", 0, 6, 0, "class=inp")%</div>
</section>
<div class=btns>
%button("cancel", "ОТМЕНА")%
%button("section", "ДАЛЕЕ &#xbb;", "", "section=section2 action=next")%
</div>
