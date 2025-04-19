<div id=title class=title>ФОТОАЛЬБОМЫ</div>
<section>
%?%DENY_PHOTO%
<deny>
ЗАПРЕЩЕНО
</deny>
%:%
<error>
%?ОШИБКА! Неверный формат файла.%PHOTO1%?%
%?ОШИБКА! Такая фотография уже существует.%PHOTO2%?%
%?ОШИБКА! Слишком маленький размер фотографии.%PHOTO3%?%
%?ОШИБКА! Невозможно загрузить фотографию.%PHOTO4%?%
%?ОШИБКА! Слишком тяжелая фотография.%PHOTO5%?%
%?ОШИБКА! Слишком много фотографий.%PHOTO6%?%
%?Файл <b>%FILE%</b>?%
</error>
?%

<ul class=album-menu>
<li><a name=album_menu action=info>ИНФОРМАЦИЯ</a></li>
<li><a name=album_menu action=access>ДОСТУП</a>
<tip>
Настраивается уровень доступа к текущему фотоальбому.
<br>
Доступ к фотоальбому "для избранных" включается в секции "Доступ к разделам моей анкеты"
в анкетах других пользователей.
</tip>
</li>
<li><a name=album_menu action=upload>ЗАГРУЗИТЬ ФОТО</a>
<tip>
Фотки можно перетаскивать с вашего компьютера в это окно, несколько за раз.
<br>
Фотки должны быть в формате <b>.jpg</b>, <b>.png</b> или <b>.webp</b>,
суммарный размер одновременно загружаемых файлов не должен превышать 10 мегабайт.
</tip>
</li>

<li id=album_info>
<div>
<h4>Обложка</h4>
<thumb>
<img>
<a class="btn s110 fleft" name=album_thumb action=prev>&#9664;</a>
<a class="btn s110 fright" name=album_thumb action=next>&#9654;</a>
</thumb>
</div>
<div>
<h4>Название альбома</h4>
%input("album_name", "", 0, 50, "class=inp")%
<h4>Описание альбома</h4>
%text("album_descr", "", 0, 5, 0, "class=inp")%
</div>
%button("album_ok", "OK", "", "class=w100")%
</li>
<li id=album_access>
<div>
%radio("album_access", 'a', {
	a: "для всех",
	r: "для зарегистрированных",
	s: "для избранных",
	x: "недоступен"
})%
</div>
<userlist></userlist>
%button("album_ok", "OK", "", "class=w100")%
</li>
</ul>

<album-list name=album_list>
<item>Неразобранные фотки</item>
<item name=album_create new="[ без названия ]">Новый фотоальбом</item>
</album-list>

<thumbs empty="[ Фотографии отсутствуют ]"></thumbs>
<ul class=album-menu>
<li><a name=album_menu action=combine>ОБЪЕДИНИТЬ</a>
<tip>
Объединяет фотографии двух фотоальбомов.
<br>
При этом, фотографии в неактивном фотоальбоме (нижняя панель) удаляются.
</tip>
</li>
<li><a name=album_menu action=exchange>ОБМЕНЯТЬ</a>
<tip>
Меняет местами активный (верхняя панель) и неактивный (нижняя панель) фотоальбомы.
</tip>
</li>
</ul>
</section>

<div class=btns>
%button("cancel", "ОТМЕНА")%
%button("section", "&#xab; НАЗАД", "", "section=section3 action=prev")%
%button("section", "ДАЛЕЕ &#xbb;", "", "section=nick action=next")%
</div>

<photo>
<div id=photo_img></div>
<div class=photo-btns>
<a class="btn stroke" name=photo_page action=prev>&#9664;&#9664;</a>
<div><span id=photo_num></span> / <span id=photo_count></span></div>
<a class="btn stroke" name=photo_page action=next>&#9654;&#9654;</a>
</div>
<div class=comment>
%text("comment", "", 0, 4, 0, "class=inp placeholder='[--комментарий--]'")%
</div>
%button("photo_page", "OK", "", "class=w100 action=ok")%
</photo>

<progress-bar></progress-bar>
