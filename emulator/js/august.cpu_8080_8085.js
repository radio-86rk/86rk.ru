//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.cpu_8080_8085.js


"use strict"

class august_regs_8080 {
	constructor ( flags = august_regs_8080.flags ) {
		this.R16 = new Uint16Array (6)
		this.R8 = new Uint8Array (this.R16.buffer)
		this.F = new flags (this)
	}

	get PC  ()	{ return this.R16 [0] }
	get SP  ()	{ return this.R16 [1] }
	get PSW ()	{ return this.R16 [2] }
	get BC  ()	{ return this.R16 [3] }
	get DE  ()	{ return this.R16 [4] }
	get HL  ()	{ return this.R16 [5] }

	set PC  ( v )	{ return this.R16 [0] = v }
	set SP  ( v )	{ return this.R16 [1] = v }
	set PSW ( v )	{ return this.A = v.b1, this.FLAG = v, v }
	set BC  ( v )	{ return this.R16 [3] = v }
	set DE  ( v )	{ return this.R16 [4] = v }
	set HL  ( v )	{ return this.R16 [5] = v }

	get A ()	{ return this.R8 [5] }
	get B ()	{ return this.R8 [7] }
	get C ()	{ return this.R8 [6] }
	get D ()	{ return this.R8 [9] }
	get E ()	{ return this.R8 [8] }
	get H ()	{ return this.R8 [11] }
	get L ()	{ return this.R8 [10] }
	get FLAG ()	{ return this.F.$ }

	set A ( v )	{ return this.R8 [5] = v }
	set B ( v )	{ return this.R8 [7] = v }
	set C ( v )	{ return this.R8 [6] = v }
	set D ( v )	{ return this.R8 [9] = v }
	set E ( v )	{ return this.R8 [8] = v }
	set H ( v )	{ return this.R8 [11] = v }
	set L ( v )	{ return this.R8 [10] = v }
	set FLAG ( v )	{ return this.F.$ = v }

	static flags = class flags {
		constructor ( regs ) {
			this.$r8 = regs.R8
		}

		value ( v )	{ return v & 0b11010111 | 0b00000010 }
		parity ( v )	{ return 0x9669 >> ((v ^ (v >> 4)) & 0x0F) & 1 }
		overflow ( res, lhs, rhs ) { return (lhs ^ rhs) & (lhs ^ res) & 0x80 }

		get $ ()	{ return this.$r8 [4] }
		set $ ( v )	{ return this.$r8 [4] = this.value (v) }

		get S  ()	{ return +!!(this.$ & 0x80) }
		get Z  ()	{ return +!!(this.$ & 0x40) }
		get AC ()	{ return +!!(this.$ & 0x10) }
		get P  ()	{ return +!!(this.$ & 0x04) }
		get C  ()	{ return +!!(this.$ & 0x01) }

		set S  ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x80 }
		set Z  ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x40 }
		set AC ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x10 }
		set P  ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x04 }
		set C  ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x01 }

		set SZP  ( v )	{ this.S = v & 0x80; this.Z = !v; this.P = this.parity (v) }
		set SZP0 ( v )	{ this.SZP = v }
		set SZP1 ( v )	{ this.SZP = v }
	}
}

