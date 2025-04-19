//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.confetti.js


August.initModule ("confetti", function ( win ) {
	function confetti ( opts ) {
		if ($Hidden)
			return
		if (!$Canvas) {
			$Canvas = Chat.root.append ("canvas").css ("position:fixed;inset:0;width:100%;height:100%;z-index:999;pointer-events:none")
			$Context = $Canvas.getContext ("2d")
		}
		let opt = { ...$DEFAULTS, ...opts }
		let Start = !$Fettis.length
		let StartX = $Canvas.offsetWidth * opt.x
		let StartY = $Canvas.offsetHeight * opt.y
		let Angle = opt.angle * Math.PI / 180
		let Spread = opt.spread * Math.PI / 180
		let Decay = opt.decay + ($Canvas.offsetHeight > 600 ? ($Canvas.offsetHeight - 600) / 10000 : 0)
		while (opt.count--) {
			$Fettis.push ({
				x:		StartX,
				y:		StartY,
				wobble:		rnd (10),
				tilt:		rnd (Math.PI),
				angle:		Spread / 2 - rnd (Spread) - Angle,
				velocity:	opt.velocity / 2 + rnd (opt.velocity),
				color:		opt.colors [opt.count % opt.colors.length],
				rect:		opt.count & 1,
				decay:		Decay,
				tick:		0,
				ticks:		opt.ticks,
				scalar:		opt.scalar,
				gravity:	opt.gravity * 3,
				opacity:	opt.opacity
			})
		}
		if (Start)
			requestAnimationFrame (animate)
	}
	function animate () {
		if (!$Fettis.length)
			return done ()
		if ($Resized) {
			$Resized = 0
			$Canvas.width = $Canvas.offsetWidth
			$Canvas.height = $Canvas.offsetHeight
		}
		$Context.clearRect (0, 0, $Canvas.offsetWidth, $Canvas.offsetHeight)
		$Fettis = $Fettis.filter (update)
		requestAnimationFrame (animate)
	}
	function update ( f ) {
		f.x += Math.cos (f.angle) * f.velocity
		f.y += Math.sin (f.angle) * f.velocity + f.gravity
		f.velocity *= f.decay
		f.wobble += .1
		f.tilt += .1
		let n = rnd (1) + 5
		let wx = f.x + 13 * f.scalar * Math.cos (f.wobble)
		let wy = f.y + 13 * f.scalar * Math.sin (f.wobble)
		let tc = Math.cos (f.tilt)
		let ts = Math.sin (f.tilt)
		let x1 = f.x + n * tc
		let y1 = f.y + n * ts
		let x2 = wx + n * tc
		let y2 = wy + n * ts
		if (f.opacity)
			$Context.globalAlpha = 1 - (f.tick / f.ticks) ** 3
		$Context.fillStyle = f.color
		$Context.beginPath ()
		if (f.rect) {
			$Context.moveTo (f.x, f.y)
			$Context.lineTo (wx, y1)
			$Context.lineTo (x2, y2)
			$Context.lineTo (x1, wy)
		} else {
			$Context.ellipse (
				f.x,
				f.y,
				Math.abs (x2 - x1) * .6,
				Math.abs (y2 - y1) * .6,
				f.wobble * .3,
				0,
				2 * Math.PI
			)
		}
		$Context.closePath ()
		$Context.fill ()
		return ++f.tick < f.ticks
	}
	function rnd ( n ) {
		return Math.random () * n
	}
	function resize () {
		$Resized = 1
	}
	function hidden ( h ) {
		$Hidden = h
	}
	function fire ( opts ) {
		confetti ({
			count:		50,
			spread:		26,
			velocity:	55,
			...opts
		})
		confetti ({
			count:		40,
			spread:		60,
			...opts
		})
		confetti ({
			count:		70,
			spread:		100,
			decay:		.91,
			scalar:		.8,
			...opts
		})
		confetti ({
			count:		20,
			spread:		120,
			velocity:	25,
			decay:		.92,
			scalar:		1.2,
			...opts
		})
		confetti ({
			count:		20,
			spread:		120,
			velocity:	45,
			...opts
		})
	}
	function event ( ev, p1, p2 ) {
		switch (ev) {
			case "USER_BD":
			case "@USER_BD":
				setTimeout (fire)
				setTimeout (_ => fire ({ x: 0, angle: 60 }), 1000)
				setTimeout (_ => fire ({ x: 1, angle: 120 }), 2000)
				break
			case "@FIREWORK": {
				let opt = {
					count:		(+p2).clamp (50, 200),
					ticks:		60,
					velocity:	10,
					decay:		.94,
					spread:		360,
					scalar:		.6,
					opacity:	1,
					gravity:	0
				}
				let cou = (+p1).clamp (10, 100)
				let ani = () => {
					confetti ({ ...opt, x: Math.rnd (.1, .5), y: Math.rnd (0, .8) })
					confetti ({ ...opt, x: Math.rnd (.5, .9), y: Math.rnd (0, .8) })
					if (--cou > 0)
						setTimeout (ani, 250)
				}
				setTimeout (ani)
				break
			}
			case "@CONFETTI": {
				let a = [
					{ x: .5, angle: 90 },
					{ x: 0, angle: 60 },
					{ x: 1, angle: 120 }
				]
				let opt = { count: (+p2).clamp (50, 1000) }
				let cou = (+p1).clamp (1, 10)
				let ani = () => {
					confetti ({ ...opt, ...a [rnd (a.length) | 0] })
					if (--cou > 0)
						setTimeout (ani, 1000)
				}
				setTimeout (ani)
				break
			}
			case "@CONFETTI2": {
				let opt = { count: 2, scalar: .8, spread: 55, colors: ["#b00", "#fff"] }
				let end = Date.now () + (+p1).clamp (1, 15) * 1000
				let ani = () => {
					confetti ({ ...opt, x: 0, angle: 60 })
					confetti ({ ...opt, x: 1, angle: 120 })
					if (Date.now () < end)
						requestAnimationFrame (ani)
				}
				setTimeout (ani)
				break
			}
		}
	}
	function destroy () {
		if ($Canvas) {
			$Fettis.length = 0
			done ()
		}
	}
	function done () {
		Chat.root.remove ($Canvas)
		$Animation = $Canvas = $Context = null
		$Resized = 1
	}
	this.init = function () {
	}

	const $DEFAULTS = {
		x:		.5,
		y:		1,
		angle:		90,
		count:		100,
		spread:		100,
		velocity:	45,
		decay:		.94,
		gravity:	1,
		scalar:		1,
		ticks:		600,
		colors:		["#2cf", "#a5f", "#f57", "#8f5", "#ff4", "#fa2", "#f3f"]
	}

	let $Fettis = []
	let $Canvas = null
	let $Context = null
	let $Resized = 1
	let $Hidden = 0

	Chat.Event.on ("destroy", destroy)
		.on ("event", event)
		.on ("window-resize", resize)
		.on ("window-hidden", hidden)
})
