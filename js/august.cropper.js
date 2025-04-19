//  August Chat System
//  Copyright (c) 2024 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.cropper.js


AUGUST_IMG_LIB = {
	canvas ( w, h ) {
		let canvas = document.createElement ("canvas")
		canvas.width = w
		canvas.height = h
		return canvas
	},
	area ( x, y, z, w, h, pw, ph ) {
		let zw = w / pw
		let zh = h / ph
		let mw = zw > zh ? w - pw * zh : 0
		let mh = zh > zw ? h - ph * zw : 0
		let sw = w - mw
		let sh = h - mh
		return sw && sh
			? {
				sx: (x + (mw >> 1)) * z,
				sy: (y + (mh >> 1)) * z,
				sw: sw * z,
				sh: sh * z
			}
			: null
	},
	resize ( img, a, w, h, smooth = 1 ) {
		let canvas = this.canvas (w, h)
		let ctx = canvas.getContext ("2d")
		ctx.imageSmoothingEnabled = smooth
		ctx.drawImage (img, a.sx, a.sy, a.sw, a.sh, 0, 0, w, h)
		return canvas
	},
	flip ( c, f ) {
		let canvas = this.canvas (c.width, c.height)
		let ctx = canvas.getContext ("2d")
		ctx.createImageData (c.width, c.height)
		let ctx_in = c.getContext ("2d")
		if (f) {
			for (let y = 0; y < c.height; y++)
				ctx.putImageData (ctx_in.getImageData (0, y, c.width, 1), 0, c.height - y - 1)
		} else {
			for (let x = 0; x < c.width; x++)
				ctx.putImageData (ctx_in.getImageData (x, 0, 1, c.height), c.width - x - 1, 0)
		}
		return canvas
	},
	filter ( c, m, d, o ) {
		let w = c.width
		let h = c.height
		let canvas = this.canvas (w, h)
		let inp = c.getContext ("2d").getImageData (0, 0, w, h)
		let src = inp.data
		let out = canvas.getContext ("2d").createImageData (w, h)
		let dst = out.data
		let ip = 0
		if (!d)
			d = m.reduce (( a, b ) => a.concat (b)).reduce (( a, b ) => a + b) || 1
		if (!o)
			o = d < 0 ? 256 : 0
		if (d < 0)
			d = -d
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let r = 0
				let g = 0
				let b = 0
				for (let cy = 0; cy < 3; cy++) {
					let yv = (y - 1 + cy).clamp (0, h - 1)
					for (let cx = 0; cx < 3; cx++) {
						let xv = (x - 1 + cx).clamp (0, w - 1)
						let n = (w * yv + xv) * 4
						r += src [n + 0] * m [cy][cx]
						g += src [n + 1] * m [cy][cx]
						b += src [n + 2] * m [cy][cx]
					}
				}
				dst [ip++] = r / d + o
				dst [ip++] = g / d + o
				dst [ip++] = b / d + o
				dst [ip++] = src [(w * y + x) * 4 + 3]
			}
		}
		canvas.getContext ("2d").putImageData (out, 0, 0)
		return canvas
	},
	sharpen ( c ) {
		return this.filter (c, [[-1., -1., -1.], [-1., 24., -1.], [-1., -1., -1.]])
	}
}

