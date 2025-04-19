//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.js


MAIN = {
	keyHandler: function ( f ) {
		this.$KeyFunc = f
		if (this.$KeyInit)
			return
		this.$KeyInit = 1
		document.body.on ("keydown", e => {
			if (e.altKey && e.keyCode == 0x58)
				close ()
			else if (this.$KeyFunc)
				this.$KeyFunc.call (e.$, e)
		})
	},
	clickHandler ( ... f ) {
		this.$ClickFunc = f
		if (this.$ClickInit)
			return
		this.$ClickInit = 1
		document.body.on ("click", e => {
			let act = el => {
				if (el.id && isSet (this.$ACTION [el.id]))
					return this.$ACTION [el.id]
				let a = el.name || el.attr ("name") || el.dataset.a
				if (a && isSet (this.$ACTION [a]))
					return this.$ACTION [a]
				return null
			}
			let call = ( el, a ) => {
				el.blur ()
				let r = false
				if (isFunction (a))
					r = a (el)
				else if (this.$ClickFunc [0])
					r = this.$ClickFunc [0].call (el, a)
				return r || e.stop ()
			}

			let el = e.$
			let a = act (el)
			if (a) {
				el.el = el
				return call (el, a)
			}
			let el2 = el.parent ()
			let a2 = act (el2)
			if (a2) {
				el2.el = el
				return call (el2, a2)
			}
			return this.$ClickFunc [1]
				? this.$ClickFunc [1].call (el) || e.stop ()
				: true
		})
	},
	save () {
		this.$ACTIONS_STACK.push (this.$ACTION)
	},
	restore () {
		this.$ACTION = this.$ACTIONS_STACK.pop ()
	},
	state () {
		return this.$ACTIONS_STACK.length
	},
	actions ( a ) {
		this.$ACTION = a
	},
	add ( a ) {
		Object.assign (this.$ACTION, a)
	},
	user ( u ) {
		return root.Chat && root.Chat.userinfo && u.p
			? `<a class='user-nick${u.del ? " del" : ""}' onClick='root.Chat.userinfo ({p:${u.p}}); return false' href=/>${u.n}</a>`
			: u.del
			? `<span class=del>${u.n}</span>`
			: u.n
	},
	avatar ( a ) {
		return a ? `//${this.Host}/people/avatar/${a.hex (4)}.${a.ext ()}` : ``
	},
	date ( t, f, l ) {
		return t ? t.date (f, l) : ""
	},
	longTime ( t, hs, ms ) {
		return t ? t.time (hs, ms) : ""
	},
	longDays ( t, ds, hs, ms ) {
		return t ? t.days (ds, hs, ms) : ""
	},
	longYears ( t, ys, ds, hs, ms ) {
		if (!t)
			return ""
		let d1 = new Date (this.$NOW * 1000)
		let d2 = new Date ((this.$NOW - t) * 1000)
		let y1 = d1.getFullYear ()
		let y2 = d2.getFullYear ()
		d2.setFullYear (y1)
		let cy = y1 - y2
		if (1000 * this.$NOW < d2.getTime ()) {
			cy--
			d2.setFullYear (y1 - 1)
		}
		return cy
			? `${cy} ${cy._end (ys)} ${(this.$NOW - (0 | d2.getTime () / 1000)).days (ds, hs, ms)}`
			: t.days (ds, hs, ms)
	},
	list ( List, Add ) {
		return Object.assign ({
			LONG_TIME:	this.longTime,
			LONG_DAYS:	this.longDays,
			LONG_YEARS:	this.longYears,
			NUM		() { let n = this.$n (); return this.$list [n] ? n + 1 : "" },
			NICK		() { return this.$u && this.$u.n.length ? MAIN.user (this.$u) : "" },
			DATE2		( f, l ) { return this.$u ? MAIN.date (this.$u.d, f, l) : "" },
			$size		() { return this.$l || this.$list.length },
			$set		() { this.$u = this.$list [this.$n ()]; if (this.$set2) this.$set2 () },
			$args		( a ) { this.$list = List [a] },
			$list:		List
		}, Add)
	},
	collapse ( el ) {
		return new Promise (( resolve, reject ) => {
			cancelAnimationFrame (el.ra_id)
			let t = el.next ()
			t.setHeight ()
			let h = t.scrollHeight
			el.clps = el.setClass ("collapse")
			if (el.clps)
				h = 0
			let proc = _ => {
				if (t.offsetHeight == h) {
					t.setHeight (null)
					return resolve ()
				}
				el.ra_id = requestAnimationFrame (proc)
			}
			proc ()
		})
	},
	loader ( show ) {
		document.body.setClass ("loader", show ? ++document.body.__loader : (document.body.__loader && --document.body.__loader))
	},
	loadDesign ( css, cb ) {
		if (css)
			this.$CSS = css
		this.loadCSS (["people", `people-${this.$CSS}`], cb)
	},
	loadCSS ( css, cb ) {
		August.loadCSS (window, css, this.Design, cb)
	},
	loadTPL ( ... arg ) {
		August.loadTPL ({ TPL: this.TPL, APL: "people" }, this.loader)(... arg)
	},
	xhr ( ... arg ) {
		August.xhr (this.loader)(... arg)
	},
	sendCmd ( a, cb, data ) {
		this.loader (1)
		new august_http ().send (`//${this.Host}/august?a=${a}&id=${root.User.ID}`, ( r, s ) => {
			this.loader ()
			if (r !== false)
				cb (r, s)
		}, data)
	},
	run ( func, ... arg ) {
		let run = func => this.loadDesign (func, () => {
			this.$FUNC [func] = new window [`august_people_${func}`](... arg)
		})
		INIT.FUNC = func
		if (window [`august_people_${func}`])
			return run (func)
		August.loadJS ("august.people.index.js").then (() => run ("index"))
	},
	idCSS ( css ) {
		return $(`css_${`${document.baseURI}-${this.Design}-people-${css}`.md5 ()}`)
	},
	$ACTIONS_STACK: [],
	$ACTION: {},
	$FUNC: {},
	$CSS: "",
	$NOW: 0
}

