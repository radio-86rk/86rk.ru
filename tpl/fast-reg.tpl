%ERROR_CFG({
	fr_pass1:	"Вы не ввели пароль",
	fr_pass2:	"Ваши пароли не совпадают",
	fr_pass3:	"Пароль должен состоять минимум из восьми символов",
	fr_pass4:	"Пароль содержит запрещенные символы",
	fr_pass5:	"Слишком простой пароль! Придумайте что-нибудь посложнее",
	fr_nick6:	"Ник &laquo;<nick>%PARAM%</nick>&raquo; занят, выберите другой",
	fr_captcha:	"Код с картинки указан неверно",
	fr_code:	"Код регистрации указан неверно",
	fr_secret:	"Не удалось получить секретный код",
	fr_agree1:	"Необходимо принять правила чата",
	fr_agree2:	"Необходимо принять правила регистрации",
	fr_done:	"Регистрация прошла успено"
})%
<fast-reg>
<h3>БЫСТРАЯ РЕГИСТРАЦИЯ</h3>
<div><div>Ник:</div><div>%input("", "%NICK%", 0, 0, "class=inp readonly")%</div></div>
<div><div>Пароль:</div><div>%input("pass1", "", 0, 0, "class=inp type=password")%</div></div>
<div><div>Секретный e-mail <span>(для восстановления забытого пароля)</span>:</div><div>%input("secret_email", "", 42, 0, "class=inp")%</div></div>
<div><div>Пароль еще раз:</div><div>%input("pass2", "", 0, 0, "class=inp type=password")%</div></div>
<div><div>Пол:</div><div class=sex>%radio("uf[Sex]", 0, { 1: "мужской", 2: "женский" })%</div></div>
<div>%?%ACTIVATE_CAPTCHA%<div>Введите число на картинке:</div><div class=captcha>%input("captcha", "", 0, 10, "class=inp")% %CAPTCHA(0, 3, 2)%</div>?%</div>
<div>%?%ACTIVATE_CODE%<div>Код регистрации <span>(выдается администратором)</span>:</div><div>%input("code", "", 0, 10, "class=inp")%</div>?%</div>
<div class=argee>
%checkbox("agree1", 0, 0, "")% Я принимаю <a class=ctrl name=rules>правила чата</a> и буду их соблюдать.
<br>
%checkbox("agree2", 0, 0, "")% Я принимаю <a class=ctrl name=reg_rules>правила регистрации</a> и буду их соблюдать.
</div>
%submit("done", "ГОТОВО", "", "class=btn")%
</fast-reg>
