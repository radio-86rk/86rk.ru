//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: util-0.js


"use strict"

class util_0 {
	constructor ( root, node ) {
		let ready = r => {
			node.$("cropper").setClass ("ready", r)
			if (r)
				return this.Cropper.get ()
			this.reset ()
			this.Cropper.bri && this.Cropper.bri.set (50)
			this.Cropper.con && this.Cropper.con.set (50)
			this.Cropper.sat && this.Cropper.sat.set (50)
			this.Cropper.blu && this.Cropper.blu.set (0)
			this.Cropper.inv && this.Cropper.inv.set (0)
			this.Cropper.hue && this.Cropper.hue.set (0)
		}
		let busy = s => {
			root.busy (s)
			node.$("cropper").setClass ("busy", s)
		}
		let error = ( e, n ) => {
			if (e) {
				root.load_error (n)
				this.FileName = void 0
			}
		}
		let set_filename = fn => {
			this.FileName = fn
		}

		this.root = root
		this.node = node
		return new Promise (async resolve => {
			root.busy ()
			await new Promise (( resolve, reject ) => {
				August.loadCSS (window, `../css/cropper.css?${root.august_version}#`, false, () => {
					resolve ()
				}, () => {
					reject (new FileLoadError ("cropper.css"))
				})
			}).then (async () => {
				await August.loadJS ("../../js/august.cropper.js", window, root.august_version)
					.catch (() => {
						throw new FileLoadError ("august.cropper.js")
					})
			}).then (() => {
				let holder = node.$("crop-holder")
				let preview = node.$("crop-preview")
				this.Cropper = new august_cropper ({
					holder,
					preview,
					ready,
					busy,
					error,
					set_filename,
					get:		this.set_img.bind (this),
					pw:		preview.clientWidth,
					ph:		preview.clientHeight,
					crop_mw:	10,
					crop_mh:	10,
					smooth:		0
				})
				let sl_bri = node.$("#cropper_slider_bri")
				let sl_con = node.$("#cropper_slider_con")
				let sl_sat = node.$("#cropper_slider_sat")
				let sl_blu = node.$("#cropper_slider_blu")
				let sl_inv = node.$("#cropper_slider_inv")
				let sl_hue = node.$("#cropper_slider_hue")
				let sl_thr0 = node.$("#srceen_slider_threshold")
				let sl_thr1 = node.$("#srceen_slider_threshold_gray")
				this.Cropper.bri = sl_bri && new august_slider (sl_bri, v => {
					this.Cropper.set ({ brightness: v += 50 })
					$0(node.$("#cropper_bri_val"), `${v}%`)
				})
				this.Cropper.con = sl_con && new august_slider (sl_con, v => {
					this.Cropper.set ({ contrast: v += 50 })
					$0(node.$("#cropper_con_val"), `${v}%`)
				})
				this.Cropper.sat = sl_sat && new august_slider (sl_sat, v => {
					this.Cropper.set ({ saturate: v *= 2 })
					$0(node.$("#cropper_sat_val"), `${v}%`)
				})
				this.Cropper.blu = sl_blu && new august_slider (sl_blu, v => {
					this.Cropper.set ({ blur: v / 10 })
					$0(node.$("#cropper_blu_val"), v)
				})
				this.Cropper.inv = sl_inv && new august_slider (sl_inv, v => {
					this.Cropper.set ({ invert: v })
					$0(node.$("#cropper_inv_val"), `${v}%`)
				})
				this.Cropper.hue = sl_hue && new august_slider (sl_hue, v => {
					this.Cropper.set ({ huerotate: v *= 3.6 })
					$0(node.$("#cropper_hue_val"), `${v.locale ()}&deg;`)
				})

				this.SlideShow = new util_0_slideshow (this)
				this.Screen = AUGUST_IMG_LIB.canvas (0, 0)
				this.img = AUGUST_IMG_LIB.canvas (0, 0)
				this.img_ctx = this.img.getContext ("2d", { willReadFrequently: true })
				node.$("rk-screen").append (this.Screen)
				this.ThresholdWhite = sl_thr0 && new august_slider (sl_thr0, v => {
					if (!v.set)
						this.screen ()
					$0(node.$("#srceen_threshold_val"), v)
				})
				this.ThresholdGray = sl_thr1 && new august_slider (sl_thr1, v => {
					if (!v.set)
						this.screen ()
					$0(node.$("#srceen_threshold_gray_val"), v)
				})
				this.RadioRes = root.radio_cb ("screen_res", 0, v => this.resolution (+v))
				root.radio_cb ("download_type", 0, v => this.Type = +v)
				root.checkbox_cb ("slideshow", v => this.SlideShowOn = +v)
				root.checkbox_cb ("slideshow_auto", v => this.SlideShowAuto = +v)
				root.slider_cb ("slideshow_delay", 2, 10, v => {
					this.SlideShowDelay = v + 1
					$0(node.$("#slideshow_delay_val"), v + 1)
				})
				this.ThresholdWhite && this.ThresholdWhite.set (50)
				this.ThresholdGray && this.ThresholdGray.set (100)
			}).catch (e => {
				if (isType (e, FileLoadError))
					root.load_error (e.message)
				else 
					root.error (e.message)
			})
			root.busy ()
			resolve (this)
		})
	}
	done () {
		this.Cropper.done ()
		this.SlideShow.done ()
	}
	keydown ( e ) {
		let cropper = this.root.app.$("app-utils").hasClass ("cropper")
		if (e.shiftKey) switch (e.keyCode) {
		} else if (e.ctrlKey) switch (e.keyCode) {
			case 49:
			case 50:
				this.RadioRes.set (e.keyCode - 49)
				break
			case 38:  //  up
				this.SlideShow.move_up ()
				break
			case 40:  //  down
				this.SlideShow.move_down ()
				break
			case 37:  //  left
				this.SlideShow.prev ()
				break
			case 39:  //  right
				this.SlideShow.next ()
				break
			case 45:  //  Insert
				this.SlideShow.add ()
				break
			case 46:  //  Delete
				this.SlideShow.del ()
				break
			case 109:  //  Num Pad -
				if (cropper)
					this.Cropper.expand (-10)
				break
			case 107:  //  Num Pad +
				if (cropper)
					this.Cropper.expand (10)
				break
		} else if (e.altKey) switch (e.keyCode) {
		} else switch (e.keyCode) {
			case 38:  //  up
				if (cropper)
					this.Cropper.move_v (-10)
				break
			case 40:  //  down
				if (cropper)
					this.Cropper.move_v (10)
				break
			case 37:  //  left
				if (cropper)
					this.Cropper.move_h (-10)
				break
			case 39:  //  right
				if (cropper)
					this.Cropper.move_h (10)
				break
			case 109:  //  Num Pad -
				if (cropper)
					this.Cropper.expand (-10)
				break
			case 107:  //  Num Pad +
				if (cropper)
					this.Cropper.expand (10)
				break
			case 67:  //  C
			case 83:  //  S
				this.root.app.$("app-utils").setClass ("cropper", e.keyCode == 67)
				break
			case 82:  //  R
				if (cropper)
					this.Cropper.reset ()
				break
			default:
				return true
		}
		e.stop ()
	}
	click_handler ( a, el ) {
		switch (a) {
			case "cropper_upload":
				return this.Cropper.upload ()
			case "cropper_rotate90":
				return this.Cropper.rotate (0)
			case "cropper_rotate270":
				return this.Cropper.rotate (1)
			case "cropper_filter": {
				let m = el.attr ("matrix")
				if (m !== null) {
					m = m.split (",").map (a => +a)
					if (m.length == 9)
						this.Cropper.filter ([m.slice (0, 3), m.slice (3, 6), m.slice (6, 9)], +el.attr ("div"), +el.attr ("offs"))
				}
				break
			}
			case "cropper_flip_h":
				return this.Cropper.flip_h ()
			case "cropper_flip_v":
				return this.Cropper.flip_v ()
			case "cropper_expand":
				return this.Cropper.expand (+el.attr ("expand"))
			case "cropper":
			case "screen":
				return this.root.app.$("app-utils").setClass ("cropper", a == "cropper")
			case "screen_upload":
				return this.root.FileOpen.click ()
			case "screen_download":
				return this.download ()
			case "slideshow_add":
				return this.SlideShow.add ()
			case "slideshow_del":
				return this.SlideShow.del ()
			case "slideshow_move_up":
				return this.SlideShow.move_up ()
			case "slideshow_move_down":
				return this.SlideShow.move_down ()
			case "slideshow_prev":
				return this.SlideShow.prev ()
			case "slideshow_next":
				return this.SlideShow.next ()
		}
	}
	set_state ( s ) {
		this.FileName = s.file
		this.SrcImg = s.img
		this.ThresholdWhite.set (s.thr0)
		this.ThresholdGray.set (s.thr1)
		this.RadioRes.set (s.res)
	}
	set_img ( img ) {
		this.SrcImg = img
		if (img) {
			this.img_scale ()
			this.node.$("#slideshow_num").textContent = "--"
		}
	}
	get_img () {
		return this.SrcImg
	}
	resolution ( v ) {
		let r = util_0.RESOLUTION [v]
		this.Apogey = v
		this.Screen.width = this.img.width = r.w
		this.Screen.height = this.img.height = r.h
		this.img_scale ()
	}
	img_scale () {
		if (!this.SrcImg)
			return
		this.img_ctx.filter = "grayscale(1)"
		this.img_ctx.imageSmoothingEnabled = 0
		this.img_ctx.clearRect (0, 0, this.img.width, this.img.height)
		this.img_ctx.drawImage (this.SrcImg, 0, 0, this.img.width, this.img.height)
		this.screen ()
	}
	screen () {
		let ctx = this.Screen.getContext ("2d")
		let out = ctx.createImageData (this.Screen.width, this.Screen.height)
		let src = this.img_ctx.getImageData (0, 0, this.Screen.width, this.Screen.height).data
		let dst = out.data
		let thr0 = this.ThresholdWhite.get () * 255 / 100
		let thr1 = this.ThresholdGray.get () * 255 / 100
		for (let i = 0; i < dst.length; i += 4) {
			dst [i] = dst [i + 1] = dst [i + 2] = (src [i] < thr0 ? src [i] < thr1 ? 0 : 0.5 : 1) * 255 | 0
			dst [i + 3] = 255
		}
		ctx.putImageData (out, 0, 0)
	}
	reset () {
		let ctx = this.Screen.getContext ("2d")
		ctx.fillStyle = "#000"
		ctx.fillRect (0, 0, this.Screen.width, this.Screen.height)
	}
	upload ( file ) {
		this.Cropper.full (file)
	}
	download () {
		if (!this.FileName)
			return
		let get_picture = ( packed = 0 ) => {
			let scr = util_0.SCREEN_SIZE [this.Apogey]
			let data = this.Screen.getContext ("2d").getImageData (0, 0, this.Screen.width, this.Screen.height).data
			let f = this.Apogey ? 3 : 2
			let h = this.Screen.width * 4
			let p = new Uint8Array (scr.w * scr.h)
			let pi = scr.py * scr.w + scr.px
			let sw = this.Screen.width / f
			let char = this.Apogey
				? i => (data [i] & 0x01) | (data [i + 4] & 0x02) | (data [i + 8] & 0x04)
					| (data [i + h] & 0x08) | (data [i + h + 4] & 0x10) | (data [i + h + 8] & 0x20)
				: i => util_0.RK_PIXEL [
					(data [i] & 0x01) | (data [i + 4] & 0x02)
					| (data [i + h] & 0x04) | (data [i + h + 4] & 0x08)
				]
			for (let i = 0, w = 0, s = 4 * f; i < data.length; i += s) {
				p [pi++] = char (i)
				if (++w == sw) {
					pi += scr.w - sw
					i += sw * s
					w = 0
				}
			}
			return packed
				? this.root.pack2 (this.root.pack_rle (p), 4, [this.Apogey, scr.w, scr.h])
				: p
		}

		if (this.Type == 0)
			return this.root.download_fn (`${this.FileName}.dat`, get_picture ())

		let v = this.root.get_code (util_0.VIEWER)
		let ss = this.SlideShow.size ()
		if (!ss || !this.SlideShowOn) {
			let p = get_picture (1)
			let h = Uint8Array.from ([0, 1, (4).b0, (4).b1])
			let s = p.length + h.length
			v [v.length - 2] = s.b0
			v [v.length - 1] = s.b1
			return this.root.download_rk (0, this.FileName, [v, h, p])
		}
		let d = []
		let h = [this.SlideShowAuto ? this.SlideShowDelay : 0, ss]
		let hp = 2 + 2 * ss
		for (let i = 0; i < ss; i++) {
			this.SlideShow.set (i)
			d.push (get_picture (1))
			h.push (hp.b0, hp.b1)
			hp += d.last ().length
		}
		v [v.length - 2] = hp.b0
		v [v.length - 1] = hp.b1
		d.unshift (Uint8Array.from (h))
		d.unshift (v)
		this.root.download_rk (0, `slideshow-${ss}`, d)
	}

