//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.scrollbar.js


function august_scrollbar ( view, opt, step, handler ) {
	this.doc = view.ownerDocument
	this.win = this.doc.defaultView
	this.track = view.parent ().insert ("scrollbar", view)
	this.slider = this.track.append ("slider")
	this.slider.append ("div")
	this.track.append ("div")
	this.track.noselect ()
	this.handler = handler
	this.Off = 0
	this.m = 0
	this.th = 0
	this.opt = opt || 0
	this.step = step || 100
	this.scrollbar = this
	this.track.scrollbar = this
	this.setView (view)
	this.hide ()
}

august_scrollbar.prototype = {
	setView ( view ) {
		this.view = view
		this.view.scrollbar = this
		this.view.parent ().scrollbar = this
		this.view.s ({ overflow: "hidden" })
		this.track.on ("mousedown", this.mouse)
		this.view.parent ().setClass ("scrollbar", 1)
			.on ("mouseover mouseout wheel", this.mouse, { passive: false })
			.on ("keydown", this.keydown)
		this.recalc ()
		if (this.opt & 1)
			this.view.on ("mousedown", this.mouse)
		this.touch = new august_touch (this.view, {
			start:	e => this.moveStart (e),
			move:	e => this.move (e),
			end:	e => this.moveEnd (e),
			opt:	8
		})
	},
	done () {
		this.hide ()
		this.touch.done ()
		this.track.un ("mousedown", this.mouse)
		this.view.parent ().setClass ("scrollbar", 0)
			.un ("mouseover mouseout wheel", this.mouse, { passive: false })
			.un ("keydown", this.keydown)
			.remove (this.track)
		this.view.scrollbar = null
		this.view.parent ().scrollbar = null
	},
	getScroll ( el ) {
		let s = 0
		for (let p = this.view.parent (); el && el != p; el = el.offsetParent)
			s += el.offsetTop
		return s
	},
	scrollTo ( s ) {
		if (isType (s, HTMLElement))
			s = this.getScroll (s)
		this.win.cancelAnimationFrame (this.ts)
		this.view.scrollTop = s
		this.recalc ()
	},
	scrollToSmooth ( s, dy = d => d >> 4 ) {
		if (isType (s, HTMLElement))
			s = this.getScroll (s)
		let st = s.clamp (0, this.scrollBottom)
		this.win.cancelAnimationFrame (this.ts)
		let ani = () => {
			let t = this.view.scrollTop
			let d = s - t
			this.view.scrollTop += dy (d) || d.sign ()
			if (this.view.scrollTop == t)
				return
			this.recalc ()
			if ((this.view.scrollTop | 0) != st)
				this.ts = this.win.requestAnimationFrame (ani)
		}
		ani ()
	},
	recalc () {
		if (this.scrollBottom == 0)
			return this.hide ()
		this.slider.setHeight (this.view.clientHeight * this.view.clientHeight / this.view.scrollHeight - this.view.clientHeight + this.track.clientHeight | 0)
		this.slider.s ({ top: (this.view.scrollTop * (this.track.clientHeight - this.slider.clientHeight) / this.scrollBottom | 0) + "px" })
		this.track.s ({ visibility: "" })
		if (this.ch)
			return
		let wait = () => {
			if (this.scrollBottom == 0)
				this.ch = 0, this.hide ()
			else
				this.ch = this.win.setTimeout (wait, 1000)
		}
		wait ()
	},
	hide () {
		this.track.s ({ visibility: "hidden" })
		this.win.clearTimeout (this.ch)
		this.win.clearTimeout (this.th)
		this.th = this.ch = 0
	},
	show () {
		this.recalc ()
	},
	on () {
		this.Off = 0
	},
	off () {
		this.Off = 1
		this.hide ()
	},
	mousewheel ( e ) {
		for (let el = e.$; el && el != this.view; el = el.parent ()) {
			let s = el.getStyleList ()
			if (s.overflowY == "auto" || s.overflowY == "scroll")
				return true
		}
		if (this.scrollBottom > 0)
			this.scrollToSmooth (this.view.scrollTop + this.step * e.delta () * (e.altKey ? .1 : 1), d => d >> 3)
		e.stop ()
	},
	moveTo ( y, dy = d => d ) {
		let e = this.track.clientHeight - this.slider.clientHeight
		this.scrollToSmooth (y.clamp (0, e) * this.scrollBottom / e + .5 | 0, dy)
	},
	moveToSmooth ( y ) {
		this.moveTo (y, d => d >> 4)
	},
	moveStart ( e ) {
		if (this.view.clientWidth == this.view.scrollWidth && this.scrollBottom == 0)
			return false
		if (e.type == "mousedown" && e.$.up (this.view, el => isSet (el.form) || el.is ("A")))
			return false
		this.m = 2
		this.x = e.pageX
		this.y = e.pageY
		return true		
	},
	moveEnd ( e ) {
		this.m = 0
		this.scrollToSmooth (this.view.scrollTop - 8 * e.dy.sign () * (10 * e.dy / e.dt) ** 2 | 0)
	},
	mouseup ( e ) {
		if (this.m == 2) {
			this.view.s ({ cursor: "" })
		} else if (this.m == 1) {
			if (this.out)
				this.hide ()
		}
		this.m = 0
		this.doc.scrollbar = null
		this.doc.removeEventListener ("mousemove", this.mouse)
		this.doc.removeEventListener ("mouseup", this.mouse)
	},
	mousedown ( e, own ) {
		if (e.which != 1)
			return
		if (this.opt & 1 && own == this.view) {
			if (!this.moveStart (e))
				return false
			this.view.s ({ cursor: "move" })
		} else {
			if (e.type == "mousedown" && e.$.parent () != this.slider)
				return this.moveToSmooth (e.pageY - this.track.rect ().y - this.slider.clientHeight / 2)
			this.m = 1
			this.my = e.pageY - this.slider.offsetTop
		}
		this.doc.scrollbar = this
		this.doc.addEventListener ("mousemove", this.mouse)
		this.doc.addEventListener ("mouseup", this.mouse)
	},
	move ( e ) {
		if (this.m == 1) {
			this.moveTo (e.pageY - this.my)
		} else if (this.m == 2) {
			this.view.scrollLeft += this.x - e.pageX
			this.view.scrollTop += this.y - e.pageY
			this.x = e.pageX
			this.y = e.pageY
			this.recalc ()
		}
	},
	mhide ( e, out ) {
		this.out = out
		if (!out) {
			if (this.th)
				this.win.clearTimeout (this.th), this.th = 0
			if (this.scrollBottom > 0)
				this.show ()
		} else if (!this.m) {
			this.th = this.win.setTimeout (() => {
				if (!this.m)
					this.hide ()
			}, 1000)
		}
		if (this.handler) {
			if (this.handler.out && out)
				this.handler.out (e)
			else if (this.handler.over && !out)
				this.handler.over (e)
		}
		return false
	},
	mouse ( e ) {
		let s = this.scrollbar
		if (s && !s.Off) switch (e.type) {
			case "mouseover": return s.mhide (e, 0)
			case "mouseout":  return s.mhide (e, 1)
			case "mousemove": return s.move (e)
			case "mouseup": return s.mouseup (e)
			case "mousedown": return s.mousedown (e, this)
			case "wheel": return s.mousewheel (e)
		}
	},
	keydown ( e ) {
		let s = this.scrollbar
		if (s.Off || e.ctrlKey || e.altKey || e.shiftKey || (e.$.form && !(s.opt & 2)))
			return
		let v = s.view
		let lh = () => {
			let lh = parseInt (v.getStyleList ().lineHeight, 10)
			return lh === lh ? 2 * lh : ~~(.1 * v.clientHeight)
		}
		switch (e.keyCode) {
			case 33:  //  PgUp
				return s.scrollToSmooth (v.scrollTop - ~~(v.clientHeight * .9))
			case 34:  //  PgDown
				return s.scrollToSmooth (v.scrollTop + ~~(v.clientHeight * .9))
			case 36:  //  Home
				return s.scrollToSmooth (0)
			case 35:  //  End
				return s.scrollToSmooth (s.scrollBottom)
			case 38:  //  up
				return s.scrollToSmooth (v.scrollTop - lh ())
			case 40:  //  down
				return s.scrollToSmooth (v.scrollTop + lh ())
		}
	},
	get scrollBottom () {
		let sb = this.view.scrollHeight - this.view.clientHeight | 0
		this.track.setClass ("off", !sb)
		return sb
	}
}
