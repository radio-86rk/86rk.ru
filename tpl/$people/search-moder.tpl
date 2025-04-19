<tr class=row><td>
поиск по IP:
</td><td>
%input("ip", "", 20, 20, "class='inp w150px'")%
%radio("net", "", { "": "строгий поиск по IP", IP_NET: "поиск по сети" })%
%checkbox("opt", "", "IP_REG", "IP регистрации")%
%checkbox("opt", "", "IP_EDIT", "IP редактирования")%
%checkbox("opt", "", "IP_ENTER", "IP последнего входа в чат")%
</td></tr>
<tr class=row><td>
искать по CompID:
</td><td>
%input("cid", "", 20, 20, "class='inp w150px'")%
%checkbox("opt", "", "CID_REG", "регистрация")%
%checkbox("opt", "", "CID_EDIT", "редактирование")%
%checkbox("opt", "", "CID_ENTER", "последний вход в чат")%
</td></tr>

<tr class=row><th colspan=2>
Состояние анкеты
</th></tr>

<tr class=row><td>
проверена:
</td><td>
%radio("checked", "", { NO_CHECKED: "нет", CHECKED: "да", "": "не важно" })%
</td></tr>
<tr class=row><td>
заблокирована:
</td><td>
%radio("locked", "", { NO_LOCKED: "нет", LOCKED: "да", "": "не важно" })%
</td></tr>
<tr class=row><td>
удалена:
</td><td>
%radio("deleted", "", { NO_DELETED: "нет", DELETED: "да", "": "не важно" })%
</td></tr>
