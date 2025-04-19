//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.rtc_6242.js


"use strict"

class august_rtc_6242 extends august_device {
	constructor ( app, id ) {
		super (16)
		this.app = app
		this.id = id
		let Date = new window.Date ()
		this.Time = +Date - +Date % 1000 + 1000
		try {
			let Data = this.app.STORAGE (`rtc-6242-${id}`)
			if (Data) {
				Data = JSON.parse (Data)
				this.r.set (Data.regs)
console.log ("rtc regs", this.r)
console.log ("rtc adj", (+Date - Data.done) / 1000)
				this.tic_n ((+Date - Data.done) / 1000 | 0)
				return
			}
		} catch ( e ) {
			console.log ("august_rtc_6242", e.toString ())
		}
		this.set_r8 (0x00, Date.getSeconds ())
		this.set_r8 (0x02, Date.getMinutes ())
		this.set_r8 (0x04, Date.getHours ())
		this.set_r8 (0x06, Date.getDate ())
		this.set_r8 (0x08, Date.getMonth () + 1)
		this.set_r8 (0x0A, Date.getFullYear () % 100)
		this.r [0x0C] = Date.getDay ()
		this.r [0x0F] = 0x04
	}
	done () {
		this.tic ()
		this.app.STORAGE (`rtc-6242-${this.id}`, JSON.stringify ({
			"done":	Date.now (),
			"regs":	[... this.r]
		}))
	}
	tic () {
		let Tic = Date.now () - this.Time
		if (Tic > 0) {
			if (Tic < 1000) {
				this.tic_1 ()
				this.Time += 1000
			} else {
				this.tic_n (Tic / 1000 | 0)
				this.Time += Tic - Tic % 1000
			}
		}
	}
	tic_1 () {
		let tic = ( r, cmp, first = 0 ) => {
			let val = this.get_r8 (r) + 1
			let tic = val == cmp + first
			this.set_r8 (r, tic ? first : val)
			return tic
		}
		let tic_hours = () => {
			if (this.r [0x0F] & 0x04)
				return tic (0x04, 24)
			let h = this.get_r8 (0x04, 0x03) + 1
			let pm = this.r [0x05] & 0x04
			if (h == 12) {
				if (pm)
					return this.set_r8 (0x04, h), true
				pm = 0x04
			} else if (h == 13) {
				h = 1
			}
			this.set_r8 (0x04, h, pm)
			return false
		}
		let tic_day = () => {
			this.r [0x0C] = (this.r [0x0C] + 1) % 7
			return true
		}

		tic (0x00, 60) && tic (0x02, 60) && tic_hours () && tic_day ()
			&& tic (0x06, this.month_size (this.get_r8 (0x08), this.get_r8 (0x0A)), 1)
			&& tic (0x08, 12, 1) && tic (0x0A, 100)
	}
	tic_n ( add_s ) {
		let add = ( r, add, cnt ) => {
			let val = this.get_r8 (r) + add
			let car = val >= cnt
			this.set_r8 (r, car ? val % cnt : val)
			return car ? val / cnt | 0 : 0
		}

console.log ("tic_n add", add_s, "sec")
		let add_m = add (0x00, add_s, 60)
		if (!add_m)
			return
console.log ("tic_n add", add_m, "min")
		let add_h = add (0x02, add_m, 60)
		if (!add_h)
			return
		let h24 = this.r [0x0F] & 0x04
		if (!h24)
			this.set_h24 ()
console.log ("tic_n add", add_h, "hou")
		let add_d = add (0x04, add_h, 24)
		if (!h24)
			this.set_h12 ()
		if (!add_d)
			return
console.log ("tic_n add", add_d, "day")
		this.r [0x0C] = (this.r [0x0C] + add_d) % 7
		let day = this.get_r8 (0x06)
		let mon = this.get_r8 (0x08)
		let yea = this.get_r8 (0x0A)
		for (;;) {
			let days = this.month_size (mon, yea)
			if (day + add_d > days) {
				add_d -= days - day + 1
				day = 1
				if (++mon == 13)
					mon = 1, ++yea
			} else {
				day += add_d
				break
			}
		}
		this.set_r8 (0x06, day)
		this.set_r8 (0x08, mon)
		this.set_r8 (0x0A, yea % 100)
	}
	month_size ( m, y ) {
		return m == 2
			? y & 0x03 ? 28 : 29
			: 30 + (0x15AA >> m & 1)
	}
	set_h12 () {
		let h = this.get_r8 (0x04, 0x03)
		if (h > 12)
			this.set_r8 (0x04, h - 12, 0x04)
		else if (h == 12)
			this.r [0x05] |= 0x04
		else if (h == 0)
			this.set_r8 (0x04, 12)
	}
	set_h24 () {
		let h = this.get_r8 (0x04, 0x03)
		if (this.r [0x05] & 0x04) {
			if (h != 12)
				this.set_r8 (0x04, h + 12)
		} else if (h == 12) {
			this.set_r8 (0x04, 0)
		}
	}
	get_r8 ( r, m = 0x0F ) {
		return this.r [r] + (this.r [r + 1] & m) * 10
	}
	set_r8 ( r, v, h = 0 ) {
		this.r [r] = v % 10
		this.r [r + 1] = v / 10 | h
	}
	get ( r ) {
		return super.get (r) | (august_memory.DUMMY_MEM & 0xF0)
	}
	set ( r, v ) {
		switch (r) {
			case 0x0D:
				if (v & 0x08) {
					if (this.get_r8 (0x00) < 30)
						this.set_r8 (0x00, 0)
					else
						this.set_r8 (0x00, 59), this.tic_1 ()
				}
				return
			case 0x0E:
				return
			case 0x0F:
				this.r [r] &= ~0x04
				this.r [r] |= v & 0x04
				return
		}
		super.set (r, v)
	}
}

