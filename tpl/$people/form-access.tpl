<access>
<center>Настройки доступа к анкете</center>
<table class=access cellspacing=1 cellpadding=1>
<tr class=h>
<td>
<th class=a>A
<th class=r>R
<th class=s>S
<th class=x>X
</tr>
{{{
<tr>
<td>%SECTION_NAME%:
<th class=a>%radio("access[%ACCESS_SECTION%]", %ACCESS%, { 0: "" })%
<th class=r>%radio("access[%ACCESS_SECTION%]", %ACCESS%, { 1: "" })%
<th class=s>%radio("access[%ACCESS_SECTION%]", %ACCESS%, { 2: "" })%
<th class=x>%radio("access[%ACCESS_SECTION%]", %ACCESS%, { 3: "" })%
</tr>
}}}
</table>
<div class=legend>
<span class=access-a>A</span> &mdash; доступно всем<br>
<span class=access-r>R</span> &mdash; доступно только зарегистрированным<br>
<span class=access-s>S</span> &mdash; доступно только избранным<br>
<span class=access-x>X</span> &mdash; никому недоступно
</div>
</access>
