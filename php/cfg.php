<?php
	$lang = strlen ($_GET ['lang']) == 2 ? strtolower ($_GET ['lang']) : "ru";
	cfg ("../cfg/{$_GET ['cfg']}.$lang.cfg") or cfg ("../cfg/{$_GET ['cfg']}.cfg");

	function cfg ( $fn ) {
		if (!file_exists ($fn))
			return false;

		$stat = lstat ($fn);
		$etag = sprintf ("\"%x-%x-%x\"", $stat ['ino'], $stat ['size'], $stat ['mtime']);
		if (isset ($_SERVER ['HTTP_IF_NONE_MATCH']) and $_SERVER ['HTTP_IF_NONE_MATCH'] == $etag) {
			header ("HTTP/1.1 304");
		} elseif ($c = @file_get_contents ($fn)) {
			header ("Content-Type: text/plain; charset=utf-8");
			header ("ETag: $etag");
			print $c;
		}
		return true;
	}
?>
