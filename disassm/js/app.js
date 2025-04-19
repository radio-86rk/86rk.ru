//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


"use strict"

class disassm extends app {
	async init () {
		this.busy ()
		await this.load_js ("august.disassm.js", _ => {
			this.Disassm = new august_disassm
		})
		this.busy ()
		if (!this.Disassm)
			return

		let self = this
		this.disassm1 = this.Disassm.get_disassm1 ()
		this.ASB = this.$("assm_sidebar")
		this.DSB = this.$("dump_sidebar")
		this.ASB.show = this.$("assm_sidebar_show")
		this.DSB.show = this.$("dump_sidebar_show")
		this.ASB.setClass ("data-add", 0)

		this.ASB.org.onkeydown = function ( e ) {
			return /^[0-9a-fA-F]|..+$/.test (e.key)
		}
		this.ASB.org.onkeyup = this.ASB.org.onchange = function ( e ) {
			let cur = +self.$("dump").prop ("--start")
			if (/[^0-9a-fA-F]/.test (this.value))
				return (this.value = cur.hex16), false
			let ch = (4 - this.value.length).sign ()
			if (ch) {
				let r = this.selectionStart + ch
				this.value = this.value.paddingLeft (4, "0").substr (-4)
				this.setSelectionRange (r, r)
			}
			self.File.Org = this.value.hex ()
			if (self.File.Org != cur) {
				self.app.setClass ("overflow", self.File.overflow ())
				self.$("dump").props ({
					"--start": self.File.Org,
					"--start-header": self.File.Org & 0x0F
				})
				clearTimeout (this.to)
				this.to = setTimeout (a => {
					for (let x of self.$("dump").all ("div#addr>div")) {
						let ah = a.w0.hex16
						x.textContent = ah.toUpperCase ()
						x.id = `dump-addr-${ah}`
						a += 16
					}
				}, 500, self.File.Org)
			}
		}
		this.ASB.data.oninput = function ( e ) {
			let c = 1
			for (let p = 0; p = 1 + this.value.indexOf ("\n", p); c++);
			this.rows = Math.max (c, 5)
		}
		this.ASB.onchange = function ( e ) {
			if (e.$.name == "arch")
				self.File.Arch = +e.$.value
		}
		this.ASB.onsubmit = function ( e ) {
			e.stop ()
			if (self.File)
				self.disassm ()
		}
		this.DSB.onsubmit = function ( e ) {
			e.stop ()
			if (self.File)
				self.dump_sidebar_search ()
		}
		this.DSB.search.oninput = function ( e ) {
			let check = b => {
				let l = 2 ** b
				return Num >= -l / 2 && Num < l
			}
			let Val = e.$.value.trim ()
			let Num = +`${Val}`
			this.ok = Num === Num && /^(?:0b[01]+|0x[\da-f]+|[-+]?\d+|)$/i.test (Val)
			this.setClass ("error", !this.ok)
			if (this.ok) {
				self.$("search_type8").disabled = !(self.$("search_type8").checked = check (8))
				self.$("search_type16").disabled = !(self.$("search_type16").checked = check (16))
				self.$("search_type32").disabled = !(self.$("search_type32").checked = check (32))
			}
		}
		this.ASB.show.onchange = function ( e ) {
			if (this.checked && !window.getSelection ().rangeCount) {
				self.ASB.org.focus ()
				self.ASB.org.setSelectionRange (4, 4)
			} else {
				self.focus ()
			}

		}
		this.DSB.show.onchange = function ( e ) {
			self.DumpSidebar = this.checked
			self.focus ()
			if (self.DumpSidebar) {
				self.File.initAL ()
				self.dump_sidebar_code ()
			} else {
				self.DumpNextOffs = 0
			}
		}
		document.onselectstart = function ( e ) {
			window.getSelection ().removeAllRanges ()
		}
		document.onselectionchange = function ( e ) {
			let select = ( bn, o1, o2 ) => {
				self.dump_hl (o1, o2 - o1 + 1, void 0, "sel", bn)
				self.$("dump").sel = [bn, o1, o2]
			}
			if (self.$("dump").sel) {
				select (... self.$("dump").sel)
				delete self.$("dump").sel
			}
			let s = window.getSelection ()
			if (s.rangeCount && s.type == "Range") {
				let r = s.getRangeAt (0)
				let o1 = self.get_dump_offs (r.startContainer)
				if (o1 === false)
					return
				let o2 = self.get_dump_offs (r.endContainer)
				if (o2 === false)
					return
				let c = r.commonAncestorContainer
				let el = c.nodeType == 1 ? c : c.parentElement
				if (!r.endOffset)
					o2--
				if (el.isEl (self.$("code")))
					select ("text", o1, o2)
				else if (el.isEl (self.$("text")))
					select ("code", o1, o2)
				else
					return
				self.ASB.data_addr1.value = (o1 + self.File.Org).hex16
				self.ASB.data_addr2.value = (o2 + self.File.Org).hex16
				self.ASB.setClass ("data-add", 1)
			}
		}

		for (let num of this.DSB.dump_num) {
			num.onchange = num.oninput = num.onfocus = num.onblur = function ( e ) {
				self.dump_sidebar_edit (e)
			}
			num.setValue = function ( v, d = " " ) {
				let s = +this.dataset.size
				let r = this.dataset.role
				this.value = r == "hex"
					? v.HEX (s).replace (/\B(?=(?:..)+\b)/g, d)
					: r == "udec"
					? v.numeral (d)
					: r == "sdec"
					? (v | ((v << (4 - s) * 8) & 0x80000000) >> (4 - s) * 8).numeral (d)
					: ""
			}
		}

		let SymbolList = app.deserialize (this.STORAGE ("symbol_list") || "false") || disassm.SYMBOL
		for (let a in SymbolList)
			this.Disassm.CFG.SYMBOL [a] = SymbolList [a]
		for (let cfg of [
			"dir_equ", "dir_org", "dir_db", "dir_dw",
			"dir_ds", "lbl_jmp", "lbl_sub", "lbl_ext",
			"lbl_ref", "lbl_var", "lbl_vxt", "lbl_smc",
			"lbl_cnst"
		]) {
			let [cfg0, cfg1] = cfg.toUpperCase ().split ("_")
			this.txt_cb (cfg, this.Disassm.CFG [cfg0][cfg1], v => {
				this.Disassm.CFG [cfg0][cfg1] = v
			})
		}
		this.set_txt ("tpl_new_project_name", disassm.NEW_PROJECT_NAME_TPL)
		this.checkbox_cb ("resizable", v => {
			if (!this.File) {
			} else if (!this.File.Code.length) {
				this.$("resizable").checked = true
			} else {
				if (this.File.Code.length == this.DumpOffs)
					this.set_cursor (this.DumpOffs - 1)
				this.File.Resizable = +v
			}
			this.focus ()
		})
		this.radio_cb ("text_encoding", "86RK", async v => {
			this.Disassm.CFG.XLAT = disassm.XLAT [v]
			this.DE = v
			if (this.File) {
				let t = this.$("dump").all ("samp")
				this.busy ()
				await August.sync ()
				for (let o = 0; o < this.File.Code.length; o++)
					t [o].textContent = this.dump_char (this.File.Code [o])
				this.busy ()
			}
		})
		this.radio_cb ("cursor_shape", 0, v => {
			this.app.setClass ("cursor-block", +v)
		})
		this.radio_cb ("cursor_blink", "mid", v => {
			this.app.setClass (`cursor-blink-${this.app.dataset.cursor_blink}`, 0)
			this.app.setClass (`cursor-blink-${v}`, 1)
			this.app.dataset.cursor_blink = v
		})
		this.radio_cb ("text_font", "monospace", v => {
			this.app.$("app-disassm").s ({ fontFamily: v })
		})
		this.TextFontSizeFine = this.slider_cb ("text_font_size_fine", 0, 10, d => {
			if (this.TextFontSize)
				this.TextFontSize.set (this.TextFontSize.get ())
		})
		this.TextFontSize = this.slider_cb ("text_font_size", 1, 8, v => {
			let fs = 14 + v + this.TextFontSizeFine.get () / 10
			if (this.FontSize != fs) {
				this.FontSize = fs
				this.$("text_font_size_val").textContent = `${fs}px`
				this.app.$("app-disassm").props ({
					"--fs": fs,
					"--v":	v
				})
			}
		})
		this.init_symbol_list ()
		super.init ("", f => {
			Object.setPrototypeOf (f, disassm.FILE_PROTO)
			f.init (this)
			f.Code = disassm.Uint8ArrayEx (f.Code)
			///===
			if (f.History) {
				for (let h of f.History) {
					if (h.un) {
						h.undo = h.un
						delete h.un
					}
					if (h.re) {
						h.redo = h.re
						delete h.re
					}
					if (h.undo.dm == "hex")
						h.undo.dm = "code"
					if (h.redo.dm == "hex")
						h.redo.dm = "code"
				}
			}
			///
			if (!isSet (f.DumpBackward))
				f.DumpBackward = new Map
		})
	}
	done () {
		this.STORAGE ("symbol_list", app.serialize (this.Disassm.CFG.SYMBOL))
		this.ASB.org.onkeydown = this.ASB.org.onkeyup = this.ASB.org.onchange =
		this.ASB.data.oninput = this.ASB.onchange = this.ASB.onsubmit =
		this.DSB.onsubmit = this.DSB.search.oninput = this.ASB.show.onchange =
		this.DSB.show.onchange = document.onselectstart = document.onselectionchange = null
		if (this.File)
			this.File.get_params ()
		for (let f of this.Files)
			f.FoundList.clear ()
		super.done ()
	}
	init_symbol_list () {
		if (!this.$("symbol_list"))
			return
		let self = this
		let list = (function* () {
			for (let a in self.Disassm.CFG.SYMBOL)
				yield { a, n: self.Disassm.CFG.SYMBOL [a] }
		})()
		this.$("symbol_list").innerHTML = this.$("tpl_symbol_list").textContent.pattern ([{
			ADDR	() { return this.$x.value.a },
			NAME	() { return this.$x.value.n },
			$size	() { this.$x = list.next (); return this.$x.done ? 0 : Number.MAX_SAFE_INTEGER }
		}]).trim ()
	}
	show_panel ( p ) {
		if (isSet (p.d)) {
			if (p.d ^ this.DSB.show.checked) {
				this.DSB.show.checked = p.d
				this.DSB.show.fire ("change")
				if (p.d && this.ASB.show.checked) {
					this.ASB.show.checked = false
					this.ASB.show.fire ("change")
				}
			}
		} else if (isSet (p.a)) {
			if (p.a ^ this.ASB.show.checked) {
				this.ASB.show.checked = p.a
				this.ASB.show.fire ("change")
				if (p.a && this.DSB.show.checked) {
					this.DSB.show.checked = false
					this.DSB.show.fire ("change")
				}
			}
		}
	}
	empty_page () {
		this.File = null
		this.ASB.org.value = (0).hex16
		this.ASB.data.value = ""
		this.ASB.show.checked =
		this.ASB.show.checked = false
		this.$("dump").innerHTML =
		this.$("assm").innerHTML = ""
		this.$("dump").scrollTop =
		this.$("assm").scrollTop = 0
		this.$("assm_addr_show").checked =
		this.$("assm_code_show").checked =
		this.$("dump_color").checked = false
		this.app.$("app-filename").attr ("file-name", "")
		this.app.setClass ("empty", 1)
	}
	async empty_file () {
		await this.new_file (
			this.new_file_name ("tpl_new_project_name"),
			null
		)
	}
	async new_file ( FileName, Code ) {
		function file ( app, Code, Org = 0 ) {
			this.FileName = FileName
			this.Code = Code
			this.Data = new Map
			this.PrimCode = new Map
			this.OffsList = new Map
			this.FoundList = new Map
			this.DumpBackward = new Map
			this.Org = Org
			this.Arch = 0
			this.Resizable = !Code.length
			this.AddrShow = 0
			this.CodeShow = 0
			this.LowerCase = 0
			this.DumpColor = 0
			this.DumpScroll = 0
			this.AssmScroll = 0
			this.CurOffs = 0
			this.History = []
			this.HistoryPtr = 0
			this.init (app)
		}
		file.prototype = disassm.FILE_PROTO

		Code = Code && (app.code_rk (Code) || { Code })
		await this.add_file (FileName, new file (this, disassm.Uint8ArrayEx (Code?.Code), Code?.Addr))
		this.show_panel (Code ? { a: true } : { d: true })
	}
	async new_project ( File ) {
		Object.setPrototypeOf (File, disassm.FILE_PROTO)
		File.init (this)
		File.Code = disassm.Uint8ArrayEx (File.Code)
		await this.add_file (File.FileName, File)
	}
	async add_file ( FileName, File ) {
		let idx = this.Files.length
		this.Files.push (File)
		this.add_file_list (idx, FileName)
		await this.set_file (idx)
	}
	async set_file ( idx ) {
		if (this.Files.length <= idx)
			return this.Files.length ? this.set_file (0) : this.empty_page ()
		this.busy (1)
		await August.sync ()
		if (this.File)
			this.File.get_params ()
		this.File = this.Files [idx]
		this.Highlight = null
		this.Jump.clear ()
		this.assm ()
		this.dump ()
		this.dump_mode ("code")
		this.File.set_params ()
		this.dump_addr_list ()
		this.dump_found_list ()
		this.ASB.data_addr1.value =
		this.ASB.data_addr2.value = ""
		this.ASB.setClass ("data-add", 0)
		this.busy (0)
		super.set_file (idx)
		this.focus ()
	}
	async disassm () {
		if (this.File.overflow ())
			return this.error (this.CFG.ERROR.ORG)

		this.ASB.show.checked = false
		this.busy ()
		await August.sync ()
		this.File.get_params ()
		let t0 = August.now ()
		this.Disassm.decode (this.File)
		let t1 = August.now ()
		this.assm ()
		let t2 = August.now ()
		this.dump ()
		let t3 = August.now ()
		console.log (`decode=${t1 - t0}ms assm=${t2 - t1}ms dump=${t3 - t2}ms total=${t3 - t0}ms`)
		this.Highlight = null
		this.Jump.clear ()
		this.app.focus ()
		this.busy ()
		this.File.Disassm.no_lbl.forEach (a => {
//			console.log ("no lbl", a.hex16)
		})
	}
	assm () {
		this.$("assm").setClass ("addr", this.File.AddrShow)
			.setClass ("code", this.File.CodeShow)
			.setClass ("lower-case", this.File.LowerCase)
		this.$("assm").innerHTML = this.Disassm.assm (
			this.File,
			{
				align:		( t, l ) => t + "\t".repeat ((l >> 3) - (t.length >> 3)),
				line:		( ... $ ) => `<div><addr>\t</addr><code>\t\t</code>${$.join ("\t")}</div>`,
				line_addr:	( a, ... $ ) => `<div data-addr=${a} id=--addr-${a.hex16}><addr>${a.hex16}<span>:</span>\t</addr><code>\t\t</code>${isArray ($) ? $.join ("\t") : $}</div>`,
				line_asm:	( a, ref, code, asm ) => `<div ${isSet (ref) && ref != a ? `class=hand data-ref=${ref.hex16}  data-a=ref` : ``} data-addr=${a} id=--addr-${a.hex16}><addr>${a.hex16}<span>:</span>\t</addr><code>${code}${"\t".empty (code.length > 7)}\t</code>${asm.join ("\t")}</div>`,
				line_lbl:	( a, lbl ) => `<div data-addr=${a}><addr>${a.hex16}<span>:</span>\t</addr><code>\t\t</code>${lbl.join ("\t")}</div>`,
				code_lbl:	( lbl, type = "lbl" ) => `<code-lbl data-type=${type}>${lbl}:</code-lbl>`,
				comm:		( c ) => `<comm>; ${c}</comm>`,
				empty:		"<div>\n</div>"
			}
		)
	}
	async dump () {
		let f = this.File
		let n = f.Code.length + 15 >> 4 || 1
		let da = []
		let dc = []
		let dt = []
		let map = f.Disassm ? o => f.Disassm.Map [o] & 0xFC : o => 0
		for (let o = 0, l = 0; l < n; l++) {
			da.push (`<div id=dump-addr-${(o + f.Org).hex16}>${(o + f.Org).HEX16}</div>`)
			let lc = []
			let lt = []
			for (let i = 0; i < 16; i++, o++) {
				if (o < f.Code.length) {
					let c = f.Code [o]
					lc.push (`<code data-offs=${o} class='_${map (o).hex8}'>${c.HEX8}</code>`)
					lt.push (`<samp data-offs=${o}>${this.dump_char (c)}</samp>`)
				} else {
					lc.push (`<code data-offs=${o}></code>`)
					lt.push (`<samp data-offs=${o}></samp>`)
				}
			}
			dc.push (`<div>${lc.join ("")}</div>`)
			dt.push (`<div>${lt.join ("")}</div>`)
		}
		let h = `<header><span></span>${"<code></code>".repeat (16)}</header>`
		this.$("dump").setClass ("color", f.DumpColor)
		this.$("dump").innerHTML = `${h}<div id=addr>${da.join ("")}</div><div id=code>${dc.join ("")}</div><div id=text>${dt.join ("")}</div>`
		this.DumpCursor = null
		this.DumpOffs = null
		await this.set_cursor (this.File.CurOffs)
		for (let [o, c] of f.PrimCode) {
			if (o < f.Code.length && c !== false && c !== f.Code [o]) {
				this.dump_el ("code", o).setClass ("mod", 1)
				this.dump_el ("text", o).setClass ("mod", 1)
			}
		}
	}
	async dump_sidebar_code ( skip ) {
		await August.sync ()
		for (let num of this.DSB.dump_num) {
			if (num === skip)
				continue
			let Size = +num.dataset.size
			let Over = this.DumpOffs + Size > this.File.Code.length
			num.setClass ("noval", Over)
			num.disabled = Over
			if (Over) {
				num.value = ""
				continue
			}
			let Num = 0
			for (let i = 0; i < Size; i++)
				Num += this.File.Code [this.DumpOffs + i] * (1 << i * 8)
			num.numValue = Num
			num.setValue (Num)
		}
		let [Asm, Len, Attr, Addr] = this.File.disassm1 (this.DumpOffs)
		this.$("dump_code").textContent = Len ? [... this.File.Code.subarray (this.DumpOffs, this.DumpOffs + Len)].map (c => c.HEX8).join (" ") : "\u200b"
		this.$("dump_assm").textContent = Len ? Asm : "\u200b"
		this.$("dump_assm").className = Attr & august_disassm.ATTR.UNDOC ? "undoc" : ""
		this.$("cur_addr").textContent = (this.DumpOffs + this.File.Org).HEX16
		this.DumpNextOffs = this.DumpOffs + Len
		this.DumpJmpAddr = Addr
	}
	dump_sidebar_edit ( e ) {
		let Size = +e.$.dataset.size
		if (e.type == "input") {
			e.$.focus ()
			let Role = e.$.dataset.role
			let Lim = 256 ** Size
			let Num = Role == "hex" ? +`0x00${e.$.value}` : +e.$.value
			let ok = Num === Num
				&& Num >= (Role == "sdec" ? -Lim / 2 : 0)
				&& Num < (Role == "sdec" ? Lim / 2 : Lim)
				&& (Role == "hex" || /^(?:[-+]?\d+|)$/i.test (e.$.value.trim ()))
			e.$.setClass ("error", !ok)
			if (ok) {
				for (let i = 0; i < Size; i++) {
					let o = this.DumpOffs + i
					if (!this.File.PrimCode.has (o))
						this.File.PrimCode.set (o, this.File.Code [o])
					this.dump_code ((Num >> 8 * i) & 0xFF, o)
				}
				this.dump_sidebar_code (e.$)
				e.$.numValue = Num
			}
		} else if (e.type == "change") {
			e.$.setClass ("error", 0)
			let c = this.File.Code.slice (e.$.offs, e.$.offs + Size)
			if (c.every (( v, i ) => v === e.$.pc [i]))
				return
			let h = this.File.History
			h.length = h.ptr++
			h.push ({
				undo: {
					o: e.$.offs,
					c: [... e.$.pc],
					do: e.$.offs,
					dn: 0,
					dm: "code"
				},
				redo: {
					o: e.$.offs,
					c: [... c],
					do: e.$.offs,
					dn: 0,
					dm: "code"
				}
			})
		} else {
			let f = e.type == "focus"
			if (f) {
				e.$.offs = this.DumpOffs
				e.$.pc = this.File.Code.slice (e.$.offs, e.$.offs + Size)
			}
			e.$.setValue (e.$.numValue, f ? "" : " ")
			this.dump_hl (e.$.offs, Size, f, "offs-hl")
		}
	}
	dump_sidebar_search () {
		if (!this.DSB.search.ok)
			return
		let Val = this.DSB.search.value.trim ()
		let Num = +Val
		let f = this.File
		if (!f.SearchIndex) {
			f.SearchIndex = new Map
			let Offs = 0
			for (let c of f.Code) {
				if (!f.SearchIndex.has (c))
					f.SearchIndex.set (c, [])
				f.SearchIndex.get (c).push (Offs++)
			}
		}
		for (let [o, s] of f.FoundList)
			this.dump_hl (o, s, 0, "found")
		f.FoundList.clear ()
		f.FoundList.search = Val
		let so = Val && f.SearchIndex.get (Num.b0)
		if (so) {
			let t8 = this.$("search_type8").checked
			let t16 = this.$("search_type16").checked
			let t32 = this.$("search_type32").checked
			let b1 = Num.b1
			let b2 = Num.b2
			let b3 = Num.b3
			for (let o of so) {
				if (t8)
					f.FoundList.set (o, 1)
				if (t16 && f.Code [o + 1] === b1)
					f.FoundList.set (o, 2)
				if (t32 && f.Code [o + 1] === b1 && f.Code [o + 2] === b2 && f.Code [o + 3] === b3)
					f.FoundList.set (o, 4)
			}
		}
		this.dump_found_list ()
	}
	async dump_addr_list () {
		await August.sync ()
		this.$("addr_list").innerHTML = this.dump_list_html (
			[... this.File.OffsList].sort (( a, b ) => a [0] - b [0]),
			"tpl_addr_list",
			{
				MODE	() { return this.$x [1].mode }
			}
		)
		this.File.initAL ()
		this.File.activeAL ()
	}
	async dump_found_list () {
		await August.sync ()
		delete this.File.FoundList.offs
		this.$("found").attr ("count", this.File.FoundList.search ? this.File.FoundList.size : null)
		this.$("found_list").innerHTML = this.dump_list_html (
			[... this.File.FoundList],
			"tpl_found_list",
			{
				SIZE	() { return this.$x [1] }
			}
		)
		this.File.activeFL ()
		for (let [o, s] of this.File.FoundList)
			this.dump_hl (o, s, 1, "found")
	}
	dump_list_html ( list, tpl, add ) {
		let Org = this.File.Org
		return this.$(tpl).textContent.pattern ([{ ... {
			ADDR	() { return (this.$x [0] + Org).hex16 },
			OFFS	() { return this.$x [0] },
			$size	() { return list.length },
			$set	() { this.$x = list [this.$i] }
		}, ... add }])
	}
	dump_list_active ( list, el ) {
		return ( offs = this.DumpOffs ) => {
			if (list.offs === offs)
				return
			if (isSet (list.offs)) {
				let it = el.$(`[offs-${list.offs.hex16}]`)
				if (it)
					it.setClass ("active", 0)
				delete list.offs
			}
			if (list.has (offs)) {
				let it = el.$(`[offs-${offs.hex16}]`)
				if (it) {
					list.offs = offs
					it.setClass ("active", 1).scrollIntoView ({
						behavior: "auto",
						block:    "nearest"
					})
				}
			}
		}
	}
	dump_disassm_addr ( offs ) {
		let Size = 4
		return d => () => {
			if (this.DumpSidebar && d < Size) {
				let [Asm, Len, Attr] = this.File.disassm1 (offs)
				let it = this.$("addr_list").$(`[offs-${offs.hex16}]`)?.$("assm")
				if (it) {
					it.textContent = Len ? Asm : ""
					it.className = Attr & august_disassm.ATTR.UNDOC ? "undoc" : ""
				}
				Size = Len || 4
			}
		}
	}
	dump_code ( code, offs ) {
		if (isArray (code)) {
			for (let c of code)
				this.dump_code (c, offs++)
			return
		}
		this.File.Code [offs] = code
		let pc = this.File.PrimCode.get (offs)
		let mod = isNumber (pc) && pc !== code
		this.QuDu.List.push ({ code, offs, mod })
		if (this.QuDu.Skip)
			return
		this.File.SearchIndex = null
		let qudu = _ => {
			if (++this.QuDu.Skip < 3)
				return requestAnimationFrame (qudu)
			for (let it of this.QuDu.List) {
				let cur = this.dump_cursor (it.offs)
				if (!cur)
					continue
				let isn = it.code !== false
				cur.code.setClass ("mod", isn && it.mod)
				cur.text.setClass ("mod", isn && it.mod)
				cur.code.textContent = isn ? it.code.HEX8 : ""
				cur.text.textContent = isn ? this.dump_char (it.code) : ""
				this.File.Event.fire (`code-${it.offs.hex16}`)
			}
			this.QuDu.List.clear ()
			this.QuDu.Skip = 0
		}
		qudu ()
	}
	dump_edit ( e ) {
		let code_edit = key => {
			let Hex = key.hex (1)
			if (Hex !== Hex)
				return false
			let Offs0 = Offs
			let Code = this.File.Code [Offs]
			let Shift = Nibl ? 0 : 4
			Code &= 0xF0 >> Shift
			Code |= Hex << Shift
			if (!this.File.Resizable && Offs == Last)
				Nibl = 1
			else if (!(Nibl ^= 1))
				Offs++
			code (Offs0, Code)
			return true
		}
		let text_edit = key => {
			if (key.length != 1)
				return false
			if (!this.CODE_XLAT || this.CODE_XLAT.DE != this.DE) {
				this.CODE_XLAT = new Map
				this.CODE_XLAT.DE = this.DE
				disassm.XLAT [this.DE].forEach (( c, i ) => {
					if (c)
						this.CODE_XLAT.set (c, i)
				})
			}
			let Code = this.CODE_XLAT.get (key.charCodeAt (0))
				|| this.CODE_XLAT.get (key.toUpperCase ().charCodeAt (0))
				|| this.CODE_XLAT.get (key.toLowerCase ().charCodeAt (0))
			if (!Code)
				return false
			let Offs0 = Offs
			if (Offs != Last || this.File.Resizable)
				Offs++
			code (Offs0, Code)
			return true
		}
		let code = ( o, c ) => {
			let pc = this.File.Code [o]
			if (pc === c)
				return
			let h = this.File.History
			h.length = h.ptr++
			h.push ({
				undo: {
					o: o,
					c: pc,
					do: o,
					dn: this.DumpNibl,
					dm: this.DumpMode
				},
				redo: {
					o: o,
					c: c,
					do: Offs,
					dn: Nibl,
					dm: this.DumpMode
				}
			})
			if (pc === false && this.File.PrimCode.has (o))
				this.File.PrimCode.delete (o)
			else if (!(pc === false || this.OffsEdit === o || this.File.PrimCode.has (o)))
				this.File.PrimCode.set (o, pc)
			this.OffsEdit = o
			this.dump_code (c, o)
		}
		let move = d => {
			if (d < 0 || !Abroad)
				Offs = (Offs + d).clamp (0, Last)
		}
		let set = p => {
			let s = +this.$("dump").prop ("--start-header")
			Offs = Math.min ((Offs - s & ~0x000F) + s + p, Last)
			Nibl = 0
		}
		let is_code = _ => this.DumpMode == "code"
		let is_text = _ => this.DumpMode == "text"
		let Abroad = this.File.Code.length == this.DumpOffs
		let Last = this.File.Code.length - 1
		let Offs = this.DumpOffs
		let Nibl = this.DumpNibl
		let ShiftKey = e.shiftKey

		if (e.altKey) {
			return true
		} else if (e.ctrlKey) switch (e.keyCode) {
			case 0x25:  //  Left
				if (!this.File.DumpBackward.has (Offs))
					return true
				Offs = this.File.DumpBackward.get (Offs)
				Nibl = 0
				break
			case 0x27:  //  Right
				if (Abroad || !this.DumpNextOffs)
					return true
				if (this.DumpNextOffs > Last || this.DumpNextOffs == Offs)
					return true
				this.File.DumpBackward.set (Offs = this.DumpNextOffs, this.DumpOffs)
				Nibl = 0
				break
			case 0x26:  //  Up
				if (!isSet (this.DumpJmpAddr) || this.DumpJmpAddr - this.File.Org > Last)
					return true
				Offs = this.DumpJmpAddr - this.File.Org
				Nibl = 0
				break
			case 0x24:  //  Home
				Offs = Nibl = 0
				break
			case 0x23:  //  End
				if (!Abroad)
					Offs = Last, Nibl = 0
				break
			case 0x5A:  //  Z
				let h = this.File.History
				let redo = e.shiftKey
				if (!h || (redo ? h.length == h.ptr : !h.ptr))
					return true
				let x = h [redo ? h.ptr++ : --h.ptr][redo ? "redo" : "undo"]
				this.dump_code (x.c, x.o)
				this.dump_mode (x.dm, 0)
				Offs = x.do
				Nibl = x.dn
				ShiftKey = 0
				break
			default:
				return
		} else switch (e.keyCode) {
			case 0x08:  //  BS
				if (!Abroad) {
					if (Offs == 0)
						Nibl = 0
					else if (is_text () || (Nibl ^= 1))
						Offs--
				} else if (Offs) {
					code (--Offs, false)
					this.File.History.last ().undo.do = this.DumpOffs
					this.File.PrimCode.delete (Offs)
				} else {
					return
				}
				break
			case 0x09:  //  Tab
				if (is_code ())
					this.dump_mode ("text")
				else if (is_text ())
					this.dump_mode ("code")
				return true
			case 0x26:  //  Up
				move (-16)
				break
			case 0x28:  //  Down
				move (16)
				break
			case 0x25:  //  Left
				if (Offs == 0)
					Nibl = 0
				else if (e.shiftKey)
					Offs--, Nibl = 0
				else if (is_text () || (Nibl ^= 1))
					Offs--
				break
			case 0x27:  //  Right
				if (Abroad)
					;
				else if (!this.File.Resizable && Offs == Last)
					Nibl = 1
				else if (e.shiftKey)
					Offs++, Nibl = 0
				else if (is_text () || !(Nibl ^= 1))
					Offs++
				break
			case 0x21:  //  PgUp
				move (-256)
				break
			case 0x22:  //  PgDown
				move (256)
				break
			case 0x24:  //  Home
				if ((Last & 0x0F) != 0x0F || (Offs & 0x0F) != 0)
					set (0)
				break
			case 0x23:  //  End
				if (Abroad)
					;
				else if (this.File.Resizable && (Last >> 4) == (Offs >> 4))
					Offs = Last + 1, Nibl = 0
				else
					set (15)
				break
			default:
				if (is_text () && text_edit (e.key))
					;
				else if (is_code () && code_edit (e.key))
					;
				else
					return
				ShiftKey = 0
		}
		if (ShiftKey && this.StartSel !== Offs) {
			if (!isSet (this.StartSel)) {
				if (this.DumpOffs == Offs)
					return
				this.StartSel = this.DumpOffs
			}
			this.dump_select (... this.StartSel < Offs
				? [this.StartSel, Offs - 1]
				: [Offs, this.StartSel - 1]
			)
		} else {
			delete this.StartSel
			window.getSelection ().removeAllRanges ()
		}
		this.set_cursor (Offs, Nibl)
		return true
	}
	dump_mode ( m, rn = 1 ) {
		if (this.DumpMode === m)
			return
		this.$("dump").setClass (this.DumpMode, 0)
		this.$("dump").setClass (this.DumpMode = m, 1)
		if (rn)
			this.$("dump").setClass ("nibl", this.DumpNibl = 0)
	}
	dump_select ( s, e ) {
		document.getSelection ().setBaseAndExtent (
			this.$("dump").$(`code[data-offs="${s}"]`),
			0,
			this.$("dump").$(`code[data-offs="${e}"]`),
			1
		)
	}
	dump_hl ( offs, size, set, cn, bn = "code" ) {
		while (size--)
			this.dump_el (bn, offs++)?.setClass (cn, set)
	}
	dump_el ( bn, o ) {
		return this.$("dump").$(`#${bn}`)?.el (o >> 4)?.el (o & 0x0F)
	}
	dump_char ( c ) {
		let xlat = disassm.XLAT [this.DE][c]
		return xlat ? String.fromCharCode (xlat) : "."
	}
	dump_cursor ( o ) {
		let code = this.dump_el ("code", o)
		let text = this.dump_el ("text", o)
		return code ? { code, text } : null
	}
	get_dump_offs ( c ) {
		let el = c.nodeType == 1 ? c : c.parentElement
		let o = +el.dataset.offs
		if (o !== o)
			o = +el.first ()?.dataset.offs
		return el.isParent (this.$("dump")) && o < this.File.Code.length ? o : false
	}
	async set_cursor ( offs, nibl = 0 ) {
		this.DumpNibl = +nibl
		if (this.DumpSidebar)
			this.dump_sidebar_code ()
		if (this.DumpOffs === offs)
			return this.$("dump").setClass ("nibl", nibl)
		this.DumpOffs = offs
		let size = this.$("dump").$("#addr").children.length
		if (!(offs & 0x0F) && (offs >> 4) == size) {
			let Addr = offs + this.File.Org
			if (!this.$(`dump-addr-${Addr.hex16}`)) {
				let row = c => Array.from ({ length: 16 }, ( _, i ) => `<${c} data-offs=${offs + i}></${c}>`).join ("")
				this.$("dump").$("#addr").appendHTML (`<div id=dump-addr-${Addr.hex16}>${Addr.HEX16}</div>`)
				this.$("dump").$("#code").appendHTML (`<div>${row ("code")}</div>`)
				this.$("dump").$("#text").appendHTML (`<div>${row ("samp")}</div>`)
			}
		} else if ((offs & 0x0F) == 0x0F && (offs + 1 >> 4) < size && offs + 1 >= this.File.Code.length) {
			this.$("dump").$("#addr").removeLast ()
			this.$("dump").$("#code").removeLast ()
			this.$("dump").$("#text").removeLast ()
		}
		await August.sync ()
		this.$("dump").setClass ("nibl", nibl)
		if (this.DumpCursor) {
			this.DumpCursor.code.setClass ("cursor", 0)
			this.DumpCursor.text.setClass ("cursor", 0)
		}
		this.DumpCursor = this.dump_cursor (offs)
		if (!this.DumpCursor)
			return
		this.DumpCursor.code.setClass ("cursor", 1)
		this.DumpCursor.text.setClass ("cursor", 1)
		this.File.Event.fire ("cursor", offs)

		let t = this.$("dump")
		let l = this.DumpCursor.code.parent ()
		let wt = t.scrollTop - l.offsetTop
		let wb = t.scrollTop + t.offsetHeight - t.first ().offsetHeight - l.offsetHeight - l.offsetTop
		if (wt < 0 && wb > 0)
			return
		let sd = wt < 0 && wt < wb ? wb : wt
		let scr = _ => {
			let s = t.scrollTop | 0
			let d = sd / 8 + sd.sign () | 0
			sd -= d
			t.scrollTop -= d
			if (t.scrollTop != s)
				t.af = requestAnimationFrame (scr)
		}
		cancelAnimationFrame (t.af)
		scr ()
	}
	get_line ( l ) {
		return  this.File.DetachLbl && l.prev ()?.dataset.addr == l.dataset.addr
			? l.prev ()
			: l
	}
	assm_scroll_to ( l ) {
		let t = this.$("assm")
		let scr = _ => {
			let s = t.scrollTop | 0
			let d = l.offsetTop - s
			t.scrollTop += d / 8 + d.sign () | 0
			if (t.scrollTop != s)
				t.af = requestAnimationFrame (scr)
		}
		if (t.sel)
			t.sel.setClass ("sel", 0)
		t.sel = l
		l.setClass ("sel", 1)
		cancelAnimationFrame (t.af)
		scr ()
	}
	upload_handler ( name, bin ) {
		let proj = this.get_project (bin)
		if (proj === null) {
			if (this.CFG.BIN_FILE_SIZE_LIMIT && bin.byteLength > this.CFG.BIN_FILE_SIZE_LIMIT)
				return this.error (this.CFG.ERROR.FILE_SIZE.tpl ({ NAME: name }))
			this.new_file (name, new Uint8Array (bin))
			return true
		}
		if (proj === false)
			return false
		this.new_project (proj)
		return true
	}
	save_handler () {
		if (this.File) {
			let Text = this.$("assm").innerText.replaceAll ("\n\n", "\n")
			if (Text)
				this.download_fn (`${this.File.FileName}.asm`, Text + "\n")
		}
	}
	save_project () {
		if (this.File) {
			this.File.get_params ()
			super.save_project (this.File.FileName, this.File)
		}
	}
	keydown ( e ) {
		if (super.keydown (e))
			return true
		if (e.$ === this.$("dump") && this.DumpMode && this.dump_edit (e))
			return false
		if (e.shiftKey) switch (e.keyCode) {
		} else if (e.ctrlKey) switch (e.keyCode) {
			case 0x41:  //  A
				if (!e.altKey)
					this.dump_select (0, this.File.Code.length - 1)
				return false
		} else if (e.altKey) switch (e.keyCode) {
			case 0x41:  //  A
				this.show_panel ({ a: !this.ASB.show.checked })
				return false
			case 0x44:  //  D
				this.show_panel ({ d: !this.DSB.show.checked })
				return false
			case 0x53:  //  S
				this.download_fn (this.File.FileName, [Uint8Array.from (f.Code)])
				return false
		} else switch (e.keyCode) {
			case 0x26:  //  Up
			case 0x28:  //  Down
			case 0x21:  //  PgUp
			case 0x22:  //  PgDown
			case 0x24:  //  Home
			case 0x23:  //  End
				return true
		}
//		console.log (e.keyCode)
	}
	mouse ( e ) {
		if (super.mouse (e))
			return true
		let f = this.File
		switch (e.type) {
			case "mousedown":
				if (e.which == 1) {
					let o = this.get_dump_offs (e.$)
					if (o === false)
						break
					if (e.$.is ("CODE")) {
						this.set_cursor (o, e.$.offsetLeft + e.$.offsetWidth / 2 < e.layerX)
						this.dump_mode ("code", 0)
					} else if (e.$.is ("SAMP")) {
						this.set_cursor (o)
						this.dump_mode ("text", 0)
					}
				}
				break
			case "mouseup":
				if (e.which == 3) {
					let a = this.Jump.pop ()
					if (isSet (a))
						this.assm_scroll_to (this.get_line (this.$(`--addr-${a.hex16}`)))
				}
				break
			case "mouseover": {
				if (e.$.is ("CODE") || e.$.is ("SAMP")) {
					let o = this.MouseDown && this.get_dump_offs (e.$)
					if (o !== false)
						this.set_cursor (o)
					break
				}
				let el = e.$.child (this.$("assm"))
				if (!el)
					break
				let a = +el.dataset.addr
				let d = f.Disassm
				if (e.$.is ("CODE-LBL")) {
					let t = this.$("assm")
					let r = this.$("ref")
					let l = e.$.dataset.type == "abs"
						? d.abs.has (a)
						? d.abs.get (a).ref
						: null
						: e.$.dataset.type == "smc"
						? d.smc.has (a)
						? d.smc.get (a).ref
						: null
						: d.lbl.has (a)
						? d.lbl.get (a).ref
						: d.abs.has (a)
						? d.abs.get (a).ref
						: d.smc.has (a)
						? d.smc.get (a).ref
						: d.im16.get (a)
					if (l) {
						r.attr ("lbl", e.$.textContent.slice (0, -1))
						r.$("ol").innerHTML = l.map (a => `<li data-addr=${el.dataset.addr} data-ref=${a.hex16} data-a=ref>${a.hex16}`).join ("")
						let y = e.$.offsetTop + e.$.offsetHeight - t.scrollTop
						let my = t.offsetHeight - r.offsetHeight - 2
						r.pos (e.$.offsetLeft + t.offsetLeft - t.scrollLeft, y < my ? y : my).setClass ("hide", 0).setClass ("show", 1)
					}
				}
				if (f.Org != d.Org)
					break
				f.CurOffs = a - f.Org
				let m = d.Map [f.CurOffs]
				let l = m === this.Disassm.TYPE.DATA
					? d.Decode [a].data.ds
					: m & this.Disassm.TYPE.MASK
					? (m >> 6) + 1
					: 0
				if (this.Highlight)
					this.dump_hl (... this.Highlight, 0, "highlight")
				if (l) {
					this.Highlight = [f.CurOffs, l]
					this.dump_hl (f.CurOffs, l, 1, "highlight")
					this.set_cursor (f.CurOffs)
				} else {
					this.Highlight = null
					f.CurOffs = 0
				}
				break
			}
			case "mouseout":
				if (e.$.is ("CODE-LBL")) {
					this.$("ref").setClass ("show", 0)
				}
				break
		}
	}
	async click_handler ( e ) {
		let name = super.click_handler (e)
		if (name === true) {
			switch (e.$.dataset.a || e.$.id) {
				case "add_symbol": {
					let addr_inp = this.$("symbol_addr")
					let name_inp = this.$("symbol_name")
					addr_inp.setClass ("error", 0)
					name_inp.setClass ("error", 0)
					await August.sync ()
					let addr = addr_inp.value.trim ().toUpperCase ()
					let name = name_inp.value.trim ()
					if (!/^[\da-fA-F]{4}$/.test (addr))
						return addr_inp.setClass ("error", 1).focus ()
					if (!/^[a-zA-Z]\w+$/.test (name))
						return name_inp.setClass ("error", 1).focus ()
					addr_inp.value = name_inp.value = ""
					if (!this.Disassm.CFG.SYMBOL [addr]) {
						let symbol = []
						for (let a in this.Disassm.CFG.SYMBOL)
							symbol.push ({ a, s: this.Disassm.CFG.SYMBOL [a] })
						symbol.push ({ a: addr, s: name })
						this.Disassm.CFG.SYMBOL = {}
						for (let s of symbol.sort (( a, b ) => a.a.hex () - b.a.hex () ))
							this.Disassm.CFG.SYMBOL [s.a] = s.s
						this.init_symbol_list ()
					}
					break
				}
				case "del_symbol":
					let addr = e.$.dataset.addr
					if (this.Disassm.CFG.SYMBOL [addr]) {
						delete this.Disassm.CFG.SYMBOL [addr]
						this.init_symbol_list ()
					}
					break
			}
			return
		}
		let f = this.File
		if (!f)
			return
		switch (e.$.dataset.a || e.$.id) {
			case "dump_color":
				this.$("dump").setClass ("color", f.DumpColor = e.$.checked)
				break
			case "assm_addr_show":
				this.$("assm").setClass ("addr", f.AddrShow = e.$.checked)
				break
			case "assm_code_show":
				this.$("assm").setClass ("code", f.CodeShow = e.$.checked)
				break
			case "assm_lower_case":
				this.$("assm").setClass ("lower-case", f.LowerCase = e.$.checked)
				break
			case "data_add": {
				let a1 = this.ASB.data_addr1
				let a2 = this.ASB.data_addr2
				let d = this.ASB.data
				if (d.value.length && !d.value.endsWith ("\n"))
					d.value += "\n"
				d.value += a1.value == a2.value
					? a1.value
					: `${a1.value}-${a2.value}`
				d.fire ("input")
				a1.value = a2.value = ""
				this.ASB.setClass ("data-add", 0)
				window.getSelection ().empty ()
				break
			}
			case "save_addr":
				if (!f.OffsList.has (this.DumpOffs)) {
					f.OffsList.set (this.DumpOffs, {
						mode:	this.DumpMode,
						hndlr:	this.File.addr_handler (this.DumpOffs)
					})
					this.dump_addr_list ()
				}
				break
			case "set_addr":
				if (e.$.dataset.offs < f.Code.length) {
					this.set_cursor (+e.$.dataset.offs)
					this.dump_mode (e.$.dataset.mode || "code", 0)
				}
				break
			case "del_addr": {
				let Offs = +e.$.dataset.offs
				if (Offs === this.DumpOffs)
					this.File.activeAL (-1)
				let it = this.$("addr_list").$(`[offs-${Offs.hex16}]`)
				if (it)
					it.parent ().remove (it)
				f.addr_handler_del (Offs, f.OffsList.get (Offs).hndlr)
				f.OffsList.delete (Offs)
				break
			}
			case "reset_search":
				this.DSB.search.value = ""
				this.DSB.search.fire ("input")
				this.DSB.fire ("submit")
				break
			case "ref": {
				let l = this.$(`--addr-${e.$.dataset.ref}`)
				if (l) {
					this.$("ref").setClass ("show", 0).setClass ("hide", 1)
					this.assm_scroll_to (e.$.id ? this.get_line (l) : l)
					if (!this.Jump.length || this.Jump.last () != +e.$.dataset.addr)
						this.Jump.push (+e.$.dataset.addr)
				}
				return
			}
			case "download_bin":
				this.download_fn (
					/\.bin$/i.test (f.FileName)
						? f.FileName
						: `${f.FileName}.bin`,
					[Uint8Array.from (f.Code)]
				)
				break
			case "download_rk": {
				let fn = /\.rkr?$/i.test (f.FileName)
					? f.FileName
					: `${f.FileName}.rk`
				let s = app.crc_rk (f.Code)
				let e = f.Org + f.Code.length - 1
				let head = Uint8Array.from ([f.Org.b1, f.Org.b0, e.b1, e.b0])
				let tail = Uint8Array.from ([0, 0, 0xE6, s.b1, s.b0])
				let code = Uint8Array.from (f.Code)
				this.download_fn (fn, [head, code, tail])
				break
			}
			default:
				return
		}
		this.focus ()
	}
	focus () {
		this.$("dump").focus ()
	}
	proj_sign () {
		return disassm.SIGNATURE
	}