class august_cpu_8080 {
	constructor ( memory, io, pc = 0, flags ) {
		const self = this
		this.Regs = new august_regs_8080 (flags)
		this.IO = io
		this.Memory = memory
		this.Memory16 = new class {
			get ( a ) {
				return self.Memory.get (a) | (self.Memory.get ((a + 1).w0).shl8)
			}
			set ( a, v ) {
				self.Memory.set (a, v.b0)
				self.Memory.set ((a + 1).w0, v.b1)
			}
		}
		this.reset (pc)
	}
	reset ( pc = 0 ) {
		this.Halted = 0
		this.IFF = 0
		this.Regs.PC = pc
		this.IO.interrupt (0)
	}
	interrupt () {
		this.Halted = 0
	}
	iff () {
		return this.IFF
	}
	get_byte () {
		return this.Memory.get (this.Regs.PC++)
	}
	get_word () {
		return this.get_byte () | this.get_byte ().shl8
	}
	get MemoryHL () {
		return this.Memory.get (this.Regs.HL)
	}
	set MemoryHL ( v ) {
		return this.Memory.set (this.Regs.HL, v)
	}
	load_reg ( c ) {
		switch (c & 0x07) {
			case 0: return this.Regs.B
			case 1: return this.Regs.C
			case 2: return this.Regs.D
			case 3: return this.Regs.E
			case 4: return this.Regs.H
			case 5: return this.Regs.L
			case 6: return this.MemoryHL
			case 7: return this.Regs.A
		}
	}
	store_reg ( c, v ) {
		switch (c & 0x07) {
			case 0: return this.Regs.B = v
			case 1: return this.Regs.C = v
			case 2: return this.Regs.D = v
			case 3: return this.Regs.E = v
			case 4: return this.Regs.H = v
			case 5: return this.Regs.L = v
			case 6: return this.MemoryHL = v
			case 7: return this.Regs.A = v
		}
	}
	load_reg16 ( c ) {
		switch (c & 0x03) {
			case 0: return this.Regs.BC
			case 1: return this.Regs.DE
			case 2: return this.Regs.HL
			case 3: return c < 12 ? this.Regs.SP : this.Regs.PSW
		}
	}
	store_reg16 ( c, v ) {
		switch (c & 0x03) {
			case 0: return this.Regs.BC = v
			case 1: return this.Regs.DE = v
			case 2: return this.Regs.HL = v
			case 3: return c < 12 ? this.Regs.SP = v : this.Regs.PSW = v
		}
	}
	push ( v ) {
		this.Memory16.set (this.Regs.SP -= 2, v)
	}
	pop () {
		return this.Memory16.get ((this.Regs.SP += 2) - 2)
	}
	add_a ( v, cf = 0 ) {
		let a = this.Regs.A
		let r = a + v + cf
		this.Regs.A = r
		this.Regs.F.SZP0 = this.Regs.A
		this.Regs.F.AC = (a ^ v ^ r) & 0x10
		this.Regs.F.C = r & 0x100
		return a
	}
	sub_a ( v, cf = 0 ) {
		let a = this.Regs.A
		let r = a - v - cf
		this.Regs.A = r
		this.Regs.F.SZP1 = this.Regs.A
		this.Regs.F.AC = !((a ^ v ^ r) & 0x10)
		this.Regs.F.C = r & 0x100
		return a
	}
	and_a ( v ) {
		let a = this.Regs.A
		this.Regs.A &= v
		this.Regs.F.SZP = this.Regs.A
		this.Regs.F.AC = (a | v) & 0x08
		this.Regs.F.C = 0
	}
	xor_a ( v ) {
		this.Regs.A ^= v
		this.Regs.F.SZP = this.Regs.A
		this.Regs.F.AC = 0
		this.Regs.F.C = 0
	}
	or_a ( v ) {
		this.Regs.A |= v
		this.Regs.F.SZP = this.Regs.A
		this.Regs.F.AC = 0
		this.Regs.F.C = 0
	}
	cmp_a ( v ) {
		this.Regs.A = this.sub_a (v)
	}
	flag ( c ) {
		switch (c & 0x07) {
			case 0: return !this.Regs.F.Z
			case 1: return this.Regs.F.Z
			case 2: return !this.Regs.F.C
			case 3: return this.Regs.F.C
			case 4: return !this.Regs.F.P
			case 5: return this.Regs.F.P
			case 6: return !this.Regs.F.S
			case 7: return this.Regs.F.S
		}
	}
	tics ( c ) {
		let tics = this.TICS [c]
		return tics & 0xF000
			? this.flag ((tics >> 12) - 1)
			? (tics & 0x0F) + ((tics >> 4) & 0x0F)
			: tics & 0x0F
			: tics
	}
	exec () {
		if (this.Halted)
			return 0
		let c = this.get_byte ()
		this.TABLE [c].call (this, c)
		return this.tics (c)
	}

