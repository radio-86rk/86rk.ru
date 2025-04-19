//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.pit_8253.js


"use strict"

class august_pit_8253 extends august_device {
	constructor ( freq ) {
		super (4)
		this.Freq = freq
		this.Counter = [
			new august_pit_8253.counter (this, 0),
			new august_pit_8253.counter (this, 1),
			new august_pit_8253.counter (this, 2)
		]
	}
	get ( r ) {
		return r != 3
			? this.Counter [r].get ()
			: 0xFF
	}
	set ( r, v ) {
		if (r != 3)
			return this.Counter [r].set (v)
		let ch = (v >> 6) & 0x03
		if (ch != 3)
			this.Counter [ch].ctrl (v)
	}

	static counter = class counter {
		constructor ( pit, num ) {
			this.PIT = pit
			this.Num = num
		}
		ctrl ( ctrl ) {
			this.BCD = ctrl & 0x01
			this.Mode = ctrl >> 1 & 0x07
			this.Load = ctrl >> 4 & 0x03
			if (this.Mode > 5)
				this.Mode &= 0x03
			if (this.Load == counter.LOAD.LATCH) {
				this.Latch = this.get_counter ()
				this.Latched = 1
				this.HighByte = 0
			} else {
				this.Latch = 0
				this.Latched = 0
				this.Counter = 0
				this.HighByte = this.Load == counter.LOAD.HIGH_BYTE
				this.PIT.hook?.init?.(this.Num, this.Mode)
			}
		}
		get () {
			let c = this.Latched ? this.Latch : this.get_counter ()
			let v = this.HighByte ? c.b1 : c.b0
			if (this.HighByte)
				this.Latched = 0
			if (this.Load == counter.LOAD.WORD)
				this.HighByte ^= 1
			return v
		}
		set ( v ) {
			if (this.HighByte) {
				this.Latch = (this.Latch & 0x00FF) | v.b0.shl8
				this.set_counter (this.Latch)
			} else {
				this.Latch = (this.Latch & 0xFF00) | v.b0
				if (this.Load != counter.LOAD.WORD)
					this.set_counter (this.Latch)
			}
			if (this.Load == counter.LOAD.WORD)
				this.HighByte ^= 1
		}
		get_counter () {
			return this.Counter
				? (this.now () - this.Start) * this.PIT.Freq / 10000 % this.Counter
				: 0
		}
		set_counter ( v ) {
			this.Start = this.now ()
			this.Counter = v || 0x10000
			this.PIT.hook?.cnt?.(this.Num, this.Counter)
		}
		now () {
			return performance.now () * 10 + .5 | 0
		}

		BCD = 0
		Mode = 0
		Load = 0
		HighByte = 0
		Counter = 0
		Latch = 0
		Latched = 0
		Start = 0

		static LOAD = {
			LATCH:		0,
			LOW_BYTE:	1,
			HIGH_BYTE:	2,
			WORD:		3
		}
	}
}

