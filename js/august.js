//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.js


function $ ( id, win ) {
	return (win || this).document.getElementById (id)
}

function $0 ( el, html ) {
	if (el) el.innerHTML = html
}

function isSet ( v ) {
	return v !== void 0
}

function isNumber ( v ) {
	return isType (v, Number)
}

function isString ( v ) {
	return isType (v, String)
}

function isObject ( v ) {
	return isType (v, Object)
}

function isArray ( v ) {
	return Array.isArray (v)
}

function isFunction ( v ) {
	return typeof v === "function"
}

function isType ( v, t ) {
	return isSet (v) && v !== null && v.constructor === t
}

function Enum ( ... a ) {
	let f = isFunction (a [a.length - 1]) ? a.pop () : i => i
	a.forEach (( a, i ) => this [a] = f (i))
}

Object.defineProperties (Object.prototype, {
	extend: {
		value: function ( p ) { Object.defineProperties (this, p); return this }
	}
})

Math.rnd = function ( min, max ) {
	return min + Math.random () * (max - min)
}

File.prototype.proto = {
	hash () {
		return [this.name, this.size, this.type, this.lastModified].join ("/").md5 ()
	}
}

RegExp.prototype.proto = {
	reset () {
		this.lastIndex = 0
		return this
	}
}

Event.prototype.proto = {
	stop () {
		this.cancelable && this.preventDefault ()
		this.stopPropagation ()
		return false
	},
	delta () {
		return this.wheelDelta ? -this.wheelDelta.sign () : this.deltaY.sign ()
	},
	keyCombo () {
		let c = (this.altKey ? 1 : 0) + (this.ctrlKey ? 2 : 0)
		let f = this.keyCode >= 0x70 && this.keyCode <= 0x7B
		return (c && this.keyCode >= 0x30) || f ? (c + (this.shiftKey ? 4 : 0)).shl8 + this.keyCode - 0x30 : 0
	},
	handler ( c, h, b ) {
		let kf = (this.altKey ? 1 : 0) | (this.ctrlKey ? 2 : 0) | (this.shiftKey ? 4 : 0)
		for (let i of isArray (c) ? c : [c]) {
			if ((i.c ? this.keyCode == i.c : this.key == i.k) && kf == i.f) {
				h (i)
				return b ? false : this.stop ()
			}
		}
		return true
	},
	closeWin () {
		if (this.keyCode == 0x74 || (this.ctrlKey && this.keyCode == 0x52))
			return this.stop ()
		if (this.altKey && this.keyCode == 0x58)
			this.view.close ()
	},
	__: {
		$: { get () { return this.target } }
	}
}

Element.prototype.proto = {
	$ ( n ) {
		return this.querySelector (n)
	},
	all ( n ) {
		return this.querySelectorAll (n)
	},
	is ( n ) {
		return this.tagName == n
	},
	s ( s ) {
		Object.assign (this.style, s)
		return this
	},
	css ( css = "" ) {
		this.style.cssText = css
		return this
	},
	display ( d = "none" ) {
		this.style.display = d
		return this
	},
	prop ( n, v ) {
		if (!isSet (v))
			return this.getStyleList ().getPropertyValue (n)
		this.style.setProperty (n, v)
		return this
	},
	props ( p ) {
		for (let n in p)
			this.style.setProperty (n, p [n])
		return this
	},
	pos ( x = null, y = null ) {
		return this.s ({
			left:	isNumber (x) ? `${x}px` : x,
			top:	isNumber (y) ? `${y}px` : y
		})
	},
	size ( w = null, h = null ) {
		return this.s ({
			width:	isNumber (w) ? `${w}px` : w,
			height:	isNumber (h) ? `${h}px` : h
		})
	},
	rect ( ... a ) {
		if (a.length) {
			let [x, y, w, h] = a
			return this.s ({
				left:	isNumber (x) ? `${x}px` : x,
				top:	isNumber (y) ? `${y}px` : y,
				width:	isNumber (w) ? `${w}px` : w,
				height:	isNumber (h) ? `${h}px` : h
			})
		}
		let r = this.getBoundingClientRect ()
		let b = this.ownerDocument.body
		r.x = r.left + b.scrollLeft - b.clientLeft | 0,
		r.y = r.top + b.scrollTop - b.clientTop | 0
		return r
	},
	getStyleList () {
		return getComputedStyle (this)
	},
	getStyle ( p ) {
		return "".val (this.getStyleList ()[p])
	},
	setHeight ( h = this.scrollHeight ) {
		return this.s ({ height: isNumber (h) ? `${h}px` : h })
	},
	setClass ( n, o ) {
		if (n) {
			if (!isSet (o))
				return this.classList.toggle (n)
			this.classList [o ? "add" : "remove"](n)
		}
		return this
	},
	hasClass ( n ) {
		return this.classList.contains (n)
	},
	noselect ( r = "none" ) {
		if (isSet (this.style.UserSelect))
			this.style.UserSelect = r
		else if (isSet (this.style.WebkitUserSelect))
			this.style.WebkitUserSelect = r
		else if (isSet (this.style.MozUserSelect))
			this.style.MozUserSelect = r
		return this
	},
	attr ( n, v ) {
		if (!isSet (v))
			return this.getAttribute (n)
		if (v === null)
			this.removeAttribute (n)
		else
			this.setAttribute (n, v)
		return this
	},
	create ( n, p ) {
		return Object.assign (this.ownerDocument.createElement (n), p)
	},
	append ( x, p ) {
		return this.appendChild (Object.assign (isString (x) ? this.create (x) : x, p))
	},
	insert ( x, el0, p ) {
		return this.insertBefore (Object.assign (isString (x) ? this.create (x) : x, p), el0)
	},
	replace ( el ) {
		return this.replaceWith (el), this
	},
	remove ( el ) {
		return el ? this.removeChild (el) : el
	},
	removeLast () {
		this.removeChild (this.last ())
		return this
	},
	next () {
		return this.nextElementSibling
	},
	prev () {
		return this.previousElementSibling
	},
	first () {
		return this.firstElementChild
	},
	last () {
		return this.lastElementChild
	},
	el ( i ) {
		return this.children [i]
	},
	child ( p ) {
		return this.up (p, el => el.parent () == p)
	},
	isEl ( p, to = null ) {
		return !!this.up (to, el => el == p)
	},
	isParent ( p, to = null ) {
		return this.parentElement.isEl (p, to)
	},
	parent ( name ) {
		let el = this.parentElement
		if (isSet (name)) {
			while (el && !el.is (name))
				el = el.parentElement
		}
		return el
	},
	insertHTML ( html, el0, p ) {
		let t = this.create ("template")
		t.innerHTML = html
		this.insert (t.content, el0, p)
		return el0 ? el0.next () : this.first ()
	},
	appendHTML ( html, p ) {
		let t = this.create ("template")
		t.innerHTML = html
		this.append (t.content, p)
		return this.last ()
	},
	replaceHTML ( html ) {
		let t = this.create ("template")
		t.innerHTML = html
		return this.replace (t.content)
	},
	up ( to, cond = _ => false ) {
		let el = this
		while (el && el != to) {
			if (cond (el))
				return el
			el = el.parentElement
		}
		return null
	},
	on ( ev, h, opt ) {
		if (!isArray (ev))
			this.on (ev.split (/ +/), h, opt)
		else for (let ev1 of ev)
			this.addEventListener (ev1, h, opt)
		return this
	},
	un ( ev, h, opt ) {
		if (!isArray (ev))
			this.un (ev.split (/ +/), h, opt)
		else for (let ev1 of ev)
			this.removeEventListener (ev1, h, opt)
		return this
	},
	fire ( ev, p = 0 ) {
		this.dispatchEvent (new CustomEvent (ev, {
			cancelable: true,
			bubbles: true,
			detail: p
		}))
		return this
	},
	td ( p ) {
		let s = this.getStyleList ()
		let i = s.transitionProperty.split (",").map (i => i.trim ()).indexOf (p)
		if (i == -1)
			return 0
		let t1 = s.transitionDuration.split (",")[i]
		let t2 = s.transitionDelay.split (",")[i]
		return (parseFloat (t1) + parseFloat (t2)) * 1000 | 0
	},
	td_max () {
		let s = this.getStyleList ()
		let t1 = s.transitionDuration.split (",").map (i => parseFloat (i))
		let t2 = s.transitionDelay.split (",").map (i => parseFloat (i))
		return Math.max (... t1.map (( a, i ) => a + t2 [i])) * 1000 | 0
	},
	swipe ( cb_2left, cb_2right, dist = 50, tm = 500, opt = 2 ) {
		return new august_touch (this, {
			end: e => {
				if (Math.abs (e.dx / e.dy) > 2 && Math.abs (e.dx) > dist && e.dt < tm) {
					(e.dx < 0 ? cb_2left : cb_2right).call (this)
				}
			},
			opt
		})
	}
}

Array.prototype.proto = {
	last () {
		return this [this.length - 1]
	},
	delete ( i ) {
		return this.splice (i, 1)
	},
	clear () {
		this.splice (0, this.length)
		return this
	},
	insert ( i, ... a ) {
		this.splice (i, 0, ... a)
		return this
	}
}

Number.prototype.proto = {
	bitCount () {
		let c = 0
		let n = this
		while (n) {
			c += (n | 0).bitCount32 ()
			n /= 0x100000000
		}
		return c
	},
	bitCount32 () {
		let n = this - ((this >> 1) & 0x55555555)
		n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
		return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
	},
	hex ( b = 0 ) {
		if (!b)
			return this < 256 ? (this >> 4).toString (16) + (this & 0x0f).toString (16) : this.toString (16)
		let r = ""
		while (b--)
			r += (this >> b * 8 & 0xff).hex ()
		return r
	},
	HEX ( b = 0 ) {
		return this.hex (b).toUpperCase ()
	},
	z ( z ) {
		let n = this.toString ()
		let r = z - n.length
		return r < 0 ? n : "0".repeat (r) + n
	},
	dd () {
		return this.z (2)
	},
	ddd () {
		return this.z (3)
	},
	ip () {
		return this ? `${this.b3}.${this.b2}.${this.b1}.${this.b0}` : ``
	},
	numeral ( d = "&thinsp;" ) {
		return this.toString ().numeral (d)
	},
	clamp ( min, max ) {
		return this < min ? min : this > max ? max : +this
	},
	sign () {
		return Math.sign (this)
	},
	rol ( c ) {
		return (this << c) | (this >>> 32 - c)
	},
	ext ( t ) {
		return ["", "gif", "jpg", "png", "webp", "", "", ""][this & (t ? 3 : 7)]
	},
	locale ( min = 0, max = 1 ) {
		return this.toLocaleString (
			void 0,
			{
				minimumFractionDigits: min,
				maximumFractionDigits: max
			}
		)
	},
	clock ( o = 0 ) {
		let t = o < 0 ? this * 1000 : this
		if (o < 0)
			o = -o
		let time = (o & 8 ? t % (24 * 3600000) : t) / 500 | 0
		let c = o & 4 ? ":" : time & 1 ? o & 2 ? " " : "<span style='visibility: hidden'>:</span>" : o & 2 ? ":" : "<span>:</span>"
		return (o & 1 ? "" : (time / 7200 | 0).dd () + c) + ((time / 120 | 0) % 60).dd () + c + ((time >> 1) % 60).dd () + (o & 16 ? "." + (t % 1000).ddd () : o & 32 ? "." + (t % 1000 / 10 | 0).dd () : "")
	},
	time ( hs, ms, opt = 0 ) {
		let h = this / 3600 | 0
		let m = (this / 60 | 0) % 60
		return (h
			? opt & 1 && !m
			? [h, h._end (hs, this._STR.h)]
			: [h, h._end (hs, this._STR.h), m, m._end (ms, this._STR.m)]
			: [m, m._end (ms, this._STR.m)]
		).join (" ")
	},
	days ( ds, hs, ms ) {
		let d = this / 3600 / 24 | 0
		return d
			? "? ? ?".format (d, d._end (ds, this._STR.d), (this - d * 24 * 3600).time (hs, ms))
			: this.time (hs, ms)
	},
	date ( f, l ) {
		return +this ? new Date (this * 1000).lang (l).format (f) : ""
	},
	ending () {
		let n9 = this % 10
		let n99 = (this / 10 | 0) % 10
		return (n9 == 1 && n99 != 1) ? 0 : (n9 && n9 < 5 && n99 != 1) ? 1 : 2
	},
	_end ( s, def ) {
		return isString (s)
			? s
			: (s || def)[this.ending ()]
	},
	_STR: {
		h: [ "час", "часа", "часов" ],
		m: [ "минута", "минуты", "минут" ],
		s: [ "секунда", "секунды", "секунд" ],
		d: [ "день", "дня", "дней" ]
	},
	__: {
		b0: { get () { return this & 0xff } },
		b1: { get () { return this >> 8 & 0xff } },
		b2: { get () { return this >> 16 & 0xff } },
		b3: { get () { return this >> 24 & 0xff } },
		w0: { get () { return this & 0xffff } },
		w1: { get () { return this >> 16 & 0xffff } },
		shl8: { get () { return this << 8 } },
		shl16: { get () { return this << 16 } },
		bswap16: { get () { return this.b1 | this.b0.shl8 } },
		hex8: { get () { return this.hex () } },
		hex16: { get () { return this.b1.hex8 + this.b0.hex8 } },
		HEX8: { get () { return this.HEX () } },
		HEX16: { get () { return this.b1.HEX8 + this.b0.HEX8 } }
	}
}

