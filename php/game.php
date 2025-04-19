<?php
	if (!preg_match ("`^(.+?\.php)(/.*)$`", $_SERVER ['REQUEST_URI'], $PATH_INFO)) {
		header ("HTTP/1.1 404 Not Found");
		exit;
	}

	header ("Content-Type: text/html; utf-8");
	$curl = curl_init ("http://august4u.ru/games{$PATH_INFO [2]}/");
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	$r = curl_exec ($curl);
	curl_close ($curl);
	print $r ?: "error";
?>
