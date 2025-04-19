//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.phrases.js


August.initModule ("phrases", function ( win ) {
	function redesign () {
		$Win.forEach (a => load_design (a))
	}
	function reinit ( r ) {
		if (r)
			redesign ()
	}
	function load_design ( a, cb ) {
		Chat.css1 (a.win, ["main", "chat", "cmenu"], cb)
		a.$sb && a.$sb.hide ()
	}
	function out ( m, lm ) {
		if ($lm < lm) {
			let o = a => a && a.out (m, lm)
			if (m.me)
				o ($Win [0])
			if (m.from)
				o ($Win [m.from])
			$lm = lm
		}
	}
	function hide ( m, h ) {
		$Win.forEach (( a, wid ) => m.forEach (m => h ($(`ph${m < 0 ? -m : m}_${wid}`, a.win), m < 0)))
	}
	this.close = function ( n, v ) {
		delete $Win [v.id2]
	}
	this.done = function () {
		$Win.clear ()
	}
	this.init = function ( ID2 ) {
		let WID = `phrases_${ID2}`
		if (!Chat.isClosed (WID))
			return Chat.Win [WID].focus ()
		if ($(WID)) {
			let n = Chat.Win2.get_tab ($(WID))
			if (n >= 0)
				return Chat.Win2.tab (n)
		}
		Chat.xhr ()("phrases", r => {
			let title_txt = t => (Chat.cfg [r.NICK ? "usermess" : "mymess"].t).tpl ({ NICK: r.NICK, TITLE: t })
			let App = new Promise (( resolve, reject ) => {
				if (!Chat.Mobile) {
					let w2 = Chat.Win2.isOwn (this)
						? Chat.Win2.add ("", "")
						: Chat.Win2.show ([{ t: "", b: "" }], 128 | 4 | 2, this)
					Chat.Win2.set_tab_name (title_txt (""))
					let App = {
						ScrollOn:	1,
						Dir:		Chat.Dir,
						main:		Chat.main,
						view:		w2.length ? w2 [0] : w2,
						win:		win,
						scroll:		Chat.scroll,
						closed:		0,
						sc:		0,
						lm:		1,
						get Event ()	{ return Chat.Event }
					}
					App.view.id2 = ID2
					App.view.id = WID
					App.view.setClass ("phrases")
					App.view.append ("chat-title", {
						innerHTML: title_txt (" ")
					})
					App.chat = App.view.append ("chat-chat")
					App.chat.onmouseup = () => {
						Chat.Send.insertSelection ()
						return true
					}
					return resolve (App)
				}
				Chat.loadTPL ("phrases", tpl => {
					let Win = Chat.wo ({ wid: WID, win: "phrases" }, $WinPos [WID])
					Win.wid = WID
					Win.root = win
					Win.html (tpl.phrases.tpl ({
						TITLE:	title_txt (" ")
					}))
					let root = Win.document.body
					let App = {
						win:		Win,
						root:		root,
						main:		root.$("chat-main"),
						chat:		root.$("chat-chat"),
						view:		root.$("chat-view"),
						body:		root.$("chat-body"),
						ScrollOn:	1,
						Dir:		Chat.Dir,
						scroll:		Chat.scroll,
						scrollDefer:	Chat.scrollDefer,
						sc:		0,
						lm:		1,
						get Event ()	{ return Chat.Event }
					}
					Win.Chat = App
					root.setClass ("app-chat", 1).on ("keydown", e => (e.closeWin (), true))
					load_design (App, () => {
						App.scrollDefer ()
						App.$cm = new august_cmenu (App)
						App.$sb = Win.root.august_scrollbar ? new august_scrollbar (App.view) : null
						Win.onbeforeunload = () => {
							App.$sb && App.$sb.done ()
							App.$sb = null
							App.win = null
							App = null
							$WinPos [Win.wid] = Win.pos ()
							delete $Win [+ID2]
						}
						resolve (App)
					})
				})
			})
			App.then (App => {
				$Win [+ID2] = App
				App.out = ( m, n ) => {
					let div = Chat.mout.call (App, m)
					if (n)
						div.id = `ph${n}_${ID2}`
				}
				Object.defineProperties (App.view, {
					scrollEnd: { get () { return this.scrollHeight - this.scrollTop - this.clientHeight } }
				})
				App.ScrollOn = 0
				for (let ph in r.PHRASES)
					App.out (August.html.mess (r.PHRASES [ph], User.Set), ph)
				App.ScrollOn = 1
				if (App.Dir)
					App.sc = App.view.scrollTop = App.view.scrollHeight
			})
		}, {
			id:	User.ID,
			id2:	ID2
		})
	}

	let $Win = []
	let $WinPos = {}
	let $lm = 0

	if (Chat.Mobile) {
		Chat.Event.on ("redesign", redesign)
			.on ("reinit", reinit)
	}
	Chat.Event.on ("chat-mess", out)
		.on ("hide-mess", hide)
})
