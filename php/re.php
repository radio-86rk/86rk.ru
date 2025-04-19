<?php
	if (!preg_match ("`^/(?:[^/]+/)+(https?://.+)$`i", $_SERVER ['REQUEST_URI'], $URI)) {
		header ("HTTP/1.1 400");
		exit;
	}

	header ("HTTP/1.1 302");
	header ("Location: {$URI [1]}");
?>