	$nop ( c ) {
	}
	$hlt ( c ) {
		this.Halted = 1
		this.IO.halted ()
	}
	$di ( c ) {
		this.IFF = 0
		this.IO.interrupt (0)
	}
	$ei ( c ) {
		this.IFF = 1
		this.IO.interrupt (1)
	}
	$lxi ( c ) {
		this.store_reg16 (c >> 4, this.get_word ())
	}
	$mvi ( c ) {
		this.store_reg (c >> 3, this.get_byte ())
	}
	$mov ( c ) {
		this.store_reg (c >> 3, this.load_reg (c))
	}
	$stax ( c ) {
		this.Memory.set ((c >> 4) == 0 ? this.Regs.BC : this.Regs.DE, this.Regs.A)
	}
	$ldax ( c ) {
		this.Regs.A = this.Memory.get ((c >> 4) == 0 ? this.Regs.BC : this.Regs.DE)
	}
	$sta ( c ) {
		this.Memory.set (this.get_word (), this.Regs.A)
	}
	$lda ( c ) {
		this.Regs.A = this.Memory.get (this.get_word ())
	}
	$shld ( c ) {
		this.Memory16.set (this.get_word (), this.Regs.HL)
	}
	$lhld ( c ) {
		this.Regs.HL = this.Memory16.get (this.get_word ())
	}
	$inx ( c ) {
		return this.store_reg16 (c >> 4, this.load_reg16 (c >> 4) + 1).w0
	}
	$dcx ( c ) {
		return this.store_reg16 (c >> 4, this.load_reg16 (c >> 4) - 1).w0
	}
	$inr ( c ) {
		let r = this.store_reg (c >> 3, this.load_reg (c >> 3) + 1).b0
		this.Regs.F.SZP0 = r
		this.Regs.F.AC = (r & 0x0F) == 0
		return r
	}
	$dcr ( c ) {
		let r = this.store_reg (c >> 3, this.load_reg (c >> 3) - 1).b0
		this.Regs.F.SZP1 = r
		this.Regs.F.AC = (r & 0x0F) != 0x0F
		return r
	}
	$rlc ( c ) {
		this.Regs.F.C = this.Regs.A & 0x80
		this.Regs.A = (this.Regs.A << 1) | this.Regs.F.C
	}
	$rrc ( c ) {
		this.Regs.F.C = this.Regs.A & 0x01
		this.Regs.A = (this.Regs.A >> 1) | (this.Regs.F.C << 7)
	}
	$ral ( c ) {
		let cf = this.Regs.F.C
		this.Regs.F.C = this.Regs.A & 0x80
		this.Regs.A = (this.Regs.A << 1) | cf
	}
	$rar ( c ) {
		let cf = this.Regs.F.C
		this.Regs.F.C = this.Regs.A & 0x01
		this.Regs.A = (this.Regs.A >> 1) | (cf << 7)
	}
	$cma ( c ) {
		this.Regs.A = ~this.Regs.A
	}
	$stc ( c ) {
		this.Regs.F.C = 1
	}
	$cmc ( c ) {
		this.Regs.F.C = !this.Regs.F.C
	}
	$push ( c ) {
		this.push (this.load_reg16 (c >> 4))
	}
	$pop ( c ) {
		this.store_reg16 (c >> 4, this.pop ())
	}
	$rst ( c ) {
		this.push (this.Regs.PC)
		this.Regs.PC = c & 0x38
	}
	$call ( c ) {
		let pc = this.get_word ()
		this.push (this.Regs.PC)
		this.Regs.PC = pc
	}
	$ccc ( c ) {
		if (this.flag (c >> 3))
			this.$call (c)
		else
			this.Regs.PC += 2
	}
	$ret ( c ) {
		this.Regs.PC = this.pop ()
	}
	$rcc ( c ) {
		if (this.flag (c >> 3))
			this.$ret (c)
	}
	$jmp ( c ) {
		this.Regs.PC = this.get_word ()
	}
	$jcc ( c ) {
		if (this.flag (c >> 3))
			this.$jmp (c)
		else
			this.Regs.PC += 2
	}
	$xchg ( c ) {
		[this.Regs.HL, this.Regs.DE] = [this.Regs.DE, this.Regs.HL]
	}
	$xthl ( c ) {
		let hl = this.Regs.HL
		this.Regs.HL = this.Memory16.get (this.Regs.SP)
		this.Memory16.set (this.Regs.SP, hl)
	}
	$pchl ( c ) {
		this.Regs.PC = this.Regs.HL
	}
	$sphl ( c ) {
		this.Regs.SP = this.Regs.HL
	}
	$add ( c ) {
		this.add_a (this.load_reg (c))
	}
	$adi ( c ) {
		this.add_a (this.get_byte ())
	}
	$adc ( c ) {
		this.add_a (this.load_reg (c), this.Regs.F.C)
	}
	$aci ( c ) {
		this.add_a (this.get_byte (), this.Regs.F.C)
	}
	$sub ( c ) {
		this.sub_a (this.load_reg (c))
	}
	$sui ( c ) {
		this.sub_a (this.get_byte ())
	}
	$sbb ( c ) {
		this.sub_a (this.load_reg (c), this.Regs.F.C)
	}
	$sbi ( c ) {
		this.sub_a (this.get_byte (), this.Regs.F.C)
	}
	$ana ( c ) {
		this.and_a (this.load_reg (c))
	}
	$ani ( c ) {
		this.and_a (this.get_byte ())
	}
	$xra ( c ) {
		this.xor_a (this.load_reg (c))
	}
	$xri ( c ) {
		this.xor_a (this.get_byte ())
	}
	$ora ( c ) {
		this.or_a (this.load_reg (c))
	}
	$ori ( c ) {
		this.or_a (this.get_byte ())
	}
	$cmp ( c ) {
		this.cmp_a (this.load_reg (c))
	}
	$cpi ( c ) {
		this.cmp_a (this.get_byte ())
	}
	$dad ( c ) {
		let hl = this.Regs.HL
		this.Regs.HL += this.load_reg16 (c >> 4)
		this.Regs.F.C = this.Regs.HL < hl
		return hl
	}
	$daa ( c ) {
		let a = this.Regs.A
		let cf = this.Regs.F.C || a > 0x9F || ((a >> 4) == 9 && (a & 0x0F) > 9)
		this.add_a ((this.Regs.F.AC || (a & 0x0F) > 9 ? 0x06 : 0) | (cf ? 0x60 : 0))
		this.Regs.F.C = cf
		return a
	}
	$in ( c ) {
		this.Regs.A = this.IO.get (this.get_byte ())
	}
	$out ( c ) {
		this.IO.set (this.get_byte (), this.Regs.A)
	}

