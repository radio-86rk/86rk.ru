<?php require "include/august.inc.php"; ?>
<!DOCTYPE html>
<html>
<head>
<base href="<?= august_get_base () ?>">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<script defer src="js/august.js?<?= VERSION  ?>"></script>
<script defer src="js/august.people.js?<?= VERSION  ?>"></script>
<script src="js/init.js.php?<?= $_SERVER ['QUERY_STRING'] ?>"></script>
<script>
INIT.SESS	= "<?= dechex (hexdec (@$_GET ['sess'] ?: @$_POST ['sess'])) ?>";
INIT.ID2	= <?= intVal (@$_GET ['id2'] ?: @$_POST ['id2']) ?>;
INIT.PROFILE	= <?= intVal (@$_GET ['profile'] ?: @$_POST ['profile']) ?>;
INIT.NICKID	= "<?= dechex (hexdec (@$_GET ['nickid'])) ?>";
INIT.NICK	= "<?= august_safe_str (@$_GET ['nick'] ?: @$_POST ['nick']) ?>";
INIT.FUNC	= "<?= august_get_fn ("people", "info|form|search|list|lock|lost|top|birthday|index") ?: "index" ?>";
<?php if (isset ($_GET ['restore'])): ?>
INIT.RESTORE	= "<?=  august_safe_str ($_GET ['restore']) ?>";
<?php endif ?>
</script>
</head>

<body></body>
</html>