	static Uint8ArrayEx ( u8a = new Uint8Array ) {
		return new Proxy ({
			u8a:	u8a,
			length:	u8a.length,
			[Symbol.iterator] () {
				let idx = 0
				let t = this
				return {
					next () {
						return idx < t.length
							? { done: false, value: t.u8a [idx++] }
							: { done: true }
					},
					done () {
						return !(idx < t.length)
					},
					return () {
						return { done: true }
					}
				}
			}
		}, {
			$u8a ( t, s ) {
				let u8a = new Uint8Array (s)
				u8a.set (t.u8a)
				return u8a
			},
			get ( t, p ) {
				if (p === "length")
					return t.length
				if (p === "toJSON")
					return () => t.u8a.slice (0, t.length)
				if (p === Symbol.iterator)
					return t [p].bind (t)
				let n = +p
				if (n === n && Number.isInteger (n))
					return n < t.length ? t.u8a [n] : false
				let it = t.u8a [p]
				return isFunction (it) ? it.bind (t.u8a) : it
			},
			set ( t, p, v ) {
				let n = +p
				if (n === n && Number.isInteger (n)) {
					if (v === false) {
						if (n != t.length - 1)
							return false
						t.u8a [n] = 0
						t.length--
						return true
					}
					if (n >= t.length)
						t.length = n + 1
					if (n >= t.u8a.length)
						t.u8a = this.$u8a (t, n + 16 & ~0x0F)
				}
				return Reflect.set (t.u8a, p, v)
			},
			has ( t, p ) {
				return Reflect.has (t.u8a, p)
			},
			ownKeys ( t ) {
//console.log ("ownKeys")
				return Reflect.ownKeys (t.u8a)
//				return [... Array (t.length).keys ()].map (i => i.toString ())
			},
			getOwnPropertyDescriptor ( t, p ) {
				return Reflect.getOwnPropertyDescriptor (t.u8a, p)
			}
		})
	}