	TABLE = [
		this.$nop,  this.$lxi,  this.$stax, this.$inx,  this.$inr,  this.$dcr,  this.$mvi,  this.$rlc,
		this.$nop,  this.$dad,  this.$ldax, this.$dcx,  this.$inr,  this.$dcr,  this.$mvi,  this.$rrc,
		this.$nop,  this.$lxi,  this.$stax, this.$inx,  this.$inr,  this.$dcr,  this.$mvi,  this.$ral,
		this.$nop,  this.$dad,  this.$ldax, this.$dcx,  this.$inr,  this.$dcr,  this.$mvi,  this.$rar,
		this.$nop,  this.$lxi,  this.$shld, this.$inx,  this.$inr,  this.$dcr,  this.$mvi,  this.$daa,
		this.$nop,  this.$dad,  this.$lhld, this.$dcx,  this.$inr,  this.$dcr,  this.$mvi,  this.$cma,
		this.$nop,  this.$lxi,  this.$sta,  this.$inx,  this.$inr,  this.$dcr,  this.$mvi,  this.$stc,
		this.$nop,  this.$dad,  this.$lda,  this.$dcx,  this.$inr,  this.$dcr,  this.$mvi,  this.$cmc,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$hlt,  this.$mov,
		this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,  this.$mov,
		this.$add,  this.$add,  this.$add,  this.$add,  this.$add,  this.$add,  this.$add,  this.$add,
		this.$adc,  this.$adc,  this.$adc,  this.$adc,  this.$adc,  this.$adc,  this.$adc,  this.$adc,
		this.$sub,  this.$sub,  this.$sub,  this.$sub,  this.$sub,  this.$sub,  this.$sub,  this.$sub,
		this.$sbb,  this.$sbb,  this.$sbb,  this.$sbb,  this.$sbb,  this.$sbb,  this.$sbb,  this.$sbb,
		this.$ana,  this.$ana,  this.$ana,  this.$ana,  this.$ana,  this.$ana,  this.$ana,  this.$ana,
		this.$xra,  this.$xra,  this.$xra,  this.$xra,  this.$xra,  this.$xra,  this.$xra,  this.$xra,
		this.$ora,  this.$ora,  this.$ora,  this.$ora,  this.$ora,  this.$ora,  this.$ora,  this.$ora,
		this.$cmp,  this.$cmp,  this.$cmp,  this.$cmp,  this.$cmp,  this.$cmp,  this.$cmp,  this.$cmp,
		this.$rcc,  this.$pop,  this.$jcc,  this.$jmp,  this.$ccc,  this.$push, this.$adi,  this.$rst,
		this.$rcc,  this.$ret,  this.$jcc,  this.$jmp,  this.$ccc,  this.$call, this.$aci,  this.$rst,
		this.$rcc,  this.$pop,  this.$jcc,  this.$out,  this.$ccc,  this.$push, this.$sui,  this.$rst,
		this.$rcc,  this.$ret,  this.$jcc,  this.$in,   this.$ccc,  this.$call, this.$sbi,  this.$rst,
		this.$rcc,  this.$pop,  this.$jcc,  this.$xthl, this.$ccc,  this.$push, this.$ani,  this.$rst,
		this.$rcc,  this.$pchl, this.$jcc,  this.$xchg, this.$ccc,  this.$call, this.$xri,  this.$rst,
		this.$rcc,  this.$pop,  this.$jcc,  this.$di,   this.$ccc,  this.$push, this.$ori,  this.$rst,
		this.$rcc,  this.$sphl, this.$jcc,  this.$ei,   this.$ccc,  this.$call, this.$cpi,  this.$rst
	]
	TICS = [
		4,	10,	7,	5,	5,	5,	7,	4,
		4,	10,	7,	5,	5,	5,	7,	4,
		4,	10,	7,	5,	5,	5,	7,	4,
		4,	10,	7,	5,	5,	5,	7,	4,
		4,	10,	16,	5,	5,	5,	7,	4,
		4,	10,	16,	5,	5,	5,	7,	4,
		4,	10,	13,	5,	10,	10,	10,	4,
		4,	10,	13,	5,	5,	5,	7,	4,
		5,	5,	5,	5,	5,	5,	7,	5,
		5,	5,	5,	5,	5,	5,	7,	5,
		5,	5,	5,	5,	5,	5,	7,	5,
		5,	5,	5,	5,	5,	5,	7,	5,
		5,	5,	5,	5,	5,	5,	7,	5,
		5,	5,	5,	5,	5,	5,	7,	5,
		7,	7,	7,	7,	7,	7,	7,	7,
		5,	5,	5,	5,	5,	5,	7,	5,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		0x1065,	10,	10,	10,	0x106B,	11,	7,	11,
		0x2065,	10,	10,	10,	0x206B,	17,	7,	11,
		0x3065,	10,	10,	10,	0x306B,	11,	7,	11,
		0x4065,	10,	10,	10,	0x406B,	17,	7,	11,
		0x5065,	10,	10,	18,	0x506B,	11,	7,	11,
		0x6065,	5,	10,	4,	0x606B,	17,	7,	11,
		0x7065,	10,	10,	4,	0x706B,	11,	7,	11,
		0x8065,	5,	10,	4,	0x806B,	17,	7,	11
	]

