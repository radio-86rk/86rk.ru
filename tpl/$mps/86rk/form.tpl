<div-hdr>%SWITCH("Новый раздел", "", "Редактирование раздела")%</div-hdr>
<div class=pad>
Название раздела:
%input("title", "", 0, 50, "class=inp tabindex=1")%
</div>
<div class="flex pad">
<inp-cell>Иконка:
<img class='bg hand upload' name=upload src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>
</inp-cell>
<inp-cell>
Описание:
%text("mess", "", 0, 0, 0, "class=inp tabindex=1")%
</inp-cell>
</div>
<div class="flex pad">
%button("cancel", "cancel")%%button("send", "создать")%
</div>
