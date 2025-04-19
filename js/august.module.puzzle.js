//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.puzzle.js


August.initModule ("puzzle", function ( win ) {
	function chip ( pic, sx, sy, p ) {
		this.w = pic.width / sx
		this.h = pic.height / sy
		this.p = p
		this.sx = sx
		this.sy = sy
		this.bn = 1 << p
		this.bp = 1 << p
		this.chip = el ("div", "chip").size (this.w, this.h)
		this.pos (this.w * (p % sx), this.h * Math.floor (p / sx))
		this.chip.img = this.chip.append ("img").pos (-this.x, -this.y)
		this.chip.img.src = pic.src
	}
	chip.prototype = {
		node () {
			return this.chip
		},
		pos ( x, y ) {
			this.chip.pos (x, y)
			this.x = x
			this.y = y
			return this
		},
		move_to ( p, f ) {
			this.p = p
			this.bp = 1 << p
			let x = (p % this.sx) * this.w
			let y = Math.floor (p / this.sx) * this.h
			let x0 = this.x
			let y0 = this.y
			let len = ( x, y ) => Math.hypot (x0 - x, y0 - y)
			let move = ( s, d, l ) => {
				let m = s * $MOVE_SPEED / d
				let x1 = Math.round (x0 + m * (x - x0))
				let y1 = Math.round (y0 + m * (y - y0))
				if (len (x1, y1) < l) {
					this.pos (x1, y1)
					this.af = win.requestAnimationFrame (move.bind (null, s + 1, d + 1, l))
				} else {
					this.pos (x, y)
					this.af = 0
					f ()
				}
			}
			if (this.af)
				win.cancelAnimationFrame (this.af)
			let l = len (x, y)
			move (1, $MOVE_SPEED + l * 2 / 3, l)
			return this
		}
	}
	function puzzle ( pic, sx, sy ) {
		function click ( e ) {
			let r = Game.getBoundingClientRect ()
			let cx = (e.clientX - r.x) / r.width
			let cy = (e.clientY - r.y) / r.height
			let x = sx * cx | 0
			let y = sy * cy | 0
			let p = y * sx + x
			if (Field [p].test (Empty) && PlayGame) {
				Game.setClass ("click", 0).props ({
					"--left": `${cx * pic.width + .5 | 0}px`,
					"--top":  `${cy * pic.height + .5 | 0}px`
				})
				win.setTimeout (_ => Game.setClass ("click", 1))
				move (p)
			}
		}
		function keydown ( e ) {
			e.preventDefault ()
			if (e.repeat)
				return
			let p = Empty + (e.keyCode == $KEY.UP
				? sx
				: e.keyCode == $KEY.DOWN
				? -sx
				: e.keyCode == $KEY.LEFT
				? 1
				: e.keyCode == $KEY.RIGHT
				? -1
				: 0)
			if (isSet (Field [p]) && Field [p].test (Empty) && PlayGame)
				move (p)
		}
		function move ( p ) {
			PlayGame = 0
			if (!Moves++) {
				StartGame = August.now ()
				$Modal.setClass ("fire")
			}
			move_to (p, function () {
				if (Complete == END)
					end ()
				else
					PlayGame = 1
			})
		}
		function move_to ( p, cb ) {
			Chip [p].move_to (Empty, cb)
			Complete &= ~Chip [p].bn
			Complete |= Chip [p].bp & Chip [p].bn
			Chip [Empty] = Chip [p]
			Chip [p] = 0
			Empty = p
		}
		function end () {
			PlayGame = 0
			Chip [Empty] = new chip (pic, sx, sy, Empty)
			Game.append (Chip [Empty].node ())
			Game.setClass ("end")
			Game.dataset.score = `${(August.now () - StartGame).clock (5)}/${Moves}`
		}
		this.shuffle = function () {
			Game.remove (Chip [Empty].node ())
			Chip [Empty]--
			$MOVE_SPEED *= 5
			let Last = Empty
			let Prev = Empty
			let cc = 0
			let shuffle = () => {
				if (!Game || (++cc > Last * 15 && !Complete)) {
					PlayGame = 1
					$MOVE_SPEED /= 5
					$Modal && $Modal.setClass ("fire")
					return
				}
				let x = Empty % sx
				let y = (Empty - x) / sx
				do {
					let r = 999 * Math.random () & 3
					var p = r == 1
						? Empty + (x == sx - 1 ? -1 : 1)
						: r == 2
						? Empty + (y == sy - 1 ? -sx : sx)
						: r == 3
						? Empty + (x == 0 ? 1 : -1)
						: Empty + (y == 0 ? sx : -sx)
				} while (p == Prev)
				Prev = Empty
				move_to (p, shuffle)
			}
			shuffle ()
		}
		this.node = function () {
			return Game
		}
		this.done = function () {
			win.onkeydown = null
			Game.onclick = null
			Game = null
		}

		let Complete = 0
		let StartGame = 0
		let Moves = 0
		let PlayGame = 0
		let Empty = sx * sy - 1
		let Field = []
		for (let y = 0; y < sy; y++) {
			for (let x = 0; x < sx; x++) {
				let p = Field.length
				Field [p] = new august_bitset
				if (x + 1 < sx)
					Field [p].set (p + 1)
				if (x)
					Field [p].set (p - 1)
				if (y + 1 < sy)
					Field [p].set (p + sx)
				if (y)
					Field [p].set (p - sx)
			}
		}

		let Game = el ("div", "puzzle").size (pic.width, pic.height)
		let Chip = []
		for (let i = 0; i < Empty; i++) {
			Chip [i] = new chip (pic, sx, sy, i)
			Game.append (Chip [i].node ())
			Complete |= Chip [i].bn
		}
		let END = Complete
		Chip [Empty] = new chip (pic, sx, sy, Empty)
		Game.append (Chip [Empty].node ())

		win.onkeydown = keydown
		Game.onclick = click
		Game.ondragstart = e => e.stop ()
	}
	function win_resize () {
		$Puzzle.node ().s ({
			transform: `scale(${Math.min ($Modal.offsetWidth / $Puzzle.node ().offsetWidth, $Modal.offsetHeight / $Puzzle.node ().offsetHeight)})`
		})
	}
	function done () {
		Chat.Event.un ("window-resize", win_resize)
		win.clearTimeout ($Puzzle.to1)
		win.clearTimeout ($Puzzle.to2)
		$Puzzle.done ()
		$Modal = $Puzzle = null
	}
	function init ( pic, sx, sy ) {
		if (sx * sy > 32)
			return
		$Modal.setClass ("puzzle").addCSS ("bW9kYWwtbW9kdWxlLnB1enpsZXtwYWRkaW5nOjA7LS1jcnRsLXJpZ2h0OjJweDstLWNydGwtdG9wOjJweDstLWN0cmwtc2l6ZToyN3B4Oy0tY3RybC1ib3JkZXI6MnB4IHNvbGlkICNmMDA7LS1jdHJsLXJhZGl1czowOy0tY3RybC1zaGFkb3c6bm9uZTstLWN0cmwtYmc6dHJhbnNwYXJlbnQ7LS1jdHJsLWRlY29yLWhvdmVyLWJnOiM0MDA7LS1jdHJsLWZpbHRlcjpicmlnaHRuZXNzKDQpfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXd7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO292ZXJmbG93OmhpZGRlbn0KbW9kYWwtbW9kdWxlLnB1enpsZT5tb2RhbC12aWV3PmRpdi5wdXp6bGV7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZDojZmZmO2JvcmRlcjoxMHB4IHNvbGlkICMwZjA7b3BhY2l0eTowO3RyYW5zaXRpb246b3BhY2l0eSAuM3MgLjFzLCB0cmFuc2Zvcm0gLjNzfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXc+ZGl2LnB1enpsZT5kaXYuY2hpcHtwb3NpdGlvbjphYnNvbHV0ZTtvdmVyZmxvdzpoaWRkZW59Cm1vZGFsLW1vZHVsZS5wdXp6bGU+bW9kYWwtdmlldz5kaXYucHV6emxlPmRpdi5jaGlwIGltZ3twb3NpdGlvbjphYnNvbHV0ZTtwb2ludGVyLWV2ZW50czpub25lfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXc+ZGl2LnB1enpsZS5zaG93e29wYWNpdHk6MX0KbW9kYWwtbW9kdWxlLnB1enpsZT5tb2RhbC12aWV3PmRpdi5wdXp6bGUuZW5ke2JvcmRlci1jb2xvcjojZmY2fQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXc+ZGl2LnB1enpsZS5lbmQ+ZGl2OmZpcnN0LWNoaWxke292ZXJmbG93OnZpc2libGU7YW5pbWF0aW9uOnB1enpsZS1maWx0ZXIgLjZzfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXc+ZGl2LnB1enpsZS5lbmQ+Kjpub3QoOmZpcnN0LWNoaWxkKXtkaXNwbGF5Om5vbmV9Cm1vZGFsLW1vZHVsZS5wdXp6bGU+bW9kYWwtdmlldz5kaXYucHV6emxlLmVuZDo6YmVmb3Jle2NvbnRlbnQ6YXR0cihkYXRhLXNjb3JlKTtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjE7bGVmdDowO2JvdHRvbTowO3BhZGRpbmc6NXB4IC41ZW07Zm9udC1zaXplOjNlbTtjb2xvcjojZmY2O2JhY2tncm91bmQ6IzAwMDM7Ym9yZGVyLXJhZGl1czoxZW07dGV4dC1zaGFkb3c6MCAwIDMwcHggIzAwMCwgMCAwIDIwcHggIzAwMCwwIDAgMTBweCAjMDAwfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXc+ZGl2LnB1enpsZTpub3QoLmVuZCk6OmFmdGVye2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoxO2xlZnQ6dmFyKC0tbGVmdCk7dG9wOnZhcigtLXRvcCk7ZGlzcGxheTpub25lO3dpZHRoOjQwcHg7aGVpZ2h0OjQwcHg7bWFyZ2luOi0yMHB4IDAgMCAtMjBweDtiYWNrZ3JvdW5kOiMwMGY7Ym9yZGVyLXJhZGl1czo1MCV9Cm1vZGFsLW1vZHVsZS5wdXp6bGU+bW9kYWwtdmlldz5kaXYucHV6emxlOm5vdCguZW5kKS5jbGljazo6YWZ0ZXJ7ZGlzcGxheTpibG9jazthbmltYXRpb246cHV6emxlLWNsaWNrIC4zcyBmb3J3YXJkc30KbW9kYWwtbW9kdWxlLnB1enpsZT5tb2RhbC12aWV3OjphZnRlcntkaXNwbGF5Om5vbmU7ei1pbmRleDoxO2ZvbnQtc2l6ZTowO2NvbG9yOiNmMzM7YmFja2dyb3VuZDojMDAwMztwYWRkaW5nOjEwMCU7dGV4dC1zaGFkb3c6MCAwIDJ2bWluICMwMDA7d2hpdGUtc3BhY2U6bm93cmFwfQptb2RhbC1tb2R1bGUucHV6emxlPm1vZGFsLXZpZXcuZmlyZTo6YWZ0ZXJ7Y29udGVudDoiRmlyZSBhd2F5ISI7ZGlzcGxheTpibG9jazthbmltYXRpb246cHV6emxlLWZpcmUgNXN9CkBrZXlmcmFtZXMgcHV6emxlLWNsaWNrezAle3RyYW5zZm9ybTpzY2FsZSguMSk7b3BhY2l0eToxfSAzMCV7b3BhY2l0eToxfSAxMDAle3RyYW5zZm9ybTpzY2FsZSgxLjUpO29wYWNpdHk6MH19CkBrZXlmcmFtZXMgcHV6emxlLWZpcmV7MTAle2ZvbnQtc2l6ZToxNnZtaW59IDEwMCV7Zm9udC1zaXplOjE2dm1pbjtjb250ZW50OnVuc2V0fX0KQGtleWZyYW1lcyBwdXp6bGUtZmlsdGVyezAle2ZpbHRlcjpjb250cmFzdCguNSkgYnJpZ2h0bmVzcygyKX0gMTAwJXtmaWx0ZXI6Y29udHJhc3QoMSkgYnJpZ2h0bmVzcygxKX19")
		$MOVE_SPEED = pic.width / 50 | 0 + 1
		$Puzzle = new puzzle (pic, sx, sy)
		$Modal.append ($Puzzle.node ())
		$Puzzle.to1 = win.setTimeout (_ => $Puzzle.shuffle (), 1500)
		$Puzzle.to2 = win.setTimeout (_ => $Puzzle.node ().setClass ("show"), 100)
		win_resize ()
		Chat.Event.on ("window-resize", win_resize)
	}
	this.init = function ( ... args ) {
		if (!args [0])
			return Chat.con ("$!PUZZLE ERROR!$: no args")

		let PuzzlePic = new Image
		PuzzlePic.src = `images/$games/${args [0]}`
		PuzzlePic.onload = () => Chat.loadModule ("modal", [fn => {
			$Modal = fn ({ options: { noscrollbar: 1, close: done }})
			init (PuzzlePic, ...(args.length == 3 ? [args [1]|0, args [2]|0] : [4, 4]))
		}], 1)
		PuzzlePic.onerror = () => {
			Chat.con ("$!PUZZLE ERROR!$: `?`", PuzzlePic.src)
		}
	}

	let el = ( n, c ) => $Modal.create (n, { className: c })

	const $KEY = {
		UP:	38,
		DOWN:	40,
		LEFT:	37,
		RIGHT:	39
	}

	let $Modal = null
	let $Puzzle = null
	let $MOVE_SPEED = 0
})
