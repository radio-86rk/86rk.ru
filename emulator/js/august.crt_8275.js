//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.crt_8275.js


"use strict"

class august_crt_8275 extends august_device {
	constructor ( freq, get_byte ) {
		super (2)
		this.GetByte = get_byte
		this.Freq = freq
		this.calc_frame_period ()
		this.reset ()
	}
	reset () {
		this.StopDMA = 0
		this.Blanked = 0
		this.PrevAttr = 0
		this.CurAttr = 0
		this.RowCountChar = -1
		this.FifoCountChar = 0
		this.FrameCountRow = 0
		this.FrameCount = 0
		this.StartTime = 0
	}
	start () {
		if (this.StartTime)
			return
		this.StartTime = August.now ()
		this.calc_frame_period ()
	}
	calc_frame_period () {
		let chs = (this.CharsPerRow + this.HRTCCharCount)
			* (this.RowsNo + this.VRTCRowCount)
			* this.LinesNo
		this.FramePeriod = 1000 * chs / this.Freq
	}
	calc_frame_count () {
		let fc = (August.now () - this.StartTime) / this.FramePeriod | 0
		if (this.FrameCount != fc && (this.Status & august_crt_8275.STATUS.IE))
			this.Status |= august_crt_8275.STATUS.IR
		this.FrameCount = fc
	}
	frame_rate () {
		return 1000 / this.FramePeriod
	}
	video_enable () {
		return this.Status & august_crt_8275.STATUS.VE
	}
	get char () {
		let get_char = () => {
			if (++this.RowCountChar - this.FifoCountChar == this.CharsPerRow) {
				this.RowCountChar = 0
				this.FifoCountChar = 0
				this.StopDMA &= ~0x01
				this.Blanked &= ~0x01
				if (++this.FrameCountRow == this.RowsNo) {
					this.PrevAttr = 0
					this.CurAttr = 0
					this.FrameCountRow = 0
					this.StopDMA &= ~0x02
					this.Blanked &= ~0x02
				}
			}
			return this.StopDMA ? 0 : this.GetByte ()
		}

		let a = this.CurAttr
		let b = get_char ()
		if (this.StopDMA) {
			/* void */
		} else if ((b & 0xC0) == 0x80) {
			this.PrevAttr = 0
			this.CurAttr = b & 0x3F
			if (this.TransparentAttr) {
				a = this.CurAttr
				b = get_char () & 0x7F
				this.FifoCountChar++
			}
		} else if ((b & 0xF0) == 0xF0) {
			this.StopDMA = (b & 0x01) ? b & 0x03 : 0
			this.Blanked = (b & 0x02) || 0x01
			if (this.RowCountChar == this.CharsPerRow - 1)
				this.StopDMA &= ~0x01
			if (this.StopDMA && this.RowCountChar % this.BurstCount != this.BurstCount - 1)
				this.GetByte ()
		} else if ((b & 0xC0) == 0xC0) {
			a = (this.PrevAttr & 0b0011_1101) | (b & 0b1100_0010) | (b << 12)
			b = 0
		} else {
			this.PrevAttr = a			
		}
		return new august_crt_8275.char (b, a, this.Blanked)
	}
	set cmd ( v ) {
		this.Cmd = v & august_crt_8275.CMD.MASK
		this.Status &= ~august_crt_8275.STATUS.IC
		switch (this.Cmd) {
			case august_crt_8275.CMD.RESET:
				this.ParamsNo = 4
				this.Status |= august_crt_8275.STATUS.IC
				this.Status &= ~(august_crt_8275.STATUS.IE | august_crt_8275.STATUS.VE)
				this.reset ()
				this.hook?.("stop")
				break
			case august_crt_8275.CMD.START_DISPLAY:
				this.ParamsNo = 0
				this.Status |= august_crt_8275.STATUS.IE | august_crt_8275.STATUS.VE
				this.BurstSpaceCount = Math.max (((v & 0x1C) << 1) - 1, 0)
				this.BurstCount = 1 << (v & 0x03)
				this.start ()
				this.hook?.("start")
				break
			case august_crt_8275.CMD.STOP_DISPLAY:
				this.ParamsNo = 0
				this.Status &= ~august_crt_8275.STATUS.VE
				this.hook?.("stop")
				break
			case august_crt_8275.CMD.READ_LIGHT_PEN:
				this.ParamsNo = 2
				break
			case august_crt_8275.CMD.LOAD_CURSOR:
				this.ParamsNo = 2
				this.Status |= august_crt_8275.STATUS.IC
				break
			case august_crt_8275.CMD.ENABLE_INTRPT:
				this.ParamsNo = 0
				this.Status |= august_crt_8275.STATUS.IE
				break
			case august_crt_8275.CMD.DISABLE_INTRPT:
				this.ParamsNo = 0
				this.Status &= ~august_crt_8275.STATUS.IE
				break
			case august_crt_8275.CMD.PRESET_CNTRS:
				this.ParamsNo = 0
				this.reset ()
				this.start ()
				this.hook?.("start")
				break
		}
	}
	set param ( v ) {
		this.Status |= august_crt_8275.STATUS.IC
		if (!this.ParamsNo)
			return
		switch (this.Cmd) {
			case august_crt_8275.CMD.RESET:
				switch (--this.ParamsNo) {
					case 3:
						this.SpacedRows = !!(v & 0x80)
						this.CharsPerRow = (v & 0x7F) + 1
						break
					case 2:
						this.VRTCRowCount = ((v & 0xC0) >> 6) + 1
						this.RowsNo = (v & 0x3F) + 1
						break
					case 1:
						this.Underline = (v & 0xF0) >> 4
						this.LinesNo = (v & 0x0F) + 1
						break
					case 0:
						this.OffsetLine = !!(v & 0x80)
						this.TransparentAttr = !(v & 0x40)
						this.CursorBlinking = !(v & 0x20)
						this.CursorUnderline = !!(v & 0x10)
						this.HRTCCharCount = ((v & 0x0F) + 1) * 2
						this.Status &= ~august_crt_8275.STATUS.IC
						break
				}
				break
			case august_crt_8275.CMD.LOAD_CURSOR:
				switch (--this.ParamsNo) {
					case 1:
						this.CursorX = v & 0x7F
						break
					case 0:
						this.CursorY = v & 0x3F
						this.Status &= ~august_crt_8275.STATUS.IC
						break
				}
				break
		}
	}
	get param () {
		switch (this.Cmd) {
			case august_crt_8275.CMD.RESET:
				switch (--this.ParamsNo) {
					case 3:
						return 0
					case 2:
						return 0
					case 1:
						return 0
					case 0:
						this.ParamsNo = 4
						return 0
				}
			case august_crt_8275.CMD.READ_LIGHT_PEN:
				switch (--this.ParamsNo) {
					case 1:
						return this.LightPenX
					case 0:
						this.ParamsNo = 2
						return this.LightPenY
				}
			case august_crt_8275.CMD.LOAD_CURSOR:
				switch (--this.ParamsNo) {
					case 1:
						return this.CursorX
					case 0:
						this.ParamsNo = 2
						return this.CursorY
				}
		}
		return this.r [1] & 0x7F
	}
	get status () {
		this.calc_frame_count ()
		let s = this.Status
		this.Status &= ~(august_crt_8275.STATUS.IR | august_crt_8275.STATUS.IC | august_crt_8275.STATUS.LP)
		return s
	}
	get ( r ) {
		return r
			? this.status
			: this.param
	}
	set ( r, v ) {
		super.set (r, v)
		return r
			? this.cmd = v
			: this.param = v
	}

