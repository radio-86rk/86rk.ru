<?php
	require "include/august.inc.php";
	if (ACCESS_LOG) {
		require "include/crawlers.inc.php";
		if (crawlers::get ()::is_crawler ()) {
			require "crawler.html";
			exit;
		}
	}
	$LANG = LANG;
?>
<!doctype html>
<html class=app-chat-html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta name="keywords" content="<?= trim (file_get_contents ("txt/chat-keywords.$LANG.txt")) ?>">
<meta name="description" content="<?= trim (file_get_contents ("txt/chat-descr.$LANG.txt")) ?>">
<script defer src="js/august.js?<?= VERSION  ?>"></script>
<script src="js/august.chat.js?<?= VERSION  ?>"></script>
<script src="js/init.js.php?<?= $_SERVER ['QUERY_STRING'] ?>"></script>
<?php if (IS_POST and isset ($_POST ['auth_key'])): ?>
<script>
INIT.PROFILE	= <?= +$_POST ['profile'] ?>;
INIT.AUTH_KEY	= "<?= august_safe_str ($_POST ['auth_key']) ?>";
</script>
<?php endif ?>
</head>

<body></body>
</html>
