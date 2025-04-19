<table cellspacing=0 cellpadding=0>
<tr><th>%?%EQ("%N%", "n")%Цвет ника%:%Цвет сообщений?%</th></tr>
<tr><td>
%input("%N%_color", "", 0, 255, "class=inp")%
<div class="view %?%EQ("%N%", "n")%nick%:%mess?%" id=%N%_color_view>text TEXT text</div>
<div class=color id=%N%_color></div>
%?%checkbox("%("%N%")%_gradient", 0, 1, "градиентный цвет")%%GRADIENT_PANEL%?%
</td></tr>
</table>
