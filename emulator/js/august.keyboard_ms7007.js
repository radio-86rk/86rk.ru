//  Copyright (c) 2024 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.keyboard_ms7007.js


"use strict"

class august_keyboard_ms7007_kr extends august_keyboard {
	get class_type () {
		return august_keyboard_ms7007_kr
	}
	get out () {
		if (this.Keys.has (18))
			return 0xFF
		
		const IN = this.in
		if ((this.SHIFT & 0x02) && IN == 0xEF)
			return (this.SHIFT &= 1) ? 0xFE : 0xFB
		let OUT = 0xFF
		let SHIFT = 0
		const SHIFT_KEY = this.Keys.has (16)
		for (let c of this.Keys) {
			let Code = !SHIFT_KEY && this.MATRIX [c] >> 16 || (this.MATRIX [c] & 0xFFFF)
			let Key = !this.rus () && (Code >> 8) || (Code & 0xFF)
			let Mask = ~(0x01 << (Key & 0x07))
			if (Key && (Mask | IN) == Mask) {
				OUT &= this.OUT [Key >> 4 & 0x0F]
				SHIFT |= (Key & 0x08) >> 3
			}
		}
		if (this.SHIFT != SHIFT && OUT != 0xFF) {
			this.SHIFT = SHIFT | 0x02
			return 0xFF
		}
		return OUT
	}
	get ctrl () {
		return 0xFF
	}

	SHIFT = 0
	OUT = [0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F, 0xFC, 0xFA, 0xF8]