	static char = class char {
		constructor ( char, attr, blank = 0 ) {
			this.CharData = char | attr.shl8
			if (blank)
				this.CharData |= 0x80
		}
		get char () {
			return this.CharData & 0x7F
		}
		get blank () {
			return !!(this.CharData & 0x80)
		}
		get hglt () {
			return !!(this.CharData & 0x0100)
		}
		get blinkin () {
			return !!(this.CharData & 0x0200)
		}
		get gpa0 () {
			return !!(this.CharData & 0x0400)
		}
		get gpa1 () {
			return !!(this.CharData & 0x0800)
		}
		get rvv () {
			return !!(this.CharData & 0x1000)
		}
		get lten () {
			return !!(this.CharData & 0x2000)
		}
		get vsp () {
			return !!(this.CharData & 0x4_0000)
		}
		get la0 () {
			return !!(this.CharData & 0x1_0000)
		}
		get la1 () {
			return !!(this.CharData & 0x2_0000)
		}
		get hglt_pseudo () {
			return !!(this.CharData & 0x10_0000)
		}
		get pseudo () {
			if ((this.CharData & 0xC000) != 0xC000)
				return false
			return ln => {
				this.CharData &= ~0b0111_0010_0000_0000_0000
				this.CharData |= char.PSEUDO [(this.CharData >> 22) & 0x0F][ln.sign () + 1] << 12
				return this
			}
		}

		static PSEUDO = [
			[ 0x40, 0x20, 0x10 ], [ 0x40, 0x30, 0x10 ], [ 0x10, 0x20, 0x40 ], [ 0x10, 0x30, 0x40 ],
			[ 0x40, 0x02, 0x10 ], [ 0x10, 0x30, 0x10 ], [ 0x10, 0x20, 0x10 ], [ 0x10, 0x02, 0x40 ],
			[ 0x40, 0x02, 0x40 ], [ 0x10, 0x10, 0x10 ], [ 0x10, 0x02, 0x10 ], [ 0x00, 0x00, 0x00 ],
			[ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ]
		]
	}

	static CMD = {
		RESET:		0x00,
		START_DISPLAY:	0x20,
		STOP_DISPLAY:	0x40,
		READ_LIGHT_PEN:	0x60,
		LOAD_CURSOR:	0x80,
		ENABLE_INTRPT:	0xA0,
		DISABLE_INTRPT:	0xC0,
		PRESET_CNTRS:	0xE0,
		MASK:		0xE0
	}

	static STATUS = {
		IE: 0b01000000,
		IR: 0b00100000,
		LP: 0b00010000,
		IC: 0b00001000,
		VE: 0b00000100,
		DU: 0b00000010,
		FO: 0b00000001
	}

	Cmd = 0
	ParamsNo = 0
	SpacedRows = false
	CharsPerRow = 1
	VRTCRowCount = 1
	RowsNo = 1
	Underline = 0
	LinesNo = 1
	OffsetLine = false
	TransparentAttr = false
	CursorBlinking = true
	CursorUnderline = false
	HRTCCharCount = 2
	CursorX = 0
	CursorY = 0
	LightPenX = 0
	LightPenY = 0
	BurstSpaceCount = 0
	BurstCount = 1
	StopDMA = 0
	Blanked = 0
	PrevAttr = 0
	CurAttr = 0
	RowCountChar = 0
	FifoCountChar = 0
	FrameCountRow = 0
}

