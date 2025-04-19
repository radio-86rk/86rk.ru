<div-hdr>Авторизация</div-hdr>
<inp-cell class=login>%input("name", "", 0, 50, "class=inp placeholder='Логин'")%</inp-cell>
<inp-cell class=pass>%input("pass", "", 0, 50, "class=inp type=password placeholder='Пароль'")%</inp-cell>
<inp-cell class=empty>%checkbox("keep", 1, "", "запомнить авторизацию")%</inp-cell>
<inp-cell class=empty>%checkbox("bind", 1, "", "привязать авторизацию к IP")%</inp-cell>
<div class=flex>
<div>%button("reg", "Регистрация")%</div>
<div>%button("cancel", "Не войти")%%button("auth", "Войти")%</div>
</div>