	static MATRIX_QWERTY = [
		0,		0,		0,		0,		0,		0,		0,		0,
//		BS		TAB								ENTER
		0x55,		0x11,		0,		0,		0,		0x66,		0,		0,
//		SHIFT		CTRL		ALT				CPSLCK
		0,		0x12,		0,		0,		0x00130014,	0,		0,		0,
//								ESC
		0,		0,		0,		0x10,		0,		0,		0,		0,
//		SPACE		PGUP		PGDN		END		HOME		LEFT		UP		RIGHT
		0x64,		0x24,		0x04,		0x47,		0x46,		0x94,		0x76,		0x65,
//		DOWN										INS		DEL
		0x75,		0,		0,		0,		0,		0x57,		0x10,		0,
//		0		1		2		3		4		5		6		7
		0x009700AF,	0x00310039,	0x0041A349,	0x00510059,	0x00606820,	0x00710079,	0x00813467,	0x0090897F,
//		8		9				; (F)				= (F)
		0x00A0006F,	0x00A700A8,	0,		0x20A5,		0,		0x008F0028,	0,		0,

//				A		B		C		D		E		F		G
		0,		0x5322,		0x9363,		0x3244,		0xA243,		0x6142,		0x2253,		0x8262,
//		H		I		J		K		L		M		N		O
		0x9673,		0x6391,		0x2183,		0x5292,		0x92A2,		0x5484,		0x7274,		0x83A1,
//		P		Q		R		S		T		U		V		W
		0x62A6,		0x2321,		0x7352,		0x4433,		0x7461,		0x4282,		0xA554,		0x4332,
//		X		Y		Z
		0x8434,		0x3372,		0xA623,		0,		0,		0,		0,		0,
//		Num0		Num1		Num2		Num3		Num4		Num5		Num6		Num7
		0x15,		0x25,		0x26,		0x27,		0x35,		0x36,		0x37,		0x05,
//		Num8		Num9		Num*		Num+				Num-		Num.		Num/
		0x06,		0x07,		0x4D,		0x45,		0,		0x01,		0x16,		0x09,
//		F1		F2		F3		F4		F5		F6		F7		F8
		0x30,		0x40,		0x50,		0x70,		0x80,		0,		0,		0,
//		F9		F10		F11		F12
		0,		0,		0,		0,		0,		0,		0,		0,

		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//												- (F)
		0,		0,		0,		0,		0,		0x00870086,	0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//						;		=		,		-		.		/
		0,		0,		0x20A567A5,	0x008F0028,	0xA493AC93,	0x00870086,	0x85A38DA3,	0x77857FA4,

//		`
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//								[		\		]		'
		0,		0,		0,		0x9196,		0x95779D77,	0xA186,		0x98954995,	0,
//						\ (l)
		0,		0,		0x95779D77,	0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0
	]
	static MATRIX_JCUKEN = [
		0,		0,		0,		0,		0,		0,		0,		0,
//		BS		TAB								ENTER
		0x55,		0x11,		0,		0,		0,		0x66,		0,		0,
//		SHIFT		CTRL		ALT				CPSLCK
		0,		0x12,		0,		0,		0x00130014,	0,		0,		0,
//								ESC
		0,		0,		0,		0x10,		0,		0,		0,		0,
//		SPACE		PGUP		PGDN		END		HOME		LEFT		UP		RIGHT
		0x64,		0x24,		0x04,		0x47,		0x46,		0x94,		0x76,		0x65,
//		DOWN										INS		DEL
		0x75,		0,		0,		0,		0,		0x57,		0x10,		0,

//		0		1		2		3		4		5		6		7
		0x97,		0x00310039,	0x00410049,	0x00510059,	0x00600068,	0x00710079,	0x00810089,	0x00900098,
//		8		9				; (F)				= (F)
		0x00A000A8,	0x00A700AF,	0,		0xA5,		0,		0x0077007F,	0,		0,

//				A		B		C		D		E		F		G
		0,		0x22,		0x63,		0x44,		0x43,		0x42,		0x53,		0x62,
//		H		I		J		K		L		M		N		O
		0x73,		0x91,		0x83,		0x92,		0xA2,		0x84,		0x74,		0xA1,
//		P		Q		R		S		T		U		V		W
		0xA6,		0x21,		0x52,		0x33,		0x61,		0x82,		0x54,		0x32,
//		X		Y		Z
		0x0034003C,	0x72,		0x23,		0,		0,		0,		0,		0,
//		Num0		Num1		Num2		Num3		Num4		Num5		Num6		Num7
		0x15,		0x25,		0x26,		0x27,		0x35,		0x36,		0x37,		0x05,
//		Num8		Num9		Num*		Num+				Num-		Num.		Num/
		0x06,		0x07,		0x4D,		0x45,		0,		0x01,		0x16,		0x09,
//		F1		F2		F3		F4		F5		F6		F7		F8
		0x30,		0x40,		0x50,		0x70,		0x80,		0,		0,		0,
//		F9		F10		F11		F12
		0,		0,		0,		0,		0,		0,		0,		0,

		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//												- (F)
		0,		0,		0,		0,		0,		0x0087008F,	0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//						;		=		,		-		.		/
		0,		0,		0xA5,		0x0077007F,	0x93,		0x0087008F,	0xA3,		0x00A400AC,

//		`
		0x00200028,	0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
//								[		\		]		'
		0,		0,		0,		0x96,		0x0085008D,	0x0067006F,	0x0095009D,	0,
//						\ (l)
		0,		0,		0x0085008D,	0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0,
		0,		0,		0,		0,		0,		0,		0,		0
	]
}

class august_keyboard_ms7007_kr_tapper extends august_keyboard_86kr_tapper {
	constructor ( str, pause = 0 ) {
		super (str, [38, 1], pause)
	}
	hook ( ppi, kbd ) {
		return new Promise (resolve => {
			ppi.hook = {
				pa: a => {
					if ((this.SHIFT & 0x02) && a == 0xEF) {
						ppi.pb = (this.SHIFT &= 1) ? 0xFE : 0xFB
						return
					} else if (this.RUS & 0x02) {
						if ((a == 0xEF && !(this.RUS & 1)) || (a == 0xF7 && (this.RUS & 1)))
							this.RUS &= 1
						ppi.pb = this.RUS & 0x02 ? 0xFF : 0xFD
						return
					}
					if (this.OUT) {
						if (a == this.IN) {
							ppi.pb = this.OUT
							this.OUT = 0
						} else {
							ppi.pb = 0xFF
						}
						return
					}
					let b = this.key (a)
					if (b === null) {
						ppi.hook = kbd.hook
						resolve ()
					} else if (isNumber (b)) {
						let RUS = b >> 9 & 1
						let SHIFT = b >> 8 & 1
						b &= 0xFF
						if (b != 0xFF && (this.RUS != RUS || this.SHIFT != SHIFT)) {
							this.IN = a
							this.OUT = b
							this.RUS = RUS | 0x02
							this.SHIFT = SHIFT | 0x02
							b = 0xFF
						}
						ppi.pb = b
					}
				}
			}
		})
	}