Date.prototype.proto = {
	setTimeZone ( tz ) {
		Date.prototype.tz = (new Date).getTimezoneOffset () * 60 + tz
		return this
	},
	lang ( l ) {
		if (isSet (l) && isSet (this.MONTHS [l]))
			this.LANG = l
		return this
	},
	month ( g ) {
		let m = this.MONTHS [this.LANG]
		return (m [g || 0] || m [0])[this.getMonth ()]
	},
	wday ( sh ) {
		return this.WDAYS [this.LANG][sh || 0][this.getDay ()]
	},
	format ( fmt ) {
		if (!fmt)
			return ""
		let d = new Date (this.getTime () + (this.tz || 0) * 1000).lang (this.LANG)
		if (isArray (fmt)) {
			let now = new Date (Date.now () + (this.tz || 0) * 1000)
			fmt = now.getFullYear () != d.getFullYear ()
				? fmt [3] || fmt [2]
				: now.getMonth () != d.getMonth ()
				? fmt = fmt [2]
				: now.getDate () == d.getDate ()
				? fmt = fmt [0]
				: now.getDate () - d.getDate () == 1
				? fmt = fmt [1]
				: fmt = fmt [2]
			
		} else if (fmt.def) {
			let now = new Date (Date.now () + (this.tz || 0) * 1000)
			fmt = now.getFullYear () == d.getFullYear () && fmt.year || fmt.def
		}
		return fmt.replace (/dd?d?d?|mm?m?m?g?|yy?y?y?|hh?|HH?|ii?|ss?|tt?/g, fmt => {
			switch (fmt) {
				case "h":
				case "hh":
					let h = d.getHours () < 13
						? d.getHours () || 12
						: d.getHours () - 12
					return fmt.length == 1 ? h : h.dd ()
				case "H":
					return d.getHours ()
				case "HH":
					return d.getHours ().dd ()
				case "i":
					return d.getMinutes ()
				case "ii":
					return d.getMinutes ().dd ()
				case "s":
					return d.getSeconds ()
				case "ss":
					return d.getSeconds ().dd ()
				case "yy":
					return (d.getFullYear () % 100).dd ()
				case "yyyy":
					return d.getFullYear ()
				case "d":
					return d.getDate ()
				case "dd":
					return d.getDate ().dd ()
				case "ddd":
					return d.wday (1)
				case "dddd":
					return d.wday ()
				case "m":
					return d.getMonth () + 1
				case "mm":
					return (d.getMonth () + 1).dd ()
				case "mmm":
					return d.month ().substr (0, 3)
				case "mmmm":
					return d.month ()
				case "mmmg":
					return d.month (1)
				case "t":
					return d.getHours () < 12 ? "A" : "P"
				case "tt":
					return d.getHours () < 12 ? "AM" : "PM"
				default:
					return ""
			}
		})
	},
	addMonths ( m ) {
		Object.assign (this.MONTHS, m)
		return this
	},
	addWdays ( d ) {
		Object.assign (this.WDAYS, d)
		return this
	},
	LANG: "ru",
	MONTHS: {
		ru: [
			[ "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь" ],
			[ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ]
		]
	},
	WDAYS: {
		ru: [
			[ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ],
			[ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ]
		]
	}
}

String.prototype.HTML_ENT_DECODE = {
	amp: "&",
	lt:  "<",
	gt:  ">"
}

