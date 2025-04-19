<div id=title class=title>ВОССТАНОВЛЕНИЕ ПАРОЛЯ</div>
<section>
<error>
%?Вы не ввели пароль.%ERROR1%?%
%?Ваши пароли не совпадают.%ERROR2%?%
%?Пароль должен состоять минимум из восьми символов.%ERROR3%?%
%?Пароль содержит запрещенные символы.%ERROR4%?%
%?Слишком простой пароль!<br>Придумайте что-нибудь посложнее.%ERROR5%?%
</error>
<nicklist></nicklist>
<div>Пароль:</div><div>%input("pass1", "", 42, 0, "class=inp type=password autofocus")%</div>
<div>Пароль еще раз:</div><div>%input("pass2", "", 42, 0, "class=inp type=password")%</div>
</section>
<div class=btns>
%button("cancel", "ОТМЕНА")%
%button("done", "ГОТОВО")%
</div>
