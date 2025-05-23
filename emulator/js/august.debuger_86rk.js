//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.debuger_86rk.js


"use strict"

class august_debuger_86rk {
	constructor ( app ) {
		return new Promise (async ( resolve, reject ) => {
			const undef = () => typeof august_disassm === "undefined"
			if (undef ()) {
				app.busy ()
				await app.load_js ("../../disassm/js/august.disassm.js")
				const html = await app.load (`debuger.${app.LANG}.html`.set ("v"))
				app.busy ()
				if (undef () || !html)
					return resolve (null)
				app.app.appendHTML (html)
				app.add_cfg ()
			}
			resolve (this)
			const memory_get = this.memory_get.bind (this)
			const memory_set = this.memory_set.bind (this)
			this.app = app
			this.app.app.$("app-emulator").setClass ("debuger", 1)
			this.app.Comp.suspend (1)
			this.status_tpl = app.$("tpl_status").textContent.trim ()
			this.bp_list_tpl = app.$("tpl_bp_list").textContent.trim ()
			this.cpu = app.Comp.cpu ()
			this.memory = this.cpu.Memory
			this.cpu.Memory = new Proxy (this.memory, new class {
				get ( t, p, r ) {
					if (p == "get")
						return memory_get
					if (p == "set")
						return memory_set
					return Reflect.get (t, p, r)
				}
				set ( t, p, v, r ) {
					return Reflect.set (t, p, v, r)
				}
			})
			this.reset_tics ()
			this.Regs = new august_debuger_86rk.regs (this)
			this.Flags = new august_debuger_86rk.flags (this)
			this.Dump = new august_debuger_86rk.dump (this)
			this.Disassm = new august_debuger_86rk.disassm (this)
			this.Tool = [null, this.Disassm, this.Regs, this.Flags, this.Dump]
			this.CurTool = 0
			this.AutoID = 0
			this.resize_bind = this.resize.bind (this)
			window.addEventListener ("resize", this.resize_bind)
		})
	}
	done () {
		window.removeEventListener ("resize", this.resize_bind)
		clearTimeout (this.AutoID)
		this.tool (0)
		this.bp_list_hide ()
		this.Regs.done ()
		this.Flags.done ()
		this.Dump.done ()
		this.Disassm.done ()
		this.app.$("status").innerHTML = ""
		this.Regs = this.Flags = this.Dump = this.Disassm = this.Tool = void 0
		this.cpu.Memory = this.memory
		this.app.app.$("app-emulator").setClass ("debuger", 0)
		this.app.Comp.resume ()
	}
	resize () {
		this.Dump.resize ()
		this.Disassm.resize ()
	}
	status () {
		const DEVICE = this.app.Comp.device ()
		this.app.$("status").innerHTML = this.status_tpl.tpl ({
			TICS:		this.app.Comp.tics () - this.Tics,
			DMA_ADDR:	DEVICE.DMA.r [6].HEX16,
			DMA_COUNT:	(DEVICE.DMA.r [7] & 0x3FFF).HEX16,
			CRT_COLS:	DEVICE.CRT.CharsPerRow,
			CRT_ROWS:	DEVICE.CRT.RowsNo,
			CRT_LPR:	DEVICE.CRT.LinesNo,
			CRT_UL:		DEVICE.CRT.Underline,
			CRT_LO:		"".true (DEVICE.CRT.OffsetLine),
			CRT_TA:		"".true (DEVICE.CRT.TransparentAttr),
			CRT_BS:		DEVICE.CRT.BurstSpaceCount,
			CRT_BC:		DEVICE.CRT.BurstCount,
			CRT_FR:		(1000 / DEVICE.CRT.FramePeriod).toFixed (1)
		})
	}
	reset_tics () {
		this.Tics = this.app.Comp.tics ()
		this.status ()
	}
	reset () {
		this.status ()
		this.Regs.out ()
		this.Flags.out ()
		this.Disassm.disassm ()
	}
	run () {
		if (this.app.Comp.stopped ())
			this.app.Comp.resume ()
		else
			this.app.Comp.suspend (1), this.reset ()
	}
	async step ( over ) {
		const exec = async () => {
			const Attr = this.Disassm.get_attr ()
			if (Attr & august_disassm.ATTR.END)
				return false
			const sp = this.cpu.Regs.SP
			const pc = this.Disassm.next_pc ()
			await this.app.Comp.exec (Attr & august_disassm.ATTR.SUB
				? _ => this.cpu.Regs.SP === sp
				: _ => this.cpu.Regs.PC === pc
			)
			return true
		}
		if (this.app.Comp.stopped ())
			over && await exec () || this.app.Comp.step ()
		if (!this.Tool)
			return this.app.Comp.resume ()
		this.status ()
		this.Regs.out ()
		this.Flags.out ()
		this.Disassm.new_pc ()
	}
	auto () {
		if (this.AutoID !== 0) {
			clearTimeout (this.AutoID)
			this.AutoID = 0
			return
		}
		const auto = () => {
			this.AutoID = setTimeout (auto)
			this.step ()
		}
		auto ()
	}
	memory_get ( a ) {
		if (!this.app.Comp.stopped () && !this.Triggered)
			this.Triggered = this.bp_check (a, "rd")
		return this.memory.get (a)
	}
	memory_set ( a, v ) {
		if (!this.app.Comp.stopped () && !this.Triggered)
			this.Triggered = this.bp_check (a, "wr")
		this.memory.set (a, v)
		this.Dump.memory_set (a)
		return v
	}
	bp () {
		if (this.Triggered)
			this.Triggered = false
		else if (this.LastPC === this.cpu.Regs.PC || !this.bp_check (this.cpu.Regs.PC, "exec"))
			return this.LastPC = this.cpu.Regs.PC, false
		this.LastPC = this.cpu.Regs.PC
		this.app.Comp.suspend (1)
		this.reset ()
		return true
	}
	bp_check ( addr, type ) {
		const bp = this.#bp.get (addr) || this.#bp_range.get (addr)
		return isSet (bp) && bp.active && bp.type == type
			&& (!bp.hits || !(++bp.count, bp.count %= bp.hits))
	}
	bp_list () {
		if (this.app.Modal)
			return

		this.app.Comp.keyboard (0)
		const m = this.app.modal (
			this.app.CFG.MODAL_TITLE.BP_LIST,
			null,
			null,
			"dialog bp_list",
			"",
			() => {
				this.app.Comp.keyboard (1)
			}
		)
		const out_list = () => {
			const list = [... this.#bp]
			m.innerHTML = this.bp_list_tpl.pattern ([{
				ADDR		() { return list [this.$i][0].HEX16 },
				ADDR_END	() { return isNaN (this.$x.end) ? "" : this.$x.end.HEX16 },
				ADDR_MASK	() { return isNaN (this.$x.mask) ? "" : this.$x.mask.HEX16 },
				TYPE		() { return this.$x.type },
				HITS		() { return this.$x.hits },
				ON		() { return this.$x.active },
				$size		() { return list.length },
				$set		() { this.$x = list [this.$i][1] }
			}])

			const form = m.$("form")
			form.bp_addr.focus ()
			form.bp_addr.onkeydown = form.bp_addr_end.onkeydown =
			form.bp_addr_mask.onkeydown = form.bp_hits.onkeydown = e => {
				if (e.keyCode == 27)
					return this.bp_list_hide ()
				this.input_check (e)
			}
			form.bp_trig.onchange = e => {
				form.bp_hits.setClass ("disabled", !+e.$.value)
				if (+e.$.value)
					form.bp_hits.focus ()
			}
			form.onsubmit = async e => {
				e.stop ()
				form.bp_addr.setClass ("error", 0)
				form.bp_addr_end.setClass ("error", 0)
				form.bp_addr_mask.setClass ("error", 0)
				await August.sync ()
				const addr = form.bp_addr.value.hex ()
				const addr_end = form.bp_addr_end.value.hex ()
				const addr_mask = form.bp_addr_mask.value.hex ()
				if (isNaN (addr) || addr > 0xFFFF) {
					form.bp_addr.select ()
					form.bp_addr.focus ()
					form.bp_addr.setClass ("error", 1)
					return
				}
				if (!isNaN (addr_end) && (addr_end < addr || addr_end > 0xFFFF)) {
					form.bp_addr_end.select ()
					form.bp_addr_end.focus ()
					form.bp_addr_end.setClass ("error", 1)
					return
				}
				if (!isNaN (addr_mask) && (addr_mask == 0 || addr_mask > 0xFFFF)) {
					form.bp_addr_mask.select ()
					form.bp_addr_mask.focus ()
					form.bp_addr_mask.setClass ("error", 1)
					return
				}
				const bp = {
					end:	addr_end,
					mask:	addr_mask,
					type:	form.bp_type.value,
					hits:	+form.bp_trig.value && +form.bp_hits.value > 1 ? +form.bp_hits.value : 0,
					count:	0,
					active:	form.bp_on.checked
				}
				const prev_bp = this.#bp.get (addr)
				if (prev_bp)
					this.bp_addr_del_range (prev_bp, addr)
				this.#bp.set (addr, bp)
				if (!isNaN (addr_end)) {
					for (let a = addr + 1; a <= addr_end; a++) {
						if (isNaN (addr_mask) || (a & addr_mask) == addr)
							this.#bp_range.set (a, bp)
					}
				}
				if (bp.type == "exec")
					this.Disassm.set_bp (addr, bp.active)
				out_list ()
			}
		}
		const copy = addr => {
			const bp = this.#bp.get (addr)
			if (!bp)
				return
			const form = m.$("form")
			form.bp_addr.value = addr.HEX16
			form.bp_addr_end.value = isNaN (bp.end) ? "" : bp.end.HEX16
			form.bp_addr_mask.value = isNaN (bp.mask) ? "" : bp.mask.HEX16
			form.bp_type.value = bp.type
			form.bp_trig.value = bp.hits ? 1 : 0
			form.bp_hits.value = bp.hits || ""
			form.bp_on.checked = bp.active
			form.bp_hits.setClass ("disabled", !bp.hits)
		}

		this.app.Modal.out_list = out_list
		this.app.Modal.copy = copy
		out_list ()
	}
	bp_addr_on ( el ) {
		const addr = el.dataset.addr.hex ()
		const bp = this.#bp.get (addr)
		if (bp)
			this.Disassm.set_bp (addr, bp.active = el.checked)
	}
	bp_addr_del ( addr ) {
		const bp = this.#bp.get (addr)
		if (this.#bp.delete (addr)) {
			this.app.Modal?.out_list?.()
			this.Disassm.set_bp (addr, 0)
			this.bp_addr_del_range (bp, addr)
		}
	}
	bp_addr_del_range ( bp, addr ) {
		if (!isNaN (bp.end)) {
			for (let a = addr + 1; a <= bp.end; a++) {
				if (isNaN (bp.mask) || (a & bp.mask) == addr)
					this.#bp_range.delete (a)
			}
		}
	}
	bp_addr_copy ( addr ) {
		this.app.Modal?.copy?.(addr)
	}
	bp_list_hide () {
		this.app.Modal?.hide ()
	}
	bp_get ( addr ) {
		return this.#bp.get (addr)
	}
	bp_set ( addr ) {
		const bp = this.#bp.get (addr)
		if (this.#bp.delete (addr))
			return this.bp_addr_del_range (bp, addr), false
		this.#bp.set (addr, {
			end:	NaN,
			mask:	NaN,
			type:	"exec",
			hits:	0,
			count:	0,
			active:	true
		})
		return true
	}
	input_check ( e ) {
		return (e.$.dataset.num === "dec" ? /^\d$/ : /^[0-9a-fA-F]$/).test (e.key)
			|| [8, 13, 35, 36, 37, 39, 46].includes (e.keyCode)
			|| e.stop ()
	}
	tool ( a ) {
		this.Tool [this.CurTool]?.view.setClass ("active", a)
	}
	keydown ( e ) {
		if (e.altKey) switch (e.keyCode) {
			case 91:  //  Meta
				this.reset ()
				return
		}
		if (e.ctrlKey) switch (e.keyCode < 96 ? e.keyCode : e.keyCode - 48) {
			case 48:  //  0-7
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
				this.Flags.inv (e.keyCode & 0x07)
				return
		}
		switch (e.keyCode) {
			case 116:  //  F5
				this.run ()
				return
			case 117:  //  F6
				return
			case 118:  //  F7
			case 119:  //  F8
				this.step (e.keyCode == 119)
				return
			case 120:  //  F9
				this.auto ()
				return
			case 121:  //  F10
				this.bp_list ()
				return
		}
		if (e.altKey)
			return
		if (this.AutoID)
			return this.app.Comp.device ().KEYBOARD.keydown (e)
		if (e.ctrlKey && (e.keyCode == 48 || e.keyCode == 96))
			return this.reset_tics ()
		if (this.Tool [this.CurTool]?.keydown?.(e) || e.keyCode != 9)
			return
		this.tool (0)
		this.CurTool += e.shiftKey ? this.Tool.length - 1 : 1
		this.CurTool %= this.Tool.length
		this.Dump.set_mode (e.shiftKey ? "text" : "code")
		this.tool (1)
		this.app.app.dispatchEvent (new KeyboardEvent ("keydown"))
	}
	mouse ( e ) {
		const t = e.$.isParent (this.app.$("dump"), this.app)
			? this.Dump
			: e.$.isParent (this.app.$("disassm"), this.app)
			? this.Disassm
			: e.$.isParent (this.app.$("regs"), this.app)
			? this.Regs
			: e.$.isParent (this.app.$("flags"), this.app)
			? this.Flags
			: void 0
		if (!t)
			return

		switch (e.type) {
			case "wheel":
				if (e.wheelDelta > 0)
					e.ctrlKey ? t.page_prev?.(1) : t.line_prev?.(1)
				else
					e.ctrlKey ? t.page_next?.(1) : t.line_next?.(1)
				break
			case "click":
				this.tool (0)
				this.CurTool = this.Tool.indexOf (t)
				this.tool (1)
				e.$.ev = e
				t.click?.(e.$)
				break
			case "dblclick":
				t.dblclick?.(e.$)
				break
		}
	}
	click_handler ( e ) {
		switch (e.$.name) {
			case "reset":
				this.reset ()
				return
			case "run":
				this.run ()
				return
			case "step":
			case "over":
				this.step (e.$.name == "over")
				return
			case "auto":
				this.auto ()
				return
			case "reset_tics":
				this.reset_tics ()
				return
			case "bp_list":
				this.bp_list ()
				return
			case "bp_list_hide":
				this.bp_list_hide ()
				return
			case "bp_addr_on":
				this.bp_addr_on (e.$)
				return
			case "dump_menu":
				this.Dump.menu_show ()
				return
		}
		const addr = e.$.dataset.addr?.hex ()
		switch (e.$.dataset.a) {
			case "dump":
				this.Dump.dump (addr)
				this.Dump.menu_hide ()
				return
			case "menu_addr_del":
				this.Dump.menu_addr_del (addr)
				return
			case "bp_addr_del":
				this.bp_addr_del (addr)
				return
			case "bp_addr_copy":
				this.bp_addr_copy (addr)
				return
		}
		this.mouse (e)
	}

