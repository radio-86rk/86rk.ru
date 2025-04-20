<?php
	require "august.inc.php";

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

	header ("Cache-Control: no-cache");
	header ("Pragma: no-cache");
	header ("Expires: 0");

	$APP         = defined ('APP_NAME') ? APP_NAME : get_app ();
	$APP_VERSION = load_version ();
	$CFG         = load_cfg ();

	if ($CFG === null)
		die ("cfg error");

	if ($_SERVER ['HTTP_HOST'] != "86rk.ru")
		header ("Link: <https://86rk.ru{$_SERVER ['REQUEST_URI']}>; rel=\"canonical\"");

	if (ACCESS_LOG) {
		require "crawlers.inc.php";
		if (!crawlers::get ()::is_crawler ("../../logs/86rk-$APP-crawlers.log"))
			crawlers::put_into_logfile ("../../logs/86rk-$APP-access.log");
	}

	$LANG = august_get_lang ("en", [
		"ru" => ["ru", "be", "uk", "ky", "ab", "mo", "et", "lv"]
	]);

	include "../layout/app.index.html";
?>
