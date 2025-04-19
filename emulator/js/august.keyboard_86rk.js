//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.keyboard_86rk.js


"use strict"

class august_keyboard {
	constructor ( ppi ) {
		this.Keys = new Set
		this.PPI = ppi
		this.keydown_handler = this.keydown.bind (this)
		this.keyup_handler = this.keyup.bind (this)
		this.on ().layout ()
		for (let n of ["MATRIX_QWERTY", "MATRIX_JCUKEN"])
			this [n] = this.class_type [n].slice ()
	}
	done () {
		this.off ()
	}
	on () {
		window.addEventListener ("keydown", this.keydown_handler)
		window.addEventListener ("keyup", this.keyup_handler)
		return this
	}
	off () {
		window.removeEventListener ("keydown", this.keydown_handler)
		window.removeEventListener ("keyup", this.keyup_handler)
		return this
	}
	reset () {
		this.Keys.clear ()
		return this
	}
	layout ( v ) {
		this.MATRIX = v ? this.MATRIX_JCUKEN : this.MATRIX_QWERTY
	}
	keydown ( e ) {
		if (e.keyCode == 122)
			return
		e.stop ()
		this.Keys.add (e.keyCode)
	}
	keyup ( e ) {
		e.stop ()
		this.Keys.delete (e.keyCode)
	}
	rus () {
		return this.PPI.pc & 0x08
	}
	get in () {
		return this.PPI.pa
	}
	set matrix ( m ) {
		if (m.qwerty)
			Object.assign (this.MATRIX_QWERTY, m.qwerty)
		if (m.jcuken)
			Object.assign (this.MATRIX_JCUKEN, m.jcuken)
	}
}

class august_keyboard_86rk extends august_keyboard {
	get class_type () {
		return august_keyboard_86rk
	}
	get out () {
		if (this.Keys.has (18))
			return 0xFF
		this.PPI.pch = this.PPI.r [2] | ~this.SHIFT_KEY
		this.SHIFT = 0
		let OUT = 0
		const IN = this.in
		const SHIFT = this.Keys.has (16)
		for (let c of this.Keys) {
			let Code = !SHIFT && this.MATRIX [c] >> 16 || (this.MATRIX [c] & 0xFFFF)
			let Key = !this.rus () && (Code >> 8) || (Code & 0xFF)
			let Mask = ~(0x01 << (Key & 0x07))
			if (Key && (Mask | IN) == Mask) {
				OUT |= 0x01 << (Key >> 4 & 0x07)
				this.SHIFT |= Key & 0x80
			}
		}
		if (!OUT)
			this.SHIFT = SHIFT
		return ~OUT
	}
	get ctrl () {
		let OUT = (this.Keys.has (17) ? this.CTRL_KEY : 0xFF)
			& (this.SHIFT ? this.SHIFT_KEY : 0xFF)
		return this.Keys.has (20) || this.Keys.has (145)
			? OUT & this.RUS_KEY
			: OUT & (this.PPI.r [2] | ~this.RUS_KEY | ~this.CTRL_KEY)
	}

	SHIFT = 0
	SHIFT_KEY = 0xDF
	CTRL_KEY = 0xBF
	RUS_KEY = 0x7F

	static MATRIX_QWERTY = [
		0,		0,		0,		0,		0,		0,		0,		0,
		0x31,		0x01,		0,		0,		0,		0x21,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0x20,		0,		0,		0,		0,
		0x77,		0,		0,		0x10,		0x08,		0x41,		0x51,		0x61,
		0x71,		0,		0,		0,		0,		0x11,		0x20,		0,
		0x00020093,	0x00120092,	0x002204A2,	0x003200B2,	0x0042C233,	0x005200D2,	0x00626723,	0x0072E2F3,
		0x000300A3,	0x00130083,	0,		0x33662366,	0,		0x00D300B3,	0,		0,

		0,		0x1464,		0x2415,		0x3436,		0x4476,		0x5456,		0x6414,		0x7406,
		0x0526,		0x1537,		0x2575,		0x3545,		0x4544,		0x5507,		0x6546,		0x7557,
		0x0627,		0x1625,		0x2635,		0x3617,		0x4654,		0x5674,		0x6655,		0x7634,
		0x0767,		0x1765,		0x2716,		0,		0,		0,		0,		0,
		0x02,		0x12,		0x22,		0x32,		0x42,		0x52,		0x62,		0x72,
		0x03,		0x13,		0xA3,		0xB3,		0,		0x53,		0x63,		0x73,
		0x30,		0x40,		0x50,		0x60,		0x70,		0,		0,		0,
		0,		0,		0,		0x20,		0,		0,		0,		0,

		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0x005300B1,	0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0x33662366,	0x00D300B3,	0x4324C324,	0x005300B1,	0x6304E304,	0x7363F343,

		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0x3705,		0x47730073,	0x5700,		0xF247A247,	0,
		0,		0,		0x47C70073,	0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0
	]
	static MATRIX_JCUKEN = [
		0,		0,		0,		0,		0,		0,		0,		0,
		0x31,		0x01,		0,		0,		0,		0x21,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0x20,		0,		0,		0,		0,
		0x77,		0,		0,		0x10,		0x08,		0x41,		0x51,		0x61,
		0x71,		0,		0,		0,		0,		0x11,		0x20,		0,
		0x02,		0x00120092,	0x002200A2,	0x003200B2,	0x004200C2,	0x005200D2,	0x006200E2,	0x007200F2,
		0x00030083,	0x00130093,	0,		0x66,		0,		0x00D300B3,	0,		0,

		0,		0x64,		0x15,		0x36,		0x76,		0x56,		0x14,		0x06,
		0x26,		0x37,		0x75,		0x45,		0x44,		0x07,		0x46,		0x57,
		0x27,		0x25,		0x35,		0x17,		0x54,		0x74,		0x55,		0x34,
		0x67,		0x65,		0x16,		0,		0,		0,		0,		0,
		0x02,		0x12,		0x22,		0x32,		0x42,		0x52,		0x62,		0x72,
		0x03,		0x13,		0xA3,		0xB3,		0,		0x53,		0x63,		0x73,
		0x30,		0x40,		0x50,		0x60,		0x70,		0,		0,		0,
		0,		0,		0,		0x20,		0,		0,		0,		0,

		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0x005300B1,	0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0x66,		0x007300F3,	0x24,		0x005300D3,	0x04,		0x004300C3,

		0x003300B3,	0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0x05,		0x006300E3,	0x002300A3,	0x47,		0,
		0,		0,		0x47C70073,	0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0
	]
}

