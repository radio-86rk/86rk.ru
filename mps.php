<?php require "include/august.inc.php"; ?>
<!DOCTYPE html>
<html class=app-mps-html>
<head>
<base href="<?= august_get_base () ?>">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<script defer src="js/august.js?<?= VERSION  ?>"></script>
<script defer src="js/august.mps-loader.js?<?= VERSION  ?>"></script>
<script src="js/init-mps.js.php?<?= $_SERVER ['QUERY_STRING'] ?>"></script>
</head>

<body></body>
</html>
