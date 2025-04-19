<h3>Настройки дневника</h3>
<hr>
<div class=panel id=__scroll>
<table width=100% cellspacing=0 cellpadding=0>
<col width=50%><col width=50%>
<tr>
<td>Максимальная длина сообщения:</td>
<td>%input("MaxMessLen", %MaxMessLen%, 10, 10)% символов</td>
</tr>
<tr>
<th colspan=2>Комментарии</th>
</tr>
<tr>
<td>Доступ на запись комментариев:</td>
<td>
%radio("AccessComment", %AccessComment%, { 0: "доступно всем", 1: "только зарегистрированным", "-1": "доступ закрыт" })%
%?
<h4 class=group>доступ открыт только группе:</h4>
%radio("AccessComment", %AccessComment%, %?%GROUPLIST("%GROUP_NAME% (%GROUP_COUNT%)")%?%)%
?%
</td>
</tr>
<tr>
<td>Время на комментарии:</td>
<td>
%input("CommentsDays", %CommentsDays%, 5, 5)% дней<br>
%input("CommentsHours", %CommentsHours%, 5, 5)% часов
</td>
</tr>
<tr>
<td>Смайлики:</td>
<td>
%checkbox("Smiles", %Smiles%, 1, "разрешено")%
%checkbox("OneSmile", %OneSmile%, 1, "отключить повторяющиеся")%
%checkbox("CutSmiles", %CutSmiles%, 1, "вырезать лишние смайлики")%
%input("MaxSmiles", %MaxSmiles%, 5, 5)% 0 &ndash; без ограничений
</td>
</tr>
<tr>
<td>Премодерация сообщений:</td>
<td>
%radio("PreModeration", %PreModeration%, ["отключена", "жесткая", "мягкая"])%
%checkbox("PreModerationEdited", %PreModerationEdited%, 1, "премодерация отредактированных")%
%checkbox("AutoAccept", %AutoAccept%, 1, "автопринятие сообщений")%
</td>
</tr>
<tr>
<td>Автопроверка сообщений:</td>
<td>
%checkbox("Matotester", %Matotester%, 1, "матотестер")%
%checkbox("Censor", %Censor%, 1, "автоцензор")%
</td>
</tr>
<tr>
<td>Время на редактирование:</td>
<td>
%input("EditDays", %EditDays%, 5, 5)% дней<br>
%input("EditHours", %EditHours%, 5, 5)% часов
</td>
</tr>
<tr>
<th colspan=2>Антифлуд</th>
</tr>
<tr>
<td>Минимальный интервал постинга:</td>
<td>%input("PostInterval", %PostInterval%, 5, 3)% минут</td>
</tr>
<tr>
<td>Частота сообщений с одного компьютера:</td>
<td>
%input("MessPerHour1", %MessPerHour1%, 5, 3)% в час<br>
%input("MessPerDay1", %MessPerDay1%, 5, 3)% в день
</td>
</tr>
<tr>
<td>Частота сообщений всего:</td>
<td>
%input("MessPerHour", %MessPerHour%, 5, 3)% в час<br>
%input("MessPerDay", %MessPerDay%, 5, 3)% в день
</td>
</tr>
<tr>
<th colspan=2>Форматирование текста</th>
</tr>
<tr>
<td>
%checkbox("TF", %TF_FONT_SET%, %TF_FONT%, "шрифт (FONT)")%
%checkbox("TF", %TF_SIZE_SET%, %TF_SIZE%, "размер текста (SIZE)")%
%checkbox("TF", %TF_COLOR_SET%, %TF_COLOR%, "цвет текста (COLOR, HL)")%
%checkbox("TF", %TF_STYLE_SET%, %TF_STYLE%, "стиль текста (B, I, U, S)")%
%checkbox("TF", %TF_HEADING_SET%, %TF_HEADING%, "заголовки (H1 ... H6)")%
%checkbox("TF", %TF_INDEX_SET%, %TF_INDEX%, "индексы (SUB, SUP)")%
%checkbox("TF", %TF_JUSIFY_SET%, %TF_JUSIFY%, "выравнивание (LEFT, RIGHT, ...)")%
</td>
<td>
%checkbox("TF", %TF_INDENT_SET%, %TF_INDENT%, "отступ (INDENT)")%
%checkbox("TF", %TF_LINE_SET%, %TF_LINE%, "горизонтальная линия (HR)")%
%checkbox("TF", %TF_LIST_SET%, %TF_LIST%, "списки (LIST)")%
%checkbox("TF", %TF_IMAGE_SET%, %TF_IMAGE%, "картинки (IMG)")%
%checkbox("TF", %TF_MEDIA_SET%, %TF_MEDIA%, "музыка и видео (MUSIC, YOUTUBE)")%
%checkbox("TF", %TF_MAP_SET%, %TF_MAP%, "карты (MAP)")%
%checkbox("TF", %TF_ROLLING_SET%, %TF_ROLLING%, "бегущий цвет текста (ROLLING)")%
</td>
</tr>
</table>
</div>
<hr>
%button("cfg_blog_save", "OK", "", "class=w100")%