class august_keyboard_86kr_tapper {
	constructor ( str, param, pause = 0 ) {
		this.TimeStamp = pause ? August.now () : 0
		this.Param = param
		this.Pause = pause
		this.Count = 0
		this.Delay = 0
		this.Char = null
		this.GetChar = (function* () {
			yield* str.toUpperCase ()
		})()
	}
	key ( a ) {
		if (this.pause ())
			return 0xFF
		if (this.Char === null) {
			this.Char = this.GetChar.next ().value
			if (!this.Char)
				return null
			this.Count = 0
			this.Delay = 1
			return 0xFF
		}
		let Key = this.KEYS [this.Char]
		if (!Key)
			return this.Char = null, this.key (a)
		if ((Key.b0 | a) != Key.b0)
			return 0xFF
		if (a && ++this.Count == this.Param [0])
			this.Char = null
		return Key >> 8
	}
	ready () {
		if (!this.TimeStamp)
			this.TimeStamp = August.now ()
		let Ready = August.now () - this.TimeStamp > this.Pause
		if (Ready)
			this.TimeStamp = August.now ()
		return Ready
	}
	pause () {
		if (this.Delay) {
			if (++this.Count == this.Param [1])
				this.Count = this.Delay = 0
			return this.Delay
		}
		if (this.Pause && this.ready ())
			this.Pause = 0
		return this.Pause
	}

	KEYS = {
		"\n":	0x0FBFD, "\t":	0x0FEFD,
		"0":	0x0FEFB, "1":	0x0FDFB, "2":	0x0FBFB, "3":	0x0F7FB,
		"4":	0x0EFFB, "5":	0x0DFFB, "6":	0x0BFFB, "7":	0x07FFB,
		"8":	0x0FEF7, "9":	0x0FDF7, ":":	0x0FBF7, ";":	0x0F7F7,
		",":	0x0EFF7, "-":	0x0DFF7, ".":	0x0BFF7, "/":	0x07FF7,
		"@":	0x0FEEF, "A":	0x0FDEF, "B":	0x0FBEF, "C":	0x0F7EF,
		"D":	0x0EFEF, "E":	0x0DFEF, "F":	0x0BFEF, "G":	0x07FEF,
		"H":	0x0FEDF, "I":	0x0FDDF, "J":	0x0FBDF, "K":	0x0F7DF,
		"L":	0x0EFDF, "M":	0x0DFDF, "N":	0x0BFDF, "O":	0x07FDF,
		"P":	0x0FEBF, "Q":	0x0FDBF, "R":	0x0FBBF, "S":	0x0F7BF,
		"T":	0x0EFBF, "U":	0x0DFBF, "V":	0x0BFBF, "W":	0x07FBF,
		"X":	0x0FE7F, "Y":	0x0FD7F, "Z":	0x0FB7F, "[":	0x0F77F,
		"\\":	0x0EF7F, "]":	0x0DF7F, "^":	0x0BF7F, " ":	0x07F7F,
		"_":	0x1F7FD, "!":	0x1FDFB, "\"":	0x1FBFB, "#":	0x1F7FB,
		"$":	0x1EFFB, "%":	0x1DFFB, "&":	0x1BFFB, "'":	0x17FFB,
		"(":	0x1FEF7, ")":	0x1FDF7, "*":	0x1FBF7, "+":	0x1F7F7,
		"<":	0x1EFF7, "=":	0x1DFF7, ">":	0x1BFF7, "?":	0x17FF7,
		"Ю":	0x1FEEF, "А":	0x1FDEF, "Б":	0x1FBEF, "Ц":	0x1F7EF,
		"Д":	0x1EFEF, "Е":	0x1DFEF, "Ф":	0x1BFEF, "Г":	0x17FEF,
		"Х":	0x1FEDF, "И":	0x1FDDF, "Й":	0x1FBDF, "К":	0x1F7DF,
		"Л":	0x1EFDF, "М":	0x1DFDF, "Н":	0x1BFDF, "О":	0x17FDF,
		"П":	0x1FEBF, "Я":	0x1FDBF, "Р":	0x1FBBF, "С":	0x1F7BF,
		"Т":	0x1EFBF, "У":	0x1DFBF, "Ж":	0x1BFBF, "В":	0x17FBF,
		"Ь":	0x1FE7F, "Ы":	0x1FD7F, "З":	0x1FB7F, "Ш":	0x1F77F,
		"Э":	0x1EF7F, "Щ":	0x1DF7F, "Ч":	0x1BF7F,
		"{":	0x0F77F, "}":	0x0DF7F, "~":	0x07F7F
	}
}

