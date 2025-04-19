//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.colorpicker.js


function august_rgb2hsv ( rgb ) {
	let max = Math.max (rgb.r, rgb.g, rgb.b)
	let min = Math.min (rgb.r, rgb.g, rgb.b)
	let d = max - min
	let h = !d
		? 0
		: max == rgb.g
		? 2 + (rgb.b - rgb.r) / d
		: max == rgb.b
		? 4 + (rgb.r - rgb.g) / d
		: ((rgb.g < rgb.b ? 6 : 0) + (rgb.g - rgb.b) / d)
	return { h: h, s: max ? 1 - min / max : 0, v: max }
}

function august_hsv2rgb ( hsv ) {
	let min = (1 - hsv.s) * hsv.v + .5 | 0
	let a = (hsv.v - min) * (hsv.h % 1)
	let inc = min + a + .5 | 0
	let dec = hsv.v - a + .5 | 0
	switch ((hsv.h | 0) % 6) {
		case 0: return { r: hsv.v, g: inc, b: min }
		case 1: return { r: dec, g: hsv.v, b: min }
		case 2: return { r: min, g: hsv.v, b: inc }
		case 3: return { r: min, g: dec, b: hsv.v }
		case 4: return { r: inc, g: min, b: hsv.v }
		case 5: return { r: hsv.v, g: min, b: dec }
	}
}

function august_colorPickerSliders ( root, rgb, cur_clr, set_clr, active ) {
	function slider ( el, p, cb ) {
		this.color = function ( rgb ) {
			ch.style.backgroundColor = color (rgb)
		}
		this.opacity = function ( v, inner ) {
			(inner ? ch : el).style.opacity = v / 255
		}
		this.start = function ( e ) {
			m = el == e.$
			if (m)
				x = e.pageX
			return m
		}
		this.move = function ( e ) {
			if (m)
				this.set ((scr + x - e.pageX) % p + p)
			return m
		}
		this.end = function ( e ) {
			if (!m)
				return
			scr += x - e.pageX
			m = 0
		}
		this.set = function ( s ) {
			cb (s | 0)
			s += s0
			while (s > p)
				s -= p
			el.scrollLeft = s * w / p + .5 | 0
		}
		this.init = function ( s ) {
			this.set (scr = s)
		}

		el.innerHTML = "<div></div>"
		let ch = el.first ()
		let w = ch.offsetWidth / 2
		let x = 0
		let m = 0
		let s0 = p * el.offsetWidth / ch.offsetWidth
		let scr = 0
	}
	function start ( e ) {
		if (hue.start (e) || sat.start (e) || val.start (e)) {
			cp.setClass ("rot", 1)
			active && active (1)
			return true
		}
	}
	function move ( e ) {
		hue.move (e) || sat.move (e) || val.move (e)
	}
	function end ( e ) {
		hue.end (e)
		sat.end (e)
		val.end (e)
		cp.setClass ("rot", 0)
		active && active (0)
	}
	function set () {
		let rgb = august_hsv2rgb (hsv)
		let c = color (rgb)
		cp.last ().dataset.color = c
		cp.last ().style.backgroundColor = c
		cb && cur_clr (c, rgb)
	}
	function click () {
		let rgb = august_hsv2rgb (hsv)
		set_clr (color (rgb), rgb)
	}
	function color ( rgb ) {
		return `#${rgb.r.hex ()}${rgb.g.hex ()}${rgb.b.hex ()}`
	}
	this.done = function () {
		touch.done ()
		cp.un ("mousedown", start)
		cp.last ().un ("click", click)
		doc.un ("mousemove", move).un ("mouseup", end)
		root.removeChild (cp)
	}
	this.cp = function () {
		return cp
	}

	let doc = root.ownerDocument.documentElement
	let cp = root.append ("color-picker")
	cp.innerHTML = "<div><div></div><div></div><div></div></div><div></div>"
	let sl = cp.first ()
	let touch = new august_touch (cp, { start, move, end })
	let hue = new slider (sl.el (0), 360, v => {
		hsv.h = v / 60
		sat.color (august_hsv2rgb ({ h: hsv.h, s: 1, v: 255 }))
		val.color (august_hsv2rgb ({ h: hsv.h, s: hsv.s, v: 255 }))
		set ()
	})
	let sat = new slider (sl.el (1), 512, v => {
		if (v >= 512)
			v -= 512
		if (v >= 256)
			v = 511 - v
		hsv.s = v / 255
		hue.opacity (v, 1)
		val.color (august_hsv2rgb ({ h: hsv.h, s: hsv.s, v: 255 }))
		set ()
	})
	let val = new slider (sl.el (2), 512, v => {
		if (v >= 512)
			v -= 512
		if (v >= 256)
			v = 511 - v
		hsv.v = v
		hue.opacity (v)
		sat.opacity (v, 1)
		set ()
	})

	if (isString (rgb)) {
		let c = rgb.substr (1).hex ()
		rgb = { r: c.b2, g: c.b1, b: c.b0 }
	}
	let cb = 0
	let hsv = august_rgb2hsv (rgb)
	hue.init (hsv.h * 60)
	sat.init (hsv.s * 256)
	val.init (hsv.v)
	cb = 1

	cp.oncontextmenu = e => false
	cp.noselect ()
	cp.on ("mousedown", start)
	cp.lastChild.on ("click", click)
	doc.on ("mousemove", move).on ("mouseup", end)
}

function august_colorPicker ( root ) {
	function hide () {
		if (cp) {
			clearTimeout (to)
			cp.done ()
			cp = null
			root.noselect ("initial")
		}
	}
	function show ( xy, color, cur_clr, set_clr ) {
		function timeout () {
			if (to || on)
				return
			to = setTimeout (() => {
				cur_clr (null)
				hide ()
			}, 2000)
		}

		hide ()
		root.noselect ()
		on = to = out = 0
		cp = new august_colorPickerSliders (root, color, cur_clr,
			c => {
				set_clr (c)
				hide ()
			},
			a => {
				on = a
				if (out)
					timeout ()
			}
		)
		cp.cp ().on ("mouseover", e => {
			clearTimeout (to)
			to = 0
			out = 0
		}).on ("mouseout", e => {
			if (cp) {
				out = 1
				timeout ()
			}
		}).s ({
			position:	"absolute",
			zIndex:		9999
		}).pos (xy.x, xy.y)
		setTimeout (() => {
			let el = cp.cp ()
			if (root.offsetWidth < el.offsetLeft + el.offsetWidth) {
				el.s ({
					left:	"auto",
					right:	0
				})
			}
		})
	}

	let cp = null
	let on = 0
	let to = 0
	let out = 0

	return { show, hide }
}
