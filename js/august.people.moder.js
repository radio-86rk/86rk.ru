//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.moder.js


function august_people_moder ( INFO ) {
	function priv ( r, tpl ) {
		let Form = INFO.modal ().show ("priv_panel", tpl.tpl (r), "priv-panel").form ()
		UserPriv.init (r.USER_PRIV0)
		set_priv (UserPriv)
		Form.html.value = UserHTML = r.USER_HTML.trim ()
		Form.entry_mess.value = r.ENTRY_MESS
		Form.exit_mess.value = r.EXIT_MESS
		DenyPriv = 0
	}
	function deny_priv ( r, tpl ) {
		INFO.modal ().show ("priv_panel", tpl.tpl (r), "deny-priv-panel")
		UserDenyPriv.init (r.USER_DENY_PRIV0)
		set_priv (UserDenyPriv)
		DenyPriv = 1
	}
	function priv_save () {
		let Form = INFO.modal ().form ()
		let p = new august_bitset
		for (let f of Form) {
			if (f.name == "priv" && f.checked)
				p.set (f.value - 1)
		}
		close ()
		let HTML = Form.html ? Form.html.value.trim () : null
		if (p.eq (DenyPriv ? UserDenyPriv : UserPriv) && (DenyPriv || UserHTML == HTML))
			return
		MAIN.sendCmd (61, ( a, s ) => {
			if (s != 204) {
			} else if (DenyPriv) {
				UserDenyPriv = p
			} else {
				UserPriv = p
				UserHTML = HTML
			}
		}, {
			profile:	INIT.PROFILE,
			priv:		p.val (),
			deny:		DenyPriv,
			html:		DenyPriv ? null : HTML
		})
	}
	function rank ( r, tpl ) {
		let Form = INFO.modal ().show ("rank_edit_panel", tpl.pattern ([{
			RANK_ID		() { return this.$r.r },
			RANK_TITLE	() { return this.$r.t.addSlashes () },
			$size		() { return r.RANKS.length },
			$set		( i ) { this.$r = r.RANKS [i] }
		}])).form ()
		if (Form.rank.type == "select-one") {
			r.RANKS.forEach (r => August.form.$option (Form.rank, r.t, r.r))
		}
		August.form.$val (Form.rank, r.RANK)
		Rank = r.RANK
	}
	function rank_save () {
		let r = +August.form.$val (INFO.modal ().form ().rank)
		close ()
		if (Rank == r)
			return
		MAIN.sendCmd (62, ( a, s ) => {
			if (s == 204) {
				Rank = r
				if ($("rank"))
					INFO.load (["", "rank", "rank", INFO.setRank.bind (INFO)])
			}
		}, {
			profile:	INIT.PROFILE,
			rank:		r
		})
	}
	function set_priv ( p ) {
		for (let f of INFO.modal ().form ()) {
			if (f.name == "priv" && p.test (+f.value - 1))
				f.checked = true
		}
	}
	function compinfo ( tpl, el ) {
		let show = HTML => {
			let w = INFO.modal ().show ("compinfo", HTML).form ()
			w.tabIndex = -1
			w.onblur = w.oncontextmenu = () => { w.onblur = w.oncontextmenu = null; close () }
			w.onclick = () => document.execCommand ("copy")
			w.focus ()
		}
		let ci = CI [el.dataset.ci || "ci"][+el.dataset.i]
		if (isSet (ci.html))
			return show (ci.html)
		MAIN.xhr ("compinfo", r => {
			this.ci = ci
			ci.html = tpl.define ("DATE2", ( f, l ) => MAIN.date (this.ci.ci [0], f, l))
				.define ("COUNTRY_NAME", $ => root.Chat && root.Chat.cfg.Country ? root.Chat.cfg.Country [$] || "" : $)
				.define ("COUNTRY_FLAG", $ => August.html.flag ($))
				.define ("IPv4", ip => ip.ip ())
				.xtpl ("CINFO", r)
			show (ci.html)
		}, {
			ip:		ci.ci [1],
			proxy:		ci.ci [2],
			cid1:		ci.ci [3].hex (),
			cid2:		ci.ci [4].hex (),
			cinfo:		ci.ci [5]
		})
	}
	function email ( tpl, el ) {
		let Suspend = +el.attr ("suspend")
		let Error = Suspend && (Date.now () / 1000 | 0) + MAIN.$DIF < Suspend
		INFO.modal ().show ("email_panel", tpl.tpl ({
			ERROR:		Error ? "SUSPEND" : "",
			SUSPEND:	Error ? Suspend : "",
			EMAIL_SENT:	el.attr ("last")
		}))
	}
	function email_send () {
		close ()
		MAIN.xhr ("user.email", r => INFO.loadTPL ([], tpl => {
			let a = INFO.info ().$("[name='admin_email']")
			if (a && r.EMAIL_SENT)
				a.attr ("last", r.EMAIL_SENT)
			if (a && r.SUSPEND)
				a.attr ("suspend", r.SUSPEND)
			INFO.modal ().show ("email_panel", tpl.email.tpl (r))
		}), {
			id:		root.User.ID,
			profile:	INIT.PROFILE
		})
	}
	function lock ( tpl, el ) {
		let Form = INFO.modal ().show ("lock", tpl.tpl ()).form ()
		Form.reason.focus ()
		Form.reason.on ("keydown", e => {
			if (e.keyCode == 13)
				refresh (el)
		}).on ("animationend", e => {
			Form.reason.setClass ("blink", 0)
		})
	}
	function refresh ( el ) {
		let p = (() => {
			switch (el.attr ("name")) {
				case "admin_backup":
					return { act: "backup", backup: el.attr ("date") }
				case "admin_restore":
					return { act: "restore", backup: el.attr ("date") }
				case "lock_ok":
					let Form = INFO.modal ().form ()
					let r = Form.reason.value.trim ()
					if (r)
						return { act: "lock", reason: r }
					Form.reason.setClass ("blink", 1).focus ()
					return null
				case "admin_unlock":
					return { act: "unlock" }
				case "admin_del":
					return { act: "delete" }
				case "admin_undel":
					return { act: "undelete" }
				case "admin_next":
					return { act: "next" }
			}
			return null
		})()
		if (!p)
			return
		p.profile = INIT.PROFILE
		INFO.getInfo (p, Object.assign ({
			ok ( show, info ) {
				show ()
				CI ["ci"] = [
					null,
					{ ci: info.CI1 },
					{ ci: info.CI2 },
					{ ci: info.CI3 }
				]
				document.documentElement.scrollTop = 0
			}},
			INFO.EXIT
		))
		close ()
	}
	function close () {
		INFO.modal ().hide ()
		return false
	}
	this.ci = function ( n, ci ) {
		CI [n] = ci
	}

	let UserPriv = new august_bitset
	let UserHTML = ""
	let UserDenyPriv = new august_bitset
	let DenyPriv = 0
	let Rank = 0
	let CI = []

	MAIN.add ({
		admin_priv:	["", "priv", "priv", priv],
		admin_deny_priv:["", "denypriv", "denypriv", deny_priv],
		admin_rank:	["rank_edit_panel", "rank_edit", "rank_edit", rank],
		priv_save:	priv_save,
		rank_save:	rank_save,
		compinfo:	["", "", "admin_compinfo", compinfo],
		admin_lock:	["lock", "", "lock", lock],
		lock_ok:	refresh,
		admin_unlock:	refresh,
		admin_del:	refresh,
		admin_undel:	refresh,
		admin_next:	refresh,
		admin_backup:	refresh,
		admin_restore:	refresh,
		admin_email:	["email_panel", "", "email", email, true],
		email_send:	email_send,
		close:		close
	})
}