	IN = 0
	OUT = 0
	RUS = 0
	SHIFT = 0

	KEYS = {
		"\n":	0x0BFBF, "\t":	0x0FDFD,
		"0":	0x0FA7F, "1":	0x0F7FD, "2":	0x0EFFD, "3":	0x0DFFD,
		"4":	0x0BFFE, "5":	0x07FFD, "6":	0x0FCFD, "7":	0x0FAFE,
		"8":	0x0F8FE, "9":	0x0F87F, ":":	0x0BF7F, ";":	0x0FBFE,
		",":	0x0F8EF, "-":	0x0FC7F, ".":	0x0FCDF, "/":	0x07F7F,
		"@":	0x0F8F7, "A":	0x0DFF7, "B":	0x0FAF7, "C":	0x0F7FB,
		"D":	0x0F8FB, "E":	0x0BFFD, "F":	0x0FBFB, "G":	0x0FCFB,
		"H":	0x0FABF, "I":	0x0BFF7, "J":	0x0FBFD, "K":	0x0DFFB,
		"L":	0x0FAFB, "M":	0x0DFEF, "N":	0x07FFB, "O":	0x0FCF7,
		"P":	0x0BFFB, "Q":	0x0FBF7, "R":	0x07FF7, "S":	0x0EFEF,
		"T":	0x07FEF, "U":	0x0EFFB, "V":	0x0F8DF, "W":	0x0EFF7,
		"X":	0x0FCEF, "Y":	0x0F7F7, "Z":	0x0F8BF, "[":	0x0FAFD,
		"\\":	0x0FADF, "]":	0x0F8FD, "^":	0x0F7EF, " ":	0x0BFEF,
		"_":	0x0FCBF, "!":	0x1F7FD, "\"":	0x1EFFD, "#":	0x1DFFD,
		"$":	0x1BFFE, "%":	0x17FFD, "&":	0x1FCFD, "'":	0x1FAFE,
		"(":	0x1F8FE, ")":	0x1F87F, "*":	0x1BF7F, "+":	0x1FBFE,
		"<":	0x1F8EF, "=":	0x1FC7F, ">":	0x1FCDF, "?":	0x17F7F,
		"Ю":	0x2F8F7, "А":	0x2DFF7, "Б":	0x2FAF7, "Ц":	0x2F7FB,
		"Д":	0x2F8FB, "Е":	0x2BFFD, "Ф":	0x2FBFB, "Г":	0x2FCFB,
		"Х":	0x2FABF, "И":	0x2BFF7, "Й":	0x2FBFD, "К":	0x2DFFB,
		"Л":	0x2FAFB, "М":	0x2DFEF, "Н":	0x27FFB, "О":	0x2FCF7,
		"П":	0x2BFFB, "Я":	0x2FBF7, "Р":	0x27FF7, "С":	0x2EFEF,
		"Т":	0x27FEF, "У":	0x2EFFB, "Ж":	0x2F8DF, "В":	0x2EFF7,
		"Ь":	0x2FCEF, "Ы":	0x2F7F7, "З":	0x2F8BF, "Ш":	0x2FAFD,
		"Э":	0x2FADF, "Щ":	0x2F8FD, "Ч":	0x2F7EF,
		"{":	0x0FAFD, "}":	0x0F8FD, "~":	0x1F7EF
	}
}

