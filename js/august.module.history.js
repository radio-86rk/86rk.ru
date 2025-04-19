//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.history.js


August.initModule ("history", function ( win ) {
	function key_handler ( e ) {
		let r = e.handler ({ c: 37, f: 2 }, () => {
			if ($Form.day.selectedIndex < $Form.day.length - 1) {
				$Form.day.selectedIndex++
				show ()
			}
		})
		&& e.handler ({ c: 39, f: 2 }, () => {
			if ($Form.day.selectedIndex) {
				$Form.day.selectedIndex--
				show ()
			}
		})
		if (r && $sb)
			$sb.keydown (e)
		if (e.handler ({ c: 27, f: 0 }, () => Chat.Event.fire ("escape-key", e), 1))
			e.closeWin ()
		return false
	}
	function click ( e ) {
		if ($Lock)
			return
		let el = e.$
		if (el.name == "img-view")
			return Chat.imgView.call ($Win.Chat, el)
		if (el.name && el.type == "checkbox") {
			let ph = el.parent ().parent ()
			if (ph.id == el.name && ph.parent () == $Win.Chat.chat) {
				if ($sel [el.name]) {
					sel_set (-1)
					ph.setClass ("sel", 0)
					delete $sel [el.name]
				} else {
					sel_set (1)
					ph.setClass ("sel", 1)
					$sel [el.name] = el
				}
			}
		}
	}
	function out ( Mess, IDs ) {
		let id  = 0
		let Out = $Win.document.createDocumentFragment ()
		Mess.forEach (( m, i ) => {
			if (IDs)
				id += +IDs [i]
			m = August.html.mess (m, User.Set)
			let div = Out.append ("div", {
				className: IDs && isString (IDs [i]) ? "ph hidden" : "ph",
				id:        IDs ? `ph${id}` : ``,
				innerHTML: IDs ? `<div class=check>${August.form.checkbox (`ph${id}`, isString (IDs [i]), "", "")}</div>${m}` : m
			})
			if (m.system)
				div.setClass (`s${m.system}`)
			id++
		})
		$Win.Chat.chat.innerHTML = ""
		$Win.Chat.chat.append (Out)
		Chat.Event.fire ("insert-mess", $Win.Chat.chat)
	}
	function show () {
		let d = +$Form.day.value
		let s = +$Form.start.value
		let l = +$Form.length.value
		if (!d || !l || $Lock)
			return
		$Win.Chat.chat.innerHTML = $wm
		sel_set (-$csel)
		if ($sb)
			$sb.moveTo (0), $sb.hide ()
		Chat.xhr (lock)("mess", m => {
			out (m.MESS, m.IDs.length ? m.IDs : null)
		}, {
			s:	d * 3600 + s * 60,
			l:	l * 60,
			id:	User.ID,
			r:	Chat.Room
		}, 1)
	}
	function hide () {
		if (!$csel || $Lock)
			return
		let m = []
		for (let i in $sel)
			m.push (+i.substr (2))
		sel_set (-$csel)
		Chat.xhr (lock)("mess", r => {
			for (let id of r.IDs) {
				let el = $(`ph${id < 0 ? -id : id}`, $Win)
				if (el)
					el.setClass ("sel", 0).setClass ("hidden", id < 0)
			}
		}, {
			m:	m.join (":"),
			id:	User.ID
		})
	}
	function sel_set ( c ) {
		$("sel", $Win) && ($("sel", $Win).innerHTML = $csel += c)
		$Form.setClass ("hide", $csel)
		if (!$csel)
			$sel = {}
	}
	function load_design ( cb ) {
		Chat.css1 ($Win,["main", "chat", "cmenu", "history"], cb)
		$sb && $sb.hide ()
	}
	function reinit ( r ) {
		if (!r)
			return load_design ()
		let d = +$Form.day.value
		let s = +$Form.start.value
		let l = +$Form.length.value
		$Win.close ()
		setTimeout (() => {
			self.init (() => {
				$Form.day.value = d
				$Form.start.value = s
				$Form.length.value = l
				show ()
			})
		}, 100)
	}
	function lock ( l ) {
		$Lock = l
	}
	this.init = function ( cb ) {
		$Win = Chat.wo ("history", $WinPos || this.$w)
		Chat.xhr ()("history", History => Chat.loadTPL ("history", tpl => {
			$Win.html (tpl.history.tpl ({
				FIRST:		( f, l ) => (History.FMT = [f, l], History.FIRST.date (f, l)),
				LONG_DAYS:	( ds, hs, ms ) => History.LONG.days (ds, hs, ms),
				ROOM_NAME:	History.ROOM_NAME,
				MODER:		"".true (History.MODER)
			}))
			let root = $Win.document.body
			$Win.Chat = {
				win:		$Win,
				root:		root,
				main:		root.$("chat-main"),
				chat:		root.$("chat-chat"),
				view:		root.$("chat-view"),
				body:		root.$("chat-body"),
				get Event ()	{ return Chat.Event }
			}
			$Win.root = win
			$Win.Chat.root.setClass ("app-chat", 1).s ({ visibility: "hidden" })
			$Form = $Win.document.forms [0]
			load_design (() => {
				if (!($Form.show && $Win.Chat.chat))
					return
				Chat.Event.on ("redesign", load_design)
					.on ("reinit", reinit)
				if ($Form.day) {
					let dt = new Date
					for (let d of History.DAYS) {
						dt.lang (History.FMT [1]).setTime (d * 3600000)
						August.form.$option ($Form.day, dt.format (History.FMT [0]), d)
					}
				}
				$Lock = 0
				$Win.Chat.root.s ({ visibility: "" })
				$cm = new august_cmenu ($Win.Chat)
				$wm = $Win.Chat.chat.innerHTML
				$Win.Chat.chat.innerHTML = ""
				$Win.Chat.chat.onclick = click
				$Form.show.onclick = show
				if ($Form.hide) {
					$Form.hide.onclick = hide
					$Win.Chat.root.setClass ("moder")
				}
				sel_set (-$csel)
				if (window.august_scrollbar)
					$sb = new august_scrollbar ($Win.Chat.root.$("chat-view"), 2)
				$Win.document.onkeydown = key_handler
				$Win.onbeforeunload = function () {
					Chat.Event.un ("redesign", load_design)
						.un ("reinit", reinit)
					$WinPos = this.pos ()
					$sb && $sb.done ()
					$sb = null
				}
				cb && cb ()
			})
		}), {
			id:	User.ID
		})
	}

	let $Win = null
	let $WinPos = null
	let $Form = null
	let $cm = null
	let $sel = {}
	let $csel = 0
	let $Lock = 0
	let $wm = ""
	let $sb = null
	let self = this
})
