<div>
%?<mps-bb-btn data-bb=b data-key="^b" tooltip="жирный текст"></mps-bb-btn>%STYLE%?%
%?<mps-bb-btn data-bb=i data-key="^i" tooltip="наклонный текст"></mps-bb-btn>%STYLE%?%
%?<mps-bb-btn data-bb=u data-key="^u" tooltip="подчеркнутый текст"></mps-bb-btn>%STYLE%?%
%?<mps-bb-btn data-bb=s data-key="^d" tooltip="зачеркнутый текст"></mps-bb-btn>%STYLE%?%
%?<mps-bb-btn data-bb=sub tooltip="нижний индекс"></mps-bb-btn>%INDEX%?%
%?<mps-bb-btn data-bb=sup tooltip="верхний индекс"></mps-bb-btn>%INDEX%?%
%?<mps-bb-btn data-bb=hr data-key="^h" data-n=1 data-e=1 tooltip="горизонтальная линия"></mps-bb-btn>%LINE%?%
%?<mps-bb-btn data-bb=left data-n=1 data-key="^[" tooltip="выравнивание по левому краю"></mps-bb-btn>%JUSIFY%?%
%?<mps-bb-btn data-bb=center data-n=1 data-key="^\" tooltip="выравнивание по центру"></mps-bb-btn>%JUSIFY%?%
%?<mps-bb-btn data-bb=right data-n=1 data-key="^]" tooltip="выравнивание по правому краю"></mps-bb-btn>%JUSIFY%?%
%?<mps-bb-btn data-bb=columns data-n=1 data-key="~c" tooltip="разбить на колонки"></mps-bb-btn>%JUSIFY%?%
%?<mps-bb-btn data-bb=indent data-n=1 tooltip="отступ"></mps-bb-btn>%INDENT%?%
%?<mps-bb-btn data-bb=list data-n=1 data-key="~u" tooltip="ненумерованный список"></mps-bb-btn>%LIST%?%
%?<mps-bb-btn data-bb=list data-n=1 data-key="~o" data-a=1 tooltip="нумерованный список"></mps-bb-btn>%LIST%?%
%?<mps-bb-btn data-bb=img data-key="~i" tooltip="вставить картинку"></mps-bb-btn>%IMAGE%?%
%?<mps-bb-btn data-bb=youtube data-key="~y" tooltip="вставить видео из YOUTUBE"></mps-bb-btn>%MEDIA%?%
%?<mps-bb-btn class=invisible data-bb=video data-key="~v"></mps-bb-btn>%MEDIA%?%
%?<mps-bb-btn data-bb=music data-key="~m" tooltip="вставить музыку"></mps-bb-btn>%MEDIA%?%
%?<mps-bb-btn data-func=attach data-key="~a" tooltip="вложить картинку"></mps-bb-btn>%ATTACHMENT%?%
<mps-bb-btn data-func=smiles data-key="~s" tooltip="смайлики"></mps-bb-btn>
<mps-bb-btn data-bb=quote data-key="^q" data-n=1 tooltip="цитата"></mps-bb-btn>
<mps-bb-btn data-bb=spoiler data-key="^s" data-n=1 tooltip="спойлер"></mps-bb-btn>
<mps-bb-btn class=invisible data-func=close-tag data-key="^/"></mps-bb-btn>
%?<mps-bb-btn data-func=color tooltip="цвет текста или фона"></mps-bb-btn>%COLOR%?%
%?%FONT%
<select data-bb=font>
<option selected>шрифт
<option class=andale-mono>Andale Mono
<option class=arial>Arial
<option class=arial-black>Arial Black
<option class=book-antiqua>Book Antiqua
<option class=comic-sans-ms>Comic Sans MS
<option class=courier>Courier
<option class=courier-new>Courier New
<option class=fixedsys>Fixedsys
<option class=georgia>Georgia
<option class=impact>Impact
<option class=lucida-console>Lucida Console
<option class=system>System
<option class=tahoma>Tahoma
<option class=times-new-roman>Times New Roman
<option class=trebuchet-ms>Trebuchet MS
<option class=verdana>Verdana
</select>
?%
%?%SIZE%
<select data-bb=size>
<option selected>размер
<option>1<option>2<option>3<option>4<option>5<option>6<option>7<option>8
</select>
?%
<!--
<mps-bb-btn data-func=undo tooltip="undo"></mps-bb-btn>
<mps-bb-btn data-func=redo tooltip="redo"></mps-bb-btn>
-->
%?%COLOR%
<mps-colorpicker data-colorset="
#61bd6d:#1abc9c:#54acd2:#2c82c9:#9365b8:#475577:#ffff00:#00ffff:
#41a85f:#00a885:#3d8eb9:#2969b0:#553982:#28324e:#00ff00:#0000ff:
#f7da64:#fba026:#eb6b56:#e25041:#efefef:#d1d5d8:#ffffff:#ff00ff:
#fac51c:#f37934:#d14841:#b8312f:#a38f84:#7c706b:#ff0000:#000000
">
<clr-sw data-bb=color>color</clr-sw>
<clr-sw data-bb=hl>highlight</clr-sw>
</mps-colorpicker>
?%
</div>
<mps-bb-btn data-func=help tooltip="справка по кодам"></mps-bb-btn>
