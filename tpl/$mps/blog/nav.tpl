%?%DISABLE%%:%
%?
<div class=menu>
%checkbox("", "", "", "")%
<div>
%?:&%MOBILE%%NORMAL_MODE%%ACCESS%
<a data-a="form">Написать</a>
?%%?:&%MOBILE%%NORMAL_MODE%%WIDGET%
<a data-a=link data-url="blog/%SID%/%DAY%" target="_mps_%SID%">В отдельном окне</a>
?%%?:&%OWNER%%WIDGET%
<a data-a=cfg_blog>Настройки</a>
?%%?:&%OWNER%
<a data-a=del_text>Удалено: %DEL_COUNT%</a>
?%%?:&%OWNER%%FALSE(%NORMAL_MODE%)%
<a data-a=reset>Вернуться</a>
?%%?%LOGGEDIN%
<a data-a=logout>Выйти из системы</a>
?%
</div>
</div>
?%
%?%FALSE(%NORMAL_MODE%)%%:%
%?%MOBILE%%:%%?:&%WIDGET%%LINK("blog/%SID%/%DAY%", "", "new-window")%?%?%
%checkbox("calendar", "", "", "")%
%CALENDAR%
?%
<ul>
<li class=total>Записей: <span>%TOTAL%</span>
<li class=nav>%FIRST("<svg viewBox='0 0 64 42'><path d='M12 0v18.5L38 0v18.5L64 0v42L38 23.5V42L12 23.5V42H0V0h12z'/></svg>", 1)%
<li class=nav>%PREV("<svg viewBox='0 0 46 64'><path d='M0 32L46 0v64L0 32z'/></svg>", 1)%
<li class=nav>%NEXT("<svg viewBox='0 0 46 64'><path d='M0,64V0l46,32L0,64z'/></svg>", 1)%
<li class=nav>%LAST("<svg viewBox='0 0 64 42'><path d='M52 0v18.5L26 0v18.5L0 0v42l26-18.5V42l26-18.5V42h12V0H52z'/></svg>", 1)%
%?%MOBILE%%:%%?<li>%FORM("НАПИСАТЬ")%?%?%
%?%WIDGET%%:%%?<li class=nick>%NICK%%:%<li>%AUTH("ВХОД")%?%?%
</ul>
?%
