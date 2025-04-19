//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.tetris.js


August.initModule ("tetris", function ( win ) {
	function handler_keydown ( e ) {
		e.preventDefault ()
		if ($Stat == $STAT.STARTED) {
			$Key = { code: e.keyCode, ctrl: e.ctrlKey || e.altKey, repeat: e.repeat }
		} else if ($Stat == $STAT.PAUSED) {
			if (e.keyCode == $KEY.PAUSE && !e.repeat)
				start_game ()
		} else if ($Stat == $STAT.STOPPED) {
			if (e.keyCode == $KEY.NEW_GAME && !e.ctrlKey)
				new_game ()
			else if (e.keyCode == $KEY.NEW_GAME && e.ctrlKey)
				continue_game ()
			else if (e.keyCode == $KEY.ESCAPE)
				Chat.$Modules.modal.close (e)
		}
		return false
	}
	function handler_touch ( e ) {
		if (e.type == "touchstart") {
			let a = e.$.attr ("ctrl")
			let code = a == "left"
				? $KEY.LEFT
				: a == "right"
				? $KEY.RIGHT
				: a == "rotate"
				? $KEY.ROTATE
				: a == "down"
				? $KEY.DOWN
				: a == "drop"
				? $KEY.DROP
				: 0
			if (code)
				$Key = { code }
		} else if (e.type == "touchend") {
			$Key = { code: 0 }
		}
	}
	function handler_sc ( e ) {
		e.$.parent ().remove (e.$)
	}
	function handler_click ( el ) {
		if (el.ownerDocument.defaultView != win)
			return
		if (el.name == "tetris-new-game")
			new_game ()
		else if (el.name == "tetris-continue-game")
			continue_game ()
	}
	function new_game () {
		if ($Stat == $STAT.STARTED)
			return
		for (let y = 0; y < $Board.Size.y; y++) {
			$Board [y] = $Board.Empty
			for (let x = 0; x < $Board.Size.x; x++)
				cell (x, y).className = ""
		}
		$Piece.Next = []
		$Board [-1] = $Board.Empty
		$Board [$Board.Size.y] = -1
		$Score = $Lines = 0
		$Level = 1
		$GameTime = $PauseTime = August.now ()
		$Time.Delay = $DELAY [0]
		$Time.Start = 0
		out_value ("score", $Score)
		out_value ("lines", $Lines)
		out_value ("level", $Level)
		new_piece ()
		new_piece ()
		start_game ()
		request (3)
		let hs = $Modal.$("tetris-high-score")
		if (hs) {
			hs.innerHTML = ""
			hs.setHeight (null)
		}
	}
	function continue_game () {
		if ($Stat != $STAT.STOPPED)
			return
		if (!$Board.Stat)
			return new_game ()
		for (let y = 0; y < $Board.Size.y; y++) {
			for (let x = 0; x < $Board.Size.x; x++)
				cell (x, y).className = $Board.Stat [y][x]
		}
		$Board.Stat = null
		$Time.Start = August.now ()
		out_value ("score", $Score)
		out_value ("lines", $Lines)
		out_value ("level", $Level)
		next_piece ()
		start_game ()
	}
	function new_piece () {
		let n = $PIECES.length * Math.random () | 0
		$Piece = $Piece.Next
		$Piece.Next = $PIECES [n]
		$Piece.Next.n = n + 1
		$Piece.Loc = { x: $Board.Size.x / 2 - 2 | 0, y: -2 }
		$Piece.Rot = 0
		next_piece ()
	}
	function next_piece () {
		if ($Next && $Next.parent ().getStyleList ().display != "none") {
			for (let i = 0, m = 0x0800; i < 8; m >>= 1, i++)
				$Next.el (i >> 2).el (i & 3).className = $Piece.Next [0] & m ? `mino${$Piece.Next.n}` : ``
		}
	}
	function fn_piece ( fn ) {
		for (let i = 0, m = 0x8000; i < 16; m >>= 1, i++) {
			if ($Piece [$Piece.Rot] & m && $Piece.Loc.y + (i >> 2) >= 0)
				fn (cell ($Piece.Loc.x + (i & 3), $Piece.Loc.y + (i >> 2)))
		}
	}
	function draw_piece ( x, y, r = $Piece.Rot ) {
		let test = ( x, y ) => {
			let Place = 0
			for (let i = 0; i < 4; i++)
				Place = (Place << 4) | (($Board [y + i] >> $Board.Size.x - x - 2) & 0x0F)
			return !($Piece [r] & Place)
		}
		let ok = test (x, y)
		if (ok) {
			let q = $Piece.Loc == { x, y }
			fn_piece (c => c.className = "")
			$Piece.Loc = { x, y }
			$Piece.Rot = r
			fn_piece (c => c.className = `mino${$Piece.n}`)
			$Time.Last = !test (x, y + 1)
		}
		return ok
	}
	function fix_piece () {
		fn_piece (c => c.setClass ("fix"))
		for (let i = 0; i < 4; i++)
			$Board [$Piece.Loc.y + i] |= (($Piece [$Piece.Rot] >> 12 - 4 * i) & 0x0F) << $Board.Size.x - $Piece.Loc.x - 2
		let Lines = 0
		for (let y = $Board.Size.y; y--;) {
			if ($Board [y] == -1) {
				$Tetris.remove ($Tetris.el (y + Lines))
				$Tetris.insert ("div", $Tetris.first ()).innerHTML = $Tetris.row ()
				Lines++
			} else if (Lines) {
				$Board [y + Lines] = $Board [y]
			}
		}
		$Board.fill ($Board.Empty, 0, Lines)
		if (Lines) {
			let Points = $Level * (Lines == 1
				? $POINTS.SINGLE
				: Lines == 2
				? $POINTS.DOUBLE
				: Lines == 3
				? $POINTS.TRIPLE
				: Lines == 4
				? $POINTS.TETRIS
				: 0
			)
			$Score += Points
			$Lines += Lines
			if ($Lines >= $Level * $LINES_PER_LEVEL) {
				$Time.Delay = $DELAY [$Level]
				$Level++
				if ($LevelTip) {
					$Tetris.setClass ("level", 0)
					$Tetris.attr ("level", $LevelTip.tpl ({ NUM: $Level }))
					setTimeout (_ => $Tetris.setClass ("level", 1))
				}
			}
			let sc = $Tetris.last ().append ("div")
			sc.className = `l${Lines}`
			sc.textContent = Points
			sc.props ({
				"--height":	`-${$Tetris.clientHeight}px`,
				"--top":	`${($Piece.Loc.y + 2) * $Tetris.clientHeight / $Board.Size.y}px`
			}).s ({
				left:		`${($Piece.Loc.x + 1) * $Tetris.clientHeight / $Board.Size.y}px`
			}).setClass ("fly")
			out_value ("score", $Score)
			out_value ("lines", $Lines)
			out_value ("level", $Level)
		}
	}
	function rotate_piece ( r ) {
		r = ($Piece.Rot + r) & 3
		return	draw_piece ($Piece.Loc.x, $Piece.Loc.y, r) ||
			draw_piece ($Piece.Loc.x, $Piece.Loc.y - 1, r) ||
			draw_piece ($Piece.Loc.x + 1, $Piece.Loc.y, r) ||
			draw_piece ($Piece.Loc.x - 1, $Piece.Loc.y, r) ||
			draw_piece ($Piece.Loc.x + 1, $Piece.Loc.y + 1, r) ||
			draw_piece ($Piece.Loc.x - 1, $Piece.Loc.y + 1, r) ||
			draw_piece ($Piece.Loc.x + 2, $Piece.Loc.y, r) ||
			draw_piece ($Piece.Loc.x - 2, $Piece.Loc.y, r)
	}
	function start_game () {
		$Stat = $STAT.STARTED
		$Tetris.className = $Modal.className = ""
		$GameTime += August.now () - $PauseTime
		animate ()
	}
	function pause_game () {
		if ($Stat != $STAT.STARTED)
			return false
		$Tetris.className = "pause"
		$PauseTime = August.now ()
		return true
	}
	function game_over () {
		$Stat = $STAT.STOPPED
		$Tetris.className = $Modal.className = "game-over"
		request (5, { s: $Score, c: $Level, t: August.now () - $GameTime, [$Tetris.Key]: "" })
	}
	function cell ( x, y ) {
		return $Tetris.el (y).el (x)
	}
	function out_value ( p, v ) {
		p = $Modal.$(`tetris-${p}`)
		if (p) {
			if (isFunction (v))
				v = v ()
			p.attr ("value", isNumber (v) ? v.numeral ("\u2009") : v)
		}
	}
	function animate ( now = 0 ) {
		if ($Stat != $STAT.STARTED)
			return

		if ($Tetris.Touch) {
			if ($Tetris.Touch.dx) {
				$Key.code = $Tetris.Touch.dx < 0 ? $KEY.LEFT : $KEY.RIGHT
				$Tetris.Touch.dx = 0
			} else if ($Tetris.Touch.drop) {
				$Key.code = $KEY.DROP
				$Tetris.Touch.drop = 0
				$Tetris.Touch.dy = 0
			} else if ($Tetris.Touch.dy) {
				$Key.code = $KEY.DOWN
				$Tetris.Touch.dy = 0
			} else if ($Tetris.Touch.r) {
				$Key.code = $KEY.ROTATE
				$Tetris.Touch.r = 0
			}
		}
		switch ($Key.code) {
			case $KEY.ROTATE_CW:
				if (!$Key.repeat) {
					if (rotate_piece (1))
						$Time.Move = now
				}
				break
			case $KEY.ROTATE_CCW:
				if (!$Key.repeat) {
					if (rotate_piece (-1))
						$Time.Move = now
				}
				break
			case $KEY.KEY_W:
			case $KEY.ROTATE:
				if (!$Key.repeat) {
					if (rotate_piece ($Key.ctrl ? -1 : 1))
						$Time.Move = now
				}
				break
			case $KEY.KEY_S:
			case $KEY.DOWN:
			case $KEY.DOWN2:
				if (!$Key.ctrl) {
					if (draw_piece ($Piece.Loc.x, $Piece.Loc.y + 1)) {
						$Score += $POINTS.SOFT_DROP
						out_value ("score", $Score)
					}
					break
				}
			case $KEY.DROP:
				if ($Key.repeat)
					break
				while (draw_piece ($Piece.Loc.x, $Piece.Loc.y + 1))
					$Score += $POINTS.HARD_DROP
				out_value ("score", $Score)
				$Time.Start = 0
				break
			case $KEY.KEY_A:
			case $KEY.LEFT:
			case $KEY.LEFT2:
				while (draw_piece ($Piece.Loc.x - 1, $Piece.Loc.y)) {
					$Time.Move = now
					if (!$Key.ctrl)
						break
				}
				break
			case $KEY.KEY_D:
			case $KEY.RIGHT:
			case $KEY.RIGHT2:
				while (draw_piece ($Piece.Loc.x + 1, $Piece.Loc.y)) {
					$Time.Move = now
					if (!$Key.ctrl)
						break
				}
				break
			case $KEY.PAUSE:
				pause_game ()
				$Stat = $STAT.PAUSED
				break
		}
		$Key = {}
		if (now - $Time.Tic > 500) {
			$Time.Tic = now
			out_value ("time", _ => (August.now () - $GameTime).clock (3))
		}
		if ($Time.Last
			? now - $Time.Move > $Time.MoveDelay || now - $Time.Start > $Time.LastDelay
			: now - $Time.Start > $Time.Delay
		) {
			$Time.Start = $Time.Move = now
			if (!draw_piece ($Piece.Loc.x, $Piece.Loc.y + 1)) {
				$Time.Last = 0
				fix_piece ()
				new_piece ()
				if (!draw_piece ($Piece.Loc.x, $Piece.Loc.y + 1))
					return game_over ()
			}
		}
		requestAnimationFrame (animate)
	}
	function request ( x, d ) {
		if (User.ID)
			Chat.sendCmd (28, Object.assign ({ x, g: $Tetris.id, o: 2, m: "Tetris" }, d))
	}
	function event ( ev, p1, p2, m ) {
		if (m == "Tetris") switch (ev) {
			case "GAME_KEY":
				$Tetris.Key = p1
				break
			case "GAME_SCORE": {
				let hs = $Modal.$("tetris-high-score")
				if (hs) {
					hs.setClass ("loading", 0)
					let pad = hs.offsetHeight
					let df = hs.attr ("date-fmt") || "d mmm HH:ii"
					let lang = hs.attr ("lang") || ""
					let e = hs.attr ("empty") || ""
					for (let i = 0; i < 10; i++) {
						let p = p2 [i]
						let n = p ? p.n : e
						let s = p ? p.s.numeral () : e
						let d = p ? p.d.date (df, lang) : e
						let r = hs.append ("div", { innerHTML: `<div>${n}</div><div>${s}</div><div>${d}</div>` })
						if (p && p.id == +hs.dataset.id)
							r.className = "hl"
					}
					hs.setHeight (`${100 * (hs.scrollHeight - pad) / Math.min ($Modal.offsetWidth, $Modal.offsetHeight)}vmin`)
					$Modal.setClass ("wait", 0)
				}
				break
			}
			case "GAME_RECORD":
				if (p1 == $Tetris.id)
					out_value ("record", p2 ? p2.s : "0")
				break
			case "GAME_END": {
				let hs = $Modal.$("tetris-high-score")
				if (hs) {
					$Modal.setClass ("wait", 1)
					hs.setClass ("loading", 1)
					hs.dataset.id = p2
					request (2)
				}
				break
			}
		}
	}
	function win_focus ( on ) {
		if (on) {
			if ($Stat == $STAT.BLURRED)
				start_game ()
		} else if (pause_game ()) {
			$Stat = $STAT.BLURRED
		}
	}
	function win_resize () {
		clearTimeout ($Modal.to)
		$Modal.to = setTimeout (_ => $Tetris.width (), 30)
	}
	function done () {
		if ($Stat == $STAT.STARTED || $Stat == $STAT.PAUSED) {
			$Board.Stat = []
			for (let y = 0; y < $Board.Size.y; y++) {
				$Board.Stat [y] = []
				for (let x = 0; x < $Board.Size.x; x++)
					$Board.Stat [y].push (cell (x, y).className)
			}
		}
		pause_game ()
		$Tetris.last ().un ("transitionend", handler_sc)
		win.removeEventListener ("keydown", handler_keydown)
		Chat.Event.un ("window-resize", win_resize)
			.un ("window-focus", win_focus)
			.un ("click", handler_click)
			.un ("event", event)
		$Touch && $Touch.done ()
		let Ctrl = $Modal.$("tetris-ctrl")
		Ctrl && Ctrl.un ("touchstart", handler_touch).un ("touchend", handler_touch)
		$Modal = $Tetris = null
		$Stat = $STAT.STOPPED
	}
	function init ( sx, sy ) {
		sx = Math.min (sx, 28)
		$Board.Size = { x: sx, y: sy }
		$Tetris = $Modal.$("tetris")
		if (!$Tetris)
			return
		$Tetris.width = () => $Tetris.s ({ width: `${$Tetris.clientHeight * sx / sy + $Tetris.offsetWidth - $Tetris.clientWidth}px` })
		$Tetris.row = () => "<div></div>".repeat (sx)
		$Tetris.id = `tetris_${sx}x${sy}`
		$Tetris.innerHTML = `<div>${$Tetris.row ()}</div>`.repeat (sy)
		$Tetris.append ("div").on ("transitionend", handler_sc)
		$Tetris.width ()
		$Next = $Modal.$("tetris-next-piece")
		if ($Next)
			$Next = $Next.append ("tetris", { innerHTML: `<div>${"<div></div>".repeat (4)}</div>`.repeat (2) })
		$Board.Empty = (-1 << sx + 2) + 3
		$Modal.className = "title"
		$LevelTip = $Tetris.attr ("level-tip")
		request (0)
		for (let f of ["score", "record", "lines", "level", "time"])
			out_value (f, "\u200b")
		win.addEventListener ("keydown", handler_keydown)
		Chat.Event.on ("window-resize", win_resize)
			.on ("window-focus", win_focus)
			.on ("click", handler_click)
			.on ("event", event)
		if ($Board.Stat)
			$Modal.setClass ("continue")
		if (!Chat.TouchScreen)
			return
		let Ctrl = $Modal.$("tetris-ctrl")
		if (Ctrl)
			Ctrl.on ("touchstart", handler_touch).on ("touchend", handler_touch)
		let Game = $Modal.$("tetris-game")
		Game.s ({ pointerEvents: "auto" })
		$Touch = new august_touch (Game, {
			start: e => {
				if ($Stat != $STAT.STARTED)
					return
				if (!$Tetris.Touch)
					$Tetris.Touch = {}
				$Tetris.Touch [e.id] = { x: e.x, y: e.y, mx: 1, my: 1, r: 1, d: [], k: sx / $Tetris.first ().offsetWidth }
				return true
			},
			move: e => {
				let t = $Tetris.Touch [e.id]
				if (!t)
					return
				if (t.mx) {
					let dx = (e.x - t.x) * t.k | 0
					if (dx) {
						$Tetris.Touch.dx = dx
						t.x = e.x
//						t.my = 0
					}
				}
				if (t.my && !t.drop) {
					let dy = (e.y - t.y) * t.k | 0
					if (dy) {
						if (dy > 0)
							$Tetris.Touch.dy = (t.r = 1, dy)
						else
							$Tetris.Touch.r = (t.r -= dy) & 1
						t.y = e.y
//						t.mx = 0
					}
					if (dy > 0) {
						t.d.push (August.now ())
						if (t.d.length == 4)
							t.d.shift ()
						$Tetris.Touch.drop = t.drop = t.d [2] - t.d [0] < 100
					}
				}
			},
			end: e => {
				delete $Tetris.Touch [e.id]
			},
			opt: 1
		})
	}
	this.init = function ( ... args ) {
		August.loadTPL ({ APL: "games", TPL: Chat.TPL })("tetris", tpl => Chat.loadModule ("modal", [fn => {
			let html = tpl.tetris.tpl ({ MONTHS: m => (Date.prototype.addMonths (m), "") })
			$Modal = fn ({ html, options: { noscrollbar: 1, noescapekey: 1, close: done }})
			init (...(args.length == 2 ? [args [0]|0, args [1]|0] : [10, 20]))
		}, "tetris"], 1))
	}

	const $STAT = new Enum ('STOPPED', 'STARTED', 'PAUSED', 'BLURRED')
	const $LINES_PER_LEVEL = 10
	const $DELAY = [
		1000, 800, 640, 510, 410, 330, 260, 210, 170, 140,
		 115, 100,  90,  80,  85,  70,  75,  60,  60,  55,
		  55,  50,  50,  45,  45,  40,  40,  35,  35,  35,
		  30,  30,  30,  25,  25,  25,  20,  20,  20,  20
	]
	const $POINTS = {
		SINGLE:		100,
		DOUBLE:		300,
		TRIPLE:		500,
		TETRIS:		800,
		SOFT_DROP:	1,
		HARD_DROP:	2
	}
	const $KEY = {
		ROTATE:		38,
		DOWN:		40,
		LEFT:		37,
		RIGHT:		39,
		DROP:		32,
		PAUSE:		27,
		ESCAPE:		27,
		NEW_GAME:	13,
		ROTATE_CW:	105,
		ROTATE_CCW:	103,
		DOWN2:		101,
		LEFT2:		100,
		RIGHT2:		102,
		KEY_W:		87,
		KEY_A:		65,
		KEY_S:		83,
		KEY_D:		68
	}
	const $PIECES = [
		[0x0F00, 0x4444, 0x00F0, 0x2222],
		[0x0660, 0x0660, 0x0660, 0x0660],
		[0x04E0, 0x0464, 0x00E4, 0x04C4],
		[0x06C0, 0x0462, 0x006C, 0x08C4],
		[0x0C60, 0x0264, 0x0C60, 0x04C8],
		[0x08E0, 0x0644, 0x00E2, 0x044C],
		[0x02E0, 0x0446, 0x00E8, 0x0C44]
	]

	let $Modal = null
	let $Tetris = null
	let $Next = null
	let $LevelTip = null
	let $Touch = null
	let $Piece = []
	let $Board = []
	let $Score = 0
	let $Lines = 0
	let $Level = 0
	let $GameTime = 0
	let $PauseTime = 0
	let $Key = {}
	let $Time = { Tic: 0, Start: 0, Delay: 0, MoveDelay: 500, LastDelay: 3000 }
	let $Stat = $STAT.STOPPED
})
