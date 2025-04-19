//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.watch.js


August.initModule ("watch", function ( win ) {
	function handler ( e ) {
		switch (e.type) {
			case "dblclick":
				break
			case "mousedown":
				if (e.button == 0)
					move_start (e)
				else if (e.button == 2)
					$Right = 1
				break
			case "mouseup":
				if ($Move)
					move_end (e)
				else if ($Right)
					$Right = 0
				break
			case "mousemove":
				if ($Move)
					move (e)
				break
			case "wheel":
				if (e.ctrlKey) {
					$Watch.setClass (`zoom${$Zoom}`, 0)
					if (e.deltaY > 0) {
						if ($Zoom > 50)
							$Zoom -= 10
					} else if (e.deltaY < 0) {
						if ($Zoom < 200)
							$Zoom += 10
					}
					set_zoom ()
					$Watch.size (width (), height ())
					param ("zoom", $Zoom)
					return e.stop ()
				} else if ($Right) {
					break
				}
				if (e.deltaY > 0) {
					if ($Opacity > 10)
						$Opacity -= 10
				} else if (e.deltaY < 0) {
					if ($Opacity < 100)
						$Opacity += 10
				}
				$Watch.s ({ opacity: $Opacity / 100 })
				param ("opacity", $Opacity)
				break
			case "contextmenu":
				$Factor = $Factor == 1 ? 5 : 1
				param ("factor", $Factor)
				set_quartz ()
				return e.stop ()
		}
	}
	function move_start ( e ) {
		$Watch.mx = e.pageX - $Watch.offsetLeft
		$Watch.my = e.pageY - $Watch.offsetTop
		$Watch.setClass ("move", 1).fire ("noselect", 1)
		$Move = 1
		return true
	}
	function move ( e ) {
		let bw = win.document.body.clientWidth
		let bh = win.document.body.clientHeight
		let mx = bw - width ()
		let my = bh - height ()
		$Pos.x = (mx - (e.pageX - $Watch.mx).clamp (0, mx)) * 100 / bw
		$Pos.y = (my - (e.pageY - $Watch.my).clamp (0, my)) * 100 / bh
		win.requestAnimationFrame (_ => {
			$Watch.s ({
				right:	$Pos.x + "%",
				bottom:	$Pos.y + "%"
			})
		})
	}
	function move_end ( e ) {
		$Watch.setClass ("move", 0).fire ("noselect")
		$Move = 0
		param ("x", $Pos.x)
		param ("y", $Pos.y)
	}
	function set_quartz () {
		$360 = 0
		$Watch.setClass ("quartz", $Factor == 1)
	}
	function set_zoom () {
		$Watch.setClass ("zoom" + $Zoom, 1)
	}
	function width () {
		return $Width * $Zoom / 100 + .5 | 0
	}
	function height () {
		return $Height * $Zoom / 100 + .5 | 0
	}
	function loading ( cb ) {
		let c = 0
		let w = () => {
			$Width = $Watch.clientWidth
			$Height = $Watch.clientHeight
			if ($Width && $Height)
				cb ()
			else if (++c < 100)
				win.setTimeout (w, 100)
		}
		w ()
	}
	function init () {
		win.clearTimeout ($to)
		Chat.addCSS ("watch", () => {
			$Watch = win.document.body.append ("watch")
			$Watch.s ({ visibility: "hidden" })
			$Watch.innerHTML = "<div></div><div></div><div></div>"
			$Watch.on ("wheel dblclick mousedown contextmenu", handler)
			$Watch.ownerDocument.addEventListener ("mousemove", handler)
			$Watch.ownerDocument.addEventListener ("mouseup", handler)
			$Watch.touch = new august_touch ($Watch, {
				start:	move_start,
				move:	move,
				end:	move_end
			})
			loading (() => {
				set_zoom ()
				set_quartz ()
				$Watch.s ({
					width:		width () + "px",
					height:		height () + "px",
					right:		$Pos.x + "%",
					bottom:		$Pos.y + "%",
					opacity:	$Opacity / 100,
					visibility:	""
				})
				let tic = () => {
					let d = new Date
					let h = d.getHours ()
					let m = d.getMinutes ()
					let s = d.getSeconds ()
					let ms = d.getMilliseconds ()
					let sa = $Factor == 1
						? (s ? $360 + s * 6 : $360 += 360) + ~~(ms / 1000) * 6
						: s * 6 + ~~($Factor * ms / 1000) * 6 / $Factor
					let dly = 1000 / $Factor
					$to = win.setTimeout (tic, dly - ms % dly)
					$Watch.props ({ "--h": h, "--m": m, "--s": s, "--sa": sa })
				}
				tic ()
			})
		})
	}
	function destroy () {
		if ($Watch) {
			win.clearTimeout ($to)
			win.document.body.remove ($Watch)
			$Watch.touch.done ()
			$Watch = null
		}
	}
	function redesign () {
		$Watch.size ()
		loading (() => $Watch.size (width (), height ()))
	}
	function reinit ( r ) {
		if (r)
			init ()
		else
			redesign ()
	}
	this.init = init

	let param = August.storage ("watch", 0)
	let $Factor = +param ("factor") || 5
	let $Opacity = +param ("opacity") || 100
	let $Zoom = +param ("zoom") || 100
	let $Pos = { x: +param ("x"), y: +param ("y") }
	let $Watch = null
	let $Width = 0
	let $Height = 0
	let $360 = 0
	let $Move = 0
	let $Right = 0
	let $to = 0

	Chat.Event.on ("redesign", redesign)
		.on ("reinit", reinit)
		.on ("destroy", destroy)
})
