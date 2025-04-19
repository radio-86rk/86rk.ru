//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.cpu_z80.js


"use strict"

class august_regs_Z80 extends august_regs_8080 {
	constructor () {
		super (august_regs_Z80.flags)
		this.R8Z = new Uint8Array (2)
	}

	get IX ()	{ return this.R16 [0] }
	get IY ()	{ return this.R16 [1] }
	get AF ()	{ return this.PSW }

	set IX ( v )	{ return this.R16 [0] = v }
	set IY ( v )	{ return this.R16 [1] = v }
	set AF ( v )	{ return this.PSW = v }

	get IXH ()	{ return this.R8 [1] }
	get IXL ()	{ return this.R8 [0] }
	get IYH ()	{ return this.R8 [3] }
	get IYL ()	{ return this.R8 [2] }
	get I ()	{ return this.R8Z [0] }
	get R ()	{ return this.R8Z [1] }

	set IXH ( v )	{ return this.R8 [1] = v }
	set IXL ( v )	{ return this.R8 [0] = v }
	set IYH ( v )	{ return this.R8 [3] = v }
	set IYL ( v )	{ return this.R8 [2] = v }
	set I ( v )	{ return this.R8Z [0] = v }
	set R ( v )	{ return this.R8Z [1] = v }

	static flags = class extends august_regs_8080.flags {
		value ( v )	{ return v }

		get Y ()	{ return +!!(this.$ & 0x20) }
		get X ()	{ return +!!(this.$ & 0x08) }
		get N ()	{ return +!!(this.$ & 0x02) }
		get H ()	{ return this.AC }
		get V ()	{ return this.P }

		set Y ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x20 }
		set X ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x08 }
		set N ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x02 }
		set H ( f )	{ this.AC = f }
		set V ( f )	{ this.P = f }

		set YXNH0 ( v )	{ this.$ = (this.$ & ~0x3A) | (v & 0x28) }
		set YXNH1 ( v )	{ this.$ = (this.$ & ~0x28) | (v & 0x28) | 0x12 }
		set SZYXN ( v )	{ this.$ = (this.$ & ~0xAA) | (v & 0xA8); this.Z = !v }
		set SZYXP ( v )	{ this.$ = (this.$ & ~0xA8) | (v & 0xA8); this.Z = !v; this.P = this.parity (v) }
		set $0    ( v )	{ this.SZYXP = v; this.$ &= ~0x12 }
		set SZ    ( v )	{ this.S = v & 0x80; this.Z = !v }
		set SZP   ( v )	{ this.SZYXN = v; this.P = this.parity (v) }
		set SZP0  ( v )	{ this.SZYXN = v }
		set SZP1  ( v )	{ this.SZYXN = v; this.N = 1 }
	}
}

