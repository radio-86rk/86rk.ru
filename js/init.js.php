<?php
	require "../cfg/cfg.php";

	$DESIGN = (isset ($_GET ['d']) and preg_match ("/^[-\w]+$/", $_GET ['d']))
		? $_GET ['d']
		: "";
	$TPL    = (isset ($_GET ['t']) and preg_match ("/^[-\w]+$/", $_GET ['t']))
		? $_GET ['t']
		: ((isset ($_GET ['tpl']) and preg_match ("/^[-\w]+$/", $_GET ['tpl']))
		? $_GET ['tpl']
		: DEFAULT_TPL
		);
	$ROOM   = isset ($_GET ['r'])
		? +$_GET ['r']
		: (isset ($_GET ['room'])
		? +$_GET ['room']
		: (ctype_digit ($_SERVER ['QUERY_STRING'])
		? +$_SERVER ['QUERY_STRING']
		: DEFAULT_ROOM
		));
	$REF    = isset ($_GET ['ref'])
		? +$_GET ['ref']
		: 0;

	header ("Content-Type: application/javascript");
	header ("Cache-Control: no-cache, must-revalidate");
	header ("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
?>
INIT = {
	VERSION:	"<?= VERSION  ?>",
	HOST:		"<?= CHAT_HOST ?>",
	DESIGN:		"<?= $DESIGN ?>",
	DEFDES:		"<?= DEFAULT_DESIGN ?>",
	DEFDESMOBI:	"<?= DEFAULT_DESIGN_MOBILE ?>",
	MODULES_D:	"<?= DESKTOP_MODULES ?>",
	MODULES_M:	"<?= MOBILE_MODULES ?>",
	TPL:		"<?= $TPL ?>",
	ROOM:		<?= $ROOM ?>,
	REF:		<?= $REF ?>,
	LANG:		"<?= LANG ?>",
	SB:		<?= +SCROLLBAR ?>,
	CLICKABLE:	<?= +CLICKABLE_URL ?>,
	MOBILE:		"Touch" in window && "orientation" in window,
	OK:		!!window.WebSocket && !!window.JSON && !!window.requestAnimationFrame && !!Object.assign,
	get MODULES ()	{ return this.MOBILE ? this.MODULES_M : this.MODULES_D }
}
