//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.init.js


August.initModule ("init", function ( win ) {
	function priv () {
		for (let el of win.Chat.root.all ("[name=attach]"))
			el.setClass ("none", !User.privAttach ())
		for (let el of win.Chat.root.all ("[name=dictaphone]"))
			el.setClass ("none", !User.privDictaphone ())
	}
	function tooltip () {
		for (let a of win.Chat.root.all ("chat-nav [title]"))
			a.attr ("tt", a.title)
	}
	function redesign () {
		let d = (win.Chat.root.$("nav-menu").attr ("tooltip") || "").split (":")
		let t = d.includes (win.Chat.Design)
		for (let a of win.Chat.root.all ("chat-nav [tt]")) {
			a.attr ("title", t ? null : a.attr ("tt"))
			a.attr ("tooltip", t ? a.attr ("tt") : null)
		}
	}
	function reinit (r) {
		if (r) {
			priv ()
			tooltip ()
		}
		redesign ()
	}
	this.init = function () {
		tooltip ()
		redesign ()
	}

	Chat.Event.on ("user-init", priv)
		.on ("user-priv", priv)
		.on ("reinit", reinit)
		.on ("redesign", redesign)
})
