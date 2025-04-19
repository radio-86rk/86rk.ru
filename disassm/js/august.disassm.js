//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.disassm.js


"use strict"

class august_disassm {
	constructor () {
		for (let cfg of ["LBL", "DIR"]) {
			for (let [k, v] of Object.entries (august_disassm.DEF_CFG [cfg]))
				this.CFG [cfg].extend ({ [k]: august_disassm.cfg_val (v) })
		}

		let m = new Enum (... this.MNEMO_8080)
		let r8 = new Enum (... this.REG8_8080)
		let r16 = new Enum (... this.REG16_8080)
		let op = this.OP
		let a = august_disassm.ATTR
		this.TABLE_8080 = [
			{ m: m.NOP, op: op.NONE },			{ m: m.LXI, op: op.R16_IM16 | r16.B },
			{ m: m.STAX, op: op.R16 | r16.B },		{ m: m.INX, op: op.R16 | r16.B },
			{ m: m.INR, op: op.R8 | r8.B },			{ m: m.DCR, op: op.R8 | r8.B },
			{ m: m.MVI, op: op.R8_IM8 | r8.B },		{ m: m.RLC, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.DSUB, op: op.NONE, a: a.UNDOC } },
			{ m: m.DAD, op: op.R16 | r16.B },
			{ m: m.LDAX, op: op.R16 | r16.B },		{ m: m.DCX, op: op.R16 | r16.B },
			{ m: m.INR, op: op.R8 | r8.C },			{ m: m.DCR, op: op.R8 | r8.C },
			{ m: m.MVI, op: op.R8_IM8 | r8.C },		{ m: m.RRC, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.ARHL, op: op.NONE, a: a.UNDOC } },
			{ m: m.LXI, op: op.R16_IM16 | r16.D },
			{ m: m.STAX, op: op.R16 | r16.D },		{ m: m.INX, op: op.R16 | r16.D },
			{ m: m.INR, op: op.R8 | r8.D },			{ m: m.DCR, op: op.R8 | r8.D },
			{ m: m.MVI, op: op.R8_IM8 | r8.D },		{ m: m.RAL, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.RLDE, op: op.NONE, a: a.UNDOC } },
			{ m: m.DAD, op: op.R16 | r16.D },
			{ m: m.LDAX, op: op.R16 | r16.D },		{ m: m.DCX, op: op.R16 | r16.D },
			{ m: m.INR, op: op.R8 | r8.E },			{ m: m.DCR, op: op.R8 | r8.E },
			{ m: m.MVI, op: op.R8_IM8 | r8.E },		{ m: m.RAR, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.RIM, op: op.NONE } },
			{ m: m.LXI, op: op.R16_IM16 | r16.H },
			{ m: m.SHLD, op: op.ABS, ds: 2 },		{ m: m.INX, op: op.R16 | r16.H },
			{ m: m.INR, op: op.R8 | r8.H },			{ m: m.DCR, op: op.R8 | r8.H },
			{ m: m.MVI, op: op.R8_IM8 | r8.H },		{ m: m.DAA, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.LDHI, op: op.IM8, a: a.UNDOC } },
			{ m: m.DAD, op: op.R16 | r16.H },
			{ m: m.LHLD, op: op.ABS, ds: 2 },		{ m: m.DCX, op: op.R16 | r16.H },
			{ m: m.INR, op: op.R8 | r8.L },			{ m: m.DCR, op: op.R8 | r8.L },
			{ m: m.MVI, op: op.R8_IM8 | r8.L },		{ m: m.CMA, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.SIM, op: op.NONE } },
			{ m: m.LXI, op: op.R16_IM16 | r16.SP },
			{ m: m.STA, op: op.ABS, ds: 1 },		{ m: m.INX, op: op.R16 | r16.SP },
			{ m: m.INR, op: op.R8 | r8.M },			{ m: m.DCR, op: op.R8 | r8.M },
			{ m: m.MVI, op: op.R8_IM8 | r8.M },		{ m: m.STC, op: op.NONE },
			{ m: m.NOP, op: op.NONE, a: a.UNDOC, i8085: { m: m.LDSI, op: op.IM8, a: a.UNDOC } },
			{ m: m.DAD, op: op.R16 | r16.SP },
			{ m: m.LDA, op: op.ABS, ds: 1 },		{ m: m.DCX, op: op.R16 | r16.SP },
			{ m: m.INR, op: op.R8 | r8.A },			{ m: m.DCR, op: op.R8 | r8.A },
			{ m: m.MVI, op: op.R8_IM8 | r8.A },		{ m: m.CMC, op: op.NONE },
			{ m: m.MOV, op: op.R8_R8 | r8.B | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.B | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.B | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.B | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.B | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.B | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.B | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.B | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.C | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.C | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.C | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.C | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.C | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.C | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.C | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.C | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.D | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.D | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.D | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.D | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.D | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.D | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.D | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.D | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.E | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.E | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.E | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.E | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.E | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.E | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.E | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.E | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.H | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.H | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.H | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.H | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.H | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.H | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.H | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.H | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.L | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.L | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.L | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.L | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.L | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.L | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.L | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.L | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.M | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.M | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.M | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.M | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.M | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.M | r8.L._2 },
			{ m: m.HLT, op: op.NONE },			{ m: m.MOV, op: op.R8_R8 | r8.M | r8.A._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.A | r8.B._2 },	{ m: m.MOV, op: op.R8_R8 | r8.A | r8.C._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.A | r8.D._2 },	{ m: m.MOV, op: op.R8_R8 | r8.A | r8.E._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.A | r8.H._2 },	{ m: m.MOV, op: op.R8_R8 | r8.A | r8.L._2 },
			{ m: m.MOV, op: op.R8_R8 | r8.A | r8.M._2 },	{ m: m.MOV, op: op.R8_R8 | r8.A | r8.A._2 },
			{ m: m.ADD, op: op.R8 | r8.B },			{ m: m.ADD, op: op.R8 | r8.C },
			{ m: m.ADD, op: op.R8 | r8.D },			{ m: m.ADD, op: op.R8 | r8.E },
			{ m: m.ADD, op: op.R8 | r8.H },			{ m: m.ADD, op: op.R8 | r8.L },
			{ m: m.ADD, op: op.R8 | r8.M },			{ m: m.ADD, op: op.R8 | r8.A },
			{ m: m.ADC, op: op.R8 | r8.B },			{ m: m.ADC, op: op.R8 | r8.C },
			{ m: m.ADC, op: op.R8 | r8.D },			{ m: m.ADC, op: op.R8 | r8.E },
			{ m: m.ADC, op: op.R8 | r8.H },			{ m: m.ADC, op: op.R8 | r8.L },
			{ m: m.ADC, op: op.R8 | r8.M },			{ m: m.ADC, op: op.R8 | r8.A },
			{ m: m.SUB, op: op.R8 | r8.B },			{ m: m.SUB, op: op.R8 | r8.C },
			{ m: m.SUB, op: op.R8 | r8.D },			{ m: m.SUB, op: op.R8 | r8.E },
			{ m: m.SUB, op: op.R8 | r8.H },			{ m: m.SUB, op: op.R8 | r8.L },
			{ m: m.SUB, op: op.R8 | r8.M },			{ m: m.SUB, op: op.R8 | r8.A },
			{ m: m.SBB, op: op.R8 | r8.B },			{ m: m.SBB, op: op.R8 | r8.C },
			{ m: m.SBB, op: op.R8 | r8.D },			{ m: m.SBB, op: op.R8 | r8.E },
			{ m: m.SBB, op: op.R8 | r8.H },			{ m: m.SBB, op: op.R8 | r8.L },
			{ m: m.SBB, op: op.R8 | r8.M },			{ m: m.SBB, op: op.R8 | r8.A },
			{ m: m.ANA, op: op.R8 | r8.B },			{ m: m.ANA, op: op.R8 | r8.C },
			{ m: m.ANA, op: op.R8 | r8.D },			{ m: m.ANA, op: op.R8 | r8.E },
			{ m: m.ANA, op: op.R8 | r8.H },			{ m: m.ANA, op: op.R8 | r8.L },
			{ m: m.ANA, op: op.R8 | r8.M },			{ m: m.ANA, op: op.R8 | r8.A },
			{ m: m.XRA, op: op.R8 | r8.B },			{ m: m.XRA, op: op.R8 | r8.C },
			{ m: m.XRA, op: op.R8 | r8.D },			{ m: m.XRA, op: op.R8 | r8.E },
			{ m: m.XRA, op: op.R8 | r8.H },			{ m: m.XRA, op: op.R8 | r8.L },
			{ m: m.XRA, op: op.R8 | r8.M },			{ m: m.XRA, op: op.R8 | r8.A },
			{ m: m.ORA, op: op.R8 | r8.B },			{ m: m.ORA, op: op.R8 | r8.C },
			{ m: m.ORA, op: op.R8 | r8.D },			{ m: m.ORA, op: op.R8 | r8.E },
			{ m: m.ORA, op: op.R8 | r8.H },			{ m: m.ORA, op: op.R8 | r8.L },
			{ m: m.ORA, op: op.R8 | r8.M },			{ m: m.ORA, op: op.R8 | r8.A },
			{ m: m.CMP, op: op.R8 | r8.B },			{ m: m.CMP, op: op.R8 | r8.C },
			{ m: m.CMP, op: op.R8 | r8.D },			{ m: m.CMP, op: op.R8 | r8.E },
			{ m: m.CMP, op: op.R8 | r8.H },			{ m: m.CMP, op: op.R8 | r8.L },
			{ m: m.CMP, op: op.R8 | r8.M },			{ m: m.CMP, op: op.R8 | r8.A },
			{ m: m.RNZ, op: op.NONE },			{ m: m.POP, op: op.R16 | r16.B },
			{ m: m.JNZ, op: op.ADDR },			{ m: m.JMP, op: op.ADDR, a: a.END },
			{ m: m.CNZ, op: op.ADDR, a: a.SUB },		{ m: m.PUSH, op: op.R16 | r16.B },
			{ m: m.ADI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 0 },
			{ m: m.RZ, op: op.NONE },			{ m: m.RET, op: op.NONE, a: a.END },
			{ m: m.JZ, op: op.ADDR },			{ m: m.JMP, op: op.ADDR, a: a.END | a.UNDOC, i8085: { m: m.RSTV, op: op.NONE, a: a.UNDOC } },
			{ m: m.CZ, op: op.ADDR, a: a.SUB },		{ m: m.CALL, op: op.ADDR, a: a.SUB },
			{ m: m.ACI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 1 },
			{ m: m.RNC, op: op.NONE },			{ m: m.POP, op: op.R16 | r16.D },
			{ m: m.JNC, op: op.ADDR },			{ m: m.OUT, op: op.IM8 },
			{ m: m.CNC, op: op.ADDR, a: a.SUB },		{ m: m.PUSH, op: op.R16 | r16.D },
			{ m: m.SUI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 2 },
			{ m: m.RC, op: op.NONE },			{ m: m.RET, op: op.NONE, a: a.END | a.UNDOC, i8085: { m: m.SHLX, op: op.NONE, a: a.UNDOC } },
			{ m: m.JC, op: op.ADDR },			{ m: m.IN, op: op.IM8 },
			{ m: m.CC, op: op.ADDR, a: a.SUB },		{ m: m.CALL, op: op.ADDR, a: a.SUB | a.UNDOC, i8085: { m: m.JNK, op: op.ADDR, a: a.UNDOC } },
			{ m: m.SBI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 3 },
			{ m: m.RPO, op: op.NONE },			{ m: m.POP, op: op.R16 | r16.H },
			{ m: m.JPO, op: op.ADDR },			{ m: m.XTHL, op: op.NONE },
			{ m: m.CPO, op: op.ADDR, a: a.SUB },		{ m: m.PUSH, op: op.R16 | r16.H },
			{ m: m.ANI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 4 },
			{ m: m.RPE, op: op.NONE },			{ m: m.PCHL, op: op.NONE, a: a.END },
			{ m: m.JPE, op: op.ADDR },			{ m: m.XCHG, op: op.NONE },
			{ m: m.CPE, op: op.ADDR, a: a.SUB },		{ m: m.CALL, op: op.ADDR, a: a.SUB | a.UNDOC, i8085: { m: m.LHLX, op: op.NONE, a: a.UNDOC } },
			{ m: m.XRI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 5 },
			{ m: m.RP, op: op.NONE },			{ m: m.POP, op: op.R16 | r16.PSW },
			{ m: m.JP, op: op.ADDR },			{ m: m.DI, op: op.NONE },
			{ m: m.CP, op: op.ADDR, a: a.SUB },		{ m: m.PUSH, op: op.R16 | r16.PSW },
			{ m: m.ORI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 6 },
			{ m: m.RM, op: op.NONE },			{ m: m.SPHL, op: op.NONE },
			{ m: m.JM, op: op.ADDR },			{ m: m.EI, op: op.NONE },
			{ m: m.CM, op: op.ADDR, a: a.SUB },		{ m: m.CALL, op: op.ADDR, a: a.SUB | a.UNDOC, i8085: { m: m.JK, op: op.ADDR, a: a.UNDOC } },
			{ m: m.CPI, op: op.IM8 },			{ m: m.RST, op: op.N_ADDR | 7 }
		]

		let cc = new Enum (... this.CC)
		m = new Enum (... this.MNEMO_Z80)
		r8 = new Enum (... this.REG8_Z80)
		r16 = new Enum (... this.REG16_Z80)
		r16.AFH = r16 ["AF'"]
		this.TABLE_Z80 = [
			{ m: m.NOP, op: op.NONE },			{ m: m.LD, op: op.R16_IM16 | r16.BC },
			{ m: m.LD, op: op.IND_R8 | r16.BC | r8.A._2 },	{ m: m.INC, op: op.R16 | r16.BC },
			{ m: m.INC, op: op.R8 | r8.B },			{ m: m.DEC, op: op.R8 | r8.B },
			{ m: m.LD, op: op.R8_IM8 | r8.B },		{ m: m.RLCA, op: op.NONE },
			{ m: m.EX, op: op.R16_R16 | r16.AF | r16.AFH._2 },{ m: m.ADD, op: op.R16_R16 | r16.HL | r16.BC._2 },
			{ m: m.LD, op: op.R8_IND | r8.A | r16.BC._2 },	{ m: m.DEC, op: op.R16 | r16.BC },
			{ m: m.INC, op: op.R8 | r8.C },			{ m: m.DEC, op: op.R8 | r8.C },
			{ m: m.LD, op: op.R8_IM8 | r8.C },		{ m: m.RRCA, op: op.NONE },
			{ m: m.DJNZ, op: op.DISP },			{ m: m.LD, op: op.R16_IM16 | r16.DE },
			{ m: m.LD, op: op.IND_R8 | r16.DE | r8.A._2 },	{ m: m.INC, op: op.R16 | r16.DE },
			{ m: m.INC, op: op.R8 | r8.D },			{ m: m.DEC, op: op.R8 | r8.D },
			{ m: m.LD, op: op.R8_IM8 | r8.D },		{ m: m.RLA, op: op.NONE },
			{ m: m.JR, op: op.DISP },			{ m: m.ADD, op: op.R16_R16 | r16.HL | r16.DE._2 },
			{ m: m.LD, op: op.R8_IND | r8.A | r16.DE._2 },	{ m: m.DEC, op: op.R16 | r16.DE },
			{ m: m.INC, op: op.R8 | r8.E },			{ m: m.DEC, op: op.R8 | r8.E },
			{ m: m.LD, op: op.R8_IM8 | r8.E },		{ m: m.RRA, op: op.NONE },
			{ m: m.JR, op: op.CC_DISP | cc.NZ },		{ m: m.LD, op: op.R16_IM16 | r16.HL },
			{ m: m.LD, op: op.ABS16_R16 | r16.HL, ds: 2 },	{ m: m.INC, op: op.R16 | r16.HL },
			{ m: m.INC, op: op.R8 | r8.H },			{ m: m.DEC, op: op.R8 | r8.H },
			{ m: m.LD, op: op.R8_IM8 | r8.H },		{ m: m.DAA, op: op.NONE },
			{ m: m.JR, op: op.CC_DISP | cc.Z },		{ m: m.ADD, op: op.R16_R16 | r16.HL | r16.HL._2 },
			{ m: m.LD, op: op.R16_ABS16 | r16.HL, ds: 2 },	{ m: m.DEC, op: op.R16 | r16.HL },
			{ m: m.INC, op: op.R8 | r8.L },			{ m: m.DEC, op: op.R8 | r8.L },
			{ m: m.LD, op: op.R8_IM8 | r8.L },		{ m: m.CPL, op: op.NONE },
			{ m: m.JR, op: op.CC_DISP | cc.NC },		{ m: m.LD, op: op.R16_IM16 | r16.SP },
			{ m: m.LD, op: op.ABS16_R8 | r8.A, ds: 1 },	{ m: m.INC, op: op.R16 | r16.SP },
			{ m: m.INC, op: op.IND | r16.HL },		{ m: m.DEC, op: op.IND | r16.HL },
			{ m: m.LD, op: op.IND_IM8 | r16.HL },		{ m: m.SCF, op: op.NONE },
			{ m: m.JR, op: op.CC_DISP | cc.C },		{ m: m.ADD, op: op.R16_R16 | r16.HL | r16.SP._2 },
			{ m: m.LD, op: op.R8_ABS16 | r8.A, ds: 1 },	{ m: m.DEC, op: op.R16 | r16.SP },
			{ m: m.INC, op: op.R8 | r8.A },			{ m: m.DEC, op: op.R8 | r8.A },
			{ m: m.LD, op: op.R8_IM8 | r8.A },		{ m: m.CCF, op: op.NONE },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.B | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.B | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.B | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.B | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.B | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.C | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.C | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.C | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.C | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.C | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.D | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.D | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.D | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.D | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.D | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.E | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.E | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.E | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.E | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.E | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.H | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.H | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.H | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.H | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.H | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.H | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.H | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.H | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.L | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.L | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.L | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.L | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.L | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.L | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.L | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.L | r8.A._2 },
			{ m: m.LD, op: op.IND_R8 | r16.HL | r8.B._2 },	{ m: m.LD, op: op.IND_R8 | r16.HL | r8.C._2 },
			{ m: m.LD, op: op.IND_R8 | r16.HL | r8.D._2 },	{ m: m.LD, op: op.IND_R8 | r16.HL | r8.E._2 },
			{ m: m.LD, op: op.IND_R8 | r16.HL | r8.H._2 },	{ m: m.LD, op: op.IND_R8 | r16.HL | r8.L._2 },
			{ m: m.HALT, op: op.NONE },			{ m: m.LD, op: op.IND_R8 | r16.HL | r8.A._2 },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.B._2 },	{ m: m.LD, op: op.R8_R8 | r8.A | r8.C._2 },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.D._2 },	{ m: m.LD, op: op.R8_R8 | r8.A | r8.E._2 },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.H._2 },	{ m: m.LD, op: op.R8_R8 | r8.A | r8.L._2 },
			{ m: m.LD, op: op.R8_IND | r8.A | r16.HL._2 },	{ m: m.LD, op: op.R8_R8 | r8.A | r8.A._2 },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.B._2 },	{ m: m.ADD, op: op.R8_R8 | r8.A | r8.C._2 },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.D._2 },	{ m: m.ADD, op: op.R8_R8 | r8.A | r8.E._2 },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.H._2 },	{ m: m.ADD, op: op.R8_R8 | r8.A | r8.L._2 },
			{ m: m.ADD, op: op.R8_IND | r8.A | r16.HL._2 },	{ m: m.ADD, op: op.R8_R8 | r8.A | r8.A._2 },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.B._2 },	{ m: m.ADC, op: op.R8_R8 | r8.A | r8.C._2 },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.D._2 },	{ m: m.ADC, op: op.R8_R8 | r8.A | r8.E._2 },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.H._2 },	{ m: m.ADC, op: op.R8_R8 | r8.A | r8.L._2 },
			{ m: m.ADC, op: op.R8_IND | r8.A | r16.HL._2 },	{ m: m.ADC, op: op.R8_R8 | r8.A | r8.A._2 },
			{ m: m.SUB, op: op.R8 | r8.B },			{ m: m.SUB, op: op.R8 | r8.C },
			{ m: m.SUB, op: op.R8 | r8.D },			{ m: m.SUB, op: op.R8 | r8.E },
			{ m: m.SUB, op: op.R8 | r8.H },			{ m: m.SUB, op: op.R8 | r8.L },
			{ m: m.SUB, op: op.IND | r16.HL },		{ m: m.SUB, op: op.R8 | r8.A },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.B._2 },	{ m: m.SBC, op: op.R8_R8 | r8.A | r8.C._2 },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.D._2 },	{ m: m.SBC, op: op.R8_R8 | r8.A | r8.E._2 },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.H._2 },	{ m: m.SBC, op: op.R8_R8 | r8.A | r8.L._2 },
			{ m: m.SBC, op: op.R8_IND | r8.A | r16.HL._2 },	{ m: m.SBC, op: op.R8_R8 | r8.A | r8.A._2 },
			{ m: m.AND, op: op.R8 | r8.B },			{ m: m.AND, op: op.R8 | r8.C },
			{ m: m.AND, op: op.R8 | r8.D },			{ m: m.AND, op: op.R8 | r8.E },
			{ m: m.AND, op: op.R8 | r8.H },			{ m: m.AND, op: op.R8 | r8.L },
			{ m: m.AND, op: op.IND | r16.HL },		{ m: m.AND, op: op.R8 | r8.A },
			{ m: m.XOR, op: op.R8 | r8.B },			{ m: m.XOR, op: op.R8 | r8.C },
			{ m: m.XOR, op: op.R8 | r8.D },			{ m: m.XOR, op: op.R8 | r8.E },
			{ m: m.XOR, op: op.R8 | r8.H },			{ m: m.XOR, op: op.R8 | r8.L },
			{ m: m.XOR, op: op.IND | r16.HL },		{ m: m.XOR, op: op.R8 | r8.A },
			{ m: m.OR, op: op.R8 | r8.B },			{ m: m.OR, op: op.R8 | r8.C },
			{ m: m.OR, op: op.R8 | r8.D },			{ m: m.OR, op: op.R8 | r8.E },
			{ m: m.OR, op: op.R8 | r8.H },			{ m: m.OR, op: op.R8 | r8.L },
			{ m: m.OR, op: op.IND | r16.HL },		{ m: m.OR, op: op.R8 | r8.A },
			{ m: m.CP, op: op.R8 | r8.B },			{ m: m.CP, op: op.R8 | r8.C },
			{ m: m.CP, op: op.R8 | r8.D },			{ m: m.CP, op: op.R8 | r8.E },
			{ m: m.CP, op: op.R8 | r8.H },			{ m: m.CP, op: op.R8 | r8.L },
			{ m: m.CP, op: op.IND | r16.HL },		{ m: m.CP, op: op.R8 | r8.A },
			{ m: m.RET, op: op.CC | cc.NZ },		{ m: m.POP, op: op.R16 | r16.BC },
			{ m: m.JP, op: op.CC_ADDR | cc.NZ },		{ m: m.JP, op: op.ADDR, a: a.END },
			{ m: m.CALL, op: op.CC_ADDR | cc.NZ, a: a.SUB },{ m: m.PUSH, op: op.R16 | r16.BC },
			{ m: m.ADD, op: op.R8_IM8 | r8.A },		{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.Z },			{ m: m.RET, op: op.NONE, a: a.END },
			{ m: m.JP, op: op.CC_ADDR | cc.Z },		{ op: op.TAB, tab: "TABLE_Z80_CB" },
			{ m: m.CALL, op: op.CC_ADDR | cc.Z, a: a.SUB },	{ m: m.CALL, op: op.ADDR, a: a.SUB },
			{ m: m.ADC, op: op.R8_IM8 | r8.A },		{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.NC },		{ m: m.POP, op: op.R16 | r16.DE },
			{ m: m.JP, op: op.CC_ADDR | cc.NC },		{ m: m.OUT, op: op.ABS8_R8 | r8.A },
			{ m: m.CALL, op: op.CC_ADDR | cc.NC, a: a.SUB },{ m: m.PUSH, op: op.R16 | r16.DE },
			{ m: m.SUB, op: op.IM8 },			{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.C },			{ m: m.EXX, op: op.NONE },
			{ m: m.JP, op: op.CC_ADDR | cc.C },		{ m: m.IN, op: op.R8_ABS8 | r8.A },
			{ m: m.CALL, op: op.CC_ADDR | cc.C, a: a.SUB },	{ op: op.TAB, tab: "TABLE_Z80_DD" },
			{ m: m.SBC, op: op.R8_IM8 | r8.A },		{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.PO },		{ m: m.POP, op: op.R16 | r16.HL },
			{ m: m.JP, op: op.CC_ADDR | cc.PO },		{ m: m.EX, op: op.IND_R16 | r16.SP | r16.HL._2 },
			{ m: m.CALL, op: op.CC_ADDR | cc.PO, a: a.SUB },{ m: m.PUSH, op: op.R16 | r16.HL },
			{ m: m.AND, op: op.IM8 },			{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.PE },		{ m: m.JP, op: op.IND | r16.HL },
			{ m: m.JP, op: op.CC_ADDR | cc.PE },		{ m: m.EX, op: op.R16_R16 | r16.DE | r16.HL._2 },
			{ m: m.CALL, op: op.CC_ADDR | cc.PE, a: a.SUB },{ op: op.TAB, tab: "TABLE_Z80_ED" },
			{ m: m.XOR, op: op.IM8 },			{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.P },			{ m: m.POP, op: op.R16 | r16.AF },
			{ m: m.JP, op: op.CC_ADDR | cc.P },		{ m: m.DI, op: op.NONE },
			{ m: m.CALL, op: op.CC_ADDR | cc.P, a: a.SUB },	{ m: m.PUSH, op: op.R16 | r16.AF },
			{ m: m.OR, op: op.IM8 },			{ m: m.RST, op: op.RST_ADDR },
			{ m: m.RET, op: op.CC | cc.M },			{ m: m.LD, op: op.R16_R16 | r16.SP | r16.HL._2 },
			{ m: m.JP, op: op.CC_ADDR | cc.M },		{ m: m.EI, op: op.NONE },
			{ m: m.CALL, op: op.CC_ADDR | cc.M, a: a.SUB },	{ op: op.TAB, tab: "TABLE_Z80_FD" },
			{ m: m.CP, op: op.IM8 },			{ m: m.RST, op: op.RST_ADDR }
		]
		this.TABLE_Z80_CB = [
			{ m: m.RLC, op: op.R8 | r8.B },			{ m: m.RLC, op: op.R8 | r8.C },
			{ m: m.RLC, op: op.R8 | r8.D },			{ m: m.RLC, op: op.R8 | r8.E },
			{ m: m.RLC, op: op.R8 | r8.H },			{ m: m.RLC, op: op.R8 | r8.L },
			{ m: m.RLC, op: op.IND | r16.HL },		{ m: m.RLC, op: op.R8 | r8.A },
			{ m: m.RRC, op: op.R8 | r8.B },			{ m: m.RRC, op: op.R8 | r8.C },
			{ m: m.RRC, op: op.R8 | r8.D },			{ m: m.RRC, op: op.R8 | r8.E },
			{ m: m.RRC, op: op.R8 | r8.H },			{ m: m.RRC, op: op.R8 | r8.L },
			{ m: m.RRC, op: op.IND | r16.HL },		{ m: m.RRC, op: op.R8 | r8.A },
			{ m: m.RL, op: op.R8 | r8.B },			{ m: m.RL, op: op.R8 | r8.C },
			{ m: m.RL, op: op.R8 | r8.D },			{ m: m.RL, op: op.R8 | r8.E },
			{ m: m.RL, op: op.R8 | r8.H },			{ m: m.RL, op: op.R8 | r8.L },
			{ m: m.RL, op: op.IND | r16.HL },		{ m: m.RL, op: op.R8 | r8.A },
			{ m: m.RR, op: op.R8 | r8.B },			{ m: m.RR, op: op.R8 | r8.C },
			{ m: m.RR, op: op.R8 | r8.D },			{ m: m.RR, op: op.R8 | r8.E },
			{ m: m.RR, op: op.R8 | r8.H },			{ m: m.RR, op: op.R8 | r8.L },
			{ m: m.RR, op: op.IND | r16.HL },		{ m: m.RR, op: op.R8 | r8.A },
			{ m: m.SLA, op: op.R8 | r8.B },			{ m: m.SLA, op: op.R8 | r8.C },
			{ m: m.SLA, op: op.R8 | r8.D },			{ m: m.SLA, op: op.R8 | r8.E },
			{ m: m.SLA, op: op.R8 | r8.H },			{ m: m.SLA, op: op.R8 | r8.L },
			{ m: m.SLA, op: op.IND | r16.HL },		{ m: m.SLA, op: op.R8 | r8.A },
			{ m: m.SRA, op: op.R8 | r8.B },			{ m: m.SRA, op: op.R8 | r8.C },
			{ m: m.SRA, op: op.R8 | r8.D },			{ m: m.SRA, op: op.R8 | r8.E },
			{ m: m.SRA, op: op.R8 | r8.H },			{ m: m.SRA, op: op.R8 | r8.L },
			{ m: m.SRA, op: op.IND | r16.HL },		{ m: m.SRA, op: op.R8 | r8.A },
			{ m: m.SLL, op: op.R8 | r8.B, a: a.UNDOC },	{ m: m.SLL, op: op.R8 | r8.C, a: a.UNDOC },
			{ m: m.SLL, op: op.R8 | r8.D, a: a.UNDOC },	{ m: m.SLL, op: op.R8 | r8.E, a: a.UNDOC },
			{ m: m.SLL, op: op.R8 | r8.H, a: a.UNDOC },	{ m: m.SLL, op: op.R8 | r8.L, a: a.UNDOC },
			{ m: m.SLL, op: op.IND | r16.HL, a: a.UNDOC },	{ m: m.SLL, op: op.R8 | r8.A, a: a.UNDOC },
			{ m: m.SRL, op: op.R8 | r8.B },			{ m: m.SRL, op: op.R8 | r8.C },
			{ m: m.SRL, op: op.R8 | r8.D },			{ m: m.SRL, op: op.R8 | r8.E },
			{ m: m.SRL, op: op.R8 | r8.H },			{ m: m.SRL, op: op.R8 | r8.L },
			{ m: m.SRL, op: op.IND | r16.HL },		{ m: m.SRL, op: op.R8 | r8.A },
			{ m: m.BIT, op: op.N_R8 | 0 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 0 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 0 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 0 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 0 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 0 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 0 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 0 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 1 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 1 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 1 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 1 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 1 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 1 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 1 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 1 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 2 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 2 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 2 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 2 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 2 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 2 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 2 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 2 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 3 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 3 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 3 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 3 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 3 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 3 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 3 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 3 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 4 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 4 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 4 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 4 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 4 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 4 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 4 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 4 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 5 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 5 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 5 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 5 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 5 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 5 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 5 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 5 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 6 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 6 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 6 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 6 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 6 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 6 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 6 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 6 | r8.A._2 },
			{ m: m.BIT, op: op.N_R8 | 7 | r8.B._2 },	{ m: m.BIT, op: op.N_R8 | 7 | r8.C._2 },
			{ m: m.BIT, op: op.N_R8 | 7 | r8.D._2 },	{ m: m.BIT, op: op.N_R8 | 7 | r8.E._2 },
			{ m: m.BIT, op: op.N_R8 | 7 | r8.H._2 },	{ m: m.BIT, op: op.N_R8 | 7 | r8.L._2 },
			{ m: m.BIT, op: op.N_IND | 7 | r16.HL._2 },	{ m: m.BIT, op: op.N_R8 | 7 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 0 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 0 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 0 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 0 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 0 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 0 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 0 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 0 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 1 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 1 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 1 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 1 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 1 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 1 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 1 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 1 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 2 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 2 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 2 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 2 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 2 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 2 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 2 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 2 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 3 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 3 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 3 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 3 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 3 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 3 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 3 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 3 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 4 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 4 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 4 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 4 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 4 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 4 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 4 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 4 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 5 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 5 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 5 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 5 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 5 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 5 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 5 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 5 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 6 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 6 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 6 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 6 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 6 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 6 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 6 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 6 | r8.A._2 },
			{ m: m.RES, op: op.N_R8 | 7 | r8.B._2 },	{ m: m.RES, op: op.N_R8 | 7 | r8.C._2 },
			{ m: m.RES, op: op.N_R8 | 7 | r8.D._2 },	{ m: m.RES, op: op.N_R8 | 7 | r8.E._2 },
			{ m: m.RES, op: op.N_R8 | 7 | r8.H._2 },	{ m: m.RES, op: op.N_R8 | 7 | r8.L._2 },
			{ m: m.RES, op: op.N_IND | 7 | r16.HL._2 },	{ m: m.RES, op: op.N_R8 | 7 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 0 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 0 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 0 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 0 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 0 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 0 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 0 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 0 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 1 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 1 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 1 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 1 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 1 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 1 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 1 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 1 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 2 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 2 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 2 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 2 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 2 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 2 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 2 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 2 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 3 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 3 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 3 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 3 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 3 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 3 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 3 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 3 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 4 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 4 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 4 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 4 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 4 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 4 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 4 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 4 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 5 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 5 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 5 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 5 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 5 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 5 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 5 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 5 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 6 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 6 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 6 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 6 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 6 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 6 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 6 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 6 | r8.A._2 },
			{ m: m.SET, op: op.N_R8 | 7 | r8.B._2 },	{ m: m.SET, op: op.N_R8 | 7 | r8.C._2 },
			{ m: m.SET, op: op.N_R8 | 7 | r8.D._2 },	{ m: m.SET, op: op.N_R8 | 7 | r8.E._2 },
			{ m: m.SET, op: op.N_R8 | 7 | r8.H._2 },	{ m: m.SET, op: op.N_R8 | 7 | r8.L._2 },
			{ m: m.SET, op: op.N_IND | 7 | r16.HL._2 },	{ m: m.SET, op: op.N_R8 | 7 | r8.A._2 }
		]
		this.TABLE_Z80_DD = [
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IX | r16.BC._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IX | r16.DE._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.LD, op: op.R16_IM16 | r16.IX },
			{ m: m.LD, op: op.ABS16_R16 | r16.IX, ds: 2 },	{ m: m.INC, op: op.R16 | r16.IX },
			{ m: m.INC, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.DEC, op: op.R8 | r8.IXH, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IM8 | r8.IXH, a: a.UNDOC },{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IX | r16.IX._2 },
			{ m: m.LD, op: op.R16_ABS16 | r16.IX, ds: 2 },	{ m: m.DEC, op: op.R16 | r16.IX },
			{ m: m.INC, op: op.R8 | r8.IXL, a: a.UNDOC },	{ m: m.DEC, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IM8 | r8.IXL, a: a.UNDOC },{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.INC, op: op.IDX | r16.IX },		{ m: m.DEC, op: op.IDX | r16.IX },
			{ m: m.LD, op: op.IDX_IM8 | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IX | r16.SP._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.B | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.C | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.D | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.E | r16.IX._2 },	{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.B._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.C._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.D._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.E._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.H | r16.IX._2 },	{ m: m.LD, op: op.R8_R8 | r8.IXH | r8.A._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.B._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.C._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.D._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.E._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.L | r16.IX._2 },	{ m: m.LD, op: op.R8_R8 | r8.IXL | r8.A._2, a: a.UNDOC },
			{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.B._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.C._2 },
			{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.D._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.E._2 },
			{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.H._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.L._2 },
			{ op: op.NOP },					{ m: m.LD, op: op.IDX_R8 | r16.IX | r8.A._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.IXH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.A | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.IXH._2, a: a.UNDOC },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.ADD, op: op.R8_IDX | r8.A | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.IXH._2, a: a.UNDOC },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.ADC, op: op.R8_IDX | r8.A | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.SUB, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.SUB, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.SUB, op: op.IDX | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.IXH._2, a: a.UNDOC },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.SBC, op: op.R8_IDX | r8.A | r16.IX._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.AND, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.AND, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.AND, op: op.IDX | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.XOR, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.XOR, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.XOR, op: op.IDX | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.OR, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.OR, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.OR, op: op.IDX | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.CP, op: op.R8 | r8.IXH, a: a.UNDOC },	{ m: m.CP, op: op.R8 | r8.IXL, a: a.UNDOC },
			{ m: m.CP, op: op.IDX | r16.IX },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.PRFX_xDCB },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.POP, op: op.R16 | r16.IX },
			{ op: op.NOP },					{ m: m.EX, op: op.IND_R16 | r16.SP | r16.IX._2 },
			{ op: op.NOP },					{ m: m.PUSH, op: op.R16 | r16.IX },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.JP, op: op.IND | r16.IX },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.LD, op: op.R16_R16 | r16.SP | r16.IX._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP }
		]
		this.TABLE_Z80_FD = [
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IY | r16.BC._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IY | r16.DE._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.LD, op: op.R16_IM16 | r16.IY },
			{ m: m.LD, op: op.ABS16_R16 | r16.IY, ds: 2 },	{ m: m.INC, op: op.R16 | r16.IY },
			{ m: m.INC, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.DEC, op: op.R8 | r8.IYH, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IM8 | r8.IYH, a: a.UNDOC },{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IY | r16.IY._2 },
			{ m: m.LD, op: op.R16_ABS16 | r16.IY, ds: 2 },	{ m: m.DEC, op: op.R16 | r16.IY },
			{ m: m.INC, op: op.R8 | r8.IYL, a: a.UNDOC },	{ m: m.DEC, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IM8 | r8.IYL, a: a.UNDOC },{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.INC, op: op.IDX | r16.IY },		{ m: m.DEC, op: op.IDX | r16.IY },
			{ m: m.LD, op: op.IDX_IM8 | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ m: m.ADD, op: op.R16_R16 | r16.IY | r16.SP._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.B | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.B | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.C | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.C | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.D | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.D | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.E | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.E | r16.IY._2 },	{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.B._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.C._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.D._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.E._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.H | r16.IY._2 },	{ m: m.LD, op: op.R8_R8 | r8.IYH | r8.A._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.B._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.C._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.D._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.E._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.L | r16.IY._2 },	{ m: m.LD, op: op.R8_R8 | r8.IYL | r8.A._2, a: a.UNDOC },
			{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.B._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.C._2 },
			{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.D._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.E._2 },
			{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.H._2 },	{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.L._2 },
			{ op: op.NOP },					{ m: m.LD, op: op.IDX_R8 | r16.IY | r8.A._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.IYH._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.LD, op: op.R8_IDX | r8.A | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.IYH._2, a: a.UNDOC },
			{ m: m.ADD, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.ADD, op: op.R8_IDX | r8.A | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.IYH._2, a: a.UNDOC },
			{ m: m.ADC, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.ADC, op: op.R8_IDX | r8.A | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.SUB, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.SUB, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.SUB, op: op.IDX | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.IYH._2, a: a.UNDOC },
			{ m: m.SBC, op: op.R8_R8 | r8.A | r8.IXL._2, a: a.UNDOC },
			{ m: m.SBC, op: op.R8_IDX | r8.A | r16.IY._2 },	{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.AND, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.AND, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.AND, op: op.IDX | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.XOR, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.XOR, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.XOR, op: op.IDX | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.OR, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.OR, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.OR, op: op.IDX | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ m: m.CP, op: op.R8 | r8.IYH, a: a.UNDOC },	{ m: m.CP, op: op.R8 | r8.IYL, a: a.UNDOC },
			{ m: m.CP, op: op.IDX | r16.IY },		{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.PRFX_xDCB },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.POP, op: op.R16 | r16.IY },
			{ op: op.NOP },					{ m: m.EX, op: op.IND_R16 | r16.SP | r16.IY._2 },
			{ op: op.NOP },					{ m: m.PUSH, op: op.R16 | r16.IY },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.JP, op: op.IND | r16.IY },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ m: m.LD, op: op.R16_R16 | r16.SP | r16.IY._2 },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP },
			{ op: op.NOP },					{ op: op.NOP }
		]
		this.TABLE_Z80_xDCB = [
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.RLC, op: op.IDX | r16.IX },
			{ m: m.RLC, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.RRC, op: op.IDX | r16.IX },
			{ m: m.RRC, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.RL, op: op.IDX | r16.IX },
			{ m: m.RL, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.RR, op: op.IDX | r16.IX },
			{ m: m.RR, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.SLA, op: op.IDX | r16.IX },
			{ m: m.SLA, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.SRA, op: op.IDX | r16.IX },
			{ m: m.SRA, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX | r16.IX, a: a.UNDOC },
			{ m: m.SLL, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.B._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.C._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.D._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.E._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.H._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.L._2, a: a.UNDOC },
			{ m: m.SRL, op: op.IDX | r16.IX },
			{ m: m.SRL, op: op.IDX_R8 | r16.IX | r8.A._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 0 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 1 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 2 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 3 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 4 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 5 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 6 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2 },
			{ m: m.BIT, op: op.N_IDX | 7 | r16.IX._2, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 0 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 1 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 2 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 3 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 4 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 5 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 6 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.RES, op: op.N_IDX | 7 | r16.IX._2 },
			{ m: m.RES, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 0 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 0 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 1 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 1 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 2 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 2 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 3 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 3 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 4 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 4 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 5 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 5 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 6 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 6 | r16.IX._2 | r8.A._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.B._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.C._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.D._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.E._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.H._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.L._3, a: a.UNDOC },
			{ m: m.SET, op: op.N_IDX | 7 | r16.IX._2 },
			{ m: m.SET, op: op.N_IDX_R8 | 7 | r16.IX._2 | r8.A._3, a: a.UNDOC }
		]
		this.TABLE_Z80_ED = [
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ m: m.IN, op: op.R8_IND8 | r8.B | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.B._2 },
			{ m: m.SBC, op: op.R16_R16 | r16.HL | r16.BC._2 },{ m: m.LD, op: op.ABS16_R16 | r16.BC, ds: 2 },
			{ m: m.NEG, op: op.NONE },			{ m: m.RETN, op: op.NONE },
			{ m: m.IM, op: op.N | 0 },			{ m: m.LD, op: op.R8_R8 | r8.I | r8.A._2 },
			{ m: m.IN, op: op.R8_IND8 | r8.C | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.C._2 },
			{ m: m.ADC, op: op.R16_R16 | r16.HL | r16.BC._2 },{ m: m.LD, op: op.R16_ABS16 | r16.BC, ds: 2 },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETI, op: op.NONE },
			{ m: m.IM, op: op.N | 0, a: a.UNDOC },		{ m: m.LD, op: op.R8_R8 | r8.R | r8.A._2 },
			{ m: m.IN, op: op.R8_IND8 | r8.D | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.D._2 },
			{ m: m.SBC, op: op.R16_R16 | r16.HL | r16.DE._2 },{ m: m.LD, op: op.ABS16_R16 | r16.DE, ds: 2 },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETN, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 1 },			{ m: m.LD, op: op.R8_R8 | r8.A | r8.I._2 },
			{ m: m.IN, op: op.R8_IND8 | r8.E | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.E._2 },
			{ m: m.ADC, op: op.R16_R16 | r16.HL | r16.DE._2 },{ m: m.LD, op: op.R16_ABS16 | r16.DE, ds: 2 },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETI, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 2 },			{ m: m.LD, op: op.R8_R8 | r8.A | r8.R._2 },
			{ m: m.IN, op: op.R8_IND8 | r8.H | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.H._2 },
			{ m: m.SBC, op: op.R16_R16 | r16.HL | r16.HL._2 },{ m: m.LD, op: op.ABS16_R16 | r16.HL, ds: 2, a: a.UNDOC },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETN, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 0, a: a.UNDOC },		{ m: m.RRD, op: op.NONE },
			{ m: m.IN, op: op.R8_IND8 | r8.L | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.L._2 },
			{ m: m.ADC, op: op.R16_R16 | r16.HL | r16.HL._2 },{ m: m.LD, op: op.R16_ABS16 | r16.HL, ds: 2, a: a.UNDOC },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETI, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 0, a: a.UNDOC },		{ m: m.RLD, op: op.NONE },
			{ m: m.IN, op: op.R8_IND8 | r8.F | r8.C._2 },	{ m: m.OUT, op: op.IND8_N | r8.C | (0 << 4) },
			{ m: m.SBC, op: op.R16_R16 | r16.HL | r16.SP._2 },{ m: m.LD, op: op.ABS16_R16 | r16.SP, ds: 2 },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETN, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 1, a: a.UNDOC },		{ op: op.SKIP },
			{ m: m.IN, op: op.R8_IND8 | r8.A | r8.C._2 },	{ m: m.OUT, op: op.IND8_R8 | r8.C | r8.A._2 },
			{ m: m.ADC, op: op.R16_R16 | r16.HL | r16.SP._2 },{ m: m.LD, op: op.R16_ABS16 | r16.SP, ds: 2 },
			{ m: m.NEG, op: op.NONE, a: a.UNDOC },		{ m: m.RETI, op: op.NONE, a: a.UNDOC },
			{ m: m.IM, op: op.N | 2, a: a.UNDOC },		{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ m: m.LDI, op: op.NONE },			{ m: m.CPI, op: op.NONE },
			{ m: m.INI, op: op.NONE },			{ m: m.OUTI, op: op.NONE },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ m: m.LDD, op: op.NONE },			{ m: m.CPD, op: op.NONE },
			{ m: m.IND, op: op.NONE },			{ m: m.OUTD, op: op.NONE },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ m: m.LDIR, op: op.NONE },			{ m: m.CPIR, op: op.NONE },
			{ m: m.INIR, op: op.NONE },			{ m: m.OTIR, op: op.NONE },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ m: m.LDDR, op: op.NONE },			{ m: m.CPDR, op: op.NONE },
			{ m: m.INDR, op: op.NONE },			{ m: m.OTDR, op: op.NONE },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP },
			{ op: op.SKIP },				{ op: op.SKIP }
		]
	}
	decode1 ( d ) {
		let get_byte = () => {
			return d.File.Code [d.o - 1] | 0
		}
		let get_word = () => {
			return (d.File.Code [d.o - 2] | 0) | (d.File.Code [d.o - 1] | 0).shl8
		}
		let abs = ( a, ds, ref ) => {
			for (let o = 0; o < ds; o++)
				d.abs.set (a + o, { o, ds })
			d.abs.get (a).ref = ref
			d.abs.get (a).ref.push (d.ad)
		}
		let map_c0 = () => {
			d.Map [d.o++] = this.TYPE.C0
		}
		let map_c1 = ( t = 0 ) => {
			d.Map [d.o++] = this.TYPE.C1
			d.Map [d.o++] = this.TYPE.C1 | t | 1
		}
		let map_c2 = ( t1 = 0, t2 = 0 ) => {
			d.Map [d.o++] = this.TYPE.C2
			d.Map [d.o++] = this.TYPE.C2 | t1 | 1
			d.Map [d.o++] = this.TYPE.C2 | (t2 || t1) | 2
		}
		let b0 = d.File.Code [d.o]
		let cm = d.i8085 && this.TABLE [b0].i8085 || this.TABLE [b0]
		let op = cm && (cm.op & 0xFF0000)
		switch (op) {
			case this.OP.SKIP:
				d.o++
				return false
			case this.OP.NONE:
				map_c0 ()
				return {
					cm
				}
			case this.OP.R8:
				map_c0 ()
				return {
					cm,
					op:	this.REG8 [cm.op.p1]
				}
			case this.OP.R16:
				map_c0 ()
				return {
					cm,
					op:	this.REG16 [cm.op.p1]
				}
			case this.OP.R8_R8:
				map_c0 ()
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], this.REG8 [cm.op.p2]]
				}
			case this.OP.R16_R16:
				map_c0 ()
				return {
					cm,
					op:	[this.REG16 [cm.op.p1], this.REG16 [cm.op.p2]]
				}
			case this.OP.IND:
				map_c0 ()
				return {
					cm,
					op:	{ ind: this.REG16 [cm.op.p1] }
				}
			case this.OP.IND_R8:
				map_c0 ()
				return {
					cm,
					op:	[{ ind: this.REG16 [cm.op.p1] }, this.REG8 [cm.op.p2]]
				}
			case this.OP.R8_IND:
				map_c0 ()
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], { ind: this.REG16 [cm.op.p2] }]
				}
			case this.OP.IND8_R8:
				map_c0 ()
				return {
					cm,
					op:	[{ ind: this.REG8 [cm.op.p1] }, this.REG8 [cm.op.p2]]
				}
			case this.OP.R8_IND8:
				map_c0 ()
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], { ind: this.REG8 [cm.op.p2] }]
				}
			case this.OP.IND8_N:
				map_c0 ()
				return {
					cm,
					op:	[{ ind: this.REG8 [cm.op.p1] }, cm.op.p2]
				}
			case this.OP.IND_R16:
				map_c0 ()
				return {
					cm,
					op:	[{ ind: this.REG16 [cm.op.p1] }, this.REG16 [cm.op.p2]]
				}
			case this.OP.R16_IND:
				map_c0 ()
				return {
					cm,
					op:	[this.REG16 [cm.op.p1], { ind: this.REG16 [cm.op.p2] }]
				}
			case this.OP.N:
				map_c0 ()
				return {
					cm,
					op:	cm.op.p1.toString ()
				}
			case this.OP.CC:
				map_c0 ()
				return {
					cm,
					op:	this.CC [cm.op.p1]
				}
			case this.OP.N_R8:
				map_c0 ()
				return {
					cm,
					op:	[cm.op.p1, this.REG8 [cm.op.p2]]
				}
			case this.OP.N_IND:
				map_c0 ()
				return {
					cm,
					op:	[cm.op.p1, { ind: this.REG16 [cm.op.p2] }]
				}
			case this.OP.IM8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	{ im8: get_byte () }
				}
			case this.OP.R8_IM8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], { im8: get_byte () }]
				}
			case this.OP.ABS8_R8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[{ abs8: get_byte () }, this.REG8 [cm.op.p1]]
				}
			case this.OP.R8_ABS8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], { abs8: get_byte () }]
				}
			case this.OP.IND_IM8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[{ ind: this.REG16 [cm.op.p1] }, { im8: get_byte () }]
				}
			case this.OP.IDX:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	{ idx: [this.REG16 [cm.op.p1], get_byte ()] }
				}
			case this.OP.IDX_R8:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[{ idx: [this.REG16 [cm.op.p1], get_byte ()] }, this.REG8 [cm.op.p2]]
				}
			case this.OP.R8_IDX:
				map_c1 (this.TYPE.IM8)
				return {
					cm,
					op:	[this.REG8 [cm.op.p1], { idx: [this.REG16 [cm.op.p2], get_byte ()] }]
				}
			case this.OP.IDX_IM8:
				map_c2 (0, this.TYPE.IM8)
				return {
					cm,
					op:	[{ idx: [this.REG16 [cm.op.p1], d.File.Code [d.o - 2] | 0] }, { im8: d.File.Code [d.o - 1] | 0 }]
				}
			case this.OP.R16_IM16: {
				map_c2 (this.TYPE.IM16)
				let word = get_word ()
				if (d.im16.has (word))
					d.im16.get (word).push (d.ad)
				else
					d.im16.set (word, [d.ad])
				return {
					cm,
					op:	[this.REG16 [cm.op.p1], { im16: word }]
				}
			}
			case this.OP.ABS:
			case this.OP.ABS16_R8:
			case this.OP.R8_ABS16:
			case this.OP.ABS16_R16:
			case this.OP.R16_ABS16: {
				map_c2 (this.TYPE.ADDR)
				let addr = get_word ()
				let a0 = d.abs.get (addr)
				let a1 = d.abs.get (addr + 1)
				if (!isSet (a0)) {
					if (cm.ds == 2 && isSet (a1))
						abs (addr, a1.ds + 1, a1.ref)
					else
						abs (addr, cm.ds, [])
				} else {
					let a = addr - a0.o
					let r = d.abs.get (a).ref
					if (a0.ds + 1 > a0.o + cm.ds)
						abs (a, 0, r)
					else if (isSet (a1))
						abs (a, a0.ds + a1.ds, [... r, ... a1.ref])
					else
						abs (a, a0.ds + cm.ds - 1, r)
				}
				if (op == this.OP.ABS) {
					return {
						cm,
						op:	{ abs: addr }
					}
				}
				let r = op == this.OP.ABS16_R16 || op == this.OP.R16_ABS16
					? this.REG16
					: this.REG8
				return {
					cm,
					op:	op == this.OP.R8_ABS16 || op == this.OP.R16_ABS16
						? [r [cm.op.p1], { abs16: addr }]
						: [{ abs16: addr }, r [cm.op.p1]]
				}
			}
			case this.OP.N_ADDR:
			case this.OP.RST_ADDR: {
				map_c0 ()
				let addr = b0 & 0x38
				if (d.File.in (addr))
					d.lbl.set (addr, { ref: [d.ad], sub: 1 })
				return {
					addr,
					cm,
					op:	op == this.OP.N_ADDR
						? cm.op.p1.toString ()
						: { hex8: addr }
				}
			}
			case this.OP.ADDR:
			case this.OP.CC_ADDR: {
				map_c2 (this.TYPE.ADDR)
				let addr = get_word ()
				let sub = +!!(cm.a && (cm.a & august_disassm.ATTR.SUB))
				if (!d.File.in (addr))
					(d.ext.has (addr) ? void 0 : d.ext.set (addr, [])), d.ext.get (addr).push (d.ad)
				else if (d.lbl.has (addr))
					d.lbl.get (addr).ref.push (d.ad), d.lbl.get (addr).sub |= sub
				else
					d.lbl.set (addr, { ref: [d.ad], sub })
				return {
					addr,
					cm,
					op:	op == this.OP.CC_ADDR
						? [this.CC [cm.op.p1], { label: addr }]
						: { label: addr },
				}
			}
			case this.OP.DISP:
			case this.OP.CC_DISP: {
				map_c1 (this.TYPE.IM8)
				let b1 = get_byte ()
				let addr = d.Org + d.o + b1 - (b1 < 0x80 ? 0 : 0x100)
				let sub = +!!(cm.a && (cm.a & august_disassm.ATTR.SUB))
				if (!d.File.in (addr))
					;
				else if (d.lbl.has (addr))
					d.lbl.get (addr).ref.push (d.ad), d.lbl.get (addr).sub |= sub
				else
					d.lbl.set (addr, { ref: [d.ad], sub })
				return {
					addr,
					cm,
					op:	op == this.OP.CC_DISP
						? [this.CC [cm.op.p1], { label: addr }]
						: { label: addr }
				}
			}
			case this.OP.TAB: {
				let Table = this.TABLE
				this.TABLE = this [cm.tab]
				let o = d.o++
				let dec = this.decode1 (d)
				this.TABLE = Table
				if (dec && !d.Map [o]) {
					d.Map [o] = d.Map [o + 1]
					d.Map [o] += 0b01000000
					let s = (d.Map [o] >> 6) & 3
					for (let i = 1; i <= s; i++)
						d.Map [o + i] += 0b01000001
				}
				return dec
			}
			case this.OP.PRFX_xDCB: {
				let idx_reg = r => this.REG16 [r + +(d.File.Code [d.o - 4] == 0xFD)]
				let disp = d.File.Code [d.o + 1]
				map_c2 ()
				cm = this.TABLE_Z80_xDCB [get_byte ()]
				switch (cm.op & 0xFF0000) {
					case this.OP.IDX:
						return {
							cm,
							op: { idx: [idx_reg (cm.op.p1), disp] }
						}
					case this.OP.IDX_R8:
						return {
							cm,
							op: [{ idx: [idx_reg (cm.op.p1), disp] }, this.REG8 [cm.op.p2]]
						}
					case this.OP.N_IDX:
						return {
							cm,
							op: [cm.op.p1, { idx: [idx_reg (cm.op.p2), disp] }]
						}
					case this.OP.N_IDX_R8:
						return {
							cm,
							op: [cm.op.p1, { idx: [idx_reg (cm.op.p2), disp] }, this.REG8 [cm.op.p3]]
						}
				}
			}
		}
		return false
	}
	decode ( f ) {
		f.Disassm = {
			File:	f,
			Org:	f.Org,
			Decode:	[],
			Map:	new Uint8Array (f.Code.length),
			ext:	new Map,
			lbl:	new Map,
			abs:	new Map,
			im16:	new Map,
			smc:	new Map,
			Z80:	f.Arch == august_disassm.ARCH.Z80,
			i8085:	f.Arch == august_disassm.ARCH.i8085
		}
		let d		= f.Disassm
		this.TABLE	= d.Z80 ? this.TABLE_Z80 : this.TABLE_8080
		this.REG8	= d.Z80 ? this.REG8_Z80  : this.REG8_8080
		this.REG16	= d.Z80 ? this.REG16_Z80 : this.REG16_8080
		let ext_idx	= 0
		let lbl_idx	= 0
		let sub_idx	= 0
		let im16_idx	= 0
		let cnst_idx	= 0
		let smc_idx	= 0
		let data_idx	= 0
		let ol		= []


if (1) {
		for (let Offs = 0; Offs < f.Code.length; Offs = d.o) {
			while (d.Map [Offs])
				Offs++
			ol.push (Offs)
			while (f.Data.get (Offs) === 1)
				d.Map [Offs++] = this.TYPE.DATA
			for (d.o = Offs; d.o < f.Code.length;) {
				d.ad = d.o + d.Org
				let dec = this.decode1 (d)
				if (dec) {
					d.Decode [d.ad] = dec
					if (dec.cm.a && (dec.cm.a & august_disassm.ATTR.END))
						break
				} else {
					for (let o = d.ad - d.Org; o < d.o; o++) {
						f.Data.set (o, 0)
						d.Map [o] = this.TYPE.DATA
					}
				}
				if (f.Data.get (d.o) === 1)
					break
			}
		}
} else {

		let block_end = dec => dec.cm.a && (dec.cm.a & august_disassm.ATTR.END)
		let code_jmp = dec => dec && block_end (dec) && (dec.cm.op & 0xFF0000) == this.OP.ADDR
		let decode_block = offs => {
			for (d.o = offs; d.o < f.Code.length;) {
				if (d.Map [d.o])
					return false
				d.ad = d.o + d.Org
				let dec = this.decode1 (d)
				if (dec) {
					d.Decode [d.ad] = dec
					if (block_end (dec)) {
						if (code_jmp (dec)) while (d.o < f.Code.length) {
							let dec = this.decode1 ({
								File:	f,
								Org:	f.Org,
								Z80:	d.Z80,
								i8085:	d.i8085,
								Map:	new Uint8Array,
								ext:	new Map,
								lbl:	new Map,
								abs:	new Map,
								im16:	new Map,
								smc:	new Map,
								o:	d.o,
								ad:	d.o + d.Org
							})
							if (!code_jmp (dec))
								return d.o
							d.ad = d.o + d.Org
							d.Decode [d.ad] = this.decode1 (d)
						}
						return d.o
					}
				} else {
					for (let o = d.ad - d.Org; o < d.o; o++) {
						f.Data.set (o, 0)
						d.Map [o] = this.TYPE.DATA
					}
				}
			}
			return 0
		}

		let block = new Set
		let no_lbl = new Set
		let lbl_count = 0
		let lbl = (function* () {
			for (let [addr] of d.lbl)
				yield addr - d.Org
		})()
		block.add (0)
		for (let offs of block) {
			let o = decode_block (offs)
			if (o)
				no_lbl.add (o)
			while (lbl_count < d.lbl.size) {
				let offs = lbl.next ().value
				block.add (offs)
				no_lbl.delete (offs)
				lbl_count++
			}
		}
		for (let offs of no_lbl) {
			if (d.Map [offs])
				continue
			for (; offs < f.Code.length && !d.Map [offs]; offs++) {
				f.Data.set (offs, 1)
				d.Map [offs] = this.TYPE.DATA
			}
		}

console.log (d.Map)
console.log (d.lbl)
console.log (d.Decode)

for (let l of d.lbl) {

}
}






		let is_code = ( m, b = 0 ) => {
			return (m & (this.TYPE.MASK | b)) == this.TYPE.C0
		}
		let is_code0 = ( m ) => {
			return is_code (m, 3)
		}
		let is_type = ( a, t, n = 0 ) => {
			let m = d.Map [a - d.Org]
			let s = m >> 6
			return (is_code (m) && (m & 0x0F) == (t | s + n)) ? s + 1 : 0
		}
		let sort_map = a => {
			return new Map (a.sort (( a, b ) => a [0] - b [0]))
		}

		d.ext = sort_map ([... d.ext])
		d.lbl = sort_map ([... d.lbl])
		d.im16 = sort_map ([... d.im16])
		d.no_lbl = ol.filter (o => !d.lbl [o + d.Org] && is_code (d.Map [o]))
		for (let [a, el] of d.ext) {
			el.idx = ++ext_idx
		}
		for (let [a, el] of d.lbl) {
			el.idx = el.sub
				? ++sub_idx
				: ++lbl_idx
		}
		for (let [a, el] of d.im16) {
			let m = d.Map [a - d.Org]
			if (is_code0 (m) || m == this.TYPE.DATA) {
				let abs = d.abs.get (a)
				if (isSet (abs)) {

console.log ("im16=>abs", a, abs, `m=${m}`, el)
if (abs.o) console.log ("abs.o", d.abs.get (a - abs.o))

					for (let r of el)
						d.abs.get (a - abs.o).ref.push (r)
					d.im16.delete (a)
				} else if (a) {
					el.idx = ++im16_idx
				}
			} else if (a) {
				el.cnst_idx = ++cnst_idx
			}
		}
		let nva = -256
		let ve = []
		let abs = [... d.abs].sort (( a, b ) => a [0] - b [0])
		for (let [a, v] of abs) {
			if (v.o)
				continue
			if (d.File.in (a)) {
				let ds = v.ds == 1 && is_type (a, this.TYPE.IM8)
					|| (v.ds == 2 && (
						(is_type (a, this.TYPE.IM16, -1) && is_type (a + 1, this.TYPE.IM16))
						|| (is_type (a, this.TYPE.ADDR, -1) && is_type (a + 1, this.TYPE.ADDR))
					))
console.log ("if (d.in (a)) ds=",ds,"v.ds=",v.ds,a.hex16, "text",d.Decode [a])
				if (ds) {
					for (let o = 0; o < ds; o++)
						d.smc.set (a + v.ds - ds + o, { o, ds })
					d.smc.get (a + v.ds - ds).ref = v.ref
					d.smc.get (a + v.ds - ds).idx = ++smc_idx
				} else if (d.Decode [a]) {
					let o = a - d.Org
					d.Decode [a] = {
						data: { ds: v.ds, idx: ++data_idx }
					}
					if (v.ds == 1) {
						d.Decode [a].op = { hex8: d.File.Code [o] }
					} else if (v.ds == 2) {
						d.Decode [a].op = { hex16: d.File.Code [o] | d.File.Code [o + 1].shl8 }
						delete d.Decode [a + 1]
					}
				}
			} else {
				if (a - nva == 0)
					;
				else if (a - nva < 64)
					ve.push ([nva, a - nva])
				else if (a & 0x0F)
					ve.push ([a & ~0x0F, a & 0x0F])
				nva = a + v.ds
			}
		}
		for (let [a, ds] of ve) {
			for (let o = 0; o < ds; o++)
				abs.push ([a + o, { o, ds }])
		}
		d.abs = sort_map (abs)

		let next_addr = 0
		let skip = 0
		let data = []
		let set_data = () => {
			for (let a0 = next_addr - data.length; data.length; a0 += this.DATA_SIZE) {
//console.log ("set_data",d.Decode [a0], a0)
				d.Decode [a0] = {
					op:	{ data: data.slice (0, this.DATA_SIZE) },
					data:	{ ds: Math.min (data.length, this.DATA_SIZE) }
				}
				data = data.slice (this.DATA_SIZE)
			}
		}
		for (let [o, t] of f.Data) {
//console.log ("f.Data.forEach ",d.Map [a - d.Org])
			if (d.Map [o] != this.TYPE.DATA) {
				set_data ()
				continue
			}
			if (skip) {
				skip--
				continue
			}
			let a = o + d.Org
			if (d.lbl.has (a)) {
				set_data ()
console.log ("data lbl", a.hex16, d.lbl.get (a))
			} else if (d.im16.has (a)) {
				set_data ()
console.log ("data im16", a.hex16, d.im16.get (a))
			}
			if (d.abs.has (a)) {
				let abs = d.abs.get (a)
				if (abs.o)
					continue
				set_data ()
console.log ("data abs", a.hex16, abs.ds, abs.o)
				d.Decode [a] = {
					data: { ds: abs.ds, idx: ++data_idx }
				}
				if (abs.ds == 1)
					d.Decode [a].op = { hex8: d.File.Code [o] }
				else if (abs.ds == 2)
					d.Decode [a].op = { hex16: d.File.Code [o] | d.File.Code [o + 1].shl8 }
				else
					d.Decode [a].op = { data: d.File.Code.slice (o, o + abs.ds + 1) }
				skip = abs.ds - 1
				continue
			} else {
//console.log ("none", a.hex16)
			}
			if (a != next_addr)
				set_data ()
			data.push (d.File.Code [o])
			next_addr = a + 1
		}
		set_data ()
	}
	assm ( f, tpl ) {
		let d = f.Disassm
		if (!d)
			return ""

		let MNEMO = d.Z80 ? this.MNEMO_Z80 : this.MNEMO_8080
		let op = this.operand (d, this.CFG)
		let txt = []
		let sym_max = 0
		for (let a in this.CFG.SYMBOL){
			let l = this.CFG.SYMBOL [a].length
			if (sym_max < l)
				sym_max = l
		}
		for (let [a, v] of d.ext)
			txt.push (tpl.line (tpl.align (op.lbl (a, v.idx)("EXT"), sym_max), this.CFG.DIR.EQU, op.hex16 (a)))
		if (txt.length)
			txt.push (tpl.empty)
		if (d.File.ConstSec) {
			let l = txt.length
			for (let [a, el] of d.im16) {
				if (isSet (el.cnst_idx) && !d.abs.has (a)) {
					let c = d.File.CountRef ? `[${el.length}] ; ` : ``
					txt.push (tpl.line (
						op.lbl (a, el.cnst_idx)("CNST"),
						this.CFG.DIR.EQU,
						op.hex16 (a),
						tpl.comm (`${c}${a < 0x8000 ? a : `${a} ; ${a.neg16}`}`)
					))
				}
			}
			if (txt.length != l)
				txt.push (tpl.empty)
		}

		{
			let l = txt.length
			let nva = -1
			for (let [a, v] of d.abs) {
				if (v.o || d.File.in (a))
					continue
				if (a - nva)
					txt.push (tpl.empty, tpl.line ("", this.CFG.DIR.ORG, op.hex16 (a)))
				txt.push (tpl.line_addr (a, tpl.code_lbl (op.lbl (a)("VXT")), this.CFG.DIR.DS, v.ds))
				nva = a + v.ds
			}
			if (txt.length != l)
				txt.push (tpl.empty)
		}
		txt.push (tpl.line ("", this.CFG.DIR.ORG, op.hex16 (d.Org)))
		let code_data = ( a, cond ) => {
			let code = []
			for (let i = 0; cond (i); i++)
				code.push (d.File.Code [a - d.Org + i].hex8)
			return code.join (" ")
		}
		let code_data_cond = ( a, i, t ) => {
			return (t & this.TYPE.MASK) && i <= (t >> 6) && d.File.in (a + i)
		}

		d.Decode.forEach (( cm, a ) => {
			op.reset ()
			let t = d.Map [a - d.Org]
			let lbl = op.label (a)
			let com = []
			let smc = d.smc.get (a)
			if (cm.data && cm.data.idx)
				txt.push (tpl.line_addr (a, tpl.code_lbl (op.lbl (a, cm.data.idx)("VAR"), "abs")))
			if (smc)
				txt.push (tpl.line_addr (a, tpl.code_lbl (op.lbl (a, smc.idx)("SMC"), "smc")))
			let asm = [
				!d.File.DetachLbl && lbl
					? tpl.code_lbl (lbl)
					: "",
				cm.cm && isSet (cm.cm.m)
					? MNEMO [cm.cm.m]
					: cm.data && isSet (cm.op.hex16)
					? this.CFG.DIR.DW
					: cm.data && (isSet (cm.op.hex8) || isSet (cm.op.data))
					? this.CFG.DIR.DB
					: ""
			]
			if (cm.op) {
				asm.push (isArray (cm.op)
					? cm.op.map (i => op.op (i)).join (", ")
					: op.op (cm.op)
				)
				if (isSet (op.ref_val) && isSet (cm.cm) && (cm.cm.op & ~0xFFFF) !== this.OP.R16_IM16 && (cm.cm.op & ~0xFFFF) !== this.OP.ABS)
					op.ref_val = void 0
				if (op.im8_val) {
					com.push (op.im8_val)
					if (op.im8_val & 0x80)
						com.push (op.im8_val.neg8)
					else if (op.im8_val > 0x1F)
						com.push (`'${this.char (op.im8_val)}'`)
				} else if (!d.File.ConstSec && op.im16_val) {
					com.push (op.im16_val)
					if (op.im16_val & 0x8000)
						com.push (op.im16_val.neg16)
				} else if (op.ref_val && d.Map [op.ref_val - d.Org] != this.TYPE.DATA) {
					com.push (op.hex16 (op.ref_val))
					com.push (op.ref_val)
					if (op.ref_val & 0x8000)
						com.push (op.ref_val.neg16)
				}
			}
			let lbl_ref = 0
			if (d.lbl.has (a) && d.File.CountRef) {
				let lbl = d.lbl.get (a)
				lbl_ref = lbl.ref.length > 1 ? lbl.ref.length : 0
				if (!d.File.DetachLbl && lbl_ref)
					com.push (`[${lbl_ref}]`)
			}
			if (cm.op && cm.op.data) {
				if (asm [2].length < this.DATA_SIZE * 4)
					asm.push ("")
				com.push (`"${cm.op.data.map ($ => this.char ($)).join ("")}"`)
			} else if (cm.cm && (cm.cm.a || 0) & august_disassm.ATTR.UNDOC) {
				com.push (this.CFG.UNDOC)
				if (d.File.UdocCode) {
					let c = []
					for (let i = 0; code_data_cond (a, i, t); i++)
						c.push (op.hex8 (d.File.Code [a - d.Org + i]))
					com.push (`${this.CFG.DIR.DB} ${c.join (", ")}`)
				}
			}
			if (com.length) {
				if (asm.length == 2)
					asm.push ("")
				if (asm [2].length < 8)
					asm.push ("")
				asm.push (com.map (c => tpl.comm (c)).join (" "))
			}
			if (d.File.DetachLbl && lbl) {
				txt.push (tpl.line_lbl (
					a,
					lbl_ref
						? [tpl.code_lbl (lbl), "", "", "", tpl.comm (`[${lbl_ref}]`)]
						: [tpl.code_lbl (lbl)]
				))
			}
			txt.push (tpl.line_asm (
				a,
				isSet (cm.addr) && d.File.in (cm.addr)
					? cm.addr
					: isSet (op.smc_val) && d.smc.has (op.smc_val) && d.smc.get (op.smc_val).idx
					? op.smc_val
					: op.ref_val,
				cm.data
					? code_data (a, i => i < cm.data.ds)
					: code_data (a, i => code_data_cond (a, i, t)),
				asm
			))
		})
		return txt.join ("")
	}
	get_disassm1 ( hex = 1 ) {
		let d = {
			Map:	new Uint8Array,
			ext:	new Map,
			lbl:	new Map,
			abs:	new Map,
			im16:	new Map,
			smc:	new Map,
			File:	{
				in:	_ => 0
			}
		}
		let op = this.operand (d, this.CFG, hex)
		return ( file, offs = 0, tpl = null ) => {
			d.o		= 0
			d.Org		= file.Org + offs
			d.File.Code	= file.Code.subarray (offs, Math.min (offs + 4, file.Code.length))
			d.Z80		= file.Arch == august_disassm.ARCH.Z80
			d.i8085		= file.Arch == august_disassm.ARCH.i8085
			this.TABLE	= d.Z80 ? this.TABLE_Z80 : this.TABLE_8080
			this.REG8	= d.Z80 ? this.REG8_Z80  : this.REG8_8080
			this.REG16	= d.Z80 ? this.REG16_Z80 : this.REG16_8080
			let dec		= this.decode1 (d)
			d.abs.clear ()
			if (!(dec?.cm && isSet (dec.cm.m)) || d.File.Code.length < d.o)
				return ["", 0, 0, 0]
			let ret = ["", d.o, dec.cm.a, dec.addr]
			if (tpl) {
				let MNEMO = (d.Z80 ? this.MNEMO_Z80 : this.MNEMO_8080)[dec.cm.m]
				let OP = dec.op
					? isArray (dec.op)
					? dec.op.map (i => op.op (i)).join (", ")
					: op.op (dec.op)
					: ""
				ret [0] = tpl.tpl ({ MNEMO, OP })
			}
			return ret
		}
	}
	operand ( d, cfg, hex = 0 ) {
		return {
			lbl ( addr, idx, offs = 0 ) {
				return n => n === "EXT" && cfg.SYMBOL [addr.HEX16] || cfg.LBL [n].tpl ({
					ADDR	() { return addr.HEX16 },
					NUM	() { return idx },
					OFFS	() { return offs }
				})
			},
			label ( $ ) {
				let lbl = d.lbl.get ($)
				if (lbl && lbl.idx)
					return this.lbl ($, lbl.idx)(lbl.sub ? "SUB" : "JMP")
				let ext = d.ext.get ($)
				let v = d.abs.get ($)
				if (ext && ext.idx)
					return v ? this.lbl ($ - v.o, 0, v.o)("VXT") : this.lbl ($, ext.idx)("EXT")
				let im16 = d.im16.get ($)
				if (im16 && im16.idx)
					return this.ref_val = $, this.lbl ($, im16.idx)("REF")
			},
			var_lbl ( $ ) {
				let data = d.Decode?.[$]?.data
				let smc = d.smc.get ($)
				let v = d.abs.get ($)
				if (smc)
					this.smc_val = $ - smc.o
				return data
					? this.lbl (this.ref_val = $, data.idx)("VAR")
					: smc
					? smc.o
					? this.lbl ($, d.smc.get ($ - smc.o).idx, smc.o)("SMC")
					: this.lbl ($, smc.idx)("SMC")
					: v
					? !d.File.in ($)
					? this.lbl ($ - v.o, 0, v.o)("VXT")
					: v.o && d.Decode?.[$ - v.o]?.data
					? this.lbl (this.ref_val = $ - v.o, d.Decode [$ - v.o].data.idx, v.o)("VAR")
					: void 0
					: void 0
			},
			const_lbl ( $ ) {
				this.im16_val = $
				if (!d.File.ConstSec)
					return this.hex16 ($)
				let im16 = d.im16.get ($)
				return im16 && isSet (im16.cnst_idx)
					? this.lbl ($, im16.cnst_idx)("CNST")
					: this.hex16 ($)
			},
			hex8 ( $ ) {
				return hex ? $.HEX8 : `${"0".empty ($ < 0xA0)}${$.HEX8}h`
			},
			hex16 ( $ ) {
				return hex ? $.HEX16 : $ ? `${"0".empty ($ < 0xA000)}${$.HEX16}h` : 0
			},
			im8 ( $ ) {
				return this.hex8 (this.im8_val = $)
			},
			im16 ( $ ) {
				if (d.lbl.has ($)) {
//console.log ("im16-adr", $.hex16)
				}
				return this.label ($) || this.var_lbl ($) || this.const_lbl ($)
			},
			abs ( $ ) {
				return this.var_lbl ($) || this.hex16 ($)
			},
			abs8 ( $ ) {
				return `(${this.hex8 ($)})`
			},
			abs16 ( $ ) {
				return `(${this.abs ($)})`
			},
			ind ( $ ) {
				return `(${$})`
			},
			idx ( $ ) {
				return `(${$[0]}${$[1] < 0x80 ? '+' : '-'}${this.hex8 ($[1] < 0x80 ? $[1] : 0x100 - $[1])})`
			},
			data ( $ ) {
				return $.map (this.hex8).join (", ")
			},
			op ( $ ) {
				if (!isObject ($))
					return $
				let p = Object.entries ($)[0]
				return this [p [0]](p [1]) || this.hex16 (p [1])
			},
			reset () {
				this.im8_val = this.im16_val = this.ref_val = this.smc_val = void 0
			}
		}
	}
	char ( $ ) {
		return this.CFG.XLAT
			? this.CFG.XLAT [$]
			? String.fromCharCode (this.CFG.XLAT [$])
			: `\\x${$.hex8}`
			: $.ascii		
	}

	MNEMO_8080 = [
		"MOV",	"MVI",	"STAX",	"LDAX",	"STA",	"LDA",
		"LXI",	"SHLD",	"LHLD",	"PUSH",	"POP",	"SPHL",	"XCHG",	"XTHL",
		"IN",	"OUT",
		"CMC",	"STC",	"CMA",	"DAA",	"INR",	"DCR",	"INX",	"DCX",
		"ADD",	"ADC",	"SUB",	"SBB",	"ANA",	"ORA",	"XRA",	"CMP",
		"ADI",	"ACI",	"SUI",	"SBI",	"ANI",	"ORI",	"XRI",	"CPI",
		"DAD",
		"RLC",	"RAL",	"RRC",	"RAR",
		"PCHL",	"JMP",	"CALL",	"RST",	"RET",
		"JNZ",	"JZ",	"JNC",	"JC",	"JPO",	"JPE",	"JP",	"JM",
		"CNZ",	"CZ",	"CNC",	"CC",	"CPO",	"CPE",	"CP",	"CM",
		"RNZ",	"RZ",	"RNC",	"RC",	"RPO",	"RPE",	"RP",	"RM",
		"EI",	"DI",	"HLT",	"NOP",
		"DSUB",	"ARHL",	"RLDE",	"RIM",	"SIM",	"LDHI",	"LDSI",
		"RSTV",	"SHLX",	"LHLX",	"JNK",	"JK"
	]
	REG8_8080 = [
		"B", "C", "D", "E", "H", "L", "M", "A"
	]
	REG16_8080 = [
		"B", "D", "H", "SP", "PSW"
	]
	MNEMO_Z80 = [
		"LD",	"PUSH",	"POP",	"EX",	"EXX",	"IN",	"OUT",
		"CCF",	"SCF",	"CPL",	"DAA",	"INC",	"DEC",	"NEG",
		"ADD",	"ADC",	"SUB",	"SBC",	"AND",	"OR",	"XOR",  "CP",
		"RLCA",	"RLA",	"RRCA",	"RRA",
		"JP",	"JMP",	"CALL",	"RST",	"RET",	"DJNZ",	"JR",
		"EI",	"DI",	"HALT",	"NOP",
		"RLC",	"RRC",	"RL",	"RR",	"SLA",	"SRA", "SLL", "SRL",
		"BIT",	"RES",	"SET",	"RRD",	"RLD",
		"RETN",	"RETI",	"IM",
		"LDI",	"LDIR",	"CPI",	"CPIR",	"INI",	"INIR",	"OUTI",	"OTIR",
		"LDD",	"LDDR",	"CPD",	"CPDR",	"IND",	"INDR",	"OUTD",	"OTDR"
	]
	REG8_Z80 = [
		"B", "C", "D", "E", "H", "L", "A", "F", "I", "R", "IXH", "IXL", "IYH", "IYL"
	]
	REG16_Z80 = [
		"BC", "DE", "HL", "SP", "AF", "AF'", "IX", "IY"
	]
	CC = [
		"NZ", "Z", "NC", "C", "PO", "PE", "P", "M"
	]
	OP = new Enum (
		"NONE", "R8", "R16", "IM8", "IM16", "ABS", "ADDR", "R8_R8", "R8_IM8", "R16_IM16",
		"R16_R16", "ABS16_R8", "R8_ABS16", "ABS16_R16", "R16_ABS16", "ABS8_R8", "R8_ABS8",
		"CC", "CC_ADDR", "DISP", "CC_DISP", "N", "N_R8", "N_ADDR", "RST_ADDR",
		"IND", "IND_IM8", "IND_R8", "R8_IND", "IND8_R8", "R8_IND8", "IND8_N", "IND_R16",
		"R16_IND", "N_IND", "IDX", "IDX_IM8", "IDX_R8", "R8_IDX", "N_IDX", "N_IDX_R8",
		"TAB", "PRFX_xDCB", "NOP", "SKIP",
		$ => $.shl16
	)
	TYPE = {
		C0:	0x10,
		C1:	0x10 | 0x40,
		C2:	0x10 | 0x80,
		C3:	0x10 | 0xC0,
		IM8:	0x04,
		IM16:	0x08,
		ADDR:	0x0C,
		DATA:	0xFF,
		MASK:	0x30
	}
	DATA_TYPE = {
		BYTE:	1,
		WORD:	2,
		ADDR:	3,
		TEXT:	4
	}
	DATA_SIZE = 4

	CFG = {
		LBL:		{},
		DIR:		{},
		SYMBOL:		{},
		UNDOC:		"undocumented"
	}

	static ARCH = {
		i8080:	0,
		i8085:	1,
		Z80:	2
	}
	static ATTR = {
		END:	1,
		SUB:	2,
		UNDOC:	4
	}

	static cfg_val ( def ) {
		let val = ""
		return {
			set ( v ) {
				val = v
			},
			get () {
				return val || def
			}
		}
	}

	static DEF_CFG = {
		LBL: {
			JMP:	"LBL%NUM%",
			SUB:	"SUB%NUM%",
			EXT:	"EXT%NUM%",
			REF:	"REF%NUM%",
			VAR:	"VAR%NUM%%?+%OFFS%?%",
			VXT:	"V_%ADDR%%?+%OFFS%?%",
			SMC:	"SMC%NUM%%?+%OFFS%?%",
			CNST:	"CNST%NUM%"
		},
		DIR: {
			EQU:	"EQU",
			ORG:	"ORG",
			DB:	"DB",
			DW:	"DW",
			DS:	"DS"
		}
	}
}

Number.prototype.extend ({
	_2: { get () { return this << 4 } },
	_3: { get () { return this << 8 } },
	p1: { get () { return this & 0x0F } },
	p2: { get () { return this >> 4 & 0x0F } },
	p3: { get () { return this >> 8 & 0x0F } },
	neg8: { get () { return -((~this + 1) & 0xFF) } },
	neg16: { get () { return -((~this + 1) & 0xFFFF) } },
	ascii: { get () { return this < 0x20 || this > 0x7F ? `\\x${this.hex8}` : String.fromCharCode (this) } }
})