class august_cpu_Z80 extends august_cpu_8080 {
	constructor ( memory, io, pc = 0 ) {
		super (memory, io, pc, august_regs_Z80.flags)
		this.Prefix = 0
		this.Tics = 0
		this.RegsZ80 = new august_regs_Z80
		this.TABLE [0x08] = this.$ex_af_af2
		this.TABLE [0xD9] = this.$exx
		this.TABLE [0x10] = this.$djnz
		this.TABLE [0x18] = this.$jr
		this.TABLE [0x20] = this.$jr_cc
		this.TABLE [0x28] = this.$jr_cc
		this.TABLE [0x30] = this.$jr_cc
		this.TABLE [0x38] = this.$jr_cc
		this.TABLE [0xCB] = this.$table_cb
		this.TABLE [0xED] = this.$table_ed
		this.TABLE [0xDD] = this.$prefix
		this.TABLE [0xFD] = this.$prefix
		Object.defineProperties (this.Regs, {
			IX: {
				get: $ => this.RegsZ80.IX,
				set: $ => this.RegsZ80.IX = $
			},
			IY: {
				get: $ => this.RegsZ80.IY,
				set: $ => this.RegsZ80.IY = $
			}
		})
	}
	reset ( pc ) {
		this.IFF1 = this.IFF2 = 0
		super.reset (pc)
	}
	iff () {
		return this.IFF1
	}
	get_signed () {
		let b = this.get_byte ()
		return b & 0x80 ? b - 0x100 : b
	}
	get IndexReg () {
		return this.Prefix == 0xDD
			? this.RegsZ80.IX
			: this.RegsZ80.IY
	}
	get IndexRegH () {
		return this.Prefix == 0xDD
			? this.RegsZ80.IXH
			: this.RegsZ80.IYH
	}
	get IndexRegL () {
		return this.Prefix == 0xDD
			? this.RegsZ80.IXL
			: this.RegsZ80.IYL
	}
	set IndexReg ( v ) {
		return this.Prefix == 0xDD
			? this.RegsZ80.IX = v
			: this.RegsZ80.IY = v
	}
	set IndexRegH ( v ) {
		return this.Prefix == 0xDD
			? this.RegsZ80.IXH = v
			: this.RegsZ80.IYH = v
	}
	set IndexRegL ( v ) {
		return this.Prefix == 0xDD
			? this.RegsZ80.IXL = v
			: this.RegsZ80.IYL = v
	}
	get IndexMemory () {
		return this.Memory.get (this.IndexReg + this.get_signed ())
	}
	set IndexMemory ( v ) {
		return this.Memory.set (this.IndexReg + this.get_signed (), v)
	}
	index_memory ( v ) {
		let disp = this.get_signed ()
		return this.Memory.set (this.IndexReg + disp, v (this.Memory.get (this.IndexReg + disp)))
	}
	load_reg ( c ) {
		if (this.Prefix) {
			switch (c & 0x07) {
				case 4: return this.IndexRegH
				case 5: return this.IndexRegL
				case 6: return this.IndexMemory
			}
		}
		return super.load_reg (c)
	}
	store_reg ( c, v ) {
		if (this.Prefix) {
			switch (c & 0x07) {
				case 4: return this.IndexRegH = v
				case 5: return this.IndexRegL = v
				case 6: return this.IndexMemory = v
			}
		}
		return super.store_reg (c, v)
	}
	load_reg16 ( c ) {
		return this.Prefix && (c & 0x03) == 2
			? this.IndexReg
			: super.load_reg16 (c)
	}
	store_reg16 ( c, v ) {
		return this.Prefix && (c & 0x03) == 2
			? this.IndexReg = v
			: super.store_reg16 (c, v)
	}
	add_a ( v, cf = 0 ) {
		let a = super.add_a (v, cf)
		this.Regs.F.V = this.Regs.F.overflow (this.Regs.A, a, ~v)
		return a
	}
	sub_a ( v, cf = 0 ) {
		let a = super.sub_a (v, cf)
		this.Regs.F.V = this.Regs.F.overflow (this.Regs.A, a, v)
		this.Regs.F.H = !this.Regs.F.H
		return a
	}
	and_a ( v ) {
		super.and_a (v)
		this.Regs.F.H = 1
	}
	cmp_a ( v ) {
		let r = this.Regs.A - v
		this.Regs.F.SZ = r
		this.Regs.F.YXNH1 = v
		this.Regs.F.V = this.Regs.F.overflow (r, this.Regs.A, v)
		this.Regs.F.H = (this.Regs.A ^ v ^ r) & 0x10
		this.Regs.F.C = r & 0x100
	}
	add16 ( a, v ) {
		let r = a + v
		this.Regs.F.YXNH0 = r.b1
		this.Regs.F.H = (a ^ v ^ r) & 0x1000
		this.Regs.F.C = r & 0x10000
		return r
	}
	tics ( c ) {
		let flag = f => {
			return f == 8
				? !this.Regs.F.Z && this.Regs.F.P
				: this.flag (f)
		}

		let tics = this.Tics || this.TICS [c]
		this.Tics = 0
		return tics & 0xF000
			? (tics & 0x0F) + ((tics >> (flag ((tics >> 12) - 1) ? 4 : 8)) & 0x0F)
			: tics
	}

