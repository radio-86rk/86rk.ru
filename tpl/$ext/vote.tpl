<table class=t cellpadding=0 cellspacing=0>
<tr><th colspan=8>..:: голосование ::..</th></tr>
</table>
<div class=vote>
%?
Вы начинаете голосование за помещение пользователя %NICK% в тотальный игнор.
У остальных в окне появится сообщение:
<chat-chat>%VOTE_NOTICE%</chat-chat>
Если голосование пройдет с положительным результатом, пользователь %NICK% помещается в тотальный игнор
на %TOTAL_TIME% и его могут увидеть только те, кто сам уберет его из своего личного игнора.
<hr>
?%
<chat-chat>%TEXT%</chat-chat>
<hr>
<div align=center>
%?%START%
..:: <a name=ctrl class=ctrl data-a=vote data-id=%ID% data-cmd=1>Да, заигнорировать</a> ::..
..:: <a name=ctrl class=ctrl data-a=close-win2>Нет, я ошибся</a> ::..
%:%
..:: <a name=ctrl class=ctrl data-a=vote data-id=%ID% data-cmd=1>Я за игнор</a> ::..
..:: <a name=ctrl class=ctrl data-a=vote data-id=%ID% data-cmd=2>Я против игнора</a> ::..
?%
</div>
</div>
