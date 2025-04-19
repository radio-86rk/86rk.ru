//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.dma_8257.js


"use strict"

class august_dma_8257 extends august_device {
	constructor () {
		super (8, Uint16Array)
		this.reset ()
		this.TotalRequsts = 0
	}
	reset () {
		this.r.fill (0)
		this.Mode = 0
		this.Status = 0
		this.LowByte = 0
	}
	request ( ch, v ) {
		let m_ch = 1 << ch
		if (!(this.Mode & m_ch))
			return false
		let r = ch << 1
		let addr = this.r [r]
		let cnt = this.r [r + 1] & 0x3FFF
		let rw = this.r [r + 1] & 0xC000
		let auto = ch == 2 && (this.Mode & 0x80)
		if (!cnt) {
			this.Status |= m_ch
			if (!auto && (this.Mode & 0x40))
				this.Mode &= ~m_ch
		} else if (auto && cnt == 0x3FFF) {
			addr = this.r [4] = this.r [6]
			cnt = this.r [5] = this.r [7]
		}
		this.r [r + 1] = (cnt - 1 & 0x3FFF) | rw
		this.r [r]++
		this.TotalRequsts++
		if (rw == 0x8000)
			return this.Memory.get (addr)
		if (rw == 0x4000)
			this.Memory.set (addr, v)
		return true
	}
	get length () {
		return 16
	}
	set memory ( mem ) {
		this.Memory = mem
	}
	get status () {
		let s = this.Status
		this.Status &= 0xF0
		return s
	}
	set mode ( v ) {
		this.Mode = v
		this.LowByte = 0
	}
	get total () {
		let t = this.TotalRequsts
		this.TotalRequsts = 0
		return t
	}
	get ( r ) {
		return r > 8
			? 0xFF
			: r == 8
			? this.status
			: (this.LowByte ^= 1)
			? this.r [r].b0
			: this.r [r].b1
	}
	set ( r, v ) {
		if (r == 8)
			return this.mode = v
		if (r > 8)
			return
		this.r [r] = (this.LowByte ^= 1)
			? (this.r [r] & 0xFF00) | v
			: (this.r [r] & 0xFF) | v.shl8
		if ((r >> 1) == 2 && (this.Mode & 0x80)) {
			this.r [r + 2] = this.LowByte
				? (this.r [r + 2] & 0xFF00) | v
				: (this.r [r + 2] & 0xFF) | v.shl8
		}
	}
}