	$di ( c ) {
		this.IFF1 = this.IFF2 = 0
	}
	$ei ( c ) {
		this.IFF1 = this.IFF2 = 1
	}
	$mov ( c ) {
		if (this.Prefix && (c & 0xF7) == 0x66)
			super.store_reg (c >> 3, this.load_reg (c))
		else
			super.$mov (c)
	}
	$shld ( c ) {
		this.Memory16.set (this.get_word (), this.Prefix ? this.IndexReg : this.Regs.HL)
	}
	$lhld ( c ) {
		let w = this.Memory16.get (this.get_word ())
		if (this.Prefix)
			this.IndexReg = w
		else
			this.Regs.HL = w
	}
	$inr ( c ) {
		let r = this.Prefix && c == 0x34
			? this.index_memory (v => (v + 1).b0)
			: this.store_reg (c >> 3, (this.load_reg (c >> 3) + 1).b0)
		this.Regs.F.SZP0 = r
		this.Regs.F.H = (r & 0x0F) == 0
		this.Regs.F.V = r == 0x80
		return r
	}
	$dcr ( c ) {
		let r = this.Prefix && c == 0x35
			? this.index_memory (v => (v - 1).b0)
			: this.store_reg (c >> 3, (this.load_reg (c >> 3) - 1).b0)
		this.Regs.F.SZP1 = r
		this.Regs.F.H = (r & 0x0F) == 0x0F
		this.Regs.F.V = r == 0x7F
		return r
	}
	$rlc ( c ) {
		super.$rlc (c)
		this.Regs.F.YXNH0 = this.Regs.A
	}
	$rrc ( c ) {
		super.$rrc (c)
		this.Regs.F.YXNH0 = this.Regs.A
	}
	$ral ( c ) {
		super.$ral (c)
		this.Regs.F.YXNH0 = this.Regs.A
	}
	$rar ( c ) {
		super.$rar (c)
		this.Regs.F.YXNH0 = this.Regs.A
	}
	$cma ( c ) {
		this.Regs.A = ~this.Regs.A
		this.Regs.F.YXNH1 = this.Regs.A
	}
	$stc ( c ) {
		this.Regs.F.YXNH0 = this.Regs.A
		this.Regs.F.C = 1
	}
	$cmc ( c ) {
		this.Regs.F.YXNH0 = this.Regs.A
		this.Regs.F.H = this.Regs.F.C
		this.Regs.F.C = !this.Regs.F.C
	}
	$dad ( c ) {
		this.store_reg16 (2, this.add16 (this.load_reg16 (2), this.load_reg16 (c >> 4)))
	}
	$daa ( c ) {
		let a = this.Regs.A
		let cf = a > 0x99 || this.Regs.F.C
		let t = ((a & 0x0F) > 9 || this.Regs.F.H ? 6 : 0) | (cf ? 0x60 : 0)
		this.Regs.A = this.Regs.F.N ? a - t : a + t
		this.Regs.F.SZYXP = this.Regs.A
		this.Regs.F.H = (a ^ this.Regs.A) & 0x10
		this.Regs.F.C = cf
		return a
	}
	$jr ( c ) {
		this.Regs.PC += this.get_signed () + 1
	}
	$jr_cc ( c ) {
		if (this.flag (c >> 3))
			this.$jr (c)
		else
			++this.Regs.PC
	}
	$djnz ( c ) {
		if (--this.Regs.B)
			this.$jr (c)
		else
			++this.Regs.PC
	}
	$ex_af_af2 ( c ) {
		[this.Regs.AF, this.RegsZ80.AF] = [this.RegsZ80.AF, this.Regs.AF]
	}
	$exx ( c ) {
		[this.Regs.BC, this.RegsZ80.BC] = [this.RegsZ80.BC, this.Regs.BC]
		[this.Regs.DE, this.RegsZ80.DE] = [this.RegsZ80.DE, this.Regs.DE]
		[this.Regs.HL, this.RegsZ80.HL] = [this.RegsZ80.HL, this.Regs.HL]
	}
	$in ( c ) {
		this.Regs.A = this.IO.get (this.get_byte () | this.Regs.A.shl8)
	}
	$out ( c ) {
		this.IO.set (this.get_byte () | this.Regs.A.shl8, this.Regs.A)
	}
	$ed_in ( c ) {
		let r = this.IO.get (this.Regs.BC)
		this.Regs.F.$0 = r
		if (c != 0x70)
			super.store_reg (c >> 3, r)
	}
	$ed_out ( c ) {
		this.IO.set (this.Regs.BC, c == 0x71 ? 0 : super.load_reg (c >> 3))
	}
	$ed_ld_i_a ( c ) {
		this.Regs.I = this.Regs.A
	}
	$ed_ld_r_a ( c ) {
		this.Regs.R = this.Regs.A
	}
	$ed_ld_a_i ( c ) {
		this.Regs.A = this.Regs.I
		this.Regs.F.SZ = this.Regs.A
		this.Regs.F.H = this.Regs.F.N = 0
		this.Regs.F.P = this.IFF2
	}
	$ed_ld_a_r ( c ) {
		this.Regs.A = this.Regs.R
		this.Regs.F.SZ = this.Regs.A
		this.Regs.F.H = this.Regs.F.N = 0
		this.Regs.F.P = this.IFF2
	}
	$ed_st16 ( c ) {
		this.Memory16.set (this.get_word (), super.load_reg16 (c >> 4))
	}
	$ed_ld16 ( c ) {
		super.store_reg16 (c >> 4, this.Memory16.get (this.get_word ()))
	}
	$ed_neg ( c ) {
		let a = this.Regs.A
		this.Regs.A = 0
		this.sub_a (a)
	}
	$ed_adc ( c ) {
		let hl = this.Regs.HL
		let v = super.load_reg16 (c >> 4) + this.Regs.F.C
		this.Regs.HL = this.add16 (hl, v)
		this.Regs.F.V = this.Regs.F.overflow (this.Regs.H, hl.b1, ~v.b1)
		this.Regs.F.Z = !this.Regs.HL
		this.Regs.F.S = this.Regs.HL & 0x8000
	}
	$ed_sbc ( c ) {
		let hl = this.Regs.HL
		let v = super.load_reg16 (c >> 4) + this.Regs.F.C
		this.Regs.HL = this.add16 (hl, -v)
		this.Regs.F.V = this.Regs.F.overflow (this.Regs.H, hl.b1, v.b1)
		this.Regs.F.Z = !this.Regs.HL
		this.Regs.F.S = this.Regs.HL & 0x8000
		this.Regs.F.N = 1
	}
	$ed_rrd ( c ) {
		let m = this.MemoryHL
		this.MemoryHL = (m >> 4) | (this.Regs.A << 4)
		this.Regs.A = (this.Regs.A & 0xF0) | (m & 0x0F)
		this.Regs.F.$0 = this.Regs.A
	}
	$ed_rld ( c ) {
		let m = this.MemoryHL
		this.MemoryHL = (m << 4) | (this.Regs.A & 0x0F)
		this.Regs.A = (this.Regs.A & 0xF0) | (m >> 4)
		this.Regs.F.$0 = this.Regs.A
	}
	$ed_retn ( c ) {
		this.IFF1 = this.IFF2
		super.$ret (c)
	}
	$ed_reti ( c ) {
		super.$ret (c)
	}
	$ed_mv ( c ) {
		let r = this.Memory.set (this.Regs.DE, this.MemoryHL) + this.Regs.A
		this.Regs.F.Y = r & 0x02
		this.Regs.F.X = r & 0x08
		this.Regs.F.H = this.Regs.F.N = 0
		this.Regs.F.P = --this.Regs.BC
		if (c & 0x08)
			--this.Regs.DE, --this.Regs.HL
		else
			++this.Regs.DE, ++this.Regs.HL
		if ((c & 0xF0) == 0xB0 && this.Regs.BC)
			this.Regs.PC -= 2
	}
	$ed_cp ( c ) {
		let r = this.Regs.A - this.MemoryHL
		let n = r - this.Regs.F.H
		this.Regs.F.SZP1 = r
		this.Regs.F.Y = n & 0x02
		this.Regs.F.X = n & 0x08
		this.Regs.F.H = (this.Regs.A ^ this.MemoryHL ^ r) & 0x10
		this.Regs.F.P = --this.Regs.BC
		if (c & 0x08)
			--this.Regs.HL
		else
			++this.Regs.HL
		if ((c & 0xF0) == 0xB0 && this.Regs.BC && !this.Regs.F.Z)
			this.Regs.PC -= 2
	}
	$ed_inout ( c ) {
		let v = c & 0x01
			? this.IO.set (this.Regs.BC, this.MemoryHL)
			: this.MemoryHL = this.IO.get (this.Regs.BC)
		let r = v + ((c & 0x01 ? this.Regs.L : this.Regs.C) + (c & 0x08 ? -1 : 1)).b0
		this.Regs.F.SZYXN = --this.Regs.B
		this.Regs.F.P = this.Regs.F.parity ((r & 0x07) ^ this.Regs.B)
		this.Regs.F.H = this.Regs.F.C = r & 0x100
		this.Regs.F.N = v & 0x80
		if (c & 0x08)
			--this.Regs.HL
		else
			++this.Regs.HL
		if ((c & 0xF0) == 0xB0 && this.Regs.BC)
			this.Regs.PC -= 2
	}
	$ed_im0 ( c ) {
	}
	$ed_im1 ( c ) {
	}
	$ed_im2 ( c ) {
	}
	$table_cb ( c ) {
		let n = (c >> 3) & 0x07
		switch (c >> 6) {
			case 0: {
				let op = [
					v => (v << 1) | (v >> 7),
					v => (v >> 1) | (v << 7),
					v => (v << 1) | this.Regs.F.C,
					v => (v >> 1) | (this.Regs.F.C << 7),
					v => v << 1,
					v => (v >> 1) | (v & 0x80),
					v => (v << 1) | 0x01,
					v => v >> 1
				][n]
				let MaskBit = c & 0x08 ? 0x01 : 0x80
				if (this.Prefix) {
					let r = this.index_memory (v => (this.Regs.F.C = v & MaskBit, op (v)))
					this.Regs.F.$0 = r
					if ((c & 0x07) != 6)
						super.store_reg (c, r)
				} else {
					let v = super.load_reg (c)
					this.Regs.F.C = v & MaskBit
					this.Regs.F.$0 = super.store_reg (c, op (v))
				}
				break
			}
			case 1: {
				let r = (1 << n) & (this.Prefix
					? this.IndexMemory
					: this.load_reg (c))
				this.Regs.F.Z = this.Regs.F.P = !r
				this.Regs.F.S = r && n == 7
				this.Regs.F.Y = r && n == 5
				this.Regs.F.X = r && n == 3
				this.Regs.F.H = 1
				this.Regs.F.N = 0
				break
			}
			case 2: {
				let r = this.Prefix
					? this.index_memory (v => v & ~(1 << n))
					: super.load_reg (c) & ~(1 << n)
				if (!this.Prefix || (c & 0x07) != 6)
					super.store_reg (c, r)
				break
			}
			case 3: {
				let r = this.Prefix
					? this.index_memory (v => v | (1 << n))
					: super.load_reg (c) | (1 << n)
				if (!this.Prefix || (c & 0x07) != 6)
					super.store_reg (c, r)
				break
			}
		}
		this.Tics = this.Prefix
			? this.TICS_DDCB_FDCB [c]
			: this.TICS_CB [c]
	}
	$table_ed ( c ) {
		if (this.Prefix) {
			this.Prefix = 0
			this.Regs.PC--
		} else {
			c = this.get_byte ()
			this.TABLE_ED [c].call (this, c)
			this.Tics = this.TICS_ED [c]
		}
	}
	$prefix ( c ) {
		if (this.Prefix) {
			this.Regs.PC--
		} else {
			this.Prefix = c
			c = this.get_byte ()
			this.TABLE [c].call (this, c)
			this.Tics = this.TICS_DD_FD [c]
		}
		this.Prefix = 0
	}

