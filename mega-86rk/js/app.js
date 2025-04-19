//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


class rom extends app {
	init () {
		super.init ()
		August.init ({ Base: "../" })
		August.loadTPL ({ TOP: "mega-86rk" })([...this.ROM_LIST, "cfg-mngr"], tpl => {
			for (let n of this.ROM_LIST) {
				let r = this.app.$(`#${n}`)
				if (!r)
					return this.error ("Ошибка шаблона")
				r.innerHTML = tpl [n].tpl ({ CFG_MNGR: tpl.cfg_mngr })
				this.init_cfg (n)
			}
			this.app.$("#N82S137N").$("rom-cfg#cfg").on ("input", e => {
				if (e.$.name == "addr") {
					if (e.$.value)
						e.$.value = e.$.value.hex ().HEX (2)
					e.$.fire ("change")
				}
			}).on ("blur", e => {
				if (e.$.name == "device" || e.$.name == "addr") {
					let r = this.cur ("N82S137N")
					r.cfg = r.cfg.filter (el => el.device)
						.sort (( a, b ) => (a.addr ? a.addr.hex () : 0x10000) - (b.addr ? b.addr.hex () : 0x10000))
					for (let i = r.cfg.length, la = 0x10000; i; i--) {
						let cfg = r.cfg [i - 1]
						let a = cfg.addr?.hex ()
						if (isSet (a)) {
							cfg.size = (la - a).HEX (2)
							la = a
						}
					}
					this.set_cfg ("N82S137N")
				}
			}, true)
		})
	}
	init_cfg ( rn ) {
		let Data = this.STORAGE (rn)
		if (Data)
			this [rn] = JSON.parse (Data)
		if (!this [rn].cfg.length)
			this.add (rn)
		for (let cfg of this.app.all (`#${rn}>rom-cfg`)) {
			let Name = cfg.dataset.name
			let Count = +cfg.dataset.count
			let HTML = []
			for (let i = 0; i < (Count || 1); i++) {
				let Row = []
				for (let p of cfg.dataset.param.split (",")) {
					let [nn, vv] = cfg.dataset [p].split (":")
					nn = nn.split (",")
					if (vv)
						vv = new Set (["", ... vv.split (",")])
					Row.push (nn.map (n => {
						let idx = Count ? `data-n=${i}` : ``
						let sel = vv
							? August.form.select (nn.length > 1 ? n : p, null, vv, idx)
							: August.form.input (nn.length > 1 ? n : p, void 0, null, null, isSet (vv) ? idx : `${idx} readonly`)
						return i
							? `<div>${sel}</div>`
							: `<div cap="${n}">${sel}</div>`
					}).join (""))
				}
				HTML.push (Count
					? `<div class=row><div class=n ${i ? "" : "cap=#"}>${i}</div>${Row.join ("")}</div>`
					: Row.join ("<span></span>")
				)
			}
			cfg.innerHTML = HTML.join ("")
			cfg.onchange = e => {
				let n = e.$.dataset.n
				let r = this.cur (rn)
				if (!r [Name])
					r [Name] = {}
				let p = r [Name]
				if (n) {
					if (!p [n])
						p [n] = {}
					p = p [n]
				}
				p [e.$.name] = e.$.value
			}
		}
		this.set_cfg (rn)

		let Manager = this.app.$(`#${rn}>rom-mngr`)
		if (Manager) {
			let SelCfg = Manager.$("select[name=cfg]")
			let SelCfgCopy = Manager.$("select[name=cfg-copy]")
			let DescrCopy = Manager.$("input[name=cfg-copy-descr]")

			SelCfg.add = i => {
				SelCfg [i] = new Option (SelCfg.dataset.tpl.tpl ({ NUM: i }), i, false, i == this [rn].cur)
			}
			this [rn].cfg.forEach (( c, i ) => SelCfg.add (i))
			SelCfg.onchange = e => {
				this [rn].cur = +e.$.value
				this.set_cfg (rn)
			}
			Manager.$("input[name=cfg-descr]").oninput = e => {
				this.cur (rn).descr = e.$.value
			}
			Manager.$("input[name=cfg-add]").onclick = e => {
				SelCfg.add (this.add (rn))
				this.set_cfg (rn)
			}
			Manager.$("input[name=cfg-del]").onclick = e => {
				if (SelCfg.length > 1) {
					this [rn].cfg.delete (SelCfg.value)
					if (this [rn].cur == SelCfg.length - 1)
						this [rn].cur--
					this.set_cfg (rn)
					SelCfg.length = 0
					this [rn].cfg.forEach (( c, i ) => SelCfg.add (i))
				}
			}
			Manager.$("input[name=cfg-copy]").onclick = e => {
				let Copy = Manager.$("#copy")
				Copy.setHeight ((Copy.sh ^= 1) ? Copy.scrollHeight : 0)
				Manager.setClass ("copy", Copy.sh)
				if (!Copy.sh)
					return
				SelCfgCopy.length = 0
				for (let o of SelCfg)
					SelCfgCopy.append (o.cloneNode (true))
				SelCfgCopy.value = this [rn].cur
				DescrCopy.value = this.cur (rn).descr
			}
			Manager.$("input[name=cfg-copy-ok]").onclick = e => {
				if (+SelCfg.value != +SelCfgCopy.value)
					this [rn].cfg [+SelCfgCopy.value] = JSON.parse (JSON.stringify (this.cur (rn)))
				Manager.$("input[name=cfg-copy]").click ()
			}
			Manager.$("input[name=cfg-upload]").onclick = e => {
				let File = this.app.append ("input", {
					type:	"file",
					accept:	".json"
				})
				File.css ("position: absolute; bottom: 100%; visibility: hidden")
				File.onchange = e => {
					this.upload (File.files [0], 1, rn, SelCfg)
				}
				document.body.onfocus = e => {
					this.app.remove (File)
					document.body.onfocus = null
				}
				File.click ()
			}
			Manager.$("input[name=cfg-download]").onclick = e => {
				this.download_fn (`${rn}.json`, JSON.stringify (this.cur (rn)))
			}
			SelCfgCopy.onchange = e => {
				DescrCopy.value = this [rn].cfg [+e.$.value].descr
			}
		}

		$(`save_${rn}`).onclick = e => {
			try {
				let ROM = rn == "N82S137N"
					? new rom_n82s137n (this [rn])
					: new rom_n82sXXXn (this [rn])
				this.download_fn (`${rn}.bin`, new Uint8Array (ROM.BIN))
			} catch ( e ) {
				this.error (e.message)
			}
		}
	}
	set_cfg ( rn ) {
		let rom = this.cur (rn)
		let Descr = this.app.$(`#${rn}>rom-mngr input[name=cfg-descr]`)
		if (Descr)
			Descr.value = rom ? rom.descr : ""
		for (let cfg of this.app.all (`#${rn}>rom-cfg`)) {
			for (let s of [... cfg.all ("select"), ... cfg.all ("input")]) {
				let p = rom ? rom [cfg.dataset.name] : rom
				if (s.dataset.n && p)
					p = p [s.dataset.n]
				s.value = p && p [s.name] || ""
			}
		}
	}
	add ( rn, cfg ) {
		let idx = this [rn].cfg.length
		this [rn].cfg.push (cfg || { cfg: [], descr: "" })
		this [rn].cur = idx
		return idx
	}
	cur ( rn ) {
		return this [rn].cfg [this [rn].cur]
	}
	upload_handler ( name, json, rn, sel ) {
		sel.add (this.add (rn, JSON.parse (json)))
		this.set_cfg (rn)
	}
	done () {
		for (let n of this.ROM_LIST)
			this.STORAGE (n, JSON.stringify (this [n]))
	}
	keydown ( e ) {
		if (super.keydown (e))
			return true
		if (e.ctrlKey && isSet (e.$.dataset.n)) {
			let cfg = e.$.up (this.app, el => el.is ("ROM-CFG"))
			if (!cfg)
				return
			switch (e.keyCode) {
				case 38:  //  up
				case 40:  //  down
				{
					let n = +e.$.dataset.n + (e.keyCode == 38 ? -1 : 1)
					let el = Array.from (cfg.all (`[name=${e.$.name}]`)).find (el => +el.dataset.n == n)
					if (el)
						el.focus ()
					break
				}
				case 39:  //  right
				case 37:  //  left
				{
					let l = Array.from (cfg.all (`[name]`))
					let el = l [l.indexOf (e.$) + (e.keyCode == 37 ? -1 : 1)]
					if (el)
						el.focus ()
					break
				}
			}
		} else if (e.$.name == "addr") {
			return e.key.length > 1 || /[\da-fA-F]/.test (e.key)
		}
	}
	N82S131N = { cfg: [], size: 0x200, mux: true }
	N82S147N = { cfg: [], size: 0x200, mux: false }
	N82S137N = { cfg: [], size: 0x100 }
	ROM_LIST = [ "N82S131N", "N82S137N", "N82S147N" ]
}

