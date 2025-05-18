<?php
	require "../cfg/cfg.php";

	function get_test ( $n, $def = '' ) {
		return (isset ($_GET [$n]) and preg_match ("/^[-\w]+$/", $_GET [$n])) ? $_GET [$n] : $def;
	}

	$MPS = get_test ('mps');
	$CFG = @$MPS_CFG [$MPS];
	$APL = get_test ('apl', $CFG ['APL'] ?: $MPS);
	$TPL = get_test ('tpl', $CFG ['TPL'] ?? null);
	$SID = get_test ('sid', isset ($CFG ['SID']) ? $CFG ['SID'] : -1);

	header ("Content-Type: application/javascript");
	header ("Cache-Control: no-cache, must-revalidate");
	header ("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
?>
INIT = {
	VERSION:"<?= VERSION  ?>",
	HOST:	"<?= CHAT_HOST ?>",
	LANG:	"<?= LANG ?>",
	SID:	<?= +$SID ?>,
	APL:	"<?= $APL ?>",
<?php if (!empty ($TPL)): ?>
	TPL:	"<?= $TPL ?>",
<?php endif ?>
<?php if (isset ($_GET ['sid'])): ?>
	NSID:	1,
<?php endif ?>
<?php if (isset ($_GET ['m'])): ?>
	MESSID:	<?= +$_GET ['m'] ?>,
<?php endif ?>
<?php if (isset ($_GET ['day'])): ?>
	DAY:	"<?= get_test ('day') ?>",
<?php endif ?>
<?php if (isset ($_GET ['d'])): ?>
	DESIGN:	"<?=  get_test ('d') ?>",
<?php endif ?>
	OK:	!!window.WebSocket && !!window.JSON && !!window.requestAnimationFrame && !!Object.assign
}
