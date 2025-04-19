<!DOCTYPE html>
<html>
<head>
<title>Блокировка</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<style>
div>span {
	font-weight: bold;
}
</style>
</head>

<body>
Доступ в чат вам закрыт.
<br><br>
<div>Киллер: <span><?= $_GET ['killer'] ?></span></div>
<div>Период: <span><?= $_GET ['period'] ?></span></div>
<div>Причина: <span><?= $_GET ['reason'] ?></span></div>
</body>
</html>
