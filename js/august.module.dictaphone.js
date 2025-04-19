//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.dictaphone.js


August.initModule ("dictaphone", function ( win ) {
	function widget ( app ) {
		return app.dictWidget.append ("chat-dictaphone", {
			done () {
				if (this.dictaphone)
					this.dictaphone.done ()
				this.dictaphone = null
			},
			del () {
				this.done ()
				app.dictWidget.setClass ("dictaphone", 0)
				app.dictWidget.remove (this)
				$Dict.delete (app)
			}
		})
	}
	function done ( app ) {
		let d = app && $Dict.get (app)
		if (d)
			d.del ()
	}
	function reset () {
		$tpl.reset ()
		for (let [app, d] of $Dict)
			d.del ()
	}
	this.init = function ( app, css = "dictaphone" ) {
		app = app || Chat
		if (!User.privDictaphone ())
			return app.error ("deny")
		if (!app.dictWidget)
			return app.error ("error", { ERROR: "`dictWidget` not found" })
		if (August.now () - $Last < 500)
			return
		$Last = August.now ()
		august_run (() => app.addCSS (css, () => $tpl.get (( tpl, eq ) => {
			let Dict = $Dict.get (app)
			let Ready = eq && Dict
			if (!Dict)
				$Dict.set (app, Dict = widget (app))
			if (!Ready)
				Dict.innerHTML = tpl.dictaphone.tpl (Chat.$ERROR_CFG)
			August.sync (app.win, () => {
				let Shown = app.dictWidget.setClass ("dictaphone")
				if (app.chat)
					app.scrollDefer ()
				if (!Shown)
					return Dict.done ()
				Dict.dictaphone = new august_dictaphone (Dict.$("au-dictaphone"), ( r, e ) => {
					if (r === true)
						;
					else if (r === false)
						app.error ("dictaphone", { ERROR: e })
					else if (app.Send)
						app.Send.insertFile ("AUDIO", new File ([r], `audio_${Date.now ()}`, { type: r.type }))
				})
			})
		})), [window.august_dictaphone ? null : "august.dictaphone.js"])
	}

	let $tpl = Chat.tpl ("dictaphone")
	let $Dict = new Map
	let $Last = 0

	Chat.Event.on ("app-done", done)
		.on ("user-reset", reset)
})
