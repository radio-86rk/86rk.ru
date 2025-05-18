<?php
	/*
	 *  UserAgent:
	 *  Yandex:		Yandex/1.01.001 (compatible; Win16; I)
	 *			Yandex/2.01.000 (compatible; Win16; Dyatel; C)
	 *			Mozilla/5.0 (compatible; YandexBot/3.0; +http: *yandex.com/bots)
	 *			Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots)
	 *			полный список: https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs
	 *  YandexCatalog	Mozilla/5.0 (compatible; YandexCatalog/3.0; +http://yandex.com/bots)
	 *  Rambler:		StackRambler/2.0 (MSIE incompatible)
	 *  Aport:		Aport
	 *  Google:		Mozilla/5.0 (compatible; Googlebot/2.1; +http: *www.google.com/bot.html)
	 *  			DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http: *www.google.com/bot.html)
	 *  			Mozilla/5.0 (compatible; Google-Site-Verification/1.0)
	 *  Yahoo:		Mozilla/5.0 (compatible; Yahoo! Slurp; http: *help.yahoo.com/help/us/ysearch/slurp)
	 *  msn:		msnbot/1.0 (+http: *search.msn.com/msnbot.htm)
	 *			msnbot-media/1.0 (+http: *search.msn.com/msnbot.htm)
	 *  WebAlta:		WebAlta Crawler/1.3.18 (http: *www.webalta.net/ru/about_webmaster.html) (Windows; U; Windows NT 5.1; ru-RU)
	 *  TurnitinBot:	TurnitinBot/2.1 (http: *www.turnitin.com/robot/crawlerinfo.html)
	 *  Mail.Ru:		Mail.Ru/1.0
	 *			Mozilla/5.0 (compatible; Mail.RU_Bot/2.0; +http: *go.mail.ru/help/robots)
	 *  nic.ru:		index (+http://www.nic.ru)
	 *  Bigsearch.ca:	Bigsearch.ca/Nutch-0.9-dev (Bigsearch.ca Internet Spider; http: *www.bigsearch.ca/; info@enhancededge.com)
	 *  Sogou:		Sogou web spider/4.0(+http: *www.sogou.com/docs/help/webmasters.htm#07)
	 *  Baiduspider:	Baiduspider+(+http: *www.baidu.com/search/spider.htm)
	 *  Speedy Spider:	Speedy Spider (http: *www.entireweb.com/about/search_tech/speedy_spider/)
	 *  MLBot:		MLBot (www.metadatalabs.com/mlbot)
	 *  Gigabot:		Gigabot/3.0 (http: *www.gigablast.com/spider.html)
	 *  AdsBot-Google:	AdsBot-Google (+http: *www.google.com/adsbot.html)
	 *  YaDirectBot:	YaDirectBot/1.0
	 *  Baiduspider:	Baiduspider+(+http: *www.baidu.com/search/spider.htm)
	 *  YoudaoBot:		Mozilla/5.0 (compatible; YoudaoBot/1.0; http: *www.youdao.com/help/webmaster/spider/; )
	 *  Tagoobot:		Mozilla/5.0 (compatible; Tagoobot/3.0; +http: *www.tagoo.ru)
	 *  Exabot:		Mozilla/5.0 (compatible; Exabot/3.0; +http: *www.exabot.com/go/robot)
	 *  MJ12bot:		Mozilla/5.0 (compatible; MJ12bot/v1.3.1; http: *www.majestic12.co.uk/bot.php?+)
	 *  ovale:		ovalebot3.ovale.ru facepage
	 *  Twiceler:		Mozilla/5.0 (Twiceler-0.9 http: *www.cuil.com/twiceler/robot.html)
	 *  AportCatalogRobot:	AportCatalogRobot/2.0
	 *  Eurobot:		Eurobot/1.1 (http: *eurobot.ayell.eu)
	 *  SheenBot:		SheenBot/SheenBot-1.0.0 (Sheen web crawler)
	 *  KaloogaBot:		Mozilla/5.0 (compatible; KaloogaBot; http: *www.kalooga.com/info.html?page=crawler)
	 *  NaverBot:		Mozilla/4.0 (compatible; NaverBot/1.0; http: *help.naver.com/customer_webtxt_02.jsp)
	 *  FlickySearchBot:	FlickySearchBot/1.0 (+testMode)
	 *  YodaoBot:		Mozilla/5.0 (compatible; YodaoBot/1.0; http: *www.yodao.com/help/webmaster/spider/; )
	 *  BingBot:		Mozilla/5.0 (compatible; bingbot/2.0; +http: *www.bing.com/bingbot.htm)
	 *  AhrefsBot:		Mozilla/5.0 (compatible; AhrefsBot/4.0; +http: *ahrefs.com/robot/)
	 *  oBot:		Mozilla/5.0 (compatible; oBot/2.3.1; +http: *filterdb.iss.net/crawler/)
	 *  Ezooms:		Mozilla/5.0 (compatible; Ezooms/1.0; ezooms.bot@gmail.com)
	 *  Nigma:		Mozilla/5.0 (compatible; Nigma.ru/3.0; crawler@nigma.ru)
	 *  PingAdmin:		Mozilla/5.0 (compatible; PingAdmin.Ru/1.1; +http: *pingadmin.ru/)
	 *  Naverbot:		Yeti/1.0 (NHN Corp.; http://help.naver.com/robots/)
	 *  NING:		NING/1.0
	 *  facebook:		facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
	 *  facebook:		facebookcatalog/1.0
	 *  Censys:		Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)
	 *  Palo Alto:		Expanse, a Palo Alto Networks company, searches across the global IPv4 space ...
	 *  BackupLand:		Mozilla/5.0 (compatible; BackupLand/1.0; https://go.backupland.com/; Domain check for viruses;)
	 *  DuckDuckGo:		Mozilla/5.0 (compatible; DuckDuckGo-Favicons-Bot/1.0; +http://duckduckgo.com)
	 */

	class crawlers {
		private const LIST = [
			'Yandex/'			=> 'Yandex',
			'YandexBot/'			=> 'Yandex',
			'YandexMobileBot/'		=> 'Yandex',
			'YandexImages/'			=> 'Yandex',
			'YandexMedia/'			=> 'Yandex',
			'YandexMetrika/'		=> 'Yandex',
			'YandexAccessibilityBot/'	=> 'Yandex',
			'YandexDirect/'			=> 'YandexDirect',
			'YandexCatalog/'		=> 'YandexCatalog',
			'StackRambler/'			=> 'Rambler',
			'Aport'				=> 'Aport',
			'Googlebot/'			=> 'Google',
			'Googlebot-Mobile/'		=> 'Google',
			'Google-Site-Verification/'	=> 'Google',
			'Yahoo'				=> 'Yahoo',
			'WebAlta'			=> 'WebAlta',
			'TurnitinBot'			=> 'TurnitinBot',
			'Mail.Ru'			=> 'Mail.Ru',
			'Mail.RU_Bot/'			=> 'Mail.Ru',
			'www.nic.ru'			=> 'www.nic.ru',
			'msnbot/'			=> 'msn',
			'msnbot-media/'			=> 'msn',
			'Sogou web spider'		=> 'Sogou',
			'Baiduspider'			=> 'Baiduspider',
			'Speedy Spider'			=> 'Speedy Spider',
			'MLBot'				=> 'MLBot',
			'Gigabot/'			=> 'Gigabot',
			'AdsBot-Google'			=> 'AdsBot-Google',
			'YaDirectBot/'			=> 'YaDirectBot',
			'Baiduspider'			=> 'Baiduspider',
			'YoudaoBot/'			=> 'YoudaoBot',
			'Tagoobot/'			=> 'Tagoobot',
			'Exabot/'			=> 'Exabot',
			'MJ12bot/'			=> 'MJ12bot',
			'ovale.ru facepage'		=> 'ovale',
			'Twiceler'			=> 'Twiceler',
			'AportCatalogRobot/'		=> 'AportCatalogRobot',
			'Eurobot/'			=> 'Eurobot',
			'SheenBot/'			=> 'SheenBot',
			'KaloogaBot'			=> 'KaloogaBot',
			'NaverBot/'			=> 'NaverBot',
			'FlickySearchBot/'		=> 'FlickySearchBot',
			'YodaoBot/'			=> 'YodaoBot',
			'bingbot/'			=> 'BingBot',
			'AhrefsBot/'			=> 'AhrefsBot',
			'oBot/'				=> 'oBot',
			'Ezooms/'			=> 'Ezooms',
			'Nigma.ru/'			=> 'Nigma',
			'PingAdmin.Ru/'			=> 'PingAdmin',
			'help.naver.com/robots/'	=> 'Naverbot',
			'NING/'				=> 'NING',
			'facebookexternalhit/'		=> 'facebook',
			'facebookcatalog/'		=> 'facebook',
			'CensysInspect/'		=> 'Censys',
			'BackupLand/'			=> 'BackupLand',
			'DuckDuckGo-Favicons-Bot/'	=> 'DuckDuckGo',
			'paloaltonetworks.com'		=> 'Palo Alto'
		];
		private static $RE = "";

		function __construct () {
			$RE = implode ("|", array_keys (self::LIST));
			self::$RE = "`\b($RE)\b`";
		}

		static function put_into_logfile ( $file, $extra = null ) {
			$log = $extra !== null
				? sprintf (
					"[%s] % 17s | % 15s | %s | %s | %s\n",
					date ("d.m.y H:i:s"),
					$extra,
					$_SERVER ['REMOTE_ADDR'],
					$_SERVER ['HTTP_USER_AGENT'],
					$_SERVER ['HTTP_HOST'],
					$_SERVER ['HTTP_REFERER'] ?? ""
				)
				: sprintf (
					"[%s] % 15s | %s | %s | %s\n",
					date ("d.m.y H:i:s"),
					$_SERVER ['REMOTE_ADDR'],
					$_SERVER ['HTTP_USER_AGENT'],
					$_SERVER ['HTTP_HOST'],
					$_SERVER ['HTTP_REFERER'] ?? ""
				);

			@file_put_contents ($file, $log, FILE_APPEND);
		}

		static function is_crawler ( $file = false, $ua = NULL ) {
			if (!$ua)
				$ua = $_SERVER ['HTTP_USER_AGENT'];
			$crawler = preg_match (self::$RE, $ua, $r)
				? self::LIST [$r [1]]
				: preg_match ("`(bot|bots|crawler|spider)\b`i", $ua);
			if ($crawler and $file)
				self::put_into_logfile ($file, $crawler === 1 ? "" : $crawler);
			return $crawler;
		}

		static function get () {
			return new crawlers;
		}
	}
?>
