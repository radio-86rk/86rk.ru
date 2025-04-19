<h3>Восстановление пароля</h3>
<hr>
<div class=email>
%?%EQ("%ERROR%", "NO_EMAIL")%
<div>Секретный e-mail не указан.</div>
%:%%?%EQ("%ERROR%", "SEND")%
<div>Не удалось отправить письмо.</div>
%:%%?:1%EQ("%ERROR%", "SUSPEND")%%?
<div>Повторно отправить письмо можно будет после %DATE(%SUSPEND%, "HH:ii:ss")%.</div>
?%%:%
%?%TRUE(%SUSPEND%)%
<div>
Письмо выслано.
</div>
%:%
<div>
Для восстановления пароля будет выслано письмо с инструкцией
на секретный e-mail, указаный при регистрации.
</div>
?%
%?
<div>
<hr>
Последний раз письмо для восстановления пароля было выслано
%DATE(%EMAIL_SENT%, "d mmmg yyyy года в HH:ii:ss")%.
</div>
?%
?%?%?%
</div>
<hr>
%?%TRUE("%ERROR%")%%TRUE(%SUSPEND%)%
%button("close", "OK", "", "class=w100")%
%:%
<div align=right><a class=btn name=close>закрыть</a></div>
<hr>
%button("email_send", "Выслать", "", "class=w100")%
?%
