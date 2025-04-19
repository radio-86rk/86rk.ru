<h4>КОНВЕРТЕР МОНОХРОМНЫХ КАРТИНОК</h4>
<cropper class="screen page">
<div class="ctrl preview">
<crop-preview></crop-preview>
<div class="ready sliders">
<fieldset>
<legend>Яркость: <span id=cropper_bri_val></span></legend>
<div class=slider id=cropper_slider_bri></div>
</fieldset>
<fieldset>
<legend>Контастность: <span id=cropper_con_val></span></legend>
<div class=slider id=cropper_slider_con></div>
</fieldset>
<fieldset>
<legend>Насыщенность: <span id=cropper_sat_val></span></legend>
<div class=slider id=cropper_slider_sat></div>
</fieldset>
<fieldset>
<legend>Фильтр</legend>
<a name=cropper_filter matrix="-1, -1, -1, -1, 24, -1, -1, -1, -1" class=svg title="резкость">
<svg viewBox="0 0 100 100">
<path d="M49,0l30.5,100h-61L49,0z"/><path fill="#fff" d="M53.2,38.1L69.7,92H58.5L53.2,38.1z"/>
</svg>
</a>
<a name=cropper_filter matrix="0, 1, 0, 1, 1, 1, 0, 1, 0" class=svg title="размытие">
<svg viewBox="0 0 100 100">
<path d="M50,100c-16.8,0-30.4-13.7-30.4-30.4C19.6,54.5,44.1,10.4,50,0c5.9,10.4,30.4,54.5,30.4,69.6C80.4,86.3,66.8,100,50,100z"/>
<path stroke="#fff" stroke-width="9" stroke-linecap="round" d="M67.4,69.6C67.4,79.2,59.6,87,50,87"/>
</svg>
</a>
<a name=cropper_filter matrix="-2, -1, 0, -1, 1, 1, 0, 1, 2" class=svg title="тиснение">
<svg viewBox="0 0 100 100">
<path d="M0 29.8V70l25.4 25.4h49.2L100 70.1V29.8L74.6 4.6H25.4m3.1 7.7h42.9l19.3 19.2-19.2 19.1h-43L9.3 31.5l19.2-19.2z"/>
</svg>
</a>
<a name=cropper_filter matrix="-1, -1, -1, -1, 8, -1, -1, -1, -1" class=svg title="края">
<svg viewBox="0 0 100 100">
<path d="M70.7 2.7l-3 3-4.4-4.4c-1.6-1.6-4.3-1.6-5.9 0L1.2 57.4c-1.6 1.6-1.6 4.3 0 5.9l4.4 4.4-3 3C1 72.3 1 75 2.6 76.6
l20.7 20.7c1.6 1.6 4.3 1.6 5.9 0l3-3 4.4 4.4c1.6 1.6 4.3 1.6 5.9 0l56.2-56.2c1.6-1.6 1.6-4.3 0-5.9l-4.4-4.4 3-3
c1.6-1.6 1.6-4.3 0-5.9L76.6 2.7c-1.6-1.6-4.3-1.6-5.9 0zm12.6 21.4c.8.8.8 2.1 0 3-.8.8-2.1.8-3 0l-2.2-2.2-2.2 2.2
v7.4h-4.4l-3.9 3.9c.4.1.7.2 1 .5l3 3c.8.8.8 2.1 0 3s-2.1.8-3 0l-3-3c-.3-.3-.4-.6-.5-1l-7 7c.7 2.8 0 5.9-2.1 8
s-5.3 2.9-8 2.1l-8.4 8.4c.4.1.7.2 1 .5l3 3c.8.8.8 2.1 0 3-.8.8-2.1.8-3 0l-3-3c-.3-.3-.4-.6-.5-1l-2.4 2.4v4.4h-7.4
l-2.2 2.2 2.2 2.2c.8.8.8 2.1 0 3-.8.8-2.1.8-3 0l-7.4-7.4c-.8-.8-.8-2.1 0-3 .8-.8 2.1-.8 3 0l2.2 2.2 2.2-2.2v-7.4
h4.4l2.4-2.4c-.4-.1-.7-.2-1-.5l-3-3c-.8-.8-.8-2.1 0-3 .8-.8 2.1-.8 3 0l3 3c.3.3.4.6.5 1L42 52c-.7-2.8 0-5.9 2.1-8
s5.3-2.9 8-2.1l7-7c-.4-.1-.7-.2-1-.5l-3-3c-.8-.8-.8-2.1 0-3 .8-.8 2.1-.8 3 0l3 3c.3.3.4.6.5 1l3.9-3.9v-4.4h7.4
l2.2-2.2-2.2-2.2c-.8-.8-.8-2.1 0-3 .8-.8 2.1-.8 3 0l7.4 7.4z"/>
</svg>
</a>
<a name=cropper_filter matrix="0, 0, 0, 0, -1, 0, 0, 0, 0" class=svg title="негатив">
<svg viewBox="0 0 50 50">
<path d="M0 0v50h50V0H0zm48 2v46H2l11.7-11.7c-6.2-6.2-6.2-16.4 0-22.6 6.2-6.2 16.4-6.2 22.6 0L48 2zM36.3 13.7L13.7 36.3c6.2 6.2 16.4 6.2 22.6 0s6.3-16.4 0-22.6z"/>
</svg>
</a>
<a name=cropper_flip_h class=svg title="зеркальное отражение по горизонтали">
<svg viewBox="0 0 50 50">
<path d="M23,8.4h4v41h-4V8.4z M0,47.9l19-19L0,9.9V47.9z M4.8,21.3l7.5,7.5l-7.5,7.5V21.3z M38.5,8.6h-4.2v3h9.3v-9h-3.1v3.7C31.5-1.5,17.4-1.3,8.7,7.1l2.2,2.1C18.4,1.9,30.7,1.7,38.5,8.6z M50,47.9v-38l-19,19L50,47.9z M46.8,40.2L35.5,28.9l11.4-11.4V40.2z"/>
</svg>
</a>
<a name=cropper_flip_v class=svg title="зеркальное отражение по вертикали">
<svg viewBox="0 0 50 50">
<path d="M41.6,23v4h-41v-4H41.6z M2.1,0l19,19l19-19H2.1z M28.7,4.8l-7.5,7.5l-7.5-7.5H28.7z M41.4,38.5v-4.2h-3v9.3h9v-3.1h-3.7c7.9-9.1,7.7-23.1-0.7-31.9l-2.1,2.2C48.1,18.4,48.3,30.7,41.4,38.5z M2.1,50h38l-19-19L2.1,50z M9.8,46.8l11.4-11.4l11.4,11.4H9.8z"/>
</svg>
</a>
</fieldset>
</div>
<fieldset class=center-bottom>
<a name=screen class=svg><span>ЭКРАН</span></a>
<a name=cropper class=svg><span>ОБРЕЗКА</span></a>
</fieldset>
</div>

