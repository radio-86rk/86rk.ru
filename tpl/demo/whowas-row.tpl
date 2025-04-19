<tr class="row dgt">
<td>%ICON%
<td>%SMALL_FLAG%
<td class=nick>%NICK%
<td>%REGEXP("(\\d+)", "<span>$1</span>", "%LONG_AGO("дн", "час", "мин")%")%
<td>%REGEXP("(\\d+)", "<span>$1</span>", "%ENTER(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%")%
<td>%REGEXP("(\\d+)", "<span>$1</span>", "%QUIT(["сегодня HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%")%
<td>%REGEXP("(\\d+)", "<span>$1</span>", "%LONG_TIME%")%
<td>%COUNT1%
<td>%COUNT2%
<td>%COUNT3%
</tr>