	static FILE_PROTO = {
		init ( app ) {
			this.extend ({
				app:		{ value: app },
				$A:		{ value: app.ASB },
				$D:		{ value: app.DSB },
				Disassm:	{ value: null, writable: true },
				SearchIndex:	{ value: null, writable: true },
				Search:		{ value: "", writable: true },
				Event:		{ value: new august_event () },
				activeAL:	{ value: app.dump_list_active (this.OffsList, app.$("addr_list")) },
				activeFL:	{ value: app.dump_list_active (this.FoundList, app.$("found_list")) }
			})
			this.Event.on ("cursor", this.activeAL)
			this.Event.on ("cursor", this.activeFL)
			for (let [Offs, Data] of this.OffsList)
				this.addr_handler (Offs)
		},
		get_params () {
			this.ConstSec = this.app.$("const_section").checked
			this.DetachLbl = this.app.$("detach_lbl").checked
			this.CountRef = this.app.$("count_ref").checked
			this.UdocCode = this.app.$("undoc_code").checked
			this.Resizable = this.app.$("resizable").checked
			this.AddrShow = this.app.$("assm_addr_show").checked
			this.CodeShow = this.app.$("assm_code_show").checked
			this.LowerCase = this.app.$("assm_lower_case").checked
			this.DumpColor = this.app.$("dump_color").checked
			this.DumpScroll = this.app.$("dump").scrollTop
			this.AssmScroll = this.app.$("assm").scrollTop
			this.CurOffs = this.app.DumpOffs
			this.Arch = +this.$A.arch.value
			this.Search = this.$D.search.value
			this.HistoryPtr = this.History.ptr
			this.Data.clear ()
			for (let d of this.$A.data.value.split ("\n")) {
				if (/^\s*([\da-fA-F]+)\s*-\s*([\da-fA-F]+)\s*$/.test (d)) {
					let a1 = RegExp.$1.hex ()
					let a2 = RegExp.$2.hex ()
					if (!this.in (a1))
						continue
					if (!this.in (a2))
						a2 = this.Code.length + this.Org - 1
					while (a1 <= a2)
						this.Data.set (a1++ - this.Org, 1)
					continue
				}
				while (/^,?\s*([\da-fA-F]+)\s*(.*)$/.test (d)) {
					let a = RegExp.$1.hex ()
					if (this.in (a))
						this.Data.set (a - this.Org, 1)
					d = RegExp.$2
				}
			}
		},
		set_params () {
			let set_a = $ => {
				if (a1 === null)
					;
				else if (a2 + 1 == $)
					return a2++
				else if (a1 == a2)
					d.push (a1.hex16)
				else
					d.push (`${a1.hex16}-${a2.hex16}`)
				a1 = a2 = $
			}

			this.app.$("const_section").checked = this.ConstSec
			this.app.$("detach_lbl").checked = this.DetachLbl
			this.app.$("count_ref").checked = this.CountRef
			this.app.$("undoc_code").checked = this.UdocCode
			this.app.$("resizable").checked = this.Resizable
			this.app.$("assm_addr_show").checked = this.AddrShow
			this.app.$("assm_code_show").checked = this.CodeShow
			this.app.$("assm_lower_case").checked = this.LowerCase
			this.app.$("dump_color").checked = this.DumpColor
			this.app.$("dump").scrollTop = this.DumpScroll || 0
			this.app.$("assm").scrollTop = this.AssmScroll || 0
			this.History.ptr = this.HistoryPtr
			delete this.OffsList.offs
			delete this.FoundList.offs
			let d = []
			let a1 = null
			let a2 = null
			for (let [o, t] of this.Data) {
				if (t)
					set_a (o + this.Org)
			}
			set_a (0)
			this.$A.org.value = this.Org.hex16
			this.$A.arch.value = this.Arch
			this.$A.data.value = d.join ("\n")
			this.$A.data.fire ("input")
			this.$D.search.value = this.Search
			this.$D.search.fire ("input")
		},
		addr_handler ( offs ) {
			let Disassm = this.app.dump_disassm_addr (offs)
			return Array.from ({ length: 4 }, ( _, d ) => {
				let Hndlr = Disassm (d)
				this.Event.on (`code-${(offs + d).hex16}`, Hndlr)
				return Hndlr
			})
		},
		addr_handler_del ( offs, hndlr ) {
			for (let h of hndlr)
				this.Event.un (`code-${(offs++).hex16}`,  h)
		},
		initAL () {
			for (let [o, d] of this.OffsList)
				this.Event.fire (`code-${o.hex16}`)
		},
		disassm1 ( offs ) {
			return this.app.disassm1 (this, offs, "%MNEMO%%?\t%OP%?%")
		},
		overflow () {
			return this.Org + this.Code.length > 0x10000
		},
		in ( a ) {
			return a == a.clamp (this.Org, this.Code.length + this.Org - 1)
		}
	}

