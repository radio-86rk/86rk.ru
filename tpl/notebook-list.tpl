<table class="notebook list" cellpadding=0 cellspacing=0>
<tr><td class=header>
%?Входящие записки%IN%?%
%?Исходящие записки%OUT%?%
%?Удаленные записки%DEL%?%
</td></tr>
%?%FIND%
<tr><td class=panel>Найдено записок: %FIND_NUM%</td></tr>
%:%
<tr><td class="panel flex">
<div>
%?Удалено записок: %DEL_NUM%<br>?%
%?Восстановлено записок: %UNDEL_NUM%<br>?%
%?Непрочитаных записок: %UNREAD_NUM%<br>?%
%?Всего записок: %TOTAL%%:%Записок нет?%
</div>
<select name=folder>
<option>%TITLE%
<option value=in>  -- входящие записки (%COUNT_IN%)
<option value=out>  -- исходящие записки (%COUNT_OUT%)
<option value=del>  -- удаленные записки (%COUNT_DEL%)
</select>
</td></tr>
?%
<tr><td class=info>
<div class=view><div class=list id=table_list>
<table cellpadding=0 cellspacing=0>
<thead>
<tr>
<th width=40>&nbsp;</th>
<th width=20%>%?%IN%От&nbsp;кого ?%%?%OUT%Кому ?%</th>
<th>Тема</th>
<th width=140>Дата</th>
<th width=24 id=x>&times;</th>
</tr>
</thead>
{{{
<tr class="%?%NEW%new ?%%?%ADMIN%admin?%%?%AUGUST%august?%%?%NOTICE%notice?%" data-messid=%ID%>
<td class=num>%NUM%</td>
<td class=trunc>%NICK%</td>
<td class=trunc>%SUBJ%</td>
<td>%DATE("d mmm yyyy, HH:ii")%</td>
<td>%CHECK%</td>
</tr>
|||
<tbody id=list></tbody>
}}}
</table>
</div></div>
</td></tr>
<tr><td class=buttons>
%?
%BUTTON_DEL("удалить записки")%
%BUTTON_UNDEL("восстановить записки")%
<nb-div></nb-div>
?%
%?
%BUTTON_FIRST("в начало списка")%
%BUTTON_PREV("предыдущая страница")%
%BUTTON_NEXT("следующая страница")%
%BUTTON_LAST("в конец списка")%
<nb-div></nb-div>
?%
%BUTTON_LIST("список записок")%
%BUTTON_NEW("новая записка")%
</td></tr>
</table>