	TABLE_ED = [
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$ed_in,	this.$ed_out,	this.$ed_sbc,	this.$ed_st16,	this.$ed_neg,	this.$ed_retn,	this.$ed_im0,	this.$ed_ld_i_a,
		this.$ed_in,	this.$ed_out,	this.$ed_adc,	this.$ed_ld16,	this.$ed_neg,	this.$ed_reti,	this.$ed_im0,	this.$ed_ld_r_a,
		this.$ed_in,	this.$ed_out,	this.$ed_sbc,	this.$ed_st16,	this.$ed_neg,	this.$ed_retn,	this.$ed_im1,	this.$ed_ld_a_i,
		this.$ed_in,	this.$ed_out,	this.$ed_adc,	this.$ed_ld16,	this.$ed_neg,	this.$ed_reti,	this.$ed_im2,	this.$ed_ld_a_r,
		this.$ed_in,	this.$ed_out,	this.$ed_sbc,	this.$ed_st16,	this.$ed_neg,	this.$ed_retn,	this.$ed_im0,	this.$ed_rrd,
		this.$ed_in,	this.$ed_out,	this.$ed_adc,	this.$ed_ld16,	this.$ed_neg,	this.$ed_reti,	this.$ed_im0,	this.$ed_rld,
		this.$ed_in,	this.$ed_out,	this.$ed_sbc,	this.$ed_st16,	this.$ed_neg,	this.$ed_retn,	this.$ed_im1,	this.$nop,
		this.$ed_in,	this.$ed_out,	this.$ed_adc,	this.$ed_ld16,	this.$ed_neg,	this.$ed_reti,	this.$ed_im2,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$ed_mv,	this.$ed_cp,	this.$ed_inout,	this.$ed_inout,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$ed_mv,	this.$ed_cp,	this.$ed_inout,	this.$ed_inout,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$ed_mv,	this.$ed_cp,	this.$ed_inout,	this.$ed_inout,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$ed_mv,	this.$ed_cp,	this.$ed_inout,	this.$ed_inout,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,
		this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop,	this.$nop
	]