<div class="ctrl operation">
<div class=screen>
<rk-screen></rk-screen>
<div class="fcu sliders">
<fieldset class=col>
<legend class=leg></legend>
<input type=checkbox id=slideshow tabindex=-1>
<label for=slideshow> Слайд-шоу</label>
<input type=checkbox id=slideshow_auto tabindex=-1>
<label for=slideshow_auto> Автопрокрутка</label>
</fieldset>
<span></span>
<fieldset>
<legend>Задержка: <span id=slideshow_delay_val></span> сек</legend>
<div class=slider id=slideshow_delay></div>
</fieldset>
<span></span>
<fieldset class=right>
<a name=slideshow_prev class=svg title="предыдущая картинка">
<svg  viewBox="0 0 20 20">
<path d="M0,10L20,0l-5,10l5,10L0,10z"/>
</svg>
</a>
<a name=slideshow_next class=svg title="следующая картинка">
<svg viewBox="0 0 20 20">
<path d="M20,10L0,20l5-10L0,0L20,10z"/>
</svg>
</a>
<a name=slideshow_move_up class=svg title="переместить картинку вверх">
<svg viewBox="0 0 20 20">
<path d="M10,0l10,20l-10-5L0,20L10,0z"/>
</svg>
</a>
<a name=slideshow_move_down class=svg title="переместить картинку вниз">
<svg viewBox="0 0 20 20">
<path d="M10,20L0,0l10,5l10-5L10,20z"/>
</svg>
</a>
</fieldset>
<span></span>
<fieldset>
<a name=slideshow_add class=svg title="добавить картинку">
<svg viewBox="0 0 20 20">
<path d="M20 9.2v1.6c0 .6-.4 1-1 1h-7.2V19c0 .5-.5 1-1 1H9.2c-.5 0-1-.5-1-1v-7.2H1c-.5 0-1-.5-1-1V9.2c0-.5.5-1
1-1h7.2V1c0-.5.5-1 1-1h1.6c.6 0 1 .4 1 1v7.2H19c.5 0 1 .5 1 1z"/>
</svg>
</a>
<a name=slideshow_del class=svg title="удалить картинку">
<svg viewBox="0 0 20 20">
<path d="M19 11.8H1c-.6 0-1-.4-1-1V9.2c0-.6.4-1 1-1h18c.5 0 1 .4 1 1v1.6c0 .6-.4 1-1 1z"/>
</svg>
</a>
</fieldset>
<span></span>
<fieldset class=counter>
<div>
<span id=slideshow_num>0</span> / <span id=slideshow_size>0</span>
</div>
</fieldset>
</div>
<div class="fcu sliders">
<fieldset class=col id=screen_res>
<input type=radio name=screen_res id=__sr_lbl0 value=0 tabindex=-1>
<label for=__sr_lbl0> 128x60 (Радио-86РК)</label>
<input type=radio name=screen_res id=__sr_lbl1 value=1 tabindex=-1>
<label for=__sr_lbl1> 192x104 (Апогей)</label>
</fieldset>
<span></span>
<fieldset>
<legend>Порог серого: <span id=srceen_threshold_gray_val></span></legend>
<div class=slider id=srceen_slider_threshold_gray></div>
</fieldset>
<span></span>
<fieldset>
<legend>Порог белого: <span id=srceen_threshold_val></span></legend>
<div class=slider id=srceen_slider_threshold></div>
</fieldset>
<span></span>
<fieldset class="col right" id=download_type>
<input type=radio name=download_type id=__dt_lbl0 value=0 tabindex=-1>
<label for=__dt_lbl0> Данные</label>
<input type=radio name=download_type id=__dt_lbl1 value=1 tabindex=-1>
<label for=__dt_lbl1> Вьювер</label>
</fieldset>
<fieldset>
<a name=screen_download class=svg title="выгрузить картинку">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100,93.5H0V57.9h15.1v20.5h69.8V57.9H100V93.5z"/>
<path fill="#3966A5" d="M66.8,37.4V0L33.2,0v37.4H18.7L50,68.7l31.3-31.3H66.8z"/>
</svg>
</a>
</fieldset>
<span></span>
<fieldset>
<a name=screen_upload class=svg title="загрузить картинку">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100,93.5H0V57.9h15.1v20.5h69.8V57.9H100V93.5z"/>
<path fill="#3966A5" d="M33.2,31.3v37.4h33.6V31.3h14.5L50,0L18.7,31.3H33.2z"/>
</svg>
</a>
</fieldset>
</div>
</div>
<div class=holder>
<crop-holder></crop-holder>
<div class=fcu>
<fieldset>
<a name=cropper_expand expand=5 class=svg title="увеличить размер выреза">
<svg viewBox="0 0 20 20">
<path d="M20 9.2v1.6c0 .6-.4 1-1 1h-7.2V19c0 .5-.5 1-1 1H9.2c-.5 0-1-.5-1-1v-7.2H1c-.5 0-1-.5-1-1V9.2c0-.5.5-1
1-1h7.2V1c0-.5.5-1 1-1h1.6c.6 0 1 .4 1 1v7.2H19c.5 0 1 .5 1 1z"/>
</svg>
</a>
<a name=cropper_expand expand=-5 class=svg title="уменьшить размер выреза">
<svg viewBox="0 0 20 20">
<path d="M19 11.8H1c-.6 0-1-.4-1-1V9.2c0-.6.4-1 1-1h18c.5 0 1 .4 1 1v1.6c0 .6-.4 1-1 1z"/>
</svg>
</a>
<a name=cropper_rotate90 class=svg title="повернуть по часовой">
<svg viewBox="0 0 100 100">
<path d="M15.7 82c-17.5-18.8-17-47.6 1.1-65.8C35.1-2 65.1-2 83.5 16.3 99.1 32 101.7 56.4 90 74.9l10.2
10.2L66 86.5l1.5-34.2 10.2 10.2c5.2-11.2 2.9-24.9-6.1-34-11.8-11.8-30.8-11.7-42.5 0-11.7 11.5-12 29.8-1
41.8l2.9 3.3-12 12-3.3-3.6z"/>
</svg>
</a>
<a name=cropper_rotate270 class=svg title="повернуть против часовой">
<svg viewBox="0 0 100 100">
<path d="M81.1 85.5l-12-12 2.9-3.3c11-12 10.7-30.3-.8-41.8-11.7-11.7-30.8-11.8-42.5 0-9.1 9.1-11.3
22.7-6.1 34l10.2-10.2 1.5 34.2L.1 85l10.2-10.2C-1.6 56.4 1 32 16.6 16.3 35-2 65-2 83.3 16.3c18.1
18.1 18.6 47 1.1 65.8l-3.3 3.4z"/>
</svg>
</a>
</fieldset>
<fieldset class=right>
<a name=cropper_upload class=svg title="загрузить картинку">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100,93.5H0V57.9h15.1v20.5h69.8V57.9H100V93.5z"/>
<path fill="#3966A5" d="M33.2,31.3v37.4h33.6V31.3h14.5L50,0L18.7,31.3H33.2z"/>
</svg>
</a>
</fieldset>
</div>
</div>
</div>
</cropper>

<script id=app_cfg type="text/template">
%CFG({
	ERROR: {
		TOO_MANY_PICTURES:	"Слишком много картинок"
	}
})%
</script>
