<?php
	include "../../include/august.inc.php";

	$ID = $_GET ['id'];
	if (!preg_match ("/^[-\w]+$/", $ID))
		die ("");

	$WIN = strtoupper (substr (PHP_OS, 0, 3)) === "WIN";
	$Cat = json_decode (file_get_contents ("catalog.json"));

	function get_dir ( $ID, $Parent = "." ) {
		global $Cat, $WIN;
		$FileList = [];
		$DirList  = [];
		if ($Dir = opendir ("$Parent/$ID")) {
			while (($File = readdir ($Dir)) !== false) {
				$Path = "$Parent/$ID/$File";
				if (filetype ($Path) === "file") {
					$Last = count ($FileList);
					$FileList [] = [
						"name"	=> $WIN ? iconv ("windows-1251//IGNORE", "UTF-8//IGNORE", $File) : $File,
						"size"	=> filesize ($Path)
					];
					if (isSet ($Cat->{$Path})) {
						$Descr = $Cat->{$Path};
						if (gettype ($Descr) == "string") {
							$FileList [$Last]["descr"] = $Descr;
						} else {
							$FileList [$Last]["descr"] = $Descr->d;
							$FileList [$Last]["auto"] = $Descr->a;
						}
					}
				} elseif (filetype ($Path) === "dir" and $File !== "." and $File !== "..") {
					$DirList [] = [
						"name"	=> $WIN ? iconv ("windows-1251//IGNORE", "UTF-8//IGNORE", $File) : $File,
						"list"	=> get_dir ($File, "$Parent/$ID")
					];
				}
			}
			closedir ($Dir);
		}
		return [
			"FileList"	=> $FileList,
			"DirList"	=> $DirList
		];
	}

	header ("Cache-Control: no-store, no-cache, must-revalidate");
	august_out_json (get_dir ($ID));
?>
