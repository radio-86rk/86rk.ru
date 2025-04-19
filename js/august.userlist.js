//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.userlist.js


Chat = {
	init ( win, root, cb ) {
		this.Host = INIT.HOST
		this.Room = INIT.ROOM
		this.Design = INIT.DESIGN || INIT.DEFDES
		this.TPL = INIT.TPL
		this.Version = INIT.VERSION
		this.win = win
		this.root = root
		this.root.setClass ("app-chat", 1)
		August.init ({ Host: this.Host, Version: this.Version })
		August.initModule = ( ... $ ) => this.initModule (... $)
		August.html.handler ("flag", ( co, s ) => {
			let p = s ? "small" : "large"
			let f = this.cfg.flag && this.cfg.flag [p]
			return co && f ? August.html.img (`images/$flags.${p}/${f.p || ""}/${co}.${f.e}`, f.w, f.h, 0, "", "", "", this.cfg.Country && this.cfg.Country [co] || co, "flag") : ""
		})
		this.xhr ()("init", r => {
			this.update = r.Date
			if (window.root != window && window.root.Chat.cfg) {
				this.cfg = window.root.Chat.cfg
				return cb ()
			}
			var ok = August.defer (3, cb)
			this.xhr ()("cfg", cfg => {
				Object.assign (this.cfg, cfg)
				ok ()
			}, `/${this.update.cfg}`, 1)
			this.loadCFG ("chat", cfg => {
				if (cfg) {
					if (cfg.flag) for (let n in cfg.flag) {
						cfg.flag [n] = (p => ({ p: p [0], e: p [1], w: +p [2], h: +p [3] }))(cfg.flag [n].t.split (":"))
					}
					if (cfg.win) {
					}
					Object.assign (this.cfg, cfg)
				}
				ok ()
			})
			if (!INIT.LANG)
				return ok ()
			this.loadCFG (`country.${INIT.LANG}`, r => {
				if (r) {
					this.cfg.Country = {}
					for (let n in r)
						this.cfg.Country [n.toLowerCase ()] = r [n].t
				}
				ok ()
			})
		})
	},
	loadCFG ( cfg, cb ) {
		new august_http ().send (`php/cfg.php?cfg=${cfg}&lang=${INIT.LANG}`, r => {
			if (r === false)
				return cb.call (this, false)
			var re = /^(?:(["'`])(.+?)\1\s*(?:\s+(?:(["'`])(.+?)\3|([^\s.]+)(?:\.([^\s]+))?)(?:[ \t]+(.+))?)?)$/
			var cfg = {}, c = 0, t = ""
			r.split ("\n").forEach (l => {
				if (!re.test (l))
					return
				t += RegExp.$2
				if (!RegExp.$4 && !RegExp.$5)
					return
				if (RegExp.$6 && !cfg [RegExp.$5])
					cfg [RegExp.$5] = {}
				if (RegExp.$4)
					cfg [RegExp.$4] = { t: t, p: RegExp.$7 }
				else if (RegExp.$6)
					cfg [RegExp.$5][RegExp.$6] = { t: t, p: RegExp.$7 }
				else
					cfg [RegExp.$5] = { t: t, p: RegExp.$7 }
				c++
				t = ""
			})
			cb.call (this, c ? cfg : null)
		})
	},
	addCSS ( name, cb, cb_err ) {
		August.loadCSS (this.win, name, this.Design, cb, cb_err)
	},
	initPanel () {
		if (!this.panel) {
			this.panel = this.root.$("chat-panel").$("chat-panel")
			if (window.august_scrollbar) {
				this.psb = new august_scrollbar (this.panel, 1)
				onkeydown = this.psb.keydown.bind (this.psb)
			}
		}
	},
	showPanel ( cn ) {
		this.panel.className = cn
	},
	xhr () {
		return ( ... a ) => August.xhr ()(... a)
	},
	tpl ( tpl, apl ) {
		return new august_tpl (tpl, { APL: apl, TPL: this.TPL })
	},
	userinfo ( id2 ) {
		August.wo (`info.php?id2=${id2}`, `INFO_0_${Chat.cfg.ChatID}_${Chat.Room}_${id2}`, { f: 3 })
	},
	initModule ( n, m ) {
		this.$Modules [n] = new m (window)
	},
	$Modules: {},
	sess: "",
	cfg: {}
}

function august_main () {
	try {
		window.root = window.opener && opener.root || window
	} catch ( e ) {
		window.root = window
	}
	window.wid = "USERLIST"
	window.User = root.User || { Set: 0, ID: INIT.ID, set () { return 0 } }
	Chat.init (window, $("app_chat") || document.body, () => august_run (() =>
		August.loadTPL ({ TPL: Chat.TPL })("userlist", tpl => {
			document.body.innerHTML = tpl.userlist.tpl ()
			Chat.$Modules.userlist.init (INIT.FUNC)
			August.clickHandler (window, el => Chat.$Modules.userlist.init (el.name))
		}), [
			"august.module.userlist.js",
			!INIT.MOBILE && INIT.SB ? "august.scrollbar.js" : null
		])
	)
}
