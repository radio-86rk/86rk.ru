<avatar>
<center>Аватарка</center>
<img name=avatar width=%AVATAR_WIDTH% height=%AVATAR_HEIGHT%>
<div class="info clear">
Загрузите готовую аватарку со своего компьютера, либо используйте инструмент "обрезка"
для получения аватарки из фотографии.<br>
Размер загруженной аватарки будет изменен до %AVATAR_WIDTH%&times;%AVATAR_HEIGHT% пикселов.
</div>
<div class=ctrl>
<a name=avatar_del class=btn>Удалить</a>
|
<a name=avatar class=btn>Загрузить</a>
|
<a name=cropper class=btn>Обрезать картинку</a>
</div>
</avatar>
<cropper>
<h3 class=clear>
СОЗДАНИЕ АВАТАРКИ
<btn name=cropper_close class="close fright"></btn>
<btn name=cropper_ok class="ok fright"></btn>
</h3>
<div class=ctrl>
<crop-preview></crop-preview>
<div class=bcs>
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
</div>
<div class=fcu>
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
</fieldset>
<fieldset>
<legend>Преобразования</legend>
<a name=cropper_expand expand=5 class=svg title="увеличить размер выреза">
<svg viewBox="0 0 20 20">
<path d="M20 9.2v1.6c0 .6-.4 1-1 1h-7.2V19c0 .5-.5 1-1 1H9.2c-.5 0-1-.5-1-1v-7.2H1c-.5 0-1-.5-1-1V9.2c0-.5.5-1 1-1h7.2V1c0-.5.5-1 1-1h1.6c.6 0 1 .4 1 1v7.2H19c.5 0 1 .5 1 1z"/>
</svg>
</a>
<a name=cropper_expand expand=-5 class=svg title="уменьшить размер выреза">
<svg viewBox="0 0 20 20">
<path d="M19 11.8H1c-.6 0-1-.4-1-1V9.2c0-.6.4-1 1-1h18c.5 0 1 .4 1 1v1.6c0 .6-.4 1-1 1z"/>
</svg>
</a>
<a name=cropper_rotate90 class=svg title="повернуть по часовой">
<svg viewBox="0 0 100 100">
<path d="M15.7 82c-17.5-18.8-17-47.6 1.1-65.8C35.1-2 65.1-2 83.5 16.3 99.1 32 101.7 56.4 90 74.9l10.2 10.2L66 86.5l1.5-34.2 10.2 10.2c5.2-11.2 2.9-24.9-6.1-34-11.8-11.8-30.8-11.7-42.5 0-11.7 11.5-12 29.8-1 41.8l2.9 3.3-12 12-3.3-3.6z"/>
</svg>
</a>
<a name=cropper_rotate270 class=svg title="повернуть против часовой">
<svg viewBox="0 0 100 100">
<path d="M81.1 85.5l-12-12 2.9-3.3c11-12 10.7-30.3-.8-41.8-11.7-11.7-30.8-11.8-42.5 0-9.1 9.1-11.3 22.7-6.1 34l10.2-10.2 1.5 34.2L.1 85l10.2-10.2C-1.6 56.4 1 32 16.6 16.3 35-2 65-2 83.3 16.3c18.1 18.1 18.6 47 1.1 65.8l-3.3 3.4z"/>
</svg>
</a>
</fieldset>
<fieldset>
<a name=cropper_upload class=svg title="загрузить">
<svg viewBox="0 0 100 93.5">
<path fill="#707274" d="M100 93.5H0V57.9h15.1v20.5h69.8V57.9H100v35.6z"/>
<path fill="#606060" d="M21 93.5s61-2.2 79-22.1v22.1H21z"/>
<path fill="#3966a5" d="M33.2 31.3v37.4h33.6V31.3h14.5L50 0 18.7 31.3h14.5z"/>
<path fill="#2d568e" d="M33.2 68.7s28-3.7 33.7-17v17H33.2z"/>
<path fill="#5272b0" d="M28.3 24.4L50 2.4l4.5 4.2c0-.1-7.8 2.5-26.2 17.8z"/>
</svg>
</a>
</fieldset>
</div>
</div>
<hr>
<crop-holder error="Ошибка картинки"></crop-holder>
</cropper>
