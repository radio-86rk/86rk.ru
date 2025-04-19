%WINDOW_TITLE("ЛЮДИ ЧАТА")%
<div class="content people index menu">
<div class=title>ЛЮДИ ЧАТА</div>

<div class=total>Всего анкет: %TOTAL%</div>

<notice>
%?Ник &#x25;("%?&laquo;<b>%NICK%</b>&raquo;?%")&#x25; не зарегистрирован.%AUTH0%?%
%?Ошибка авторизации.%AUTH3%?%
%?Ошибка сессии, обновите окно.%AUTH4%?%
%?Данные в анкете обновлены.%FORM_OK%?%
%?Секретный ключ недостоверный.%FORM_KEY%?%
%?Слишком много ошибок.%FORM_FAIL%?%
%?Системная ошибка.%FORM_SYSTEM%?%
</notice>

<div class=form>
<fieldset>
<legend>Поиск анкеты</legend>
<div>
Ник:
%input("info_nick", "", 20, 40, "class=inp tabindex=1")%
<a class=btn name=search>Расширенный поиск</a>
<br>
%button("info", "Поиск", "", "class=w100 tabindex=-1")%
</div>
</fieldset>
<fieldset>
<legend>Изменить анкету</legend>
<div>
Ник:
%input("nick", "", 20, 40, "class=inp tabindex=2")%
Пароль:
%input("pass", "", 20, 0, "class=inp type=password tabindex=3")%
<br>
%button("login", "Редактировать", "", "class=w100 tabindex=-1")%
</div>
</fieldset>
</div>
<br>

%?
<div class=total>Новички: %TOTAL_NEW%</div>
<table class="list stripy" cellspacing=0 cellpadding=0>
<col width=50%><col width=50%>
{{{:LIST_NEW:2
%?%CC(1)%<tr>?%
%?
<td><a nickid=%NICKID%%? photo=%PHOTO%?%>%NICK%</a>
%:%
<td colspan=2>
?%
%?%CC(2)%</tr>?%
}}}
<tr><th colspan=2 class=line></tr>
</table>
?%

%?
<div class=total>Ожидающие проверки: %TOTAL_WAIT%</div>
<table class="list stripy" cellspacing=0 cellpadding=0>
<col width=50%><col width=50%>
{{{:LIST_WAIT:2
%?%CC(1)%<tr>?%
%?
<td>%?:&%MODER%<a nickid=%NICKID%%? photo=%PHOTO%?%>%NICK%</a>%:%<b>%NICK%</b>?%
%:%
<td colspan=2>
?%
%?%CC(2)%</tr>?%
}}}
<tr><th colspan=2 class=line></tr>
</table>
?%

%INCLUDE("menu")%

</div>
