//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.speech2text.js


August.initModule ("speech2text", function ( win ) {
	function speech2text ( app ) {
		function start () {
			if (Speech || !app.Send)
				return
			Speech = new SpeechRecognition
			Speech.continuous = true
			Speech.interimResults = true
			Speech.lang = LANG [Lang]
			Speech.onstart = e => {
				lock (1)
			}
			Speech.onend = e => {
				stop ()
			}
			Speech.onerror = e => {
				app.error ("error", { ERROR: ERROR [e.error] || `Error: ${e.error}` })
			}
			Speech.onresult = e => {
				if (!e.results)
					return Speech.stop ()
				let t = ""
				let f = e.results [e.resultIndex].isFinal
				for (let i = e.resultIndex; i < e.results.length; i++)
					t += e.results [i][0].transcript
				if (Punct && PUNCT [Lang]) for (let p of PUNCT [Lang])
					t = t.replace (p [0], p [1])
				app.Send.insert (t, f ? 2 : 3)
				if (inp.type == "text")
					inp.scrollLeft = inp.scrollWidth
				else if (inp.type == "textarea")
					inp.scrollTop = inp.scrollHeight
			}
			Speech.start ()
		}
		function stop () {
			if (!Speech)
				return
			Speech.stop ()
			Speech = null
			app.Send.focus ()
			lock (0)
		}
		function lock ( v ) {
			app.Send.lock (v)
			inp.setClass ("speech", v)
		}
		function init () {
			let i = app.Send.mess ()
			if (i == inp)
				return
			inp = i
			mic = inp.parent ().insert ("a", inp.next (), { className: "speech" })
			inp.parent ().setClass ("speech")
			mic.onclick = () => Speech ? stop () : start ()
		}
		this.stop = function () {
			stop ()
		}
		this.init = function () {
			init ()
			if (Speech)
				lock (1)
		}

		let Speech = null
		let inp = null
		let mic = null
		init ()
	}
	function init ( app ) {
		Speech.set (app.win.wid, new speech2text (app))
	}
	function done ( app ) {
		let s = app && Speech.get (app.win.wid)
		if (s)
			s.stop (), Speech.delete (app.win.wid)
	}
	function reset () {
		for (let [wid, s] of Speech)
			s.stop ()
		Speech.clear ()
	}
	this.init = function () {
		if (!OK)
			return
		let cfg = null
		Chat.loadCFG2 ("speech2text", ( $1, $2, $3 ) => {
			if ($1) {
				cfg = $1.toLowerCase ()
				if (LANG [cfg] && !PUNCT [cfg])
					PUNCT [cfg] = []
			} else if ($2 && $3) {
				if (LANG [cfg])
					PUNCT [cfg].push ([new RegExp ($2, "ig"), { "\\n": "\n" }[$3] || $3])
				else if (cfg == "error")
					ERROR [$3] = $2
			}
		}, () => {
			Chat.setCmd ({
				speech:	( ... a ) => {
					let OK = ""
					let res = null
					if (a [0] == "lang") {
						if (isSet (a [1])) {
							let l = a [1].toLowerCase ()
							if (isSet (LANG [l])) {
								param ("lang", Lang = l)
								OK = "".true (1)
							}
						} else {
							res = {
								NOTICE: `lang=${Lang}`
							}
						}
					} else if (a [0] == "punctuation") {
						if (isSet (a [1])) {
							let s = a [1].toLowerCase ()
							if (s == "on" || s == "off") {
								param ("punct", Punct = +(s == "on"))
								OK = "".true (1)
							}
						} else {
							res = {
								NOTICE: `punctuation=${["off", "on"][Punct]}`
							}
						}
					}
					let ERROR = "".true (OK.isFalse ())
					Chat.notice ("notice", "speech", a [0], res || { OK, ERROR })
				}
			})
		}, ( l, i ) => {
			Chat.con ("$!SPEECH2TEXT!$: cfg error `?` line ?", l, i)
		})
	}

	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
	const OK = location.protocol == "https:" && !!SpeechRecognition
	if (!OK)
		return

	const LANG = {
		"ru":	"ru-RU",
		"ua":	"uk-UA",
		"kz":	"kk-KZ",
		"en":	"en-GB",
		"de":	"de-DE",
		"fr":	"fr-FR",
		"it":	"it-IT"
	}
	const PUNCT = {}
	const ERROR = {}

	let param = August.storage ("speech2text")
	let Lang = param ("lang") || Chat.Lang
	let Punct = +(param ("punct") || 1)
	let Speech = new Map

	Chat.Event.on ("app-ready", init)
		.on ("app-done", done)
		.on ("user-reset", reset)
})