	#bp = new Map
	#bp_range = new Map

	static dump = class dump {
		constructor ( debug ) {
			this.debug = debug
			this.view = debug.app.$("dump")
			this.menu = debug.app.$("dump_menu")
			this.view.innerHTML = debug.app.$("tpl_dump_header").textContent.trim ().tpl ()
			this.tpl = debug.app.$("tpl_dump_line").textContent.trim ()
			this.menu_tpl = debug.app.$("tpl_dump_menu").textContent.trim ()
			this.cpu = debug.cpu
			this.memory = debug.memory
			this.cache = new Map
			this.menu_addr = new Map
			this.dump (this.cpu.Regs.PC)
			this.set_mode ("code")
			this.CODE_XLAT = new Map
			dump.XLAT.forEach (( c, i ) => {
				if (c)
					this.CODE_XLAT.set (c, i)
			})
		}
		done () {
			if (this.menu.hasClass ("show"))
				this.menu_hide ()
			this.set_mode ("")
			this.view.innerHTML = ""
		}
		calc_size () {
			return this.view.getStyle ("height") / this.view.first ().offsetHeight - 1 | 0 || 1
		}
		resize () {
			if (this.size != this.calc_size ()) {
				this.size = 0
				this.dump ()
			}
		}
		dump ( addr ) {
			let prev = this.addr
			if (isSet (addr))
				this.addr = addr & ~0x0F
			if (this.addr != prev || !this.size) {
				this.cache.clear ()
				this.size = this.calc_size ()
				while (this.view.remove (this.view.first ().next ()));
				for (let i = 0, addr = this.addr; i < this.size; i++, addr += 16)
					this.view.appendHTML (this.line (addr))
			}
			if (isSet (addr) || this.outside (this.cursor.addr)) {
				this.set_cursor (addr ?? this.addr)
				this.set_mode ("code")
			} else {
				this.set_cursor (this.cursor.addr)
			}
		}
		line ( addr ) {
			let c = []
			let t = []
			for (let i = 0; i < 16; i++) {
				let b = this.memory.get (addr.w0 + i)
				c.push (`<code>${b.HEX8}</code>`)
				t.push (`<samp>${this.char (b)}</samp>`)
			}
			return this.tpl.tpl ({
				ADDR:	addr.HEX16,
				CODE:	c.join (""),
				TEXT:	t.join ("")
			})
		}
		line_prev0 () {
			this.cache.clear ()
			this.addr -= 16
			this.addr &= 0xFFFF
			this.view.remove (this.view.last ())
			this.view.insertHTML (this.line (this.addr), this.view.first ().next ())
		}
		line_next0 () {
			this.cache.clear ()
			this.view.remove (this.view.first ().next ())
			this.view.appendHTML (this.line (this.addr + this.size * 16))
			this.addr += 16
			this.addr &= 0xFFFF
		}
		line_prev () {
			this.line_prev0 ()
			if (this.outside (this.cursor.addr))
				this.cursor.addr -= 16
			this.set_cursor (this.cursor.addr, this.cursor.nibl)
		}
		line_next () {
			this.line_next0 ()
			if (this.outside (this.cursor.addr))
				this.cursor.addr += 16
			this.set_cursor (this.cursor.addr, this.cursor.nibl)
		}
		page_prev () {
			let n = this.size
			while (n--)
				this.line_prev0 ()
			this.set_cursor (this.cursor.addr - this.size * 16, this.cursor.nibl)
		}
		page_next () {
			let n = this.size
			while (n--)
				this.line_next0 ()
			this.set_cursor (this.cursor.addr + this.size * 16, this.cursor.nibl)
		}
		menu_show () {
			if (this.menu.hasClass ("show"))
				return this.menu_hide ()
			let self = this
			let list = (function* () {
				const REGS = self.cpu.NAME == "Z80"
					? ["BC", "DE", "HL", "IX", "IY", "SP", "PC"]
					: ["BC", "DE", "HL", "SP", "PC"]
				for (let r of REGS)
					yield { r, a: self.cpu.Regs [r].HEX16 }
				for (let [k, a] of self.menu_addr)
					yield { a: a.HEX16 }
			})()
			this.menu.innerHTML = this.menu_tpl.pattern ([{
				REG	() { return this.$x.value.r },
				ADDR	() { return this.$x.value.a },
				$size	() { this.$x = list.next (); return this.$x.done ? 0 : Number.MAX_SAFE_INTEGER }
			}])
			this.menu.pos (this.view.offsetLeft, this.view.offsetTop + this.view.first ().offsetHeight)
				.setClass ("show")
			let addr = this.debug.app.$("dump_addr")
			if (!addr)
				return
			addr.onkeydown = e => {
				if (e.keyCode == 13) {
					let a = addr.value.hex ()
					if (!isNaN (a)) {
						if (!this.menu_addr.has (a & ~0x0F))
							this.menu_addr.set (a & ~0x0F, a)
						this.dump (a)
					}
					this.menu_hide ()
				} else if (e.keyCode == 27) {
					this.menu_hide ()
				}
				this.debug.input_check (e)
			}
			addr.focus ()
			this.debug.app.Comp.keyboard (0)
		}
		menu_hide () {
			this.debug.app.Comp.keyboard (1)
			this.menu.setClass ("show", 0)
			this.menu.innerHTML = ""
		}
		menu_addr_del ( a ) {
			if (this.menu_addr.delete (a & ~0x0F)) {
				this.menu.setClass ("show")
				this.menu_show ()
			}
		}
		memory_set ( addr ) {
			if (this.outside (addr))
				return
			let b = this.memory.get (addr)
			let cell = this.cache.get (addr)
			if (!isSet (cell))
				this.cache.set (addr, cell = this.cell (addr))
			if (cell.code)
				cell.code.textContent = b.HEX8
			if (cell.text)
				cell.text.textContent = this.char (b)
		}
		cell ( addr ) {
			let line = this.view.$(`#__dump_${(addr & 0xFFF0).HEX16}`)
			return {
				code: line?.all ("code")[addr & 0x0F],
				text: line?.all ("samp")[addr & 0x0F]
			}
		}
		outside ( addr ) {
			let last = (this.addr + this.size * 16).w0
			if (this.addr < last && (addr < this.addr || addr >= last))
				return true
			if (this.addr > last && (addr < this.addr && addr >= last))
				return true
		}
		set_cursor ( addr, nibl = 0 ) {
			addr = addr.w0
			this.cursor?.code.setClass ("cursor", 0)
			this.cursor?.text.setClass ("cursor", 0)
			this.cursor = { ... this.cell (addr), addr, nibl }
			this.cursor.code.setClass ("cursor", 1)
			this.cursor.text.setClass ("cursor", 1)
			this.view.setClass ("nibl", nibl)
		}
		set_mode ( mode ) {
			this.view.setClass (this.edit_mode, 0)
			this.view.setClass (this.edit_mode = mode, 1)
		}
		keydown ( e ) {
			let is_code = _ => this.edit_mode == "code"
			let is_text = _ => this.edit_mode == "text"
			let addr = this.cursor.addr
			let nibl = this.cursor.nibl
			switch (e.keyCode) {
				case 9:  //  Tab
					if (e.shiftKey && is_text ()) {
						this.set_mode ("code")
						return true
					} else if (!e.shiftKey && is_code ()) {
						this.set_mode ("text")
						return true
					}
					return
				case 38:  //  Up
					if (e.shiftKey)
						return this.line_prev ()
					addr -= 16
					if (e.ctrlKey)
						this.line_prev0 ()
					break
				case 40:  //  Down
					if (e.shiftKey)
						return this.line_next ()
					addr += 16
					if (e.ctrlKey)
						this.line_next0 ()
					break
				case 8:   //  BS
				case 37:  //  Left
					if (is_text () || (nibl ^= 1))
						addr--
					break
				case 39:  //  Right
					if (is_text () || !(nibl ^= 1))
						addr++
					break
				case 33:  //  PgUp
					this.page_prev ()
					return
				case 34:  //  PgDown
					this.page_next ()
					return
				case 36:  //  Home
					if (e.ctrlKey)
						return this.dump (0)
					addr &= ~0x0F
					nibl = 0
					break
				case 35:  //  End
					if (e.ctrlKey)
						return this.dump (0x10000 - this.size * 16)
					addr |= 0x0F
					nibl = 0
					break
				case 13:  //  Enter
					this.cpu.Regs.PC = addr
					this.debug.Regs.out_reg ("PC")
					break
				default:
					if (is_code ()) {
						let hex = e.key.hex (1)
						if (isNaN (hex))
							return
						let shift = nibl ? 0 : 4
						let code = this.memory.get (addr)
						code &= 0xF0 >> shift
						code |= hex << shift
						this.cpu.Memory.set (addr, code)
						if (!(nibl ^= 1))
							addr++
					} else if (is_text ()) {
						let code = e.key.length == 1
							&& this.CODE_XLAT.get (e.key.toUpperCase ())
						if (!code)
							return
						this.cpu.Memory.set (addr, code)
						addr++
					} else {
						return
					}
			}
			if (this.outside (addr.w0)) {
				if (addr < this.cursor.addr)
					this.line_prev0 ()
				else
					this.line_next0 ()
			}
			this.set_cursor (addr, nibl)
		}
		click ( el ) {
			if (!/^__dump_([\dA-F]{4})$/.test (el.parent ().parent ().id))
				return
			if (el.is ("CODE"))
				this.set_mode ("code")
			else if (el.is ("SAMP"))
				this.set_mode ("text")
			else
				return
			let nibl = el.offsetLeft + el.offsetWidth / 2 < el.ev.layerX
			let addr = RegExp.$1.hex ()
			let idx = 0
			while (el = el.prev ())
				idx++
			this.set_cursor (addr + idx, nibl)
		}
		char ( c ) {
			return dump.XLAT [c] || "."
		}

		static XLAT = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			" ", "!", "\"", "#", "$", "%", "&", "'",
			"(", ")", "*", "+", ",", "-", ".", "/",
			"0", "1", "2", "3", "4", "5", "6", "7",
			"8", "9", ":", ";", "<", "=", ">", "?",
			"@", "A", "B", "C", "D", "E", "F", "G",
			"H", "I", "J", "K", "L", "M", "N", "O",
			"P", "Q", "R", "S", "T", "U", "V", "W",
			"X", "Y", "Z", "[", "\\", "]", "^", "_",
			"Ю", "А", "Б", "Ц", "Д", "Е", "Ф", "Г",
			"Х", "И", "Й", "К", "Л", "М", "Н", "О",
			"П", "Я", "Р", "С", "Т", "У", "Ж", "В",
			"Ь", "Ы", "З", "Ш", "Э", "Щ", "Ч", "\u2588",
		]
	}

	static disassm = class disassm {
		constructor ( debug ) {
			this.debug = debug
			this.app = debug.app
			this.view = this.app.$("disassm")
			this.tpl = this.app.$("tpl_disassm").textContent.trim ()
			this.cpu = debug.cpu
			this.memory = debug.memory
			this.disassm1 = (() => {
				let dis1 = new august_disassm ().get_disassm1 ()
				let arch = this.cpu.NAME == "Z80"
					? august_disassm.ARCH.Z80
					: this.cpu.NAME == "8085"
					? august_disassm.ARCH.i8085
					: august_disassm.ARCH.i8080
				return ( addr, tpl = null ) => {
					let code = [
						this.memory.get (addr),
						this.memory.get ((addr + 1).w0),
						this.memory.get ((addr + 2).w0),
						this.memory.get ((addr + 3).w0)
					]
					return [... dis1 ({
						Org:	0,
						Arch:	arch,
						Code:	new Uint8Array (code)
					}, 0, tpl), code]
				}
			})()
			this.instr_size = this.cpu.NAME == "Z80"
				? this.instr_size_Z80
				: this.cpu.NAME == "8085"
				? this.instr_size_8085
				: this.instr_size_8080
			this.view.setClass ("z80", this.cpu.NAME == "Z80")
			this.disassm (this.cpu.Regs.PC)
		}
		done () {
			this.list.clear ()
			this.view.innerHTML = ""
		}
		calc_size () {
			return this.view.getStyle ("height") / this.view.first ().offsetHeight | 0
		}
		resize () {
			if (this.size != this.calc_size ())
				this.disassm ()
		}
		disassm ( addr = this.cpu.Regs.PC ) {
			this.view.innerHTML = this.tpl
			this.size = this.calc_size ()
			this.view.innerHTML = ""
			let List1 = this.list_backward (addr)
			let List2 = this.list_forward (addr)
			this.list = List1.concat (addr, List2)
			this.pc = this.cur_addr = addr
			this.pos0 = Math.min (
				List1.length - Math.min (List1.length, this.size / 2 | 0),
				this.list.length - this.size
			)
			for (let n = this.size, p = this.pos0; n; n--)
				this.add_line (p++)
		}
		add_line ( pos ) {
			let p = pos < 0 ? -pos : pos
			let Addr = this.list [p]
			let Addr2 = this.list [p + 1]
			let [Asm, Len, Attr, _, Code] = this.disassm1 (Addr, this.app.CFG.DISASSM.ASM_TPL)
			let Size = isSet (Addr2) ? Addr2 - Addr : Len
			let Bytes = Code.slice (0, Addr + Size > 0x10000 ? 0x10000 - Addr : Size).map (c => c.HEX8)
			let BP = this.debug.bp_get (Addr)
			let HTML = this.tpl.tpl ({
				BP:	isSet (BP) && BP.active && BP.type == "exec" ? " " : "",
				ADDR:	Addr.HEX16,
				CODE:	Bytes.join (" "),
				INDENT:	this.cpu.NAME == "Z80" && Size < 4 ? 2 : 1,
				ASSM:	Attr & august_disassm.ATTR.UNDOC || Bytes.length != Len
						? this.app.CFG.DISASSM.DB_TPL.tpl ({ BYTES: Bytes.join (", ") })
						: Asm
			})
			if (pos > 0)
				this.view.appendHTML (HTML)
			else
				this.view.insertHTML (HTML, this.view.first ())
			if (Addr == this.pc)
				this.set_pc ()
		}
		set_cur ( set = 0 ) {
			this.view.$(`#__dis_${this.cur_addr.HEX16}`)?.setClass ("current", set)
		}
		set_bp ( addr, set ) {
			this.view.$(`#__dis_${addr.HEX16}`)?.setClass ("bp", set)
		}
		set_pc () {
			this.view.$(`#__dis_${this.pc.HEX16}`)?.setClass ("pc")
		}
		next_pc () {
			return this.instr_size (this.cpu.Regs.PC) + this.cpu.Regs.PC
		}
		new_pc () {
			if (this.pc == this.cpu.Regs.PC)
				return
			if (this.cpu.Regs.PC < this.list [0] || this.cpu.Regs.PC > this.list.last ())
				return this.disassm ()
			while (this.cpu.Regs.PC <= this.list [this.pos0] && this.line_prev ());
			while (this.cpu.Regs.PC >= this.list [this.pos0 + this.size - 1] && this.line_next ());
			this.set_cur ()
			this.set_pc ()
			this.pc = this.cur_addr = this.cpu.Regs.PC
			this.set_pc ()
		}
		line_prev ( set_cur = 0 ) {
			if (this.pos0 == 0) {
				let List = this.list_backward (this.list [0])
				if (!List.length)
					return false
				this.list = List.concat (this.list)
				this.pos0 = List.length
				if (this.list.length >= this.size * 8)
					this.list.length = this.size * 4
			}
			this.view.remove (this.view.last ())
			this.add_line (-(--this.pos0))
			if (set_cur)
				this.cur_addr = Math.min (this.cur_addr, this.list [this.pos0 + this.size - 1])
			return true
		}
		line_next ( set_cur = 0 ) {
			if (this.pos0 + this.size == this.list.length) {
				let List = this.list_forward (this.list.last ())
				if (!List.length)
					return false
				this.list = this.list.concat (List)
				if (this.list.length >= this.size * 8) {
					this.list = this.list.slice (-this.size * 4)
					this.pos0 = this.size * 3 - List.length
				}
			}
			this.view.remove (this.view.first ())
			this.add_line (this.size + this.pos0++)
			if (set_cur)
				this.cur_addr = Math.max (this.cur_addr, this.list [this.pos0])
			return true
		}
		page_prev ( set_cur = 0 ) {
			let n = this.size - 1
			while (n--)
				this.line_prev (set_cur)
		}
		page_next ( set_cur = 0 ) {
			let n = this.size - 1
			while (n--)
				this.line_next (set_cur)
		}
		get_pos ( addr, left = 0, right = this.list.length ) {
			while (left != right) {
				let p = left + right >> 1
				let a = this.list [p]
				if (a == addr)
					return p
				if (a < addr)
					left = p + 1
				else
					right = p
			}
			return false
		}
		list_backward ( addr, max_depth = this.size * 2 ) {
			let List = []
			let Stack = []
			let Depth = 0
			let StartAddr = addr
			let n = max_depth + 100
			let instr_size = this.cpu.NAME == "Z80" ? 4 : 3
			for (let d = 0; d < n && addr; d++) {
				for (let len = 1; len <= instr_size; len++) {
					if (addr >= len && this.instr_size (addr - len) == len)
						Stack.push ([addr - len, d])
				}
				if (Stack.length)
					[addr, d] = Stack.pop ()
				else
					addr--
				List.length = d
				List [d] = addr
				if (Depth < List.length)
					Depth = List.length
			}
			if (List.length > max_depth)
				List.length = max_depth
			return List.reverse ()
		}
		list_forward ( addr, max_depth = this.size * 2 ) {
			let List = []
			while (List.length < max_depth) {
				addr += this.instr_size (addr)
				if (addr > 0xFFFF)
					break
				List.push (addr)
			}
			return List
		}
		get_attr () {
			let [$0, $1, Attr] = this.disassm1 (this.cpu.Regs.PC)
			return Attr
		}
		instr_size_8080 ( addr ) {
			let b = this.memory.get (addr)
			return disassm.#INSTR_SIZE_8080 [b >> 4] >> (b & 0x0F) * 2 & 0x03
		}
		instr_size_8085 ( addr ) {
			let b = this.memory.get (addr)
			return disassm.#INSTR_SIZE_8085 [b >> 4] >> (b & 0x0F) * 2 & 0x03
		}
		instr_size_Z80 ( addr ) {
			let [$, Len] = this.disassm1 (addr)
			return Len
		}
		keydown ( e ) {
			let cur_addr = this.cur_addr
			let get_addr = p => this.list [this.get_pos (this.cur_addr) + p]
			this.set_cur ()
			switch (e.keyCode) {
				case 38:  //  Up
					if (e.ctrlKey) {
						this.line_prev ()
						if (this.cur_addr != 0x0000)
							this.cur_addr = get_addr (-1)
					} else if (e.shiftKey) {
						this.line_prev (1)
					} else if (this.cur_addr < this.list [this.pos0 + 2]) {
						this.cur_addr = this.list [this.pos0]
						this.line_prev ()
					} else {
						this.cur_addr = get_addr (-1)
					}
					break
				case 40:  //  Down
					if (e.ctrlKey) {
						this.line_next ()
						if (this.cur_addr != 0xFFFF)
							this.cur_addr = get_addr (+1)
					} else if (e.shiftKey) {
						this.line_next (1)
					} else if (this.cur_addr > this.list [this.pos0 + this.size - 3]) {
						this.cur_addr = this.list [this.pos0 + this.size - 1]
						this.line_next ()
					} else {
						this.cur_addr = get_addr (+1)
					}
					break
				case 33:  //  PgUp
					this.page_prev ()
					this.cur_addr = get_addr (1 - this.size) || this.list [this.pos0]
					break
				case 34:  //  PgDown
					this.page_next ()
					this.cur_addr = get_addr (this.size - 1) || this.list [this.pos0 + this.size - 1]
					break
				case 36:  //  Home
					this.cur_addr = this.list [this.pos0 + 1]
					break
				case 35:  //  End
					this.cur_addr = this.list [this.pos0 + this.size - 2]
					break
				case 32:  //  Space
					this.dblclick (this.view.$(`#__dis_${this.cur_addr.HEX16}`))
					break
				case 13:  //  Enter
					this.cpu.Regs.PC = this.cur_addr
					this.debug.Regs.out_reg ("PC")
					this.debug.Dump.dump (this.cur_addr)
					break
			}
			if (!isSet (this.cur_addr))
				this.cur_addr = cur_addr
			this.set_cur (1)
		}
		click ( el ) {
			this.set_cur ()
			this.cur_addr = el.dataset.addr.hex ()
			this.set_cur (1)
		}
		dblclick ( el ) {
			el?.setClass ("bp", this.debug.bp_set (el.dataset.addr.hex ()))
		}

		static #INSTR_SIZE_8080 = [
			0x6555655D, 0x6555655D, 0x6575657D, 0x6575657D,
			0x55555555, 0x55555555, 0x55555555, 0x55555555,
			0x55555555, 0x55555555, 0x55555555, 0x55555555,
			0x6FF567F5, 0x6FB567B5, 0x6F756775, 0x6F756775
		]
		static #INSTR_SIZE_8085 = [
			0x6555655D, 0x6555655D, 0x6576657D, 0x6576657D,
			0x55555555, 0x55555555, 0x55555555, 0x55555555,
			0x55555555, 0x55555555, 0x55555555, 0x55555555,
			0x6F7567F5, 0x6FB567B5, 0x67756775, 0x6F756775
		]
	}

	static regs = class regs {
		constructor ( debug ) {
			const tpl = {}
			this.debug = debug
			this.view = debug.app.$("regs")
			this.tpl = debug.app.$("tpl_regs").textContent.trim ().tpl (tpl, 8)
			this.input_tpl = debug.app.$("tpl_regs_input").textContent.trim ()
			this.cpu = debug.cpu
			this.memory = debug.memory
			this.cur = 0
			this.regs_tpl = {
				A:	tpl.REG_A (),
				FLAG:	tpl.REG_FLAG (),
				BC:	tpl.REG_BC (),
				DE:	tpl.REG_DE (),
				HL:	tpl.REG_HL (),
				IX:	tpl.REG_IX (),
				IY:	tpl.REG_IY (),
				SP:	tpl.REG_SP (),
				PC:	tpl.REG_PC ()
			}
			this.list = []
			let html = this.tpl.tpl ({ CPU: this.cpu.NAME })
			for (let r of this.view.create ("div", { innerHTML: html }).all ("tpl-row")) {
				if (/^__reg_(\w+)$/.test (r.id))
					this.list.push (RegExp.$1.toUpperCase ())
			}
			this.regs = {}
			for (let r of this.list)
				this.regs [r] = this.cpu.Regs [r]
			this.out ()
			this.set_cur ()
		}
		done () {
			this.view.innerHTML = ""
		}
		out () {
			let R = this.cpu.Regs
			let HLM = this.memory.is_device (R.HL)
				? void 0
				: this.memory.get (R.HL)
			let SPM = this.memory.is_device (R.SP) || this.memory.is_device (R.SP + 1)
				? void 0
				: this.memory.get (R.SP) | this.memory.get (R.SP + 1).shl8
			this.view.innerHTML = this.tpl.tpl ({
				CPU:		this.cpu.NAME,
				A_HEX:		R.A.HEX8,
				A_BIN:		R.A.bin8,
				A_UDEC:		R.A.udec,
				A_SDEC:		R.A.sdec8,
				FLAG_HEX:	R.FLAG.HEX8,
				FLAG_BIN:	R.FLAG.bin8,
				FLAG_UDEC:	R.FLAG.udec,
				FLAG_SDEC:	R.FLAG.sdec8,
				BC_HEX:		R.BC.HEX16,
				BC_BIN:		R.BC.bin16,
				BC_UDEC:	R.BC.udec,
				BC_SDEC:	R.BC.sdec16,
				DE_HEX:		R.DE.HEX16,
				DE_BIN:		R.DE.bin16,
				DE_UDEC:	R.DE.udec,
				DE_SDEC:	R.DE.sdec16,
				HL_HEX:		R.HL.HEX16,
				HL_BIN:		R.HL.bin16,
				HL_UDEC:	R.HL.udec,
				HL_SDEC:	R.HL.sdec16,
				SP_HEX:		R.SP.HEX16,
				SP_BIN:		R.SP.bin16,
				SP_UDEC:	R.SP.udec,
				SP_SDEC:	R.SP.sdec16,
				PC_HEX:		R.PC.HEX16,
				PC_BIN:		R.PC.bin16,
				PC_UDEC:	R.PC.udec,
				PC_SDEC:	R.PC.sdec16,
				HLM_HEX:	HLM?.HEX8 || "",
				HLM_BIN:	HLM?.bin8 || "",
				HLM_UDEC:	HLM?.udec || "",
				HLM_SDEC:	HLM?.sdec8 || "",
				SPM_HEX:	SPM?.HEX16 || "",
				SPM_BIN:	SPM?.bin16 || "",
				SPM_UDEC:	SPM?.udec || "",
				SPM_SDEC:	SPM?.sdec16 || "",
				... this.cpu.NAME == "Z80"
					? {
						IX_HEX:		R.IX.HEX16,
						IX_BIN:		R.IX.bin16,
						IX_UDEC:	R.IX.udec,
						IX_SDEC:	R.IX.sdec16,
						IY_HEX:		R.IY.HEX16,
						IY_BIN:		R.IY.bin16,
						IY_UDEC:	R.IY.udec,
						IY_SDEC:	R.IY.sdec16
					}
					: {}
			})
			for (let r of this.list) {
				if (this.regs [r] != R [r]) {
					this.regs [r] = R [r]
					this.row (r).setClass ("hl")
				}
			}
		}
		out_reg ( reg ) {
			let R = this.cpu.Regs [reg]
			let O = regs.OUT [regs.DIG [reg]]
			this.row (reg).innerHTML = this.regs_tpl [reg].tpl ({
				[`${reg}_HEX`]:		R [O.hex],
				[`${reg}_BIN`]:		R [O.bin],
				[`${reg}_UDEC`]:	R [O.udec],
				[`${reg}_SDEC`]:	R [O.sdec]
			})
			if (R === this.cpu.Regs.PC)
				this.debug.Disassm.new_pc ()
			else if (R === this.cpu.Regs.FLAG && !reg.flag)
				this.debug.Flags.out ()
		}
		row ( reg ) {
			return this.view.$(`#__reg_${reg.toLowerCase ()}`)
		}
		set_cur ( set ) {
			this.row (this.list [this.cur]).setClass ("hl", 0).setClass ("current", set)
		}
		get_idx ( el ) {
			let id = el.parent ().id
			return this.list.indexOf (id && /^__reg_(\w+)$/.test (id) && RegExp.$1.toUpperCase ())
		}
		input () {
			if (this.view.hasClass ("input"))
				return this.input_hide ()
			let reg = this.list [this.cur]
			let R = this.cpu.Regs [reg]
			let O = regs.OUT [regs.DIG [reg]]
			this.row (reg).innerHTML = this.input_tpl.tpl ({
				REG:	reg,
				BIN:	R [O.bin],
				UDEC:	R [O.udec],
				SDEC:	R [O.sdec]
			})
			let inp = this.row (reg).$("input")
			if (!inp)
				return this.input_hide ()
			inp.value = R [O.hex]
			inp.focus ()
			inp.onkeydown = e => {
				if (e.keyCode == 13) {
					let v = inp.value.hex ()
					if (!isNaN (v)) {
						this.cpu.Regs [reg] = this.regs [reg] = v
						if (R === this.cpu.Regs.FLAG)
							this.debug.Flags.out ()
					}
					inp.blur ()
				} else if (e.keyCode == 27) {
					inp.blur ()
				}
				this.debug.input_check (e)
			}
			inp.onblur = e => {
				this.input_hide ()
			}
			this.debug.app.Comp.keyboard (0)
		}
		input_hide () {
			this.debug.app.Comp.keyboard (1)
			this.out_reg (this.list [this.cur])
		}
		keydown ( e ) {
			let reg = this.list [this.cur]
			this.set_cur (0)
			switch (e.keyCode) {
				case 38:  //  Up
					this.cur = (this.cur + this.list.length - 1) % this.list.length
					break
				case 40:  //  Down
					this.cur = (this.cur + 1) % this.list.length
					break
				case 36:  //  Home
					this.cur = 0
					break
				case 35:  //  End
					this.cur = this.list.length - 1
					break
				case 33:  //  PgUp
				case 107:  //  Num +
					this.cpu.Regs [reg]++
					this.out_reg (reg)
					break
				case 34:  //  PgDown
				case 109:  //  Num -
					this.cpu.Regs [reg]--
					this.out_reg (reg)
					break
				case 46:  //  Delete
					this.cpu.Regs [reg] = 0
					this.out_reg (reg)
					break
				case 32:  //  Space
				case 106:  //  Num *
					this.cpu.Regs [reg] = ~this.cpu.Regs [reg]
					this.out_reg (reg)
					break
				case 13:  //  Enter
					this.input ()
					break
			}
			this.regs [reg] = this.cpu.Regs [reg]
			this.set_cur (1)
		}
		click ( el ) {
			let idx = this.get_idx (el)
			if (idx != -1) {
				this.set_cur (0)
				this.cur = idx
				this.set_cur (1)
			}
		}
		dblclick ( el ) {
			if (this.get_idx (el) != -1)
				this.input ()
		}

		static DIG = {
			A:	8,
			FLAG:	8,
			BC:	16,
			DE:	16,
			HL:	16,
			IX:	16,
			IY:	16,
			SP:	16,
			PC:	16
		}
		static OUT = {
			8:	{ hex: "HEX8", bin: "bin8", udec: "udec", sdec: "sdec8" },
			16:	{ hex: "HEX16", bin: "bin16", udec: "udec", sdec: "sdec16" }
		}
	}

	static flags = class {
		constructor ( debug ) {
			this.debug = debug
			this.view = debug.app.$("flags")
			this.tpl = debug.app.$("tpl_flags").textContent.trim ()
			this.cpu = debug.cpu
			this.cur = 7
			this.view.setClass ("z80", this.cpu.NAME == "Z80")
			this.out ()
			this.set_cur ()
		}
		done () {
			this.view.innerHTML = ""
		}
		out () {
			let R = this.cpu.Regs
			if (this.cpu_flag === R.FLAG && this.cpu_iff === this.cpu.iff ())
				return
			this.cpu_flag = R.FLAG
			this.cpu_iff = this.cpu.iff ()
			this.view.innerHTML = this.tpl.tpl ({
				CPU:		this.cpu.NAME,
				D7:		+!!(R.FLAG & 0x80),
				D6:		+!!(R.FLAG & 0x40),
				D5:		+!!(R.FLAG & 0x20),
				D4:		+!!(R.FLAG & 0x10),
				D3:		+!!(R.FLAG & 0x08),
				D2:		+!!(R.FLAG & 0x04),
				D1:		+!!(R.FLAG & 0x02),
				D0:		+!!(R.FLAG & 0x01),
				IFF:		this.cpu.iff ()
			})
		}
		inv ( d ) {
			this.cpu.Regs.FLAG ^= 1 << d
			this.cell (d).textContent = +!!(this.cpu.Regs.FLAG & (1 << d))
			this.debug.Regs.out_reg ("FLAG".set ("flag"))
		}
		cell ( d = this.cur ) {
			return this.view.$(`#__flag_d${d}`)
		}
		set_cur ( set ) {
			this.cell ().parent ().setClass ("current", set)
		}
		keydown ( e ) {
			this.set_cur (0)
			switch (e.keyCode) {
				case 38:  //  Up
					this.cur = (this.cur + 1) % 8
					break
				case 40:  //  Down
					this.cur = (this.cur + 7) % 8
					break
				case 36:  //  Home
					this.cur = 7
					break
				case 35:  //  End
					this.cur = 0
					break
				case 13:  //  Enter
				case 32:  //  Space
					this.dblclick (this.cell ())
					break
			}
			this.set_cur (1)
		}
		click ( el ) {
			let d = el.parent ().dataset?.data
			if (isSet (d)) {
				this.set_cur (0)
				this.cur = +d
				this.set_cur (1)
			}
		}
		dblclick ( el ) {
			let d = el.parent ().dataset?.data
			if (isSet (d))
				this.inv (d)
		}
	}
}

Number.prototype.extend ({
	bin8: { get () { let n = this, r = "", c = 8; while (c--) r = `${n & 1}${c == 3 ? " " : ""}${r}`, n >>= 1; return r } },
	bin16: { get () { return `${this.b1.bin8} ${this.b0.bin8}` } },
	udec: { get () { return this.numeral (" ") } },
	sdec8: { get () { return (this | ((this << 24) & 0x80000000) >> 24).numeral (" ") } },
	sdec16: { get () { return (this | ((this << 16) & 0x80000000) >> 16).numeral (" ") } }
})

