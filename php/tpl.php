<?php
	$tpl = array_unique (explode ('!', $_GET ['tpl']));
	$use = (isset ($_GET ['use']) and preg_match ("/^[-$\w]+$/", $_GET ['use'])) ? "{$_GET ['use']}/" : "";
	$apl = (isset ($_GET ['apl']) and preg_match ("/^([-\w]+)(?:\/([-\w]+))?$/", $_GET ['apl'], $a)) ? "\$$a[1]/" : "";
	$top = (isset ($_GET ['top']) and preg_match ("/^([-\w]+(?:\/([-\w]+))?)$/", $_GET ['top'], $t)) ? "$t[1]/tpl/" : "tpl/";
	$pth = (isset ($a) and isset ($a [2])) ? "$a[2]/" : "";
	$res = [];
	$md5 = "";
	$get = function ( $n, $p1, $p2 ) use ( $top ) {
		$c = $p2 ? @file_get_contents ("../$top$p2$n.tpl") : false;
		return $c === false ? @file_get_contents ("../$top$p1$n.tpl") : $c;
	};
	foreach ($tpl as $n) {
		if (!$n)
			continue;
		if (!$apl)
			$c = $get ($n, "", $use);
		elseif (!$use or ($c = $get ($n, "$use$apl", "$use$apl$pth")) === false)
			$c = $get ($n, $apl, "$apl$pth");
		$c      = str_replace ("\r", "", $c);
		$res [] = sprintf ("\"%s\":\"%s\"", str_replace ("-", "_", $n), $c ? addcslashes ($c, "\n\t\\\"") : "");
		$md5    = md5 ("$md5$c");
	}
	if (
		(isset ($_SERVER ['HTTP_X_MD5']) and $_SERVER ['HTTP_X_MD5'] == $md5)
		or (isset ($_SERVER ['HTTP_IF_NONE_MATCH']) and $_SERVER ['HTTP_IF_NONE_MATCH'] == $md5)
	) {
		header ("HTTP/1.1 304");
		exit;
	}

	$res [] = "\"\$md5\":\"$md5\"";
	header ("ETag: $md5");
	header ("Content-Type: application/json; charset=utf-8");
	printf ("{%s}", implode (',', $res));
?>
