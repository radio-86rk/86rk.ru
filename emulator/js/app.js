//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


"use strict"

class emulator extends app {
	async init () {
		this.busy ()
		await this.load_js ("august.memory.js")
		await this.load_js ("august.cpu_8080_8085.js")
		await this.load_js ("august.pit_8253.js")
		await this.load_js ("august.ppi_8255.js")
		await this.load_js ("august.dma_8257.js")
		await this.load_js ("august.crt_8275.js")
		await this.load_js ("august.rtc_6242.js")
		await this.load_js ("august.keyboard_86rk.js")
		await this.load_js ("august.video_86rk.js")
		this.busy ()

		const is_set = v => v !== "undefined"
		if (!(
			is_set (typeof august_memory)
			&& is_set (typeof august_cpu_8080)
			&& is_set (typeof august_pit_8253)
			&& is_set (typeof august_ppi_8255)
			&& is_set (typeof august_dma_8257)
			&& is_set (typeof august_crt_8275)
			&& is_set (typeof august_rtc_6242)
			&& is_set (typeof august_keyboard_86rk)
			&& is_set (typeof august_video_86rk)
		))
			return

		super.init ("", null, _ => true)
		this.init_file_open (".rk, .rkr, .rka, .rkm, .rko, .rki, .gam, .bin", _ => this.Run)
		this.app.setClass ("visible")

		this.CompSelect = $("computers")
		this.CustomConf = app.deserialize (this.STORAGE ("custom_conf") || "{}")
		{
			let grp = this.CompSelect.$("optgroup")
			for (let idx in emulator.COMPUTER_LIST)
				this.CompSelect.insert (new Option (emulator.COMPUTER_LIST [idx].NAME, idx), grp)
			for (let idx in this.CustomConf)
				grp?.append (new Option (this.CustomConf [idx].NAME, idx))
		}
		this.CompSelect.value = this.STORAGE ("computer")
		if (!(this.CompSelect.value in emulator.COMPUTER_LIST || this.CompSelect.value in this.CustomConf))
			this.CompSelect.value = "radio-86rk"
		this.CompSelect.onchange = async e => {
			if (this.CompSelect.value == "new") {
				this.CompSelect.value = this.Current
				return this.custom_conf ()
			}
			this.set_hash ("")
			await this.select (this.CompSelect.value == "restart" ? this.Current : void 0)
		}

		this.Audio = new emulator.audio (this)
		this.Screen = this.app.$("app-emulator").$("canvas")
		this.EmulScreen = this.app.$("app-emulator").$("div.screen")
		this.EmulScreen.on ("fullscreenchange", e => e.$.setClass ("fullscreen"))

		this.ScreenScale = this.slider_cb ("screen_scale", 3, 8, v => {
			let val = v / 2 + 0.5
			this.app.$("app-emulator").setClass ("auto", !v)
			this.EmulScreen.prop ("--scale", val)
			this.$("screen_scale_val").attr ("val", v ? val : "auto")
		})
		this.ScreenSmoothing = this.slider_cb ("screen_smoothing", 1, 2, v => {
			let d = this.$("screen_smoothing").dataset
			this.$("screen_smoothing_val").attr ("val", v ? d.val1 : d.val0)
			this.EmulScreen.prop ("--image-rendering", ["pixelated", "auto"][v])
		})
		this.ScreenBrightness = this.slider_cb ("screen_brightness", 5, 20, v => {
			let bri = (v / 10 + 0.5).toFixed (1)
			this.$("screen_brightness_val").attr ("val", bri)
			this.EmulScreen.prop ("--brightness", bri)
		})
		this.ScreenContrast = this.slider_cb ("screen_contrast", 10, 50, v => {
			let con = (v / 10 + 1).toFixed (1)
			this.$("screen_contrast_val").attr ("val", con)
			this.EmulScreen.prop ("--contrast", con)
		})
		this.ScreenAspectRatio = this.slider_cb ("screen_aspect_ratio", 0, 105, v => {
			let ar = (v / 500 + emulator.DEFAULT_ASPECT_RATIO).toFixed (3)
			this.$("screen_aspect_ratio_val").attr ("val", ar)
			this.EmulScreen.prop ("--aspect-ratio", ar)
			setTimeout (_ => this.ScreenAR.set (ar))
		})
		this.ScreenAR = this.radio_cb ("screen_aspect_ratio_fix", 0, ( v, set ) => {
			if (!set)
				this.ScreenAspectRatio.set ((v - emulator.DEFAULT_ASPECT_RATIO) * 500)
		})
		this.Rendering = this.radio_cb ("rendering", 0, v => {
			this.Comp?.event.fire ("rendering", +v)
		})
		this.SkipFrame = this.checkbox_cb ("skip_frame", v => {
			this.Comp?.event.fire ("skip-frame", v)
		})
		this.CrtEffect = this.checkbox_cb ("crt_effect", v => {
			this.Comp?.event.fire ("crt-effect", v)
		})
		this.KbdLayout = this.radio_cb ("kbd_layout", 0, v => {
			this.Comp?.event.fire ("kbd-layout", +v)
		})
		this.ROMDisk = this.radio_cb ("rom_disk", 1, v => {
			this.Comp?.event.fire ("rom-disk", +v)
		})
		this.radio_cb ("cpu", "8080", v => {
			this.CPU = v
		})
		this.CPUClock = this.slider_cb ("cpu_clock", 2, 10, v => {
			this.$("cpu_clock_val").attr ("val", v + 1)
			this.AdjCPUClock?.set (this.AdjCPUClock.get ())
		})
		this.AdjCPUClock = this.checkbox_cb ("adj_cpu_clock", v => {
			this.Comp?.cpu_clock (v
				? (this.CPUClock.get () + 1) * 1_000_000
				: this.Comp?.cfg_cpu_clock ()
			)
		})
		this.SoundVolume = this.slider_cb ("sound_volume", 10, 101, v => {
			this.$("sound_volume_val").attr ("val", v)
			this.Audio.volume (v)
		})
		this.SoundCovox = this.radio_cb ("sound_covox", 0, v => {
			this.Covox = +v
		})
		this.SoundLPFFreq = this.slider_cb ("sound_lpf_freq", 11, 20, v => {
			this.$("sound_lpf_freq_val").attr ("val", v + 1)
			this.Audio.lpf_freq ((v + 1) * 1000)
		})
		this.SoundLPF = this.checkbox_cb ("sound_lpf", v => {
			this.Audio.lpf (v)
		})

		this.mouse_bind = this.mouse.bind (this)
		this.app.on ("wheel dblclick mousemove", this.mouse_bind, { passive: false })

		window.onblur = () => {
			this.Comp?.stop ()
		}
		window.onhashchange = async () => {
			if (this.SkipHash) {
				this.SkipHash = 0
				return
			}
			if (location.hash.length < 5) {
				await this.select (this.Current)
				return
			}
			try {
				let a = JSON.parse (atob (location.hash.substring (1)))
				await this.select (a.comp)
				await this.run_file (a.file, a.auto)
			} catch ( e ) {
				console.log (e)
			}
		}

		let FirstRun = this.STORAGE ("computer") === ""
		await window.onhashchange ()
		if (FirstRun)
			this.run_file ("radio-86.rk")
	}
	done () {
		window.onblur = window.onhashchange = null
		this.Debuger?.done ()
		this.Comp?.shutdown ()
		this.Audio.done ()
		this.app.un ("wheel dblclick mousemove", this.mouse_bind, { passive: false })
		super.done ()
	}
	get comp () {
		let conf = this.CustomConf [this.Current]
		let comp = conf
			? emulator.radio_86rk_custom
			: emulator.COMPUTER_LIST [this.Current]
		return this.CPU === "Z80"
			? (async () => {
				this.busy ()
				await this.load_js ("august.cpu_z80.js")
				this.busy ()
				return typeof august_cpu_Z80 === "undefined"
					? null
					: class extends comp {
						constructor ( app ) {
							super (app, conf)
						}
						get class_cpu () {
							return august_cpu_Z80
						}
					}
			})()
			: this.CPU === "8085"
			? class extends comp {
				constructor ( app ) {
					super (app, conf)
				}
				get class_cpu () {
					return august_cpu_8085
				}
			}
			: conf
			? class extends comp {
				constructor ( app ) {
					super (app, conf)
				}
			}
			: comp
	}
	async select ( v ) {
		if (isSet (v))
			this.CompSelect.value = v
		else if (this.CompSelect.value === this.Current)
			return
		this.Current = this.CompSelect.value
		this.ScreenShotCount = 0
		this.Comp?.shutdown ()
		await this.run ()
		await this.load_catalog ()
		if (this.Comp)
			this.STORAGE ("computer", this.Current)
	}
	async run () {
		this.Comp = await new (await this.comp)(this)
		if (!this.Comp)
			return

		const status = state => {
			this.indicator ({
				id:	"status",
				class:	`status-${state}`,
				state:	state
			})
		}

		this.Comp.event.on ("start", _ => {
			if (this.Comp.stopped ())
				return
			this.Audio.resume ()
			if (!this.Debuger)
				status ("run")
		}).on ("stop", _ => {
			if (!this.Comp.stopped ())
				return
			this.Audio.suspend ()
			if (!this.Debuger)
				status ("stopped")
		}).on ("suspend", d => {
			console.log ("suspend")
			status ("suspend")
			if (!d)
				this.Audio.suspend ()
		}).on ("resume", _ => {
			console.log ("resume")
			status ("run")
			this.Audio.resume ()
		}).on ("exec", _ => {
			console.log ("exec")
			status ("run")
			this.Audio.resume ()
		}).on ("run", cpu => {
			status ("run")
			this.Comp.event.fire ("kbd-layout", +this.KbdLayout.get ())
			this.$("cpu").attr ("cpu", cpu.NAME)
			this.$("adj_cpu_clock").fire ("change")
			this.app.$("app-title").textContent = this.Comp.name
			this.indicator ({
				id:	"cpu",
				state:	cpu.NAME
			})
		}).on ("kbd-layout", jcuken => {
			this.indicator ({
				id:	"layout",
				class:	jcuken ? "layout-jcuken" : "",
				state:	jcuken ? "jcuken" : "qwerty"
			})
		}).on ("led-rus", rus => {
			this.indicator ({
				id:	"lang",
				class:	rus ? "lang-rus" : "",
				state:	rus ? "rus" : "lat"
			})
		}).on ("cpu-clock", clock => {
			this.$("ind_cpu_clock").textContent = (clock / 1_000_000).toFixed (3)
		})

		await this.Comp.run ()

		const RESET_TICS = 2_000_000
		const KBD = this.Comp.device ().KEYBOARD
		let TapeCount = 0
		let BitCount = 0
		let Byte = 0
		let Even = 0
		let Tics = -RESET_TICS
		let StopID = 0
		let Buffer = null
		let reset = () => {
			BitCount = 0
			Byte = 0
			Even = 0
			Buffer = null
		}

		this.Comp.event.on ("kbd-pc", pc => {
			let Bit = pc & 0x01
			this.indicator ({
				id:	"tape",
				class:	Bit ? "tape" : "",
				state:	"out"
			})
			if (this.Comp.tics () - Tics > RESET_TICS) {
				this.indicator ({
					id:	"tape",
					class:	"",
					state:	"tape"
				})
				reset ()
			} else if (Even ^= 1) {
				Byte <<= 1
				Byte |= Bit
				KBD.PC = ~KBD.PC
				if (Buffer === null) {
					if (Byte == 0xE6)
						Buffer = [Byte]
				} else if (++BitCount == 8) {
					Buffer.push (Byte)
					BitCount = 0
					Byte = 0
					clearTimeout (StopID)
					StopID = setTimeout (_ => {
						if (this.Comp.stopped ())
							return
						this.indicator ({
							id:	"tape",
							class:	"",
							state:	"tape"
						})
						this.download_fn (
							`${this.Current}-tape-${TapeCount++}.rki`,
							new Uint8Array (Buffer)
						)
						KBD.reset ()
						reset ()
					}, 300)
				}
			}
			this.Comp.device ().BIT_SOUND.out (pc, this.Covox)
			Tics = this.Comp.tics ()
		}).on ("reset", _ => {
			clearTimeout (StopID)
			reset ()
		})
	}
	async load_catalog () {
		this.$("catalog").setClass ("busy", 1)
		this.Catalog = await this.load (`soft/catalog.json.php?id=${this.Comp.cfg.PATH}`, "json")
		this.$("catalog").setClass ("busy", 0)
		this.CurCatalog = this.Catalog
		this.FilePath = []
		this.show_catalog ()
	}
	show_catalog () {
		const DirList = this.CurCatalog.DirList.sort (( a, b ) => a.name.localeCompare (b.name))
		const FileList = this.CurCatalog.FileList.sort (( a, b ) => a.name.localeCompare (b.name))
		this.$("catalog").setClass ("up", this.CurCatalog !== this.Catalog)
		this.$("catalog").innerHTML = this.$("tpl_catalog").textContent.pattern ({
			DIR_LIST: [{
				NAME		() { return this.$f.name },
				$size		() { return DirList.length },
				$set		() { this.$f = DirList [this.$i] }
			}],
			FILE_LIST:[{
				NAME		() { return this.$f.name },
				SIZE		() { return this.$f.size.numeral () },
				AUTO		() { return this.$f.auto },
				DESCR		() { return this.$f.descr },
				$size		() { return FileList.length },
				$set		() { this.$f = FileList [this.$i] }
			}]
		})
	}
	indicator ( arg ) {
		let lamp = this.$(`ind_${arg.id}`)
		lamp.textContent = lamp.attr (`${arg.id}-${arg.state}`)
		lamp.className = arg.class || ""
	}
	fullscreen () {
		if (this.Debuger)
			return
		if (document.fullscreenElement)
			return document.exitFullscreen ()
		this.EmulScreen.requestFullscreen ()
			.catch (e => this.error (e.message))
	}
	screenshot () {
		const Canvas = this.Screen.create ("canvas")
		const CTX = Canvas.getContext ("2d")
		Canvas.width = this.Screen.clientWidth
		Canvas.height = this.Screen.clientHeight
		CTX.imageSmoothingEnabled = this.ScreenSmoothing.get ()
		CTX.imageSmoothingQuality = "high"
		CTX.filter = `brightness(${this.Screen.prop ("--brightness")}) contrast(${this.Screen.prop ("--contrast")})`
		CTX.drawImage (this.Screen, 0, 0, this.Screen.width, this.Screen.height, 0, 0, Canvas.width, Canvas.height)
		Canvas.toBlob (b =>
			this.download_fn (`${this.Current}-screen-${this.ScreenShotCount++}.png`, b),
			"image/png"
		)
	}
	async debuger () {
		const undef = () => typeof august_debuger_86rk === "undefined"
		if (undef ()) {
			this.busy ()
			await this.load_js ("august.debuger_86rk.js")
			this.busy ()
			if (undef ())
				return
		}
		if (this.Debuger)
			this.Debuger.done (), this.Debuger = void 0
		else
			this.Debuger = await new august_debuger_86rk (this)
	}
	async run_file ( file_name, auto ) {
		const bin = await this.load (`soft/${this.Comp.cfg.PATH}/${file_name}`, "arrayBuffer")
		if (!bin)
			return
		try {
			this.upload_handler (file_name, bin, _ => true)
			if (auto)
				this.Comp.event.fire ("insert-text", auto)
		} catch ( e ) {
			this.error (this.CFG.ERROR.UPLOAD_ERROR.tpl ({ NAME: file_name, MESS: e.message }))
		}
	}
	add_file ( file_name, code, addr, auto_start = false ) {
		if (!this.Comp.upload (code, addr, auto_start))
			throw new Error (this.CFG.ERROR.RAM_TOP)
//		this.Files.push ({ file_name, code, addr })
//		this.add_file_list (this.Files.length - 1, file_name)
	}
	upload_handler ( file_name, bin, run, handler ) {
		bin = new Uint8Array (bin)
		if (isFunction (handler))
			return handler (file_name, bin)
		const ext = /\.([a-z]+)$/.test (file_name.toLowerCase ()) && RegExp.$1
		const word = i => bin [i] | bin [i + 1].shl8
		const get_data = ( pos, len ) => String.fromCharCode (... bin.subarray (pos, pos + len))
		const test_filename = pos => /^[\x25-\x5F]+(\$)?\x20*$/.test (get_data (pos, 8))
		const upload = ( ... args ) => {
			this.add_file (file_name, ... args)
			this.status (this.CFG.NOTICE.LOADED.tpl ({
				NAME:	file_name,
				ADDR1:	args [1].HEX16,
				ADDR2:	(args [1] + args [0].length - 1).HEX16
			}))
		}
		if (ext == "rom") {
			return this.Comp.reset (), this.rom_disk (file_name, bin)
		} else if (ext == "bas") {
			return this.tapein_handler (file_name, bin)
		} else if (ext == "ord") {
			if (!test_filename (0))
				throw new Error (this.CFG.ERROR.FORMAT)
			let Addr = word (8)
			let Size = word (10)
			if (bin.length - 16 < Size)
				throw new Error (this.CFG.ERROR.SIZE)
			return upload (bin.subarray (16, Size + 16), Addr, RegExp.$1 === "$" && run ())
		} else if (ext == "rko") {
			if (!test_filename (0))
				throw new Error (this.CFG.ERROR.FORMAT)
			let fn = RegExp.$_
			let p = 8
			while (bin [p] === 0)
				p++
			if (bin [p] != 0xE6)
				throw new Error (this.CFG.ERROR.FORMAT)
			let Begin = p + 5
			let End = word (p + 3).bswap16 + p + 8
			if (!test_filename (Begin) || fn != RegExp.$_ || bin [End] != 0xE6)
				throw new Error (this.CFG.ERROR.FORMAT)
			let CRC = app.crc_rk (bin.subarray (Begin, End))
			if (CRC != word (End + 1).bswap16)
				throw new Error (this.CFG.ERROR.CRC.tpl ({ CRC: CRC.HEX16 }))
			return upload (bin.subarray (Begin + 16, End), word (Begin + 8), RegExp.$1 === "$" && run ())
		} else if (ext == "rkm") {
			let E6 = +(bin [0] == 0xE6)
			let Begin = word (0 + E6).bswap16
			let End = word (2 + E6).bswap16
			let Size = End - Begin + 1
			if (bin.length < Size + 6 + E6)
				throw new Error (this.CFG.ERROR.SIZE)
			let CRC = emulator.mikrosha.crc (bin.subarray (4 + E6, Size + 4 + E6))
			if (CRC != word (Size + 4 + E6).bswap16)
				throw new Error (this.CFG.ERROR.CRC.tpl ({ CRC: CRC.HEX16 }))
			return upload (bin.subarray (4 + E6, Size + 4 + E6), Begin, run ())
		}
		let Code = app.code_rk (bin)
		if (!Code)
			upload (bin, 0)
		else if (!Code.OK)
			throw new Error (this.CFG.ERROR.CRC.tpl ({ CRC: Code.CRC.HEX16 }))
		else
			upload (Code.Code, Code.Addr, run ())
	}
	async upload ( ... a ) {
		if (!this.FileSizeLimit)
			return await super.upload (... a)
		const fs = this.CFG.FILE_SIZE_LIMIT
		this.CFG.FILE_SIZE_LIMIT = this.FileSizeLimit
		await super.upload (... a)
		this.CFG.FILE_SIZE_LIMIT = fs
		this.FileSizeLimit = 0
	}
	rom_disk ( file_name, bin ) {
		this.status (this.CFG.NOTICE.ROM_DISK.tpl ({
			NAME: file_name
		}))
		this.Comp.device ().ROM_DISK.load (bin)
	}
	tapein_handler ( file_name, bin ) {
		console.log ("tapein_handler")
		this.status (this.CFG.NOTICE.TAPE_FILE.tpl ({
			NAME: file_name
		}))
		this.Comp.device ().KEYBOARD.reset ()
		const DMA = this.Comp.device ().DMA
		const PPI = this.Comp.device ().PPI_KBD
		let Rakcord = 2 * 8
		let BitCount = 0
		let BytePtr = 0
		let Byte = 0
		let State = 0
		let Tics = 0
		let get = PPI.get.bind (PPI)
		let set = bit => {
			this.indicator ({
				id:	"tape",
				class:	bit ? "tape" : "",
				state:	"in"
			})
			PPI.r [2] = (PPI.r [2] & ~0b0001_0000) | (bit << 4)
		}
		PPI.get = r => {
			if (r != 2) {
			} else if (Tics) {
				if (Rakcord) {
					Rakcord--
					set (State ^= 1)
				} else if (++State == 1) {
					if (!BitCount)
						Byte = bin [BytePtr++]
					set (Byte >> 7 & 0x01)
				} else if (State == 4) {
					State = 0
					set (~Byte >> 7 & 0x01)
					if (++BitCount == 8)
						BitCount = 0
					else
						Byte <<= 1
					if (BytePtr == bin.length && BitCount == 0) {
						console.log ("tapein_handler done")
						this.indicator ({
							id:	"tape",
							class:	"",
							state:	"tape"
						})
						this.Comp.keyboard (1)
						PPI.get = get
					}
				}
			} else if (DMA.Mode == 0x80) {
				Tics = this.Comp.tics ()
				this.Comp.keyboard (0)
				set (0)
			}
			return get (r)
		}
	}
	save_handler () {

	}
	async custom_conf () {
		if (this.Modal)
			return
		if (this.ModalCustomConf)
			return this.ModalCustomConf.show ()

		let conf_list = () => {
			let self = this
			let list = (function* () {
				for (let idx in self.CustomConf)
					yield { idx, c: self.CustomConf [idx] }
			})()
			let conf_list = this.ModalCustomConf.$("#conf_list")
			conf_list.innerHTML = this.$("tpl_conf_list").textContent.trim ().pattern ([{
				IDX		() { return this.$idx },
				NAME		() { return this.$c.NAME },
				RESET_ADDR	() { return this.$c.RESET_ADDR.HEX16 },
				CPU_CLOCK	() { return (this.$c.CPU_CLOCK / 1_000_000).toFixed (6).replace (".", ",") },
				PIT_CLOCK	() { return (this.$c.PIT_CLOCK / 1_000_000).toFixed (6).replace (".", ",") },
				PIXEL_CLOCK	() { return this.$c.PIXEL_CLOCK / 1_000_000 },
				FONT_WIDTH	() { return this.$c.FONT_WIDTH },
				FONT_HEIGHT	() { return this.$c.FONT_HEIGHT },
				FONT_SELECT	() { return this.$c.FONT_SELECT },
				KEYBOARD	() { return this.$c.KEYBOARD },
				KBD_PARAM1	() { return this.$c.KBD_PARAM [0] },
				KBD_PARAM2	() { return this.$c.KBD_PARAM [1] },
				DMA_WO		() { return this.$c.DMA_WO },
				DMA_WR		() { return this.$c.DMA_WR },
				INTE_SOUND	() { return this.$c.INTE_SOUND },
				MONITOR		() { return this.$c.ROM_FN },
				FONT		() { return this.$c.FONT_FN },
				RAM_ADDR1	() { return this.$addr1 ("RAM") },
				RAM_ADDR2	() { return this.$addr2 ("RAM") },
				ROM_ADDR1	() { return this.$addr1 ("ROM") },
				ROM_ADDR2	() { return this.$addr2 ("ROM") },
				PPI_KBD_ADDR1	() { return this.$addr1 ("PPI_KBD") },
				PPI_KBD_ADDR2	() { return this.$addr2 ("PPI_KBD") },
				PPI_ADDR1	() { return this.$addr1 ("PPI") },
				PPI_ADDR2	() { return this.$addr2 ("PPI") },
				CRT_ADDR1	() { return this.$addr1 ("CRT") },
				CRT_ADDR2	() { return this.$addr2 ("CRT") },
				DMA_ADDR1	() { return this.$addr1 ("DMA") },
				DMA_ADDR2	() { return this.$addr2 ("DMA") },
				PIT_ADDR1	() { return this.$addr1 ("PIT") },
				PIT_ADDR2	() { return this.$addr2 ("PIT") },
				RTC_ADDR1	() { return this.$addr1 ("RTC") },
				RTC_ADDR2	() { return this.$addr2 ("RTC") },
				FONT_RAM_ADDR1	() { return this.$addr1 ("FONT_RAM") },
				FONT_RAM_ADDR2	() { return this.$addr2 ("FONT_RAM") },
				$size		() { let x = list.next (); this.$idx = x.value?.idx; this.$c = x.value?.c; return x.done ? 0 : Number.MAX_SAFE_INTEGER },
				$addr1		( n ) { return this.$c.MEMORY [n] ? this.$c.MEMORY [n].addr.HEX16 : "" },
				$addr2		( n ) { return this.$c.MEMORY [n] ? (this.$c.MEMORY [n].addr + this.$c.MEMORY [n].size - 1).HEX16 : "" }
			}])
			August.sync (window, _ => {
				conf_list.prop ("--table-height", conf_list.first ()?.scrollHeight || 0)
				conf_list.scrollTop = 0
			})
		}
		let update_storage = () => {
			this.STORAGE ("custom_conf", app.serialize (this.CustomConf))
		}

		let html = await this.load (`custom-conf.${this.LANG}.html`.set ("v"))
		this.modal (this.CFG.MODAL_TITLE.CUSTOM_CONF, null, null, "custom-conf", html.tpl (null, 8))
		this.ModalCustomConf = this.Modal
		this.ModalCustomConf.hide = this.ModalCustomConf.show = () => {
			this.Modal = this.app.setClass ("custom-conf") ? this.ModalCustomConf : null
			this.set_modal ()
			if (this.Modal) {
				this.Modal.prop ("--title-height", this.Modal.scrollHeight)
				conf_list ()
				this.Modal.first ().scrollTop = 0
			}
		}
		this.add_cfg ()
		this.set_modal ()
		this.ModalCustomConf.show ()

		let form = this.ModalCustomConf.$("form")
		let addr = new Map
		let rom = {}
		let set_addr = el => {
			if (!el)
				return
			let inp = el.all ("input")
			if (inp.length != 2)
				return
			let addr1 = inp [0].value ? inp [0].value.hex () : void 0
			let addr2 = inp [1].value ? inp [1].value.hex () : void 0
			let size = isSet (addr1) && isSet (addr2) ? addr2 - addr1 + 1 || -1 : 0
			addr.set (el, { addr1, addr2, size })
			el.$("#size").innerText = size < 0
				? "????"
				: size
				? size.hex (2)
				: ""
		}
		let set_num = el => {
			el.dec_value = el.value.replaceAll (" ", "")
			el.value = el.dec_value.numeral (" ")
		}
		let error = el => {
			el.$("input")?.focus ()
			el.setClass ("error", 1)
			el.onanimationend = () => el.setClass ("error", 0)
		}
		let re = ( e, sfx ) => {
			return e.$.dataset.num === "dec"
				? new RegExp (`^\\d${sfx}$`)
				: e.$.dataset.num === "hex"
				? new RegExp (`^[0-9a-fA-F]${sfx}$`)
				: false
		}
		let load_conf = c => {
			let set_mem = n => {
				let m = c.MEMORY [n.toUpperCase ()]
				let el = form.$(`[data-addr=${n}]`)
				let inp = el.all ("input")
				inp [0].value = m?.size ? m.addr.HEX16 : ""
				inp [1].value = m?.size ? (m.addr + m.size - 1).HEX16 : ""
				set_addr (el)
			}
			let rom = ( rom, fn, bin ) => {
				let a = form.$(`[data-rom=${rom}]`).$("a[name=load_rom]")
				this.ModalCustomConf.load_rom (a, fn, bin)
			}
			form.name.value = c.NAME
			form.reset_addr.value = c.RESET_ADDR.HEX16
			form.cpu_clock.value = c.CPU_CLOCK
			form.pit_clock.value = c.PIT_CLOCK
			form.kbd_param1.value = c.KBD_PARAM [0]
			form.kbd_param2.value = c.KBD_PARAM [1]
			form.kbd.value = c.KEYBOARD
			form.pixel_clock.value = c.PIXEL_CLOCK / 1_000_000
			form.font_width.value = c.FONT_WIDTH
			form.font_height.value = c.FONT_HEIGHT
			form.font_select.value = c.FONT_SELECT
			form.dma_wo.value = c.DMA_WO
			form.dma_wr.value = c.DMA_WR
			form.inte_sound.value = c.INTE_SOUND
			set_mem ("ram")
			set_mem ("rom")
			set_mem ("ppi_kbd")
			set_mem ("ppi")
			set_mem ("crt")
			set_mem ("dma")
			set_mem ("pit")
			set_mem ("rtc")
			set_mem ("font_ram")
			set_num (form.cpu_clock)
			set_num (form.pit_clock)
			set_num (form.kbd_param1)
			set_num (form.kbd_param2)
			rom ("monitor", c.ROM_FN, c.ROM)
			rom ("font", c.FONT_FN, c.FONT)
			form.scrollIntoView ({ block: "start", behavior: "smooth" })
		}
		this.ModalCustomConf.load_rom = ( el, file_name, bin ) => {
			let p = el.up (null, el => el.dataset.rom)
			p.$("#fn").innerText = file_name
			rom [p.dataset.rom] = { file_name, bin }
		}
		this.ModalCustomConf.conf_delete = idx => {
			let grp = this.CompSelect.$("optgroup")
			grp.remove (grp.$(`option[value="${idx}"]`))
			delete this.CustomConf [idx]
			conf_list ()
			update_storage ()
		}
		this.ModalCustomConf.conf_save = idx => {
			let c = this.CustomConf [idx]
			this.save_project (c.NAME, c)
		}
		this.ModalCustomConf.conf_copy = idx => {
			load_conf (this.CustomConf [idx])
		}
		this.ModalCustomConf.load_conf = c => {
			form.conf_load.blur ()
			if (c)
				load_conf (c)
		}
		for (let el of form.all ("[data-addr]")) {
			set_addr (el)
		}
		for (let el of form.all ("input[data-num=dec]")) {
			set_num (el)
		}
		form.onpaste = e => {
			let $ = re (e, "*")
			return $ ? $.test (e.clipboardData.getData ("text/plain").trim ()) : true
		}
		form.onkeydown = e => {
			if (e.keyCode == 27)
				return this.ModalCustomConf.show ()
			let $ = re (e, "|..+")
			return $ ? $.test (e.key) : true
		}
		form.oninput = e => {
			if (e.$.dataset.num === "dec")
				set_num (e.$)
			else
				set_addr (e.$.up (null, el => el.dataset.addr))
		}
		form.onsubmit = e => {
			e.stop ()
			form.ok.blur ()
			let reset_addr = form.reset_addr.value.hex ()
			let cpu_clock = +form.cpu_clock.dec_value
			let pit_clock = +form.pit_clock.dec_value
			if (reset_addr > 0xFFFF)
				return error (form.reset_addr.up (null, el => el.dataset.addr))
			if (cpu_clock < 1_000_000 || cpu_clock > 10_000_000)
				return error (form.cpu_clock.up (null, el => el.dataset.param))
			if (pit_clock < 1_000_000 || pit_clock > 10_000_000)
				return error (form.pit_clock.up (null, el => el.dataset.param))
			if (!rom.monitor)
				return error (form.$("[data-rom=monitor]"))
			if (!rom.font)
				return error (form.$("[data-rom=font]"))
			let CONF = {
				NAME:		form.name.value.trim ().htmlEntities (),
				CPU_CLOCK:	cpu_clock,
				PIT_CLOCK:	pit_clock,
				PIXEL_CLOCK:	+form.pixel_clock.value * 1_000_000,
				FONT_WIDTH:	+form.font_width.value,
				FONT_HEIGHT:	+form.font_height.value,
				FONT_SELECT:	+form.font_select.value,
				DMA_WO:		+form.dma_wo.value,
				DMA_WR:		+form.dma_wr.value,
				INTE_SOUND:	+form.inte_sound.value,
				CRT_DMA_CHANEL:	2,
				KEYBOARD:	form.kbd.value,
				KBD_PARAM:	[+form.kbd_param1.dec_value || 1, +form.kbd_param2.dec_value || 1],
				RESET_ADDR:	reset_addr,
				ROM:		rom.monitor.bin,
				FONT:		rom.font.bin,
				ROM_FN:		rom.monitor.file_name,
				FONT_FN:	rom.font.file_name,
				PATH:		"radio-86rk",
				MEMORY:		{}
			}
			let MMap = new Set
			for (let [el, r] of addr) {
				if (!r.size)
					continue
				if (r.size < 0 || r.addr1 > 0xFFFF || r.addr2 > 0xFFFF)
					return error (el)
				let d = el.dataset.addr.toUpperCase ()
				CONF.MEMORY [d] = { addr: r.addr1, size: r.size }
				if (d == "FONT_RAM") {
				} else if (d == "DMA" && CONF.DMA_WO) {
					CONF.MEMORY.DMA.mode = { wr: 1 }
				} else for (let a = r.addr1; a <= r.addr2; a++) {
					if (MMap.has (a))
						return error (el)
					MMap.add (a)
				}
			}
			if (rom.monitor.length > CONF.MEMORY.ROM.size)
				return error (form.$("[data-rom=monitor]"))
			let id = `86rk-${this.id.z (4)}`
			CONF.RAM_TOP = CONF.MEMORY.RAM.addr + CONF.MEMORY.RAM.size - 1
			if (!CONF.NAME)
				CONF.NAME = id
			this.CustomConf [id] = CONF
			this.ModalCustomConf.show ()
			August.form.$option (this.CompSelect.$("optgroup"), CONF.NAME, id)
			update_storage ()
		}
	}
	keydown ( e ) {
		if (!this.Comp || this.Modal)
			return super.keydown (e)
		if (this.Comp.stopped () && super.keydown (e))
			return true
		if (!this.Comp.stopped () && !e.altKey)
			return true
		if (app.is_input (e))
			return true
		e.stop ()
		if (e.altKey) switch (e.keyCode) {
			case 91:  //  Meta
				this.Comp.reset ()
				break
			case 45:  //  Insert
				if (!navigator?.clipboard?.readText)
					return this.error (this.CFG.ERROR.NO_SUPPORT)
				navigator.clipboard.readText ().then (t => {
					this.Comp.event.fire ("insert-text", t)
				}).catch (e => {
					this.error (this.CFG.ERROR.CLIPBOARD.tpl ({ ERROR: e }))
				})
				return
			case 48:  //  0-7
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
				this.ScreenScale.set ([0, 1, 3, 5, 7, 2, 4, 6][e.keyCode - 48])
				return
			case 67:  //  C
				this.custom_conf ()
				return
			case 83:  //  S
				this.screenshot ()
				return
			case 82:  //  R
				this.FileSizeLimit = this.CFG.ROM_DISK_SIZE_LIMIT
				this.file_open (this.rom_disk.bind (this), ".bin, .rom")
				return
			case 75:  //  K
				this.KbdLayout.set (this.KbdLayout.get () ^ 1)
				return
			case 70:  //  F
				this.SoundLPF.set (this.SoundLPF.get () ^ 1)
				return
			case 77:  //  M
				this.Audio.mute ()
				return
			case 96:  //  Num 0
				this.Comp.suspend (1)
				this.Comp.turbo ()
				this.AdjCPUClock.set (0)
				this.Comp.resume ()
				return
			case 107:  //  Num +
				this.Comp.suspend (1)
				this.CPUClock.set (this.CPUClock.get () + 1)
				this.AdjCPUClock.set (1)
				this.Comp.resume ()
				return
			case 109:  //  Num -
				this.Comp.suspend (1)
				this.CPUClock.set (this.CPUClock.get () - 1)
				this.AdjCPUClock.set (1)
				this.Comp.resume ()
				return
			case 106:  //  Num *
				this.Comp.suspend (1)
				this.AdjCPUClock.set (!this.AdjCPUClock.get ())
				this.Comp.resume ()
				return
			case 38:  //  Up
				this.SoundVolume.set (this.SoundVolume.get () + 1)
				break
			case 40:  //  Down
				this.SoundVolume.set (this.SoundVolume.get () - 1)
				break
			case 37:  //  Left
//				this.SoundLPFFreq.set (this.SoundLPFFreq.get () - 1)
				break
			case 39:  //  Right
//				this.SoundLPFFreq.set (this.SoundLPFFreq.get () + 1)
				break
			case 114:  //  F3
				if (e.ctrlKey)
					return this.file_open (this.tapein_handler.bind (this))
			case 116:  //  F5
				if (this.Debuger)
					break
				this.Run = e.keyCode == 116
				this.file_open ()
				return
		}
		this.Debuger?.keydown (e)
		switch (e.keyCode) {
			case 112:  //  F1
				this.help ()
				return
			case 13:  //  Enter
			case 122:  //  F11
				this.fullscreen ()
				return
			case 123:  //  F12
				if (this.conf ())
					this.Comp.stop ()
				return
			case 19:  //  Pause
				this.debuger ()
				return
		}
	}
	mouse ( e ) {
		if (super.mouse (e))
			return true
		switch (e.type) {
			case "mousemove":
				this.app.s ({ cursor: "" })
				clearTimeout (this.CursorID)
				if (e.$ === this.EmulScreen || e.$.parentElement === this.EmulScreen) {
					this.CursorID = setTimeout (_ => {
						this.app.s ({ cursor: "none" })
					}, 3000)
				}
				break
			case "wheel":
				if (e.ctrlKey) {
					e.stop ()
					if (e.$.isParent (this.$("catalog")))
						this.$("catalog").scrollLeft -= e.wheelDelta.sign () * 50
				}
				break
		}
		this.Debuger?.mouse (e)
	}
	async click_handler ( e ) {
		if (!this.Comp)
			return
		const name = super.click_handler (e)
		switch (name) {
			case true:
				this.Comp.stop ()
				return
			case "reset":
				this.Comp.reset ()
				break
			case "mute":
				this.Audio.mute ()
				break
			case "debuger":
				this.debuger ()
				return
			case "upload":
			case "upload_n_run":
				this.Run = name == "upload_n_run"
				this.file_open ()
				return
			case "fullscreen":
				this.fullscreen ()
				return
			case "dir_up":
				if (this.CurCatalog.Parent) {
					this.CurCatalog = this.CurCatalog.Parent
					this.FilePath.pop ()
					this.show_catalog ()
				}
				return
			case "download_file":
				this.download_fn (
					e.$.dataset.file,
					["soft", this.Comp.cfg.PATH, ... this.FilePath, e.$.dataset.file].join ("/").set ("filename", true)
				)
				return
			case "load_rom":
				this.file_open (( file_name, bin ) => this.ModalCustomConf.load_rom (e.$, file_name, bin), ".bin, .rom")
				return
			case "conf_save":
				this.ModalCustomConf.conf_save (e.$.dataset.idx)
				return
			case "conf_copy":
				this.ModalCustomConf.conf_copy (e.$.dataset.idx)
				return
			case "conf_delete":
				this.ModalCustomConf.conf_delete (e.$.dataset.idx)
				return
			case "conf_load":
				this.file_open (( file_name, bin ) => this.ModalCustomConf.load_conf (this.get_project (bin.buffer)), ".86rk")
				return
		}
		if (e.$.isParent (this.$("catalog"))) {
			let c = e.$.parent ().dataset
			if (c.file) {
				let file = [... this.FilePath, c.file].join ("/")
				await this.run_file (file, c.auto)
				this.set_hash (btoa (JSON.stringify ({ comp: this.Current, file: file, auto: c.auto })))
			} else if (c.dir) {
				let it = this.CurCatalog.DirList.find (it => it.name == c.dir)
				if (it) {
					it.list.Parent = this.CurCatalog
					this.CurCatalog = it.list
					this.FilePath.push (it.name)
					this.show_catalog ()
				}
			}
			return
		}
		this.Debuger?.click_handler (e)
	}
	set_hash ( hash ) {
		if (location.hash.substring (1) !== hash) {
			this.SkipHash = 1
			location.hash = hash
		}
	}
	focus () {
		this.Comp?.start ()
	}
	blur () {
		this.Comp?.stop ()
	}
	proj_sign () {
		return emulator.SIGNATURE
	}

