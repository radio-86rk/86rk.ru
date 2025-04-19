<h4>КОНВЕРТЕР ТЕКСТА</h4>
<cnv-text class=page>
<div>
<span>&nbsp;</span>
<div id=text_from empty-text="текст в кодировке utf-8" contenteditable=true spellcheck=false></div>
</div>
<div>
<span>Длина текста, символов: <span id=text_length></span></span>
<div id=text_to empty-text="текст для компьютера РАДИО-86РК"></div>
</div>
</cnv-text>

<cnv-text-ctrl>
<div>
<a name=text_from_clipboard class=btn>вставить из буфера обмена</a>
<a name=text_upload class=svg title="загрузить текст">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100,93.5H0V57.9h15.1v20.5h69.8V57.9H100V93.5z"/>
<path fill="#3966A5" d="M33.2,31.3v37.4h33.6V31.3h14.5L50,0L18.7,31.3H33.2z"/>
</svg>
</a>
</div>
<div>
<a name=text_to_clipboard class=btn>скопировать в буфер обмена</a>
<a name=text_download class=svg title="выгрузить текст">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100,93.5H0V57.9h15.1v20.5h69.8V57.9H100V93.5z"/>
<path fill="#3966A5" d="M66.8,37.4V0L33.2,0v37.4H18.7L50,68.7l31.3-31.3H66.8z"/>
</svg>
</a>
</div>
<div></div>
<div class=pad>
<input type=checkbox id=cnv_case tabindex=-1><label for=cnv_case> учитывать регистр</label>
</div>
</cnv-text-ctrl>

<script id=app_cfg type="text/template">
%CFG({
	ERROR: {
		FROM_CLIPBOARD:	"Не удалось получить данные из буфера обмена.%? %ERROR%?%",
		TO_CLIPBOARD:	"Не удалось записать данные в буфер обмена.%? %ERROR%?%"
	},
	COPIED:		"Сопировано"
})%
</script>