	static RK_PIXEL = [
		0x00, 0x01, 0x02, 0x03, 0x10, 0x11, 0x12, 0x13,
		0x04, 0x05, 0x06, 0x07, 0x14, 0x15, 0x16, 0x17
	]
	static RESOLUTION = [
		{ w: 128, h: 60 },
		{ w: 192, h: 104 }
	]
	static SCREEN_SIZE = [
		{
			w: 78,
			h: 38,
			px: 8,
			py: 4
		},
		{
			w: 78,
			h: 64,
			px: 8,
			py: 6
		}
	]
	static VIEWER = "IQAAIugCOSLuAg4EIa4C+cNQAA3CTAAq7gL5IScAzRj4zQP4wwD4bmUgdWRhbG9zeCBvcHJlZG"
			+ "VsaXR4IGtvbmZpZ3VyYWNpYA0KANHR0dHR4SJWACoAABl8tcITAOEi3gLhIuAC4SLiAuEi5A"
			+ "Iq7gL5Af//zZQCKvICEfQCGSLyAiGCAOUh9gI66wJfFgAZGV4jViH0AhnlzRcB4Tr0AqfK0g"
			+ "BeHRE8AMquAB4yzZ4C6yreAk1EAwohvADNEvinwtUACuYgyrwAG3qzwrwAwwYBIdUAzQP4/h"
			+ "vK7QD+CMr1AP4YygYB/iDKBgHpzS348yriAuk69QI9TzrrAj3yAgF5MusCyTr1Ak866wI8ud"
			+ "oTAa8y6wLJEWEB1UYjViNeIwUGBMopAQYIOugCq0866QKqsU866gKoscjF5dWvT3pRzZ4C68"
			+ "0w+HErG3qzwkgBI9HNMwLh8Q8P5gHlKuQC48nrKvIC682SASrmAusq8gLDdQESEwt4F9h+I6"
			+ "fycwHmf8YDC8VPfiMSEw3CiAHBw3UB5SEAADki7gLhTiNGI34jIvAChW+MlWfrxfkzMyEA/s"
			+ "O4AX3GD28aJPrEARMm/g8PDw/mD/4PyrQBheUq8AKFb4yVZ27jMzMzLgALeLHCuAEq7gL5wc"
			+ "nzp8j7yXx0b3QgcmV2aW0gbmUgcG9kZGVydml3YWV0c3EAp8jNMPgBJAk2ACsLeLHCEgIj5R"
			+ "EOBBkR7QEadyMTp8IkAuHRER5OBgrlIuYC6yLoAut4MuoCKt4CIzYAK3o99gB3ez32AHcFeA"
			+ "cHBwewdw5A/ojaYgIOwD5Wkh89sXcjNiflehYAzZ4CK+vhfn7mIMp3AsEq4AIuCDaALgRxcC"
			+ "xzevZAdy4INqTJKt4CIzaAK3FwySEAAKfIH9KoAhnrKevDoQIxiTz4AMAA4Gz4CgIxiUr4AM"
			+ "AA4Gz4QvgwGVL4APYA92z4QvgxHjz4AO8A8HX46AEAAAAAAAAAAAAAAAAAAAAAAAAAAP//"
}