	NAME = "8080"
}

class august_cpu_8085 extends august_cpu_8080 {
	constructor ( memory, io, pc = 0 ) {
		super (memory, io, pc, august_cpu_8085.flags)
		this.TABLE [0x08] = this.$dsub
		this.TABLE [0x10] = this.$arhl
		this.TABLE [0x18] = this.$rlde
		this.TABLE [0x20] = this.$rim
		this.TABLE [0x28] = this.$ldhi
		this.TABLE [0x30] = this.$sim
		this.TABLE [0x38] = this.$ldsi
		this.TABLE [0xCB] = this.$rstv
		this.TABLE [0xD9] = this.$shlx
		this.TABLE [0xDD] = this.$jnk
		this.TABLE [0xED] = this.$lhlx
		this.TABLE [0xFD] = this.$jk
	}
	add_a ( v, cf = 0 ) {
		let a = super.add_a (v, cf)
		this.Regs.F.KV = this.Regs.F.overflow (this.Regs.A, a, ~v)
		return a
	}
	sub_a ( v, cf = 0 ) {
		let a = super.sub_a (v, cf)
		this.Regs.F.KV = this.Regs.F.overflow (this.Regs.A, a, v)
		return a
	}
	and_a ( v ) {
		super.and_a (v)
		this.Regs.F.KV = 0
	}
	xor_a ( v ) {
		super.xor_a (v)
		this.Regs.F.KV = 0
	}
	or_a ( v ) {
		super.or_a (v)
		this.Regs.F.KV = 0
	}
	flag ( c ) {
		switch (c) {
			case 8: return !this.Regs.F.K
			case 9: return this.Regs.F.K
			case 10: return !this.Regs.F.V
			case 11: return this.Regs.F.V
		}
		return super.flag (c)
	}

