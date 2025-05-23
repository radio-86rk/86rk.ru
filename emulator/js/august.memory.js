//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.memory.js


"use strict"

class august_memory {
	constructor ( size, mem ) {
		this.Size = size
		this.Read = new Map
		this.Write = new Map
		if (!mem)
			return
		if (isArray (mem.rw)) for (let m of mem.rw)
			this.insert (m.addr, m.size, m.area)
		if (isArray (mem.ro)) for (let m of mem.ro)
			this.insert (m.addr, m.size, m.area, { rd: 1 })
		if (isArray (mem.wo)) for (let m of mem.wo)
			this.insert (m.addr, m.size, m.area, { wr: 1 })
	}
	insert ( addr, size, area, mode = { rd: 1, wr: 1 } ) {
		if (isType (area, Uint8Array))
			area = new august_memory.array (area)
		for (let i = 0; i < size; i++) {
			let a = addr + i
			if (a >= this.Size)
				throw Error ("out of bounds")
			if (area instanceof august_device)
				area.dev = true
			if (mode.rd) {
				if (this.Read.has (a))
					throw Error (`intersection at address ${a.hex16}`)
				this.Read.set (a, area)
			}
			if (mode.wr) {
				let wr = this.Write.get (a)
				if (!isSet (wr))
					this.Write.set (a, area)
				else if (isArray (wr))
					this.Write.set (a, [... wr, area])
				else
					this.Write.set (a, [wr, area])
			}
		}
		return this
	}
	get ( a ) {
		if (a >= this.Size) {
			console.error ("out of bounds")
			return august_memory.DUMMY_MEM
		}
		let d = this.Read.get (a)
		return isSet (d)
			? d.get (a % d.length)
			: august_memory.DUMMY_MEM
	}
	set ( a, v ) {
		if (a >= this.Size) {
			console.error ("out of bounds")
			return v
		}
		let d = this.Write.get (a)
		if (isArray (d)) for (let d1 of d)
			d1.set (a % d1.length, v)
		else if (isSet (d))
			d.set (a % d.length, v)
		return v
	}
	is_device ( a ) {
		return a < this.Size && this.Read.get (a)?.dev
	}
	get size () {
		return this.Size
	}

	static array = class extends Uint8Array {
		constructor ( array ) {
			super (array.buffer)
		}
		get ( a ) {
			return this [a]
		}
		set ( a, v ) {
			return this [a] = v
		}
	}

	static DUMMY_MEM = 0xFF
}

class august_io extends august_memory {
	interrupt ( iff ) {
	}
	halted () {
	}
}

class august_device {
	constructor ( size, array = Uint8Array ) {
		this.r = new array (size)
	}
	done () {
	}
	get length () {
		return this.r.length
	}
	get hook () {
		return this.hook_handler
	}
	set hook ( h ) {
		return this.hook_handler = h
	}
	get ( r ) {
		return this.r [r]
	}
	set ( r, v ) {
		return this.r [r] = v
	}
}

