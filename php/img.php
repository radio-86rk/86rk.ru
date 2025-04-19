<?php
	define ('MAX_FILE_SIZE',	1500);	//  kb
	ini_set ("memory_limit",	"128M");
	ini_set ("error_reporting",	E_ALL & ~E_NOTICE);

	if ($_SERVER ['HTTP_REFERER'] and !preg_match ("`^https?://{$_SERVER[HTTP_HOST]}`i", $_SERVER ['HTTP_REFERER'])) {
		header ("Status: 403");
		exit;
	}

	$GET_SIZE = $_SERVER ['REQUEST_METHOD'] === 'POST';
	if ($GET_SIZE) {
		$IMGs   = explode (":", $_POST ['imgs']);
		$Width  = +$_POST ['w'];
		$Height = +$_POST ['h'];
		$Res    = [
			'rid' => +$_POST ['rid'],
			'im'  => []
		];
		foreach ($IMGs as $i => $url) {
			$md5 = md5 (urldecode ($url));
			$img = "../uploads/$md5";
			if (!file_exists ($img)) {
				$Res ['im'][] = null;
				continue;
			}
			$s            = @getImageSize ($img);
			$rs           = calc_resize ($Width, $Height, $s [0], $s [1]);
			$eq           = $rs === false;
			$Res ['im'][] = [
				'w' => $eq ? $s [0] : $rs [0],
				'h' => $eq ? $s [1] : $rs [1],
				'v' => +!$eq
			];
		}
		header ("Content-Type: application/json");
		print json_encode ($Res);
		exit;
	}

	if (!preg_match ("`^(?:/.+?)*?/img/(\d+)/(\d+)/(.+)$`", $_SERVER ['REQUEST_URI'], $p))
		die ("args error");

	$Time = time ();
	$img  = get_img (urldecode ($p [3]), $Time);
	if ($img === false) {
		header ("HTTP/1.1 304 Not Modified");
		exit;
	}

	if (is_string ($img))
		out_img ($img, +$p [1], +$p [2], 3600 * 24 * 30, $Time);
	elseif (is_int ($img))
		out_error_file ($img);

	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
	//  вспомогательные функции

	function get_img ( $url, &$Time ) {
		$md5  = md5 ($url);
		$File = "../uploads/$md5";
		if (file_exists ($File)) {
			$Time = filectime ($File);
			return $_SERVER ['HTTP_IF_MODIFIED_SINCE'] == gmdate ("r", $Time)
				? false
				: file_get_contents ($File);
		}

		$opt = [
			CURLOPT_CONNECTTIMEOUT => 10,
			CURLOPT_TIMEOUT        => 10,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_SSL_VERIFYHOST => 0,
			CURLOPT_AUTOREFERER    => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_MAXREDIRS      => 10,
			CURLOPT_NOBODY         => true,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_USERAGENT      => "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
		];
		$curl = curl_init ($url);
		curl_setopt_array ($curl, $opt);
		$Data = curl_exec ($curl);
		$Code = curl_getinfo ($curl, CURLINFO_HTTP_CODE);
		$Size = curl_getinfo ($curl, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
		$Type = curl_getinfo ($curl, CURLINFO_CONTENT_TYPE);
		$Eurl = curl_getinfo ($curl, CURLINFO_EFFECTIVE_URL);
		curl_close ($curl);

		if ($Code != 200)
			return $Code;

		if (!$Size or $Size > MAX_FILE_SIZE * 1024)
			return -1;

		$opt [CURLOPT_NOBODY] = false;
		$curl = curl_init ($Eurl ?: $url);
		curl_setopt_array ($curl, $opt);
		$img = curl_exec ($curl);
		curl_close ($curl);

		if (strlen ($img) != $Size)
			return -1;

		$Type = get_img_type ($img);
		if ($Type === null)
			return -1;

		@file_put_contents ($File, $img) or die ("write File error");
		return $img;
	}

	function out_error_file ( $code ) {
		if ($code < 0)
			$code = "x";
		$img = @file_get_contents ("../images/\$mps/img-$code.png");
		out_img ($img, 0, 0, 3600 * 24 * 30, time ());
	}

	function out_img ( $img, $MaxSizeX, $MaxSizeY, $Cache, $Time ) {
		$Type = get_img_type ($img);
		if ($Type === null)
			return;
		header ("Last-Modified: ".gmdate ("r", $Time));
		header ("Content-Type: ".image_type_to_mime_type ($Type));
		if ($Cache) {
			header ("Cache-Control: max-age=$Cache");
			header ("Expires: ".gmdate ("r", time () + $Cache));
		}
		out_resize ($img, $MaxSizeX, $MaxSizeY, $Type);
	}

	function get_img_type ( $img ) {
		if (!strlen ($img))
			return null;
		if (unpack ("a3", $img)[1] == "\xff\xd8\xff")
			return IMAGETYPE_JPEG;
		if (unpack ("a4", $img)[1] == "GIF8")
			return IMAGETYPE_GIF;
		if (unpack ("a8", $img)[1] == "\x89PNG\x0d\x0a\x1a\x0a")
			return IMAGETYPE_PNG;
		if (unpack ("a4", $img)[1] == "RIFF" and unpack ("a7", substr ($img, 8, 7))[1] == "WEBPVP8")
			return IMAGETYPE_WEBP;
		return null;
	}

	function calc_resize ( $mx, $my, $sx, $sy ) {
		if (!($mx and $sx > $mx) and !($my and $sy > $my))
			//  ресайз не требуется
			return false;
		if ($mx and (!$my or $sx * $my > $sy * $mx))
			//  масштаб определяется по X
			return [$mx, round ($sy * $mx / $sx)];
		//  масштаб определяется по Y
		return [round ($sx * $my / $sy), $my];
	}

	function out_resize ( $img, $mx, $my, $t ) {
		$im1 = imageCreateFromString ($img);
		$sx1 = imageSX ($im1);
		$sy1 = imageSY ($im1);
		$rs  = calc_resize ($mx, $my, $sx1, $sy1);
		if ($rs === false) {
			print $img;
			return;
		}
		list ($sx2, $sy2) = $rs;
		$im2 = imageCreateTrueColor ($sx2, $sy2);
		imageCopyResampled ($im2, $im1, 0, 0, 0, 0, $sx2, $sy2, $sx1, $sy1);
		imageDestroy ($im1);
		imagesharpen_precise ($im2);
		switch ($t) {
			case IMAGETYPE_GIF:
				imageGIF ($im2);
				break;
			case IMAGETYPE_JPEG:
				imageinterlace ($im2, 1);
				imageJPEG ($im2, null, 90);
				break;
			case IMAGETYPE_PNG:
				imagePNG ($im2);
				break;
			case IMAGETYPE_WEBP:
				imageWEBP ($im2, null, 95);
				break;
		}
		imageDestroy ($im2);
	}

	function imagesharpen_precise ( $image ) {
		$height = imagesy ($image);
		$width  = imagesx ($image);
		$rs     = [];
		$gs     = [];
		$bs     = [];
		for ($y = 0; $y < $height; ++$y) {
			for ($x = 0; $x < $width; ++$x) {
				$rgb        = imagecolorat ($image, $x, $y);
				$rs[$y][$x] = $rgb >> 0x10;
				$gs[$y][$x] = $rgb >> 0x08 & 0xff;
				$bs[$y][$x] = $rgb         & 0xff;
			}
		}
		$height--;
		$width--;
		for ($y = 1; $y < $height; ++$y) {
			$rd = $rs[$y][0];
			$gd = $gs[$y][0];
			$bd = $bs[$y][0];
			$yd = $y - 1;
			$yi = $y + 1;
			for ($x = 1; $x < $width; ++$x) {
				$r  = -($rs[$yd][$x] + $rs[$yi][$x] + $rd + $rs[$y][$x + 1]) / 4;
				$g  = -($gs[$yd][$x] + $gs[$yi][$x] + $gd + $gs[$y][$x + 1]) / 4;
				$b  = -($bs[$yd][$x] + $bs[$yi][$x] + $bd + $bs[$y][$x + 1]) / 4;
				$r += 2 * $rd = $rs[$y][$x];
				$g += 2 * $gd = $gs[$y][$x];
				$b += 2 * $bd = $bs[$y][$x];
				if ($r < 0)
					$r = 0;
				elseif ($r > 255)
					$r = 255;
				if ($g < 0)
					$g = 0;
				elseif ($g > 255)
					$g = 255;
				if ($b < 0)
					$b = 0;
				elseif ($b > 255)
					$b = 255;
				imagesetpixel ($image, $x, $y, $r << 0x10 | $g << 0x08 | $b);
			}           
		}
	}
?>
