//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.private.js


August.initModule ("private", function ( win ) {
	function load_design ( a, cb ) {
		Chat.css1 (a.win, a.$CSS, cb)
		a.$sb && a.$sb.hide ()
	}
	function out ( m ) {
		if (m.m)
			this.mout (m.m).setClass (m.my ? "self" : "buddy")
		else
			this.mout (m)
	}
	function win_walk ( cb ) {
		for (let wid in Chat.Win) {
			let a = Chat.Win [wid].Chat
			if (a && a.private && a.win && !a.win.closed)
				cb (a)
		}
	}
	function redesign () {
		win_walk (a => load_design (a, () => {
			a.view.scrollTop = a.Dir ? a.view.scrollHeight - a.view.clientHeight - 10 : 0
			a.scrollDefer ()
		}))
	}
	function close_all () {
		win_walk (a => a.win.close ())
	}
	function reinit () {
		$tpl.get (( tpl, eq ) => win_walk (a => {
			if (eq && a.win.Ready)
				return load_design (a)
			Chat.Event.fire ("app-done", a)
			init (tpl, a.win, a.ID2, a.Room, a.private, a => Chat.Event.fire ("app-ready", a))
		}))
	}
	function init ( tpl, Win, id2, Room, p, cb ) {
		Win.html (tpl.private.tpl ({
			GAME:		Win.GAME || "",
			NICK1:		p.NICK1,
			NICK2:		p.NICK2,
			TITLE:		p.TITLE,
			SEND:		tpl.private_send.tpl ({
				PRIV_ATTACHMENTS:	"".true (User.privAttach ()),
				PRIV_DICTAPHONE:	"".true (User.privDictaphone ()),
				PRIV_WEBCAM:		"".true (User.privWebcam ())
			})
		}))
		let root = Win.document.body
		let App = {
			win:			Win,
			private:		p,
			Dir:			Chat.Dir,
			ScrollOn:		1,
			Room:			Room | 0,
			ID2:			id2,
			root:			root,
			main:			root.$("chat-main"),
			chat:			root.$("chat-chat"),
			view:			root.$("chat-view"),
			body:			root.$("chat-body"),
			form:			root.$("chat-form"),
			panel:			root.$("chat-panel").$("chat-panel"),
			cfg:			Chat.cfg,
			mout:			Chat.mout,
			scroll:			Chat.scroll,
			scrollDefer:		Chat.scrollDefer,
			scrollView:		Chat.scrollView,
			clear:			Chat.clear,
			notice:			Chat.notice,
			error:			Chat.error,
			getError:		Chat.getError,
			addCSS:			Chat.addCSS,
			initPanel:		Chat.initPanel,
			showPanel:		Chat.showPanel,
			Transport:		Chat.Transport,
			sc:			0,
			$PanelModule:		[],
			$Focus:			[],
			$CSS:			["main", "chat", "cmenu"],
			get Event ()		{ return Chat.Event },
			get Design ()		{ return Chat.Design },
			get videoWidget ()	{ return this.root },
			get dictWidget ()	{ return this.main }
		}
		Object.defineProperties (App.view, {
			scrollEnd: { get () { return this.scrollHeight - this.scrollTop - this.clientHeight } }
		})
		Win.Chat = App
		root.setClass ("app-chat", 1).setClass ("mobile", Chat.Mobile).setClass (Chat.root.d [Chat.Dir], 1).s ({ visibility: "hidden" })
		root.on ("keydown", e => {
			e.handler ({ c: 27, f: 0 }, () => Chat.Event.fire ("escape-key", e), 1) && e.closeWin ()
			return true
		}).on ("contextmenu click", e => {
			Chat.focus.call (App, e)
		}, true)
		load_design (App, () => {
			root.s ({ visibility: "" })
			App.Send = new august_chat_form (App)
			App.Send.form ().a.value = Room ? 22 : 23
			App.$sb = Win.root.august_scrollbar ? new august_scrollbar (App.view) : null
			August.form.$hidden (App.Send.form (), { id2 })
			if (Room) {
				App.cm = new august_cmenu (App)
				Chat.sendCmd (26, { r: id2, c: Win.Ready ? 4 : 5 })
				root.setClass ("room")
			}
			App.chat.onmouseup = () => {
				App.Send.insertSelection ()
				return true
			}
			Win.onbeforeunload = () => {
				Chat.Event.fire ("app-done", App)
				App.$sb && App.$sb.done ()
				App.$sb = null
				App.win = null
				App.Room && Chat.sendCmd (26, { r: App.ID2, c: 6 })
				App = null
				$WinPos [Win.wid] = Win.pos ()
			}
			if ($History [Win.wid])
				$History [Win.wid].each (out.bind (App))
			else if (!Room)
				$History [Win.wid] = new august_buffer (100)
			cb && cb (App)
		})
		August.clickHandler (Win, el => $NAV [el.name] && $NAV [el.name](App, el) || true)
	}
	this.event = function ( id2, ... a ) {
		let w = Chat.Win [User.ID4 + id2]
		if (w && w.Chat && !w.closed) {
			if (a [0] == "EXIT")
				w.close ()
			else
				Chat.event.apply (w.Chat, a)
		}
	}
	this.out = function ( wid, mess, uid ) {
		let w = Chat.Win [wid]
		if (w && w.Chat && !w.closed) {
			let m = isSet (uid) ? { m: mess, my: User.ID4.hex () == uid } : mess
			out.call (w.Chat, m)
			if ($History [wid])
				$History [wid].put (m)
		}
	}
	this.pout = function ( mess, id2, uid ) {
		this.out (`${User.ID4}P${id2}`, August.html.mess (mess, User.PrivateSet), uid || id2)
	}
	this.rout = function ( mess, id2 ) {
		let WID = `${User.ID4}R${id2}`
		if (Chat.isClosed (WID))
			Chat.sendCmd (26, { r: id2, c: 7 })
		else if (isArray (mess))
			mess.forEach (m => this.out (WID, August.html.mess (m, User.PrivateSet)))
		else
			this.out (WID, August.html.mess (mess, User.PrivateSet))
	}
	this.init = function ( id2, a, g, win ) {
		let WID = `${User.ID4}${a & 8 ? "R" : "P"}${id2}`
		if (!Chat.isClosed (WID))
			return Chat.Win [WID].focus ()
		Chat.xhr ()("private", r => {
			if (r.ERROR)
				return Chat.error (r.ERROR, { NICK: r.NICK2 })
			let Win = g
				? Chat.wo ({ wid: WID, name: `game_${g}_${WID}`, id2: id2 }, $WinPos [WID] || { w: win [0], h: win [1], f: 66 })
				: Chat.wo ({ wid: WID, win: "private" }, $WinPos [WID])
			Win.wid = WID
			Win.root = root
			if (g && /^(\w+) (.+)$/.test (r.TITLE)) {
				Win.GAME = RegExp.$1
				r.TITLE = RegExp.$2
			}
			$tpl.get (tpl => init (tpl, Win, id2, !!(a & 8), r, app => {
				Chat.Event.fire ("app-ready", app)
				Win.Ready = 1
				let Game = g && $("game", Win)
				if (Game) {
					Game.setHeight (win [1] - 200)
					Win.resizeTo (win [0], win [1] + 100)
					app.scrollDefer ()
				}
			}))
		}, {
			id:	User.ID,
			id2:	id2,
			p:	a || 1
		})
	}

	const $NAV = {
		attach ( App ) {
			App.Send.attachFile ()
		},
		mysmiles ( App ) {
			Chat.loadModule ("smiles", [() => Chat.$Modules.smiles.mySmiles (App)])
		},
		dictaphone ( App ) {
			Chat.loadModule ("dictaphone", [App])
		},
		emoji ( App ) {
			Chat.loadModule ("emoji", [App])
		},
		"video-recorder" ( App ) {
			Chat.loadModule ("video-recorder", [App, "video-recorder", r => {
				if (!r)
					return
				let pwr = r.$("video-bttn#power")
				if (pwr)
					pwr.onclick = () => $NAV ["video-recorder"](App)
			}, {
				id:	Chat.VideoID
			}])
		},
		"img-view" ( App, el ) {
			Chat.imgView.call (
				App,
				el,
				() => Chat.setFocus.call (App, null),
				() => (Chat.removeFocus.call (App), Chat.focus.call (App))
			)
		},
		"smile-click" ( App, el ) {
			if (el.dataset.x === "o")
				App.Send.insert (el.title)
		}
	}

	let $tpl = Chat.tpl (["private", "private-send"])
	let $History = {}
	let $WinPos = {}

	Chat.Event.on ("redesign", redesign)
		.on ("reinit", reinit)
		.on ("user-reset", close_all)
})
