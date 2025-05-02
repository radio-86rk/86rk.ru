//  Copyright (c) 2022 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: 86rk.js


august_run (() => {
	if (!INIT.OK) {
		location = "bad-browser.html"
		return
	}

	August.init ({ Host: INIT.HOST, Version: INIT.VERSION })
	window.root = window
	window.name = "Radio-86RK"
	window.wid = "86RK"
	INIT.root = document.body
	INIT.User = { ID: root.User?.ID || "" }

	let $Donate = null
	let ROOT = new august_mps (INIT)

	const APP = {
		load ( n ) {
			this.done ()
			if (!this.is (n))
				return false
			if (!n.history)
				ROOT.put_history ({ app: n }, { app: "" }, null, `/${n}/`)
			August.loadJS ("/js/august.app.js").then (async () => {
				this.$name = n
				let r = await fetch ("app.version")
				let v = r.ok ? await r.text () : "0"
				August.init ({ Version: v })
				await August.loadJS ("app.js")
				this.$manifest = document.head.append ("link", {
					rel:	"manifest",
					href:	"manifest.json"
				})
				if ("serviceWorker" in navigator)
					navigator.serviceWorker.register (`sw.js?${v}`)
				ROOT.suspend_on ()
				August.sync (window, _ => {
					INIT.root.setClass ("app", 1)
					this.$app [n] = app.run (n)
				})
			})
			return true
		},
		done () {
			if (this.$name)
				this.app.done ()
			if (this.$manifest)
				document.head.remove (this.$manifest)
			this.$name = this.$manifest = null
			ROOT.suspend_off ()
			INIT.root.setClass ("app", 0)
			August.init ({ Version: INIT.VERSION })
		},
		is ( n ) {
			return isSet (this.$app [n])
		},
		get app () {
			return this.$app [this.$name]
		},
		$app: {
			zeditor: null,
			disassm: null,
			assm:    null,
			utils:   null
		}
	}

	const loadChat = ( w, d ) => {
		let url = `//${location.host.replace (/^www\.|/i, "chat.")}${d ? `/?d=${d}` : ``}`
		if (!ROOT.CFG.User.AuthKey) {
			w.location = url
			return
		}
		let f = INIT.root.append ("form", {
			target:		w.name,
			action:		url,
			acceptCharset:	"utf-8",
			method:		"post",
			style:		"position: absolute"
		})
		August.form.$hidden (f, {
			profile:	ROOT.CFG.User.Profile,
			auth_key:	ROOT.CFG.User.AuthKey
		})
		f.submit ()
		INIT.root.remove (f)
	}

	const clickHandler = e => {
		if (APP.load (e.$.name))
			return e.stop ()
		switch (e.$.name) {
			case "chat": {
				if (!INIT.root.setClass ("chat")) {
					$("app_chat").remove ($("app_chat").$("iframe"))
					break
				}
				let fr = $("app_chat").append ("iframe", {
					name:	"chat-86rk",
					allow:	"camera *; microphone *; midi *; fullscreen *"
				})
				loadChat (fr.contentWindow, "mini")
				break
			}
			case "win-chat":
				loadChat (open ("", "chat-86rk-win"))
				break
			case "reg":
				open ("form.php", "_blank")
				break
			case "donate":
				if ($Donate)
					return INIT.root.setClass ("donate")
				if ($Donate === void 0)
					break
				$Donate = void 0
				August.loadTPL ({ TPL: "86rk" })("donate", tpl => {
					$Donate = INIT.root.$("mps-top-menu").append ("div", {
						className:	"donate",
						innerHTML:	tpl.donate
					})
					August.sync (window, _ => INIT.root.setClass ("donate"))
				})
				break
		}
	}

	ROOT.init (() => {
	}, {
		history: s => {
			console.log ("mps $cfg.handler.history", s)
			APP.load (s.app.set ("history"))
		}
	})

	ROOT.Event.on ("keydown", e => {

	}).on ("mouse", e => {
		if (e.type == "click")
			clickHandler (e)
	})
}, [
	"august.mps.js", "august.highslide.js"
])
