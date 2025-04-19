//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.round-volume.js


function august_round_volume ( el, min, max, cb ) {
	function handler ( e ) {
		switch (e.type) {
			case "mousedown":
				pos = el.rect ()
				fi0 = get_fi (e) - Val + 135
				doc.addEventListener ("mousemove", handler, true)
				doc.addEventListener ("mouseup", handler, true)
				el.setClass ("active", 1).fire ("noselect", 1)
				break
			case "mouseup":
				doc.removeEventListener ("mousemove", handler, true)
				doc.removeEventListener ("mouseup", handler, true)
				el.setClass ("active", 0).fire ("noselect")
				break
			case "mousemove":
				let fi = get_fi (e) - fi0
				let v = fi - 135 - 90
				while (v < 0)
					v += 360
				if (Lock && (Math.abs (v - Val) > 10 || (Val - v < 0 ? 1 : -1) != Lock))
					fi0 += fi - Val + 135
				else if (v > 270)
					Lock = Val < 10 ? 1 : -1
				else
					Lock = 0, set (v)
					
				break
			case "wheel":
				set (Val - 6 * e.delta ())
				return e.stop ()
		}
	}
	function get_fi ( e ) {
		return Math.atan2 (e.pageY - pos.y - (el.offsetHeight >> 1), e.pageX - pos.x - (el.offsetWidth >> 1)) * 180 / Math.PI
	}
	function set ( v ) {
		Val = v.clamp (0, 270)
		let fi = Val + 135 + 90
		Cursor.s ({ transform: `rotate(${fi}deg)` })
		cb (min + Math.round ((max - min) * Val / 2.7) / 100)
	}
	this.done = function () {
		Touch.done ()
		el.un ("mousedown wheel", handler)
	}
	this.set = function ( v ) {
		set (270 * (v - min) / (max - min))
	}

	let doc = el.ownerDocument
	let pos = null
	let fi0 = 0.0
	let Val = 135
	let Lock = 0
	let Cursor = el.append ("DIV")
	let Touch = new august_touch (el, {
		start:	e => true,
		move:	e => set (Val + e.dx1 - e.dy1)
	})
	el.on ("mousedown wheel", handler)
}
