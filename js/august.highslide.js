//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.highslide.js


function august_highslide ( class_wait, class_img ) {
	function body_click ( e ) {
		let el = e.$
		let view = el.dataset.view
		if (!view || el.view || !el.is ("IMG") || !el.complete || (el.idx && $VIEW [el.idx]))
			return
//		if (el.naturalWidth == el.width)
//			return
		el.view = 1
		el.idx = $IDX++
		let pt = el.getStyle ("paddingTop") + el.getStyle ("borderTopWidth")
		let pr = el.getStyle ("paddingRight") + el.getStyle ("borderRightWidth")
		let pb = el.getStyle ("paddingBottom") + el.getStyle ("borderBottomWidth")
		let pl = el.getStyle ("paddingLeft") + el.getStyle ("borderLeftWidth")
		let r = el.rect ()
		let w = () => el.rect ().width - pr - pl
		let h = () => el.rect ().height - pt - pb
		let WAIT = $Body.append ("div", {
			className:	class_wait
		}).rect (r.x + pl + $Doc.scrollLeft, r.y + pt + $Doc.scrollTop, w (), h ())
		let HSI = $HSBody.append ("hs-img", {
			className:	class_img,
			hs:		1,
			img_in:		el
		}).rect (0, 0, w (), h ()).s ({
			zIndex:		++$zIndex,
			visibility:	"hidden"
		})
		HSI.img = HSI.append ("img", { src: view })
		HSI.close = HSI.append ("div", { className: "close" })
		HSI.full = HSI.append ("div", { className: "full-screen" })
		HSI.noselect ()
		HSI.on ("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd", end)
		HSI.fx = HSI.getStyleList ().position == "fixed"
		HSI.l = () => $Body.scrollLeft
		HSI.t = () => $Body.scrollTop
		let tic = 0
		let go = () => {
			if (!HSI.img.complete) {
				if (++tic < 200)
					setTimeout (go, 100)
				return
			}
			$Body.remove (WAIT)
			if (HSI.img.naturalWidth == el.width) {
				$HSBody.remove (HSI)
				return
			}
			el.setClass ("hs-shown")
			hs (HSI, 1, p => {
				let dx = pl + p.dr.left - p.ir.left - p.ml
				let dy = pt + p.dr.top - p.ir.top - p.mt
				HSI.dataset.phase = "show"
				HSI.pos (r.x + dx - HSI.l (), r.y + dy - HSI.t ()).s ({ visibility: "" })
				+$Doc.scrollLeft
				$VIEW [el.idx] = { HSI, w, h, dx, dy }
			})
			HSI.setClass ("show")
			HSI.onclick = click
			HSI.onmousedown = move_start
			HSI.onmouseup = move_end
			HSI.touch = new august_touch (HSI, {
				start:	move_start,
				move:	move,
				end:	move_end
			})
		}
		go ()
	}
	function body_cancel ( e ) {
		if (e.$.parent () == $HSBody)
			return hide (e.$.img_in.idx), e.stop ()
		if (e.$ == $HSBody && $HSBody.fs)
			return full (), e.stop ()
	}
	function hide_v ( v ) {
		if (!v)
			return
		let r = v.HSI.img_in.rect ()
		v.HSI.img_in.view = 0
		v.HSI.onclick = v.HSI.onmousedown = v.HSI.onmouseup = null
		v.HSI.dataset.phase = "hide"
		v.HSI.setClass ("ready", 0)
		v.HSI.rect (r.x + v.dx - v.HSI.l (), r.y + v.dy - v.HSI.t (), v.w (), v.h ())
		v.HSI.touch.done ()
		$zIndex = $VIEW.reduce (( z, v ) => v ? Math.max (z, v.HSI.getStyle ("zIndex")) : z, 99)
	}
	function hide ( idx ) {
		if ($HSBody.fs)
			return full ()
		move_end ()
		hide_v ($VIEW [idx])
		$VIEW [idx] = null
	}
	function end ( e ) {
		if (e.propertyName == "width") {
			if (this.dataset.phase == "show") {
				this.setClass ("expand", this.img.width < this.img.naturalWidth)
				this.setClass ("ready", 1)
			} else if (this.dataset.phase == "hide") {
				this.img_in.setClass ("hs-shown")
				this.img_in.idx = void 0
				$HSBody.remove (this)
			}
		}
	}
	function click ( e ) {
		let p = e.$.parent ()
		if (e.$.hs && !e.$.m)
			hs (e.$, e.$.fs)
		else if (p.full == e.$)
			full ()
		else if (p.close == e.$)
			hide (p.img_in.idx)

	}
	function move_start ( e ) {
		if (e.$.hs && (e.touches || e.which == 1)) {
			$Move = e.$
			$Move.xy = {
				x: e.pageX,
				y: e.pageY,
				l: e.$.getStyle ("left"),
				t: e.$.getStyle ("top"),
				z: +e.$.getStyle ("zIndex") < $zIndex
			}
			if ($Move.xy.z)
				$Move.s ({ zIndex: ++$zIndex })
			$Move.setClass ("move", 1)
			return true
		}
	}
	function move_end ( e ) {
		if ($Move) {
			$Move.setClass ("move", 0)
			$Move.m = $Move.xy.x != e.pageX || $Move.xy.y != e.pageY
			$Move = null
		}
	}
	function move ( e ) {
		if ($Move)
			$Move.pos (e.pageX - $Move.xy.x + $Move.xy.l, e.pageY - $Move.xy.y + $Move.xy.t)
	}
	function win_resize ( e ) {
		if ($HSBody.fs)
			return
		move_end ({ pageX: 0, pageY: 0 })
		clearTimeout ($ResizeTO)
		$ResizeTO = setTimeout (() => {
			for (let v of $VIEW)
				v && hs (v.HSI, 1)
		}, 500)
	}
	function animationend ( e ) {
		this.setClass ("error", 0)
	}
	function fullscreen ( e ) {
		clearTimeout ($ResizeTO)
		this.fs ^= 1
		this.setClass ("hide", 1).setClass ("full-screen")
		setTimeout (() => {
			for (let v of $VIEW)
				v && hs (v.HSI, 1)
			setTimeout (() => {
				this.setClass ("hide")
			}, 20)
		}, 100)
	}
	function full () {
		let doc = $HSBody.ownerDocument
		if (doc.fullscreenElement)
			doc.exitFullscreen ()
		else
			$HSBody.requestFullscreen ().catch (e => $HSBody.setClass ("error", 1))
	}
	function hs ( HSI, scale, pre ) {
		let dr = HSI.getBoundingClientRect ()
		let ir = HSI.img.getBoundingClientRect ()
		let mt = HSI.getStyle ("marginTop")
		let mr = HSI.getStyle ("marginRight")
		let mb = HSI.getStyle ("marginBottom")
		let ml = HSI.getStyle ("marginLeft")
		let w = HSI.img.naturalWidth + dr.width - ir.width
		let h = HSI.img.naturalHeight + dr.height - ir.height
		let ww = $Doc.clientWidth - ml - mr
		let wh = $Doc.clientHeight - mt - mb
		let k = scale && Math.max (w / ww, h / wh)
		HSI.fs = !(k > 1)
		if (k > 1) {
			w = w / k + .5 | 0
			h = h / k + .5 | 0
		}
		pre && pre ({ dr, ir, ml, mr, mt, mb })
		HSI.rect (ww - w >> 1, wh - h >> 1, w - dr.width + ir.width, h - dr.height + ir.height)
	}
	function hideAll () {
		for (let v of $VIEW)
			hide_v (v)
	}

	let $Move = null
	let $zIndex = 99
	let $VIEW = []
	let $IDX = 0
	let $ResizeTO = 0
	let $Doc =  document.documentElement
	let $Body = document.body
	let $HSBody = $Body.append ("hs-body")
	$Body.on ("click", body_click)
	$Body.on ("contextmenu", body_cancel)
	$Doc.on ("mousemove", move)
	$HSBody.on ("fullscreenchange", fullscreen).on ("animationend", animationend)
	addEventListener ("resize", win_resize)

	return { hideAll }
}