class rom_n82sXXXn {
	constructor ( rom ) {
		let cfg = rom.cfg [rom.cur]
		this.BIN = Array (rom.size).fill (0xff)
		for (let n = 0; n < cfg.cfg.length; n++) {
			let b = +cfg.cfg [n].bank
			let w8 = !cfg.cfg [n].win8 ? -1 : +cfg.cfg [n].win8
			let w16 = !cfg.cfg [n].win16 ? -1 : +cfg.cfg [n].win16
			for (let a = 0; a < 8; a++) {
				if (rom.mux) {
					this.rom (cfg, { n, a, b, w8, w16, mux: 0 })
					this.rom (cfg, { n, a, b, w8, w16, mux: 1 })
				} else {
					this.rom (cfg, { n, a, b, w8, w16 })
				}
			}
		}
	}
	rom ( cfg, arg ) {
		let win8 = arg.w8 != -1 && (cfg.win.win8.hex () == arg.a << 13)
		let win16 = arg.w16 != -1 && (cfg.win.win16.hex () == (arg.a & ~1) << 13)
		arg.da = win8 ? arg.w8 : win16 ? (arg.w16 << 1) | (arg.a & 1) : arg.a
		arg.db = (arg.w8 == -1 && arg.w16 == -1) || win8 || win16 ? arg.b : 0
		if (win8 && win16)
			throw Error ("Ошибка: одновременно определены окна 8к и 16к")
		const ADDR = {
			D0:  arg.n & 0x01,
			D1:  arg.n & 0x02,
			D2:  arg.n & 0x04,
			D3:  arg.n & 0x08,
			D4:  arg.n & 0x10,
			D5:  arg.n & 0x20,
			D6:  arg.n & 0x40,
			D7:  arg.n & 0x80,
			A13: arg.a & 0x01,
			A14: arg.a & 0x02,
			A15: arg.a & 0x04,
			MUX: arg.mux
		}
		const DATA = {
			A13:  arg.da & 0x01,
			A14:  arg.da & 0x02,
			A15:  arg.da & 0x04,
			RA8:  arg.db & (arg.mux + 1),
			RA13: arg.da & 0x01,
			RA14: arg.da & 0x02,
			RA15: arg.da & 0x04,
			RA16: arg.db & 0x01,
			RA17: arg.db & 0x02,
			RA18: arg.db & 0x04
		}
		let addr = 0
		let data = 0
		for (let p in cfg.conn) {
			let b = +p.substring (1)
			let c = cfg.conn [p]
			if (p [0] == "A")
				addr |= ADDR [c] ? 1 << b : 0
			else if (p [0] == "D")
				data |= DATA [c] ? 1 << b : 0
		}
		if (this.BIN.length <= addr)
			throw Error ("Ошибка: выход за пределы адресного пространства ПЗУ")
		if (this.BIN [addr] != 0xff)
			throw Error ("Ошибка: конфликт данных по одному адресу")
		this.BIN [addr] = data
	}
}

class rom_n82s137n {
	constructor ( rom ) {
		let cfg = rom.cfg [rom.cur]
		this.BIN = Array (rom.size).fill (0xff)
		let Addr = new Set
		for (let c of cfg.cfg) {
			if (!c.device)
				throw Error (`Ошибка: не определено устройство по адресу \`${c.addr}\``)
			if (c.addr.hex () & 0xff)
				throw Error (`Ошибка: адрес \`${c.device}\` не выровнен по границе 256 байт`)
			if (Addr.has (c.addr))
				throw Error (`Ошибка: множественное определение по адресу \`${c.addr}\``)
			Addr.add (c.addr)
		}
		let dc = {}
		for (let n in cfg.dc) {
			let d = cfg.dc [n]
			if (d) {
				if (isSet (dc [d]))
					throw Error (`Ошибка: множественное определение устройства \`${d}\` в дешифраторе`)
				dc [d] = +n
			}
		}
		for (let c of cfg.cfg) {
			let a = c.addr.hex () >> 8
			let s = c.size.hex () >> 8
			this.BIN.fill (dc [c.device], a, a + s)
		}
	}
}
