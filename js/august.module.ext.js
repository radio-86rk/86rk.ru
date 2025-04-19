//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.ext.js


August.initModule ("ext", function ( win ) {
	function get_tpl ( ext, fn ) {
		if (!isSet ($TPL [Chat.TPL]))
			$TPL [Chat.TPL] = {}
		if (isSet ($TPL [Chat.TPL][ext]))
			return fn ($TPL [Chat.TPL][ext])
		Chat.loadTPL (`$ext/${ext}`, tpl => {
			tpl = tpl [`$ext/${ext._}`]
			$TPL [Chat.TPL][ext] = tpl
			fn (tpl)
		})
	}
	this.init = function ( data, cmd, rid, ctx ) {
		let win2 = ( param1, param2, fn ) => get_tpl (data.cmd, tpl => {
			if (!param1) {
				param1 = []
			} else if (isArray (param1)) {
				/* void */
			} else if (!isType (param1, Map)) {
				param1 = [{ ... $BASE, ... param1, $list: data.d }]
			} else for (let [ n, p ] of param1) {
				param1 [n] = [{ ... $BASE, ... p }]
			}
			let w = Chat.Win2.show (tpl.pattern (param1).tpl (param2), 0x400)
			fn && fn (w)
		})
		let exec = ( param1, param2, fn ) => get_tpl (data.cmd, tpl => {
			let Out = param1
				? tpl.pattern ([{ ... $BASE, ... param1, $list: data.d }])
				: fn
				? fn (tpl)
				: tpl
			Chat.mout.call (ctx, August.html.mess (Out.tpl ({ ... {
				ACTION:	`\x11${Chat.cfg.Action}\x10`,
				CMD:	cmd
			}, ... param2 }), 0x30000))
		})
		switch (data.cmd) {
			case "game-stat":
				win2 ([{
					MONTH		( l ) { return new Date (data.y, this.$i).lang (l).month () },
					$set		( i ) { this.$c = August.calendar (data.y, i); this.$s = data.d [i] },
					$size		() { return 12 }
				}, {
					DOW		( ... a ) { return a [this.$i] },
					$set		( i ) { this.$day = this.$.$c [i] },
					$size		() { return 7 }
				}, {
					DATE		() { return this.$c ? this.$d | (this.$.$.$i + 1).shl8 | data.y.shl16 : "" },
					DAY		() { return (this.$d || "").toString ().false (1) },
					COUNT		() { return this.$c || "" },
					$set		( i ) { this.$d = this.$.$day [this.$i]; this.$c = this.$.$.$s [this.$d] },
					$size		() { return 6 }
				}], {
					NAME:		data.n.htmlEntities (),
					NAME_ID:	data.g,
					ID:		data.id.toString ().false (1),
					TOTAL:		data.t,
					YEAR:		data.y,
					NEXT_YEAR:	data.ny,
					PREV_YEAR:	data.py,
					PAIR:		"".true (data.p),
					CMD_NEW:	data.cn,
					CMD_LIST:	data.cl,
					CMD_GAMES:	data.cg,
					CMD_STAT:	data.cs.toString ().false (1),
					CMD_PAIR:	data.cp,
					CMD_PLAYERS:	data.cpl,
					CMD_GAMES2:	data.ctg.toString ().false (1)
				})
				break
			case "game-games":
				win2 ({
					PLAYER1		() { return data.pl1.length | data.pl2.length ? "" : this.$d.n1 },
					PLAYER2		() { return data.pl1.length | data.pl2.length ? "" : this.$d.n2 },
					WINNER		() { return data.p ? this.$d.w == 1 ? this.$d.n1 : this.$d.w == 2 ? this.$d.n2 : "" : "" },
					LONG_TIME	( hs, ms ) { return this.$d.t.time (hs, ms) },
					DATE2		( f, l ) { return data.day ? "" : this.$d.d.date (f, l) },
					TIME		() { return data.day ? this.$d.d.date ("HH:ii:ss") : "" },
					PLAYERS		() { return data.p ? "" : this.$d.pl.map (u => `<span>${u}</span>`).join ("") },
					SCORE		() { return data.p ? "" : this.$d.s.map (s => `<span>${(s / 100).locale (2, 2)}</span>`).join ("") },
					VIEW_PARAM	() { return data.p && data.v ? `${this.$d.d}_${this.$d.id1}_${this.$d.id2}` : "" },
					ID:		data.id
				}, {
					NAME:		data.n.htmlEntities (),
					NAME_ID:	data.g.false (1),
					ID:		data.id.toString ().false (1),
					PLAYER1:	data.pl1,
					PLAYER2:	data.pl2,
					TOTAL:		data.d.length,
					PAIR:		"".true (data.p),
					HEADER:		"".true (data.d.length && !data.day),
					HEADER_DAY:	"".true (data.d.length && data.day && !data.p),
					HEADER_DAY_PAIR:"".true (data.d.length && data.day && data.p),
					DAY:		f => data.day.date (f),
					WIDTH:		data.w.toString ().false (1),
					HEIGHT:		data.h.toString ().false (1),
					CMD_NEW:	data.cn,
					CMD_LIST:	data.cl,
					CMD_GAMES:	data.cg,
					CMD_STAT:	data.cs,
					CMD_PAIR:	data.cp,
					CMD_PLAYERS:	data.cpl
				})
				break
			case "game-pair":
				win2 ({
					ID		() { return data.id },
					PLAYER1		() { return this.$d.n1 },
					PLAYER2		() { return this.$d.n2 },
					PLAYER_ID1	() { return this.$d.id1 },
					PLAYER_ID2	() { return this.$d.id2 },
					WIN1		() { return this.$d.w1 },
					WIN2		() { return this.$d.w2 },
					COUNT		() { return this.$d.c }
				}, {
					NAME:		data.n.htmlEntities (),
					NAME_ID:	data.g,
					ID:		data.id,
					PAIR:		"".true (data.p),
					HEADER:		"".true (data.d.length),
					TOTAL:		data.d.length,
					PLAYER:		data.pl,
					CMD_NEW:	data.cn,
					CMD_LIST:	data.cl,
					CMD_GAMES:	data.cg,
					CMD_STAT:	data.cs,
					CMD_PAIR:	data.cp,
					CMD_PLAYERS:	data.cpl,
					CMD_GAMES2:	data.ctg
				})
				break
			case "game-players":
				win2 ({
					ID		() { return data.id },
					WIN		() { return data.p ? this.$d.w.toString () : "" },
					LOSE		() { return data.p ? this.$d.l.toString () : "" },
					PAIR		() { return data.p ? this.$d.p.toString () : "" },
					SCORE		() { return data.p ? "" : ((this.$d.w - this.$d.l) / 100).locale (2, 2) },
					DRAW		() { return data.p && data.r ? (this.$d.c - this.$d.w - this.$d.l).toString () : "".true (data.p) },
					COUNT		() { return this.$d.c },
					PLAYER		() { return this.$d.n },
					PLAYER_ID	() { return this.$d.id }
				}, {
					NAME:		data.n.htmlEntities (),
					NAME_ID:	data.g,
					ID:		data.id,
					PAIR:		"".true (data.p),
					DRAW:		"".true (data.r),
					HEADER:		"".true (data.d.length && !data.p),
					HEADER_PAIR:	"".true (data.d.length && data.p),
					TOTAL:		data.d.length,
					CMD_NEW:	data.cn,
					CMD_LIST:	data.cl,
					CMD_GAMES:	data.cg,
					CMD_STAT:	data.cs,
					CMD_PAIR:	data.cp
				})
				break
			case "game-tables":
				win2 ({
					ID		() { return data.id },
					TABLE		() { return this.$d.t },
					ROOM		() { return this.$d.r },
					HIDDEN		() { return "".true (this.$d.h) },
					JOIN		() { return "".true (this.$d.j) },
					WIDTH		() { return this.$d.j || this.$d.e ? data.w : "" },
					HEIGHT		() { return this.$d.j || this.$d.e ? data.h : "" },
					CMD_HIDDEN	() { return this.$d.ch || "" },
					CMD_DEL		() { return this.$d.cd || "" },
					PLAYERS		() { return this.$d.ul.map (u => `<span>${u}</span>`).join ("") }
				}, {
					NAME:		data.n.htmlEntities (),
					NAME_ID:	data.g,
					ID:		data.id,
					PAIR:		"".true (data.p),
					HEADER:		"".true (data.d.length),
					CMD_NEW:	data.cn,
					CMD_LIST:	data.cl,
					CMD_GAMES:	data.cg,
					CMD_STAT:	data.cs,
					CMD_PAIR:	data.cp,
					CMD_PLAYERS:	data.cpl
				})
				break
			case "game-list":
				win2 ({
					NAME		() { return this.$d.n.htmlEntities () },
					NAME_ID		() { return this.$d.g },
					COUNT		() { return this.$d.c }
				})
				break
			case "room-list":
				win2 ({
					NAME		() { return this.$d.n.htmlEntities () },
					CREATOR		() { return this.$d.cr },
					ACCESS		() { return "".true (this.$d.pr) },
					PUBLIC		() { return "".true (this.$d.p) },
					OWNER		() { return "".true (this.$d.o) },
					COUNT		() { return this.$d.c }
				}, {
					CREATE:		"".true (data.a),
					HEADER:		"".true (data.d.length)
				})
				break
			case "ignores":
				win2 (new Map ().set (
					"IGNORE", {
						$list:		data.i
					}).set (
					"TOTAL", {
						REMOVE		() { return "".true (this.$d.kwa) },
						VISIBLE		() { return "".true (this.$d.v) },
						MATOTESTER	() { return "".true (this.$d.km) },
						VOTE		() { return "".true (this.$d.kv) },
						KILLER		() { return this.$d.kn },
						LOCK		() { return this.$d.l },
						LOCKDATE	() { return this.$d.ld },
						FREEDATE	() { return this.$d.fd },
						$list:		data.t
					})
				)
				break
			case "ban":
				win2 ({
					BAN_NICK	() { return this.$d.bn },
					ENTER		( f, l ) { return f ? this.$d.e.date (f, l) : this.$d.e },
					BAN		( f, l ) { return f ? this.$d.b.date (f, l) : this.$d.b },
					LAST		( f, l ) { return f ? this.$d.l.date (f, l) : this.$d.l },
					COUNT		() { return this.$d.c },
					OFFLINE		( ds, hs, ms ) { return this.$d.o ? this.$d.o.days (ds, hs, ms) : "" },
					SHUTUP		() { return "".true (this.$d.bs) },
					TOTALIGNORE	() { return "".true (this.$d.bt) },
					REVERSE		() { return "".true (this.$d.br) },
					CAPS		() { return "".true (this.$d.bc) },
					ABRACADABRA	() { return this.$d.ba },
					VOWEL		() { return this.$d.bv },
					MODER		() { return this.$d.m },
					ID		() { return this.$d.id || "" }
				}, null, w => {
					Chat.Win2.set (0xc10)
				})
				break
			case "locklog":
				win2 ({
					LOCK		() { return this.$d.l },
					LOCKNICK	() { return this.$d.ln },
					KILLER		() { return this.$d.kn },
					COMP		() { return "".true (this.$d.c) },
					MATOTESTER	() { return "".true (this.$d.kmt) },
					VOTE		() { return "".true (this.$d.kv) }
				})
				break
			case "censorlog":
				win2 ({
					WORD		() { return this.$d.w },
					PATTERN		() { return this.$d.p }
				})
				break
			case "ip":
				win2 ({
					ENTER		( f, l ) { return f ? this.$d.e.date (f, l) : this.$d.e },
					QUIT		( f, l ) { return f ? this.$d.q.date (f, l) : this.$d.q }
				}, null, w => {
					Chat.Win2.set (0xc10)
				})
				break
			case "whois":
				exec (null, null, tpl => tpl.define ("IPv4", ip => ip.ip ()).xtpl ("IPINFO", data.d))
				break
			case "systemtest": {
				let a = {
					IP:	data.ip.ip ().false (1),
					YES:	"".true (data.r)
				}
				for (let s of ["blacklist", "tor", "cloud"])
					a [s.toUpperCase ()] = "".true (s == cmd)
				exec (null, a)
				break
			}
			case "privset":
				exec (null, {
					NICK:		data.n,
					ADD:		data.c > 0 ? data.c : 0,
					SUB:		data.c < 0 ? -data.c : 0
				})
				break
			case "compinfo":
				exec (null, {
					NICK:		data.n
				},
				tpl => tpl.define ("IPv4", ip => ip.ip ()).xtpl ("CINFO", data.d))
				break
			case "setupinfo": {
				let nss = data.d.ns && data.d.ns < 10;
				let mss = data.d.ms && data.d.ms < 10;
				exec (null, {
					NICK:		data.n,
					NICK_COLOR:	data.d.nc,
					NICK_FONT:	data.d.nf,
					NICK_ITALIC:	"".true (nss && (data.d.ns & 4)),
					NICK_NORMAL:	"".true (nss && (data.d.ns & 4) == 0),
					NICK_BOLD:	"".true (nss && (data.d.ns & 3) == 2),
					NICK_SLIM:	"".true (nss && (data.d.ns & 3) == 1),
					MESS_COLOR:	data.d.mc,
					MESS_FONT:	data.d.mf,
					MESS_ITALIC:	"".true (mss && (data.d.ms & 4)),
					MESS_NORMAL:	"".true (mss && (data.d.ms & 4) == 0),
					MESS_BOLD:	"".true (mss && (data.d.ms & 3) == 2),
					MESS_SLIM:	"".true (mss && (data.d.ms & 3) == 1),
					MESS_COUNT:	User.MAX_MESS [data.d.cnt],
					DESIGN:		data.d.des,
					DESIGN_NAME:	Chat.cfg.DesignList [data.d.des] && Chat.cfg.DesignList [data.d.des].n || "",
					DIR:		"".true (data.d.dir)
				})
				break
			}
			case "debug":
				exec (null, {
					COUNT1:		data.c [0],
					COUNT2:		data.c [1],
					COUNT3:		data.c [2],
					COUNT4:		data.c [3],
					COUNT5:		data.c [4],
					COUNT6:		data.c [5],
					COUNT7:		data.c [6]
				})
				break
			case "debug-conn":
				exec ({
					NUM		() { return this.$i + 1 },
					NICK		() { return this.$d.n },
					TIME		() { return this.$d.t },
					IP		() { return this.$d.ip [0].ip () },
					PROXY		() { return this.$d.ip [1] ? this.$d.ip [1].ip () : "" },
					CITY		() { return this.$d.c },
					COUNTRY		() { return Chat.cfg.Country && Chat.cfg.Country [this.$d.co] || "" }
				})
				break
			case "list":
				exec ({
					ENTRY ( f, l ) {
						return this.$d.e.date (f, l)
					},
					ONLINE ( ds, hs, ms ) {
						return this.$d.o.days (ds, hs, ms)
					},
					RANK () {
						return this.$d.r
					},
					STAT ( lo ) {
						let s = Chat.cfg.UserStatus [this.$d.s]
						return isSet (s) ? s.s [this.$d.x] : ""
					},
					STAT_ICON () {
						let s = Chat.cfg.UserStatus [this.$d.s]
						return isSet (s) && isSet (s.i)
							? August.html.img (`//${Chat.Host}/images/${s.i}`, s.w, s.h, 0, "", "", "", s.s [this.$d.x], "stat")
							: ""
					},
					PHOTO () {
						return "".true (this.$d.p)
					},
					INVISIBLE () {
						return "".true (this.$d.i)
					},
					INVISIBLE_ICON ( t ) {
						if (!this.$d.i)
							return ""
						let Icon = new Image ()
						Icon.src = `images/${Chat.cfg.icon.invisible.t}`
						return August.html.img (Icon.src, Icon.width || null, Icon.height || null, 0, "middle", "", "", t || "invisible", "invisible")
					}
				}, {
					TOTAL:		data.t
				})
				break
			case "ignore":
			case "ignore-list":
			case "friends":
			case "friends-list":
				exec ({})
				break
			case "away":
				exec ({
					AWAY		( ds, hs, ms ) { return this.$d.a ? this.$d.a.days (ds, hs, ms) : "" }
				})
				break
			case "stat":
				exec (null, {
					COUNT1:		data.c1,
					COUNT2:		data.c2,
					COUNT3:		data.c3,
					COUNT4:		data.c4,
					COUNT5:		data.c5,
					COUNT6:		data.c6,
					MAX:		data.mx,
					MAXTIME:	data.mt.date ("HH:ii:ss"),
					START:		( f, l ) => data.d.date (f, l)
				})
				break
			case "visit":
				exec (null, {
					SELF:		"".false (data.n),
					NOREG:		"".true (data.t < 0),
					NICK:		`<nick>${data.n}</nick>`.false (1),
					DATE2:		( f, l ) => data.t > 0 ? data.t.date (f, l) : ""
				})
				break
			case "vote": {
				let v = data.s ? Chat.cfg.notice.vote : ""
				if (v) {
					let n = v.t.tpl ({
						NICK:		data.n,
						WATCH:		t => `<a data-cmd=0>${t}</a>`,
						YES:		t => `<a data-cmd=1>${t}</a>`,
						NO:		t => `<a data-cmd=2>${t}</a>`
					})
					v = August.html.mess (v.p ? `\x11${v.p}${/^\d$/.test (v.p) ? "" : "\x13"}${n}\x10` : n, 0x30000)
				}
				win2 (null, {
					NICK:		data.s ? data.n : "",
					ID:		data.id.toString ().false (1),
					TOTAL_TIME:	( hs, ms ) => data.s ? (data.t * 60).time (hs, ms, 1) : "",
					VOTE_NOTICE:	v,
					START:		"".true (data.s),
					TEXT:		data.d.map (t => `<div class=ph>${August.html.mess (t, User.Set)}<!'"'\`\`></div>`).join ("")
				}, w => {
					w.id = `win2_vote_${data.id}`
					Chat.Win2.set (0x412)
				})
				break
			}
			case "setup design": {
				let d = []
				for (let id in Chat.cfg.DesignList)
					d.push ({ id, n: Chat.cfg.DesignList [id].n })
				cmd = data.cmd
				data = { cmd: "design-list", d }
				exec ({
					ID		() { return this.$d.id },
					NAME		() { return this.$d.n }
				})
				break
			}
			case "calendar": {
				let Now = new Date
				let y = Now.getFullYear ()
				let m = Now.getMonth ()
				if (cmd && /^(?:(\d\d\d\d)(?:[-./](\d\d?))|(?:(\d\d?)[-./])?(\d\d\d\d)|(\d\d?))$/.test (cmd)) {
					let m0 = +(RegExp.$5 || RegExp.$2 || RegExp.$3)
					let y0 = +(RegExp.$1 || RegExp.$4)
					if (m0 >= 1 && m0 <= 12)
						m = m0 - 1
					if (y0)
						y = y0
				}
				Chat.addCSS ("inline-calendar", () => get_tpl (data.cmd, tpl => {
					let id = ++$CalID
					let calendar = ( y, m ) => {
						if (m == -1) {
							y--
							m = 11
						} else if (m == 12) {
							y++
							m = 0
						}
						let cur = m.shl8 | new Date ().getDate ()
						let c = August.calendar (y, m)
						return August.html.mess (tpl.pattern ([{
							DOW		( ... a ) { return a [this.$i] },
							$size		() { return 7 }
						}, {
							DAY		() { return this.$d || "" },
//							DAY		() { return this.$d ? `<a name=ctrl data-cal=${id} data-a=cal-day data-d=${y.shl16 | m.shl8 | this.$d}>${this.$d}</a>` : "" },
							CUR		() { return "".true (cur == (m.shl8 | this.$d)) },
							$set		() { this.$d = c [this.$.$i][this.$i] },
							$size		() { return 6 }
						}], {
							YEAR:		y,
							MONTH:		l => new Date (y, m).lang (l).month (),
							PREV_MON:	l => new Date (y, m > 0 ? m - 1 : 11).lang (l).month (),
							NEXT_MON:	l => new Date (y, m < 11 ?  m + 1 : 0).lang (l).month (),
							PREV:		t => `<a id=__prev name=ctrl data-cal=${id} data-a=calendar data-y=${y} data-m=${m - 1}>${t}</a>`,
							NEXT:		t => `<a id=__next name=ctrl data-cal=${id} data-a=calendar data-y=${y} data-m=${m + 1}>${t}</a>`,
							PREV_YEAR:	`<a name=ctrl data-cal=${id} data-a=calendar data-y=${y - 1} data-m=${m}>${y - 1}</a>`,
							NEXT_YEAR:	`<a name=ctrl data-cal=${id} data-a=calendar data-y=${y + 1} data-m=${m}>${y + 1}</a>`,
							ACTION:		`\x11${Chat.cfg.Action}\x10`,
							CMD:		data.cmd
						}), 0x30000)
					}
					let div = Chat.mout.call (ctx, calendar (y, m))
					div.id = `__cal_${id}`
					div.cal = calendar
					div.ym = n => { let a = div.$(`a#__${n}`); return [+a.dataset.y, +a.dataset.m] }
					div.swipe (_ => { div.innerHTML = calendar (... div.ym ("next")) }, _ => { div.innerHTML = calendar (... div.ym ("prev")) })
				}))
				break
			}
			case "help":
				Chat.http ().send (`txt/ext-help-${cmd}.${Chat.Lang}.txt`, ( r, s ) => {
					if (s >= 300)
						return Chat.error ("text")
					Chat.mout.call (ctx, August.html.mess (r.tpl ({
						ACTION:	`\x11${Chat.cfg.Action}\x10`,
						CMD:	cmd
					}), 0x30000))
				})
				break
		}
	}
	August.clickHandler (win, el => {
		if (el.dataset.a == "play-game") {
			let r = ~~el.dataset.r
			let w = ~~el.dataset.w
			let h = ~~el.dataset.h
			let g = el.dataset.g
			let p = el.dataset.p
			if (!p)
				Chat.loadModule ("private", [r, 11, g, [w, h]])
			else if (User.ID)
				Chat.wwo (`php/game.php/${g}`, `${User.ID4}R${p}`, `game_${g}_${User.ID4}R${p}`, { w, h, f: 66 }, 0)
		} else if (el.dataset.a == "calendar") {
			let div = $(`__cal_${el.dataset.cal}`, win)
			div.innerHTML = div.cal (+el.dataset.y, +el.dataset.m)
		} else if (el.dataset.a == "cal-day") {
		}
	})

	let $CalID = 0
	const $TPL = {}
	const $BASE = {
		DATE2		( f, l ) { return this.$d.d.date (f, l) },
		NUM		() { return (this.$i + 1).toString () },
		NICK		() { return this.$d.n.false (1) },
		ID		() { return this.$d.id.toString ().false (1) },
		NO		() { return "".false (this.$d.on) },
		ON		() { return "".true (this.$d.on & 1) },
		OFF		() { return "".true (this.$d.on & 2) },
		IP		() { return this.$d.ip ? this.$d.ip.ip () : "" },
		PROXY		() { return this.$d.pr ? this.$d.pr.ip () : "" },
		CID1		() { return this.$d.cid1 },
		CID2		() { return this.$d.cid2 },
		TOR		() { return "".true (this.$d.tor) },
		CO		() { return this.$d.co == "aa" ? "" : this.$d.co },
		FLAG		() { return this.$flag (":") },
		SMALL_FLAG	() { return this.$flag (";") },
		$size		() { return this.$list.length },
		$set		( i ) { this.$d = this.$list [i] },
		$flag		( r ) {
			let co = this.CO ()
			let cn = Chat.cfg.Country && co && Chat.cfg.Country [co] || ""
			return co ? `\x11${co}${r}${cn}\x10` : ``
		}
	}
})
