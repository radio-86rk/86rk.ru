%?
<div name=collapse collapse=1>Модерирование</div>
<section id=info_section_moder>
<div>
%?%ADMIN%
%?%TRUE(%DEL_DATE%)%%:%%?%BLOCKED%%:%
%?..:: <a class=btn name=admin_backup date=%BACKUP1%>backup %DATE(%BACKUP1%, "d mmm yyyy")%</a> ::..<br>?%
%?..:: <a class=btn name=admin_backup date=%BACKUP2%>backup %DATE(%BACKUP2%, "d mmm yyyy")%</a> ::..<br>?%
%?..:: <a class=btn name=admin_backup date=%BACKUP3%>backup %DATE(%BACKUP3%, "d mmm yyyy")%</a> ::..<br>?%
%?..:: <a class=btn name=admin_backup date=%BACKUP4%>backup %DATE(%BACKUP4%, "d mmm yyyy")%</a> ::..<br>?%
%?..:: <a class=btn name=admin_backup date=%BACKUP5%>backup %DATE(%BACKUP5%, "d mmm yyyy")%</a> ::..<br>?%
%?..:: <a class=btn name=admin_email last=%EMAIL_SENT%>восстановить пароль</a> ::..%SECRET_EMAIL%<br>?%
?%?%
?%
</div>
<div align=right>
%?
%?%SELF%%:%
%?:1%ADMIN%
..:: %?%TRUE(%DEL_DATE%)%<a class=btn name=admin_undel>восстановить</a>%:%<a class=btn name=admin_del>удалить</a>?% ::..<br>
?%
%?:1%MODER%%?%TRUE(%DEL_DATE%)%%:%
..:: %?%BLOCKED%<a class=btn name=admin_unlock>разблокировать</a>%:%<a class=btn name=admin_lock>заблокировать</a>?% ::..<br>
?%?%
?%
%?%ADMIN_PRIV%
..:: <a class=btn name=admin_priv>привилегии</a> ::..<br>
?%
%?%ADMIN_PRIV%
..:: <a class=btn name=admin_deny_priv>запрещенные привилегии</a> ::..<br>
?%
%?%ADMIN_RANK%
..:: <a class=btn name=admin_rank>звание</a> ::..<br>
?%
?%
</div>
</section>
?%
