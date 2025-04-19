<?php
//==============================================================================+
//  File name   : august.inc.php
//  Version     : 2.0
//  Starts      : 2013-08-30
//  Author      : Poedinok Vitaliy aka August - www.august4u.net
//  Contact     : august@august4u.net
//  License     : MIT
//  ----------------------------------------------------------------------------
//  Copyright (C) 2022  Poedinok Vitaliy
//  ----------------------------------------------------------------------------
//
//  Description : библиотека системных функций.
//
//==============================================================================+

	//  возвращаемые значения объекта auth в переменной ID
	//  отсутствует регистрация
	define ('AUTH_PROFILE_NONE',	0);
	//  слишком много неудачных авторизаций за промежуток времени
	define ('AUTH_PROFILE_ERROR1',	-1);
	//  слишком быстрая попытка повторной авторизации (атака?)
	define ('AUTH_PROFILE_ERROR2',	-2);
	//  неправильный пароль
	define ('AUTH_PASSWORD_ERROR',	-3);
	//  нет пароля
	define ('AUTH_PASSWORD_NONE',	-4);
	//  недопустимый ник
	define ('AUTH_NICK_ERROR',	-5);
	//  невозможно подключиться к серверу
	define ('AUTH_NO_CONNECT',	-111);

	//  определяем путь до корневого каталога, чтобы легко можно было
	//  подключать скрипты независимо от их положения относительно корня
	define ('ROOT_DIR',		str_repeat (
						"../",
						substr_count ($_SERVER ['SCRIPT_FILENAME'], "/")
						- substr_count (dirname(__FILE__), DIRECTORY_SEPARATOR)
	));
	define ('IS_POST',			$_SERVER ['REQUEST_METHOD'] == 'POST');
	define ('SESS_MNGR_PAGE_COUNTER',	101);
	define ('SESS_MNGR_ANSWER_MSG',		0x40000000);

	require_once ROOT_DIR."cfg/cfg.php";

	function august ( $Func, $Data ) {
		$IP                  = august_get_ip ();
		$Data ['secret_key'] = SECRET_KEY;
		$Data ['ip']         = $IP [0];
		$Data ['proxy']      = $IP [1];
		$Data ['cid1']       = 0x55555555;
		$Data ['cid2']       = 0x55555555;

		preg_match ("`^(.+?)(?::(\d+))?$`", CHAT_HOST, $r);
		$ChatHost = $r ? $r [1] : CHAT_HOST;
		$ChatPort = $r ? $r [2] : 0;
		$HTTP     = $_SERVER ['HTTPS'] ? "https" : "http";
		$curl     = curl_init ("$HTTP://$ChatHost/august/$Func");
		curl_setopt_array ($curl, [
			CURLOPT_PORT		=> $ChatPort,
			CURLOPT_CONNECTTIMEOUT	=> 5,
			CURLOPT_TIMEOUT		=> 5,
			CURLOPT_SSL_VERIFYPEER	=> false,
			CURLOPT_SSL_VERIFYHOST	=> false,
			CURLOPT_AUTOREFERER	=> true,
			CURLOPT_FOLLOWLOCATION	=> true,
			CURLOPT_RETURNTRANSFER	=> true,
			CURLOPT_POST		=> true,
			CURLOPT_POSTFIELDS	=> http_build_query ($Data)
		]);
		$r = curl_exec ($curl);
		curl_close ($curl);
		return $r === false ? $r : unserialize ($r);
	}

	class auth {
		function auth ( $Nick = null, $Pass = null ) {
			$Auth        = &$_SESSION ['AUTH'];
			$this->Error = 0;
			if (!isset ($Auth)) {
				$Auth        = new stdClass;
				$Auth->Auth  = 0;
				$Auth->ID    = 0;
			}
			if (
				!$this->isAuth ()
				and isset ($Nick)
				and isset ($Pass)
				and !empty ($Nick)
				and !empty ($Pass)
			) {
				$r = august ("auth", [
					'nick'       => $Nick,
					'pass'       => $Pass,
					'pass_key'   => $Auth->PassKey,
					'check_nick' => AUTH_CHECK_NICK
				]);
				if (!$r) {
					$Auth->ID      = AUTH_NO_CONNECT;
				} else {
					$Auth->Nick    = $Nick;
					$Auth->IP      = august_get_ip ();
					$Auth->ID      = $r ['Profile'];
					$Auth->AuthKey = $r ['AuthKey'];
					$Auth->Auth    = $Auth->ID > 0;
					$Auth->Time    = time ();
				}
				$this->Error = !$Auth->Auth;
			}
			$this->Auth = $Auth;
			$this->ID   = $Auth->ID;
			$this->setPassKey ();
			if (AUTH_CHECK_IP and $this->isAuth () and $Auth->IP != august_get_ip ())
				$this->Auth = NULL;
		}
		function isAuth () {
			return (isset ($this->Auth) and isset ($this->Auth->Auth))
				? $this->Auth->Auth
				: 0;
		}
		function id () {
			return $this->isAuth ()
				? $this->Auth->ID
				: 0;
		}
		function nick () {
			return $this->isAuth ()
				? $this->Auth->Nick
				: "";
		}
		function auth_key () {
			return $this->isAuth ()
				? $this->Auth->AuthKey
				: "";
		}
		function get ( $name ) {
			return (isset ($this->Auth) and isset ($this->Auth->{$name}))
				? $this->Auth->{$name}
				: NULL;
		}
		function set ( $name, $val ) {
			if (isset ($this->Auth))
				$this->Auth->{$name} = $val;
		}
		function logout () {
			if ($this->isAuth ()) {
				$Auth       = &$_SESSION ['AUTH'];
				$Auth       = new stdClass;
				$Auth->Auth = 0;
				$Auth->ID   = 0;
				$this->Auth = $Auth;
				$this->setPassKey ();
			}
		}
		private function setPassKey () {
			$Key = "";
			if (!$this->isAuth ()) {
				for ($i = 0; $i < 32; $i++)
					$Key .= chr (mt_rand (0x20, 0x7f));
			}
			$this->set ('PassKey', $Key);
		}
	}

	function august_get_ip () {
		$HTTP = [
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_COMING_FROM',
			'HTTP_COMING_FROM',
			'HTTP_CLIENT_IP',
			'HTTP_VIA'
		];
		$Proxy = false;
		$IP    = [ip2long ($_SERVER ['REMOTE_ADDR']), 0];
		foreach ($HTTP as $n) {
			if (isset ($_SERVER [$n])) {
				if (!$IP [1]) {
					$IP [1] = preg_match (
						"!^(\d+\.\d+\.\d+\.\d+)!",
						trim ($_SERVER [$n]), $r
					)
						? ip2long ($r [1])
						: 0;
				}
				$Proxy = true;
			}
		}
		return $Proxy ? array_reverse ($IP) : $IP;
	}

	function august_start_sess ( $name, $path = "" ) {
		session_cache_limiter ('nocache');
		session_name ($name);
		session_set_cookie_params (0, $path);
		session_start ();
	}

	function august_out_json ( $json ) {
		header ("Content-Type: application/json; charset=utf-8");
		print json_encode (
			$json,
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
		);
		exit;
	}

	function august_get_base () {
		return str_repeat (
			"../",
			substr_count ($_SERVER ['REQUEST_URI'], "/")
			- substr_count ($_SERVER ['SCRIPT_NAME'], "/")
		);
	}

	function august_safe_str ( $s ) {
		return isset ($s) ? preg_replace ("`[^-\w]`", "", $s) : "";
	}

	function august_get_fn ( $p = null, $n = null ) {
		$re = sprintf ("`/%s(%s)(?:\.php)?(?:\?.*)?$`", $p ? "(?:$p/)?(?!$p)" : "", $n ?: "\w+");
		return (preg_match ($re, $_SERVER ['REQUEST_URI'], $r) or preg_match ($re, $_SERVER ['SCRIPT_NAME'], $r))
			? $r [1]
			: "";
	}

	function august_manager ( $param ) {
		$IPC = msg_get_queue (crc32 ("sess_mngr"), 0600);
		if (!$IPC)
			return false;
		$pid = posix_getpid ();
		try {
			$r = msg_send ($IPC, $pid, $param, true, true, $err);
			if (!$r)
				throw new Exception ("msg_send(): errno=$err");
			for ($try = 0;;) {
				usleep (100);
				$r = msg_receive ($IPC, $pid | SESS_MNGR_ANSWER_MSG, $type, 65536, $msg, true, MSG_IPC_NOWAIT, $err);
				if ($r)
					return $msg;
				if (++$try == 10)
					throw new Exception ("msg_receive(): errno=$err a=`{$param['a']}`");
			}
		} catch ( Exception $e ) {
			error_log ("Manager: ".$e->getMessage ());
			return false;
		}
	}

	function august_get_lang ( $def, $list ) {
		$Lang = [];
		$AL = isset ($_SERVER ['HTTP_ACCEPT_LANGUAGE'])
			? strtolower ($_SERVER ['HTTP_ACCEPT_LANGUAGE'])
			: null;
		if ($AL and preg_match_all ("/([a-z]{1,8})(?:-[a-z]{1,8})?(?:;q=([0-9.]+))?/", $AL, $r)) {
			foreach ($r [1] as $i => $v)
				$Lang [$v] = $r [2][$i] ?: 1;
			arsort ($Lang);
		}
		$s = [];
		foreach ($list as $lang => $alias) {
			$l = strtolower ($lang);
			if (!is_array ($alias))
				$s [strtolower ($alias)] = $l;
			else foreach ($alias as $al)
				$s [strtolower ($al)] = $l;
		}
		foreach ($Lang as $l => $v) {
			if (isset ($s [$l]))
				return $s [$l];
		}
		return $def;
	}
?>
