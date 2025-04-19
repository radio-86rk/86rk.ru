<h3>Удаление группы</h3>
<hr>
%select("group_id", 0, { 0: "", "": %GROUPLIST("%GROUP_NAME% (%GROUP_COUNT%)")% }, "class=inp")%
<div>
%button("delete_group_ok", "OK", "", "class='red w50'")%%button("close", "НЕТ", "", "class=w50")%
</div>
