%ACTION% %CMD%:
<table class="list online" cellspacing=0 cellpadding=0>
{{{
<tr>
<td align=right>%NUM%.
<td>%SMALL_FLAG%
<td>%?%PHOTO%<img src=images/photo-camera.svgz width=20 height=16>?%
<td align=center>%STAT_ICON%
<td>%INVISIBLE_ICON%
<td>%NICK%
<td nowrap class="small lo">%STAT%
<td nowrap class=small>%ENTRY(["HH:ii:ss", "вчера HH:ii:ss", "d mmm, HH:ii:ss"])%%? &ndash; %ONLINE%?%
<td nowrap class=small>%RANK%
<td nowrap class=small width=100%>%?%IP% %PROXY%?%
</tr>
}}}
<tr><td colspan=10><br></tr>
<tr><td><td colspan=9 class=small width=100%>всего: %TOTAL%</tr>
</table>
