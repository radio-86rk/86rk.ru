%?
<div class=moder>
%?<a href=people/search?cid=%CID%&opt=CID_REG&uniq=UNIQUE target=_blank>найдены анкеты с этого же компьютера (%COUNT_CID%)</a>%:%&nbsp;?%
%?%NEXT%<a class=btn name=admin_next>следующая ></a>?%
</div>
?%
%?
<div class=deleted>
Анкета удалена.<br>
Дата удаления с сервера: %DATE(%DEL_DATE%, "d mmmg yyyy года")%
</div>
%:%%?:1%BLOCKED%
<div class=blocked>
Анкета заблокирована.<br>
Причина: <span>%BLOCK_REASON%</span><br>
%?%ADMIN%
Анкету заблокировал: %?%USER("%LOCK_NICK%", %LOCK_PROFILE%)%%:%[ анкета удалена ]?% / %DATE(%LOCK_DATE%, "d mmmg yyyy года")%
?%
</div>
%:%%?:&
<div class=backup-info>
<div>
Данные анкеты восстановлены %DATE(%RESTORE_DATE%, "d mmmg yyyy года")%
по состоянию на %DATE(%RESTORE_BACKUP%, "d mmmg yyyy года")%
%?%ADMIN%
<br><br>
..:: <a class=btn name=admin_restore date=-1>вернуть информацию до восстановления</a> ::..
?%
</div>
</div>
%:%%?
<div class=backup-info>
данные анкеты от<br>%DATE(%BACKUP%, "d mmmg yyyy года")%
<div>
..:: <a class=btn name=admin_restore date=%BACKUP%>восстановить</a> ::..<br>
..:: <a class=btn name=admin_backup date=0>текущая информация</a> ::..
</div>
</div>
%:%%?:&
<div class=busy-nick>
Ник <span>%BUSY_NICK%</span> занят другой %USER("анкетой", %BUSY_PROFILE%)%
</div>
?%
?%
?%
?%
?%