	TICS = [
		4,	10,	7,	6,	4,	4,	7,	4,
		4,	11,	7,	6,	4,	4,	7,	4,
		0x1058,	10,	7,	6,	4,	4,	7,	4,
		12,	11,	7,	6,	4,	4,	7,	4,
		0x1057,	10,	16,	6,	4,	4,	7,	4,
		0x2057,	11,	16,	6,	4,	4,	7,	4,
		0x3057,	10,	13,	6,	11,	11,	10,	4,
		0x4057,	11,	13,	6,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		7,	7,	7,	7,	7,	7,	4,	7,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		0x1065,	10,	10,	10,	0x107A,	11,	7,	11,
		0x2065,	10,	10,	4,	0x207A,	17,	7,	11,
		0x3065,	10,	10,	11,	0x307A,	11,	7,	11,
		0x4065,	4,	10,	11,	0x407A,	4,	7,	11,
		0x5065,	10,	10,	19,	0x507A,	11,	7,	11,
		0x6065,	4,	10,	4,	0x607A,	4,	7,	11,
		0x7065,	10,	10,	4,	0x707A,	11,	7,	11,
		0x8065,	6,	10,	4,	0x807A,	4,	7,	11
	]
	TICS_DD_FD = [
		8,	14,	11,	10,	8,	8,	11,	8,
		8,	15,	11,	10,	8,	8,	11,	8,
		0x105C,	14,	11,	10,	8,	8,	11,	8,
		16,	15,	11,	10,	8,	8,	11,	8,
		0x105B,	14,	20,	10,	8,	8,	11,	8,
		0x205B,	15,	20,	10,	8,	8,	11,	8,
		0x305B,	14,	17,	10,	23,	23,	19,	8,
		0x405B,	15,	17,	10,	8,	8,	11,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		19,	19,	19,	19,	19,	19,	8,	19,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		8,	8,	8,	8,	8,	8,	19,	8,
		0x1069,	14,	14,	14,	0x107E,	15,	11,	15,
		0x2069,	14,	14,	0,	0x207E,	21,	11,	15,
		0x3069,	14,	14,	15,	0x307E,	15,	11,	15,
		0x4069,	8,	14,	15,	0x407E,	0,	11,	15,
		0x5069,	14,	14,	23,	0x50BE,	15,	11,	15,
		0x6069,	8,	14,	8,	0x607E,	0,	11,	15,
		0x7069,	14,	14,	8,	0x707E,	15,	11,	15,
		0x8069,	10,	14,	8,	0x807E,	0,	11,	15
	]
	TICS_CB = [
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	12,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
		8,	8,	8,	8,	8,	8,	15,	8,
	]
	TICS_DDCB_FDCB = [
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		20,	20,	20,	20,	20,	20,	20,	20,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23,
		23,	23,	23,	23,	23,	23,	23,	23
	]
	TICS_ED = [
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		12,	12,	15,	20,	8,	14,	8,	9,
		12,	12,	15,	20,	8,	14,	8,	9,
		12,	12,	15,	20,	8,	14,	8,	9,
		12,	12,	15,	20,	8,	14,	8,	9,
		12,	12,	15,	20,	8,	14,	8,	18,
		12,	12,	15,	20,	8,	14,	8,	18,
		12,	12,	15,	20,	8,	14,	8,	8,
		12,	12,	15,	20,	8,	14,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		16,	16,	16,	16,	8,	8,	8,	8,
		16,	16,	16,	16,	8,	8,	8,	8,
		0x616F,	0x916F,	0x116F,	0x116F,	8,	8,	8,	8,
		0x616F,	0x916F,	0x116F,	0x116F,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8,
		8,	8,	8,	8,	8,	8,	8,	8
	]

	NAME = "Z80"
}

