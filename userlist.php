<?php
	require "include/august.inc.php";

	$ID      = (IS_POST and isset ($_POST ['id'])) ? august_safe_str ($_POST ['id']) : "";
	$FN      = august_get_fn ();
	$WW      = [ 'who' => 'online', 'whowas' => 'offline', 'online' => 'online', 'offline' => 'offline' ];
	$FN      = $WW [$FN];  //  for expr. [...][idx] php5.5+ required
	if (IS_POST and isset ($_POST ['d']))
		$_SERVER ['QUERY_STRING'] .= "&d={$_POST ['d']}";
	if (!$FN)
		exit;
?>
<!DOCTYPE html>
<html class=app-chat-html>
<head>
<base href="<?= august_get_base () ?>">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<script defer src="js/august.js?<?= VERSION  ?>"></script>
<script src="js/august.userlist.js?<?= VERSION  ?>"></script>
<script src="js/init.js.php?<?= $_SERVER ['QUERY_STRING'] ?>"></script>
<script>
INIT.FUNC = "<?= $FN ?>"
INIT.ID = "<?= $ID ?>"
</script>
</head>

<body></body>
</html>
