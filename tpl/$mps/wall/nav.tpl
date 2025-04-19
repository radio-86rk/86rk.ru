%?%DISABLE%%:%
%?
<div class=menu>
%checkbox("", "", "", "")%
<div>
%?:&%MOBILE%%NORMAL_MODE%%ACCESS%
<a data-a="form">Написать</a>
?%
%?:&%MOBILE%%NORMAL_MODE%%WIDGET%
<a data-a=link data-url="blog/%SID%/%DAY%" target="_mps_%SID%">В отдельном окне</a>
?%
%?:&%OWNER%%WIDGET%
<a data-a=cfg_wall>Настройки</a>
?%%?:&%OWNER%
<a data-a=del_text>Удалено: %DEL_COUNT%</a>
?%%?:&%OWNER%%FALSE(%NORMAL_MODE%)%
<a data-a=reset>Вернуться</a>
?%
%?%LOGGEDIN%
<a data-a=logout>Выйти из системы</a>
?%
</div>
</div>
?%
%?:&%WIDGET%
<a class=new-window target=wall-%SID% href=wall/%SID%></a>
?%
<ul>
<li class=page>Страница <span>%PAGE%</span> из <span>%PAGES%</span>
<li class=total>Сообщений: <span>%TOTAL%</span>
%?<li>%PREV(" &#9664; ")%?%
{{{:FORWARD:5
<li%?%CURRENT% class=cur?%>%PAGE%
}}}
%?<li>%NEXT(" &#9654; ")%?%
%?%MOBILE%%:%%?<li>%FORM("НАПИСАТЬ")%?%?%
%?%WIDGET%%:%%?<li class=nick>%NICK%%:%<li>%AUTH("ВХОД")%?%?%
</ul>
?%
