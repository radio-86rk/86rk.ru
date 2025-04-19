<div class=menu>
%checkbox("", "", "", "")%
<div>
%?%ADMIN%
<a data-a=form>Создать раздел</a>
?%
%?%LOGGEDIN%
<a data-a=logout>Выйти из системы</a>
?%
</div>
</div>
<ul>
<li><a name=chat>Чат</a>
%?<li class=nick>%NICK%%:%<li>%AUTH("Авторизация")%?%
</ul>