String.prototype.re = {
	pattern:	/{{{(?::([a-zA-Z]+\w*)(?:\((.+?)\))?)?(?::(\d+))?(?:((?:(?!{{{).|\s)*?)(?:\|\|\|((?:.|\s)+?))?)}}}/,
	numeral:	/\B(?=(?:\d{3})+\b)/g,
	strip:		/<[^>]*>/g,
	nl2br:		/\r?\n/g,
	htmlen:		/['"&<>]/g,
	htmlende:	/&([a-z]+);/g,
	addsl:		/['"\\]/g,
	esc_re:		/[.*+\-?^${}()|[\]\\]/g,
	code:		/^(&([a-zA-Z]{2,}\d*|#\d+|#x[\da-fA-F]{2,});)/g,
	space:		/[ \u2000-\u200f\u2028-\u202f\u205f-\u206f\u3000\u180e\ufeff\u00a0\t\r\n]+/g,
	re1:		/\x01[^\x01\x03]+\x03/g
}

String.prototype.tpl_const = {
	get __FALSE__	()	{ return { r: "", v: 0 } },
	get __TRUE__ 	()	{ return { r: "", v: 1 } }
}

String.prototype.tpl_func = {
	REGEXP:		( re, p, s ) => s.replace (new RegExp (re, "g"), p),
	REPEAT:		( s, n ) => s.repeat (n),
	ENDING:		( n, a ) => isNumber (n) ? a [n.ending ()] : "",
	NUMERAL:	( n, d ) => n.toString ().numeral (d),
	DATE:		( t, f, l ) => t && isNumber (t) ? t.date (f, l) : "",
	HEX:		( n, b ) => n.hex (b),
	IF:		( ... a ) => a.length == 2 ? a [0] || a [1] : a.length == 3 ? "".val (a [0]) ? a [1] : a [2] : "",
	EQ:		( a, b ) => "".true (a == b),
	LT:		( a, b ) => "".true (a < b),
	GT:		( a, b ) => "".true (a > b),
	LOWER:		s => s.toLowerCase (),
	UPPER:		s => s.toUpperCase (),
	FALSE:		v => "".false (v),
	TRUE:		v => "".true (v),
	"":		v => v.toString ().true (0)
}

String.prototype.$id = (() => { let id = 0; return () => id++ })()

String.prototype.isDef = function  ( name ) {
	return this.tpl_func [name] && !this.tpl_func [name].__redef
}

String.prototype.define = function ( name, hndlr, redef ) {
	let load = ( hndlr, n, a ) => {
		if (!hndlr)
			return n
		let html = hndlr.html && hndlr.html (n, ... a)
		if (isString (html))
			return html
		let id = this.$id ()
		hndlr.load (n, html => {
			let t = hndlr.root.$(`#__templ_${id}`)
			if (t) {
				t.innerHTML = html
				t.replaceWith (t.content)
			}
		}, ... a)
		return `<template id=__templ_${id}></template>`
	}
	if (!this.isDef (name)) {
		this.tpl_func [name] = isFunction (hndlr) ? hndlr : ( n, ... a ) => load (hndlr, n, a)
		this.tpl_func [name].__redef = redef
	}
	return this
}

String.prototype.xtpl = function  ( n, d, tpl ) {
	if (!isSet (d))
		return ""
	if (this.isDef (n))
		return this.tpl_func [n](d)
	let t = {}
	let r = this.define (n, r => {
		for (let n in r) {
			if (isString (r [n])) {
				t [n] = d ? d [r [n]] : ""
			} else if (isObject (r [n])) {
				let p = Object.entries (r [n])[0]
				t [n] = tpl => d ? this.xtpl (p [0], d [p [1]], tpl) : ""
			}
		}
	}, 1).tpl ()
	return (tpl || r).tpl (t)
}

String.prototype.set = function ( n, v = true ) {
	Object.defineProperty (this, n, { value: v, writable: true })
	return this
}

String.prototype.val = function ( v ) {
	let n = parseInt (v)
	return n === n ? n : v
}

String.prototype.true = function ( v ) {
	return this.set ("__TRUE__", v === null ? false : isSet (v) && isSet (v.__TRUE__) ? v.__TRUE__ : !!this.val (v))
}

String.prototype.false = function ( v ) {
	return this.set ("__TRUE__", v === null ? true : isSet (v) && isSet (v.__TRUE__) ? !v.__TRUE__ : !this.val (v))
}

String.prototype.isTrue = function () {
	return !!this.__TRUE__
}

String.prototype.isFalse = function () {
	return !this.__TRUE__
}

String.prototype.stripTags = function () {
	return this.replace (this.re.strip, "")
}

String.prototype.nl2br = function () {
	return this.replace (this.re.nl2br, "<br>")
}

String.prototype.htmlEntities = function ( htmlen ) {
	return this.replace (htmlen ? new RegExp (`[${htmlen}]`, "g") : this.re.htmlen, $0 => `&#${$0.charCodeAt (0)};`)
}

String.prototype.htmlEntityDecode = function () {
	return this.replace (this.re.htmlende, ( $0, $1 ) => $1.HTML_ENT_DECODE [$1] || $0)
}

String.prototype.addSlashes = function () {
	return this.replace (this.re.addsl, "\\$&")
}

String.prototype.escapeRegExp = function () {
	return this.replace (this.re.esc_re, "\\$&")
}

String.prototype.empty = function  ( c ) {
	return c ? "" : this
}

String.prototype.paddingLeft = function ( n, ch = " " ) {
	return ch.repeat (Math.max (0, n - this.length)) + this
}

String.prototype.paddingRight = function ( n, ch = " " ) {
	return this + ch.repeat (Math.max (0, n - this.length))
}

String.prototype.z = function ( n ) {
	return this.paddingLeft (n, "0")
}

String.prototype.hex = function ( t = 0 ) {
	return !t || new RegExp (`^[0-9a-fA-F]{${t}}$`).test (this) ? parseInt (this, 16) : NaN
}

String.prototype.numeral = function ( d = "&thinsp;" ) {
	return this.replace (this.re.numeral, d)
}

String.prototype.encode = function ( en ) {
	return this.replace (new RegExp (`[${(en || "%?#:;,+()[]&='/\\\"\r\n\t").escapeRegExp ()}]`, "g"), ch => "%" + ch.charCodeAt ().hex ())
}

String.prototype.insert = function ( s, p ) {
	return this.subreplace (s, p, p)
}

String.prototype.subreplace = function ( s, p, e ) {
	return this.substring (0, p) + (isFunction (s) ? s (this.substring (p, e)) : s) + this.substring (e)
}

String.prototype.replaceAll = function ( f, r ) {
	if (isArray (f) && isArray (r)) {
		let s = this
		for (let i = 0; i < f.length; i++) {
			if (f [i])
				s = s.replace (f [i], r [i])
		}
		return s
	} else if (isObject (f) && !isSet (r)) {
		let s = this
		for (let f1 in f)
			s = s.replaceAll (f1, f [f1])
		return s
	}
	return isType (f, RegExp) ? this.replace (f, r) : this.replace (new RegExp (f.escapeRegExp (), "g"), r)
}

String.prototype.format = function ( ... a ) {
	let i = 0
	if (a.length == 1 && isArray (a [0]))
		a = a [0]
	return this.replace (/(\\)?\?/g, ( x, sl ) => sl ? "?" : a [i++])
}

String.prototype.param = function ( p, set2 ) {
	let set = {}
	for (let s of this.match (/%\w+%/gm) || [])
		set [s.substr (1, s.length - 2)] = ""
	let t = isSet (set [p])
	set [p] = "".true (1)
	return this.tpl (Object.assign (set, set2)).true (t)
}

String.prototype.utf8 = function () {
	let b = encodeURIComponent (this).replace (/%([0-9A-F]{2})/g, ( $0, $1 ) => String.fromCharCode (parseInt ($1, 16)))
	let r = new Uint8Array (b.length)
	for (let i = 0; i < b.length; i++)
		r [i] = b [i].charCodeAt (0)
	return r
}

String.prototype.crypt = function ( key ) {
	let p = this.md5 ()
	let c = ""
	for (let i = 0; i < key.length; i++)
		c += String.fromCharCode (p.charCodeAt (i) ^ key.charCodeAt (i))
	return c.md5 ()
}

String.prototype.html = function ( ml, f = -1 ) {
	let t = t => ml && t.length > ml ? `${t.substr (0, ml - 9)}...${t.substr (-6)}` : t
	let s = this
	if (f & 1)
		s = s.htmlEntities ("&<>")
	if (f & 2)
		s = s.nl2br ()
	if (f & 4)
		s = s.replace (August.html.EMAIL_RE, ( $0, $1 ) => `<a class=link href='mailto:${$1}'>${t ($1)}</a>`)
	if (f & 8)
		s = s.replace (August.html.URL_RE, ( $0, $1 ) => `<a class=link href='r.php?${$1}' target=_blank>${t ($1)}</a>`)
	return s
}

String.prototype.smile_fn = function ( p ) {
	let id = this.hex ()
	return "??.?".format (p ? p.z (8) : id & 0x00400000 ? "0" : "1", (id & 0x000fffff).z (6), (id >> 20).ext (1))
}

String.prototype.parse_tpl = function () {
	let STATE = arguments.callee.STATE
	let s = this
	for (let c of s.parse_var ())
		s = s.subreplace (" ".repeat (c.e - c.b + 1), c.b, c.e + 1)
	let t = []
	let cc = []
	let st = STATE.N
	for (let l = 0, i = 0; i < s.length; i++) {
		let ch = s [i]
		switch (st) {
			case STATE.N:
				if (ch == '%')		st = STATE.P1
				break
			case STATE.P1:
				if (ch == '?')		st = STATE.O1, t [++l] = { b: i - 1, st: STATE.N }
				else if (ch != '%')	st = STATE.N
				break
			case STATE.O1:
				if (ch == '%')		st = STATE.P2
				else if (ch == '?')	st = STATE.Q1
				break
			case STATE.O2:
				if (ch == '%')		st = STATE.P3
				else if (ch == '?')	st = STATE.Q2
				break
			case STATE.P2:
				if (ch == '?')		st = STATE.O1, t [++l] = { b: i - 1, st: STATE.O1 }
				else if (ch == ':')	st = STATE.S
				else if (ch != '%')	st = STATE.O1
				break
			case STATE.P3:
				if (ch == '?')		st = STATE.O1, t [++l] = { b: i - 1, st: STATE.O2 }
				else if (ch != '%')	st = STATE.O2
				break
			case STATE.S:
				if (ch == '%')		st = STATE.O2, t [l].a = i - 2
				else			st = STATE.O1
				break
			case STATE.Q1:
			case STATE.Q2:
				if (ch == '%')		st = t [l].st, t [l].e = i + 1, cc.push (t [l--])
				else			st = st == STATE.Q1 ? STATE.O1 : STATE.O2
				break
		}
	}
	return this.set ("TPL", cc.sort (( a, b ) => a.b - b.b))
}

String.prototype.parse_tpl.STATE = new Enum ('N', 'P1', 'P2', 'P3', 'O1', 'O2', 'Q1', 'Q2', 'S')

String.prototype.parse_var = function () {
	let STATE = arguments.callee.STATE
	let t = []
	let cc = []
	let st = STATE.O
	let w_re = /\w/
	for (let l = 0, i = 0; i < this.length; i++) {
		let ch = this [i]
		switch (st) {
			case STATE.O:
				if (ch == '%')			st = STATE.P
				else if (ch == ')' && l)	st = STATE.C
				else if (ch == '\n' && l && t [l].w && this.startsWith (t [l].w + "%", i + 1)) {
					i += t [l].w.length + 1
					t [l].e = i
					t [l].w = t [l].w.length
					t [l].name = this.substring (t [l].b + 1, t [l].a)
					cc.push (t [l--])
				}
				break
			case STATE.P:
				if (w_re.test (ch))		st = STATE.N, t [++l] = { b: i - 1 }
				else if (ch == '(')		st = STATE.O, t [++l] = { b: i - 1, a: i }
				else if (ch != '%')		st = STATE.O
				break
			case STATE.N:
				if (ch == '(')			st = STATE.O, t [l].a = i
				else if (ch == '<')		st = STATE.W, t [l].a = i, t [l].w = 2
				else if (ch == '%')		st = STATE.O, t [l].e = i, cc.push (t [l--])
				else if (!w_re.test (ch))	st = STATE.O, --l
				break
			case STATE.W:
				if (ch == '<')			t [l].w--
				else if (w_re.test (ch) && !t [l].w)
								st = STATE.E, t [l].w = i
				else				st = STATE.O, --l
				break
			case STATE.E:
				if (ch == '\n')			st = STATE.O, t [l].w = this.substring (t [l].w, i--)
				else if (!w_re.test (ch))	st = STATE.O, --l
				break
			case STATE.C:
				if (ch == ')')			break
				if (ch == '%') {
					while (cc.length && cc.last ().b > t [l].b)
						cc.length--
					t [l].e = i
					cc.push (t [l--])
				}
				st = STATE.O
				break
		}
	}
	return cc
}

String.prototype.parse_var.STATE = new Enum ('O', 'P', 'N', 'W', 'E', 'C')

String.prototype.tpl = function ( re, o = 0 ) {
	let t = ( $0, $1, $2 ) => {
		let v = $1.tpl_const [$1]
		if (isSet (v)) {
			t.t++
			t.r += v.v
			return v.r
		}
		if (!re || !isSet (re [$1])) {
			(re || (re = {}))[$1] = o & 16 ? "" : o & 8 ? void 0 : $1.tpl_func [$1]
			if (!isSet (re [$1])) {
				if (isSet (August.form [$1])) {
					try {
						let r = August.form [$1](... new Function (`return [${$2}]`)())
						t.t++
						if ($2.isTrue ())
							t.r++
						return r
					} catch ( e ) {
					}
				}
				return $2 ? `%${$1}(${$2})%` : $0
			}
		}
		let r = isFunction (re [$1]) ? $2 ? (() => {
			try {
				let arg = (new Function (`return [${$2}]`))()
				if (arg.length)
					return re [$1](... arg)
			} catch ( e ) {
			}
			return re [$1]($2)
		})() : re [$1]() : re [$1]
		t.t++
		if (r && (r.__TRUE__ || (!isSet (r.__TRUE__) && r !== "")))
			t.r++
		return r !== void 0 && r !== null ? r.toString () : ""
	}
	let ret = s => {
		if (o & 1) {
			for (let n in re)
				s = s.replace (new RegExp (`%(${n})(?:\\\((.*?)\\\))?%`, "g"), t)
			return s
		}
		let sl0 = s.length
		let pl = [{ p: -1, d: 0 }]
		for (let c of s.parse_var ()) {
			if (c.w && o & 4)
				continue
			let ipl = pl.length
			while (ipl-- && pl [ipl].p > c.b)
				;
			let d = pl [ipl].d
			let la = 0
			if (c.a && c.b < pl.last ().p) {
				for (let j = pl.length; j--; ) {
					if (pl [j].p < c.b)
						break
					la += pl [j].l
					pl.length--
				}
			}
			if (c.w) {
				if (!re.__)
					re.__ = {}
				if (!re.__ [c.name]) {
					re.__ [c.name] = []
					re [c.name] = _ => re.__ [c.name].join (_ || "")
				}
				re.__ [c.name].push (s.substr (d + c.a + c.w + 4, c.e - c.a - c.w * 2 - 5 + la).tpl (re, o))
			}
			let r = c.w ? "" : t (
				s.substr (d + c.b, c.e - c.b + 1 + la),
				s.substr (d + c.b + 1, (c.a || c.e) - c.b - 1),
				c.a ? s.substr (d + c.a + 1, c.e - c.a - 2 + la).tpl (re, o) : null
			)
			let sl = s.length
			s = s.subreplace (r, d + c.b, d + c.e + 1 + la)
			pl.push ({ p: c.b, d: s.length - sl0, l: s.length - sl + la })
		}
		return s
	}

	if (!this.length)
		return this
	if (o & 2)
		return ret (this)

	let s = this
	let TPL = isSet (this.TPL) ? this.TPL : this.parse_tpl ().TPL
	let idx = 0
	if (isFunction (re))
		re = re ()
	else if (!re)
		re = {}
	return (function ( b, e ) {
		let AND = s [b] == ':' && s [b + 1] == '&'
		let ONE = s [b] == ':' && s [b + 1] == '1'
		if (AND || ONE)
			b += 2
		let s1 = s.substring (b, e)
		let tr = 0
		for (;;) {
			let c = TPL [idx]
			if (!c || c.b > e)
				break
			idx++
			t.t = 0
			let r = arguments.callee (c.b + 2, c.a || c.e - 2)
			if (c.a && t.r) {
				let c2 = TPL [idx]
				while (c2 && c2.b < c.e)
					c2 = TPL [++idx]
			}
			if (t.t) {
				let s2 = t.r ? r : c.a ? arguments.callee (c.a + 3, c.e - 2) : ""
				s1 = s1.subreplace (s2, c.b - b, c.e - b)
				b += c.e - c.b - s2.length
				tr += t.r
			}
		}
		let tt = t.t
		t.r = 0
		t.t = 0
		let r = ret (s1)
		if (ONE)
			;
		else if (!AND)
			t.r += tr
		else if (t.r && t.r != t.t)
			t.r = 0
		t.t += tt
		return r
	})(0, s.length).true (t.r)
}

String.prototype.pattern = function ( re, re2 ) {
	let n = re.$n || 0
	re.$n = n
	if (isArray (re) && !re [n])
		return this
	let t = this.re.pattern.exec (this)
	if (!t)
		return re2 ? this.tpl (re2) : this
	for (;;) {
		let t2 = this.re.pattern.exec (this.subreplace (" ".repeat (t [0].length), t.index, t.index + t [0].length))
		if (!t2 || t2.index > t.index)
			break
		t = t2
		t [4] = this.substr (t.index + t [0].length - t [4].length - 3 - (t [5] ? t [5].length + 3 : 0), t [4].length)
	}
	t.left = this.substr (0, t.index)
	t.right = this.substr (t.index + t [0].length)
	if (isFunction (re))
		return t.left + re (t [0], t [1], t [4], t [2], t [3], t [5]) + t.right.pattern (re, re2)
	let p = re
	if (!isArray (re)) {
		p = p [t [1]]
		if (!p)
			return t.left + t [0] + t.right.pattern (re, re2)
	}
	p [n].$tpl_name = t [1]
	if (n)
		p [n].$ = p [n - 1]
	if (t [2] && p [n].$args)
		p [n].$args (... new Function (`return [${t [2]}]`)())
	if (t [3] && p [n].$cols) {
		p [n].$cols (t [3])
	} else if (t [3] && p [n].$list && p [n].$list.length) {
		p [n].$c = +t [3]
		if (p [n].$c > 1)
			p [n].$l = p [n].$list.length - 1 - (p [n].$list.length - 1) % p [n].$c + p [n].$c
	}
	if (!isSet (p [n].$n)) {
		p [n].$n = function () {
			if (!this.$c || this.$c == 1)
				return this.$i
			let a = this.$i % this.$c
			return (this.$i - a) / this.$c + this.$l / this.$c * a
		}
	}
	if (!isSet (p [n].CC)) {
		p [n].CC = function ( c ) {
			return "".true (((this.$i % this.$c) + 1) == c)
		}
	}
	if (!isSet (p [n].ODD)) {
		p [n].ODD = function () {
			return "".true (this.$i & 1)
		}
	}
	if (!isSet (p [n].EVEN)) {
		p [n].EVEN = function () {
			return "".false (this.$i & 1)
		}
	}
	if (p [n].$tpl) {
		p [n].$tpl (t.input)
		p [n].$tpl = null
	}
	let s = ""
	for (let i = 0; i < p [n].$size (); i++) {
		p [n].$i = i
		if (p [n].$set) {
			if (p [n].$set (i) === false)
				continue
		}
		p.$n = n + 1
		s += t [4].pattern (p, re2).tpl (p [n], 4)
	}
	if (!s.length && t [5])
		s = t [5]
	return (t.left + s + (s.length ? "%__TRUE__%" : "%__FALSE__%") + (isArray (re) ? t.right : t.right.pattern ((re.$n = 0, re), re2))).tpl (re2)
}

String.prototype.color = function ( clrs ) {
	let l = s => {
		do {
			var l = s.length
			s = s.replace (s.re.re1, "")
		} while (l != s.length)
		return [... s.replace (/<[^>]+>?/g, "").replace (s.re.space, "").replace (s.re.code, ".")].length
	}
	let c = ( r, g, b, s ) => {
		return `<font color=#${r.hex ()}${g.hex ()}${b.hex ()}>${s}</font>`
	}
	let cc = ( c1, c2, d ) => {
		let r1 = c1.b2, g1 = c1.b1, b1 = c1.b0
		let r2 = c2.b2, g2 = c2.b1, b2 = c2.b0
		r2 -= r1
		g2 -= g1
		b2 -= b1
		return d
			? ( i, ch ) => c (r1 + i * r2 / d, g1 + i * g2 / d, b1 + i * b2 / d, ch)
			: ( i, ch ) => c (r1, g1, b1, ch)
	}
	let g = ( c1, c2, l, f ) => {
		let clr = cc (c1.substr (1).hex (), c2.substr (1).hex (), l - f)
		let res = ""
		for (let i = 0; idx < this.length;) {
			let ch = this [idx]
			if (ch == '<') {
				for (let t = 0; idx < this.length; idx++) {
					res += this [idx]
					if (this [idx] == '\x01')
						t++
					else if (this [idx] == '\x03')
						t--
					else if (this [idx] == '>' && !t)
						break
				}
				idx++
			} else if (res.re.space.test (ch)) {
				res.re.space.reset ()
				res += ch
				idx++
			} else if (i != l || f) {
				res.re.code.reset ()
				if (ch == '&' && res.re.code.test (this.substr (idx)))
					ch = RegExp.$1
				else if (this.codePointAt (idx) > 0xffff)
					ch += this [idx + 1]
				res += clr (i, ch)
				idx += ch.length
				i++
			} else {
				break
			}
		}
		return res
	}

	let Len = l (this)
	if (!Len)
		return this
	let cs = clrs.split ("-")
	let c0 = cs [0]
	let n = cs.length - 1
	if (!n || cs.every (v => v == c0))
		return `<font color='${c0}'>${this}</font>`
	let d = 0
	let res = ""
	let idx = 0
	for (let i = 1; i < n; i++) {
		let d0 = i * Len / n | 0
		if (d0 == d || !cs [i])
			continue
		res += g (c0, cs [i], d0 - d, 0)
		c0 = cs [i]
		d = d0
	}
	return res + g (c0, cs [n], Len - d, 1)
}

String.prototype.md5 = function () {
	return this.utf8 ().md5 ()
}

String.prototype.extend ({
	_: { get () { return this.replace (/[-/]/g, "_") } }
})

Uint8Array.prototype.md5 = function () {
	let transform = () => {
		let F = ( x, y, z ) => z ^ (x & (y ^ z))
		let G = ( x, y, z ) => y ^ (z & (x ^ y))
		let H = ( x, y, z ) => x ^ y ^ z
		let I = ( x, y, z ) => y ^ (x | ~z)
		let FF = ( a, b, c, d, x, f, s, ac ) => (a + f (b, c, d) + x + ac).rol ($S [s]) + b

		let a = State.a
		let b = State.b
		let c = State.c
		let d = State.d
		let x = Buffer

		a = FF (a, b, c, d, x [ 0], F, 0, 0xd76aa478)
		d = FF (d, a, b, c, x [ 1], F, 1, 0xe8c7b756)
		c = FF (c, d, a, b, x [ 2], F, 2, 0x242070db)
		b = FF (b, c, d, a, x [ 3], F, 3, 0xc1bdceee)
		a = FF (a, b, c, d, x [ 4], F, 0, 0xf57c0faf)
		d = FF (d, a, b, c, x [ 5], F, 1, 0x4787c62a)
		c = FF (c, d, a, b, x [ 6], F, 2, 0xa8304613)
		b = FF (b, c, d, a, x [ 7], F, 3, 0xfd469501)
		a = FF (a, b, c, d, x [ 8], F, 0, 0x698098d8)
		d = FF (d, a, b, c, x [ 9], F, 1, 0x8b44f7af)
		c = FF (c, d, a, b, x [10], F, 2, 0xffff5bb1)
		b = FF (b, c, d, a, x [11], F, 3, 0x895cd7be)
		a = FF (a, b, c, d, x [12], F, 0, 0x6b901122)
		d = FF (d, a, b, c, x [13], F, 1, 0xfd987193)
		c = FF (c, d, a, b, x [14], F, 2, 0xa679438e)
		b = FF (b, c, d, a, x [15], F, 3, 0x49b40821)

		a = FF (a, b, c, d, x [ 1], G, 4, 0xf61e2562)
		d = FF (d, a, b, c, x [ 6], G, 5, 0xc040b340)
		c = FF (c, d, a, b, x [11], G, 6, 0x265e5a51)
		b = FF (b, c, d, a, x [ 0], G, 7, 0xe9b6c7aa)
		a = FF (a, b, c, d, x [ 5], G, 4, 0xd62f105d)
		d = FF (d, a, b, c, x [10], G, 5, 0x02441453)
		c = FF (c, d, a, b, x [15], G, 6, 0xd8a1e681)
		b = FF (b, c, d, a, x [ 4], G, 7, 0xe7d3fbc8)
		a = FF (a, b, c, d, x [ 9], G, 4, 0x21e1cde6)
		d = FF (d, a, b, c, x [14], G, 5, 0xc33707d6)
		c = FF (c, d, a, b, x [ 3], G, 6, 0xf4d50d87)
		b = FF (b, c, d, a, x [ 8], G, 7, 0x455a14ed)
		a = FF (a, b, c, d, x [13], G, 4, 0xa9e3e905)
		d = FF (d, a, b, c, x [ 2], G, 5, 0xfcefa3f8)
		c = FF (c, d, a, b, x [ 7], G, 6, 0x676f02d9)
		b = FF (b, c, d, a, x [12], G, 7, 0x8d2a4c8a)

		a = FF (a, b, c, d, x [ 5], H,  8, 0xfffa3942)
		d = FF (d, a, b, c, x [ 8], H,  9, 0x8771f681)
		c = FF (c, d, a, b, x [11], H, 10, 0x6d9d6122)
		b = FF (b, c, d, a, x [14], H, 11, 0xfde5380c)
		a = FF (a, b, c, d, x [ 1], H,  8, 0xa4beea44)
		d = FF (d, a, b, c, x [ 4], H,  9, 0x4bdecfa9)
		c = FF (c, d, a, b, x [ 7], H, 10, 0xf6bb4b60)
		b = FF (b, c, d, a, x [10], H, 11, 0xbebfbc70)
		a = FF (a, b, c, d, x [13], H,  8, 0x289b7ec6)
		d = FF (d, a, b, c, x [ 0], H,  9, 0xeaa127fa)
		c = FF (c, d, a, b, x [ 3], H, 10, 0xd4ef3085)
		b = FF (b, c, d, a, x [ 6], H, 11, 0x04881d05)
		a = FF (a, b, c, d, x [ 9], H,  8, 0xd9d4d039)
		d = FF (d, a, b, c, x [12], H,  9, 0xe6db99e5)
		c = FF (c, d, a, b, x [15], H, 10, 0x1fa27cf8)
		b = FF (b, c, d, a, x [ 2], H, 11, 0xc4ac5665)

		a = FF (a, b, c, d, x [ 0], I, 12, 0xf4292244)
		d = FF (d, a, b, c, x [ 7], I, 13, 0x432aff97)
		c = FF (c, d, a, b, x [14], I, 14, 0xab9423a7)
		b = FF (b, c, d, a, x [ 5], I, 15, 0xfc93a039)
		a = FF (a, b, c, d, x [12], I, 12, 0x655b59c3)
		d = FF (d, a, b, c, x [ 3], I, 13, 0x8f0ccc92)
		c = FF (c, d, a, b, x [10], I, 14, 0xffeff47d)
		b = FF (b, c, d, a, x [ 1], I, 15, 0x85845dd1)
		a = FF (a, b, c, d, x [ 8], I, 12, 0x6fa87e4f)
		d = FF (d, a, b, c, x [15], I, 13, 0xfe2ce6e0)
		c = FF (c, d, a, b, x [ 6], I, 14, 0xa3014314)
		b = FF (b, c, d, a, x [13], I, 15, 0x4e0811a1)
		a = FF (a, b, c, d, x [ 4], I, 12, 0xf7537e82)
		d = FF (d, a, b, c, x [11], I, 13, 0xbd3af235)
		c = FF (c, d, a, b, x [ 2], I, 14, 0x2ad7d2bb)
		b = FF (b, c, d, a, x [ 9], I, 15, 0xeb86d391)

		State.a = sum (State.a, a)
		State.b = sum (State.b, b)
		State.c = sum (State.c, c)
		State.d = sum (State.d, d)
	}
	let update = ch => {
		Code += ch << ((Index & 3) << 3)
		if ((Index & 3) == 3) {
			Buffer [Index >> 2] = Code
			Code = 0
			if (Index == 63)
				transform ()
		}
		Index++
		Index &= 0x3f
	}
	let sum = ( x, y ) => {
		let l = x.w0 + y.w0
		let m = x.w1 + y.w1 + l.w1
		return m.shl16 | l.w0
	}
	let hex = n => {
		return n.b0.hex () + n.b1.hex () + n.b2.hex () + n.b3.hex ()
	}

	let $S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
	let Index = 0
	let Code = 0
	let Buffer = []
	let State = { a: 0x67452301, b: 0xefcdab89, c: 0x98badcfe, d: 0x10325476 }

	this.forEach (update)
	let idx = this.length & 0x3f
	let pad = (idx < 56 ? 56 : 120) - idx
	update (0x80)
	while (--pad)
		update (0)
	update ((this.length <<  3) & 0xff)
	update ((this.length >>  5) & 0xff)
	update ((this.length >> 13) & 0xff)
	update ((this.length >> 21) & 0xff)
	update ((this.length >> 29) & 0xff)
	update (0)
	update (0)
	update (0)
	return hex (State.a) + hex (State.b) + hex (State.c) + hex (State.d)
}

august_run = (() => {
	let run = () => {
		while (fs.length) {
			let f = fs.shift ()
			if (f.js && f.js.length) {
				let cb = August.defer (f.js.length, f.f)
				for (let js of f.js) {
					if (js)
						August.loadJS (js).then (cb).catch (cb)
					else
						cb ()
				}
			} else {
				f.f ()
			}
		}
	}
	let fs = []

	return function ( f, js ) {
		fs.push ({ f, js })
		if (this.document.readyState == "complete")
			run ()
		else if (fs.length == 1)
			this.document.addEventListener ("DOMContentLoaded", run)
	}
})()

function august_extend ( c, p ) {
	c.prototype = Object.create (p.prototype)
	c.prototype.constructor = c
	c.superclass = p.prototype
}

function august_extend_proto ( o1, o2 ) {
	if (!o1)
		throw Error ("FATAL")
	let p = (o2 || o1).prototype.proto
	Object.assign (o1.prototype, p)
	if (isSet (p.__))
		Object.defineProperties (o1.prototype, p.__)
}

function august_http_params ( p ) {
	let r = []
	for (let n in p) {
		if (!p.hasOwnProperty (n)) {
		} else if (isArray (p [n])) {
			p [n].forEach (p => {
				if (isSet (p))
					r.push (`${n}[]=${encodeURIComponent (p)}`)
			})
		} else if (isSet (p [n]) && p [n] !== null) {
			r.push (`${n}=${encodeURIComponent (p [n])}`)
		}
	}
	return r.join ("&")
}

function august_http ( opt = 0, type ) {
	this.send = function ( url, cb, data, header ) {
		loader (1)
		http.onload = function () {
			loader (0)
			cb && cb (this.response, this.status)
		}
		http.onerror = http.onabort = function () {
			loader (0)
			cb && cb (false, 0)
		}
		http.open (data ? "POST" : "GET", url)
		let isForm = isType (data, FormData)
		if (data && !isForm)
			http.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded")
		if (isSet (header)) for (let n in header)
			http.setRequestHeader (n, header [n])
		if (isSet (type))
			http.responseType = type
		http.withCredentials = !(~opt & 1)
		http.send (!isObject (data) || isForm ? data : august_http_params (data))
		return this
	}
	this.http = function ( lo, cb ) {
		loader = lo || loader
		cb && cb (http)
		return this
	}

	let loader = v => void 0
	let http = new XMLHttpRequest
}

function august_tpl ( tpl, apl, lo, cb_err ) {
	let $tpl  = {}
	let $last = null
	let $load = August.loadTPL (apl, lo, cb_err)

	return {
		reset () {
			$tpl = {}
		},
		tpl () {
			return $tpl [apl.TPL]
		},
		get ( cb ) {
			if (this.tpl ()) {
				cb (this.tpl (), this.tpl ().$md5 == $tpl [$last].$md5)
				$last = apl.TPL
				return
			}
			$load (tpl, tpl => {
				let eq = true
				if (tpl === null) {
					tpl = $tpl [$last]
				} else {
					eq = $last && $tpl [$last] && (tpl.$md5 == $tpl [$last].$md5)
					if (eq) {
						tpl = $tpl [$last]
					} else for (let n in tpl) {
						if (tpl [n] && n != "$md5")
							tpl [n] = tpl [n].parse_tpl ()
					}
				}
				$tpl [apl.TPL] = tpl
				$last = apl.TPL
				cb (tpl, eq)
			}, null, $last && $tpl [$last] && $tpl [$last].$md5)
		}
	}
}

function august_sound ( p ) {
	let pl = new Audio
	let ok = 1
	let vol = 50
	let ext = pl.canPlayType && pl.canPlayType ("audio/ogg; codecs=\"vorbis\"") != "" ? "ogg" : "mp3"

	return {
		play ( id, v, l, cb ) {
			if (!pl)
				return
			v = Math.min (100, isSet (v) ? v : vol)
			pl.volume = v / 100
			fetch (`${p}/${id}.${ext}`).then (r => pl.src = r.url).then (_ => pl.play ())
			l && pl.on ("ended", function ( e ) {
				if (--l && !this.stop)
					return this.play ()
				this.stop = 0
				this.un ("ended", arguments.callee)
				cb && cb ()
			})
		},
		stop () {
			if (pl) {
				pl.pause ()
				pl.stop = 1
			}
		},
		volume ( v ) {
			if (!isSet (v))
				return vol
			vol = Math.min (100, v || 1)
			if (pl)
				pl.volume = vol / 100
		},
		delay ( t ) {
			if (ok) {
				ok = 0
				setTimeout (() => { ok = 1 }, t * 1000)
			} else if (!t) {
				ok = 1
			}
		},
		ready () {
			return ok && !!pl
		},
		done () {
			this.stop ()
			pl = null
			ok = 0
		}
	}
}

function august_touch ( view, handler ) {
	function hndlr ( hndlr, e, c ) {
		c.id = c.identifier
		let t = Touch [c.id]
		if (!t)
			return
		if (!t.delta && ~handler.opt & 2)
			t.delta = { x: t.x0 - c.pageX, y: t.y0 - c.pageY }
		if (~~handler.opt & 64) {
			let dx = c.pageX - t.x
			if (!isSet (t.dx))
				t.dx = dx
			else if (t.dx.sign () != dx.sign ())
				t.x = c.pageX - dx, t.dx = dx
		}
		c.dx1 = c.pageX - t.x
		c.dy1 = c.pageY - t.y
		t.x = c.pageX
		t.y = c.pageY
		if (hndlr) {
			let ee = event (e, c)
			ee.x = ee.pageX
			ee.y = ee.pageY
			if (t.delta) {
				ee.pageX += t.delta.x
				ee.pageY += t.delta.y
			}
			ee.dx = ee.pageX - t.x0
			ee.dy = ee.pageY - t.y0
			ee.dt = August.now () - t.tm
			hndlr.call (view, ee)
		}
	}
	function event ( e, t ) {
		for (let n in t) {
			if (!isFunction (t [n]))
				e [n] = t [n]
		}
		return e
	}
	function start ( e ) {
		let c = 0
		for (let t of e.targetTouches) {
			t.id = t.identifier
			if (Touch [t.id])
				continue
			t.x = t.pageX
			t.y = t.pageY
			if (!handler.start || handler.start.call (view, event (e, t)))
				Touch [t.id] = { x: t.x, y: t.y, x0: t.x, y0: t.y, dx: 0, dy: 0, tm: August.now () }
			if (++c == 1 && ~handler.opt & 1)
				break
		}
	}
	function move ( e ) {
		for (let c of e.changedTouches)
			hndlr (handler.move, e, c)
		if (~handler.opt & 4)
			e.stopPropagation ()
	}
	function end ( e ) {
		for (let c of e.changedTouches) {
			hndlr (handler.end, e, c)
			delete Touch [c.id]
		}
		if (~handler.opt & 8)
			e.stopPropagation ()
	}
	this.done = function () {
		if ("Touch" in window)
			view.un ("touchstart", start).un ("touchmove", move).un ("touchend touchcancel", end)
	}

	let Touch = {}
	if ("Touch" in window)
		view.on ("touchstart", start).on ("touchmove", move).on ("touchend touchcancel", end)
}

function august_slider ( Slider, callBack, opt = { active: 1 } ) {
	function move_to ( x, e = 0, s = 0 ) {
		let v = 100000 * x.clamp (0, Slider.offsetWidth) / Slider.offsetWidth + .5 | 0
		if (val != v || e || s) {
			v = ((val = v) / 100 | 0) / 10
			let r = opt.discrete ? (v * (opt.discrete - 1)) / 100 + .5 | 0 : v
			if (opt.discrete && e)
				v = r * 100 / (opt.discrete - 1)
			Slider.prop ("--value", v)
			Handle.s ({ left: v + "%" })
			callBack (r.extend ({
				end: { get () { return e } },
				set: { get () { return s } }
			}))
		}
	}
	function click ( e ) {
		if (e.$ != Handle)
			move_to (e.offsetX, 1)
	}
	function move ( e ) {
		move_to (e.pageX - ox)
	}
	function start ( e ) {
		Slider.setClass ("active", 1)
		ox = e.pageX - Handle.offsetLeft + Handle.getStyle ("marginLeft")
		if (e.type == "touchstart")
			return true
		doc.addEventListener ("mousemove", move)
		doc.addEventListener ("mouseup", end)
	}
	function end ( e ) {
		Slider.setClass ("active", 0)
		move_to (e.pageX - ox, 1)
		doc.removeEventListener ("mousemove", move)
		doc.removeEventListener ("mouseup", end)
	}
	function wheel ( e ) {
		Slider.setClass ("active", opt.active)
		move_to (Slider.offsetWidth * (val - e.delta () * 100000 / (opt.discrete ? opt.discrete - 1 : 100)) / 100000, 1)
		Slider.setClass ("active", 0)
		e.stop ()
	}

	let Handle = Slider.append ("sl-handle")
	let doc = Slider.ownerDocument
	let val = 0
	let ox = 0
	let to = new august_touch (Handle, { start, move, end })

	Handle.on ("mousedown", start)
	Slider.on ("mousedown", click).on ("wheel", wheel)

	return {
		get () {
			return opt.discrete ? (val * (opt.discrete - 1)) / 100000 + .5 | 0 : (val / 100 | 0) / 10
		},
		set ( v ) {
			move_to (Slider.offsetWidth * v / (opt.discrete ? opt.discrete - 1 : 100), 0, 1)
			return this
		},
		done () {
			to.done ()
			Handle.un ("mousedown", start)
			Slider.un ("mousedown", click).un ("wheel", wheel).remove (Handle)
			return this
		}
	}
}

function august_buffer ( size ) {
	let Buffer = new Array (size)
	let Ptr = 0
	let Cur = 0
	let Cnt = 0

	return {
		put ( data ) {
			Buffer [Ptr] = data
			if (++Ptr == Buffer.length)
				Ptr = 0
			Cur = Ptr
			Cnt++
		},
		each ( cb ) {
			for (let c = Buffer.length, i = Ptr; c; c--) {
				if (Buffer [i])
					cb (Buffer [i], i)
				if (++i == Buffer.length)
					i = 0
			}
		},
		next () {
			if (this.isLast ())
				return null
			if (++Cur == Buffer.length)
				Cur = 0
			Cnt++
			return Buffer [Cur]
		},
		prev ( data ) {
			let p = (Cur || Buffer.length) - 1
			if (isSet (data) && this.isLast ())
				Buffer [Ptr] = data
			if (Ptr != p && Buffer [p])
				return Cnt--, Buffer [Cur = p]
			return null
		},
		last () {
			Cur = Ptr
			return Buffer [(Ptr || Buffer.length) - 1] || false
		},
		at ( i ) {
			return Buffer [i]
		},
		clear () {
			let s = Buffer.length
			Buffer.clear ()
			Buffer.length = s
			Ptr = 0
			Cur = 0
			Cnt = 0
		},
		setLast () {
			Ptr = Cur
		},
		isFirst () {
			return !Cnt
		},
		isLast () {
			return Cur == Ptr
		},
		isEmpty () {
			return Cur == Ptr && !Cnt
		}
	}
}

function august_rect ( x1, y1, x2, y2 ) {
	return {
		x1, y1, x2, y2,

		contains ( x, y ) {
			return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2
		},
		cross ( r ) {
			return this.contains (r.x1, r.y1) || this.contains (r.x1, r.y2) || this.contains (r.x2, r.y1) || this.contains (r.x2, r.y2)
		},
		intersect ( r ) {
			return new august_rect (Math.max (this.x1, r.x1), Math.max (this.y1, r.y1), Math.min (this.x2, r.x2), Math.min (this.y2, r.y2))
		},
		square () {
			return (this.x2 - this.x1) * (this.y2 - this.y1)
		},
		move ( x, y ) {
			this.x1 += x
			this.y1 += y
			this.x2 += x
			this.y2 += y
		}
	}
}

function august_bitset ( a ) {
	let bs = BigInt (a || 0)

	return {
		init ( a ) {
			bs = BigInt (a || 0)
			return this
		},
		set ( b ) {
			bs |= 1n << BigInt (b)
			return this
		},
		reset ( b ) {
			bs &= ~(1n << BigInt (b))
			return this
		},
		test ( b ) {
			return !!(bs & (1n << BigInt (b)))
		},
		eq ( b ) {
			return bs == b.val ()
		},
		val () {
			return bs
		}
	}
}

function august_event () {
	let Handlers = null

	return {
		on ( ev, fn ) {
			if (!Handlers)
				Handlers = new Map
			if (!Handlers.has (ev))
				Handlers.set (ev, [])
			Handlers.get (ev).push (fn)
			return this
		},
		un ( ev, fn ) {
			if (!Handlers)
				return this
			let hs = Handlers.get (ev)
			if (hs && fn) {
				for (let i = hs.length - 1; i >= 0; i--) {
					if (hs [i] == fn)
						hs.delete (i)
				}
			} else if (hs) {
				hs.length = 0
			}
			return this
		},
		unAll () {
			Handlers = null
			return this
		},
		once ( ev, fn ) {
			let once = ( ... a ) => {
				this.un (ev, once)
				fn (... a)
			}
			this.on (ev, once)
			return this
		},
		fire ( ev, ... a ) {
			if (!Handlers)
				return this
			let hs = Handlers.get (ev)
			if (hs) {
				for (let i = hs.length - 1; i >= 0; i--)
					hs [i](... a)
			}
			return this
		}
	}
}

August = (() => {
	let load_css = ( win, css, des, onLoad, onError ) => {
		if (!$win [win.name])
			$win [win.name] = {}
		let link_old = $win [win.name][css.__css || css]
		if (des === null) {
			if (link_old)
				link_old.disabled = true
			return
		}
		let id = `css_${`${win.document.baseURI}-${des}-${css}`.md5 ()}`
		let link_new = $(id, win)
		if (link_new) {
			link_new.disabled = false
			$SYNC (win, _ => {
				if (link_old && link_new != link_old)
					link_old.disabled = true
				$win [win.name][css.__css || css] = link_new
				onLoad ()
			})
			return
		}
		loader (1)
		let link = win.document.head.append ("link", {
			id:	id,
			rel:	`stylesheet`,
			type:	`text/css`,
			href:	`${des ? `css/${des}/` : css.startsWith ("../") ? "" : "css/"}${css}.css?${$CFG.Version}`
		})
		link.onload = function () {
			loader (0)
			if (link_old)
				link_old.disabled = true
			$win [win.name][css.__css || css] = this
			$SYNC (win, onLoad)
		}
		link.onerror = function ( e ) {
			loader (0)
			win.document.head.remove (this)
			onError && onError (css)
			onLoad (1)
		}
	}
	let attr = ( a, ex ) => {
		let p = [""]
		for (let n in a) {
			if (a [n] === "")
				p.push (n)
			else if (isSet (a [n]) && a [n] !== null)
				p.push (`${n}='${a [n]}'`)
		}
		if (ex)
			p.push (ex)
		return p.join (" ")
	}
	let img = ( url, w, h, b, va, hs, vs, t, cl, st, n, ex ) => {
		let a = attr ({
			src:	url.replace (/^@/, `//${$CFG.Host}`),
			width:	w,
			height:	h,
			border:	b,
			class:	cl,
			style:	((va ? `vertical-align: ${va == "absmiddle" ? "middle" : va};` : ``) + ((hs | vs) ? `margin: ${vs || 0}px ${hs || 0}px;` : ``) + (st || "")) || null,
			title:	t && t.htmlEntities () || null,
			name:	n
		}, ex)
		return `<img${a} referrerpolicy=no-referrer>`
	}
	let handler = ( n, h ) => {
		let o = $HTML [n]
		if (!h)
			return o
		$MESS_HTML.forEach (( f, i ) => {
			if (f == o)
				$MESS_HTML [i] = h
		})
		$HTML [n] = h
		return $HTML
	}

	let imgHover = $ => false
	let smHover = $ => false
	let loader = $ => void 0
	let flag = $ => ""
	let opt = $ => $Opt
	let now = $ => ~~performance.now ()

	let $win = {}
	let $lbl = 0
	let $Opt = 0
	let $From = 0
	let $System = 0
	let $Profile = 0

	let $CFG = {
		Version:	0,
		Host:		"",
		Base:		""
	}

	const $BOT = {
		i: $ => ($[0] = $[5].split (";"), img (decodeURIComponent ($[0][0]), $[0][1], $[0][2], 0, "", "", "", "", "bot-image", "", "img-view", ` data-src='${$[2]}' data-width='${$[3]}' data-height='${$[4]}' onMouseOver='root.August.html.imgHover (this)'`)),
		m: $ => `<audio class=bot-audio controls src='${$[4]}'></audio>`,
		y: $ => `<iframe class=bot-video width=560 height=315 src='https://www.youtube.com/embed/${$[2]}' frameborder=0 allowfullscreen></iframe>`
	}

	const $LAT1 = "abcdefghijklmnoprstuvwyz'`ABCDEFGHIJKLMNOPRSTUVWYZ"
	const $RUS1 = "абцдефгхийклмнопрстуввызьъАБЦДЕФГХИЙКЛМНОПРСТУВВЫЗ"
	const $LAT2 = "ыaыuыoцhсhзhЫAЫUЫOЦHСHЗHЫaЫuЫoЦhСhЗhйaйuйoЙAЙUЙOЙaЙuЙoе'Е'ь'ъ`"
	const $RUS2 = "яюёчшжЯЮЁЧШЖЯЮЁЧШЖяюёЯЮЁЯЮЁэЭЬЪ"

	const $INIT = cfg => {
		return Object.assign ($CFG, cfg)
	} 

	const $SYNC = ( win = window, $ ) => {
		return new Promise (resolve =>
			win.requestAnimationFrame (_ => win.requestAnimationFrame (_ => resolve ($ ? $() : void 0)))
		)
	}

	const $SET_LOADER = lo => {
		loader = lo
	}

	const $TRANS = ( e, inp ) => {
		if ((e.ctrlKey || e.altKey) && e.which)
			return true
		let ch = String.fromCharCode (e.which)
		let p = $LAT1.indexOf (ch)
		if (p < 0)
			return true
		let s1 = inp.value.substr (0, inp.selectionStart)
		let s2 = inp.value.substr (inp.selectionEnd)
		let p2 = $LAT2.indexOf (s1.substr (-1) + ch)
		ch = p2 & 1 ? $RUS1 [p] : $RUS2 [p2 / 2]
		if (ch == 'ш' || ch == 'Ш') {
			let t = s1 [inp.selectionStart - 2]
			if (t == 'т' || t == 'Т') {
				ch = t == 'т' ? 'щ' : 'Щ'
				s1 = s1.substr (0, s1.length - 1)
			}
		}
		let v = (p2 & 1 ? s1 : s1.substr (0, s1.length - 1)) + ch + s2
		let r = s1.length + (p2 & 1)
		if (inp.is ("TEXTAREA")) {
			let left = inp.scrollLeft
			let top = inp.scrollTop
			let w2 = inp.clientWidth >> 1
			inp.value = v
			inp.setSelectionRange (r, r)
			let l = (s1.length - s1.search (/\s[^\s]*$/) - 1) * 10 - left - w2
			let d = Math.abs (l) < w2 ? 0 : l < 0 ? w2 + l : l - w2
			inp.scrollLeft = left + (d ? d > 0 ? d + 2 : d - 10 : 0)
			inp.scrollTop = top
		} else {
			inp.value = v
			inp.setSelectionRange (r, r)
		}
		return false
	}

	const $XHR = ( lo, cb_http, cb_err ) => {
		return ( func, cb, data, get ) => {
			if (!get) {
				var g_param = ""
				var p_param = data
			} else if (isString (data)) {
				var g_param = data
				var p_param = null
			} else if (isObject (get)) {
				var g_param = "?" + august_http_params (get)
				var p_param = data
			} else {
				var g_param = "?" + august_http_params (data)
				var p_param = null
			}
			return new august_http (1, "json").http (lo, cb_http).send (`//${$CFG.Host}/xhr/${func}.august${g_param}`, ( r, s ) => {
				if (s && s < 400)
					cb (r, s)
				else if (cb_err)
					cb_err (s)
			}, p_param, { "X-Requested-With": "XMLHttpRequest" })
		}
	}

	const $LOAD_JS = ( file, win, v = $CFG.Version ) => {
		return new Promise (function ( onLoad, onError ) {
			let head = (win || this).document.head
			let abs = /^\/|https?:\/\//.test (file)
			let src = abs ? file [0] == "/" ? `${file}?${v}` : file : `js/${file}?${v}`
			for (let js of head.all ("script")) {
				if (js.getAttribute ("src") == src && (abs || js.base == head.baseURI))
					return (js.ready = 1, onLoad (js))
			}
			let js = head.append ("script")
			js.src = src
			js.base = js.baseURI
			js.onload = () => onLoad (js)
			js.onerror = () => (head.remove (js), onError ())
		})
	}

	const $LOAD_TPL = ( apl, lo, cb_err ) => {
		return ( tpl, cb, md5 ) => {
			new august_http (0, "json").http (lo).send ($CFG.Base + "./php/tpl.php?" + august_http_params ({ tpl: isArray (tpl) ? tpl.join ("!") : tpl, apl: apl.APL, use: apl.TPL, top: apl.TOP }), ( r, s ) => {
				if (s && s < 400)
					cb (r)
				else if (cb_err)
					cb_err ()
			}, null, { "X-MD5": md5 || null })
		}
	}

	const $LOAD_CSS = ( win, css, des, onLoad, onError ) => {
		if (!isArray (css))
			css = [css]
		onLoad = August.defer (css.length, onLoad)
		css.forEach (css => load_css (win, css, des, onLoad, onError))
	}

	const $STORAGE = ( mod, def = "" ) => {
		return ( name, val ) => {
			try {
				let n = `${mod}.${name}`
				if (!isSet (val))
					return localStorage [n] || def
				localStorage [n] = val
			} catch ( e ) {
				return def
			}
		}
	}

	const $CALENDAR = ( y, m ) => {
		let dw = (new Date (y, m, 1).getDay () + 6) % 7
		let dm = new Date (y, m + 1, 0).getDate ()
		let c = [[], [], [], [], [], [], []]
		for (let i = 0, d = 0; i < 42; i++)
			c [i % 7].push (i == dw || (d && d < dm) ? ++d : 0)
		return c
	}

	const $DEFER = ( c, cb ) => {
		return ( ... a ) => {
			if (!--c)
				cb && cb (... a)
		}
	}

	const $COPY = ( el, handler, to ) => {
		let d = el.ownerDocument
		let r = d.createRange ()
		let s = d.defaultView.getSelection ()
		el.noselect ("auto")
		r.selectNodeContents (el)
		s.removeAllRanges ()
		s.addRange (r)
		if (handler)
			handler (s)
		else
			d.execCommand ("Copy")
		if (to)
			setTimeout (_ => s.removeAllRanges (), to)
	}

	const $CLICK = ( win, handler ) => {
		win.document.documentElement.on ("click", e => {
			if (e.which == 1 && (e.$.type == "button" || e.$.is ("IMG") || e.$.is ("A")))
				e.$.name && !handler (e.$) && e.stop ()
		})
	}

	const $WO = ( url, name, win = {} ) => {
		let p = (() => {
			let w = Math.min (win.w || root.document.documentElement.clientWidth, screen.width - 20)
			let h = Math.min (win.h || root.document.documentElement.clientHeight, screen.height - 80)
			let f = win.f || 0
			let p = [
				`scrollbars=${f & 1}`,
				`resizable=${+!!(f & 2)}`,
				`menubar=${+!!(f & 4)}`,
				`toolbar=${+!!(f & 8)}`,
				`location=${+!!(f & 16)}`,
				`status=${+!!(f & 32)}`,
				`width=${w}`,
				`height=${h}`
			]
			if (f & 64)
				p.push (`left=${screen.width - w - 10 >> 1},top=${screen.height - h - 80 >> 1}`)
			else if (win.x && win.y)
				p.push (`left=${win.x},top=${win.y}`)
			return p.join (",")
		})()
		let o = open
		let w = /^(?:https?:)?\/\//i.test (url) ? o (url, "_blank", p) : o (url || "", name, p)
		if (w) w.html = function ( html ) {
			this.document.open ()
			this.document.charset = "utf-8"
			this.document.write (html)
			this.document.close ()
			this.html = arguments.callee
			this.pos = function () {
				return {
					x: this.screenX || this.screenLeft,
					y: this.screenY || this.screenTop,
					w: this.innerWidth,
					h: this.innerHeight,
					f: 2
				}
			}
			august_extend_proto (this.File, File)
			august_extend_proto (this.Event, Event)
			august_extend_proto (this.Element, Element)
			august_extend_proto (this.DocumentFragment, Element)
			return this
		}
		return w
	}

	const $GETID = ( data = {} ) => {
		let cid = () => { try { return localStorage.CID || "" } catch ( e ) { return "" } }
		let ci = []
		for (let p of navigator.plugins) {
			let x = [`${p.name}:${p.description || "*"}:${p.filename || "*"}`]
			for (let i of p)
				x.push (`${i.type}:${i.description || "*"}:${i.suffixes || "*"}:${(i.enabledPlugin && i.enabledPlugin.name == p.name) | 0}`)
			ci.push (x.join ("::"))
		}
		let ci2 = [
			navigator.cpuClass || navigator.oscpu || "", navigator.platform, navigator.systemLanguage || "", navigator.language || "", navigator.hardwareConcurrency || 0,
			navigator.maxTouchPoints || 0, navigator.cookieEnabled, screen.width, screen.height, screen.availWidth,
			screen.availHeight, screen.colorDepth, (new Date ()).getTimezoneOffset (), window.devicePixelRatio || 0, +("Touch" in window && "orientation" in window)
		]
		let gl = document.createElement ("canvas").getContext ("webgl")
		let ci3 = gl && gl.getSupportedExtensions () || []
		let ei = gl && gl.getExtension ("WEBGL_debug_renderer_info")
		ci3.push (ei ? gl.getParameter (ei.UNMASKED_RENDERER_WEBGL) + "@" + gl.getParameter (ei.UNMASKED_VENDOR_WEBGL) : "")
		return Object.assign (data, { cid: cid (), ci: ci.join ("|"), ci2: ci2.join ("|"), ci3: ci3.join ("|"), ua: navigator.userAgent })
	}

	const $FP = () => {
		let fp1 = () => {
			let t = ( c, f, x, y ) => {
				ctx.fillStyle = c
				ctx.font = f
				ctx.fillText ("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", x, y)
			}
			let c = ( c, x, y, r ) => {
				ctx.fillStyle = c
				ctx.beginPath ()
				ctx.arc (x, y, r, 0, Math.PI * 2, true)
				ctx.closePath ()
				ctx.fill ()
			}
			let canvas = document.createElement ("canvas")
			canvas.width = 2000
			canvas.height = 200
			let ctx = canvas.getContext ("2d")
			ctx.textBaseline = "alphabetic"
			ctx.fillStyle = "#f60"
			ctx.fillRect (125, 1, 62, 20)
			t ("#069", "11pt no-real-font-123", 2, 15)
			t ("#6c03", "18pt Arial", 4, 45)
			ctx.globalCompositeOperation = "multiply"
			c ("#f0f", 50, 50, 50)
			c ("#0ff", 100, 50, 50)
			c ("#ff0", 75, 100, 50)
			ctx.fillStyle = "#f0f"
			ctx.arc (75, 75, 75, 0, Math.PI * 2, true)
			ctx.arc (75, 75, 25, 0, Math.PI * 2, true)
			ctx.fill ("evenodd")
			return canvas.toDataURL ().substr (22).md5 ()
		}
		let fp2 = () => {
			let gl = document.createElement ("canvas").getContext ("webgl")
			if (!gl)
				return "".md5 ()
			let b = gl.createBuffer ()
			gl.bindBuffer (gl.ARRAY_BUFFER, b)
			gl.bufferData (gl.ARRAY_BUFFER, new Float32Array ([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]), gl.STATIC_DRAW)
			let p = gl.createProgram ()
			let v = gl.createShader (gl.VERTEX_SHADER)
			gl.shaderSource (v, "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}")
			gl.compileShader (v)
			let f = gl.createShader (gl.FRAGMENT_SHADER)
			gl.shaderSource (f, "precision mediump float;varying vec2 varyinTexCoordinate;void main(){gl_FragColor=vec4(varyinTexCoordinate,0,1);}")
			gl.compileShader (f)
			gl.attachShader (p, v)
			gl.attachShader (p, f)
			gl.linkProgram (p)
			gl.useProgram (p)
			p.vertexPosAttrib = gl.getAttribLocation (p, "attrVertex")
			p.offsetUniform = gl.getUniformLocation (p, "uniformOffset")
			gl.enableVertexAttribArray (p.vertexPosArray)
			gl.vertexAttribPointer (p.vertexPosAttrib, 3, gl.FLOAT, !1, 0, 0)
			gl.uniform2f (p.offsetUniform, 1, 1)
			gl.drawArrays (gl.TRIANGLE_STRIP, 0, 3)
			return gl.canvas.toDataURL ().substr (22).md5 ()
		}
		return [fp1 (), fp2 ()]
	}

	const $IMG2WEBP = ( f, fn, cb, busy = _ => void 0 ) => {
		if (!f)
			return
		busy (1)
		let fr = new FileReader
		fr.onload = function ( e ) {
			let img = new Image
			img.onload = function ( e ) {
				let c = this.create ("canvas")
				c.width = this.width
				c.height = this.height
				c.getContext ("2d").drawImage (this, 0, 0)
				c.toBlob (b => (busy (0), cb (new File ([b], fn, { type: b.type, lastModified: Date.now () }))), "image/webp", 1.)
			}
			img.src = this.result
		}
		fr.readAsDataURL (f)
	}

	const $TIMER = (() => {
		function tic () {
			for (let [id, it] of $List) {
				if (it.del) {
					del (id)
					continue
				}
				let t = now () - it.check
				if (t > 0) {
					it.callBack (id, now () - it.start, ++it.c, it.data)
					if (it.once)
						del (id)
					else
						it.check += it.timeout
				} else if (it.tic) {
					it.tic (id, -t, it.data)
				}
			}
		}
		function del ( id ) {
			$List.delete (id)
			if (!$List.size)
				clearInterval ($i)
		}
		function start ( args ) {
			if (!args.timeout)
				return -1
			$List.set (++$ID, { ... args, ... {
				start:	now (),
				check:	now () + (args.delay || args.timeout),
				c:	0
			}})
			if ($List.size == 1)
				$i = setInterval (tic, 10)
			return $ID
		}
		function stop ( id ) {
			let it = $List.get (id)
			if (it)
				it.del = 1
		}

		let $List = new Map
		let $ID = 0
		let $i = 0

		return { start, stop }
	})()

	const $FORM = {
		input: ( n, v, s, ml, ex ) => {
			return "<input?>".format (attr ({
				name:		n,
				value:		isSet (v) ? v.toString ().htmlEntities () : null,
				size:		s || null,
				maxlength:	ml || null,
				autocomplete:	"off"
			}, ex))
		},
		text: ( n, v, c, r, w, ex ) => {
			return "<textarea?>?</textarea>".format (attr ({
				name: n,
				cols: c || null,
				rows: r || null,
				wrap: w ? "off" : null 
			}, ex), v ? v.toString ().htmlEntities () : "")
		},
		checkbox: ( n, ch, v, l, s, ex ) => {
			if (isArray (l)) {
				if (s && l.length != s)
					return ""
				let cb = ""
				l.forEach (( l, i ) => {
					cb += "<input?><label for=?_?> ?</label>".format (attr ({
						name:	n,
						type:	"checkbox",
						value:	v === null ? v : v [i],
						checked:ch ? "" : null,
						id:	"?_?".format (n, i)
					}, ex), n, i, l)
				})
				return cb
			}
			let inp = "<input?>".format (attr ({
				type:	"checkbox",
				name:	n,
				value:	v,
				checked:ch ? "checked" : null,
				id:	isSet (l) ? "__l" + ++$lbl : null
			}, ex))
			return isSet (l)
				? "?<label?>?</label>".format (inp, attr ({
					for:	"__l" + $lbl,
					title:	isString (s) ? s : null
				}), l)
				: inp
		},
		radio: ( n, v, p, d, s ) => {
			let r = []
			if (isArray (p)) {
				if (s && p.length != s)
					return ""
				for (let p1 of p) {
					let v1 = isArray (p1) ? p1 [0] : r.length
					let t = isArray (p1) ? p1 [1] : p1
					r.push ("<input?><label for=__l?>?</label>".format (attr ({
						type:	"radio",
						checked:(v === null && !r.length) || v1 == v ? "" : null,
						name:	n,
						value:	v1.toString (),
						id:	"__l" + ++$lbl
					}), $lbl, t))
				}
			} else if (isObject (p)) {
				for (let v1 in p) {
					r.push ("<input?><label for=__l?>?</label>".format (attr ({
						type:	"radio",
						checked:(v === null && !r.length) || v1 == v ? "" : null,
						name:	n,
						value:	v1,
						id:	"__l" + ++$lbl
					}), $lbl, p [v1]))
				}
			} else if (isString (p)) {
				return "<input?><label for=__l?>?</label>".format (attr ({
					type:	"radio",
					name:	n,
					value:	v,
					id:	"__l" + ++$lbl
				}), $lbl, p)
			}
			return r.join (d || "")
		},
		select: ( n, v, p, ex, s ) => {
			let o = ( i, t ) => "<option value='?'?>?".format (i, i == v ? " selected" : "", t)
			let r = ""
			if (isArray (p)) {
				if (s && p.length != s)
					return ""
				for (let i = 0; i < p.length; i++)
					r += o (i, p [i])
			} else if (isType (p, Set)) {
				for (let v of p)
					r += o (v, v)
			} else if (isType (p, Map)) {
				for (let [v, t] of p)
					r += o (v, t)
			} else if (p) {
				if (p.length == 1)
					p = p [0]
				for (let i in p) {
					if (!isObject (p [i])) {
						r += o (i, p [i])
						continue
					}
					let os = ""
					for (let gi in p [i])
						os += o (gi, p [i][gi])
					r += i
						? "<optgroup label='?'>?</optgroup>".format (i.htmlEntities ("'"), os)
						: os
				}
			}
			return "<select?>?</select>".format (attr ({ name: n }, ex), r)
		},
		button: ( n, v, t, ex ) => {
			return "<input?>".format (attr ({
				type:	"button",
				name:	n,
				value:	v.toString ().htmlEntities ("'"),
				title:	t || null
			}, ex))
		},
		button2: ( n, v, t, ex ) => {
			return "<button?>?</button>".format (attr ({
				type:	"button",
				name:	n,
				title:	t || null
			}, ex), v)
		},
		submit: ( n, v, t, ex ) => {
			return "<input?>".format (attr ({
				type:	"submit",
				name:	n,
				value:	v.toString ().htmlEntities ("'"),
				title:	t || null
			}, ex))
		},
		submit2: ( n, v, t, ex ) => {
			return "<button?>?</button>".format (attr ({
				name:	n,
				title:	t || null
			}, ex), v)
		},
		hidden: ( n, v ) => {
			return "<input?>".format (attr ({
				type:	"hidden",
				name:	n,
				value:	v.toString ().htmlEntities ()
			}))
		},
		$val: ( el, v ) => {
			if (isSet (v)) {
				if (el) {
					if (el.type == "select-one" || !el.length)
						el.value = v
					else for (let i of el)
						i.checked = i.value == v
				}
				return $FORM
			}
			if (!el)
				return null
			if (!el.length) {
				if (el.type == "checkbox" || el.type == "radio")
					return el.checked ? el.value : null
				return el.value
			}
			if (el [0].type == "checkbox") {
				let v = []
				for (let el1 of el) {
					if (el1.checked)
						v.push (el1.value)
				}
				return v
			}
			return el.value
		},
		$option: ( s, t, v ) => {
			return s.append (new Option (t, v))
		},
		$hidden: ( f, h ) => {
			for (let n in h) {
				f.append ("input", {
					type:	"hidden",
					name:	n,
					value:	h [n] || ""
				})
			}
			return $FORM
		}
	}

	const $UPLOAD = {
		upload ( file, cb, param, action, upload_name, progress ) {
			let Form = new FormData
			if (file.files.length == 1)
				Form.append (upload_name || "upload", file.files [0])
			else for (let f of file.files)
				Form.append (upload_name || "upload[]", f)
			Form.append ("fn", +new Date)
			for (let n in param)
				Form.append (n, param [n])
			new august_http (1, "json").http (v => {
				this.$busy = v
				!v && this.done ()
			}, !progress ? null : http => {
				http.upload.onprogress = e => {
					progress (e.loaded, e.total)
				}
			}).send (`//${$CFG.Host}/${action}`, cb, Form, { "X-Requested-With": "XMLHttpRequest" })
			return this
		},
		preloader () {
			this.$pre = document.body.append ("div").css ("position: fixed; z-index: 9999; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,.6) url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 128 128'><g fill='%23fff'><path stroke='%23000' stroke-width='1' id='a' d='M61.58 90.1c-13.95 1.35-28.35-3.7-38.48-14.93C13.23 63.75 9.7 48.9 12.5 35.18c-15.13 13.6-16.35 36.9-2.73 52.03 13.38 15.29 36.68 16.52 51.81 2.89z'/><use xlink:href='%23a' transform='rotate(72 64 64)'/><use xlink:href='%23a' transform='rotate(144 64 64)'/><use xlink:href='%23a' transform='rotate(216 64 64)'/><use xlink:href='%23a' transform='rotate(288 64 64)'/><animateTransform attributeName='transform' type='rotate' from='72 64 64' to='0 64 64' dur='360ms' repeatCount='indefinite'/></g></svg>\") no-repeat center/100px 100px;")
			return this
		},
		click ( func, file, accept ) {
			if (file) {
				func.call (file)
				return this
			}
			let f = this.$file || (this.$file = document.body.append ("input", {
				type:		"file",
				accept:		accept || "image/*",
				multiple:	this.$MULTIPLE
			}).css ("position: absolute; top: -100%; height: 0; visibility: hidden"))
			f.onchange = func
			f.click ()
			return this
		},
		multiple ( m ) {
			this.$MULTIPLE = !!m
			return this
		},
		busy () {
			return this.$busy
		},
		done () {
			if (this.$pre)
				document.body.remove (this.$pre)
			if (this.$file)
				document.body.remove (this.$file)
			this.$pre = this.$file = null
		},
		$MULTIPLE: false
	}

	const $HTML = {
		color		( ... $ ) { let s = $[1] ? $[4].color ($[1]) : $[4]; let n = $[3].hex () & 8; let st = $[3].hex () & 7; let a = attr ({ style: $[2] ? `font-family: ${$[2]}` : null, class: st ? n ? `nick st${st}` : `st${st}` : n ? "nick" : null }); return a ? `<span${a} \x01>${s}</span \x03>` : s },
		graph		( ... $ ) { return $Opt & 0x20 ? $[6] : img (`@/people/nick/${$[1]}.${$[2]}`, $[3], $[4], 0, "", "", "", $[6], "nick", $[5] != 0 ? `vertical-align: ${-$[5]}px` : "", `\x01>${$[6]}<\x03`) + "<!---->" },
		smile		( ... $ ) { return $Opt & 0x10 ? $[6] : img (`@/smiles/${$[1]}.${$[2]}`, $[3], $[5], 0, "", "", "", $[6], "smile", "", "smile-click", $[4] == "o" || $[4] == "O" ? ` data-x=o onMouseOver='root.August.html.smHover (this)' strip='\x01>${$[6]}<\x03'` : ``) },
		user_smile	( ... $ ) { return $Opt & 0x10 ? $[6] : img (`@/smiles/${$[1].z (8)}${$[2].z (6)}.${$[3]}`, $[4], $[5], 0, 0, 0, 0, $[6], "smile", "", "", `strip='\x01>${$[6]}<\x03'`) },
		bot		( ... $ ) { return $BOT [$[1]] && $BOT [$[1]]($) || "" },
		hidden_code	( ... $ ) { return `<div class=hidden>${$[3]}</div>` },
		topic_code	( ... $ ) { return `<div class=topic>${$[1].trim ().replace (/\r/g, "").replace (/\n+/g, $ => $.substr (1)).nl2br ()}</div>` },
		image_attach	( ... $ ) { return img (`@/attach/${$[1]}`, $[2], $[3], 0, 0, 0, 0, "", "attach", "", "img-view", `crossorigin=anonymous data-src=//${$CFG.Host}/attach/${$[1].insert ($[4] | $[5] ? "orig-" : "", $[1].indexOf ('/') + 1)} data-width=${$[4]} data-height=${$[5]} data-save=${$[1]} onMouseOver='root.August.html.imgHover (this)'`) },
		audio_attach	( ... $ ) { return `<audio class=attach controls controlslist=nodownload src=//${$CFG.Host}/attach/${$[1]} oncanplay='this.volume=.5'></audio>` },
		video_attach	( ... $ ) { return `<video class=attach controls preload=metadata src=//${$CFG.Host}/attach/${$[1]} oncanplay='this.volume=.5'></video>` },
		span		( ... $ ) { return `<span class='${$[1]}'>${$[2]}</span>` },
		time		( ... $ ) { return `<span class=time>${(+$[1]).clock (-8)}</span>` },
		url		( ... $ ) { return `<a class=link href='r.php?${$[1]}' target=_blank>${$[1]}</a>` },
		email		( ... $ ) { return `<a class=link href='mailto:${$[1]}'>${$[1]}</a>` },
		system		( ... $ ) { return $System = +$[1], $Profile = +$[3], $[2] },
		system2		( ... $ ) { return `<span class=s${$[1]}>${$[2]}</span>` },
		nick_code_int	( ... $ ) { return `<a class='nick${$[1] == 3 ? " del" : ""}' data-nickid='${$[1] == 1 ? (+$[2]).hex (4) : ""}' data-p='${$[2].empty ($[1] == 1)}'>${$[3]}</a>` },
		mess_code_int	( ... $ ) { return `<span class=mess>&#8203;${$[1]}</span>` },
		ifr_code_int	( ... $ ) { return `<iframe${attr ({ src: $[1], width: $[2], height: $[3], hspace: $[4] || null, vspace: $[5] || null, frameborder: $[6] || null, scrolling: $[7] || null, allow: $[8] || null, allowfullscreen: $[9] ? "" : null, loading: "lazy", sandbox: "allow-forms allow-scripts allow-same-origin allow-presentation" })}></iframe>` },
		flag_code_int	( ... $ ) { return $HTML.flag ($[1], $[2] == ";") },
		img_code_int	( ... $ ) { return $[4] === "" ? img ($[1], $[2], $[3], 0, "", "", "", "", "chat-image", $[10], "img-view", ` data-src='${$[1]}' data-width='${$[2]}' data-height='${$[3]}' onMouseOver='root.August.html.imgHover (this)'`) : ($.shift (), $[10] = $[11] = "", img (... $)) },
		object_code_int	( ... $ ) { return "" },
		mess		( m, opt ) { $Opt = opt; $From = 0; $System = 0; $Profile = 0; return m.replaceAll ($MESS_RE, $MESS_HTML).set ("from", $From).set ("system", $System).set ("profile", $Profile) },
		nick		( n, t ) { if (t !== null) $Opt = 0; return n.replaceAll ([this.SMILE_RE, this.GRAPH_NICK_RE, this.GRADIENT_RE, this.COLOR_RE], [root.User.set (36) || t ? "$6" : this.smile, root.User.set (37) || t ? "$6" : this.graph, t ? "$4" : this.color, t ? "$4" : this.color]) },
		nick_code	( n, uid, a ) { $From = +uid; return a && $From ? `<a class=nick data-uid=${uid}>${$HTML.nick (n, null)}</a n><!---->` : $HTML.nick (n, null) },

		handler,
		imgHover,
		smHover,
		flag,
		img,
		opt,
		attr,

		EMAIL_RE:	/\b(?!<[^>]*)([-.\w]+@([-\w]+\.)+[a-z]{2,})(?![^<]*>)(?!.*<!---->)\b/gi,
		URL_RE:		/(\b(?!<[^>]*)(?:https?|ftp):(?:\/\/|\\\\)(?:(?:[-\w]+\.)+[a-z]{2,}\.?|\d+\.\d+\.\d+\.\d+)(?::\d+)?[^<>'"`\x00-\x21]*(?![^<]*>)\b\/?)/gi,
		COLOR_RE:	/\x11([^\x11:-]*):([^\x11:]*):([\da-f]?)\x13([^\x11\x10]*)\x10/g,
		GRADIENT_RE:	/\x11((?:(?:#[\da-fA-F]{6}|)-)+#[\da-fA-F]{6}):([^:]*):([\da-f]?)\x13([^\x11\x10]*)\x10/g,
		GRAPH_NICK_RE:	/\x11([\da-f]{8})([a-z]{3,4})(\d+)x(\d+)%(-?\d*)\x13([^\x11\x10]+)\x10/g,
		SMILE_RE:	/\x11(\d{7})(...)(\d+)([xoXO])(\d+)\x13([^\x11\x10]+)\x10/g,
		USER_SMILE_RE:	/\x11(\d+):(\d+)(...)(\d+)x(\d+)\x13([^\x11\x10]+)\x10/g,
		IMAGEATTACH_RE:	/\x11((?:[a-z]+\/)?[\da-f]{24}\.\w{3,4})\x13(\d+)x(\d+):(\d+)x(\d+)\x13(\d+)\x10/g,
		AUDIOATTACH_RE:	/\x11audio-((?:[a-z]+\/)?[\da-f]{24}\.\w{3,4})(?:\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*))?\x13(\d+)\x13(\d+)\x10/g,
		VIDEOATTACH_RE:	/\x11video-((?:[a-z]+\/)?[\da-f]{24}\.\w{3,4})\x13(\d+)\x13(\d+)\x10/g,
		IMG_RE:		/\x11([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x10/g,
		IFRAME_RE:	/\x11([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x10/g,
		OBJECT_RE:	/\x11(.)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)(?:\x13([^\x11\x13\x10]*))?\x10/g,
		BOT_RE:		/\x11bot(.)\x13([^\x11\x13\x10]+)(?:\x13([^\x11\x13\x10]+)\x13([^\x11\x13\x10]+)\x13([^\x11\x13\x10]+))?\x10/g,
		HIDDEN_RE:	/\x11hidden\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]*)\x13([^\x11\x13\x10]+)\x10/g,
		TOPIC_RE:	/\x11topic\x13([^\x11\x13\x10]+)\x10/g,
		FLAG_RE:	/\x11([a-z]{2})([:;])([^\x11\x10]*)\x10/g,
		SPAN_RE:	/\x11(\w+)\x13([^\x11\x13\x10]+)\x10/g,
		SYSTEM_RE:	/^\x11(\d)([^\x11\x10]*?)(?:<!--(\d+)-->)?\x10$/g,
		SYSTEM_RE2:	/\x11(\d)([^\x11\x10]*)\x10/g,
		NICK_RE:	/\x11(?:0([123]))?(\d\d+)(\x11[^\x10]+\x10)/g,
		MESS_RE:	/\x11([^\x11\x13\x10]*)\x10$/,
		TIME_RE:	/(\d+)\x14/,
		TAG_RE:		/(<\w+[^>]*)\x11[^\x11\x10]*\x10([^<]*>)/
	}

	const $MESS_RE = [
		$HTML.TAG_RE, $HTML.SMILE_RE, $HTML.USER_SMILE_RE,
		$HTML.BOT_RE, $HTML.IMAGEATTACH_RE, $HTML.AUDIOATTACH_RE, $HTML.VIDEOATTACH_RE, $HTML.IMG_RE,
		$HTML.IFRAME_RE, $HTML.OBJECT_RE, $HTML.NICK_RE, $HTML.GRAPH_NICK_RE, $HTML.EMAIL_RE, $HTML.URL_RE,
		$HTML.COLOR_RE, $HTML.GRADIENT_RE, $HTML.GRADIENT_RE, $HTML.COLOR_RE, $HTML.FLAG_RE, $HTML.HIDDEN_RE,
		$HTML.TOPIC_RE, $HTML.SPAN_RE, $HTML.SYSTEM_RE, $HTML.SYSTEM_RE2, $HTML.MESS_RE, $HTML.TIME_RE
	]

	const $MESS_HTML = [
		"$1$2", $HTML.smile, $HTML.user_smile,
		$HTML.bot, $HTML.image_attach, $HTML.audio_attach, $HTML.video_attach, $HTML.img_code_int,
		$HTML.ifr_code_int, $HTML.object_code_int, $HTML.nick_code_int, $HTML.graph, $HTML.email, $HTML.url,
		$HTML.color, $HTML.color, $HTML.color, $HTML.color, $HTML.flag_code_int, $HTML.hidden_code,
		$HTML.topic_code, $HTML.span, $HTML.system, $HTML.system2, $HTML.mess_code_int, $HTML.time
	]

	return {
		now:		now,
		sync:		$SYNC,
		setLoader:	$SET_LOADER,
		xhr:		$XHR,
		loadJS:		$LOAD_JS,
		loadTPL:	$LOAD_TPL,
		loadCSS:	$LOAD_CSS,
		translit:	$TRANS,
		calendar:	$CALENDAR,
		storage:	$STORAGE,
		defer:		$DEFER,
		copy:		$COPY,
		clickHandler:	$CLICK,
		wo:		$WO,
		getid:		$GETID,
		fingerprint:	$FP,
		img2webp:	$IMG2WEBP,
		timer:		$TIMER,
		form:		$FORM,
		upload:		$UPLOAD,
		html:		$HTML,
		init:		$INIT
	}
})()

august_extend_proto (File)
august_extend_proto (RegExp)
august_extend_proto (Array)
august_extend_proto (Number)
august_extend_proto (Date)
august_extend_proto (Event)
august_extend_proto (Element)
august_extend_proto (DocumentFragment, Element)

august_run (() => window.august_main && august_main ())
