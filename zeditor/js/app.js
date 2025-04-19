//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


"use strict"

class zeditor extends app {
	init () {
		let self = this

		let csh = this.$("custom_size_height")
		if (csh) {
			for (let h = 2; h < 16; h++)
				August.form.$option (csh, h, h)
		}
		for (let s of zeditor.FONT_SIZE)
			this.add_font_size (s)
		this.CUSTOM_SIZE = app.deserialize (this.STORAGE ("custom_size") || "[]")
		for (let s of this.CUSTOM_SIZE)
			this.add_font_size (s)
		this.init_custom_size ()
		this.mouse_bind = this.mouse.bind (this)
		this.app.on ("wheel", this.mouse_bind, { passive: false })

		onmousemove = function ( e ) {
			self.mouse (e)
		}
		onresize = function ( e ) {
			self.redraw ()
		}
		this.$("table").onclick = function ( e ) {
			let ch = e.$.idx
			if (isSet (ch) && ch < self.TableSize) {
				let ch1 = self.File.Char
				self.set_char (ch)
				if (e.shiftKey)
					self.select (ch1, ch)
			}
		}
		this.$("font_size").onchange = function ( e ) {
			let o = this [this.selectedIndex]
			let s = { w: +o.dataset.width, h: +o.dataset.height }
			self.File.Cur = { x: 0, y: 0 }
			if (+o.dataset.conv)
				self.convert_font (s)
			self.set_font (s)
			self.out ()
			self.redraw ()
		}
		this.$("table_size").onchange = function ( e ) {
			self.set_table (+this.value)
		}
		this.$("type").onchange = function ( e ) {
			self.File.Reverse = +this.value
			self.File.Blank = +this.value ? 0xFF : 0
			self.out_table ()
			self.out ()
		}

		this.set_txt ("tpl_char_by_char", this.$("tpl_char_by_char_def").textContent.trim ())
		this.set_txt ("tpl_line_by_line", this.$("tpl_line_by_line_def").textContent.trim ())
		this.set_txt ("tpl_filename_format0", zeditor.FILENAME_TPL)
		this.set_txt ("tpl_filename_format1", zeditor.FILENAME_TPL)
		this.set_txt ("tpl_new_fontname", zeditor.NEW_FONTNAME_TPL)
		this.checkbox_cb ("hex_code", v => this.app.setClass ("hex-code", v))
		this.radio_cb ("png_type", 0, v => this.PNG = +v)
		this.radio_cb ("png_size", 1, v => this.PNG_SIZE = +v)
		this.radio_cb ("filename_format", 1, v => this.FF = +v)
		this.set_txt ("inp_demo_str", zeditor.DEMO_STR, v => {
			if (this.File) {
				this.init_demo_str ()
				this.out_demo_str ()
			}
		})
		this.checkbox_cb ("double_size_demo", v => {
			this.DSD = v
			if (this.File) {
				this.init_demo ()
				this.out_demo_str ()
				this.out ()
			}
		})
		this.checkbox_cb ("inverted_demo_str", v => {
			this.IDS = v
			if (this.File)
				this.out_demo_str ()
		})
		this.radio_cb ("codepage", "CP437", v => {
			this.SCP = v
			if (this.File) {
				this.init_demo_str ()
				this.out_demo_str ()
				this.sample_char ()
			}
		})

		this.init_color ()
		this.init_table ()
		this.init_demo_str ()
		super.init (".bin, .fnt, .png, .gif, .jpg, .wepb, .bmp", f => {
			f.Table = new byteArray (f.Table)
		})
		this.redraw ()
	}
	done () {
		this.STORAGE ("custom_size", app.serialize (this.CUSTOM_SIZE))
		this.app.un ("wheel", this.mouse_bind, { passive: false })
		onresize = onmousemove = null
		this.SIZE = 0
		this.File.Cur = { ... this.Cur }
		for (let f of this.Files)
			delete f.History
		super.done ()
	}
	init_color () {
		let ch = this.$("char").getStyleList ()
		this.FOREGROUND = ch.color
		this.BACKGROUND = ch.backgroundColor
	}
	init_table () {
		let t = this.$("table")
		for (let i = 0; i < 256; i++)
			t.append ("div", { idx: i }).attr ("code", i.HEX ())
		let ctx = t.append ("canvas").getContext ("2d")
	}
	init_matrix () {
		let s = this.File.Size
		let n = s.w * s.h
		let m = this.$("matrix")
		let b = s.w * s.h - s.w
		m.innerHTML = ""
		for (let i = 0; i < n; i++) {
			let d = m.append ("div", { idx: i })
			if (i % s.w == s.w - 1)
				d.setClass ("br0", 1)
			if (i >= b)
				d.setClass ("bb0", 1)
		}
		m.props ({
			"--width":	s.w,
			"--height":	s.h
		})
		this.cursor ()
	}
	init_demo () {
		let s = this.File.Size
		let c = this.$("demo_char")
		c.width = c.offsetWidth
		c.height = 3 * s.h
		let ctx = c.getContext ("2d")
		ctx.fillStyle = this.BACKGROUND
		ctx.fillRect (0, 0, c.width, c.height)
		this.CTX_demo_char = ctx
	}
	init_demo_str () {
		let str = this.$("inp_demo_str").value
		this.DemoStr = []
		this.MapDemoStr = new Map
		if (!str.length)
			return
		if (!isSet (this.XLAT [this.SCP])) {
			let xlat = {}
			let scp = zeditor [this.SCP]
			for (let i = 0; i < scp.length; i++)
				xlat [scp [i] || i] = i
			this.XLAT [this.SCP] = xlat
		}
		for (let ch of str) {
			let c = this.XLAT [this.SCP][ch.codePointAt (0)]
			let p = this.MapDemoStr.get (c) || []
			p.push (this.DemoStr.length)
			this.MapDemoStr.set (c, p)
			this.DemoStr.push (c)
		}
	}
	init_custom_size () {
		if (!this.$("custom_size"))
			return
		let self = this
		this.$("custom_size").innerHTML = this.$("tpl_custom_size").textContent.pattern ([{
			WIDTH	() { return this.$x.w },
			HEIGHT	() { return this.$x.h },
			IDX	() { return this.$i },
			$size	() { return self.CUSTOM_SIZE.length },
			$set	() { this.$x = self.CUSTOM_SIZE [this.$i] }
		}]).trim ()
	}
	add_size ( s ) {
		if (!this.FONT.has (`${s.w}x${s.h}`)) {
			this.CUSTOM_SIZE.push (s)
			this.CUSTOM_SIZE.sort (( a, b ) => a.w - b.w || a.h - b.h)
			this.add_font_size (s)
			this.init_custom_size ()
		}
	}
	add_font_size ( s ) {
		let view = this.$("font_size").$("optgroup#view")
		let conv = this.$("font_size").$("optgroup#conv")
		let o1 = view.append ("option", {
			text:	`${s.w}x${s.h}`,
			value:	`${s.w}x${s.h}`
		})
		let o2 = conv.append ("option", {
			text:	o1.text,
			value:	o1.text
		})
		o1.dataset.width = o2.dataset.width = s.w
		o1.dataset.height = o2.dataset.height = s.h
		o2.dataset.conv = 1
		this.FONT.add (o1.text)
	}
	redraw () {
		let t = this.$("table")
		let d = t.first ()
		let _ = (d.offsetWidth << 16) + d.offsetHeight
		if (this.SIZE && this.SIZE != _)
			this.out_table ()
		this.SIZE = _
	}
	redesign () {
		super.redesign ()
		this.init_color ()
		this.init_demo ()
		this.out_table ()
	}
	history ( cmd ) {
		this.File.History.length = this.File.History.ptr
		let l = this.File.History.last ()
		let h = { cmd: cmd.cmd || cmd }
		if (cmd == "table") {
			if (isSet (l) && l.cmd == cmd && l.Table.equ (this.File.Table))
				return false
			h.Table = new byteArray (this.File.Table)
			h.Char = this.File.Char
			h.Size = this.File.Size
			h.Select = this.File.Select
			h.Reverse = this.File.Reverse
			h.TableSize = this.TableSize
		} else {
			if (isSet (l) && l.cmd == "table")
				return this.history ("table".set ("cmd", cmd))
			if (isSet (l) && l.Char === this.File.Char && !l.fix) {
				if (cmd.last == l.cmd)
					return l.cmd = cmd, false
				if (cmd.fix)
					l.fix = cmd.fix
				else if (cmd == l.cmd.toString ())
					return false
			}
			let s = this.File.Size
			let i = s.h * this.File.Char
			h.CharData = this.File.Table.slice (i, i + s.h)
			h.Char = this.File.Char
			h.Cur = { ... this.Cur }
			if (isSet (l) && isSet (l.Char) && l.Char != this.File.Char) {
				let i = s.h * l.Char
				h.PrevCharData = this.File.Table.slice (i, i + s.h)
				h.PrevChar = l.Char
			}
		}
		this.File.History.push (h)
		this.File.History.ptr++
		return true
	}
	do_history ( h ) {
		if (isSet (h.Table)) {
			this.File.Table = new byteArray (h.Table)
			this.File.Reverse = h.Reverse
			this.File.Blank = h.Reverse ? 0xFF : 0
			this.TableSize = h.TableSize
			if (this.File.Size.w == h.Size.w && this.File.Size.h == h.Size.h)
				this.out_table ()
			else
				this.set_font (h.Size)
			this.set_char (h.Char)
			if (h.Select)
				this.select (h.Select.Begin, h.Select.End)
			this.$("table_size").value = h.TableSize
			this.$("type").value = h.Reverse
		} else {
			let s = this.File.Size
			let i = s.h * h.Char
			for (let d of h.CharData)
				this.File.Table [i++] = d
			if (isSet (h.PrevChar)) {
				let i = s.h * h.PrevChar
				for (let d of h.PrevCharData)
					this.File.Table [i++] = d
				this.set_char (h.PrevChar, -1)
			}
			this.cursor ()
			this.Cur = { ... h.Cur }
			this.cursor ()
			this.set_char (h.Char, -1)
		}
	}
	undo () {
		let h = this.File.History
		if (!h.ptr)
			return
		if (h.length == h.ptr && this.history (h.last ().cmd.set ("fix")))
			h.ptr--
		this.do_history (h [--h.ptr])
	}
	redo () {
		let h = this.File.History
		if (h.length == h.ptr)
			return
		this.do_history (h [++h.ptr])
		if (h.length == h.ptr + 1)
			h.length--
	}
	empty_page () {
		this.empty_file ()
	}
	empty_file () {
		this.add_file (
			this.new_file_name ("tpl_new_fontname"),
			new byteArray (256 * 8).fill (0xFF),
			{ w: 8, h: 8 },
			1
		)
		this.File.New = 1
	}
	add_file ( FileName, Table, Size, Reverse ) {
		let idx = this.Files.length
		this.Files.push ({
			FileName:	FileName,
			Table:		Table,
			Size:		Size,
			Char:		0,
			Edited:		0,
			Reverse:	+Reverse,
			Blank:		+Reverse * 0xFF
		})
		this.add_size (Size)
		this.add_file_list (idx, FileName)
		this.set_file (idx)
	}
	add_files ( Count, FileName, Table, Size, Reverse ) {
		if (Count == 1)
			return this.add_file (FileName, Table, Size, Reverse)
		let idx = this.Files.length
		let s = Table.length / Count
		for (let i = 0; i < Count; i++) {
			this.add_file (
				FileName.replace (/(\.\w+)?$/,`.${i + 1}$1`),
				Table.slice (i * s, i * s + s),
				Size,
				Reverse
			)
		}
		this.set_file (idx)
	}
	set_file ( idx ) {
		if (this.File) {
			this.remove_select (1)
			this.$("table").el (this.File.Char).setClass ("cur", 0)
			this.File.Cur = { ... this.Cur }
		}
		this.File = this.Files [idx]
		if (!this.File)
			return this.Files.length ? this.set_file (0) : this.empty_file ()
		if (!this.File.Cur)
			this.File.Cur = { x: 0, y: 0 }
		if (this.File.Select)
			this.select (this.File.Select.Begin, this.File.Select.End)
		if (!this.File.History) {
			this.File.History = []
			this.File.History.ptr = 0
		}
		this.set_font (this.File.Size)
		this.set_char (this.File.Char)
		super.set_file (idx)
		this.$("type").value = this.File.Reverse
	}
	set_font ( s ) {
		this.File.Size = s
		this.TableSize = Math.max (Math.min (this.File.Table.length / this.File.Size.h, 256), 128)
		this.Cur = { ... this.File.Cur }
		this.init_matrix ()
		this.init_demo ()
		this.out_table ()
		this.$("font_size").value = `${s.w}x${s.h}`
		this.$("table_size").value = this.TableSize
	}
	set_table ( s ) {
		this.history ("table")
		if (this.TableSize < s) {
			let Table = new byteArray (s * this.File.Size.h)
			for (let i = 0; i < this.File.Table.length; i++)
				Table [i] = this.File.Table [i]
			for (let i = this.File.Table.length; i < Table.length; i++)
				Table [i] = this.File.Blank
			this.File.Table = Table
		} else {
			this.File.Table = this.File.Table.subarray (0, s * this.File.Size.h)
			if (s <= this.File.Char)
				this.set_char (0)
		}
		this.TableSize = s
		this.remove_select ()
		this.out_table ()
	}
	set_char ( ch, set ) {
		this.remove_select ()
		this.$("table").el (this.File.Char).setClass ("cur", 0)
		this.File.Char = ch
		this.out (set)
		this.$("table").el (this.File.Char).setClass ("cur", 1)
	}
	convert_font ( size ) {
		let Buffer = new byteArray (this.TableSize * size.h)
		this.convert ({
			size:	this.File.Size,
			char:	0,
			table:	this.File.Table,
			blank:	this.File.Blank
		}, {
			size:	size,
			char:	0,
			table:	Buffer,
			blank:	this.File.Blank
		}, this.TableSize)
		this.history ("table")
		this.File.Table = Buffer
	}
	convert ( from, to, len ) {
		let m = 0xFF << to.size.w
		for (let ch = 0; ch < len; ch++) {
			let b = (ch + from.char) * from.size.h
			let b2 = (ch + to.char) * to.size.h
			for (let i = 0; i < to.size.h; i++) {
				to.table [b2 + i] = i < from.size.h
					? (from.table [b + i] | m) ^ to.blank ^ from.blank
					: to.blank
			}
		}
	}
	do_select ( f ) {
		for (let ch = this.File.Select.Begin; ch <= this.File.Select.End; ch++)
			f (ch)
	}
	select ( ch1, ch2 ) {
		this.remove_select ()
		if (ch1 >= this.TableSize)
			ch1 = this.TableSize - 1
		if (ch2 >= this.TableSize)
			ch2 = this.TableSize - 1
		if (ch1 == ch2)
			return
		this.File.Select = {
			Begin:	Math.min (ch1, ch2),
			End:	Math.max (ch1, ch2)
		}
		let t = this.$("table")
		this.do_select (ch => t.el (ch).setClass ("sel", 1))
	}
	remove_select ( no_del ) {
		if (this.File.Select) {
			let t = this.$("table")
			this.do_select (ch => t.el (ch).setClass ("sel", 0))
			if (!no_del)
				delete this.File.Select
		}
	}
	shift ( ch, n, insert ) {
		this.history ("table")
		this.remove_select ()
		let s = this.File.Size
		if (n > 0) {
			for (let c = this.TableSize - 1; c > ch + n - 1; c--) {
				let b1 = (c - n) * s.h
				let b2 = c * s.h
				for (let i = 0; i < s.h; i++)
					this.File.Table [b2 + i] = this.File.Table [b1 + i]
			}
			if (insert) {
				this.convert ({
					table:	insert.Table,
					size:	insert.Size,
					char:	0,
					blank:	insert.Blank
				}, {
					table:	this.File.Table,
					size:	this.File.Size,
					char:	ch,
					blank:	this.File.Blank
				}, n)
			} else {
				for (let c = ch; c < ch + n && c < this.TableSize; c++) {
					let b = c * s.h
					for (let i = 0; i < s.h; i++)
						this.File.Table [b + i] = this.File.Blank
				}
			}
		} else {
			for (let c = ch; c < this.TableSize + n; c++) {
				let b1 = (c - n) * s.h
				let b2 = c * s.h
				for (let i = 0; i < s.h; i++)
					this.File.Table [b2 + i] = this.File.Table [b1 + i]
			}
			for (let c = 0; c < -n; c++) {
				let b = (this.TableSize + n + c) * s.h
				for (let i = 0; i < s.h; i++)
					this.File.Table [b + i] = this.File.Blank
			}
			if (insert)
				return this.shift (ch, insert.Len, insert)
		}
		this.out_table ()
		this.out ()
	}
	cursor ( cn = "cur", r ) {
		this.$("matrix").el (this.Cur.y * this.File.Size.w + this.Cur.x).setClass (cn, r)
	}
	dot_canvas ( ctx, xy, x0, d ) {
		let s = this.File.Size
		let f = this.DSD ? 2 : 1
		ctx.fillStyle = d ? this.BACKGROUND : this.FOREGROUND
		ctx.fillRect (
			(x0 + xy.x - s.w / 2) * f,
			ctx.canvas.height / 2 + (xy.y - s.h / 2) * f,
			f,
			f
		)
	}
	dot ( set, h ) {
		if (h)
			this.history (h)
		let s = this.File.Size
		let i = s.h * this.File.Char + this.Cur.y
		let m = 1 << s.w - this.Cur.x - 1
		let t = i < this.File.Table.length && this.File.Table
		if (t && set === 0)
			t [i] &= ~m
		else if (t && set === 1)
			t [i] |= m
		else if (t && set === 2)
			t [i] ^= m
		let d = t ? !(t [i] & m) ^ this.File.Reverse : this.File.Blank
		this.cursor ("dot", d)
		this.dot_canvas (this.CTX_demo_char, this.Cur, this.CTX_demo_char.canvas.width / (this.DSD ? 4 : 2), d)
		if (isSet (set)) {
			let c0 = this.$("table").first ()
			let w = Math.max (c0.offsetWidth, 2 * s.h)
			let h = Math.max (c0.offsetHeight, 2 * s.h)
			let ds = Math.max (h / Math.max (s.w, s.h) | 0, 2)
			this.$("table").last ().getContext ("2d")[d ? "clearRect" : "fillRect"] (
				(this.File.Char & 0x0F) * (w + 1) + (w - s.w * ds) / 2 + this.Cur.x * ds,
				(this.File.Char >> 4) * (h + 1) + (h - s.h * ds) / 2 + this.Cur.y * ds,
				ds,
				ds
			)
			let p = this.MapDemoStr.get (this.File.Char)
			if (p) for (let x of p) {
				this.dot_canvas (
					this.$("demo_str").firstChild.getContext ("2d"),
					this.Cur,
					x * s.w + s.w + s.w / 2,
					!d ^ this.IDS
				)
			}
		}
	}
	out_table () {
		let s = this.File.Size
		let t = this.$("table")
		let c0 = t.first ()
		let w = c0.offsetWidth
		let h = c0.offsetHeight
		let ws = t.clientWidth - w * 16
		let hs = t.clientHeight - w * 16
		let c = t.last ()
		let ctx = c.getContext ("2d")
		let ds = Math.max (h / Math.max (s.w, s.h) | 0, 2)
		c.css ("")
		if (h < 2 * s.h) {
			w = 2 * s.h
			h = 2 * s.h
			let z = t.clientHeight / (h * 16 + hs)
			let d = (h * 16 + hs) * (1 - z) / z / 2
			c.css (`transform: scale(${z}) translate(-${d}px, -${d}px)`)
		}
		c.width = w * 16 + ws
		c.height = h * 16 + hs
		ctx.fillStyle = this.BACKGROUND
		ctx.clearRect (0, 0, c.width, c.height)
		for (let idx = 0; idx < 256; idx++) {
			let tx = (idx & 0x0F) * (w + 1) + (w - s.w * ds) / 2
			let ty = (idx >> 4) * (h + 1) + (h - s.h * ds) / 2
			for (let y = 0; y < s.h; y++) {
				let i = s.h * idx + y
				let ch = i < this.File.Table.length
					? this.File.Table [i]
					: this.File.Blank
				for (let x = 0; x < s.w; x++) {
					if (!!(ch & (1 << s.w - x - 1)) ^ this.File.Reverse) {
						ctx.fillRect (
							tx + x * ds,
							ty + y * ds,
							ds,
							ds
						)
					}
				}
			}
		}
		this.app.setClass ("ts128", this.TableSize == 128)
		this.out_demo_str ()
	}
	out_demo_str () {
		let s = this.File.Size
		let d = this.$("demo_str")
		if (!d)
			return
		window.cancelAnimationFrame (d.ani)
		d.setHeight (3 * s.h)
		d.scrollLeft = 0
		if (!this.DemoStr.length) {
			d.innerHTML = ""
			return
		}
		let c = d.firstChild || d.append ("canvas")
		let ctx = c.getContext ("2d")
		c.width = Math.max ((this.DemoStr.length + 2) * s.w * (this.DSD ? 2 : 1), d.clientWidth)
		c.height = 3 * s.h
		ctx.fillStyle = this.IDS ? this.BACKGROUND : this.FOREGROUND
		ctx.fillRect (0, 0, c.width, c.height)

		let ox = s.w + s.w / 2
		let r = this.File.Reverse ^ this.IDS
		for (let ch of this.DemoStr) {
			for (let y = 0; y < s.h; y++) {
				let i = s.h * ch + y
				let t = isSet (ch) && i < this.File.Table.length ? this.File.Table [i] : this.File.Blank
				for (let x = 0; x < s.w; x++)
					this.dot_canvas (ctx, { x, y }, ox, !!(t & (1 << s.w - x - 1)) ^ r)
			}
			ox += s.w
		}
		if (d.clientWidth < c.width) {
			let s = -1
			let t = 50
			let ani = () => {
				d.ani = window.requestAnimationFrame (ani)
				if (--t)
					return
				let sl = d.scrollLeft
				d.scrollLeft += s
				if (d.scrollLeft == sl) {
					s = -s
					t = 50
				} else {
					t = 1
				}
			}
			ani ()
		}
	}
	out ( set ) {
		this.sample_char ()
		let Cur = { ... this.Cur }
		let s = this.File.Size
		for (let y = 0; y < s.h; y++) {
			this.Cur.y = y
			for (let x = 0; x < s.w; x++) {
				this.Cur.x = x
				this.dot (set)
			}
		}
		this.Cur = Cur
	}
	sample_char () {
		let c = zeditor [this.SCP][this.File.Char]
		let ch = String.fromCharCode (c === 0x20 || !isSet (c) ? 0xA0 : c === 0 ? this.File.Char : c)
		this.$("char").textContent = ch
		this.$("code").textContent = `0x${this.File.Char.HEX ()}`
	}
	async open_dialog () {
		if (this.Modal)
			return
		let List = await this.load (`fonts.json?${this.VERSION}`, "json")
		this.modal (
			this.CFG.MODAL_TITLE.UPLOAD,
			null,
			async el => {
				let f = List [+el.parent ().attr ("file")]
				let a = await this.load (`fonts/${f.file_name}`, "arrayBuffer")
				let t = new byteArray (a)
				let r = t.isReverse ()
				let ps = f.font_size.match (/^(\d+)x(\d+)$/)
				let s = ps
					? { w: +ps [1], h: +ps [2] }
					: { w: 8, h: zeditor.MAX_FONT_HEIGHT }
				this.add_files (f.font_count, f.file_name, t, s, r)
			},
			"dialog upload",
			this.$("tpl_file_list").textContent.pattern ([{
				FILE_ID		() { return this.$i },
				FILE_NAME	() { return this.$f.file_name },
				FILE_SIZE	() { return this.$f.file_size },
				FONT_COUNT	() { return this.$f.font_count },
				FONT_SIZE	() { return this.$f.font_size },
				TABLE_SIZE	() { return this.$f.table_size },
				$size		() { return List.length },
				$set		() { this.$f = List [this.$i] }
			}])
		)
		this.Modal.keydown = function ( e ) {
			let c = e.keyCode
			let t = this.$("table").$("tbody")
			if (c == 38) {
				//  up
				return true
			} else if (c == 40) {
				//  down
				return true
			} else if (c == 13) {
				//  enter
			} else if (e.shiftKey && e.ctrlKey && c == 0x4F) {
				this.hide ()
				return true
			} else {
				return true
			}
			return false
		}
	}
	parse_img ( bin ) {
		let type0 = ( img, sw, sh ) => {
			if (img.width % sw || img.height % sh)
				return
			let type = fw => {
				let w = sw * fw
				let h = w * img.height / img.width | 0
				let z = img.width / w
				let fh = h / sh
				if (h % sh || img.height != h * z || fh < 4 || fh > zeditor.MAX_FONT_HEIGHT)
					return
				return {
					sw, fw, fh, w, h, z
				}
			}
			let cw = img.width / sw
			return (cw % 8 == 0 && type (8)) || (cw % 6 == 0 && type (6))
		}
		return new Promise (( onLoad, onError ) => {
			let img = new Image
			img.onload = e => {
				URL.revokeObjectURL (img.src)
				onLoad (img)
			}
			img.onerror = e => {
				URL.revokeObjectURL (img.src)
				onError ()
			}
			img.src = URL.createObjectURL (new Blob ([bin]))
		}).then (img => {
			let type = type0 (img, 16, 16) || type0 (img, 256, 1) || type0 (img, 1, 256)
			if (!type)
				return null
			let { sw, fw, fh, w, h, z } = type
			let canvas = document.createElement ("canvas")
			let ctx = canvas.getContext ("2d")
			canvas.width = img.width
			canvas.height = img.height
			ctx.filter = "grayscale(100%) brightness(70%) contrast(500%)"
			ctx.fillStyle = "#fff"
			ctx.fillRect (0, 0, img.width, img.height)
			ctx.drawImage (img, 0, 0, img.width, img.height)
			let data = ctx.getImageData (0, 0, img.width, img.height).data
			let p = new Array (w * h).fill (0)
			let s = new Array (w * h).fill (0)
			for (let i = 0, j = 0; i < data.length; i += 4, j++) {
				let x = (j % img.width) / z | 0
				let y = (j / img.width | 0) / z | 0
				let i2 = y * w + x
				p [i2] += data [i]
				s [i2]++
			}
			let bin = new Uint8Array (p.length / fw)
			let bpl = sw * fh
			for (let i = 0, c = 0, idx = 0; i < p.length; c++) {
				let byte = 0xFF
				for (let b = 0; b < fw; b++, i++)
					byte = (byte << 1) | +(p [i] / s [i] > 127)
				bin [idx] = byte & 0xFF
				if (c % bpl == bpl - 1)
					idx++
				else if (c % sw == sw - 1)
					idx += -fh * (sw - 1) + 1
				else
					idx += fh
			}
			return bin
		}).catch (() => {
			return false
		})
	}
	async upload_handler ( name, bin ) {
		let img = await this.parse_img (bin)
		if (img === null)
			return this.error (this.CFG.ERROR.FILE_IMG.tpl ({ NAME: name }))

		let Table = new byteArray (img || bin)
		let r = Table.isReverse ()
		let w = Table.every (b => (b & 0xC0) == (r ? 0xC0 : 0)) ? 6 : 8
		let h = Table.length / 256 | 0
		if (img === false) {
			h *= 2
			while (h > zeditor.MAX_FONT_HEIGHT && (h & 1) == 0)
				h >>= 1
			if (Table.length & 0x7F || h > zeditor.MAX_FONT_HEIGHT || h == 1)
				return this.error (this.CFG.ERROR.FILE_SIZE.tpl ({ NAME: name }))
		}
		if (img !== false || h & 1) {
			this.add_file (name, Table, { w, h }, r)
			return true
		}

		h = await new Promise (resolve => {
			let h = Table.length / 128 | 0
			if (h < 8)
				return resolve (h)
			let hs = []
			let h1 = h => {
				for (; h >= 4; h /= 2) {
					if (h < zeditor.MAX_FONT_HEIGHT)
						hs.push (h)
					if (h & 1)
						break
				}
			}
			h1 (h)
			if (h % 3 == 0)
				h1 (h / 3 | 0)
			hs = hs.filter (( v, i, a ) => a.indexOf (v) === i)
			if (hs.length == 0)
				return resolve (h)
			if (hs.length == 1)
				return resolve (hs [0])
			let m = this.modal (
				name,
				this.CFG.MODAL_TITLE.FONT_HEIGHT,
				el => resolve (+el.height),
				"dialog select"
			)
			for (let h of hs.sort (( a, b ) => a - b)) {
				m.append ("a", {
					name:		"modal",
					className:	"btn",
					height:		h,
					innerHTML:	h
				})
			}
		})
		let s = await new Promise (resolve => {
			if (Table.length == 128 * h)
				return resolve (128)
			let m = this.modal (
				name,
				this.CFG.MODAL_TITLE.TABLE_SIZE,
				el => resolve (+el.size),
				"dialog select"
			)
			for (let s of [128, 256]) {
				m.append ("a", {
					name:		"modal",
					className:	"btn",
					size:		s,
					innerHTML:	s
				})
			}
		})
		this.add_files (Table.length / h / s, name, Table, { w, h }, r)
		return true
	}
	async save_handler () {
		let d = +this.$("download").value
		let f = +this.$("format").value
		let CharSize = this.File.Size.h
		let Data = this.File.Table
		if (d == 0) {
			this.download ("bin", f == 0 ? Data : Data.lineByLine (CharSize))
		} else if (d == 1) {
			let s = this.File.Size
			let canvas = document.createElement ("canvas")
			canvas.width = this.PNG == 1
				? s.w * 256
				: this.PNG == 2
				? s.w
				: s.w * 16
			canvas.height = this.PNG == 1
				? s.h
				: this.PNG == 2
				? s.h * 256
				: s.h * 16
			let ctx = canvas.getContext ("2d")
			let out = ctx.createImageData (canvas.width, canvas.height)
			let dst = out.data
			for (let idx = 0; idx < 256; idx++) {
				let [d_idx, tw] = this.PNG == 1
					? [s.w * 4 * idx, 256]
					: this.PNG == 2
					? [s.w * 4 * s.h * idx, 1]
					: [s.w * 4 * ((idx % 16) + (idx / 16 | 0) * s.h * 16), 16]
				for (let y = 0; y < s.h; y++) {
					let i = s.h * idx + y
					let ch = i < Data.length
						? Data [i]
						: this.File.Blank
					for (let x = 0, di = d_idx; x < s.w; x++, di += 4) {
						dst [di] = dst [di + 1] = dst [di + 2] =
							ch & (1 << s.w - x - 1) ? 255 : 0
						dst [di + 3] = 255
					}
					d_idx += s.w * 4 * tw
				}
			}
			ctx.putImageData (out, 0, 0)
			if (this.PNG_SIZE != 1) {
				let canvas2 = document.createElement ("canvas")
				canvas2.width = canvas.width * this.PNG_SIZE
				canvas2.height = canvas.height * this.PNG_SIZE
				let ctx2 = canvas2.getContext ("2d")
				ctx2.imageSmoothingEnabled = 0
				ctx2.drawImage (canvas, 0, 0, canvas2.width, canvas2.height)
				canvas = canvas2
			}
			canvas.toBlob (b => this.download ("png", [b]), "image/png")
		} else if (d == 2) {
			this.app.setClass ("wait")
			"".define ("FILE_NUM", _ => {
				return this.FileSelect.selectedIndex
			}).define ("JOIN", function ( i, g, n ) {
				this.$acc.push (i)
				if (this.$acc.length < n && !this.$end ())
					return ""
				let r = this.$acc.join (g)
				this.$acc.clear ()
				return r
			})
			await August.sync (window)
			let asm = f == 0
				? this.$("tpl_char_by_char").value.tpl ({
					CHAR_SIZE:	CharSize
				}, 8).pattern ([{
					CHAR	() { return this.$i / CharSize },
					CODE	() { return Data [this.$i] },
					$size	() { return Data.length },
					$end	() { return this.$i == this.$size () - 1 },
					$list:	Data,
					$acc:	[]
				}])
				: this.$("tpl_line_by_line").value.pattern ([{
					LINE	() { return this.$i },
					$size	() { return CharSize }
				}, {
					CODE	() { return Data [this.$i * CharSize + this.$.$i] },
					$size	() { return this.$n },
					$end	() { return this.$i == this.$size () - 1 },
					$n:	Data.length / CharSize,
					$acc:	[]
				}])
			this.download ("asm", asm.split ("\n").filter (l => !!l.trim ()).join ("\r\n") + "\r\n")
			this.app.setClass ("wait")
		}
	}
	async save_project () {
		if (this.Modal)
			return
		if (this.Project)
			return this.Project.show ()

		let get_form = () => {
			let f = this.Project.$("form")
			let av = f.align.value
			let ot = f.offset_type.value
			let ov = f.offset.value
			let fv = f.fill.value
			return {
				av:	av,
				ov:	(ot == 1 && /^[\da-f]+$/i.test (ov)) ? ov.hex () : 0,
				fv:	/^[\da-f]{2}$/i.test (fv) ? fv.hex () : 0
			}
		}
		let file_view = () => {
			let f = get_form ()
			this.Project.$("#file_view").props ({
				"--fill":	`'${f.fv.HEX ()}'`,
				"--align":	f.av,
				"--offs":	f.ov,
				"--align-txt":	`'${f.av < 1024 ? f.av : `${f.av / 1024}k`}'`,
				"--offs-txt":	`'0x${f.ov.HEX (2)}'`
			})
		}

		let self = this
		let html = await this.load (`project.${this.LANG}.html`.set ("v"))
		this.modal (this.CFG.MODAL_TITLE.PROJECT, null, null, "project", html)
		this.app.setClass ("modal")
		this.Project = this.Modal
		this.Project.hide = this.Project.show = () => {
			this.app.setClass ("modal")
			this.Modal = this.app.setClass ("project") ? this.Project : null
			if (!this.Modal)
				return this.app.focus ()

			this.Project.$("#font_list").innerHTML = this.$("tpl_font_list").textContent.pattern ([{
				NUM		() { return this.$i },
				FILENAME	() { return this.$f.FileName },
				WIDTH		() { return this.$s.w },
				HEIGHT		() { return this.$s.h },
				SIZE		() { return this.$f.Table.length },
				$size		() { return self.Files.length },
				$set		() { this.$f = self.Files [this.$i]; this.$s = this.$f.Size }
			}])
			file_view ()
			this.Project.first ().focus ()
			this.Project.$("form").setClass ("submit", 0)
		}

		this.Project.show ()
		let f = this.Project.$("form")
		f.file_format.value = this.$("format").value
		f.align.onchange =
		f.offset.oninput =
		f.fill.oninput = 
		f.offset_type [0].onchange =
		f.offset_type [1].onchange = file_view
		f.onsubmit = function ( e ) {
			e.stop ()
			let fs = []
			if (this.font.length) {
				for (let f of this.font) {
					if (f.checked)
						fs.push (f.value)
				}
			} else if (this.font.checked) {
				fs.push (this.font.value)
			}
			if (!fs.length) {
				self.Project.first ().focus ()
				return
			}
			this.setClass ("submit")
			let f = get_form ()
			let Blob = []
			if (f.ov)
				Blob.push (new byteArray (f.ov).fill (f.fv))
			for (let i of fs) {
				let fl = self.Files [i]
				Blob.push (+this.file_format.value
					? fl.Table.lineByLine (fl.Size.h)
					: fl.Table
				)
				if (f.av) {
					let r = fl.Table.length % f.av
					if (r)
						Blob.push (new byteArray (f.av - r).fill (f.fv))
				}
			}
			f.fn = this.filename.value
			self.download_fn (f.fn ? `${f.fn}.bin` : f.fn, Blob)
			self.Project.show ()
		}
	}
	download ( ext, blob ) {
		let fn = tpl => tpl.tpl ({
			WIDTH:		this.File.Size.w,
			HEIGHT:		this.File.Size.h,
			SIZE:		this.TableSize,
			EXT:		ext,
			FILE_NUM:	this.FileSelect.selectedIndex
		})
		this.download_fn (
			this.File.New || this.FF == 0
				? fn (this.$(`tpl_filename_format${+this.$("format").value}`).value)
				: `${this.File.FileName.replace (/\.([^.]+)$/, "")}.${ext}`,
			blob
		)
	}
	keydown ( e ) {
		if (super.keydown (e))
			return true
		if (this.Modal)
			return e.stop ()

		let do_func = func => {
			if (this.File.Select) {
				this.history ("table")
				this.do_select (func)
				this.out_table ()
			} else {
				this.history ("char".set ("fix"))
				func (this.File.Char)
			}
			this.out (3)
		}
		let swap = to => {
			this.File.Table.swap (this.File.Char, this.File.Char + to, s.h)
			this.out_table ()
			this.set_char (this.File.Char + to)
		}

		let s = this.File.Size
		if (e.shiftKey) switch (e.keyCode) {
			case 38:  //  up
				do_func (ch => {
					ch *= s.h
					let b = e.ctrlKey ? 0 : e.altKey ? this.Cur.y : 0
					let n = e.ctrlKey ? this.Cur.y : s.h - 1
					for (let i = b; i < n; i++)
						this.File.Table [ch + i] = this.File.Table [ch + i + 1]
					this.File.Table [ch + n] = this.File.Blank
				})
				break
			case 40:  //  down
				do_func (ch => {
					ch *= s.h
					let b = e.ctrlKey ? s.h - 1 : e.altKey ? this.Cur.y : s.h - 1
					let n = e.ctrlKey ? this.Cur.y : 0
					for (let i = b; i > n; i--)
						this.File.Table [ch + i] = this.File.Table [ch + i - 1]
					this.File.Table [ch + n] = this.File.Blank
				})
				break
			case 37:  //  left
				do_func (ch => {
					ch *= s.h
					let m = e.ctrlKey || e.altKey ? 0xFF >> 8 - s.w + this.Cur.x : 0
					let z = (0xFF << s.w) | (e.ctrlKey ? 1 << s.w - this.Cur.x - 1 : 1)
					if (e.altKey)
						m = ~m
					for (let i = 0; i < s.h; i++) {
						let c = this.File.Table [ch + i] ^ ~this.File.Blank
						this.File.Table [ch + i] =
							((c << 1) & ~m | (c & m) | z) ^ ~this.File.Blank
					}
				})
				break
			case 39:  //  right
				do_func (ch => {
					ch *= s.h
					let m = e.ctrlKey || e.altKey ? 0xFF >> 8 - s.w + this.Cur.x : 0xFF
					let z = e.ctrlKey ? 0x80 >> 8 - s.w + this.Cur.x : 0x80
					if (e.altKey)
						m = ~m >>> 1
					for (let i = 0; i < s.h; i++) {
						let c = this.File.Table [ch + i] ^ ~this.File.Blank
						this.File.Table [ch + i] =
							((c >> 1) & m | (c & ~m) | z) ^ ~this.File.Blank
					}
				})
				break
			case 45:  //  Insert
				if (!this.Copy) {
					this.shift (this.File.Char & ~0x0F, 16)
				} else if (!this.File.Select) {
					this.shift (this.File.Char, this.Copy.Len, this.Copy)
				} else {
					let Char = this.File.Select.Begin
					this.shift (
						this.File.Select.Begin,
						-(this.File.Select.End - this.File.Select.Begin + 1),
						this.Copy
					)
					this.set_char (Char)
				}
				break
			case 46:  //  Delete
				this.shift (this.File.Char & ~0x0F, -16)
				break
			case 33:  //  PgUp
				if (e.ctrlKey) {
					if (this.File.Char >= 16)
						swap (-16)
				} else {
					if (this.File.Char)
						swap (-1)
				}
				break
			case 34:  //  PgDown
				if (e.ctrlKey) {
					if (this.File.Char < this.TableSize - 16)
						swap (16)
				} else {
					if (this.File.Char < this.TableSize - 1)
						swap (1)
				}
				break
			case 0x5A:  //  Z
				if (e.ctrlKey) {
					this.redo ()
					break
				}
			default:
				if (e.keyCode >= 0x20 && e.keyCode < 0x100)
					return true
		} else if (e.ctrlKey) switch (e.keyCode) {
			case 38:  //  up
				if (this.File.Char > 15)
					this.set_char (this.File.Char - 16)
				break
			case 40:  //  down
				if (this.File.Char < this.TableSize - 16)
					this.set_char (this.File.Char + 16)
				break
			case 37:  //  left
				if (this.File.Char)
					this.set_char (this.File.Char - 1)
				break
			case 39:  //  right
				if (this.File.Char < this.TableSize - 1)
					this.set_char (this.File.Char + 1)
				break
			case 36:  //  Home
				this.set_char (0)
				break
			case 35:  //  End
				this.set_char (this.TableSize - 1)
				break
			case 45:  //  Insert
				if (this.File.Select) {
					this.Copy = {
						Table:	this.File.Table.slice (
							this.File.Select.Begin * s.h,
							(this.File.Select.End + 1) * s.h
						),
						Size:	this.File.Size,
						Len:	this.File.Select.End - this.File.Select.Begin + 1,
						Blank:	this.File.Blank
					}
					let b = this.File.Select.Begin.HEX ()
					let e = this.File.Select.End.HEX ()
					this.status (this.CFG.NOTICE.COPIED_RANGE.tpl ({ BEGIN: b, END: e }))
				} else {
					this.Copy = {
						Table:	this.File.Table.slice (
							this.File.Char * s.h,
							(this.File.Char + 1) * s.h
						),
						Size:	this.File.Size,
						Len:	1,
						Blank:	this.File.Blank
					}
					this.status (this.CFG.NOTICE.COPIED_CHAR.tpl ({ CODE: this.File.Char.HEX () }))
				}
				break
			case 46:  //  Delete
				if (this.Copy) {
					delete this.Copy
					this.status (this.CFG.NOTICE.CLEAR)
				}
				break
			case 0x41:  //  A
				this.select (0, this.TableSize - 1)
				break
			case 0x20:  //  space
			case 0x43:  //  C
				do_func (ch => {
					ch *= s.h
					for (let i = 0; i < s.h; i++)
						this.File.Table [ch + i] = this.File.Blank
				})
				break
			case 0x49:  //  I
				do_func (ch => {
					ch *= s.h
					let m = ~(0xFF << s.w)
					for (let i = 0; i < s.h; i++)
						this.File.Table [ch + i] ^= m
				})
				break
			case 0x5A:  //  Z
				this.undo ()
				break
		} else if (e.altKey) switch (e.keyCode) {
		} else switch (e.keyCode) {
			case 38:  //  up
				this.cursor ()
				if (this.Cur.y > 0)
					this.Cur.y--
				this.cursor ()
				break
			case 40:  //  down
				this.cursor ()
				if (this.Cur.y < s.h - 1)
					this.Cur.y++
				this.cursor ()
				break
			case 37:  //  left
				this.cursor ()
				if (this.Cur.x > 0)
					this.Cur.x--
				this.cursor ()
				break
			case 39:  //  right
				this.cursor ()
				if (this.Cur.x < s.w - 1)
					this.Cur.x++
				this.cursor ()
				break
			case 36:  //  Home
				this.set_char (this.File.Char & ~0x0F)
				break
			case 35:  //  End
				this.set_char (this.File.Char | 0x0F)
				break
			case 45:  //  Insert
				this.shift (this.File.Char, 1)
				break
			case 46:  //  Delete
				if (this.File.Select) {
					let Char = this.File.Select.Begin
					this.shift (
						this.File.Select.Begin,
						-(this.File.Select.End - this.File.Select.Begin + 1)
					)
					this.set_char (Char)
				} else {
					this.shift (this.File.Char, -1)
				}
				break
			case 33:  //  PgUp
				this.prev_file ()
				break
			case 34:  //  PgDown
				this.next_file ()
				break
			default:
				return true
		}
		return e.stop ()
	}
	keypress ( e ) {
		if (super.keypress (e))
			return true
		if (e.charCode == 0x20)
			this.dot (2, "dot")
		else if (e.charCode > 0x20 && e.charCode < 0x100)
			this.set_char ((e.altKey ? 0x80 : 0) + e.charCode)
		e.stop ()
	}
	mouse ( e ) {
		if (super.mouse (e))
			return true
		let s = this.File.Size
		let inv = this.File.Reverse ? 0 : 1
		let set = e.altKey ? 1 ^ inv : e.ctrlKey ? 0 ^ inv : 2
		let isId = id => e.$.parentElement && e.$.parentElement.id == id
		let isMatrix = isId ("matrix")
		let isTable = isId ("table")
		switch (e.type) {
			case "mousedown":
				if (this.MouseDown) {
					if (isMatrix)
						this.dot (set, `set${set}`)
					else if (isTable)
						this.ch_idx = e.$.idx
				} else if (this.MouseDownRight) {
					if (isMatrix)
						this.dot (1 ^ inv, "clr")
				}
				break
			case "mouseup":
				if (e.which == 1)
					this.ch_idx = void 0
				break
			case "mousemove":
				if (this.MouseDown && isTable && isSet (this.ch_idx))
					this.select (e.$.idx, this.ch_idx)
				break
			case "mouseover":
				if (!isMatrix || !isSet (e.$.idx))
					break
				this.cursor ()
				this.Cur.x = e.$.idx % s.w
				this.Cur.y = (e.$.idx - this.Cur.x) / s.w
				this.cursor ()
				if (this.MouseDown)
					this.dot (set, "mset".set ("last", `set${set}`))
				else if (this.MouseDownRight)
					this.dot (1 ^ inv, "mclr".set ("last", "clr"))
				break
			case "wheel":
				if (e.ctrlKey || this.MouseDownMiddle) {
					if (e.wheelDelta > 0)
						this.next_file ()
					else
						this.prev_file ()
					return e.stop ()
				} else if (isMatrix || isTable) {
					let n = this.MouseDownRight ? 16 : 1
					if (e.wheelDelta > 0) {
						if (this.File.Char - n >= 0)
							this.set_char (this.File.Char - n)
					} else {
						if (this.File.Char + n < this.TableSize)
							this.set_char (this.File.Char + n)
					}
				}
				break
		}
		return (isMatrix || isTable) ? e.stop () : true
	}
	click_handler ( e ) {
		let name = super.click_handler (e)
		if (name !== true)
			return
		switch (e.$.dataset.a || e.$.id) {
			case "add_size": {
				let w = this.$("custom_size_width").checked ? 8 : 6
				let h = +this.$("custom_size_height").value
				this.add_size ({ w, h })
				break
			}
			case "del_size": {
				let idx = +e.$.dataset.idx
				let s = this.CUSTOM_SIZE [idx]
				if (s) {
					let ss = `${s.w}x${s.h}`
					this.FONT.delete (ss)
					this.CUSTOM_SIZE.delete (idx)
					this.init_custom_size ()
					let view = this.$("font_size").$("optgroup#view")
					let conv = this.$("font_size").$("optgroup#conv")
					for (let o of view.children) {
						if (o.value == ss)
							view.remove (o)
					}
					for (let o of conv.children) {
						if (o.value == ss)
							conv.remove (o)
					}
				}
				break
			}
		}
	}