	$rim ( c ) {
	}
	$sim ( c ) {
	}
	$inx ( c ) {
		let r = super.$inx (c)
		//  KV ???
		this.Regs.F.K = r == 0x0000
		this.Regs.F.V = r == 0x8000
	}
	$dcx ( c ) {
		let r = super.$dcx (c)
		//  KV ???
		this.Regs.F.K = r == 0xFFFF
		this.Regs.F.V = r == 0x7FFF
	}
	$inr ( c ) {
		this.Regs.F.KV = super.$inr (c) == 0x80
	}
	$dcr ( c ) {
		this.Regs.F.KV = super.$dcr (c) == 0x7F
	}
	$rlc ( c ) {
		super.$rlc (c)
		//  KV ???
		this.Regs.F.KV = this.Regs.F.C ^ (this.Regs.A >> 7)
	}
	$rrc ( c ) {
		super.$rrc (c)
		this.Regs.F.V = 0
	}
	$ral ( c ) {
		super.$ral (c)
		//  KV ???
		this.Regs.F.KV = this.Regs.F.C ^ (this.Regs.A >> 7)
	}
	$rar ( c ) {
		super.$rar (c)
		this.Regs.F.V = 0
	}
	$arhl ( c ) {
		this.Regs.F.V = 0
		this.Regs.F.C = this.Regs.HL & 0x01
		this.Regs.HL = (this.Regs.HL >> 1) | (this.Regs.HL & 0x8000)
	}
	$rlde ( c ) {
		let de = this.Regs.DE
		this.Regs.DE = (this.Regs.DE << 1) | this.Regs.F.C
		this.Regs.F.C = de & 0x8000
		//  KV ???
		this.Regs.F.KV = this.Regs.F.C ^ (this.Regs.D >> 7)
	}
	$ldhi ( c ) {
		this.Regs.DE = this.Regs.HL + this.get_byte ()
	}
	$ldsi ( c ) {
		this.Regs.DE = this.Regs.SP + this.get_byte ()
	}
	$shlx ( c ) {
		this.Memory16.set (this.Regs.DE, this.Regs.HL)
	}
	$lhlx ( c ) {
		this.Regs.HL = this.Memory16.get (this.Regs.DE)
	}
	$dsub ( c ) {
		let hl = this.Regs.HL
		this.Regs.HL -= this.Regs.BC
		this.Regs.F.SZP = this.Regs.H
		this.Regs.F.KV = this.Regs.F.overflow (this.Regs.H, hl.b1, this.Regs.B)
		this.Regs.F.AC = !((hl ^ this.Regs.BC ^ this.Regs.HL) & 0x1000)
		this.Regs.F.C = hl < this.Regs.BC
	}
	$dad ( c ) {
		let hl = super.$dad (c)
		this.Regs.F.KV = this.Regs.F.overflow (this.Regs.HL.b1, hl.b1 , ~(this.Regs.HL - hl).b1)
		return hl
	}
	$daa ( c ) {
		let a = super.$daa (c)
		this.Regs.F.KV = (a & 0xF0) == 0x70 && (this.Regs.A & 0xF0) == 0x80
		return a
	}
	$rstv ( c ) {
		if (this.Regs.F.V) {
			this.push (this.Regs.PC)
			this.Regs.PC = 0x40
		}
	}
	$jnk ( c ) {
		if (!this.Regs.F.K)
			this.$jmp (c)
		else
			this.Regs.PC += 2
	}
	$jk ( c ) {
		if (this.Regs.F.K)
			this.$jmp (c)
		else
			this.Regs.PC += 2
	}