August.init ({ Host: INIT.HOST, Version: INIT.VERSION })

august_run (() => {
	if (!INIT.OK) {
		location = "bad-browser.html"
		return
	}
	try {
		window.root = window.opener && opener.root || window
	} catch ( e ) {
		window.root = window
	}
	window.name = "August People"
	window.wid = "PEOPLE"
	if (root != window && root.Chat) {
		let loadDesign = MAIN.loadDesign.bind (MAIN, void 0, void 0)
		root.Chat.Event.on ("redesign", loadDesign)
			.on ("reinit", loadDesign)
		onbeforeunload = function () {
			root.Chat.Event.un ("redesign", loadDesign)
				.un ("reinit", loadDesign)
				.fire ("people-destroy")
		}
	}
	document.body.setClass ("mobile", INIT.MOBILE)
	document.body.__loader = 0
	"".define ("USER", ( n, p ) => MAIN.user ({ n, p }))
	.define ("MOBILE_DEVICE", _ => "".true (INIT.MOBILE))
	MAIN.TPL = INIT.TPL
	MAIN.Host = INIT.HOST
	MAIN.Design = INIT.DESIGN || (INIT.MOBILE ? INIT.DEFDESMOBI : INIT.DEFDES)
	MAIN.Version = INIT.VERSION
	MAIN.$sb = window.august_scrollbar
	MAIN.run (INIT.FUNC)
}, [
	INIT.FUNC in { index: 0, info: 0, form: 0 } ? `august.people.${INIT.FUNC}.js` : null,
	!INIT.MOBILE && INIT.SB ? `august.scrollbar.js` : null
])
