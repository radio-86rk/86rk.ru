//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.app.js


"use strict"

class app {
	constructor ( name, lang = "ru" ) {
		this.APP_NAME = name
		this.VERSION = August.init ().Version
		this.STORAGE = August.storage (name)
		this.LANG = this.STORAGE ("lang") || lang
		this.DESIGN = this.STORAGE ("design") || "blue"
		this.MAIN_CSS = ["../css/app", name]
		this.#ID = +this.STORAGE ("id") || 0
		this.load_css (this.MAIN_CSS, "").then (async () => {
			await this.load_css (this.CSS, this.DESIGN)
			let r = await fetch (`app.${this.LANG}.html?${this.VERSION}`)
			this.app = $("app")
			this.app.innerHTML = await r.text ()
			if (!r.ok) {
				this.app.className = "show"
				return
			}
			if (this.$("app_cfg")) {
				this.$("app_cfg").textContent.tpl ({ CFG: cfg => this.CFG = cfg })
				this.app.remove (this.$("app_cfg"))
			}
			await August.sync ()
			if (!isObject (this.CFG)) {
				this.CFG = {}
				this.error ("cfg error")
			}
			this.app.$("app-title").textContent = document.title = this.CFG.APP_TITLE
			this.app.$("app-menu").attr ("vers", this.VERSION)
			this.app.className = "show empty"
			this.app.tabIndex = -1
			this.app.focus ()
			this.init ()
			window.onfocus = e => {
				if (this.Modal)
					this.Modal.first ().focus ()
				else
					this.app.focus (), this.focus ()
			}
		}).catch (m => {
			this.STORAGE ("design", "")
			$("app").className = "show"
			$("app").innerHTML = `error: '${m}'`
		})
	}
	init ( accept = ".bin", adapter = null, ... a ) {
		function drag  ( e ) {
			e.stop ()
			if (e.type == "dragover") {
				e.dataTransfer.dropEffect = this.is_conf ()
					? "none"
					: "copy"
			} else if (e.type == "drop") {
				if (!this.is_conf ())
					this.upload (e.dataTransfer.files [0], 0, ... a)
			}
		}
		this.drag_bind = drag.bind (this)
		window.addEventListener ("dragstart", this.drag_bind)
		window.addEventListener ("dragover", this.drag_bind)
		window.addEventListener ("drop", this.drag_bind)

		const self = this
		this.FileSelect = this.$("files")
		if (this.FileSelect) {
			this.init_file_open (accept)
			this.FileSelect.onchange = function ( e ) {
				self.set_file (this.selectedIndex)
				self.focus ()
			}
			let FilesJSON = this.STORAGE ("files")
			if (FilesJSON.length) {
				this.Files = app.deserialize (FilesJSON)
				let idx = 0
				for (let f of this.Files) {
					if (adapter)
						adapter (f)
					this.add_file_list (idx++, f.FileName)
				}
				if (this.Files.length)
					this.set_file (+this.STORAGE ("cur_file"))
				else
					this.empty_page ()
			} else {
				this.empty_page ()
			}
			this.FileSelect.swap = function ( i1, i2 ) {
				if (i1 != i1.clamp (0, this.length - 1) || i2 != i2.clamp (0, this.length - 1))
					return false
				let v1 = this [i1].value
				let v2 = this [i2].value
				this [i1].text = `${i1}: ${v2}`
				this [i2].text = `${i2}: ${v1}`
				this [i1].value = v2
				this [i2].value = v1
				self.Files [i1] = self.Files.splice (i2, 1, self.Files [i1])[0]
				return true
			}
		}
		this.app.onkeypress = e => {
			this.keypress (e)
		}
		this.app.onkeydown = e => {
			return this.keydown (e)
		}
		this.app.oncontextmenu = e => {
			return this.contextmenu (e)
		}
		this.app.onmouseover = this.app.onmouseout =
		this.app.onmousedown = this.app.onmouseup = e => {
			this.mouse (e)
		}
		this.app.onclick = e => {
			this.click_handler (e)
		}
		onbeforeunload = _ => {
			this.done ()
		}
		document.onvisibilitychange = _ => {
			if (document.hidden && this.StorageOn)
				this.STORAGE ("files", app.serialize (this.Files))
		}

		this.toggle_cb ("storage_toggle", on => this.StorageOn = on)
		this.radio_cb ("lang", this.LANG, v => {})
		if (this.$("mix_color_filter")) {
			this.StyleSheet = document.head.append ("style")
			this.StyleSheet.sheet.insertRule ("#app::before { content: ''; position: fixed; z-index: 3; inset: 0; pointer-events: none; display: none; }")
			let MixStyle = this.StyleSheet.sheet.cssRules [0].style
			MixStyle.setColor = function ( c ) {
				this.backgroundColor = c + (this.__opacity * 255 / 100 | 0).hex ()
			}
			this.txt_cb ("mix_color", "#0099ff", v => {
				MixStyle.setColor (v)
			})
			this.txt_cb ("mix_css_filter", "", v => {
				MixStyle.filter = this.$("mix_css_filter_on").checked ? v : ""
			})
			this.checkbox_cb ("mix_css_filter_on", v => {
				MixStyle.filter = v ? this.$("mix_css_filter").value : ""
			})
			this.MixToggle = this.toggle_cb ("mix_toggle", on => {
				this.$("mix_color_filter").setHeight (on ? void 0 : 0)
				MixStyle.display = on ? "block" : "none"
			})
			this.MixOpacitySlider = this.slider_cb ("mix_opacity", 50, 101, o => {
				this.$("mix_opacity_val").textContent = o + "%"
				MixStyle.__opacity = o
				MixStyle.setColor (this.$("mix_color").value)
			})
			this.MixModeSlider = this.slider_cb ("mix_mode", 10, app.MIX_BLEND_MODE.length, m => {
				MixStyle.mixBlendMode = this.$("mix_mode_val").textContent = app.MIX_BLEND_MODE [m]
			})
		}
	}
	done () {
		if (this.FileSelect) {
			window.removeEventListener ("dragstart", this.drag_bind)
			window.removeEventListener ("dragover", this.drag_bind)
			window.removeEventListener ("drop", this.drag_bind)
			if (this.StorageOn)
				this.STORAGE ("cur_file", this.FileSelect.selectedIndex)
		}
		this.STORAGE ("files", this.StorageOn ? app.serialize (this.Files) : "")
		this.STORAGE ("version", this.VERSION)
		this.app.tabIndex = 0
		this.app.innerHTML = ""
		this.app.className = ""
		window.onfocus = this.app.onclick = this.app.oncontextmenu =
		this.app.onkeypress = this.app.onkeydown = this.app.onkeyup =
		this.app.onmouseover = this.app.onmouseout =
		this.app.onmousedown = this.app.onmouseup = onbeforeunload = null
		this.load_css (this.MAIN_CSS, null)
		this.load_css (this.CSS, null)
		if (this.StyleSheet)
			document.head.remove (this.StyleSheet)
	}
	init_file_open ( accept = "", ... a ) {
		const self = this
		this.FileOpen = this.app.append ("input", {
			type:	"file",
			accept
		})
		this.FileOpen.css ("position: fixed; bottom: 100%; visibility: hidden")
		this.FileOpen.onchange = function () {
			self.upload (this.files [0], 0, ... a, self.ExtraUploadHandler)
			this.value = ""
		}
	}
	file_open ( hndlr, accept ) {
		let a = this.FileOpen.accept
		if (isSet (accept))
			this.FileOpen.accept = accept
		this.ExtraUploadHandler = hndlr
		this.FileOpen.click ()
		this.FileOpen.accept = a
	}
	add_file_list ( idx, name ) {
		August.form.$option (this.FileSelect, `${idx}: ${name}`, name)
	}
	new_file_name ( n ) {
		return this.$(n).value.tpl ({ NUM: this.id, DATE_NOW: f => new Date ().format (f) })
	}
	set_file ( idx ) {
		this.app.setClass ("empty", 0).setClass ("multi", this.Files.length > 1)
		this.FileSelect.selectedIndex = idx
		if (this.app.$("app-filename").attr ("file-name") === null)
			this.app.$("app-filename").textContent = this.File.FileName
		else
			this.app.$("app-filename").attr ("file-name", this.File.FileName)
	}
	prev_file () {
		this.set_file ((this.FileSelect.selectedIndex || this.Files.length) - 1)
	}
	next_file () {
		this.set_file ((this.FileSelect.selectedIndex + 1) % this.Files.length)
	}
	toggle_cb ( name, cb ) {
		let el = this.$(name)
		if (!el)
			return null
		return new august_slider (el, v => {
			cb (+v)
			if (v.end || v.set)
				this.STORAGE (name, +v)
		}, {
			discrete:	2,
			active:		0
		}).set (+this.STORAGE (name) || 0)
	}
	slider_cb ( name, def, nval, cb ) {
		let el = this.$(name)
		if (!el)
			return null
		return new august_slider (el, v => {
			cb (+v)
			if (v.end || v.set)
				this.STORAGE (name, v + 1)
		}, {
			discrete:	nval,
			active:		0
		}).set ((+this.STORAGE (name) || (def + 1)) - 1)
	}
	checkbox_cb ( name, cb ) {
		let el = this.$(name)
		if (!el)
			return
		let v = +this.STORAGE (name) || 0
		el.checked = v
		el.onchange = e => {
			this.STORAGE (name, +e.$.checked)
			cb (+e.$.checked)
		}
		cb (v)
		return {
			get: () => {
				return el.checked
			},
			set: v => {
				el.checked = v
				el.fire ("change")
			}
		}
	}
	radio_cb ( name, def, cb ) {
		let el = this.$(name)
		if (!el)
			return
		let v = this.STORAGE (name) || def
		for (let r of el.all (`[name=${name}]`)) {
			r.onchange = e => {
				this.STORAGE (name, e.$.value)
				cb (e.$.value, e.detail?.set)
			}
			if (r.value == v)
				r.checked = true
		}
		cb (v, 1)
		return {
			get: () => {
				for (let r of el.all (`[name=${name}]`)) {
					if (r.checked)
						return r.value
				}
			},
			set: v => {
				for (let r of el.all (`[name=${name}]`))
					r.checked = r.value == v
				let r = el.$(`input[name=${name}][value="${v}"]`)
				if (r)
					r.fire ("change", { set: 1 })
			}
		}
	}
	txt_cb ( name, def, cb ) {
		let el = this.$(name)
		if (!el)
			return
		el.value = this.STORAGE (name) || def
		el.oninput = e => {
			this.STORAGE (name, e.$.value)
			cb (e.$.value)
		}
		cb (el.value)
	}
	set_txt ( name, def = "", cb ) {
		let el = this.$(name)
		if (!el)
			return
		el.value = this.STORAGE (name) || def
		el.onchange = e => {
			this.STORAGE (name, e.$.value)
			cb && cb (el.value)
		}
		cb && cb (el.value)
	}
	add_cfg () {
		let cfg = this.$("app_cfg")
		if (!cfg)
			return
		cfg.textContent.tpl ({ CFG: cfg => {
			for (let p in cfg) {
				if (isSet (this.CFG [p]))
					Object.assign (this.CFG [p], cfg [p])
				else
					this.CFG [p] = cfg [p]
			}
		}})
		cfg.parent ().remove (cfg)
	}
	keypress ( e ) {
		return app.is_input (e)
	}
	keydown ( e ) {
		if (app.is_input (e))
			return true

		if (this.Modal) switch (e.keyCode) {
			case 9:  //  Tab
				return e.stop ()
			case 27:  //  Esc
				this.Modal.hide ()
				break
			case 112:  //  F1
				if (this.Help?.hasClass ("show"))
					this.Help.hide ()
				break
			default:
				if (e.shiftKey || e.ctrlKey || e.altKey)
					e.stop ()
				if (this.Modal.keydown)
					return this.Modal.keydown (e)
				if (e.keyCode > 112 && e.keyCode < 124)
					e.stop ()
				return true
		} else if (this.is_conf ()) {
			if (e.keyCode == 123)
				this.conf ()
		} else if (e.shiftKey && !e.ctrlKey) {
			return
		} else if (e.altKey) switch (e.keyCode) {
			case 0x58:  //  X
				window.close ()
				break
			case 0x71:  //  F2
				this.save_project ()
				break
			case 0x72:  //  F3
				this.open_dialog ()
				break
			default:
				return				
		} else if (e.ctrlKey) switch (e.keyCode) {
			case 0x20:  //  Space
				if (!e.shiftKey && this.FileSelect)
					this.FileSelect.focus ()
				break
			case 0xDB:  //  [
				if (this.FileSelect)
					this.prev_file ()
				break
			case 0xDD:  //  ]
				if (this.FileSelect)
					this.next_file ()
				break
			case 0x4F:  //  O
				if (e.shiftKey)
					this.open_dialog ()
				break
			case 0x45:  //  E
			case 0x4E:  //  N
				this.empty_file ()
				break
			case 0x53:  //  S
				if (e.shiftKey)
					this.save_project ()
				else
					this.save ()
				break
			case 0x44:  //  D
			case 0x55:  //  U
				if (e.shiftKey && this.FileSelect) {
					let idx = this.FileSelect.selectedIndex
					let ud = e.keyCode == 0x44 ? +1 : -1
					if (this.FileSelect.swap (idx, idx + ud))
						this.set_file (idx + ud)
					break
				}
				return
			case 0x51:    //  Q
			case 0x57: {  //  W
				if (!this.FileSelect)
					return
				let idx = this.FileSelect.selectedIndex
				this.FileSelect.remove (idx)
				for (let i = 0; i < this.FileSelect.length; i++)
					this.FileSelect [i].text = `${i}: ${this.FileSelect [i].value}`
				for (let i = idx; i < this.Files.length - 1; i++)
					this.Files [i] = this.Files [i + 1]
				if (this.Files.length && --this.Files.length)
					this.set_file (idx == this.Files.length ? idx - 1 : idx)
				else
					this.empty_page ()
				break
			}
			case 0x30:
			case 0x31:
			case 0x32:
			case 0x33:
			case 0x34:
			case 0x35:
			case 0x36:
			case 0x37:
			case 0x38:
			case 0x39:
				if (!this.FileSelect)
					return false
				if (e.keyCode - 0x30 < this.Files.length)
					this.set_file (e.keyCode - 0x30)
				break
			default:
				return
		} else switch (e.keyCode) {
			case 27:  //  Esc
				if (this.Help?.hasClass ("show"))
					this.Help.show ()
				break
			case 112:  //  F1
				this.help ()
				break
			case 113:  //  F2
				this.save ()
				break
			case 114:  //  F3
				this.FileOpen.click ()
				break
			case 115:  //  F4
				this.empty_file ()
				break
			case 122:  //  F11
				return true
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
				e.stop ()
				return
			case 123:  //  F12
				this.conf ()
				break
			default:
				return
		}
		e.stop ()
		return true
	}
	mouse ( e ) {
		if (this.is_conf ())
			return true
		switch (e.type) {
			case "mousedown":
				if (e.which == 1)
					this.MouseDown = true
				else if (e.which == 3)
					this.MouseDownRight = true
				else if (e.which == 2)
					this.MouseDownMiddle = true
				break
			case "mouseup":
				if (e.which == 1)
					this.MouseDown = false
				else if (e.which == 3)
					this.MouseDownRight = false
				else if (e.which == 2)
					this.MouseDownMiddle = false
				break
		}
	}
	contextmenu ( e ) {
		return e.$.form !== void 0 && /^text/.test (e.$.type)
	}
	download_fn ( fn, data ) {
		let a = this.app.append ("a", {
			href:		isString (data) && data.filename
						? data
						: window.URL.createObjectURL (new Blob (
							isArray (data) ? data : [data],
							{ type: "application/octet-stream" }
						)),
			download:	fn,
			style:		"display: none"
		})
		try {
			a.click ()
		} catch ( e ) {
			this.error (e.message)
		}
		if (!isString (data))
			window.URL.revokeObjectURL (a.href)
		this.app.remove (a)
	}
	delay ( ms ) {
		return new Promise (resolve => setTimeout (resolve, ms))
	}
	load_css ( css, des ) {
		return new Promise (( onLoad, onError ) => August.loadCSS (window, css, des, onLoad, onError))
	}
	async load_js ( file, cb = _ => {} ) {
		await August.loadJS (file).then (cb).catch (_ => this.error (this.CFG.ERROR.LOAD_ERROR.tpl ({ NAME: file }, 16)))
	}
	async load_design ( d ) {
		if (this.DESIGN == d)
			return
		this.app.setClass ("opacity", 1)
		try {
			await this.delay (this.app.td ("opacity"))
			await this.load_css (this.CSS, d)
			this.STORAGE ("design", this.DESIGN = d)
			this.redesign ()
		} catch ( e ) {
		}
		this.app.setClass ("opacity", 0)
	}
	async load ( fn, type = "text" ) {
		return await fetch (fn.v ? `${fn}?${this.VERSION}` : fn).then (async r => {
			if (r.ok)
				return await r [type]()
			throw new Error (this.CFG.ERROR.LOAD_ERROR.tpl ({ NAME: fn, STATUS: r.statusText }))
		}).catch (e => {
			this.error (e.message)
		})
	}
	async upload ( file, asText, ... a ) {
		if (!file)
			return
		if (this.CFG.FILE_SIZE_LIMIT && file.size > this.CFG.FILE_SIZE_LIMIT)
			return this.error (this.CFG.ERROR.FILE_SIZE.tpl ({ NAME: file.name }))
		this.busy ()
		await August.sync ()
		try {
			let r = await new Promise (( onLoad, onError ) => {
				let Reader = new FileReader
				Reader.onload = () => onLoad (Reader.result)
				Reader.onerror = () => onError ()
				if (asText)
					Reader.readAsText (file)
				else
					Reader.readAsArrayBuffer (file)
			})
			if (this.upload_handler (file.name, r, ... a))
				this.status (this.CFG.NOTICE.LOADED.tpl ({ NAME: file.name }))
		} catch ( e ) {
			this.error (this.CFG.ERROR.UPLOAD_ERROR.tpl ({ NAME: file.name, MESS: e.message }))
		}
		this.busy ()
	}
	save () {
		if (window.URL || window.webkitURL)
			this.save_handler ()
		else
			this.error (this.CFG.ERROR.NO_SUPPORT)
	}
	save_project ( file_name, proj ) {
		let Sign = this.proj_sign ()
		if (!Sign)
			return
		let Data = app.serialize ({
			... proj,
			Date: new Date,
			Version: this.VERSION
		})
		let MD5 = Uint8Array.from (Data.md5 ().match (/../g).map (b => +`0x${b}`))
		this.download_fn (`${file_name}.86rk`, [
			app.SIGNATURE,
			Sign,
			MD5,
			Data
		])
	}
	get_project ( bin ) {
		let get_data = ( pos, len ) => String.fromCharCode (... new Uint8Array (bin, pos, len))
		let Sign = this.proj_sign ()
		if (!Sign || bin.byteLength < 64)
			return null
		let SignApp = get_data (0, 16)
		if (SignApp != app.SIGNATURE)
			return null
		let SignProj = get_data (16, 16)
		if (SignProj != Sign)
			return this.error (this.CFG.ERROR.WRONG_PROJECT.tpl ({ SIGN: SignProj })), false
		let MD5 = Array.from (new Uint8Array (bin, 32, 16)).map (b => b.hex ()).join ("")
		let Proj = decodeURIComponent (escape (get_data (48)))
		if (MD5 != Proj.md5 ())
			return this.error (this.CFG.ERROR.CORR_PROJECT), false
		return app.deserialize (Proj)
	}
	proj_sign () {
		return null
	}
	active () {
		return !(this.Modal || this.is_conf ())
	}
	busy ( s ) {
		this.app.setClass ("busy", s)
	}
	status ( msg, cn = "notice" ) {
		let st = this.app.$("app-status")
		st.className = ""
		clearTimeout (st.to)
		August.sync (window, _ => {
			st.innerHTML = msg.replace (/\*\*(.+?)\*\*/g, "<span>$1</span>")
			st.setClass (cn, 1).setClass ("show", 1)
			st.to = setTimeout (_ => {
				st.setClass ("show", 0)
			}, st.td_max ())
		})
	}
	error ( msg ) {
		this.status (msg, "error")
	}
	modal ( title, h3, handler, cn = "", html = "", done = null ) {
		if (this.Modal)
			return null
		this.Modal = this.app.append ("app-modal", {
			className:	cn
		})
		this.Modal.attr ("modal-title", title)
		this.Modal.hide = () => {
			this.MScroll.set (cn, this.Modal.last ().scrollTop)
			this.app.remove (this.Modal)
			this.Modal = null
			this.set_modal ()
			done && done ()
		}
		if (handler) {
			this.Modal.handler = el => {
				handler (el)
				this.Modal.hide ()
			}
		}
		if (h3) {
			this.Modal.append ("h3", {
				innerHTML:	h3
			})
		}
		let m = this.Modal.append ("div", {
			tabIndex:	-1,
			innerHTML:	html.replaceAll (" -- ", " &mdash; ")
		})
		this.set_modal ()
		if (cn && this.MScroll.has (cn))
			m.scrollTop = this.MScroll.get (cn)
		return m
	}
	async help ( help ) {
		if (this.Modal)
			return false
		if (this.Help && !help)
			return this.Help.show ()

		const self = this
		this.modal (
			this.CFG.MODAL_TITLE.HELP,
			null,
			null,
			"help",
			await this.load (`${help || "help"}.${this.LANG}.html`.set ("v"))
		)
		this.Help = this.Modal
		this.Help.onclick = this.Help.oncontextmenu =
		this.Help.hide = this.Help.show = function () {
			self.Modal = this.setClass ("show") ? this : null
			self.set_modal ()
		}
		this.Help.setClass ("show")
		return this.Help
	}
	click_handler ( e ) {
		const name = e.$.name || e.$.attr ("name")
		switch (name) {
			case "conf":
				this.conf ()
				break
			case "design":
				this.load_design (e.$.attr ("design"))
				break
		}
		if (this.is_conf ())
			return true
		switch (name) {
			case "modal":
				this.Modal.handler (e.$)
				break
			case "help":
				this.help ()
				break
			case "save":
				this.save ()
				break
			case "save_project":
				this.save_project ()
				break
			case "open":
				this.file_open ()
				break
			case "open_dialog":
				this.open_dialog ()
				break
			case "empty":
				this.empty_file ()
				break
			default:
				return name
		}
		return true
	}
	is_conf () {
		return this.app.hasClass ("conf")
	}
	conf () {
		return this.app.setClass ("conf") || this.focus ()
	}
	set_modal () {
		if (this.app.setClass ("modal"))
			this.blur ()
		else
			this.focus ()
		if (this.Modal)
			this.Modal.first ().focus ()
	}
	focus () {
	}
	blur () {
	}
	redesign () {
	}
	empty_page () {
	}
	empty_file () {
	}
	open_dialog () {
	}
	$ ( n ) {
		return this.app.$(`#${n}`)
	}
	get august_version () {
		return this.AUGUST_VERSION
	}
	set august_version ( v ) {
		return this.AUGUST_VERSION = v
	}
	get id () {
		this.STORAGE ("id", ++this.#ID)
		return this.#ID
	}
	static is_input ( e ) {
		return e.$.is ("INPUT") || e.$.is ("TEXTAREA")
	}
	static code_rk ( code ) {
		if (code.length < 9)
			return false
		let word = i => code [i].shl8 | code [i + 1]
		let o = +(code [0] == 0xE6)
		let a = word (o)
		let e = word (o + 2)
		let x = e - a + o + 5
		if (code.length < x)
			return false
		let z = 0
		while (code [x] === 0)
			z++, x++
		if (code [x] != 0xE6)
			return false
		let c = code.slice (o + 4, x - z)
		let crc = app.crc_rk (c)
		return { Code: c, Addr: a, CRC: crc, OK: crc == word (x + 1) }
	}
	static crc_rk ( bin ) {
		let l = bin [bin.length - 1]
		let s = bin.reduce (( a, c ) => a + c * 257, 0) - l * 257
		return (s & 0xFF00) | (s + l & 0xFF)
	}
	static serialize ( data ) {
		return JSON.stringify (data, ( k, v ) => {
			for (let t of ["Map", "Set"]) {
				if (isType (v, window [t]))
					return { "@": t, "$": [... v] }
			}
			for (let t of ["Uint8Array", "Uint32Array", "Uint16Array", "Int8Array", "Int16Array", "Int32Array", "Float32Array", "Float64Array"]) {
				if (isType (v, window [t]))
					return { "@": t, "_": btoa (String.fromCharCode (... new Uint8Array (v.buffer))) }
			}
			return v
		})
	}
	static deserialize ( data ) {
		return JSON.parse (data, ( k, v ) => {
			return isObject (v) && v ["@"]
				? new window [v ["@"]](v.$ || Array.from (atob (v._)).map (c => c.charCodeAt (0)))
				: v
		})
	}
	static run ( name, lang = "ru" ) {
		return new Function (`return new ${name} ("${name}", "${lang}")`)()
	}

	Files = []
	ExtraUploadHandler = void 0
	MScroll = new Map
	MouseDown = false
	MouseDownRight = false
	StorageOn = 0
	CSS = ["app"]
	#ID = 0

	static MIX_BLEND_MODE = [
		"multiply", "screen", "overlay", "darken",
		"lighten", "color-dodge", "color-burn", "hard-light",
		"soft-light", "difference", "exclusion", "hue",
		"saturation", "color", "luminosity"
	]

	static SIGNATURE = "\x0a\x08\x00RADIO-86RK.RU"
}

