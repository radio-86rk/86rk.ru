//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


"use strict"

class utils extends app {
	init () {
		super.init ()
		this.init_file_open ()
	}
	done () {
		this.Util.forEach (u => u.done ())
		super.done ()
	}
	pack_rle ( d, p0 = [] ) {
		let c = 0
		let a = d [0]
		let p = p0
		for (let b of d) {
			if (b == a) {
				if (++c == 130) {
					p.push (c - 3 | 0x80, a)
					c = 0
				}
			} else {
				if (c > 2)
					p.push (c - 3 | 0x80)
				else if (c == 2)
					p.push (a)
				p.push (a)
				a = b
				c = 1
			}
		}
		if (c == 1)
			p.push (a)
		else if (c == 2)
			p.push (a, a)
		else if (c > 2)
			p.push (c - 3 | 0x80, a)
		return Uint8Array.from (p)
	}
	pack2 ( d, w = 2, p0 = [] ) {
		let Code = new Map
		for (let b of d) {
			let c = Code.get (b)
			Code.set (b, isSet (c) ? c + 1 : 1)
		}
		let A = []
		for (let [b, c] of Code)
			A.push ({ b, c })
		A.sort (( a, b ) => b.c - a.c)
		let p = [... p0, d.length.b0, d.length.b1, A.length]
		let idx = 0
		for (let a of A) {
			p.push (a.b)
			Code.set (a.b, idx++)
		}
		let pos = 0
		let code_bit = w
		let code_len = (1 << w) - 1
		for (let b of d) {
			let idx = Code.get (b)
			let cb = code_bit
			let cl = code_len
			for (;;) {
				if (idx < cl) {
					let x = ((idx - (cl - code_len)) << cb - code_bit) | ((1 << cb - code_bit) - 1)
					let s = pos ? p.pop () : 0
					for (let i = 0, m = 1; i < cb; i++, m <<= 1) {
						if (x & m)
							s |= 1 << pos
						if (++pos == 8) {
							p.push (s)
							pos = 0
							s = 0
						}
					}
					if (pos)
						p.push (s)
					break
				}
				cb += code_bit
				cl += code_len
			}
		}
		return Uint8Array.from (p)
	}
	get_code ( base64 ) {
		return Uint8Array.from (atob (base64), m => m.codePointAt (0))
	}
	download_rk ( addr, name, blob ) {
		let bl = blob.last ()
		let l = bl [bl.length - 1]
		let s = blob.reduce (( a, c ) => a + c.reduce (( a, c ) => a + c * 257, 0), 0) - l * 257
		let e = blob.reduce (( a, c ) => a + c.length, 0) + addr - 1
		blob.unshift (Uint8Array.from ([addr.b1, addr.b0, e.b1, e.b0]))
		blob.push (Uint8Array.from ([0, 0, 0xE6, s.b1, (s + l).b0]))
		this.download_fn (`${name}.rk`, blob)
	}
	upload ( file ) {
		if (this.Current) {
			if (!this.Current.upload)
				return super.upload (file, this.Current.UploadAsText)
			this.status (this.CFG.NOTICE.LOADED.tpl ({ NAME: file.name }))
			this.Current.upload (file)
		}
	}
	upload_handler ( ... a ) {
		this?.Current?.upload_handler (... a)
	}
	save_handler () {
		this?.Current?.download ()
	}
	load_error ( n ) {
		this.error (this.CFG.ERROR.LOAD_ERROR.tpl ({ NAME: n }, 16))
	}
	keydown ( e ) {
		if (super.keydown (e))
			return true
		if (this.Modal)
			return e.stop ()
		this?.Current?.keydown (e)
	}
	async click_handler ( e ) {
		let name = super.click_handler (e)
		if (name === true)
			return
		let u = e.$.dataset.util
		if (isSet (u)) {
			let au = this.app.$("app-utils")
			au.setClass ("show_all", 0).props ({ "--util": u }).all ("li").forEach (( li, i ) => {
				li.setClass ("select", u == i)
			})
			this.Current = this.Util [u]
			if (this.Current) {
				this.Current.Util = u
				return
			}
			August.loadJS (`util-${u}.js`)
				.then (() => this.load (`tpl/util-${u}.${this.LANG}.tpl`.set ("v")))
				.then (async tpl => {
					let util = new Function (`return util_${u}`)()
					let node = au.all ("app-util")[u]
					node.noselect ()
					node.innerHTML = tpl
					this.add_cfg ()
					this.Current = this.Util [u] = await new util (this, node)
					this.Current.Util = u
				}).catch (e => {
					if (isSet (e))
						this.error (e.message)
					else
						this.load_error (`util-${u}.js`)
				})
		} else {
			let a = e.$.name || e.$.dataset.a
			if (a && this.Current)
				this.Current.click_handler (a, e.$)
		}
	}
	async help () {
		if (!this.Current)
			return super.help ()
		if (this.Modal)
			return
		this.Help = this.UtilHelp [this.Current.Util]
		if (this.Help)
			this.Help.show ()
		else
			this.UtilHelp [this.Current.Util] = await super.help (`help-util-${this.Current.Util}`)
	}
	focus () {
		this.Current?.focus?.()
	}

	Util = []
	UtilHelp = []
	Current = null
}

class FileLoadError extends Error {
	constructor ( ... a ) {
		super (... a)
	}
}

