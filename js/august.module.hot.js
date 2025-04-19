//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.hot.js


August.initModule ("hot", function ( win ) {
	function add ( phrase, key ) {
		let tr = $Table.insertRow ()
		tr.dataset.key = key
		tr.dataset.phrase = phrase
		tr.insertCell (0).innerHTML = "<input class='inp key' readonly name='?' value='?'>".format (key || "", key ? code (key) : "")
		tr.insertCell (1).innerHTML = "<input class='inp text'>"
		tr.insertCell (2).innerHTML = "<input class='btn del' type=button value='&#x2a2f;'>"
		let ph = tr.cells [1].first ()
		ph.onkeydown = keyDown
		ph.onkeypress = check
		ph.onblur = attr
		ph.value = phrase || ""
		tr.cells [2].first ().onclick = del
		tr.cells [0].first ().onfocus = e => ph.focus ()
		ph.focus ()
	}
	function del ( e ) {
		let tr = this.parent ().parent ()
		let ph = tr.cells [1].first ()
		if (ph.k || ph.value.length) {
			$Table.deleteRow (tr.rowIndex)
			if (!$Table.rows.length)
				add ()
		} else {
			ph.focus ()
		}
	}
	function attr ( e ) {
		let tr = this.parent ().parent ()
		let key = tr.cells [0].first ()
		tr.dataset.key = key.name
		tr.dataset.phrase = this.value
	}
	function keyDown ( e ) {
		let tr = this.parent ().parent ()
		let idx = tr.rowIndex
		let f = i => $Table.rows [i].cells [1].first ().focus ()
		let r = e.handler ([{ c: 9, f: 0 }, { c: 40, f: 0 }, { c: 40, f: 2 }], () => {
			if (idx < $Table.rows.length - 1)
				f (idx + 1)
		})
		&& e.handler ([{ c: 9, f: 4 }, { c: 38, f: 0 }, { c: 38, f: 2 }], () => {
			if (idx)
				f (idx - 1)
		})
		&& e.handler ({ c: 13, f: 2 }, () => {
			attr.call (this)
			done ()
		})
		if (!r)
			return r
		let key = tr.cells [0].first ()
		let c = e.keyCombo ()
		if (c) {
			key.value = code (key.name = c)
			e.stop ()
		}
		if (!this.k && !this.value.length && e.keyCode >= 0x20) {
			add ()
			this.focus ()
			this.k = 1
		}
		return !c
	}
	function check ( e ) {
		return !(e.ctrlKey || e.altKey)
	}
	function code ( c ) {
		let ck = c >> 8
		return ck ? `${$CKEYS [ck]}+${$NKEYS [c & 0xff]}` : $NKEYS [c & 0xff]
	}
	function done () {
		User.Phrases = []
		let Phrases = {}
		for (let r of $Table.rows) {
			let Key = +r.dataset.key
			let Phrase = r.dataset.phrase
			if (Key && Phrase && !User.Phrases [Key]) {
				User.Phrases [Key] = Phrase
				Phrases [`phrases[${Key}]`] = Phrase
			}
		}
		if (User.reg ())
			Chat.sendCmd (36, Phrases)
		Chat.Win2.hide ()
	}
	function init () {
		let w = Chat.Win2.show ($html, 1 | 512, this)
		$Table = w.$("table#__hot_tb")
		if (!$Table)
			return Chat.error ("tpl")
		while ($Table.rows.length)
			$Table.deleteRow (-1)
		User.Phrases.forEach (add)
		add ()
		let ok = w.$("input[name=ok]")
		if (ok)
			ok.onclick = done
		if (window.august_scrollbar)
			$sb = new august_scrollbar ($Table.parent ())
	}
	this.done = function () {
		$sb && $sb.done ()
		$sb = null
		Chat.focus ()
	}
	this.init = function () {
		if ($html)
			return init.call (this)
		Chat.loadTPL ("hot", tpl => {
			$html = tpl.hot.tpl ({})
			init.call (this)
		})
	}

	const $CKEYS = [
		"", "Alt", "Ctrl", "Ctrl+Alt", "Shift", "Alt+Shift", "Ctrl+Shift", "Ctrl+Alt+Shift"
	]
	const $NKEYS = [
		"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "", "", "", "", "",
		"", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
		"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "", "", "", "", "",
		"Num 0", "Num 1", "Num 2", "Num 3", "Num 4", "Num 5", "Num 6", "Num 7",
		"Num 8", "Num 9", "Num *", "Num +", "", "Num -", "Num .", "Num /",
		"F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"", "", ":", "=", "<", "-", ">", "/", "", "`", 	"", "", "", "", "", "", "", "",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "[", "\\",
		"]", "\"", "", "", "", "left \\"
	]

	let $Table = null
	let $html = null
	let $sb = null
})
