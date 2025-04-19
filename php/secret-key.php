<?php
	include "../cfg/cfg.php";
	$k = $_POST ['key'];
	if (!$k)
		die ("");

	$s  = SECRET_KEY;
	$sl = strlen ($s);
	$kl = strlen ($k);
	$r  = "";
	for ($i = 0; $i < $sl; $i++)
		$r .= chr (ord ($s [$i]) ^ ord ($k [$i % $kl]));
	print md5 ($r);
?>
