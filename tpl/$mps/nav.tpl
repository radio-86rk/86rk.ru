%?
<div class=moder>
%DEL_TEXT("Удалено: %COUNT%")%
%BACK("Вернуться")%
</div>
?%
%?%DISABLE%
&nbsp;
%:%
<ul>
<li class=total>Сообщений: <span>%TOTAL%</span>
<li class=page>Страница <span>%PAGE%</span> из <span>%PAGES%</span>
%?<li>%FIRST(1)%?%
%?<li>%PREVBLOCK("&#9664;&#9664;")%?%
%?<li>%PREV(" &#9664; ")%?%
{{{:FORWARD:10
<li%?%CURRENT% class=cur?%>%PAGE%
}}}
%?<li>%NEXT(" &#9654; ")%?%
%?<li>%NEXTBLOCK("&#9654;&#9654;")%?%
%?<li>%LAST(%PAGES%)%?%
</ul>
?%
