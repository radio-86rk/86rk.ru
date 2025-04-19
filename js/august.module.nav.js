//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.nav.js


August.initModule ("nav", function ( win ) {
	function init () {
		if (!$tpl)
			return
		let p = {
			webcam:		User.privWebcam (),
			dictaphone:	User.privDictaphone (),
			attach:		User.privAttach (),
			emoji:		Chat.$Modules.emoji
		}
		let menu = []
		let stat = []
		Chat.cfg.NavMenu.forEach (m => {
			if (!(m.a in p) || p [m.a])
				menu.push ({ t: m.n, a: m.a })
		})
		if (Chat.cfg.UserStatus.length > 1 && User.Priv.test (33)) {
			Chat.cfg.UserStatus.forEach (( s, i ) => {
				if (s.x)
					return
				stat.push ({
					t: s.s [User.sex ()].stripTags ().trim ().replace (August.html.SMILE_RE, August.html.smile),
					s: i
				})
			})
			if (stat.length == 1)
				stat.length = 0
		}
		$both = menu.length && stat.length
		$nav = Chat.panel.parent ().append ("popup-nav")
		$nav.innerHTML = $tpl.pattern ({
			MENU: [{
				TEXT	() { return menu [this.$i].t || "&nbsp;" },
				ACTION	() { return menu [this.$i].a },
				$size	() { return menu.length },
			}],
			STATUS: [{
				TEXT	() { return stat [this.$i].t || "&nbsp;" },
				STATUS	() { return stat [this.$i].s },
				$size	() { return stat.length },
			}]
		}, {
			ADMIN:	"".true (User.set (28) || User.set (26))
		})
		$body = $nav.$("nav-body")
		if (!$body)
			return
		set_stat (User.status ())
		$nav.onclick = click
		$nav.onmouseenter = show
		$nav.onmouseleave = hide
		$nav.oncontextmenu = e => e.stop ()
		$nav.noselect ()
	}
	function reinit ( r ) {
		if (r) Chat.loadTPL ("nav", tpl => {
			$tpl = tpl.nav
			if (User.ID)
				init ()
		})
	}
	function set_stat ( s ) {
		if (!$body)
			return
		if ($body.cs)
			$body.cs.className = ""
		$body.cs = $body.$(`item[data-s='${s}']`)
		if ($body.cs)
			$body.cs.className = "cur"
	}
	function click ( e ) {
		if (e.$.is ("ITEM")) {
			hide ()
			let a = e.$.dataset.a
			let s = e.$.dataset.s
			if (s) {
				User.status (s)
				set_stat (s)
			} else if (a && Chat.menu [a]) {
				Chat.menu [a]()
			} else if (a) {
				let m = Chat.cfg.NavMenu.find (m => m.a == a)
				Chat.loadModule (a, void 0, 0, null, m ? [m.win] : m)
			}
		} else if (e.$.is ("NAV-TITLE") && $body.split) {
			$body.s ({ transition: "none" })
			hide ()
			$menu ^= 1
			August.sync (win, () => {
				$body.s ({ transition: null, transitionDelay: "0s" })
				show ()
				August.sync (win, () => {
					$body.s ({ transition: null })
					$nav.fire ("modal")
				})
			})
		}
	}
	function show () {
		if ($both && $nav) {
			$body.className = ""
			$body.split = $nav.scrollHeight > Chat.panel.offsetHeight
			if ($body.split)
				$body.className = `menu${$menu ? 1 : 2}`
		}
		let h = $body.scrollHeight
		let hp = $body.split ? Chat.panel.offsetHeight - $nav.$("nav-title").offsetHeight : h
		$body.setHeight (hp < h ? hp : h)
		$nav.className = "show"
		$nav.fire ("modal", 1)
		if (hp < h)
			$body.s ({ overflowY: "auto" })
		if (Chat.$psb)
			Chat.$psb.off ()
	}
	function hide () {
		$body.s ({ overflowY: "" })
		$body.setHeight (0)
		$nav.className = ""
		$nav.fire ("modal")
		if (Chat.$psb)
			Chat.$psb.on ()
	}
	function destroy () {
		$nav && $nav.parent ().remove ($nav)
		$nav = $body = null
	}
	function user_init () {
		win.setTimeout (init, 1000)
	}
	this.init = function () {
		Chat.addCFG ("NavMenu", "popup-nav")
		Chat.addCSS ("nav", reinit.bind (this, 1))
	}

	var $nav = null
	var $body = null
	var $tpl = null
	var $both = 0
	var $menu = 0

	Chat.Event.on ("reinit", reinit)
		.on ("user-init", user_init)
		.on ("user-reset", destroy)
		.on ("destroy", destroy)
		.on ("user-status", set_stat.bind (null))
})
