//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: util-1.js


"use strict"

class util_1 {
	constructor ( root, node ) {
		this.root = root
		this.node = node
		this.re = new RegExp (util_1.RUS.join ("|"), "gm")
		this.XLAT = new Map
		for (let i = 0; i < util_1.RUS.length; i++)
			this.XLAT.set (util_1.RUS [i], util_1.XLAT [i])
		this.XLAT_CASE = new Map
		for (let i = 0; i < util_1.RUS.length; i++)
			this.XLAT_CASE.set (util_1.RUS [i], util_1.XLAT_CASE [i])
		this.TextFrom = this.node.$("#text_from")
		this.TextTo = this.node.$("#text_to")
		this.TextLen = this.node.$("#text_length")
		this.TextFrom.form = true
		this.TextFrom.type = "text"

		let timeStampTo = 0
		let timeStampFrom = 0
		let toInput = 0
		this.TextFrom.onscroll = e => {
			let t = e.timeStamp * 1000
			if (t - timeStampFrom < 2000)
				return
			this.TextTo.scrollTop = this.TextFrom.scrollTop
			this.TextTo.scrollLeft = this.TextFrom.scrollLeft
			this.node.prop ("--scroll-left", this.TextFrom.scrollLeft)
			timeStampTo = t
		}
		this.TextTo.onscroll = e => {
			let t = e.timeStamp * 1000
			if (t - timeStampTo < 2000)
				return
			this.TextFrom.scrollTop = this.TextTo.scrollTop
			this.TextFrom.scrollLeft = this.TextTo.scrollLeft
			timeStampFrom = t
		}
		this.TextFrom.onkeydown = e => {
			if (e.keyCode == 9) {
				e.preventDefault ()
				document.execCommand ("insertText", false, "\t")
			} else if (e.keyCode == 13) {
				e.preventDefault ()
				document.execCommand ("insertLineBreak")
				this.TextFrom.scrollLeft = 0
			}
		}
		this.TextFrom.oninput = e => {
			if (this.TextFrom.innerText.length < 10_000)
				return this.convert ()
			clearTimeout (toInput)
			toInput = setTimeout (() => this.convert (), 1000)
		}
		this.root.checkbox_cb ("cnv_case", v => {
			this.SensitiveCase = v
			this.convert ()
			this.focus ()
		})
	}
	done () {
		this.TextFrom.onscroll = this.TextTo.onscroll =
		this.TextFrom.onkeydown = this.TextFrom.oninput = null
	}
	keydown ( e ) {
	}
	click_handler ( a, el ) {
		switch (a) {
			case "text_from_clipboard":
				if (!navigator?.clipboard?.readText)
					return this.root.error (this.root.CFG.ERROR.NO_SUPPORT)
				navigator.clipboard.readText ().then (t => {
					this.TextFrom.scrollTop = 0
					this.convert (t)
					this.focus ()
				}).catch (e => {
					this.root.error (this.root.CFG.ERROR.FROM_CLIPBOARD.tpl ({ ERROR: e }))
				})
				break
			case "text_to_clipboard":
				if (!navigator?.clipboard?.writeText)
					return this.root.error (this.root.CFG.ERROR.NO_SUPPORT)
				navigator.clipboard.writeText (this.TextTo.innerText).then (() => {
					this.root.status (this.root.CFG.COPIED)
				}).catch (e => {
					this.root.error (this.root.CFG.ERROR.TO_CLIPBOARD.tpl ({ ERROR: e }))
				})
				break
			case "text_upload":
				this.root.FileOpen.click ()
				break
			case "text_download":
				this.download ()
				break
		}
	}
	download () {
		if (this.TextTo.innerText)
			this.root.download_fn ("", this.TextTo.innerText)
	}
	upload_handler ( name, text ) {
		this.TextFrom.scrollTop = 0
		this.convert (text)
		this.focus ()
	}
	convert ( t ) {
		if (isSet (t))
			this.TextFrom.innerText = t
		this.TextTo.innerText = this.TextFrom.innerText
			.replace (this.re, $ => this.SensitiveCase ? this.XLAT_CASE.get ($) : this.XLAT.get ($))
		this.TextLen.textContent = this.TextTo.innerText.length
	}
	focus () {
		setTimeout (() => this.TextFrom.focus (), 100)
	}

	static RUS = [
		"А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О",
		"П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я",
		"а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о",
		"п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"
	]
	static XLAT = [
		"a", "b", "w", "g", "d", "e", "e", "v", "z", "i", "j", "k", "l", "m", "n", "o", "p",
		"r", "s", "t", "u", "f", "h", "c", "~", "{", "}", "\\x7F", "y", "x", "|", "`", "q",
		"a", "b", "w", "g", "d", "e", "e", "v", "z", "i", "j", "k", "l", "m", "n", "o", "p",
		"r", "s", "t", "u", "f", "h", "c", "~", "{", "}", "\\x7F", "y", "x", "|", "`", "q"
	]
	static XLAT_CASE = [
		"a", "b", "w", "g", "d", "e", "e", "v", "z", "i", "j", "k", "l", "m", "n", "o", "p",
		"r", "s", "t", "u", "f", "h", "c", "~", "{", "}", "\\x7F", "y", "x", "|", "`", "q",
		"A", "B", "W", "G", "D", "E", "E", "V", "Z", "I", "J", "K", "L", "M", "N", "O", "P",
		"R", "S", "T", "U", "F", "H", "C", "^", "[", "]", "\\x7F", "Y", "X", "\\", "@", "Q"
	]

	UploadAsText = true
	SensitiveCase = 0
}