	FontSize = 0
	Highlight = null
	Jump = []
	QuDu = {
		List: [],
		Skip: 0
	}

	static XLAT = {
		"86RK": [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 
			0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 
			0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 
			0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 
			0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 
			0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
			0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 
			0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F,
			0x042E, 0x0410, 0x0411, 0x0426, 0x0414, 0x0415, 0x0424, 0x0413,
			0x0425, 0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E,
			0x041F, 0x042F, 0x0420, 0x0421, 0x0422, 0x0423, 0x0416, 0x0412,
			0x042C, 0x042B, 0x0417, 0x0428, 0x042D, 0x0429, 0x0427, 0x2588
		],
		"KOI8R": [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 
			0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 
			0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 
			0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 
			0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 
			0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
			0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 
			0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F,
			0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 
			0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
			0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 
			0x78, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7E, 0x7F,
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
	}

	static SYMBOL = {
		"F800":	"COLD_START",
		"F803":	"IN_CHAR",
		"F806":	"TAPE_RD_BYTE",
		"F809":	"OUT_CHAR",
		"F80C":	"TAPE_WR_BYTE",
		"F80F":	"OUT_CHAR_A",
		"F812":	"KBD_STATE",
		"F815":	"OUT_HEX",
		"F818":	"OUT_STR",
		"F81B":	"IN_KEY",
		"F81E":	"GET_CURSOR",
		"F821":	"GET_SCR",
		"F824":	"TAPE_RD_BLOCK",
		"F827":	"TAPE_WR_BLOCK",
		"F82A":	"CHECK_SUM",
		"F82D":	"INIT_VIDEO",
		"F830":	"GET_RAM_TOP",
		"F833":	"SET_RAM_TOP",
		"F836":	"BANK_RD_BLOCK",
		"F839":	"BANK_WR_BLOCK",
		"F83C":	"SET_CURSOR",
		"F83F":	"SYNTHESIZER",
		"F842":	"SET_CHARSET",
		"F845":	"CONFIG_RK",
		"F86C":	"MONITOR"
	}

	static NEW_PROJECT_NAME_TPL = "Project #%NUM% / %DATE_NOW(\"dd mmm yyyy HH:ii:ss\")%"
	static SIGNATURE = ".disassm.project"
}

