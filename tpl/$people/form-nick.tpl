<div id=title class=title>НИКИ / ПАРОЛЬ</div>
<section>
<error>
%?Вы не ввели пароль.%ERROR1%?%
%?Ваши пароли не совпадают.%ERROR2%?%
%?Пароль должен содержать минимум восемь символов.%ERROR3%?%
%?Пароль содержит запрещенные символы.%ERROR4%?%
%?Слишком простой пароль!<br>Придумайте что-нибудь посложнее.%ERROR5%?%
%?Неверный пароль%ERROR_PASS%?%
%?Не так быстро!%ERROR_FAST%?%
%?Слишком короткий ник.%ERROR_NICK2%?%
%?Слишком длинный ник.%ERROR_NICK3%?%
%?Недопустимый символ в нике.%ERROR_NICK4%?%
%?Вы не можете больше добавить себе ник.%ERROR_NICK5%?%
%?:&Ник &laquo;<b>%ERROR_PARAM%</b>&raquo; занят, выберите другой.%ERROR_NICK6%?%
%?У вас отсутствуют ники.%ERROR_NICK7%?%
%?Код с картинки указан неверно.%ERROR_CAPTCHA%?%
%?Код регистрации указан неверно.%ERROR_CODE%?%
%?Не удалось получить секретный код.%ERROR_SECRET%?%
%?Слишком большой размер файла аватарки.%ERROR_AVATAR%?%
</error>
%NICKLIST%
%?%TRUE(%PROFILE%)%
<div>Текущий пароль:</div><div>%input("cur_pass", "", 42, 0, "class=inp type=password autofocus")%</div>
<div>Новый пароль <span>(только если хотите сменить)</span>:</div><div>%input("pass1", "", 42, 0, "class=inp type=password")%</div>
<div>Новый пароль еще раз:</div><div>%input("pass2", "", 42, 0, "class=inp type=password")%</div>
%:%
<div>Пароль:</div><div>%input("pass1", "", 42, 0, "class=inp type=password")%</div>
<div>Пароль еще раз:</div><div>%input("pass2", "", 42, 0, "class=inp type=password")%</div>
%?%ACTIVATE_CAPTCHA%
<div>Введите число на картинке:</div><div class=captcha>%input("captcha", "", 0, 10, "class=inp")%%CAPTCHA(0, 5, 5)%</div>
?%
%?%ACTIVATE_CODE%
<div>Код регистрации <span>(выдается администратором)</span>:</div><div>%input("code", "", 0, 10, "class=inp")%</div>
?%
?%
<div>Секретный e-mail:</div>
<div>
%input("secret_email", "", 42, 0, "placeholder='%SECRET_EMAIL%' class=inp")%
<span class=secret-email>
Укажите секретный e-mail, чтобы иметь возможность восстановить доступ к своей анкете
на случай, если Вы когда-нибудь забудете пароль. На секретный e-mail высылается
инструкция для восстановления доступа. Секретный e-mail не отображается в анкете.
</span>
</div>
%AVATAR%
%ACCESS%
</section>
<div class=btns>
%button("cancel", "ОТМЕНА")%
%button("section", "&#xab; НАЗАД", "", "section=photo action=prev")%
%button("done", "ГОТОВО")%
</div>