function august_cropper ( param ) {
	let doc = param.holder.ownerDocument
	let win = doc.defaultView
	let $Busy = 0
	let $File = null
	let $Img = null
	let $Rect = null
	let $Canvas = null
	let $Context = null
	let $Crop = null
	let $Shadow = null
	let $xy = null
	let $xywh = null
	let $Area = null
	let $Brightness = 100
	let $Contrast = 100
	let $Saturate = 100
	let $Blur = 0
	let $Invert = 0
	let $HueRotate = 0
	const $CUR = [
		"", "n-resize", "e-resize", "ne-resize", "s-resize", "",
		"se-resize", "", "w-resize", "nw-resize", "", "", "sw-resize"
	]
	const $SQ = { 0: 1, 3: 1, 6: 1, 12: 1, 9: 1 }
	param.holder.noselect ()
	param.preview.size (param.pw, param.ph)

	let clamp_x = x => x.clamp ($Img.offsetLeft, $Img.offsetLeft + $Img.offsetWidth)
	let clamp_y = y => y.clamp ($Img.offsetTop, $Img.offsetTop + $Img.offsetHeight)

	let mouse_down = e => {
		if (!$Img)
			return
		let x = e.pageX
		let y = e.pageY
		if (e.$ == $Img) {
			reset ()
			let r = param.holder.rect ()
			$xy = { x: x - r.x, y: y - r.y }
			$Crop.move = 0
			$Crop.resize = 0
			$Img.className = "shadow"
		} else if (e.$ == $Crop) {
			$Crop.resize = $Crop.border (x, y)
			if ($Crop.resize) {
				$Crop.move = 0
				$xy = {
					x: $Crop.offsetLeft + ($Crop.resize & 8 ? $Crop.offsetWidth : 0),
					y: $Crop.offsetTop + ($Crop.resize & 1 ? $Crop.offsetHeight : 0)
				}
			} else {
				$Crop.move = 1
				$xy = {
					x: x - $Crop.offsetLeft,
					y: y - $Crop.offsetTop
				}
			}
		}
		if (!$Shadow)
			$Shadow = param.holder.append ("shadow").rect (... imgRect ())
		return true
	}
	let mouse_up = e => {
		if (!$xy)
			return
		preview ()
		$Crop.move = $Crop.resize = 0
		$xy = null
	}
	let mouse_move = e => {
		if (!$xy) {
			if (e.$ == $Crop) {
				let b = e.$.border (e.pageX, e.pageY)
				if (e.$.cur)
					e.$.classList.remove (e.$.cur)
				if ($CUR [b])
					e.$.classList.add (e.$.cur = $CUR [b])
			}
			return
		}
		if ($Crop.move) {
			let x = (e.pageX - $xy.x).clamp ($Img.offsetLeft, $Img.offsetLeft + $Img.offsetWidth - $Crop.offsetWidth)
			let y = (e.pageY - $xy.y).clamp ($Img.offsetTop, $Img.offsetTop + $Img.offsetHeight - $Crop.offsetHeight)
			let w = $Crop.offsetWidth
			let h = $Crop.offsetHeight
			crop (x, y, w, h)
		} else {
			let r = param.holder.rect ()
			let crx = !$Crop.resize || $Crop.resize & 0xa
			let cry = !$Crop.resize || $Crop.resize & 0x5
			let x = $xy.x
			let y = $xy.y
			let w0 = crx ? clamp_x (e.pageX - r.x) - x : $Crop.offsetWidth
			let h0 = cry ? clamp_y (e.pageY - r.y) - y : $Crop.offsetHeight
			let w = w0 < 0 ? -w0 : w0
			let h = h0 < 0 ? -h0 : h0
			if (e.shiftKey && $SQ [$Crop.resize])
				w = h = Math.min (w, h)
			if (crx && w0 < 0)
				x -= w
			if (cry && h0 < 0)
				y -= h
			crop (x, y, w, h)
		}
		if ($Area) {
			$Context.imageSmoothingEnabled = 0
			$Context.clearRect (0, 0, param.pw, param.ph)
			$Context.drawImage ($Img, $Area.sx, $Area.sy, $Area.sw, $Area.sh, 0, 0, param.pw, param.ph)
		}
	}
	let drag = function ( e ) {
		if ($Busy)
			return false
		if (e.type == "dragover")
			e.dataTransfer.dropEffect = "copy"
		else if (e.type == "drop")
			upload (e.dataTransfer.files [0])
		return e.stop ()
	}
	let win_resize = function ( e ) {
		if (!$Crop)
			return
		$Crop.img.width = $Img.width
		$Crop.img.height = $Img.height
		if (!$Canvas.crop)
			return
		win.cancelAnimationFrame ($Crop.ani)
		$Crop.ani = win.requestAnimationFrame (() => {
			$Shadow.rect (... imgRect ())
			let z = $Img.offsetWidth / $Rect [2]
			let x = ($xywh.x - $Rect [0]) * z + $Img.offsetLeft
			let y = ($xywh.y - $Rect [1]) * z + $Img.offsetTop
			let w = $xywh.w * z
			let h = $xywh.h * z
			crop0 (x, y, w, h)
		}, 100)

	}

	let touch = new august_touch (param.holder, {
		start:	mouse_down,
		move:	mouse_move,
		end:	mouse_up
	})
	param.holder.on ("mousedown", mouse_down)
		.on ("dblclick", full)
		.on ("dragstart", drag)
		.on ("dragover", drag)
		.on ("drop", drag)
	doc.documentElement.on ("mouseup", mouse_up)
		.on ("mousemove", mouse_move)
	win.addEventListener ("resize", win_resize)

	function imgLoaded () {
		if (!$Canvas) {
			$Canvas = param.preview.append ("canvas")
			$Context = $Canvas.getContext ("2d")
			if (param.get) {
				$Canvas.onclick = function () {
					param.get (this)
				}
			}
		}
		if (!$Crop) {
			$Crop = param.holder.append ("crop")
			$Crop.img = $Crop.append ("img")
			$Crop.border = function ( x, y ) {
				return (this.rt.contains (x, y) ? 1 : 0)
					| (this.rr.contains (x, y) ? 2 : 0)
					| (this.rb.contains (x, y) ? 4 : 0)
					| (this.rl.contains (x, y) ? 8 : 0)
			}
		}
		$Crop.img.src = this.src
		$Crop.img.width = this.width
		$Crop.img.height = this.height
		$Canvas.width = param.pw
		$Canvas.height = param.ph
	}
	function imgError ( n ) {
		cleanup ()
		param?.error (1, n)
	}
	function imgRect () {
		return [$Img.offsetLeft, $Img.offsetTop, $Img.offsetWidth, $Img.offsetHeight]
	}
	function preview () {
		let w = $Crop.offsetWidth
		let h = $Crop.offsetHeight
		let z = $Img.naturalWidth / $Img.width
		if (w * z < (param.crop_mw || 50) || h * z < (param.crop_mh || 50))
			return reset ()
		let r = param.holder.rect ()
		let x = $Crop.offsetLeft + r.x | 0
		let y = $Crop.offsetTop + r.y | 0
		$Crop.className = "move"
		$Crop.rt = new august_rect (x - 4, y - 4, x + w + 4, y + 4)
		$Crop.rb = new august_rect (x - 4, y + h - 4, x + w + 4, y + h + 4)
		$Crop.rl = new august_rect (x - 4, y - 4, x + 4, y + h + 4)
		$Crop.rr = new august_rect (x + w - 4, y - 4, x + w + 4, y + h + 4)
		$Canvas.crop = AUGUST_IMG_LIB.resize ($Img, $Area, param.pw, param.ph, param?.smooth || 1)
		$Context.clearRect (0, 0, param.pw, param.ph)
		$Context.drawImage ($Canvas.crop, 0, 0, param.pw, param.ph)
		param?.ready (1)
	}
	function crop ( x, y, w, h ) {
		$Rect = imgRect ()
		$xywh = { x, y, w, h }
		crop0 (x, y, w, h)
	}
	function crop0 ( x, y, w, h ) {
		$Crop.rect (x, y, w, h).display ("block")
		x -= $Img.offsetLeft
		y -= $Img.offsetTop
		$Crop.img.pos (-x, -y).s ({ clip: `rect(${y + 1}px,${x + w - 1}px,${y + h - 1}px,${x + 1}px)`})
		$Area = AUGUST_IMG_LIB.area (x, y, $Img.naturalWidth / $Img.width, w, h, param.pw, param.ph)
	}
	function move ( dx, dw, dy, dh ) {
		if (!$Canvas || !$Canvas.crop)
			return
		if ($Crop.offsetWidth < 2 * -dw || $Crop.offsetHeight < 2 * -dh)
			return reset ()
		let x = clamp_x ($Crop.offsetLeft + dx)
		let y = clamp_y ($Crop.offsetTop + dy)
		let w = clamp_x ($Crop.offsetWidth + $Crop.offsetLeft + dw) - x
		let h = clamp_y ($Crop.offsetHeight + $Crop.offsetTop + dh) - y
		crop (x, y, w, h)
		preview ()
	}
	function full () {
		$Img.className = "shadow"
		crop (... imgRect ())
		preview ()
		mouse_down ({})
	}
	function reset () {
		param.holder.remove ($Shadow)
		$Context.filter = "none"
		$Context.clearRect (0, 0, $Canvas.width, $Canvas.height)
		$Crop.css ()
		$Crop.className = $Img.className = ""
		$Shadow = null
		delete $Canvas.crop
		param?.ready (0)
	}
	function cleanup () {
		if ($Img)
			win.URL.revokeObjectURL ($Img.src)
		param.holder.innerHTML = ""
		$Img = $Crop = $Shadow = null
	}
	function upload ( f, cb ) {
		if ($Crop)
			reset ()
		cleanup ()
		$Img = param.holder.append ("img")
		$Img.src = win.URL.createObjectURL (f)
		$Img.type = f.type
		$Img.onload = imgLoaded
		$Img.onerror = imgError.bind (null, f.name)
		$Img.on ("load", () => {
			cb && cb ()
			param.set_filename?.(f.name)
		}, { once: true })
	}
	function wrapper ( fn ) {
		if ($Canvas && $Canvas.crop && !busy (1)) {
			win.setTimeout (_ => {
				$Canvas.crop = fn ()
				$Context.clearRect (0, 0, param.pw, param.ph)
				$Context.drawImage ($Canvas.crop, 0, 0, param.pw, param.ph)
				busy (0)
				param?.ready (1)
			})
		}
	}
	function busy ( b ) {
		if (b && $Busy)
			return 1
		$Busy = b
		param?.busy (b)
		return 0
	}
	this.suspend = function () {
		$Busy = 1
	}
	this.resume = function () {
		$Busy = 0
	}
	this.full = function ( f ) {
		param?.ready (0)
		upload (f, full)
	}
	this.upload = function () {
		if ($Busy)
			return
		if (!$File) {
			$File = doc.body.append ("input", {
				type:	"file",
				accept:	"image/*"
			}).css ("position: absolute; top: -100%; height: 0; visibility: hidden")
		}
		$File.onchange = function () {
			upload (this.files [0])
			doc.body.remove (this)
			$File = null
		}
		$File.click ()
		param?.error (0)
	}
	this.rotate = function ( ccw ) {
		if (!$Img || busy (1))
			return
		reset ()
		let canvas = AUGUST_IMG_LIB.canvas ($Img.naturalHeight, $Img.naturalWidth)
		let ctx = canvas.getContext ("2d")
		ctx.rotate (ccw ? -Math.PI / 2 : Math.PI / 2)
		if (ccw)
			ctx.translate (-canvas.height, 0)
		else
			ctx.translate (0, -canvas.width)
		ctx.drawImage ($Img, 0, 0, $Img.naturalWidth, $Img.naturalHeight)
		win.URL.revokeObjectURL ($Img.src)
		canvas.toBlob (b => ($Img.src = win.URL.createObjectURL (b), busy (0)), "image/bmp")
	}
	this.expand = function ( d ) {
		move (-d, d, -d, d)
	}
	this.move_h = function ( d ) {
		move (d, d, 0, 0)
	}
	this.move_v = function ( d ) {
		move (0, 0, d, d)
	}
	this.filter = function ( ... a ) {
		wrapper (_ => AUGUST_IMG_LIB.filter ($Canvas.crop, ... a))
	}
	this.flip_h = function () {
		wrapper (_ => AUGUST_IMG_LIB.flip ($Canvas.crop))
	}
	this.flip_v = function () {
		wrapper (_ => AUGUST_IMG_LIB.flip ($Canvas.crop, 1))
	}
	this.set = function ( v ) {
		for (let n in v) {
			if (n == "brightness")
				$Brightness = v [n]
			else if (n == "contrast")
				$Contrast = v [n]
			else if (n == "saturate")
				$Saturate = v [n]
			else if (n == "blur")
				$Blur = v [n]
			else if (n == "invert")
				$Invert = v [n]
			else if (n == "huerotate")
				$HueRotate = v [n]
		}
		if ($Canvas && $Canvas.crop) {
			$Context.filter = `hue-rotate(${$HueRotate}deg) invert(${$Invert}%) blur(${$Blur}px) brightness(${$Brightness}%) contrast(${$Contrast}%) saturate(${$Saturate}%)`
			$Context.drawImage ($Canvas.crop, 0, 0, param.pw, param.ph)
			param?.ready (1)
		}
	}
	this.get = function () {
		if (param.get) {
			let ok = $Canvas && $Canvas.crop && $Img || null
			param.get (ok && $Canvas, ok && $Img.type)
		}
	}
	this.reset = function () {
		reset ()
	}
	this.done = function () {
		if ($Canvas) {
			param.preview.remove ($Canvas)
			$Canvas = null
		}
		cleanup ()
		touch.done ()
		param.holder.un ("mousedown", mouse_down)
			.un ("dblclick", full)
			.un ("dragstart", drag)
			.un ("dragover", drag)
			.un ("drop", drag)
		doc.documentElement.un ("mouseup", mouse_up)
			.un ("mousemove", mouse_move)
		win.removeEventListener ("resize", win_resize)
	}
}
