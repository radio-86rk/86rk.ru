%?
<div name=collapse>
Профайл
%?
<menu>
%?<li><a class=btn name=show_refs>Список рефералов</a> (%FRIENDS%)?%
%?<li><a class=btn name=show_stat>Статистика по месяцам</a>%ACCESS_STAT%?%
%?<li><a class=btn name=notebook>Написать записку</a>%NOTEBOOK%?%
%?<li><a class=btn name=info_edit>Редактировать анкету</a>%SELF%?%
</menu>
?%
</div>
<section>

%?:&%MODER%
<div>
<div>
%?%CHECKED%
%?:&%ADMIN%%TRUE(%CHECK_PROFILE%)%
Анкету проверил: %?%USER("%CHECK_NICK%", %CHECK_PROFILE%)%%:%[ анкета удалена ]?%
%:%
Анкета проверена
?%%:%
Анкета не проверена
?%
</div>
</div>
?%

<div>Адрес анкеты:
<div><a href=//%ADDRESS%%PATH%/info.php?profile=%PROFILE% target=_info%PROFILE%>//%ADDRESS%%PATH%/info.php?profile=%PROFILE%</a></div>
</div>
<div>Адрес для рефералов:
<div><a href=//%ADDRESS%%PATH%/?ref=%PROFILE% target=_blank>//%ADDRESS%%PATH%/?ref=%PROFILE%</a></div>
</div>

<div id=rank></div>

</section>
?%
