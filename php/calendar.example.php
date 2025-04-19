<?php
	include "../include/august.inc.php";

	$Year  = +$_POST ['year'];
	$Month = +$_POST ['month'];

	$Res = [];
	for ($d = 1; $d <= 31; $d++) {
		$Res [$d] = [
			'DAY' => $d
		];
	}

	out_json ($Res);
?>
