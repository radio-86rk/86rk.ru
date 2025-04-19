//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.ppi_8255.js


"use strict"

class august_ppi_8255 extends august_device {
	constructor ( def ) {
		super (4)
		this.def = def
		this.reset ()
	}
	reset () {
		this.r [0] = this.def?.pa || 0
		this.r [1] = this.def?.pb || 0
		this.r [2] = this.def?.pc || 0
		this.ctrl = august_ppi_8255.INIT_CTRL
	}
	get pa_in () {
		return this.ctrl & august_ppi_8255.DIR.PA
	}
	get pb_in () {
		return this.ctrl & august_ppi_8255.DIR.PB
	}
	get pcl_in () {
		return this.ctrl & august_ppi_8255.DIR.PCL
	}
	get pch_in () {
		return this.ctrl & august_ppi_8255.DIR.PCH
	}
	get pa () {
		return this.pa_in ? 0xFF : this.r [0]
	}
	get pb () {
		return this.pb_in ? 0xFF : this.r [1]
	}
	get pc () {
		return this.pcl | this.pch
	}
	get pcl () {
		return this.pcl_in ? 0x0F : this.r [2] & 0x0F
	}
	get pch () {
		return this.pch_in ? 0xF0 : this.r [2] & 0xF0
	}
	set pa ( v ) {
		return this.pa_in ? this.r [0] = v : void 0
	}
	set pb ( v ) {
		return this.pb_in ? this.r [1] = v : void 0
	}
	set pc ( v ) {
		return this.pcl_in && this.pch_in ? this.r [2] = v : ((this.pcl = v), (this.pch = v))
	}
	set pcl ( v ) {
		return this.pcl_in ? this.r [2] = (this.r [2] & 0xF0) | (v & 0x0F) : void 0
	}
	set pch ( v ) {
		return this.pch_in ? this.r [2] = (this.r [2] & 0x0F) | (v & 0xF0) : void 0
	}
	get ctrl () {
		return this.r [3]
	}
	set ctrl ( v ) {
		return this.r [3] = v
	}
	get ( idx ) {
		if (idx == 0 && this.hook?.pa_in)
			this.pa = this.hook?.pa_in ()
		else if (idx == 1 && this.hook?.pb_in)
			this.pb = this.hook?.pb_in ()
		else if (idx == 2 && this.hook?.pc_in)
			this.pc = this.hook?.pc_in ()
		return idx == 3
			? august_memory.DUMMY_MEM
			: super.get (idx)
	}
	set ( idx, v ) {
		if (idx === 0)
			return this.pa_in ? void 0 : (this.r [0] = v, this.hook?.pa?.(this.r [0]))
		if (idx === 1)
			return this.pb_in ? void 0 : (this.r [1] = v, this.hook?.pb?.(this.r [1]))
		if (idx === 2) {
			return this.pcl_in
				? this.pch_in
				? void 0
				: (this.r [2] = (this.r [2] & 0x0F) | (v & 0xF0), this.hook?.pc?.(this.r [2]))
				: this.pch_in
				? (this.r [2] = (this.r [2] & 0xF0) | (v & 0x0F), this.hook?.pc?.(this.r [2]))
				: (this.r [2] = v, this.hook?.pc?.(this.r [2]))
		}
		if (v & 0x80) {
			this.ctrl = v
			if (!this.pa_in)
				this.r [0] = 0, this.hook?.pa?.(0)
			else if (isSet (this.def?.pa))
				this.r [0] = this.def?.pa
			if (!this.pb_in)
				this.r [1] = 0, this.hook?.pb?.(0)
			else if (isSet (this.def?.pb))
				this.r [1] = this.def.pb || 0
			if (!this.pcl_in)
				this.r [2] &= 0xF0
			else if (isSet (this.def?.pc))
				this.r [2] = (this.r [2] & 0xF0) | (this.def.pc & 0x0F)
			if (!this.pch_in)
				this.r [2] &= 0x0F
			else if (isSet (this.def?.pc))
				this.r [2] = (this.r [2] & 0x0F) | (this.def.pc & 0xF0)
			if (!this.pcl_in && !this.pch_in)
				this.hook?.pc?.(this.r [2])
		} else {
			let bit = v >> 1 & 0x07
			if ((bit < 4 && !this.pcl_in) || (bit >= 4 && !this.pch_in)) {
				this.r [2] = (this.r [2] & ~(1 << bit)) | ((v & 1) << bit)
				this.hook?.pc?.(this.r [2])
			}
		}
	}

	static INIT_CTRL = 0b10011011
	static DIR = {
		PA:  0b00010000,
		PB:  0b00000010,
		PCL: 0b00000001,
		PCH: 0b00001000
	}
}

