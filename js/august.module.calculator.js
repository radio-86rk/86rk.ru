//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.calculator.js


August.initModule ("calculator", function ( win ) {
	class Calculator {
		constructor () {
			this.reset ()
		}
		reset () {
			this.State = []
			this.init ()
		}
		init () {
			this.Expression = []
			this.Pos = 0
			this.Generator = this.expression ()
			this.Generator.next ()
			return this
		}
		*expression ( v ) {
			let r = yield* this.term (v)
			for (;;) {
				let op = this.get ()
				if (op == '+')
					r = r.plus (yield* this.term (r))
				else if (op == '-')
					r = r.minus (yield* this.term (r))
				else
					break
			}
			this.Generator = null
			return r
		}
		*term ( v ) {
			let r = yield* this.term2 (v)
			for (;;) {
				let op = this.get ()
				if (op == '*')
					r = r.mul (yield* this.term2 (r))
				else if (op == '/')
					r = r.div (yield* this.term2 (r))
				else
					break

			}
			this.Pos--
			return r
		}
		*term2 ( v ) {
			let r = yield* this.value (v)
			for (;;) {
				let op = this.get ()
				if (op == '^')
					r = r.pow (yield* this.value (r))
				else if (op == 'root')
					r = r.pow (Decimal.div (1., yield* this.value (r)))
				else
					break
			}
			this.Pos--
			return r
		}
		*value ( r ) {
			let v = this.get ()
			if (isSet (v))
				return v
			let p = yield r
			if (!isArray (this.Expression.last ()))
				this.Expression.push (... p)
			else if (p [1])
				this.Expression.push (p [1])
			return p [0]
		}
		open () {
			this.last_expr ()
			this.State.push ([this.Expression, this.Generator])
			return this.init ()
		}
		close () {
			let e = this.Expression
			let s = this.State.pop ()
			this.Expression = s [0]
			this.Generator = s [1]
			this.Expression.push (e)
			this.Pos = this.Expression.length
			return this
		}
		op ( op, nor ) {
			let p = this.Expression.last ()
			if (op == p)
				return this
			let OP = Calculator.OP
			if (OP [op].p <= OP [p].p) {
				this.result (new Decimal (OP [p].d), op)
				this.Expression.pop ()
				this.Expression.pop ()
				this.Expression.pop ()
				this.Expression.push (op)
				this.Pos -= 2
			} else {
				let r = this.result (new Decimal (OP [p].d))
				let e = this.Expression
				e.pop ()
				e.pop ()
				this.init ()
				if (isArray (e.last ()) && e.length == 1)
					this.expr (... e)
				else if (!nor)
					this.expr (e)
				this.result (r, op)
			}
			return this
		}
		expr ( e, a ) {
			let Last = this.last_expr ()
			this.Expression.push (e.length == 1 && !e [0].op && Last ? Last.attr || !isArray (Last) ?  [Last] : Last : e)
			this.Pos = this.Expression.length
			if (a)
				this.Expression.last ().attr = a
			return this
		}
		last_op () {
			let Last = this.Expression.last ()
			return isString (Last) ? Last : this.Expression [this.Expression.length - 2]
		}
		last_expr () {
			return isArray (this.Expression.last ()) ? this.Expression.pop () : null
		}
		done () {
			return !this.Generator || (this.Expression.length == 1 && isArray (this.Expression [0]))
		}
		get () {
			return this.Expression [this.Pos++]
		}
		result ( ... p ) {
			return this.Generator.next (p).value
		}
		static OP = {
			'+':	{ p: 0, d: 0 },
			'-':	{ p: 0, d: 0 },
			'*':	{ p: 1, d: 1 },
			'/':	{ p: 1, d: 1 },
			'^':	{ p: 2, d: 1 },
			'root':	{ p: 2, d: 1 }
		}
	}
	function handler ( e ) {
		switch (e.type) {
			case "mousedown":
				if (e.button == 0)
					move_start (e)
				else
					return e.stop ()
				break
			case "mouseup":
				if ($Calc.Move)
					move_end (e)
				break
			case "mousemove":
				if ($Calc.Move)
					move (e)
				break
			case "click":
				let a = e.$.attr ("a")
				if (!a)
					calc (e.$.attr ("key"))
				else if (a == "mode")
					mode_switch ()
				else if (a == "history")
					history_show ()
				else if (a == "history-pos")
					history_pos (e.$.i)
				else if (a == "history-up")
					history_up ()
				else if (a == "history-down")
					history_down ()
				else if (a == "history-clear")
					history_clear ()
				else if (a == "collapse")
					collapse ()
				else if (a == "close")
					close ()
				break
			case "wheel":
				if (e.delta () < 0)
					history_up ()
				else if (e.delta () > 0)
					history_down ()
				break
			case "contextmenu":
				return e.stop ()
		}
	}
	function handler_key ( e ) {
		let a = key => {
			let k = $KEYS [key]
			if (!k)
				return false
			if (e.type == "keyup") {
				delete $Pressed [key]
				k.setClass ("pressed", 0)
			} else if (!$Pressed [key]) {
				$Pressed [key] = k
				k.setClass ("pressed", 1)
				calc (key)
			}
			return true
		}
		let key = key => {
			if (e.shiftKey)
				key = "_" + key
			if (e.ctrlKey)
				key = "^" + key
			if (e.altKey)
				key = "~" + key
			return key
		}
		a (key (e.key)) || a ($TRANS_KEY [key (e.key)]) || a ("#" + key (e.keyCode)) || a ($TRANS_KEY ["#" + key (e.keyCode)])
		e.stop ()
	}
	function move_start ( e ) {
		if (e.$.is ("CALC-DISPLAY") || e.$.is ("CALC-TITLE")) {
			$Calc.Move = { x: e.pageX - $Calc.offsetLeft, y: e.pageY - $Calc.offsetTop }
			$Calc.setClass ("move", 1).fire ("noselect", 1)
			return true
		}
	}
	function move ( e ) {
		$Calc.set_pos ({ x: e.pageX - $Calc.Move.x, y: e.pageY - $Calc.Move.y })
	}
	function move_end ( e ) {
		if ($History.Show)
			$Pos.y += $Pos.hh || $History.List.offsetHeight
		$Calc.setClass ("move", 0).fire ("noselect")
		$Calc.Move = null
	}
	function win_resize () {
		if (!$History.Show)
			return $Calc.set_pos ($Pos)
		$Calc.set_pos ({ x: $Pos.x, y: $Calc.offsetTop })
		$Pos.y += $Pos.hh || $History.List.offsetHeight
	}
	function calc ( key ) {
		if ($Calc.Error && key != "aclr" || !key)
			return
		if (/^[\d.]$/.test (key))
			return display (Input.input (key))
		if (Input.value)
			$Result = new Decimal (Input.value)
		switch (key) {
			case "aclr":
				if (!$Calc.hasClass ("clr"))
					return reset (1)
			case "clr":
				history ()
				$Calc.Calc.last_expr ()
				reset ()
				expression ()
				return
			case "2nd":
				$Calc.setClass ("second")
				return
			case "rad":
			case "deg":
				$Calc.Radian = $Calc.setClass ("rad")
				param ("radian", +$Calc.Radian)
				return
			case "EE":
				if (Input.value)
					display (Input.exp ())
				return
			case "FE":
				$Calc.Exponential = $Calc.setClass ("to-exp")
				display ($Result.display ())
				break
			case "+/-":
				if (Input.value)
					return display (Input.neg ())
				if (!$Calc.Result)
					return
				$Calc.Calc.expr ([$Result], "neg")
				result ($Result.neg ())
				break
			case "m+":
				memory ($Memory.plus ($Result))
				break
			case "m-":
				memory ($Memory.minus ($Result))
				break
			case "mc":
				memory (new Decimal (0))
				break
			case "mr":
				history ()
				result (new Decimal ($Memory))
				$Calc.Calc.last_expr ()
				break
			case "e":
				history ()
				result (Decimal.exp (1).set_visual ("e"))
				$Calc.Calc.last_expr ()
				break
			case "pi":
				history ()
				result (Decimal.acos (-1).set_visual ("&pi;"))
				$Calc.Calc.last_expr ()
				break
			case "2pi":
				history ()
				result (Decimal.acos (-1).mul (2.).set_visual ("2&pi;"))
				$Calc.Calc.last_expr ()
				break
			case "sin":
			case "cos":
			case "tan":
			case "asin":
			case "acos":
			case "atan":
				key = key.set ("c", key.length == 3)
				if (!$Calc.Radian) {
					$Calc.Calc.expr ([$Result], key + "d")
					if (key.c)
						result (Decimal [key]($Result.mul (Decimal.acos (-1)).div (180.)).zero_if (1))
					else
						result ($Result [key]().mul (180.).div (Decimal.acos (-1)))
					break
				}
			case "sinh":
			case "cosh":
			case "tanh":
			case "asinh":
			case "acosh":
			case "atanh":
			case "sqrt":
			case "cbrt":
			case "ln":
			case "log2":
			case "log10":
			case "exp":
				$Calc.Calc.expr ([$Result], key)
				result (Decimal [key]($Result).zero_if (key.c))
				break
			case "2^x":
				$Calc.Calc.expr ([$Result], "pow2")
				result (Decimal.pow (2., $Result))
				break
			case "10^x":
				$Calc.Calc.expr ([$Result], "pow10")
				result (Decimal.pow (10., $Result))
				break
			case "x^2":
				$Calc.Calc.expr ([$Result], "sqr")
				result (Decimal.mul ($Result, $Result))
				break
			case "x^3":
				$Calc.Calc.expr ([$Result], "cube")
				result (Decimal.mul ($Result, $Result).mul ($Result))
				break
			case "1/x":
				$Calc.Calc.expr ([$Result], "reciproc")
				result (Decimal.div (1., $Result))
				break
			case "x!":
				$Calc.Calc.expr ([$Result], "fact")
				result ($Result.fact ())
				break
			case "%":
				if ($Calc.Result)
					result ($Calc.Result.mul ($Result).div (100.))
				break
			case "(":
				history ()
				if ($Result.op)
					result (new Decimal (0))
				$Calc.Calc.last_expr ()
				$Calc.Calc.open ()
				$Calc.Bracket++
				$Calc.Last = null
				bracket ()
				break
			case ")":
				if (!$Calc.Bracket)
					return
				result ($Calc.Calc.result ($Result))
				$Calc.Calc.close ()
				$Calc.Bracket--
				bracket ()
				break
			case "root":
			case "^":
			case "/":
			case "*":
			case "-":
			case "+":
				if ($Result.op)
					$Calc.Calc.op (key, $Result.nor)
				else
					result ($Calc.Calc.result ($Result, key))
				$Result.op = key
				$Calc.Last = null
				break
			case "=":
				if ($Calc.Last && $Calc.Last [0]) {
					result ($Calc.Calc.result ($Result, ...$Calc.Last))
				} else {
					while ($Calc.Bracket) {
						result ($Calc.Calc.result ($Result))
						$Calc.Calc.close ()
						$Calc.Bracket--
						bracket ()
					}
					$Calc.Last = [$Calc.Calc.last_op (), new Decimal ($Result)]
					$Result.novisual = 1
					result ($Calc.Calc.result ($Result))
				}
				history ()
				$Calc.Calc.reset ()
				break
			case "#8":
				if (Input.value)
					display (Input.backspace ())
				return
			case "#9":
				return mode_switch ()
			case "#~88":
				return close ()
			case "#33":
				return history_page (1)
			case "#34":
				return history_page ()
			case "#38":
				return history_up ()
			case "#40":
				return history_down ()
			case "#^36":
				return history_pos (0)
			case "#^35":
				return history_pos ($History.get ().length - 1)
			case "#^67":
			case "#^45":
				key = key.set ("c", 1)
			case "#^86":
			case "#_45":
				(key.c	? navigator.clipboard.writeText ($Result.display ())
					: navigator.clipboard.readText ()
				).then (r => {
					if (key.c || !/^(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/.test (r))
						return
					history ()
					result (new Decimal (r.replace (",", ".")))
					$Calc.Calc.last_expr ()
					expression ()
				}).catch (e => {
					Chat.errCon ("error", { MESSAGE: e.message })
				})
				break
			default:
				return
		}
		expression ()
		Input.reset ()
	}
	function history () {
		if (!$Calc.Calc.done () || $Calc.Bracket)
			return
		let e = get_expression ()
		let r = $Result
		let i = $History.get ().length
		$History.get ().push ({ e, r })
		$History.append (e, i)
		history_pos2 (i)
	}
	function bracket () {
		$Calc.$("calc-display").$("div").attr ("num", $Calc.Bracket || null)
	}
	function result ( r ) {
		if ($Calc.Error = !r.isFinite ()) {
			$Calc.setClass ("clr", 0)
			display ($Calc.$("calc-result").attr ("error") || "Error")
			return
		}
		r.nor = $Result === r
		$Calc.setClass ("clr", 1)
		$Calc.Result = r
		$Result = r
		display (r.visual && !r.novisual ? `<b>${r.visual}</b>` : r.display ())
		history_pos2 ()
	}
	function display ( v ) {
		let Display = $Calc.$("calc-result")
		Display.innerHTML = v.replace (/(\d+)(\..*)?$/, ( $0, $1, $2 ) => `${$1.numeral ()}${$2 || ""}`).replaceAll ("-", "&minus;")
		Display.fs = 0
		Display.className = ""
		while (Display.clientWidth < Display.scrollWidth && Display.fs < 7)
			Display.className = `fs${++Display.fs}`
	}
	function get_expression () {
		let expr = e => {
			let r = ""
			for (let t of e) {
				if (isType (t, Decimal))
					r += t.visual ? `<b>${t.visual}</b>` : t.display ()
				else if (isArray (t))
					r += `${t.attr ? `<em>${t.attr}</em>` : ``}(${expr (t)})`
				else
					r += `<span>${{ "-": "&minus;", "*": "&times;", "/": "&divide;" }[t] || t}</span>`
			}
			return r
		}
		let r = ""
		for (let s of $Calc.Calc.State)
			r += expr (s [0]) + "("
		r += expr ($Calc.Calc.Expression)
		return r
	}
	function expression () {
		$Calc.$("calc-expression").innerHTML = get_expression ()
	}
	function memory ( m ) {
		$Memory = m
		$Calc.setClass ("mem", !$Memory.isZero ())
	}
	function precision ( p ) {
		$Precision = p
		Decimal.set ({
			precision:	$Precision,
			toExpPos:	$Precision - 1,
			toExpNeg:	-($Precision - 1)
		})
	}
	function mode_switch () {
		$Pos.x += $Calc.offsetWidth
		$Calc.Basic = +$Calc.setClass ("basic")
		$Pos.x -= $Calc.offsetWidth
		param ("basic", $Calc.Basic)
		reset (1)
		precision ($ExponentMax * 2)
		history_set ()
		history_pos2 ($History.Pos)
	}
	function reset ( all ) {
		if (all) {
			$Calc.setClass ("second", 0).setClass ("to-exp", 0)
			$Calc.Calc.reset ()
			$Calc.Exponential = 0
			$Calc.Bracket = 0
			$ExponentMax = $Calc.Basic
				? $BASIC_EXPONENT_MAX
				: $SCIENTIFIC_EXPONENT_MAX
			expression ()
			bracket ()
		}
		Input.reset ()
		result (new Decimal (0))
		$Calc.setClass ("clr", 0)
		$Calc.Result = null
		$Calc.Last = null
	}
	function history_show () {
		$History.Show = +$Calc.setClass ("history")
		param ("history_show", $History.Show)
		history_pos2 ($History.Pos)
	}
	function history_pos ( i ) {
		if (!$History.Show || history_pos2 (i))
			return
		if ($Calc.Error)
			reset (1)
		else
			history ()
		Input.reset ()
		result (new Decimal ($History.get ()[i].r))
		$History.List.setClass ("sel", 1)
		$Calc.Calc.last_expr ()
		expression ()
	}
	function history_pos2 ( i ) {
		$History.List.setClass ("sel", 0)
		if (!isSet (i))
			return true
		let el = $History.List.all ("div")
		if (!el.length)
			return true
		$History.Pos = i
		el [$History.Sel].className = ""
		el [$History.Sel = i].className = "sel"
		if ($History.List.scrollTop > el [i].offsetTop)
			$History.List.scrollTop = el [i].offsetTop
		else if ($History.List.scrollTop + $History.List.offsetHeight < el [i].offsetTop + el [i].offsetHeight)
			$History.List.scrollTop = el [i].offsetTop + el [i].offsetHeight - $History.List.offsetHeight
	}
	function history_page ( up ) {
		if ($History.Pos < 0)
			return
		let n = $History.List.offsetHeight / $History.List.el (0).getStyle ("lineHeight") | 0
		$History.List.scrollTop += up ? -$History.List.offsetHeight : $History.List.offsetHeight
		history_pos (up
			? $History.Pos >= n ? $History.Pos - n : 0
			: $History.Pos < $History.get ().length - n ? $History.Pos + n : $History.get ().length - 1
		)
	}
	function history_up () {
		history_pos ($History.Pos > 0 ? $History.Pos - 1 : 0)
	}
	function history_down () {
		history_pos ($History.Pos < $History.get ().length - 1 ? $History.Pos + 1 : $History.Pos)
	}
	function history_clear () {
		$History.get ().clear ()
		history_set ()
	}
	function history_set () {
		for (let el of $History.List.all ("div"))
			$History.List.remove (el)
		$History.get ().forEach (( h, i ) => $History.append (h.e, i))
		$History.Sel = 0
		$History.Pos = $History.get ().length - 1
	}
	function collapse () {
		let h = $History.List.offsetHeight
		let t = $Calc.offsetTop
		let c = $Calc.setClass ("collapse")
		if (!$History.Show)
			return $Calc.set_pos ($Pos)
		if (c)
			$Pos.hh = h
		$Calc.set_pos ({ x: $Pos.x, y: t })
		$Pos.y += $Pos.hh
	}
	function close () {
		if (!$Calc)
			return
		param ("x", $Pos.x)
		param ("y", $Pos.y)
		param ("history", JSON.stringify ($History))
		$Calc.touch.done ()
		$Calc.un ("mousedown click contextmenu", handler)
			.un ("keydown keyup", handler_key)
		$Calc.$("calc-history").un ("wheel", handler)
		$Calc.ownerDocument.removeEventListener ("mousemove", handler)
		$Calc.ownerDocument.removeEventListener ("mouseup", handler)
		Chat.Event.un ("window-resize", win_resize)
		Chat.root.remove ($Calc)
		Chat.focus ()
		$Calc = $Result = $Memory = $History.List = null
	}
	this.init = function () {
		if ($Calc)
			return close ()
		August.loadJS ($DECIMAL_JS_PATH).then (() => Chat.addCSS ("calculator", () => Chat.loadTPL ("calculator", tpl => {
			$Memory = new Decimal (0)
			$Calc = Chat.root.appendHTML (tpl.calculator.tpl ())
			$Calc.Calc = new Calculator
			$Calc.set_pos = function ( xy ) {
				let bl = Chat.root.offsetWidth - this.offsetWidth
				let bb = Chat.root.offsetHeight - this.offsetHeight
				$Pos.x = xy.x.clamp (0, bl)
				$Pos.y = xy.y.clamp (0, bb)
				return this.s ({
					right:	`${bl - $Pos.x}px`,
					bottom:	`${bb - $Pos.y}px`
				})
			}
			$Calc.onfocus = function () {
				Chat.setFocus (null)
			}
			$Calc.onblur = function () {
				Chat.removeFocus ()
				for (let k in $Pressed) {
					delete $Pressed [k]
					$KEYS [k].setClass ("pressed", 0)
				}
			}
			if (!+param ("xy")) {
				param ("xy", 1)
				$Pos.x = Chat.root.offsetWidth - $Calc.offsetWidth >> 1
				$Pos.y = Chat.root.offsetHeight - $Calc.offsetHeight >> 1
			}
			$Calc.Radian = +param ("radian")
			$Calc.Basic = +param ("basic")
			$Calc.Radian && $Calc.setClass ("rad")
			$Calc.Basic && $Calc.setClass ("basic")
			$Calc.set_pos ($Pos).on ("mousedown click contextmenu", handler)
				.on ("keydown keyup", handler_key)
			$Calc.ownerDocument.addEventListener ("mousemove", handler)
			$Calc.ownerDocument.addEventListener ("mouseup", handler)
			$Calc.$("calc-history").on ("wheel", handler)
			$Calc.touch = new august_touch ($Calc, {
				start:	move_start,
				move:	move,
				end:	move_end
			})
			$Calc.tabIndex = -1
			$Calc.focus ()
			$History.List = $Calc.$("calc-history").$("calc-list")
			Decimal.prototype.fact = function () {
				let r = sp_gamma (this.plus (1.))
				return this.isInt () ? r.toDP (0) : r
			}
			Decimal.prototype.set_visual = function ( v ) {
				this.visual = v
				return this
			}
			Decimal.prototype.zero_if = function ( c ) {
				return c && this.abs ().lt (Decimal.pow (10, -$ExponentMax))
					? this.toDP ($ExponentMax)
					: this
			}
			Decimal.prototype.display = function () {
				return $Calc.Exponential || (!this.isZero () && (this.abs ().lt (Decimal.pow (10, -$ExponentMax / 3)) || this.abs ().gt (Decimal.pow (10, $ExponentMax))))
					? this.toExponential ($ExponentMax).replace (/0+e/, "e")
					: this.toSD ($ExponentMax).toString ()
			}
			Decimal.set ({
				maxE:	$EPSILON_EXPONENT,
				minE:	-$EPSILON_EXPONENT
			})
			reset (1)
			precision ($ExponentMax * 2)
			history_set ()
			if (+param ("history_show"))
				history_show ()
			$KEYS = {}
			for (let b of $Calc.$("calc-buttons").all ("div")) {
				let k = b.attr ("key")
				if (k)
					$KEYS [k] = b
			}
			let Dummy = $Calc.create ("div")
			$KEYS ["#8"] = Dummy
			$KEYS ["#9"] = Dummy
			$KEYS ["#~88"] = Dummy
			$KEYS ["#38"] = Dummy
			$KEYS ["#40"] = Dummy
			$KEYS ["#33"] = Dummy
			$KEYS ["#34"] = Dummy
			$KEYS ["#^36"] = Dummy
			$KEYS ["#^35"] = Dummy
			if (navigator.clipboard) {
				$KEYS ["#^67"] = Dummy
				$KEYS ["#^86"] = Dummy
				$KEYS ["#^45"] = Dummy
				$KEYS ["#_45"] = Dummy
			}
			Chat.Event.on ("window-resize", win_resize)
		}))).catch (() => {
			Chat.errCon ("js", { NAME: $DECIMAL_JS_PATH })
		})
	}

	let sp_gamma = (() => {
		const N = 48
		const c = []

		return x => {
			if (!c.length) {
				let f = new Decimal (1.)
				c.push (Decimal.sqrt (Decimal.mul (2., Decimal.acos (-1))))
				for (let i = 1; i < N; i++) {
					c.push (Decimal.exp (N - i).mul (Decimal.pow (N - i, i - .5).div (f)))
					f = f.mul (-i)
				}
			}
			let a = c.reduce (( a, c, i ) => i ? a.plus (c.div (x.plus (i))) : c [0])
			return Decimal.exp (x.plus (N).neg ()).mul (Decimal.pow (x.plus (N), x.plus (.5))).mul (a).div (x)
		}
	})()

	let Input = (() => {
		let Input = ""
		let Dot = 0
		let E = 0

		let input = key => {
			history ()
			if ($Calc.Calc.last_expr ())
				expression ()
			if (E) {
				if (!/[+-]\d{5}$/.test (Input) && key != '.') {
					if (/[+-]0$/.test (Input))
						Input = Input.substr (0, Input.length - 1)
					Input += key
				}
				return Input
			}
			if (!Input) {
				Input = "0"
				$Calc.setClass ("clr", 1)
				history_pos2 ()
			}
			if (key == '.') {
				if (Dot)
					return Input
				Dot = 1
			} else if (Input == "0") {
				Input = ""
			} else if (Input == "-0") {
				Input = "-"
			}
			if (Input.length - Dot - !!(Input [0] == '-') < $ExponentMax)
				Input += key
			return Input
		}
		let exp = () => {
			if (Input && !E) {
				Input += (Dot ? "" : ".") + "e+0"
				Dot = E = 1
			}
			return Input
		}
		let neg = () => {
			return Input = E
				? Input.replace (/\b([+-])/, ( $0, $1 ) => ({ "+": "-", "-": "+" }[$1]))
				: Input [0] == '-' ? Input.substr (1) : "-" + Input
		}
		let backspace = () => {
			return Input = Input.replace (/^((.*?)(e[+-](.*))?)(.)$/, ( $0, $1, $2, $3, $4, $5 ) => {
				E = !!$3
				if (!$3 && $5 == '.')
					Dot = 0
				return $3 ? $4 ? $1 : $5 == "0" ? $2 : $1 + "0" : $1 == '-' ? "0" : $1 || "0"
			})
		}
		let reset = () => {
			Input = ""
			Dot = E = 0
		}

		return { input, reset, neg, exp, backspace, get value () { return Input } }
	})()

	const $DECIMAL_JS_PATH = "../3rdparty/decimal/decimal.min.js"
	const $EPSILON_EXPONENT = 99999
	const $BASIC_EXPONENT_MAX = 16
	const $SCIENTIFIC_EXPONENT_MAX = 32
	const $TRANS_KEY = {
		Enter:		"=",
		Escape:		"aclr",
		"#_68":		"deg",
		"#_82":		"rad",
		"#_69":		"EE",
		"#_70":		"FE",
		"#_57":		"(",
		"#_48":		")",
		"#77":		"mr",
		"#69":		"e",
		"#80":		"pi",
		"#~80":		"2pi",
		"#82":		"1/x",
		"#^191":	"1/x",
		"#83":		"sin",
		"#67":		"cos",
		"#84":		"tan",
		"#_83":		"asin",
		"#_67":		"acos",
		"#_84":		"atan",
		"#~83":		"sinh",
		"#~67":		"cosh",
		"#~84":		"tanh",
		"#~_83":	"asinh",
		"#~_67":	"acosh",
		"#~_84":	"atanh",
		"#^77":		"mc",
		"^=":		"m+",
		"^+":		"m+",
		"^-":		"m-",
		"!":		"x!",
		"_!":		"x!",
		",":		".",
		"_,":		".",
		"_+":		"+",
		"_*":		"*",
		"_^":		"^",
		"_%":		"%",
		"~-":		"+/-",
		"^0":		"10^x",
		"^2":		"x^2",
		"^3":		"x^3",
		"#^89":		"^",
		"#^69":		"exp",
		"~0":		"log10",
		"~1":		"1/x",
		"~2":		"sqrt",
		"~3":		"cbrt",
		"#~89":		"root",
		"#~69":		"ln"
	}
	let $KEYS = null

	let param = August.storage ("calculator", 0)
	let $Pos = { x: +param ("x"), y: +param ("y") }
	let $History = JSON.parse (param ("history")) || [[], []]
	let $Calc = null
	let $Result = null
	let $Memory = null
	let $ExponentMax = 0
	let $Precision = 0
	let $Pressed = {}

	$History.get = function () {
		return this [$Calc.Basic]
	}
	$History.append = function ( e, i ) {
		this.List.append ("div", { innerHTML: e, i }).attr ("a", "history-pos")
	}

	Chat.setCmd ({
		calc:	( cmd, arg ) => {
			if (cmd == "precision") {
				return arg
					? Chat.con ("$=CALC=$: precision set to ?", (precision (+arg), $Precision))
					: Chat.con ("$=CALC=$: precision is ?", $Precision)
			}
			Chat.con ("$!CALC!$: error cmd `?`", cmd)
		}
	})

	Chat.Event.on ("destroy", close)
		.on ("app-done", app => {
			if (app == Chat)
				close ()
		})
})
