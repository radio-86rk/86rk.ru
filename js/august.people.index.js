//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.index.js


function august_people_index ( ... Notice ) {
	function index ( ... Notice ) {
		MAIN.$ACTION = ACTION
		MAIN.keyHandler (function ( e ) {
			if (e.keyCode == 13) {
				if (this.name == "info_nick")
					info ()
				else if (this.name == "nick" || this.name == "pass")
					login ()
			}
		})
		MAIN.clickHandler (function ( a ) {
			SORT = "SORT_NICK"
			if (!isArray (a [5]))
				return load (a)
			let p = {}
			for (let s of a [5]) {
				let x = this.attr (s)
				if (x !== null)
					p [s] = x
			}
			load (a, p)
		}, function () {
			let NickID = this.attr ("nickid")
			if (!NickID)
				return true
			if (PAGE == "index")
				info (null, { nickid: NickID })
			else if (root.Chat && root.Chat.userinfo)
				root.Chat.userinfo ({ nickid: NickID })
			else
				August.wo (`info.php?nickid=${NickID}`, `INFO_${NickID}`, { f: 3 })
			return false
		})
		let INDEX = INIT.FUNC === "index"
		MAIN.xhr ("people.index", r => {
			MODER = r.MODER
			ADMIN = r.ADMIN
			YEAR = r.YEAR
			INIT.SESS = r.SESS
			new Date ().setTimeZone (r.TIMEZONE)
			if (!INDEX) {
				let FUNC = INIT.FUNC
				INIT.FUNC = "index"
				if (isFunction (ACTION [FUNC]))
					return ACTION [FUNC] ()
				else if (isArray (ACTION [FUNC]))
					return load (ACTION [FUNC])
			}
			SB && SB.done ()
			SB = null
			PEOPLE.innerHTML = ""
			load_css ("index", () => load_tpl ("index", tpl => {
				insert_html ("index", tpl.index.pattern ({
					LIST_NEW:	[list_list (r.NEW.LIST)],
					LIST_WAIT:	r.WAIT ? [list_list (r.WAIT.LIST)] : ""
				}, {
					TOTAL:		r.TOTAL,
					TOTAL_NEW:	r.NEW.TOTAL,
					TOTAL_WAIT:	r.WAIT ? r.WAIT.TOTAL : 0
				}))
				document.login = PEOPLE.$("form")
				NOTICE_EL = PEOPLE.$("notice")
				NOTICE = NOTICE_EL ? NOTICE_EL.innerHTML.htmlEntityDecode () : ""
				if (isSet (Notice))
					notice (... Notice)
				if (document.login)
					document.login.pass_key = r.PASSKEY
			}))
		}, {
			sess:	INIT.SESS,
			id:	root.User ? root.User.ID : "",
			index:	INDEX | 0
		})
	}
	function login () {
		if (!document.login)
			return
		let nick = document.login.nick.value.trim ()
		let pass = document.login.pass.value.trim ()
		if (nick && pass) {
			form (null, {
				sess:	INIT.SESS,
				nick:	nick,
				pass:	pass.crypt (document.login.pass_key),
				act:	"edit"
			})
		}
	}
	function info ( el, param ) {
		let nick = document.login && document.login.info_nick.value.trim ()
		let Handlers = {
			ok ( show ) {
				load_css ("info", show)
			},
			exit ( code ) {
				if (code == "END")
					return index ()
				notice (code == "NONE" ? "AUTH0" : code, true, { NICK: nick })
				document.login.info_nick.value = ""
			}
		}

		if (!param) {
			if (!nick)
				return
			param = { nick }
		}
		reset_page ()
		if (INFO)
			return INFO.getInfo (param, Handlers)
		August.loadJS ("august.people.info.js").then (() => {
			INFO = new august_people_info (param, Handlers)
		})
	}
	function form ( el, Login ) {
		let Handlers = {
			ok ( show ) {
				load_css ("form", show)
			},
			exit ( code, ret ) {
				if (document.login) {
					document.login.pass.value = ""
					document.login.pass.focus ()
				}
				if (isSet (ret))
					index (`${ret.toUpperCase ()}_${code}`, false, Login ? { NICK: Login.nick } : null)
				else
					notice (`AUTH${-code}`, true, Login ? { NICK: Login.nick } : null)
			}
		}

		if (!Login)
			INIT.ID2 = 0
		reset_page ()
		if (FORM)
			return FORM.getForm (Login, Handlers)
		August.loadJS ("august.people.form.js").then (() => {
			FORM = new august_people_form (Login, Handlers)
		})
	}
	function lost () {
		load_tpl ("lost", tpl => {
			insert_html ("lost", tpl.lost.tpl ({
			}))
		})
	}
	function search () {
		if (!MODER)
			TPL.search_moder = ""
		load_tpl (["search", "search-list", MODER ? "search-moder" : ""], tpl => {
			insert_html ("search", tpl.search.tpl ({
				YEAR_CHAT:	YEAR [0],
				YEAR_NOW:	YEAR [1],
				LIST:		"<div class=search-list id=__search_list></div>",
			}))
			let go = 0
			let f = PEOPLE.$("form")
			for (let q of location.search.substr (1).split ("&")) {
				let v = q.split ("=")
				let fl = f [v [0]]
				if (!fl)
					continue
				if (v [0] == "zodiac") {
					fl.forEach (( f, i ) => {
						if (v [1] & (1 << i))
							f.checked = true
					})
				} else if (v [0] == "opt") {
					let opt = {}
					for (let f of fl)
						opt [f.value] = f
					for (let o of v [1].split ("|")) {
						if (opt [o])
							opt [o].checked = true
					}
				} else {
					August.form.$val (fl, v [1])
				}
				go++
			}
			go && go_search ()
		})
	}
	function list ( r, tpl ) {
		new Date ().setTimeZone (r.TIMEZONE)
		FisrtNick = r.NICK
		PageNum = r.PAGE
		PageSize = r.SIZE
		Pages = r.PAGES
		insert_html ("list", tpl.pattern ({
			LIST:    [
				list_list (r.LIST)
			],
			LETTER_NAV: [{
				LETTER	() { return this.$chars [this.$i] },
				CURRENT	() { return "".true (r.NICK == this.LETTER ()) },
				$size	() { return this.$chars.length },
				$args	( a ) { this.$chars = a }
			}],
			PAGE_NAV: [{
				PAGE	() { return this.$i + 1 },
				CURRENT	() { return "".true (r.PAGE == this.PAGE ()) },
				$size	() { return r.PAGES > 1 ? r.PAGES : 0 },
			}]
		}, {
			NICK:	"".true (r.NICK),
			FIRST:	r.FIRST,
			LAST:	r.LAST || "",
			PAGES:	r.PAGES > 1 ? r.PAGES : "",
			TOTAL:	r.TOTAL
		}))
	}
	function lock ( r, tpl ) {
		new Date ().setTimeZone (r.TIMEZONE)
		insert_html ("lock", tpl.pattern ({
			LIST: [MAIN.list (r.LIST, {
				NUM	() { return this.$i + r.FIRST },
				NICK	() { return this.$u [0] },
				NICKID	() { return this.$u [1] },
				LOCK	() { return this.$u [2] },
				MODER	() { return "".true (this.$u [3]) },
				REASON	() { return this.$u [6] }
			})],
			PAGE_NAV: [{
				PAGE	() { return this.$i + 1 },
				CURRENT	() { return "".true (r.PAGE == this.PAGE ()) },
				$size	() { return r.PAGES > 1 ? r.PAGES : 0 },
			}]
		}, {
			NAV:	"".true (r.PAGES > 1),
			FIRST:	r.FIRST,
			LAST:	r.LAST || "",
			PAGES:	r.PAGES > 1 ? r.PAGES : "",
			TOTAL:	r.TOTAL
		}))
		PageNum = r.PAGE
		PageSize = r.SIZE
		Pages = r.PAGES
	}
	function birthday () {
		load_tpl ("birthday", tpl => {
			let list = []
			tpl.birthday.pattern ({
				BIRTHDAY: [{
					$size:	a => 0,
					$args:	a => list.push (a)
				}]
			})
			MAIN.xhr ("people.birthday", r => {
				insert_html ("birthday", tpl.birthday.pattern ({
					BIRTHDAY:	[MAIN.list (r, {
						NUM	() { return this.$i + 1 },
						NICK	() { return this.$u [0] },
						NICKID	() { return this.$u [1] },
						LAST	() { return this.$u [2] }
					})]
				}, {
					TIME:	t => r.TIME + (t || 0)
				}))
			}, {
				list:	list.join ("|")
			})
		})
	}
	function top () {
		load_tpl ("top", tpl => {
			let list = []
			let p = {
				$size		() { return 0 },
				$args		( a, b, c ) { list.push (`${this.$tpl_name}:${~~a}:${~~b}:${~~c}`) }
			}
			tpl.top.pattern ({
				MESS:		[p],
				TIME:		[p],
				REFERALS:	[p]
			})
			MAIN.xhr ("people.top", r => {
				let p = MAIN.list (r, {
					NUM		() { return this.$i + 1 },
					NICK		() { return this.$u [0] },
					NICKID		() { return this.$u [1] },
					COUNT1		() { return this.$u [2] },
					COUNT2		() { return this.$u [3] },
					COUNT12		() { return this.$u [2] + this.$u [3] },
					SECRECY		() { return (100 * this.$secrecy ()()).locale () },
					TIME		() { return this.$u [2] },
					REFERALS	() { return this.$u [2] },
					$secrecy	() { return { MESS: _ => this.$u [3] / this.COUNT12 (), TIME: _ => this.$u [3] / this.$u [2] }[this.$tpl_name] },
					$set2		() { this.$u.d = this.$u.last () },
					$args		( a, b, c ) { this.$list = r [`${this.$tpl_name}:${~~a}:${~~b}:${~~c}`] }
				})
				insert_html ("top", tpl.top.pattern ({
					MESS:		[p],
					TIME:		[p],
					REFERALS:	[p]
				}))
			}, {
				list: list.join ("|")
			})
		})
	}
	function list_list ( list, add ) {
		return MAIN.list (list, Object.assign ({
			NICK	() { return this.$u ? this.$u [0] : "" },
			NICKID	() { return this.$u ? this.$u [1] : "" },
			PHOTO	() { return this.$u && this.$u [2] != "0" ? this.$u [2] : "" },
			MODER:	"".true (MODER)
		}, add))
	}
	function page ( el ) {
		if (!PAGE)
			return
		if (PAGE == "search")
			return go_search (el)
		let page = el.attr ("page") || 0
		let first = el.attr ("first") || FisrtNick
		let size = el.attr ("size") || PageSize
		FisrtNick = ""
		PageSize = 0
		Pages = 0
		load (MAIN.$ACTION [PAGE], { page, first, size })
	}
	function sort ( el ) {
		if (!PAGE)
			return
		let sort = el.attr ("sort")
		if (sort === "date")
			SORT = SORT == "SORT_LOCK" ? "SORT_LOCK|SORT_REVERSE" : "SORT_LOCK"
		else if (sort === "nick")
			SORT = SORT == "SORT_NICK" ? "SORT_NICK|SORT_REVERSE" : "SORT_NICK"
		else
			return
		load (MAIN.$ACTION [PAGE], { page: PageNum, size: PageSize })
	}
	function go_search ( a ) {
		let f = PEOPLE.$("form")
		let OPTIONS = [
			August.form.$val (f.checked),
			August.form.$val (f.locked),
			August.form.$val (f.deleted),
			August.form.$val (f.uniq),
			August.form.$val (f.sort),
			August.form.$val (f.net),
			August.form.$val (f.opt).join ("|"),
			"BIRTHDAY"
		]
		let Zodiac = 0
		if (f.zodiac) {
			for (let ch of f.zodiac) {
				if (ch.checked)
					Zodiac |= 1 << +ch.value
			}
			if (Zodiac)
				OPTIONS.push ("ZODIAC")
		}
		if (!MODER)
			OPTIONS.push ("NO_DELETED|NO_LOCKED")
		let sl = PEOPLE.$("#__search_list")
		let cn = sl.className
		sl.innerHTML = ""
		sl.className = ""
		sl.setHeight (0)
		MAIN.xhr ("people.list", r => {
			FisrtNick = r.NICK
			PageNum = r.PAGE
			PageSize = r.SIZE
			Pages = r.PAGES
			sl.innerHTML = TPL.search_list.pattern ({
				LIST: [list_list (r.LIST, {
					CHECK	() { return "".true (!MODER || (this.$u && this.$u [3])) },
					LOCK	() { return "".true (this.$u && this.$u [4]) },
					DEL	() { return "".true (this.$u && this.$u [5]) }
				})],
				PAGE_NAV: [{
					PAGE	() { return this.$i + 1 },
					CURRENT	() { return "".true (r.PAGE == this.PAGE ()) },
					$size	() { return r.PAGES > 1 ? r.PAGES : 0 },
				}]
			}, {
				FIRST:	r.FIRST,
				LAST:	r.LAST || "",
				PAGES:	r.PAGES > 1 ? r.PAGES : "",
				TOTAL:	r.TOTAL,
				IP1:	r.IP ? r.IP [0] : "",
				IP2:	r.IP ? r.IP [1] : ""
			})
			sl.setClass (cn, 1).setHeight ()
			if (SB)
				SB.scrollToSmooth (0)
			else
				sl.scrollIntoView ({ behavior: "smooth", block: "start" })
		}, {
			id:	root.User ? root.User.ID : "",
			date1:	(August.form.$val (f.date1) || "").replace (/\d\d(\d\d)-(\d\d)-(\d\d)/, "$3$2$1"),
			date2:	(August.form.$val (f.date2) || "").replace (/\d\d(\d\d)-(\d\d)-(\d\d)/, "$3$2$1"),
			first:	August.form.$val (f.first),
			size:	August.form.$val (f.size),
			ip:	August.form.$val (f.ip),
			cid:	August.form.$val (f.cid),
			bd:	August.form.$val (f.bd),
			z:	Zodiac,
			options:OPTIONS.join ("|"),
			get:	`NICK|NICKID|PHOTO${MODER ? "|CHECK|LOCK|DEL" : ""}`,
			page:	isObject (a) ? a.attr ("page") || 0 : (a || 0)
		})
	}
	function go_lost () {
		let f = PEOPLE.$("form")
		let nick = August.form.$val (f.nick).trim ()
		let [fp1, fp2] = August.fingerprint ()
		if (!nick || !email)
			return
		MAIN.xhr ("people.lost", r => {
console.log ("go_lost", r)
		}, { nick, fp1, fp2 })

	}
	function notice ( p, err, param ) {
		if (!NOTICE_EL)
			return
		let n = NOTICE.param (p, param)
		if (n.isFalse ())
			return
		clearTimeout (NOTICE_EL.to)
		NOTICE_EL.innerHTML = `<div>${n}</div>`
		NOTICE_EL.className = err ? "error" : ""
		NOTICE_EL.setHeight ()
		NOTICE_EL.to = setTimeout (() => NOTICE_EL.setHeight (null), 5000)
	}
	function load ( a, p ) {
		load_tpl (a [1], tpl => MAIN.xhr ("people.list", r => {
			a [2](r, tpl [a [1]])
		}, Object.assign ({
			id:	root.User ? root.User.ID : "",
			get:	a [3] || null,
			options:a [4] ? a [4] + (SORT ? "|" + SORT : "") : null
		}, p)))
	}
	function load_tpl ( tpl, cb ) {
		let tpl2 = []
		for (let n of isString (tpl) ? [tpl] : tpl) {
			if (!(n._ in TPL))
				tpl2.push (n)
		}
		if (tpl2.length)
			MAIN.loadTPL (tpl2, tpl => cb (Object.assign (TPL, tpl)))
		else
			cb (TPL)
	}
	function load_css ( css, cb ) {
		let set = () => {
			MAIN.idCSS (CSS).disabled = true
			MAIN.idCSS (css).disabled = false
			CSS = css
			cb ()
		}

		if (css == CSS)
			return cb ()
		if (MAIN.idCSS (css))
			return set ()
		MAIN.loadDesign (css, set)
	}
	function insert_html ( page, html ) {
		PEOPLE.setClass (PAGE, 0).setClass (PAGE = page, 1)
		SB && SB.done ()
		PEOPLE.innerHTML = `<form>${html.tpl ({ WINDOW_TITLE: t => (document.title = t, "") })}</form>`
		if (MAIN.$sb)
			SB = new MAIN.$sb (PEOPLE.first ())
	}
	function reset_page () {
		PEOPLE.setClass (PAGE, 0)
		SB && SB.done ()
		SB = null
		PAGE = ""
	}

	const ACTION = {
		index		() { if (!location.search.length) return index (); location = "people.php" },
		login:		login,
		info:		info,
		form:		form,
		lost:		lost,
		page:		page,
		list:		["", "list", list, "NICK|NICKID|PHOTO", "NO_DELETED|NO_LOCKED", ["size"]],
		lock:		["", "lock", lock, "NICK|NICKID|LOCK|LOCK_PROFILE|LOCK_NICK|LOCK_NICKID|REASON", "CHECKED|LOCKED|NO_DELETED|UNIQUE", ["size"]],
		lock_sort:	sort,
		birthday:	birthday,
		top:		top,
		search:		search,
		go_search:	go_search,
		go_lost:	go_lost
	}

	let FisrtNick = ""
	let PageNum = 0
	let PageSize = 0
	let Pages = 0
	let CSS = "index"
	let TPL = {}
	let INFO = MAIN.$FUNC ["info"] || null
	let FORM = MAIN.$FUNC ["form"] || null
	let PAGE = ""
	let SORT = "SORT_NICK"
	let NOTICE = ""
	let NOTICE_EL = null
	let MODER = 0
	let ADMIN = 0
	let YEAR = []
	let PEOPLE = $("app_people") || document.body
	let SB = null

	"".define ("INCLUDE", {
		root:	PEOPLE,
		html:	n => (n._ in TPL) && TPL [n._].tpl (),
		load:	( n, cb ) => load_tpl (n, tpl => cb (tpl [n._].tpl ()))
	})

	august_touch (PEOPLE, {
		opt: 6,
		end: e => {
			let page = PageNum - e.dx.sign ()
			if (document.body.__loader || Math.abs (e.dx) < 50 || !page || page > Pages || Math.abs (e.dx / e.dy) < 2)
				return
			switch (PAGE) {
				case "list":
					load (MAIN.$ACTION [PAGE], { page: page, first: FisrtNick, size: PageSize })
					break
				case "search":
					go_search (page)
					break
			}
		}
	})
	index (... Notice)
}
