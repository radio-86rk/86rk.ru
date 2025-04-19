<?php
	require "august.inc.php";
	require "crawlers.inc.php";

	function app_log ( $a ) {
		if (!crawlers::get ()::is_crawler ("../../logs/{$a ['crawler-log']}.log"))
			crawlers::put_into_logfile ("../../logs/{$a ['access-log']}.log");
	}

	function get_app () {
		return substr (dirname ($_SERVER['SCRIPT_NAME']), 1);
	}

	function load_version () {
		return @file_get_contents ("app.version") ?: "0";
	}

	function load_cfg () {
		$cfg_file = @file ("app.cfg", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		$cfg      = [];
		$tmp      = "";
		$cur      = null;
		foreach ($cfg_file as $l) {
			if (preg_match ("/^(?:\[(.+?)(?::([-\w]+))?\])|(?:([\"'`])(.*)\\3\s*(\S+)?)$/u", $l, $r)) {
				if ($r [1]) {
					$cfg [$r [1]] = [];
					$cur          = &$cfg [$r [1]];
					$tmp          = "";
				} else if (isset ($r [5])) {
					$cur [$r [5]] = $tmp . $r [4];
					$tmp          = "";
				} else {
					$tmp .= $r [4];
				}
			} else {
				error_log ("`app.cfg` app={$GLOBALS ['APP']}");
				return null;
			}
		}
		return $cfg;
	}

	$APP         = defined ('APP_NAME') ? APP_NAME : get_app ();
	$APP_VERSION = load_version ();
	$CFG         = load_cfg ();
	if ($CFG === null) {
		die ("cfg error");
	}
	if ($_SERVER ['HTTPS'] !== "on") {
//		header ("Location: https://{$_SERVER ['HTTP_HOST']}/$APP/");
//		exit;
	}
	if ($_SERVER ['HTTP_HOST'] != "86rk.ru") {
		header ("Link: <https://86rk.ru{$_SERVER ['REQUEST_URI']}>; rel=\"canonical\"");
	}

	header ("Cache-Control: no-cache");
	header ("Pragma: no-cache");
	header ("Expires: 0");

	app_log ([
		"crawler-log"	=> "86rk-$APP-crawler",
		"access-log"	=> "86rk-$APP-access"
	]);

	$LANG = august_get_lang ("en", [
		"ru" => ["ru", "be", "uk", "ky", "ab", "mo", "et", "lv"]
	]);
	include "../layout/app.index.html";
?>