	static CP437 = [
		0,      0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022,
		0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C,
		0x25BA, 0x25C4, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8,
		0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2302,
		0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7,
		0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5,
		0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9,
		0x00FF, 0x00D6, 0x00DC, 0x00A2, 0x00A3, 0x00A5, 0x20A7, 0x0192,
		0x00E1, 0x00ED, 0x00F3, 0x00FA, 0x00F1, 0x00D1, 0x00AA, 0x00BA,
		0x00BF, 0x2310, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB,
		0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
		0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
		0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
		0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
		0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
		0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
		0x03B1, 0x00DF, 0x0393, 0x03C0, 0x03A3, 0x03C3, 0x00B5, 0x03C4,
		0x03A6, 0x0398, 0x03A9, 0x03B4, 0x221E, 0x03C6, 0x03B5, 0x2229,
		0x2261, 0x00B1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00F7, 0x2248,
		0x00B0, 0x2219, 0x00B7, 0x221A, 0x207F, 0x00B2, 0x25A0, 0x00A0
	]
	static CP866 = [
		0,      0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022,
		0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C,
		0x25BA, 0x25C4, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8,
		0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2302,
		0x0410, 0x0411, 0x0412, 0x0413, 0x0414, 0x0415, 0x0416, 0x0417,
		0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E, 0x041F,
		0x0420, 0x0421, 0x0422, 0x0423, 0x0424, 0x0425, 0x0426, 0x0427,
		0x0428, 0x0429, 0x042A, 0x042B, 0x042C, 0x042D, 0x042E, 0x042F,
		0x0430, 0x0431, 0x0432, 0x0433, 0x0434, 0x0435, 0x0436, 0x0437,
		0x0438, 0x0439, 0x043A, 0x043B, 0x043C, 0x043D, 0x043E, 0x043F,
		0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
		0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
		0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
		0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
		0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
		0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
		0x0440, 0x0441, 0x0442, 0x0443, 0x0444, 0x0445, 0x0446, 0x0447,
		0x0448, 0x0449, 0x044A, 0x044B, 0x044C, 0x044D, 0x044E, 0x044F,
		0x0401, 0x0451, 0x0404, 0x0454, 0x0407, 0x0457, 0x040E, 0x045E,
		0x00B0, 0x2219, 0x00B7, 0x221A, 0x2116, 0x00A4, 0x25A0, 0x00A0
	]
	static CP1251 = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0x0402, 0x0403, 0x201A, 0x0453, 0x201E, 0x2026, 0x2020, 0x2021,
		0x20AC, 0x2030, 0x0409, 0x2039, 0x040A, 0x040C, 0x040B, 0x040F,
		0x0452, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
		0x0000, 0x2122, 0x0459, 0x203A, 0x045A, 0x045C, 0x045B, 0x045F,
		0x00A0, 0x040E, 0x045E, 0x0408, 0x00A4, 0x0490, 0x00A6, 0x00A7,
		0x0401, 0x00A9, 0x0404, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x0407,
		0x00B0, 0x00B1, 0x0406, 0x0456, 0x0491, 0x00B5, 0x00B6, 0x00B7,
		0x0451, 0x2116, 0x0454, 0x00BB, 0x0458, 0x0405, 0x0455, 0x0457,
		0x0410, 0x0411, 0x0412, 0x0413, 0x0414, 0x0415, 0x0416, 0x0417,
		0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E, 0x041F,
		0x0420, 0x0421, 0x0422, 0x0423, 0x0424, 0x0425, 0x0426, 0x0427,
		0x0428, 0x0429, 0x042A, 0x042B, 0x042C, 0x042D, 0x042E, 0x042F,
		0x0430, 0x0431, 0x0432, 0x0433, 0x0434, 0x0435, 0x0436, 0x0437,
		0x0438, 0x0439, 0x043A, 0x043B, 0x043C, 0x043D, 0x043E, 0x043F,
		0x0440, 0x0441, 0x0442, 0x0443, 0x0444, 0x0445, 0x0446, 0x0447,
		0x0448, 0x0449, 0x044A, 0x044B, 0x044C, 0x044D, 0x044E, 0x044F
	]
	static KOI8R = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0x2500, 0x2502, 0x250C, 0x2510, 0x2514, 0x2518, 0x251C, 0x2524,
		0x252C, 0x2534, 0x253C, 0x2580, 0x2584, 0x2588, 0x258C, 0x2590,
		0x2591, 0x2592, 0x2593, 0x2320, 0x25A0, 0x2219, 0x221A, 0x2248,
		0x2264, 0x2265, 0x00A0, 0x2321, 0x00B0, 0x00B2, 0x00B7, 0x00F7,
		0x2550, 0x2551, 0x2552, 0x0451, 0x2553, 0x2554, 0x2555, 0x2556,
		0x2557, 0x2558, 0x2559, 0x255A, 0x255B, 0x255C, 0x255D, 0x255E,
		0x255F, 0x2560, 0x2561, 0x0401, 0x2562, 0x2563, 0x2564, 0x2565,
		0x2566, 0x2567, 0x2568, 0x2569, 0x256A, 0x256B, 0x256C, 0x00A9,
		0x044E, 0x0430, 0x0431, 0x0446, 0x0434, 0x0435, 0x0444, 0x0433,
		0x0445, 0x0438, 0x0439, 0x043A, 0x043B, 0x043C, 0x043D, 0x043E,
		0x043F, 0x044F, 0x0440, 0x0441, 0x0442, 0x0443, 0x0436, 0x0432,
		0x044C, 0x044B, 0x0437, 0x0448, 0x044D, 0x0449, 0x0447, 0x044A,
		0x042E, 0x0410, 0x0411, 0x0426, 0x0414, 0x0415, 0x0424, 0x0413,
		0x0425, 0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E,
		0x041F, 0x042F, 0x0420, 0x0421, 0x0422, 0x0423, 0x0416, 0x0412,
		0x042C, 0x042B, 0x0417, 0x0428, 0x042D, 0x0429, 0x0427, 0x042A
	]
	static KOI7_N0 = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0xA4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
	static KOI7_N1 = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0xA4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0x044E, 0x0430, 0x0431, 0x0446, 0x0434, 0x0435, 0x0444, 0x0433,
		0x0445, 0x0438, 0x0439, 0x043A, 0x043B, 0x043C, 0x043D, 0x043E,
		0x043F, 0x044F, 0x0440, 0x0441, 0x0442, 0x0443, 0x0436, 0x0432,
		0x044C, 0x044B, 0x0437, 0x0448, 0x044D, 0x0449, 0x0447, 0x044A,
		0x042E, 0x0410, 0x0411, 0x0426, 0x0414, 0x0415, 0x0424, 0x0413,
		0x0425, 0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E,
		0x041F, 0x042F, 0x0420, 0x0421, 0x0422, 0x0423, 0x0416, 0x0412,
		0x042C, 0x042B, 0x0417, 0x0428, 0x042D, 0x0429, 0x0427, 0
	]
	static KOI7_N2 = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0xA4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2191, 0,
		0x042E, 0x0410, 0x0411, 0x0426, 0x0414, 0x0415, 0x0424, 0x0413,
		0x0425, 0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E,
		0x041F, 0x042F, 0x0420, 0x0421, 0x0422, 0x0423, 0x0416, 0x0412,
		0x042C, 0x042B, 0x0417, 0x0428, 0x042D, 0x0429, 0x0427, 0
	]
	static FONT_SIZE = [
		{ w: 6, h: 4 },
		{ w: 8, h: 4 },
		{ w: 6, h: 8 },
		{ w: 8, h: 8 },
		{ w: 8, h: 12 },
		{ w: 8, h: 14 },
		{ w: 8, h: 16 },
		{ w: 8, h: 17 },
		{ w: 8, h: 18 },
		{ w: 8, h: 19 },
		{ w: 8, h: 20 }
	]

	static MAX_FONT_HEIGHT = 20
	static NEW_FONTNAME_TPL = "Font #%NUM% / %DATE_NOW(\"dd mmm yyyy HH:ii:ss\")%"
	static FILENAME_TPL = "font-%WIDTH%x%HEIGHT%-%SIZE%.%EXT%"
	static DEMO_STR = ""

	SCP = "CP437"
	DSD = 0
	IDS = 0
	SIZE = 0
	FONT = new Set
	XLAT = {}
	FOREGROUND = ""
	BACKGROUND = ""
}

class byteArray extends Uint8Array {
	swap ( n1, n2, cs ) {
		let b1 = n1 * cs
		let b2 = n2 * cs
		for (let i = 0; i < cs; i++)
			[this [b1 + i], this [b2 + i]] = [this [b2 + i], this [b1 + i]]
		return this
	}
	lineByLine ( cs ) {
		let t = new byteArray (this.length)
		for (let l = 0; l < cs; l++) {
			for (let i = 0, n = this.length / cs; i < n; i++)
				t [i + l * n] = this [l + i * cs]
		}
		return t
	}
	isReverse () {
		return this.reduce (( a, c ) => a + c.bitCount32 (), 0) / this.length / 4 > 1
	}
	equ ( a ) {
		return this.length == a.length && this.every (( v, i ) => v === a [i])
	}
	toJSON () {
		return new Uint8Array (this)
	}
}

