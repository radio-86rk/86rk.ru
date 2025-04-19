//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.video_86rk.js


"use strict"

class august_video_86rk {
	constructor ( crt, font, font_width, font_height, canvas ) {
		this.CRT = crt
		this.Font = new Uint8Array (font)
		this.FontWidth = font_width
		this.FontHeight = font_height
		this.Screen = canvas
		this.Retro = 0

		let win = canvas.ownerDocument.defaultView
		let RenderID = 0
		let DrawID = 0
		let Active = true
		let SkipFrame = 0
		let FlipFlop = 0
		let RenderTime = 0
		let rendering = () => {
			crt.calc_frame_count ()
			if (Active)
				this.#Frame?.rendering (), this.vrtc ()
		}
		let frame_render = () => {
			RenderID = win.setTimeout (frame_render, 1)
			let t = August.now () - RenderTime
			if (t < 0)
				return
			if (t > crt.FramePeriod)
				RenderTime += t
			RenderTime += crt.FramePeriod
			rendering ()
		}
		let frame_draw = () => {
			DrawID = win.requestAnimationFrame (frame_draw)
			if (!RenderID)
				rendering ()
			else if (SkipFrame && (FlipFlop ^= 1) || !Active)
				return
			this.#Frame?.draw ()
		}
		this.#cmd = ( cmd, val ) => {
			switch (cmd) {
				case "reset":
					this.Font = new Uint8Array (font)
					break
				case "start":
					if (this.#Frame)
						break
					this.#Frame = new this.#frame (this)
					canvas.props ({
						"--cols":	crt.CharsPerRow,
						"--rows":	crt.RowsNo
					})
					break
				case "stop":
					this.#Frame?.done ()
					this.#Frame = null
					break
				case "active":
					Active = val
					break
				case "mode":
					if (val)
						win.clearTimeout (RenderID), RenderID = 0
					else if (!RenderID)
						frame_render ()
					break
				case "retro":
					this.Retro = val
					this.clear_cache ()
					this.#Frame?.retro ()
					this.#Frame?.rendering ()
					this.#Frame?.draw ()
					break
				case "skip_frame":
					SkipFrame = val & 1
					break
				case "done":
					win.clearTimeout (RenderID)
					win.cancelAnimationFrame (DrawID)
					break
			}
		}

		frame_draw ()
	}
	done () {
		this.#cmd ("done")
		this.#Frame?.done ()
		this.#Frame = null
	}
	reset () {
		this.#cmd ("reset")
	}
	on () {
		this.#cmd ("active", 1)
	}
	off () {
		this.#cmd ("active", 0)
	}
	mode ( v ) {
		this.#cmd ("mode", v)
	}
	retro ( v ) {
		this.#cmd ("retro", v)
	}
	skip_frame ( v ) {
		this.#cmd ("skip_frame", v)
	}
	clear_cache () {
		this.#Frame?.clear_cache ()
	}
	charset ( n ) {
		this.#FontPtr = this.FontHeight * 128 * n
		this.#Frame?.clear_cache ()
	}
	font ( idx ) {
		return this.Font [this.#FontPtr + idx]
	}
	rgb ( ch ) {
/*
		let blank = ch.blank && !ch.rvv
		return {
			r: ch.hglt || blank ? 0x00 : 0xFF,
			g: ch.gpa1 || blank ? 0x00 : 0xFF,
			b: ch.gpa0 || blank ? 0x00 : 0xFF
		}
*/
		return {
			r: ch.hglt ? 0x00 : 0xFF,
			g: ch.gpa1 ? 0x00 : 0xFF,
			b: ch.gpa0 ? 0x00 : 0xFF
		}
	}
	vrtc () {
	}
	get hook () {
		return n => {
			this.#cmd (n)
		}
	}

	#frame = class {
		constructor ( video ) {
			this.Video = video
			let width = video.FontWidth * video.CRT.CharsPerRow * 2
			let height = video.CRT.LinesNo * video.CRT.RowsNo * 2
			video.Screen.width = width
			video.Screen.height = height
			this.retro ()
			this.ScreenCtx = video.Screen.getContext ("2d", { alpha: false })
			this.ScreenCtx.fillStyle = "#000"
			this.ScreenCtx.fillRect (0, 0, width, height)
			this.ImageData = this.ScreenCtx.createImageData (width, height)
			this.Cache = new Uint16Array (width * height / 4).fill (0xFFFF)
			this.ClearCache = 0
			this.ln_width = width * 4
			this.blank = video.CRT.Underline > 7
			this.ln_no = video.CRT.LinesNo
			this.ln_mask = video.FontHeight > 8 ? 0x0F : 0x07
			this.ln0 = video.CRT.OffsetLine ? this.ln_no - 1 : 0
			this.idx_next_pos = video.FontWidth * 4 - this.ln_width * this.ln_no
			this.idx_next_row = this.ln_width * this.ln_no - this.ln_width / 2
			this.bit_mask0 = 1 << video.FontWidth - 1
			for (let i = 3; i < this.ImageData.data.length; i += 4)
				this.ImageData.data [i] = 0xFF
		}
		done () {
			this.ScreenCtx.fillRect (0, 0, this.Video.Screen.width, this.Video.Screen.height)
		}
		clear_cache () {
			this.ClearCache = 1
		}
		retro () {
			this.Video.Screen.prop ("--height", this.Video.Retro ? this.Video.Screen.height / 2 : 300)
		}
		rendering () {
			let CRT = this.Video.CRT
			let Data = this.ImageData.data
			let Retro = this.Video.Retro ? 0x5F : 0xFF
			let cache_idx = 0
			for (let y = 0, idx = 0; y < CRT.RowsNo; y++) {
				for (let x = 0; x < CRT.CharsPerRow; x++) {
					let ch = CRT.char
					let cur = CRT.CursorX == x && CRT.CursorY == y
						&& (!CRT.CursorBlinking || (CRT.FrameCount & 0x08))
					if (!this.ClearCache && !cur && !ch.blinkin && ch.CharData === this.Cache [cache_idx]) {
						idx += this.ln_width * this.ln_no + this.idx_next_pos
						cache_idx++
						continue
					}
					this.Cache [cache_idx++] = cur ? 0xFFFF : ch.CharData
					let rgb = this.Video.rgb (ch)
					let rvv = ch.rvv ^ (cur && !CRT.CursorUnderline) ? 0xFF : 0x00
					let blinkin = ch.blinkin && (CRT.FrameCount & 0x10)
					let f_idx = ch.char * this.Video.FontHeight
					let pseudo = ch.pseudo
					for (let ln = this.ln0, ln_c = 0; ln_c < this.ln_no; ln++, ln_c++) {
						if (ln == this.ln_no)
							ln -= this.ln_no
						if (pseudo !== false)
							this.Video.pseudo?.(pseudo (ln_c - CRT.Underline))
						let bit_idx = idx * 2
						let bit_map = ch.blank
							? 0xFF
							: (ch.lten ^ (cur && CRT.CursorUnderline)) && ln_c == CRT.Underline
							? blinkin
							? ~rvv
							: rvv
							: blinkin || (this.blank && (ln_c == 0 || ln_c == this.ln_no - 1))
							? ~rvv
							: this.Video.font (f_idx + (ln & this.ln_mask)) ^ rvv
						for (let bit_mask = this.bit_mask0; bit_mask; bit_mask >>= 1) {
							let mask0 = bit_map & bit_mask ? 0x00 : 0xFF
							let mask1 = mask0 & Retro
							let idx0 = bit_idx
							let idx1 = idx0 + this.ln_width
							Data [idx0 + 0] = Data [idx0 + 4] = rgb.r & mask0
							Data [idx1 + 0] = Data [idx1 + 4] = rgb.r & mask1
							Data [idx0 + 1] = Data [idx0 + 5] = rgb.g & mask0
							Data [idx1 + 1] = Data [idx1 + 5] = rgb.g & mask1
							Data [idx0 + 2] = Data [idx0 + 6] = rgb.b & mask0
							Data [idx1 + 2] = Data [idx1 + 6] = rgb.b & mask1
							bit_idx += 8
						}
						idx += this.ln_width
					}
					idx += this.idx_next_pos
				}
				idx += this.idx_next_row
			}
			this.ClearCache = 0
		}
		draw () {
			this.ScreenCtx.putImageData (this.ImageData, 0, 0)
		}
	}

	#cmd = null
	#Frame = null
	#FontPtr = 0
}

