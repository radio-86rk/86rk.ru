//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.kill.js


August.initModule ("kill", function ( win ) {
	function kill ( e ) {
		if (!/\S/.test (this.reason.value)) {
			this.reason.setClass ("blink", 1).focus ()
			return false
		}
		let t = $Cur.t ? this.total : this.shutup
		let data = {
			id:	User.ID,
			sess:	Chat.sess,
			id2:	$Cur.id2,
			period:	t ? t.options [t.selectedIndex].text : ""
		}
		for (let f of this) {
			let v = August.form.$val (f)
			if (v !== null)
				data [f.name] = v
		}
		Chat.xhr ()("kill", r => {
			return r === "OK"
				? Chat.Win2.close ($(`kill_${$Cur.id2}`))
				: Chat.error (isString (r) ? r : "???")
		}, data)
		return false
	}
	function click ( e ) {
		if (e.$.is ("A")) {
			$Cur.f.reason.value = e.$.textContent
			$Cur.f.reason.focus ()
			return false
		}
		if (e.$.form && e.$.name == "action") {
			if (e.$.value == 1) {
				$Cur.t = 0
				showPanel ("panel_rank3", 1)
				showPanel ("panel_rank1", 0)
				showPanel ("panel_lock", 0)
			} else {
				$Cur.t = 1
				showPanel ("panel_rank3", 0)
				showPanel ("panel_rank1", 1)
				showPanel ("panel_lock", 1)
			}
		} else if (e.$.form && e.$.name == "anonym" && e.$.checked) {
			$Cur.f.name.focus ()
		}
		return true
	}
	function showPanel ( name, show ) {
		let p = $Cur.f [name]
		if (p)
			p.display (show ? "block" : "none")
		return p
	}
	function setPanel ( t ) {
		$Cur.t = t
		showPanel ("panel_rank3", !t)
		showPanel ("panel_rank1", t)
		showPanel ("panel_lock", t)
	}
	function userlist ( tpl, list ) {
		return tpl.pattern ([{
			NICK	() { return August.html.mess (list [this.$i][0]) },
			ENTER	( f, l ) { return list [this.$i][1].date (f, l) },
			QUIT	( f, l ) { return list [this.$i][2] ? list [this.$i][2].date (f, l) : "" },
			$size	() { return list.length }
		}])
	}
	this.select = function ( n, view ) {
		$Cur = $WIN [view.id2]
	}
	this.close = function ( n, view ) {
		delete $WIN [view.id2]
	}
	this.done = function () {
		$WIN.length = 0
	}
	this.init = function ( ID2 ) {
		if ($(`kill_${ID2}`)) {
			let n = Chat.Win2.get_tab ($(`kill_${ID2}`))
			if (n >= 0)
				return Chat.Win2.tab (n)
		}
		Chat.xhr ()("kill", Kill => {
			if (isString (Kill))
				return Chat.error (Kill)
			Chat.addCSS ("kill", () => $tpl.get (tpl => {
				let HTML = "<form class=kill>?</form>".format (tpl.kill.tpl ({
					NICK:		Kill.NICK,
					ONLINE:		"".true (Kill.ONLINE),
					HIDDEN:		"".true (Kill.HIDDEN),
					ACTION_PANEL:	Kill.KILLER == 1
						? "<input type=hidden name=action value=1>"
						: Kill.ONLINE
						? tpl.kill_action
						: "<input type=hidden name=action value=2>",
					LOCK_PANEL:	Kill.KILLER > 2 ? tpl.kill_lock.tpl ({
						NET:		Kill.NET,
						IP:		"".true (Kill.IP),
						PROXY:		"".true (Kill.PROXY),
						CID1:		"".true (Kill.CID1),
						CID2:		"".true (Kill.CID2),
						TOR:		"".true (Kill.TOR)
					}) : "",
					KILLER1_PANEL:	Kill.KILLER > 2 ? tpl.kill_killer1 : "",
					KILLER3_PANEL:	tpl.kill_killer3,
					PROXY_LIST:	() => userlist (tpl.kill_userlist, Kill.USERS_PROXY),
					IP_LIST:	() => userlist (tpl.kill_userlist, Kill.USERS_IP),
					NET_LIST:	() => userlist (tpl.kill_userlist, Kill.USERS_NET),
					CID1_LIST:	() => userlist (tpl.kill_userlist, Kill.USERS_CID1),
					CID2_LIST:	() => userlist (tpl.kill_userlist, Kill.USERS_CID2),
					COMPINFO:	() => tpl.kill_compinfo && Kill.CI ? tpl.kill_compinfo.define ("IPv4", ip => ip.ip ()).xtpl ("CINFO", Kill.CI) : ""
				}).tpl ())
				let w2 = Chat.Win2.isOwn (this)
					? Chat.Win2.add (HTML, Kill.NICK)
					: Chat.Win2.show ([{ t: HTML, b: Kill.NICK }], 0x997, this)
				let view = w2.length ? w2 [0] : w2
				view.id = `kill_${ID2}`
				view.id2 = ID2
				$WIN [ID2] = { f: view.first (), t: 0, id2: ID2 }
				$Cur = $WIN [ID2]
				setPanel ($Cur.f.action.length
					? August.form.$val ($Cur.f.action) > 1
					: !!$Cur.f.panel_rank1
				)
				view.onclick = click
				$Cur.f.onsubmit = kill
				$Cur.f.reason.on ("animationend", () => $Cur.f.reason.setClass ("blink", 0))
			}))
		}, {
			sess:	Chat.sess,
			id:	User.ID,
			id2:	ID2
		}, 1)
	}

	let $tpl = Chat.tpl (["kill", "kill-lock", "kill-action", "kill-killer1", "kill-killer3", "kill-userlist", "kill-compinfo"])
	let $WIN = []
	let $Cur = null

	Chat.Event.on ("user-reset", () => $tpl.reset ())
})
