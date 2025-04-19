<rom-mngr>
<select name=cfg data-tpl="Конф. %NUM%"></select>
<input name=cfg-descr size=50 placeholder="описание конфигурации">
<input name=cfg-add type=button class="add btn" title="Создать новую конфигурацию">
<input name=cfg-del type=button class="del btn" title="Удалить текущую конфигурацию">
<input name=cfg-copy type=button class="copy btn" title="Сделать копию конфигурации">
<input name=cfg-upload type=button class="upload btn" title="Загрузить конфигурацию">
<input name=cfg-download type=button class="download btn" title="Выгрузить конфигурацию">
<div id=copy>
Скопировать текущую конфигурацию в конфигурацию:<br>
<select name=cfg-copy data-tpl="Конф. %NUM%"></select>
<input name=cfg-copy-descr size=50 readonly>
<input name=cfg-copy-ok type=button class="ok" value="OK">
</div>
</rom-mngr>
