//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.userlist.js


August.initModule ("userlist", function ( win ) {
	let $user = {
		NICK		() { return August.html.nick_code (this.$u.n, this.$u.id.dd (), this.$u.a) },
		ICON		( t1, t2 ) { if (!this.$u.r) return ""; return this.$info (this.$u.ui ? this.$icon (t1, t2) : ((t2 && t2.length && this.$u.k) ? this.$img (1, this.$alt (t2), "icon") : (this.RANK_ICON () || this.$img (this.$u.k ? "killer" : "info", "", "icon"))), t1) },
		RANK		() { if (!this.$u.r) return ""; let r = this.$rank (); return r ? r.t : "" },
		RANK_ICON	( i ) { if (!this.$u.r) return ""; let r = this.$rank (); if (r) r = r.p ? August.html.img ("@/images/" + r.p, r.w, r.h, 0, "", "", "", r.t, "icon") : this.$img ("info", r.t, "icon"); return r ? i ? this.$info (r) : r : "" },
		USER_ICON	( t1, t2, i ) { let r = this.$u.ui ? this.$icon (t1, t2) : ""; return i ? this.$info (r) : r },
		AVATAR		( i ) { return this.$u.av ? August.html.img (`@/people/avatar/${this.$u.av.hex (4)}.${this.$u.av.ext ()}`, null, null, null, 0, 0, 0, "", `avatar${i ? " info" : ""}`, "", null, `data-userinfo=${i ? this.$u.id : 0}`) : "" },
		STAT		() { if (this.$u.v == 7) return ""; let s = this.$stat ().replaceAll ([August.html.SMILE_RE, August.html.USER_SMILE_RE], [August.html.smile, August.html.user_smile]); return s ? `<span class=s>${s}</span>` : s },
		STAT_ICON	() { let s = Chat.cfg.UserStatus [this.$u.s >> 12 & 0x3f]; return (isSet (s) && isSet (s.i)) ? August.html.img ("@/images/" + s.i, s.w, s.h, 0, 0, 0, 0, s.s [this.$u.x].replace (August.html.SMILE_RE, " ").trim (), "stat") : "" },
		STAT_TEXT	() { return this.$text (this.$stat ()).stripTags () },
		USER_STAT	() { return (this.$u.v != 7 && this.$u.us) ? `<span class=s>${this.$u.p3.replaceAll ([August.html.SMILE_RE, August.html.USER_SMILE_RE], [August.html.smile, August.html.user_smile])}</span>` : `` },
		SEX_ICON	() { return this.$u.x == 1 ? this.$img ("male") : this.$u.x == 2 ? this.$img ("female") : "" },
		CAKE_ICON	() { return this.$u.s & 0x00800000 ? this.$img ("cake", "", "cake") : "" },
		INVISIBLE_ICON	( t ) { return this.$u.s & 0x01000000 ? this.$img ("invisible", t || "invisible", "invisible") : "" },
		PHOTO_ICON	( t ) { return this.$u.p & 0x0400 ? this.$img ("photo", t || "photo", "photo") : "" },
		SHUTUP_ICON	( t ) { return this.$u.p & 0x0800 ? this.$img ("shutup", t || "shutup", "shutup") : "" },
		MOBILE_ICON	( t ) { return this.$u.p & 0x8000 ? this.$img ("mobile", t || "mobile", "mobile") : "" },
		WEBCAM_ICON	( t ) { return this.$u.p & 0x1000 ? `<a class=stat module=1 name=webcam args='3:${this.$u.id}'>${this.$img ("webcam", t || "webcamera")}</a>` : `` },
		FLAG		() { return August.html.flag (this.$co ()) },
		FLAG_INFO	() { return this.$u.r ? this.$info (this.FLAG ()) : this.FLAG () },
		SMALL_FLAG	() { return August.html.flag (this.$co (), 1) },
		CO		() { return this.$co () },
		COUNTRY		() { return this.$country () },
		SEX		() { return this.$u.x },
		CAKE		() { return "".true (this.$u.s & 0x00800000) },
		INVISIBLE	() { return "".true (this.$u.s & 0x01000000) },
		PHOTO		() { return "".true (this.$u.p & 0x0400) },
		SHUTUP		() { return "".true (this.$u.p & 0x0800) },
		WEBCAM		() { return "".true (this.$u.p & 0x1000) },
		TOTAL		() { return "".true (this.$u.p & 0x2000) },
		MOBILE		() { return "".true (this.$u.p & 0x8000) },
		BOT		() { return "".true (this.$u.id < 100) },
		VOTE		( ... m ) { return vote.apply (this, m) },
		ENTER		( f, l ) { return this.$u.d [0].date (f, l) },
		QUIT		( f, l ) { return this.$u.d [1].date (f, l) },
		LONG_AGO	( ds, hs, ms ) { return this.$u.d [2].days (ds, hs, ms) },
		LONG_TIME	( hs, ms ) { return this.$u.d [3].time (hs, ms) },
		COUNT1		() { return this.$u.d [4] },
		COUNT2		() { return this.$u.d [5] },
		COUNT3		() { return this.$u.d [6] },

		$size		() { return this.$LIST.length },
		$set		( i ) { this.$u = this.$LIST [i]; return this },
		$setList	( i ) { this.$LIST = this.$DATA [i] || this.$DATA.last (); this.$v = i == 3 },
		$nick		( t ) { return August.html.nick (this.$u.n, t) },
		$alt		( t ) { return t.tpl ({ NICK: this.$nick (1), RANK: this.RANK () }) },
		$text		( s ) { let t = ( ... a ) => a [6]; return s.replaceAll ([August.html.SMILE_RE, August.html.USER_SMILE_RE], [t, t]) },
		$stat		() { let s = this.$u.s >> 12 & 0x3f; return this.$u.us ? this.$u.p3 : (s && isSet (Chat.cfg.UserStatus [s])) ? Chat.cfg.UserStatus [s].s [this.$u.x].toLowerCase () : "" },
		$rank		() { return Chat.cfg.Ranks ? Chat.cfg.Ranks [this.$u.s & 0xff] : null },
		$icon		( t1, t2 ) { let r = this.$rank (); return August.html.img (`@/people/icon/${this.$u.ui [1].hex (3)}${this.$u.ui [0].hex (3)}.${(this.$u.s >> 18).ext (1)}`, (this.$u.ui [0] & 0x7f) + 3, (this.$u.ui [0] >> 7 & 0x7f) + 3, 0, "", "", "", r ? r.t : this.$alt (t2 && t2.length && this.$u.k ? t2 : (t1 || "")), "icon") },
		$info		( i, t1 ) { return `<a data-userinfo=${this.$u.id} title='${this.$alt (t1 || "")}'>${i}</a>` },
		$img		( i, title, cl ) { return (this.$IMG [i].complete && this.$IMG [i].width) ? August.html.img (this.$IMG [i].src, this.$IMG [i].width, this.$IMG [i].height, 0, "", "", "", title, cl) : "" },
		$co		() { let a1 = this.$u.p & 0x1f; let a2 = this.$u.p >> 5 & 0x1f; return (a1 || a2) ? String.fromCharCode (a1 + 0x61) + String.fromCharCode (a2 + 0x61) : "" },
		$country	() { return Chat.cfg.Country && Chat.cfg.Country [this.$co ()] || "" },

		$u:		null,
		$LIST:		null
	}

	function vote ( ... m ) {
		if (!this.$u.v)
			return ""
		let id = this.$u.id
		let p3 = this.$u.p3
		return m [(this.$u.v - 1) & 3].tpl ({
			WATCH:		t => Chat.ctrl ("vote", t, { cmd: 0, id }),
			YES:		t => Chat.ctrl ("vote", t, { cmd: 1, id }),
			NO:		t => Chat.ctrl ("vote", t, { cmd: 2, id }),
			CANCEL:		t => Chat.ctrl ("ignore", t, { cmd: 4, id }),
			FREE:		( f, l ) => p3 ? p3.date (f, l) : "",
			VOTERS:		p3 ? p3.w0 : "",
			VOTERS_YEA:	p3 ? p3.w1 : ""
		}).true (1)
	}
	function click ( e ) {
		let id = +e.$.dataset.userinfo
		if (id)
			return Chat.userinfo (id)
		let el = e.$.up (Chat.panel, el => el.hasClass ("row"))
		if (el) {
			if ($Sel && $Sel != el)
				$Sel.setClass ("sel")
			$Sel = el.setClass ("sel") ? el : null
			return false
		}
	}
	function refresh () {
		if (!self.is_online () || $tr === false)
			return
		win.clearTimeout ($tr)
		$tr = win.setTimeout (arguments.callee, 15000)
		Chat.xhr ()("online", r => show_online ({ a: r.Auth, l: r.UserList }), {
			id:	User.ID,
			r:	$Room
		})
	}
	function changeRoom () {
		let v = +this.value
		if (!v)
			return this.value = $Room + 1
		if (v - 1 == $Room)
			return
		$Room = v - 1
		who ().innerHTML = ""
		if ($INNER)
			Chat.focus ()
		refresh ()
	}
	function online ( list ) {
		let select = t => {
			let o = {}
			if (t)
				o [0] = t
			for (let i in Chat.cfg.Rooms)
				o [+i + 1] = Chat.cfg.Rooms [i].n
			return August.form.select ("", Chat.Room + 1, o, "id=select_room class=inp")
		}
		$tpl_on.get (tpl => {
			$LIST = "online"
			Chat.panel.innerHTML = tpl.who.tpl ({
				SELECT_ROOM:	( t ) => Chat.cfg.Rooms ? select (t) : "",
				GO_ROOM:	( t, tit ) => $INNER && Chat.cfg.Rooms ? August.form.button ("go-room", t, tit, "class=btn") : "",
				INNER:		"".true ($INNER)
			})
			Chat.$psb && Chat.$psb.scrollTo (0)
			$GAG = who ().innerHTML
			who ().innerHTML = ""
			let sr = Chat.panel.$("#select_room")
			if (sr)
				sr.onchange = changeRoom
			if (list)
				show_online ({ a: !!User.ID, l: list })
			else
				refresh ()
			set_title ()
		})
	}
	function offline () {
		if (self.is_offline ())
			return
		$tpl_off.get (tpl => Chat.xhr ()("offline", r => {
			$LIST = "offline"
			let DATA = [[], [], [], [], []]
			for (let d of r.UserList) {
				let n = d.shift ()
				let p = d.shift ()
				let s = d.shift ()
				let c = [d.shift (), d.shift ()]
				let x = s >> 20 & 3
				let u = {
					n:  n,
					id: p.w0,
					p:  p.w1,
					s:  s,
					x:  x,
					d:  d,
					ui: s & 0x000c0000 ? c : null,
					r:  s & 0x00400000,
					a:  0,
					ad: s & 0x14000000
				}
				DATA [x].push (u)
				DATA.last ().push (u)
				if (u.ad)
					DATA [$USER_LIST.ADMINS].push (u)
			}
			$user.$DATA = DATA
			let ListA = 0
			tpl.whowas.tpl ({
				LIST:	n => {
					if ((isString (n) ? $USER_LIST [n] : n) === $USER_LIST.ADMINS)
						ListA = 1
				}
			})
			Chat.panel.innerHTML = tpl.whowas.tpl ({
				LIST:	n => {
					if (isString (n))
						n = $USER_LIST [n]
					let r = ""
					$user.$setList (n)
					for (let i = 0; i < $user.$size (); i++) {
						if (!ListA || !DATA [n][i].ad || n === $USER_LIST.ADMINS)
							r += tpl.whowas_row.tpl ($user.$set (i))
					}
					return r
				},
				TOTAL:	r.UserList.length,
				INNER:	"".true ($INNER)
			})
			Chat.$psb && Chat.$psb.scrollTo (0)
			who ().onclick = click
			set_title ()
		}, {
			id:	User.ID,
			r:	$Room
		}))
	}
	function show_online ( Args ) {
		if (!self.is_online ())
			return
		if (!Args.l) {
			who ().innerHTML = $GAG
			return
		}
		$Online = Args
		let DATA = [[], [], [], [], [], []]
		let Total = 0
		for (let d of Args.l) {
			let s = d [2]
			let p = d [1].w1
			let x = s >> 20 & 3
			let v = s >> 29 & 0x07
			let us = s & 0x02000000 ? 1 : 0
			let ui = s & 0x000c0000
			let id = d [1].w0
			let ni = 3 + (v & 4 || us)
			let u = {
				n:  d [0],
				id: id,
				p:  p,
				s:  s,
				x:  x,
				v:  Args.a ? v : 0,
				us: v & 4 ? 0 : us,
				p3: d [3],
				ui: ui ? [d [ni], d [ni + 1]] : 0,
				av: p & 0x4000 ? d.last () : 0,
				a:  Args.a,
				r:  s & 0x00400000,
				k:  s & 0x08000000,
				ad: s & 0x14000000 && id > 99
			}
			DATA [id > 99 ? x : 4].push (u)
			if (id > 99)
				DATA.last ().push (u)
			if (u.ad)
				DATA [$USER_LIST.ADMINS].push (u)
			if (id > 99)
				Total++
		}
		$user.$DATA = DATA
		let ListA = 0
		$tpl_on.tpl ().who_list.tpl ({
			LIST:	n => {
				if ((isString (n) ? $USER_LIST [n] : n) === $USER_LIST.ADMINS)
					ListA = 1
			}
		})
		let w = who ()
		if (!w)
			return
		w.onclick = click
		let HTML = $tpl_on.tpl ().who_list.tpl ({
			LIST:	n => {
				if (isString (n))
					n = $USER_LIST [n]
				let r = ""
				$user.$setList (n)
				for (let i = 0; i < $user.$size (); i++) {
					if (!ListA || !DATA [n][i].ad || n === $USER_LIST.ADMINS)
						r += $tpl_on.tpl ().who_row.tpl ($user.$set (i))
				}
				return r
			},
			TOTAL:	Total
		})
		August.sync (win, _ => {
			w.innerHTML = HTML
		})
	}
	function set_title () {
		let t = Chat.panel.$("#title")
		if (!$INNER && t)
			document.title = t.textContent
	}
	function who () {
		return Chat.panel.$("#who")
	}
	this.is_online = function () {
		return $LIST === "online"
	}
	this.is_offline = function () { 
		return $LIST === "offline"
	}
	this.shown = function () {
		return $LIST !== null
	}
	this.room = function () {
		return $Room
	}
	this.add = function ( a ) {
		Object.assign ($user, a)
	}
	this.done = function () {
		win.clearTimeout ($tr)
		$LIST = null
	}
	this.init = function ( run, arg ) {
		if (Chat.cfg.RanksUpdate != Chat.update.r) {
			Chat.cfg.RanksUpdate = Chat.update.r
			Chat.xhr ()("cfg.ranks", r => {
				Chat.cfg.Ranks = []
				if (isArray (r))
					r.forEach (r => { Chat.cfg.Ranks [r.id] = r })
			}, `/${Chat.update.r}`, 1)
		}
		Chat.initPanel (this)
		Chat.addCSS (["main", "userlist"], () => {
			Chat.showPanel ("userlist")
			if (!run)
				run = "online"
			$Room = Chat.Room
			$FUNC [run] && $FUNC [run](arg)
		})
	}

	const self = this
	const $tpl_on = Chat.tpl (["who", "who-list", "who-row"])
	const $tpl_off = Chat.tpl (["whowas", "whowas-row"])
	const $USER_LIST = new Enum ('NONE', 'GUYS', 'GIRLS', 'ADMINS', 'BOTS')
	const $FUNC = { online, offline, refresh }
	const $INNER = !!root.Chat.chat
	let $LIST = null
	let $GAG = ""
	let $tr = 0
	let $Sel = 0
	let $Room = Chat.Room
	let $Online = {}
	$user.$IMG = {
		info:		"",
		male:		"",
		female:		"",
		killer:		"",
		invisible:	"",
		shutup:		"",
		photo:		"",
		cake:		"",
		webcam:		"",
		mobile:		""
	}
	if (Chat.cfg.icon) {
		for (let n in $user.$IMG) {
			if (Chat.cfg.icon [n]) {
				$user.$IMG [n] = new Image
				$user.$IMG [n].src = `images/${Chat.cfg.icon [n].t.tpl ()}`
			}
		}
	}

	Chat.Event.on ("ul-refresh", refresh)
	.on ("user-init", refresh)
	.on ("user-reset", refresh)
	.on ("userlist", ( a, l ) => {
		if (Chat.$PanelShown && $Room == Chat.Room) {
			win.clearTimeout ($tr)
			show_online ({ a, l })
		}
	}).on ("destroy", () => {
		win.clearTimeout ($tr)
		$tr = false
	}).on ("reinit", () => {
		$tr = 0
		if ($LIST) {
			let f = $LIST
			$LIST = null
			self.init (f)
		}
	}).on ("event", ( ev, id, p1, p2 ) => {
		if (!$Online.l)
			return
		let u = $Online.l.find (( u, i ) => (u.idx = i, u [1].w0 == id))
		if (ev == "UL_ADD") {
			if (p2 [1] < 0)
				return
			if (u)
				u [2] &= ~0x01000000
			else
				p2.unshift (p1), $Online.l.push (p2)
			show_online ($Online)
			return
		}
		if (!u)
			return
		switch (ev) {
			case "UL_DEL":
				$Online.l.delete (u.idx)
				break
			case "UL_STAT":
				u [2] &= ~0x0003f000
				u [2] |= p1 << 12
				if (u [2] & 0x02000000) {
					u [2] &= ~0x02000000
					u.delete (3)
				}
				break
			case "UL_USTAT":
				if (u [2] & 0x02000000)
					u [3] = p1
				else
					u.insert (3, p1)
				u [2] &= ~0x0003f000
				u [2] |= 0x02000000
				break
			case "UL_ICON":
				let av = u [1] & 0x40000000 ? u.pop () : 0
				if (u [2] & 0x000c0000)
					u.length -= 2
				u [2] &= ~0x000c0000
				if (p1) {
					u [2] |= p1 << 18
					u.push (p2 [0])
					u.push (p2 [1])
				}
				if (av)
					u.push (av)
				break
			case "UL_NICK":
				u [0] = p1
				break
			case "UL_AVATAR":
				if (u [1] & 0x40000000) {
					u.pop ()
					u [1] &= ~0x40000000
				}
				if (p1) {
					u [1] |= 0x40000000
					u.push (p1)
				}
				break
			case "UL_VOTE":
				u [2] &= ~0xe0000000
				u [2] |= p1 << 29
				break
			case "UL_STAT2":
				u [1] &= 0xffff
				u [1] |= p1 << 16
				break
			default:
				return
		}
		show_online ($Online)
	})
	August.clickHandler (win, el => {
		if (el.name == "go-room")
			return Chat.goRoom (Chat.panel.$("#select_room").value - 1), false
		return true
	})
	if (opener)
		document.onkeydown = e => e.closeWin ()
})