	static flags = class extends august_regs_8080.flags {
		value ( v )	{ return v & 0b11110111 }

		get K ()	{ return +!!(this.$ & 0x20) }
		get V ()	{ return +!!(this.$ & 0x02) }

		set K ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x20 }
		set V ( f )	{ this.$ ^= (this.$ ^ -!!f) & 0x02 }
		set KV ( f )	{ this.V = f; this.K = this.V ^ this.S }
	}

	TICS = [
		4,	10,	7,	6,	4,	4,	7,	4,
		10,	10,	7,	6,	4,	4,	7,	4,
		7,	10,	7,	6,	4,	4,	7,	4,
		10,	10,	7,	6,	4,	4,	7,	4,
		4,	10,	16,	6,	4,	4,	7,	4,
		10,	10,	16,	6,	4,	4,	7,	4,
		4,	10,	13,	6,	10,	10,	10,	4,
		10,	10,	13,	6,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		7,	7,	7,	7,	7,	7,	5,	7,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		4,	4,	4,	4,	4,	4,	7,	4,
		0x1066,	10,	0x1037,	10,	0x1099,	12,	7,	12,
		0x2066,	10,	0x2037,	0xC066,	0x2099,	18,	7,	12,
		0x3066,	10,	0x3037,	10,	0x3099,	12,	7,	12,
		0x4066,	10,	0x4037,	10,	0x4099,	0x9037,	7,	12,
		0x5066,	10,	0x5037,	16,	0x5099,	12,	7,	12,
		0x6066,	6,	0x6037,	4,	0x6099,	10,	7,	12,
		0x7066,	10,	0x7037,	4,	0x7099,	12,	7,	12,
		0x8066,	6,	0x8037,	4,	0x8099,	0xA037,	7,	12
	]

	NAME = "8085"
}

