<?php
	require "include/august.inc.php";
	if (ACCESS_LOG) {
		require "include/crawlers.inc.php";
		if (!crawlers::get ()::is_crawler ("../logs/86rk-crawlers.log"))
			crawlers::put_into_logfile ("../logs/86rk-access.log");
	}
	if ($_SERVER ['HTTP_HOST'] != "86rk.ru") {
		header ("Link: <https://86rk.ru/>; rel=\"canonical\"");
	}
?>
<!doctype html>
<html class=app-mps-html>
<head>
<title>Радио-86РК</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta name="keywords" content="Радио-86РК, ретрокомпьютеры, retrocomputers, 8-bit computers, i8080, i8085, Z80, assembler, disassembler, 580ВМ80, ассемблер, дизассемблер">
<meta name="description" content="Радио-86РК. Ретрокомпьютеры. Ассемблер, дизассемблер 580ВМ80, i8080, i8085, Z80">
<link rel="shortcut icon" href="favicon.ico">
<link rel="icon" href="favicon.png" type="image/png" sizes="120x120">
<script defer src="js/august.js?<?= VERSION  ?>"></script>
<script defer src="js/86rk.js?<?= VERSION  ?>"></script>
<script src="js/init-mps.js.php?mps=86rk"></script>
</head>

<body></body>
</html>