	FileSizeLimit = 0
	static DEFAULT_ASPECT_RATIO = 1.352

	static audio = class {
		constructor ( app ) {
			this.AudioCtx = new (window.AudioContext || window.webkitAudioContext)
//			this.Filter = new BiquadFilterNode (this.AudioCtx, { type: "highshelf", gain: -20 })
			this.Gain = new GainNode (this.AudioCtx)
			this.Gain.connect (this.AudioCtx.destination)
			this.HighOut = this.AudioCtx.createBuffer (1, 1, 48_000)
			this.HighOut.getChannelData (0)[0] = 1.0
			this.app = app
		}
		done () {
//			this.Filter.disconnect ()
			this.Gain.disconnect ()
			this.AudioCtx = this.Gain = this.HighOut = null
		}
		when () {
			let Tics = this.app.Comp.tics ()
			this.#When += (Tics - this.#Tics) / this.app.Comp.effective_cpu_clock ()
			this.#Tics = Tics
			let d = this.#When - this.AudioCtx.currentTime
			if (d < 0 || d > .1)
				this.#When -= d
			return this.#When
		}
		suspend () {
			this.#Suspended = 1
			this.AudioCtx.suspend ()
		}
		resume () {
			this.#Suspended = 0
			this.AudioCtx.resume ()
		}
		start () {
			if (!this.#Suspended && this.AudioCtx.state == "suspended")
				this.AudioCtx.resume ()
		}
		mute () {
			this.app.app.$("app-emulator").$("a[name=mute]").setClass ("on", this.#Muted ^= 1)
			if (this.#Muted)
				this.#Volume = this.Gain.gain.value, this.Gain.gain.value = 0
			else
				this.Gain.gain.value = this.#Volume
		}
		volume ( vol ) {
			if (this.#Muted)
				this.mute ()
			this.Gain.gain.value = vol / 500
			if (!this.#Muted && !this.Gain.gain.value)
				this.mute ()
		}
		muted () {
			return this.#Suspended || this.#Muted
		}
		lpf_freq ( freq ) {
//			this.Filter.frequency.setValueAtTime (freq, this.AudioCtx.currentTime + .1)
		}
		lpf ( on ) {
//			this.Gain.disconnect ()
//			this.Gain.connect (on ? this.Filter : this.AudioCtx.destination)
		}

		#When = 0
		#Tics = 0
		#Muted = 0
		#Suspended = 0
		#Volume = 0
	}

	static platform = class {
		constructor ( app, cfg ) {
			this.app = app
			this.cfg = cfg
			this.cfg.TURBO = 0
			this.event = new august_event
			return new Promise (async ( resolve, reject ) => {
				if (!isType (this.cfg.ROM, Uint8Array)) {
					this.cfg.ROM = await this.load (this.cfg.ROM)
					if (!this.cfg.ROM)
						return resolve (null)
				}
				if (!isType (this.cfg.FONT, Uint8Array)) {
					this.cfg.FONT = await this.load (this.cfg.FONT)
					if (!this.cfg.FONT)
						return resolve (null)
				}
				resolve (this)
			})
		}
		shutdown () {
			this.event.fire ("shutdown")
		}
		reset () {
			this.event.fire ("reset")
		}
		start () {
			this.event.fire ("start")
		}
		stop () {
			this.event.fire ("stop")
		}
		resume () {
			this.event.fire ("resume")
		}
		suspend ( p ) {
			this.event.fire ("suspend", p)
		}
		step () {
			this.event.fire ("step")
		}
		cpu_clock ( clock ) {
			this.event.fire ("cpu-clock", clock)
		}
		keyboard ( on ) {
			this.event.fire ("keyboard", on)
		}
		exec ( stop ) {
			return new Promise (resolve => this.event.fire ("exec", exec => exec (stop, resolve)))
		}
		upload ( code, addr, go ) {
			let ok = addr + code.length <= this.cfg.RAM_TOP + 1
			return ok && this.event.fire ("upload", code, addr, go), ok
		}
		cfg_cpu_clock () {
			return isArray (this.cfg.CPU_CLOCK)
				? this.cfg.CPU_CLOCK [this.cfg.TURBO]
				: this.cfg.CPU_CLOCK
		}
		turbo () {
			this.cfg.TURBO ^= 1
		}
		effective_cpu_clock () {
			return this.cfg.CURRENT_CPU_CLOCK - this.DMATics * this.device ().CRT.frame_rate ()
		}
		async load ( fn ) {
			return new Uint8Array (await this.app.load (`files/${this.cfg.PATH}/${fn}`, "arrayBuffer"))
		}
		async run () {
			if (this.cfg.MEMORY.EXTROM) {
				const ROM = await this.load (this.cfg.MEMORY.EXTROM.file)
				if (ROM && ROM.length == this.cfg.MEMORY.EXTROM.size)
					this.cfg.MEMORY.EXTROM.ROM = ROM
				else
					delete this.cfg.MEMORY.EXTROM
			}
			const DMA = new this.class_dma ()
			const CRT = new this.class_crt (this.cfg.PIXEL_CLOCK / this.cfg.FONT_WIDTH, _ => DMA.request (this.cfg.CRT_DMA_CHANEL))
			const PPI = new this.class_ppi ()
			const PPI_KBD = new this.class_ppi ({ pa: 0xFF, pb: 0xFF, pc: this.cfg.PC || 0xFF })
			const PIT = this.cfg.MEMORY.PIT ? new august_pit_8253 (this.cfg.PIT_CLOCK) : void 0
			const VIDEO = new this.class_video (CRT, this.cfg.FONT, this.cfg.FONT_WIDTH, this.cfg.FONT_HEIGHT, this.app.Screen)
			const ROM_DISK = new this.class_rom_disk (PPI)
			const KEYBOARD = new this.class_keyboard (PPI_KBD)
			const MEMORY = new this.class_memory (0x10000)
			const IO = new this.class_io (this, MEMORY)
			const DEVICE = { DMA, CRT, PPI, PPI_KBD, PIT, VIDEO, ROM_DISK, KEYBOARD }
			const TIC = []

			this.cpu = _ => CPU
			this.tics = _ => CPU_TICS
			this.video = _ => VIDEO
			this.memory = _ => MEMORY
			this.device = _ => DEVICE
			this.stopped = _ => Stopped
			this.cfg.CURRENT_CPU_CLOCK = this.cfg_cpu_clock ()
			DEVICE.BIT_SOUND = new this.class_1bit_sound (this)

			for (let m in this.cfg.MEMORY) {
				let mem = this.cfg.MEMORY [m]
				if (!mem)
					continue
				if (m == "RAM")
					MEMORY.insert (mem.addr, mem.size, new Uint8Array (mem.size))
				else if (m == "ROM")
					MEMORY.insert (mem.addr, mem.size, this.cfg.ROM, { rd: 1 })
				else if (m == "EXTROM")
					MEMORY.insert (mem.addr, mem.size, mem.ROM, { rd: 1 })
				else if (DEVICE [m])
					MEMORY.insert (mem.addr, mem.size, DEVICE [m], mem.mode)
				else if (mem.device)
					MEMORY.insert (mem.addr, mem.size, mem.device, mem.mode), DEVICE [m] = mem.device
				if (mem.device?.tic)
					TIC.push (mem.device)
			}

			DMA.memory = MEMORY
			CRT.hook = VIDEO.hook
			PPI_KBD.hook = KEYBOARD.hook
			PPI.hook = ROM_DISK.hook
			VIDEO.mode (+this.app.Rendering.get ())
			VIDEO.retro (this.app.CrtEffect.get ())
			VIDEO.skip_frame (this.app.SkipFrame.get ())
			ROM_DISK.type (+this.app.ROMDisk.get ())

			const CPU = new this.class_cpu (MEMORY, IO, this.cfg.RESET_ADDR)
			let TICKS_PER_1MS = this.cfg_cpu_clock () / 1000
			let CPU_TICS = 0
			let KeyboardOff = 0
			let ExecID = 0
			let Stopped = false
			let exec = ( stop, resolve ) => {
				Stopped = false
				let Dummy = DMA.total
				let DMATics = 0
				let CPUTics = 0
				let Now = August.now ()
				let StartTime = Now
				let FrameCount = CRT.FrameCount
				let exec = () => {
					if (Stopped)
						return
					if (August.now () - Now > 500) {
						setTimeout (_ => this.start (), 100)
						Stopped = true
						return
					}
					ExecID = setTimeout (exec)
					Now = August.now ()
					let ExecTics = TICKS_PER_1MS * (Now - StartTime) - DMATics | 0
					while (CPUTics < ExecTics) {
						if (this.app.Debuger?.bp ())
							return resolve?.()
						let tics = CPU.exec ()
						CPUTics += tics
						CPU_TICS += tics
						if (stop?.())
							return this.suspend (1), resolve ()
					}
					if (FrameCount != CRT.FrameCount) {
						DMATics += (this.DMATics = DMA.total * 4)
						FrameCount = CRT.FrameCount
					}
					for (let d of TIC)
						d.tic ()
				}
				setTimeout (exec)
			}

			this.event.on ("reset", _ => {
				this.#InsertText.clear ()
				this.#Inserting = false
				ROM_DISK.reset ()
				PPI_KBD.reset ()
				PPI.reset ()
				VIDEO.reset ()
				CPU.reset (this.cfg.RESET_ADDR)
			}).on ("cpu-clock", clock => {
				this.cfg.CURRENT_CPU_CLOCK = clock || this.cfg_cpu_clock ()
				TICKS_PER_1MS = this.cfg.CURRENT_CPU_CLOCK / 1000
			}).on ("crt-effect", v => {
				VIDEO.retro (v)
			}).on ("rendering", v => {
				VIDEO.mode (v)
			}).on ("skip-frame", v => {
				VIDEO.skip_frame (v)
			}).on ("kbd-layout", layout => {
				KEYBOARD.layout (layout)
			}).on ("rom-disk", type => {
				ROM_DISK.type (type)
			}).on ("keyboard", on => {
				if (!on)
					KEYBOARD.off (), ++KeyboardOff
				else if (KeyboardOff && --KeyboardOff == 0)
					setTimeout (_ => KEYBOARD.reset ().on ())
			}).on ("insert-text", async text => {
				this.#InsertText.unshift (text)
				if (this.#Inserting)
					return
				KEYBOARD.reset ().off ()
				this.suspend ()
				this.#Inserting = true
				const TICS = TICKS_PER_1MS
				TICKS_PER_1MS = 20_000
				exec ()
				while (this.#InsertText.length) {
					await new Promise (resolve => {
						new this.class_tapper (this.#InsertText.pop ()).hook ()(resolve)
					})
				}
				clearTimeout (ExecID)
				ExecID = 0
				Stopped = true
				TICKS_PER_1MS = TICS
				this.#Inserting = false
				this.resume ()
				KEYBOARD.on ()
			}).on ("upload", async ( code, addr, go ) => {
				this.reset ()
				for (let b of code)
					MEMORY.set (addr++, b)
				if (!go)
					return
				addr -= code.length
				this.suspend ()
				const TICS = TICKS_PER_1MS
				TICKS_PER_1MS = 10_000
				new this.class_tapper (`G${addr.HEX16}\n`, 300).hook ()()
				await new Promise (resolve => exec (_ => CPU.Regs.PC == addr, resolve))
				PPI_KBD.hook = KEYBOARD.hook
				TICKS_PER_1MS = TICS
//				this.keyboard (1)
				this.resume ()
			}).on ("start", _ => {
				if (!Stopped || ExecID === -1 || !this.app.active ())
					return
				this.keyboard (1)
				VIDEO.on ()
				exec ()
			}).on ("stop", _ => {
				if (Stopped || ExecID === -1)
					return
				clearTimeout (ExecID)
				VIDEO.off ()
				this.keyboard (0)
				Stopped = true
			}).on ("resume", _ => {
				if (ExecID > 0)
					return
				ExecID = 0
				this.start ()
			}).on ("suspend", _ => {
				clearTimeout (ExecID)
//				this.keyboard (0)
				Stopped = true
				ExecID = -1
			}).on ("step", _ => {
				if (ExecID === -1)
					CPU_TICS += CPU.exec ()
			}).on ("exec", handler => {
				handler (exec)
			}).on ("shutdown", _ => {
				console.log ("shutdown", this.name)
				Stopped = false
				this.event.unAll ()
				clearTimeout (ExecID)
				for (let d in DEVICE)
					DEVICE [d]?.done ()
			}).fire ("run", CPU)

			exec ()
			console.log ("run", this.name)
			if (!this.app.active ())
				this.stop ()
		}
		get name () {
			return this.cfg.NAME
		}

		get class_tapper () {
			const self = this
			const PPI = this.device ().PPI_KBD
			const KBD = this.device ().KEYBOARD
			return class extends august_keyboard_86kr_tapper {
				constructor ( text, pause = 0 ) {
					super (text, self.cfg.KBD_PARAM, pause)
				}
				hook ( p_in = "pa", p_out = "pb" ) {
					return resolve => {
						PPI.hook = {
							[p_in]: a => {
								let b = this.key (a)
								if (b === null) {
									PPI.hook = KBD.hook
									resolve && resolve ()
								} else if (isNumber (b)) {
									PPI [p_out] = b
									PPI.pch = b & 0x100 ? KBD.SHIFT_KEY : 0xFF
								}
							},
							pc: v => {
								KBD.pc_event (v)
							}
						}
					}
				}
			}
		}
		get class_keyboard () {
			const self = this
			return class extends (this.cfg.CLASS_KEYBOARD || august_keyboard_86rk) {
				led_rus () {
					let RUS = this.rus ()
					if (this.RUS ^ RUS)
						self.event.fire ("led-rus", this.RUS = RUS)
				}
				pc_event ( v ) {
					let PC = v & 0x0F
					if (this.PC != PC)
						self.event.fire ("kbd-pc", this.PC = PC)
				}
				get hook () {
					return {
						pb_in: _ => this.out,
						pc_in: _ => this.ctrl,
						pa: v => this.led_rus (),
						pc: v => this.pc_event (v)
					}
				}

				RUS = -1
				PC = -1
			}
		}
		get class_dma () {
			return class extends august_dma_8257 {
				get ( r ) {
					return this.rw (r, super.get (r), this.LowByte ^ 1)
				}
				set ( r, v ) {
					super.set (r, this.rw (r, v))
				}
				rw ( r, v, lb = this.LowByte ) {
					return r < 8 && r & 1 && lb && v & 0xC0 && (v & 0xC0) != 0xC0 ? v ^ 0xC0 : v
				}
			}
		}
		get class_crt () {
			return august_crt_8275
		}
		get class_ppi () {
			return august_ppi_8255
		}
		get class_video () {
			return august_video_86rk
		}
		get class_cpu () {
			return august_cpu_8080
		}
		get class_memory () {
			return august_memory
		}
		get class_io () {
			return class extends august_io {
				constructor ( comp, mem ) {
					super ({
						rw: [{
							addr: 0x00,
							size: 0x100,
							area: new class {
								get length () {
									return 0x100
								}
								get ( a ) {
									return mem.get (a | a.shl8)
								}
								set ( a, v ) {
									return mem.set (a | a.shl8, v)
								}
							}
						}]
					})
					this.Comp = comp
				}
			}
		}
		get class_rom_disk () {
			return class {
				constructor ( ppi ) {
					this.ROM = new Uint8Array (0)
					this.PPI = ppi
					this.reset ()
				}
				done () {
				}
				reset () {
					this.Addr = 0
					this.PageClk = 0x80
				}
				type ( t ) {
					this.Type = t
				}
				load ( bin ) {
					this.ROM = new Uint8Array (bin.buffer || bin)
					this.reset ()
				}
				set page ( v ) {
					this.Addr &= 0x7FFF
					this.Addr |= v << 15
				}
				get hook () {
					return {
						pa_in: _ => {
							return ~~this.ROM [this.Addr]
						},
						pb: v => {
							this.Addr &= ~0x00FF
							this.Addr |= v
						},
						pc: v => {
							if (this.Type == 0) {
								this.Addr &= ~0xFF00
								this.Addr |= v.shl8
								return
							}
							this.Addr &= ~0x7F00
							this.Addr |= v.shl8
							if (this.PageClk != (v & 0x80)) {
								this.PageClk = v & 0x80
								if (this.PageClk)
									this.page = this.PPI.pb
							}
						}
					}
				}

				Type = 1
			}
		}
		get class_1bit_sound () {
			return class {
				constructor ( comp ) {
					this.Audio = comp.app.Audio
					this.GainOut = new GainNode (this.Audio.AudioCtx, { gain: 0 })
					this.Source = new AudioBufferSourceNode (this.Audio.AudioCtx, { loop: true, buffer: this.Audio.HighOut })
					this.Source.connect (this.GainOut).connect (this.Audio.Gain)
					this.Source.start ()
					this.Out = 0
				}
				done () {
					this.Source.stop ()
					this.GainOut.disconnect ()
					this.GainOut = this.Source = null
				}
				out ( v, m = 1 ) {
					if (!m || this.Out == (v &= m) || this.Audio.muted ())
						return
					this.Out = v
					this.Audio.start ()
					this.GainOut.gain.setValueAtTime (v * 5, this.Audio.when ())
				}
			}
		}

		DMATics = 0
		#InsertText = []
		#Inserting = false
	}

	static radio_86rk = class radio_86rk extends emulator.platform {
		constructor ( app ) {
			super (app, {
				NAME:		radio_86rk.NAME,
				CPU_CLOCK:	1_777_777,
				PIXEL_CLOCK:	8_000_000,
				FONT_WIDTH:	6,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[22, 1],
				RAM_TOP:	0x75FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor.rom",
				FONT:		"font.rom",
				PATH:		"radio-86rk",
				MEMORY: {
					RAM: {
						addr: 0x0000,
						size: 0x8000
					},
					PPI_KBD: {
						addr: 0x8000,
						size: 0x2000
					},
					PPI: {
						addr: 0xA000,
						size: 0x2000
					},
					CRT: {
						addr: 0xC000,
						size: 0x2000
					},
					DMA: {
						addr: 0xE000,
						size: 0x2000,
						mode: { wr: 1 }
					},
					ROM: {
						addr: 0xE000,
						size: 0x2000
					}
				}
			})
		}
		get class_io () {
			return class extends super.class_io {
				interrupt ( iff ) {
					this.Comp.device ().BIT_SOUND?.out (iff)
				}
			}
		}

		static NAME = "Радио-86РК"
	}

	static radio_86rk_nova = class extends emulator.platform {
		async run () {
			await super.run ()
			this.device ().SOUND = new emulator.apogey.sound (this)
			this.event.on ("kbd-pc", pc => this.video ().set_pc (pc))
			const FONT_RAM = this.cfg.MEMORY.FONT_RAM
			this.memory ().insert (
				FONT_RAM.addr,
				FONT_RAM.size,
				new this.class_font_ram (this.video ()),
				{ wr: 1 }
			)
		}
		get class_video () {
			return class extends august_video_86rk {
				font ( idx ) {
					return super.font (idx) >> (8 - this.FontWidth)
				}
				charset ( n ) {
					this.FontSet = (this.PC & 0x01) * 2 + n
					super.charset (this.FontSet)
				}
				set_pc ( pc ) {
					this.PC = pc
					this.charset (this.PC & 0x02 ? this.FontSet & 1 : 1)
				}
				pseudo ( ch ) {
					if (this.PC & 0x02 && ch.la0)
						this.charset (+ch.hglt_pseudo)
				}
				vrtc () {
					if (this.PC & 0x02)
						this.charset (0)
				}

				PC = 0
				FontSet = 0
			}
		}
		get class_font_ram () {
			return class {
				constructor ( video ) {
					this.Video = video
					this.Addr = 0
				}
				set ( r, v ) {
					if (r == 1)
						this.Addr = (this.Addr & 0xFF00) | v.b0
					else if (r == 2)
						this.Addr = ((this.Addr & 0x00FF) | v.shl8) & (this.Video.Font.length - 1)
					else if (r == 3)
						this.Video.Font [this.Addr++] = v, this.Addr &= this.Video.Font.length - 1, this.Video.clear_cache ()
				}
				get length () {
					return 4
				}
			}
		}
		get class_io () {
			return emulator.radio_86rk.prototype.class_io
		}
	}

	static apogey = class apogey extends emulator.platform {
		constructor ( app ) {
			super (app, {
				NAME:		apogey.NAME,
				CPU_CLOCK:	1_777_777,
				PIT_CLOCK:	1_777_777,
				PIXEL_CLOCK:	8_000_000,
				FONT_WIDTH:	6,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[17, 1],
				RAM_TOP:	0xE0FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor.rom",
				FONT:		"font.rom",
				PATH:		"apogey",
				MEMORY: {
					RAM: {
						addr: 0x0000,
						size: 0xEC00
					},
					PIT: {
						addr: 0xEC00,
						size: 0x0100
					},
					PPI_KBD: {
						addr: 0xED00,
						size: 0x0100
					},
					PPI: {
						addr: 0xEE00,
						size: 0x0100
					},
					CRT: {
						addr: 0xEF00,
						size: 0x0100
					},
					DMA: {
						addr: 0xF000,
						size: 0x0800,
						mode: { wr: 1 }
					},
					ROM: {
						addr: 0xF000,
						size: 0x1000
					}
				}
			})
		}
		async run () {
			await super.run ()
			this.device ().SOUND = new apogey.sound (this)
			this.device ().KEYBOARD.matrix = {
				qwerty: { 116: 0 },
				jcuken: { 116: 0 },
			}
		}
		get class_io () {
			return class extends super.class_io {
				interrupt ( iff ) {
					this.Comp.video ().charset (iff)
				}
			}
		}

		static sound = class sound {
			constructor ( comp ) {
				this.Comp = comp
				this.Ch = []
				this.Mode0 = [
					new sound.mode0 (comp.app.Audio),
					new sound.mode0 (comp.app.Audio),
					new sound.mode0 (comp.app.Audio)
				]
				this.Mode2 = [
					new sound.mode2 (comp.app.Audio),
					new sound.mode2 (comp.app.Audio),
					new sound.mode2 (comp.app.Audio)
				]
				this.Mode3 = [
					new sound.mode3 (comp.app.Audio),
					new sound.mode3 (comp.app.Audio),
					new sound.mode3 (comp.app.Audio)
				]
				this.Comp.device ().PIT.hook = {
					init: ( ch, m ) => {
						this.Ch [ch]?.cnt (0)
						this.Ch [ch] = m == 0
							? this.Mode0 [ch]
							: m == 2
							? this.Mode2 [ch]
							: m == 3
							? this.Mode3 [ch]
							: null
					},
					cnt: ( ch, cnt ) => {
						if (!comp.app.Audio.muted ())
							this.Ch [ch]?.cnt (cnt)
					}
				}
				this.Comp.event.on ("reset", _ => {
					this.Ch [0]?.cnt (0)
					this.Ch [1]?.cnt (0)
					this.Ch [2]?.cnt (0)
				})
			}
			done () {
				this.Comp.device ().PIT.hook = null
				for (let s of this.Mode0)
					s.done ()
				for (let s of this.Mode2)
					s.done ()
				for (let s of this.Mode3)
					s.done ()
			}

			static mode0 = class {
				constructor ( audio ) {
					this.Audio = audio
					this.GainGate = new GainNode (this.Audio.AudioCtx, { gain: 0 })
					this.GainOut = new GainNode (this.Audio.AudioCtx, { gain: 5 })
					this.Cnt = new AudioBufferSourceNode (audio.AudioCtx, { loop: true, buffer: audio.HighOut })
					this.Cnt.connect (this.GainGate).connect (this.GainOut).connect (audio.Gain)
					this.Cnt.start ()
					this.Gate = true
					this.Out = true
					this.Time = 0
				}
				done () {
					this.Cnt.stop ()
					this.GainOut.disconnect ()
					this.GainGate = this.GainOut = this.Cnt = null
				}
				gate ( g ) {
					if (this.Gate == !!g)
						return
					this.Gate = !!g
					let When = this.Audio.when ()
					if (g)
						return this.set (this.Time += When)
					this.set (When, 0)
					if (this.Time < When)
						this.Time = 0
					else
						this.set (this.Time, 0), this.Time -= When
				}
				out ( o ) {
					if (this.Out == !!o)
						return
					this.Out = !!o
					this.GainOut.gain.setValueAtTime (o ? 5 : 0, this.Audio.when ())
				}
				cnt ( n ) {
					this.Audio.start ()
					let When = this.Audio.when ()
					this.set (When, 0)
					this.Time = n / this.Audio.app.Comp.cfg.PIT_CLOCK
					if (n && this.Gate)
						this.set (this.Time += When)
				}
				set ( t, v = 1 ) {
					this.GainGate.gain.setValueAtTime (v, t)
				}
			}
			static mode2 = class {
				constructor ( audio ) {
					this.Audio = audio
					this.GainOut = new GainNode (this.Audio.AudioCtx, { gain: .3 })
					this.GainHigh = new GainNode (this.Audio.AudioCtx, { gain: 0 })
					this.Wave = new OscillatorNode (audio.AudioCtx, { type: "square", frequency: 0 })
					this.Wave.connect (this.GainOut).connect (audio.Gain)
					this.Wave.start ()
					this.High = new AudioBufferSourceNode (audio.AudioCtx, { loop: true, buffer: audio.HighOut })
					this.High.connect (this.GainHigh).connect (this.GainOut)
					this.High.start ()
					this.Gate = true
					this.Out = true
					this.Freq = 0
				}
				done () {
					this.Wave.stop ()
					this.High.stop ()
					this.GainOut.disconnect ()
					this.GainHigh.disconnect ()
					this.GainOut = this.GainHigh = this.Wave = this.High = null
				}
				gate ( g ) {
					if (this.Gate == !!g)
						return
					this.Gate = !!g
					this.freq (g ? this.Freq : 0)
					this.GainHigh.gain.setValueAtTime (g ? 0 : 1, this.Audio.when ())
				}
				out ( o ) {
					if (this.Out == !!o)
						return
					this.Out = !!o
					this.GainOut.gain.setValueAtTime (o ? .3 : 0, this.Audio.when ())
				}
				cnt ( n ) {
					this.Audio.start ()
					this.Freq = n && this.Audio.app.Comp.cfg.PIT_CLOCK / n
					if (this.Gate)
						this.freq (this.Freq)
				}
				freq ( freq ) {
					this.Wave.frequency.setValueAtTime (freq < 12000 ? freq : 0, this.Audio.when ())
				}
			}
			static mode3 = class {
				constructor ( audio ) {
					this.Audio = audio
					this.GainOut = new GainNode (this.Audio.AudioCtx, { gain: 1 })
					this.GainHigh = new GainNode (this.Audio.AudioCtx, { gain: 0 })
					this.Wave = new OscillatorNode (audio.AudioCtx, { type: "square", frequency: 0 })
					this.Wave.connect (this.GainOut).connect (audio.Gain)
					this.Wave.start ()
					this.High = new AudioBufferSourceNode (audio.AudioCtx, { loop: true, buffer: audio.HighOut })
					this.High.connect (this.GainHigh).connect (this.GainOut)
					this.High.start ()
					this.Gate = true
					this.Out = true
					this.Freq = 0
				}
				done () {
					this.Wave.stop ()
					this.High.stop ()
					this.GainOut.disconnect ()
					this.GainHigh.disconnect ()
					this.GainOut = this.GainHigh = this.Wave = this.High = null
				}
				gate ( g ) {
					if (this.Gate == !!g)
						return
					this.Gate = !!g
					this.freq (g ? this.Freq : 0)
					this.GainHigh.gain.setValueAtTime (g ? 0 : 1, this.Audio.when ())
				}
				out ( o ) {
					if (this.Out == !!o)
						return
					this.Out = !!o
					this.GainOut.gain.setValueAtTime (o ? 1 : 0, this.Audio.when ())
				}
				cnt ( n ) {
					this.Audio.start ()
					this.Freq = n && this.Audio.app.Comp.cfg.PIT_CLOCK / n
					if (this.Gate)
						this.freq (this.Freq)
				}
				freq ( freq ) {
					this.Wave.frequency.setValueAtTime (freq < 12000 ? freq : 0, this.Audio.when ())
				}
			}
		}

		static NAME = "Апогей БК-01Ц"
	}

	static mikrosha = class mikrosha extends emulator.platform {
		constructor ( app, name = mikrosha.NAME, mem = {}, cfg = {} ) {
			super (app, {
				NAME:		name,
				CPU_CLOCK:	1_777_777,
				PIT_CLOCK:	1_777_777,
				PIXEL_CLOCK:	8_000_000,
				FONT_WIDTH:	6,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[16, 16],
				RAM_TOP:	0x75FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor.rom",
				FONT:		"font.rom",
				PATH:		"mikrosha",
				MEMORY: {
					RAM: {
						addr: 0x0000,
						size: 0x8000
					},
					PIT: {
						addr: 0xD800,
						size: 0x0800
					},
					PPI_KBD: {
						addr: 0xC000,
						size: 0x0800
					},
					PPI: {
						addr: 0xC800,
						size: 0x0800
					},
					CRT: {
						addr: 0xD000,
						size: 0x0800
					},
					DMA: {
						addr: 0xF800,
						size: 0x0800,
						mode: { wr: 1 }
					},
					ROM: {
						addr: 0xF800,
						size: 0x0800
					},
					EXTROM: {
						addr: 0xE000,
						size: 0x1000,
						file: "dos-29.rom"
					},
					... mem
				},
				... cfg
			})
		}
		done () {
			this.Sound?.done ()
			super.done ()
		}
		async run () {
			await super.run ()
			this.device ().PIT.hook = {
				init: ( ch, m ) => {
					if (ch == 2) {
						let sound = emulator.apogey.sound [`mode${m}`]
						this.Sound?.done ()
						this.Sound = sound ? new sound (this.app.Audio) : null
						if (this.Sound) {
							let pc = this.device ().PPI_KBD.pc
							this.Sound.out (pc & 0x02)
							this.Sound.gate (pc & 0x04)
						}
					}
				},
				cnt: ( ch, cnt ) => {
					if (ch == 2) {
						if (!this.app.Audio.muted ()) {
							this.Sound?.cnt (cnt)
							this.app.Audio.start ()
						}
					}
				}
			}
			this.device ().PPI.hook = {
				pb: v => this.video ().charset (v >> 7 & 0x01)
			}
			this.event.on ("kbd-pc", pc => {
				this.Sound?.out (pc & 0x02)
				this.Sound?.gate (pc & 0x04)
			})
		}
		get class_tapper () {
			return class extends super.class_tapper {
				constructor ( ... arg ) {
					super (... arg)
					for (let n in this.KEYS) {
						let v = this.KEYS [n]
						this.KEYS [n] = this.REPLACE_KEYS [n]
							|| (v.b1 | v.b0.shl8 | v.b2.shl16)
					}
				}
				hook () {
					return super.hook ("pb", "pa")
				}

				REPLACE_KEYS = {
					"\n":	0x0FEEF, "\t":	0x0FEFB,
					" ":	0x0FEFE, "_":	0x07F7F, "~":	0x0FEFE
				}
			}
		}
		get class_keyboard () {
			return class keyboard extends super.class_keyboard {
				constructor ( ... arg ) {
					super (... arg)
					let trans_byte = b => ((b.shl8 | b) >> 4 & 0x77) | (b & 0x88)
					let trans_word = w => trans_byte (w.b1).shl8 | trans_byte (w.b0)
					let trans = ( t_in, t_out ) => {
						for (let v of t_in)
							t_out.push (trans_word (v.w1).shl16 | trans_word (v.w0))
						let s = t_out [keyboard.XLAT [0]]
						for (let p = 1; p < keyboard.XLAT.length; p++)
							[t_out [keyboard.XLAT [p]], s] = [s, t_out [keyboard.XLAT [p]]]
					}
					trans (august_keyboard_86rk.MATRIX_QWERTY, this.MATRIX_QWERTY)
					trans (august_keyboard_86rk.MATRIX_JCUKEN, this.MATRIX_JCUKEN)
					this.matrix = {
						qwerty: { 8: 0x06, 46: 0x01, 221: 0x7577, 189: 0x003577F7, 173: 0x003577F7 },
						jcuken: { 8: 0x06, 46: 0x01 }
					}
				}
				get in () {
					return this.PPI.pb
				}
				get hook () {
					return {
						pa_in: _ => this.out,
						pc_in: _ => this.ctrl,
						pb: v => this.led_rus (),
						pc: v => this.pc_event (v)
					}
				}

				SHIFT_KEY = 0x7F
				CTRL_KEY = 0xBF
				RUS_KEY = 0xDF

				MATRIX_QWERTY = []
				MATRIX_JCUKEN = []

				static XLAT = [
					9, 38, 114, 35, 27, 9, 8, 112, 45,
					40, 116, 39, 115, 37, 113, 13, 36, 32
				]
			}
		}

		static crc ( code ) {
			return code.reduce (( a, c, i ) => i & 1 ? (a.b1 ^ c).shl8 | a.b0 : a.b1.shl8 | (a.b0 ^ c), 0)
		}

		static NAME = "Микроша"
	}

	static mikrosha_48 = class mikrosha extends emulator.mikrosha {
		constructor ( app ) {
			super (app, mikrosha.NAME, {
				RAM: {
					addr: 0x0000,
					size: 0xC000
				}
			})
		}

		static NAME = "Микроша/48"
	}

	static mikrosha_rom = class mikrosha extends emulator.mikrosha {
		constructor ( app ) {
			super (app, mikrosha.NAME, {
				EXTROM: {
					addr: 0x8000,
					size: 0x4000,
					file: "extrom.rom"
				}
			})
		}

		static NAME = "Микроша/ROM"
	}

	static krista = class krista extends emulator.mikrosha {
		constructor ( app ) {
			super (app, krista.NAME, {
				EXTROM: void 0
			}, {
				ROM:	"monitor-krista.rom",
				FONT:	"font-krista.rom"
			})
		}

		static NAME = "Криста"
	}

	static radio_86rk_32_nova = class radio_86rk extends emulator.radio_86rk_nova {
		constructor ( app ) {
			super (app, {
				NAME:		radio_86rk.NAME,
				CPU_CLOCK:	[1_777_777, 3_000_000],
				PIT_CLOCK:	1_333_333,
				PIXEL_CLOCK:	8_000_000,
				FONT_WIDTH:	6,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[22, 1],
				PC:		0b1111_0001,
				RAM_TOP:	0x75FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor-32.rom",
				FONT:		"font-6x8.rom",
				PATH:		"radio-86rk-nova",
				MEMORY: {
					RAM: {
						addr: 0x0000,
						size: 0x8000
					},
					PPI_KBD: {
						addr: 0x8000,
						size: 0x1000
					},
					PIT: {
						addr: 0x9000,
						size: 0x1000
					},
					PPI: {
						addr: 0xA000,
						size: 0x1000
					},
					RTC: {
						addr: 0xB000,
						size: 0x1000,
						device: new august_rtc_6242 (app, "rk32")
					},
					CRT: {
						addr: 0xC000,
						size: 0x1000
					},
					DMA: {
						addr: 0xE000,
						size: 0x1000,
						mode: { wr: 1 }
					},
					ROM: {
						addr: 0xF000,
						size: 0x1000
					},
					FONT_RAM: {
						addr: 0xF000,
						size: 0x1000
					}
				}
			})
		}

		static NAME = "Радио-86РК/32-Nova"
	}

	static radio_86rk_60_nova = class radio_86rk extends emulator.radio_86rk_nova {
		constructor ( app ) {
			super (app, {
				NAME:		radio_86rk.NAME,
				CPU_CLOCK:	[1_777_777, 3_000_000],
				PIT_CLOCK:	1_250_000,
				PIXEL_CLOCK:	10_000_000,
				FONT_WIDTH:	8,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[12, 1],
				PC:		0b1111_0101,
				RAM_TOP:	0xE5FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor-60.rom",
				FONT:		"font-8x8.rom",
				PATH:		"radio-86rk-nova",
				MEMORY: {
					RAM: {
						addr: 0x0000,
						size: 0xF000
					},
					PIT: {
						addr: 0xF100,
						size: 0x0100
					},
					RTC: {
						addr: 0xF200,
						size: 0x0100,
						device: new august_rtc_6242 (app, "rk60")
					},
					PPI_KBD: {
						addr: 0xF400,
						size: 0x0100
					},
					PPI: {
						addr: 0xF500,
						size: 0x0100
					},
					CRT: {
						addr: 0xF600,
						size: 0x0100
					},
					DMA: {
						addr: 0xF700,
						size: 0x0100,
						mode: { wr: 1 }
					},
					ROM: {
						addr: 0xF800,
						size: 0x0800
					},
					FONT_RAM: {
						addr: 0xF800,
						size: 0x0800
					}
				}
			})
		}

		static NAME = "Радио-86РК/60-Nova"
	}

	static mega_86rk = class mega extends emulator.radio_86rk_nova {
		constructor ( app ) {
			super (app, {
				NAME:		mega.NAME,
				CPU_CLOCK:	3_000_000,
				PIT_CLOCK:	1_333_333,
				PIXEL_CLOCK:	8_000_000,
				FONT_WIDTH:	6,
				FONT_HEIGHT:	8,
				CRT_DMA_CHANEL:	2,
				KBD_PARAM:	[12, 1],
				PC:		0b1111_1001,
				RAM_TOP:	0xE5FF,
				RESET_ADDR:	0xF800,
				ROM:		"monitor-mega.rom",
				FONT:		"font-6x8.rom",
				PATH:		"radio-86rk-nova",
				MEMORY: {
					MEGA_RAM: {
						addr: 0x0000,
						size: 0xF000,
						device: new mega.ram (4, mega.RAM_CFG)
					},
					PIT: {
						addr: 0xFFFC,
						size: 0x0004
					},
					RTC: {
						addr: 0xFFD0,
						size: 0x0010,
						device: new august_rtc_6242 (app, "mega")
					},
					PPI_KBD: {
						addr: 0xFFF0,
						size: 0x0004
					},
					PPI: {
						addr: 0xFFF4,
						size: 0x0004
					},
					CRT: {
						addr: 0xFFF8,
						size: 0x0004
					},
					DMA: {
						addr: 0xFFC0,
						size: 0x0010
					},
					ROM: {
						addr: 0xF000,
						size: 0x1000 - 0x0040
					},
					FONT_RAM: {
						addr: 0xFFE8,
						size: 0x0004
					},
					RAM_BANK: {
						addr: 0xFFE8,
						size: 0x0004,
						device: new mega.ram_bank (app),
						mode: { wr: 1 }
					}
				}
			})
		}
		async run () {
			await super.run ()
			this.event.on ("reset", _ => this.cfg.MEMORY.MEGA_RAM.device.set_cfg (0))
		}
		get class_keyboard () {
			return class keyboard extends super.class_keyboard {
				constructor ( ... arg ) {
					super (... arg)
					let shift = ( t, a ) => {
						for (let i = 0x41; i < 0x5B; i++)
							t [i] |= (t [i] << 16) | a
					}
					shift (this.MATRIX_QWERTY, 0x8080)
					shift (this.MATRIX_JCUKEN, 0x80)
					for (let c of [186, 188, 190, 222]) {
						this.MATRIX_QWERTY [c] |= 0x80
						this.MATRIX_JCUKEN [c] |= 0x80
					}
					this.MATRIX_QWERTY [219] |= (this.MATRIX_QWERTY [219] << 16) | 0x8080
					this.MATRIX_QWERTY [221] |= (this.MATRIX_QWERTY [221] << 16) | 0x8000
				}
			}
		}
		get class_dma () {
			return august_dma_8257
		}

		static ram = class ram {
			constructor ( size, cfg ) {
				for (let i = 0; i < size; i++)
					this.#Bank [i] = new this.#bank
				this.cfg = cfg
				this.set_cfg (0)
			}
			done () {
			}
			set_cfg ( n ) {
				let cfg = this.cfg.cfg [n % this.cfg.cfg.length]
				this.Win8 = isSet (cfg.w8) && this.#Bank [cfg.b].Win8 [cfg.w8]
				this.Win16 = isSet (cfg.w16) && this.#Bank [cfg.b].Win16 [cfg.w16]
				this.Bank = !this.Win8 && !this.Win16
					? this.#Bank [cfg.b].RAM
					: this.#Bank [this.cfg.default].RAM
			}
			win8 ( a ) {
				let w8 = this.cfg.win8
				return this.Win8 && a >= w8.addr && a < w8.addr + w8.size
			}
			win16 ( a ) {
				let w16 = this.cfg.win16
				return this.Win16 && a >= w16.addr && a < w16.addr + w16.size
			}
			get ( a ) {
				return this.win8 (a)
					? this.Win8 [a & 0x1FFF]
					: this.win16 (a)
					? this.Win16 [a & 0x3FFF]
					: this.Bank [a]
			}
			set ( a, v ) {
				return this.win8 (a)
					? this.Win8 [a & 0x1FFF] = v
					: this.win16 (a)
					? this.Win16 [a & 0x3FFF] = v
					: this.Bank [a] = v
			}
			get length () {
				return ram.SIZE
			}

			#bank = class {
				constructor () {
					for (let offs = 0x0000; offs < ram.SIZE; offs += 0x2000)
						this.Win8.push (new Uint8Array (this.RAM.buffer, offs, 0x2000))
					for (let offs = 0x0000; offs < ram.SIZE; offs += 0x4000)
						this.Win16.push (new Uint8Array (this.RAM.buffer, offs, 0x4000))
				}

				RAM = new Uint8Array (ram.SIZE)
				Win8 = []
				Win16 = []
			}

			#Bank = []

			static SIZE = 0x10000
		}

		static ram_bank = class {
			constructor ( app ) {
				this.app = app
			}
			done () {
			}
			set ( a, v ) {
				if (a == 0)
					this.app.Comp.device ().MEGA_RAM.set_cfg (v)
			}
			get length () {
				return 4
			}
		}

		static RAM_CFG = {
			default: 0,
			win8: {
				addr:	0x8000,
				size:	0x2000
			},
			win16: {
				addr:	0x8000,
				size:	0x4000
			},
			cfg: [
				{ b: 0 }, { b: 1 }, { b: 2 }, { b: 3 },
				{ b: 3, w16: 0 }, { b: 3, w16: 1 }, { b: 3, w16: 2 }, { b: 3, w16: 3 },

				{ b: 1, w8: 0 }, { b: 1, w8: 1 }, { b: 1, w8: 2 }, { b: 1, w8: 3 },
				{ b: 1, w8: 4 }, { b: 1, w8: 5 }, { b: 1, w8: 6 }, { b: 1, w8: 7 },

				{ b: 2, w8: 0 }, { b: 2, w8: 1 }, { b: 2, w8: 2 }, { b: 2, w8: 3 },
				{ b: 2, w8: 4 }, { b: 2, w8: 5 }, { b: 2, w8: 6 }, { b: 2, w8: 7 },

				{ b: 3, w8: 0 }, { b: 3, w8: 1 }, { b: 3, w8: 2 }, { b: 3, w8: 3 },
				{ b: 3, w8: 4 }, { b: 3, w8: 5 }, { b: 3, w8: 6 }, { b: 3, w8: 7 }
			]
		}

		static NAME = "Мега-86РК"
	}

	static radio_86rk_custom = class extends emulator.platform {
		constructor ( app, cfg ) {
			return new Promise (async ( resolve, reject ) => {
				await super (app, { ... cfg })
				let self = await this
				if (self.cfg.MEMORY.RTC)
					self.cfg.MEMORY.RTC.device = new august_rtc_6242 (app, app.Current)
				if (self.cfg.KEYBOARD == "ms7007-kr02") {
					app.busy ()
					await app.load_js ("august.keyboard_ms7007.js")
					app.busy ()
					self.cfg.CLASS_KEYBOARD = august_keyboard_ms7007_kr
					if (typeof august_keyboard_ms7007_kr === "undefined")
						return resolve (null)
				}
				resolve (self)
			})
		}
		async run () {
			await super.run ()
			if (this.cfg.FONT_SELECT)
				this.event.on ("kbd-pc", pc => this.video ().set_pc (pc))
			if (this.cfg.MEMORY.PIT)
				this.device ().SOUND = new emulator.apogey.sound (this)
			const FONT_RAM = this.cfg.MEMORY.FONT_RAM
			if (FONT_RAM) {
				this.memory ().insert (
					FONT_RAM.addr,
					FONT_RAM.size,
					new emulator.radio_86rk_nova.prototype.class_font_ram (this.video ()),
					{ wr: 1 }
				)
			}
		}
		get class_dma () {
			return this.cfg.DMA_WR
				? august_dma_8257
				: super.class_dma
		}
		get class_io () {
			return this.cfg.INTE_SOUND
				? emulator.radio_86rk.prototype.class_io
				: super.class_io
		}
		get class_video () {
			return this.cfg.FONT_SELECT
				? emulator.radio_86rk_nova.prototype.class_video
				: august_video_86rk
		}
		get class_tapper () {
			return this.cfg.KEYBOARD == "ms7007-kr02"
				? august_keyboard_ms7007_kr_tapper
				: super.class_tapper
		}
	}

	static COMPUTER_LIST = {
		"radio-86rk":	emulator.radio_86rk,
		"apogey":	emulator.apogey,
		"mikrosha-48":	emulator.mikrosha_48,
		"mikrosha-rom":	emulator.mikrosha_rom,
		"krista":	emulator.krista,
		"radio-86rk32":	emulator.radio_86rk_32_nova,
		"radio-86rk60":	emulator.radio_86rk_60_nova,
		"mega-86rk":	emulator.mega_86rk
	}

	static SIGNATURE = "emulator.project"
}