class util_0_slideshow {
	constructor ( root ) {
		this.root = root
	}
	done () {
		this.List.clear ()
	}
	info () {
		this.root.node.$("#slideshow_num").textContent = this.cur ()
		this.root.node.$("#slideshow_size").textContent = this.size ()
	}
	add () {
		let img = this.root.get_img ()
		if (!img)
			return
		if (this.List.length == util_0_slideshow.SIZE_MAX)
			return this.root.root.error (this.root.root.CFG.ERROR.TOO_MANY_PICTURES)

		let c = AUGUST_IMG_LIB.canvas (img.width, img.height)
		c.getContext ("2d").drawImage (img, 0, 0, img.width, img.height)
		this.Ptr = this.List.length
		this.List.push ({
			img:	c,
			res:	this.root.Apogey,
			thr0:	this.root.ThresholdWhite.get (),
			thr1:	this.root.ThresholdGray.get (),
			file:	this.root.FileName
		})
		this.info ()
	}
	del () {
		if (!this.List.length)
			return
		if (this.Ptr < this.List.length)
			this.List.delete (this.Ptr)
		let item = this.List [this.Ptr < this.List.length || !this.Ptr ? this.Ptr : --this.Ptr]
		this.info ()
		if (item)
			this.root.set_state (item)
		else
			this.root.Cropper.get ()
	}
	move_up () {
		if (this.Ptr != 0 && this.Ptr < this.List.length) {
			[this.List [this.Ptr - 1], this.List [this.Ptr]] =
				[this.List [this.Ptr], this.List [this.Ptr - 1]]
			this.Ptr--
			this.info ()
		}
	}
	move_down () {
		if (this.Ptr + 1 < this.List.length) {
			[this.List [this.Ptr + 1], this.List [this.Ptr]] =
				[this.List [this.Ptr], this.List [this.Ptr + 1]]
			this.Ptr++
			this.info ()
		}
	}
	prev () {
		if (this.Ptr != 0) {
			this.root.set_state (this.List [--this.Ptr])
			this.info ()
		}
	}
	next () {
		if (this.Ptr + 1 < this.List.length) {
			this.root.set_state (this.List [++this.Ptr])
			this.info ()
		}
	}
	set ( idx ) {
		this.root.set_state (this.List [idx])
	}
	cur () {
		return this.List.length ? this.Ptr + 1 : 0
	}
	size () {
		return this.List.length
	}

	Ptr = 0
	List = []

	static SIZE_MAX = 20
}

