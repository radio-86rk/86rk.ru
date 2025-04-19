<h3>Добавление пользователя в группу</h3>
<hr>
%select("group_id", 0, { 0: "", "": %GROUPLIST("%GROUP_NAME% (%GROUP_COUNT%)")% }, "class=inp")%
<hr>
%button("add_to_group_ok", "OK", "", "class=w100")%
