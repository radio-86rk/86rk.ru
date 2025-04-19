//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.timer-alarm.js


August.initModule ("timer-alarm", function ( win ) {
	function menu () {
		arguments.callee.superclass.constructor.apply (this, arguments)
		this.id = "timer-alarm"
		this.OPTIONS |= this.AWIDTH
		let Menu = []

		this.size = function () {
			let p = Chat.$Modules.menu.params (this.id)
			Menu.clear ()
			Menu.push (p && p.new || "&#x2795;")
			let List = sort_timers ()
			if (!List.length)
				return 1
			if ($TAB)
				Menu.push (p && p.list || "&#x2630;")
			Menu.push ("")
			let b = []
			for (let t of List) {
				let tm = $TIMERS [t]
				if (tm.Mode != 2) {
					let Item = `<span class=timer data-tm=${tm.id} id=timer_${tm.id}>${tm.Tic.clock ()}</span> ${tm.Name.htmlEntities ()}`
					Menu.push (tm.Stops ? Item.set ("class", "stopped") : Item)
					if (tm.Alarm) {
						b.push (tm.Menu)
						menu_blink (-tm.AlarmMenu)
						tm.AlarmMenu = tm.Menu
					}
				}
			}
			b.forEach (menu_blink)
			return Menu.length
		}
		this.item = function ( i ) {
			return Menu [i]
		}
		this.tic = function () {
			let m = this.subMenu ().menu ()
			for (let id in $TIMERS) {
				let t = m.$(`#timer_${id}`)
				t && (t.innerHTML = $TIMERS [id].Tic.clock ())
			}
		}
		this.handler = function ( el ) {
			if (el.m === 0) {
				self.init (_ => Chat.Win2.tab (0))
			} else if (el.m === 1 && $TAB) {
				self.init (_ => Chat.Win2.tab (1))
			} else if (el.m) {
				let tm = $TIMERS [el.first ().dataset.tm]
				if (!tm)
					;
				else if (!tm.Alarm && tm.Stops)
					restart (tm.id)
				else
					stop (tm.id)
			}
		}
	}
	function handler ( e ) {
		let el = e.$
		let a = el.name
		if (el.name == "timer_alarm_type") {
			if (e.type == "change" || e.type == "click") {
				August.form.$val ($sel.m, 0)
				set_type (el.value == 0)
				if (el.value == 1)
					$inp.d.value = $inp.s.value = ""
			}
			return
		} else if (a == "listen") {
			Chat.Player.play (August.form.$val ($sel.s))
			return false
		} else if (a == "start") {
			restart (el.id.split (":") [1])
			return false
		} else if (a == "stop" || a == "del") {
			stop (el.id.split (":") [1])
			return false
		} else if (a != "ok" || $Lock) {
			return true
		}
		if ($inp.n.value.length == 0)
			return error ($inp.n)
		if (!/^(\d+|)$/.test ($inp.d.value.trim ()))
			return error ($inp.d)
		let d = RegExp.$1 || 0
		if (!/^(\d+|)$/.test ($inp.h.value.trim ()))
			return error ($inp.h)
		let h = RegExp.$1 || 0
		if (!/^(\d+|)$/.test ($inp.m.value.trim ()))
			return error ($inp.m)
		let m = RegExp.$1 || 0
		if (!/^(\d+|)$/.test ($inp.s.value.trim ()))
			return error ($inp.s)
		let s = RegExp.$1 || 0
		let Timer = August.form.$val ($sel.t) == 0
		if (!Timer) {
			if (!m.length || m > 59)
				error ($inp.m)
			if (!h.length || h > 23)
				error ($inp.h)
			if ($Lock)
				return
		} else if (!(d || h || m || s)) {
			error ($inp.s)
			error ($inp.m)
			error ($inp.h)
			error ($inp.d)
			return
		} else if (m > 59) {
			error ($inp.m)
			return
		} else if (s > 59) {
			error ($inp.s)
			return
		}
		let tm = start ({
			id:	Date.now (),
			Name:	$inp.n.value.trim (),
			Starts:	Timer ? Date.now () : 0,
			Stops:	0,
			Time:	d * 3600 * 24 + h * 3600 + m * 60 + s * 1,
			Sound:	August.form.$val ($sel.s),
			Mode:	+August.form.$val ($sel.m),
			Smooth:	+August.form.$val ($sel.v),
			WDays:	Timer ? 0 : (function () {
				let r = 0
				$New.all ("INPUT[name=timer_alarm_wday]").forEach (( ch, i ) => {
					if (ch.checked)
						r |= 1 << i
				})
				return r
			})(),
			Loop:	+August.form.$val ($sel.l),
			time:	time
		})
		save (tm)
		list ()
		$inp.d.value = $inp.h.value = $inp.m.value = $inp.s.value = $inp.n.value = ""
		August.form.$val ($sel.t, 0).$val ($sel.m, 0).$val ($sel.v, 0).$val ($sel.l, 0)
		$Form.setClass ("disable", 1)
		August.timer.start ({ timeout: 500, once: 1, callBack: () => $Form.setClass ("disable", 0) })
		set_type (1)
		return false
	}
	function time () {
		return this.Starts
			? ((this.Starts / 1000 | 0) + this.Time - (new Date ()).getTimezoneOffset () * 60) * 1000 % 86400000
			: this.Time * 1000
	}
	function ends ( tm ) {
		if (tm.Starts)
			return tm.Starts + tm.Time * 1000
		let n = new Date ()
		let e = (new Date (n.getFullYear (), n.getMonth (), n.getDate ())).getTime () + tm.Time * 1000
		if (!tm.WDays)
			return e < n.getTime () ? e + 3600000 * 24 : e
		let d = 1 << (n.getDay () || 7) - 1
		if (!(tm.WDays & d && e > n.getTime ())) {
			for (let b = (tm.WDays & ~d) | (tm.WDays << 7); !(b & d); d <<= 1)
				e += 3600000 * 24
		}
		return e
	}
	function start ( tm ) {
		tm.Ends = ends (tm)
		tm.Tic = tm.Ends - Date.now ()
		tm.tid = August.timer.start ({ timeout: tm.Tic, callBack: alarm, tic: tic, data: tm, once: 1 })
		$TIMERS [tm.id] = tm
		let t = $Shown && $List.$("#time\\:" + tm.id)
		t && (t.innerHTML = tm.time ().clock ())
		return tm
	}
	function restart ( id ) {
		let tm = $TIMERS [id]
		if (!isSet (tm))
			return
		if (tm.Alarm)
			return stop (id)
		else if (!tm.Stops)
			return
		if (tm.Starts)
			tm.Starts = Date.now () + tm.Tic - tm.Time * 1000
		tm.Stops = 0
		start (tm)
		save (tm)
		display_btns (tm)
	}
	function stop ( id ) {
		let tm = $TIMERS [id]
		if (!isSet (tm))
			return
		if (tm.Alarm) {
			blink (tm, 0)
			menu_blink (-tm.AlarmMenu)
			if (tm.Mode != 2) {
				August.timer.stop (tm.Alarm)
				tm.Player.done ()
			}
			delete tm.Player
			tm.Player = null
			if (tm.Mode) {
				tm.Alarm = 0
				if (tm.Starts)
					tm.Starts = Date.now ()
				start (tm)
				display_btns (tm)
				return
			}
		} else if (!tm.Stops) {
			August.timer.stop (tm.tid)
			tm.Stops = Date.now ()
			save (tm)
			display_btns (tm)
			return
		}
		delete $TIMERS [id]
		list ()
		remove (id)
	}
	function tic ( tid, t, tm ) {
		if (tm.Tic - t < 500)
			return
		tm.Tic = 500 * ~~((t + 250) / 500)
		let c = $Shown && $List.$("#timer\\:" + tm.id)
		c && (c.innerHTML = tm.Tic.clock ())
	}
	function alarm ( tid, t, c, tm ) {
		tm.Player = new august_sound ("sounds")
		tm.Player.play (tm.Sound, tm.Smooth ? 1 : Chat.Player.volume (), tm.Loop || (tm.Mode == 2 ? 3 : -1))
		tic (0, tm.Tic - 500, tm)
		if (tm.Mode == 2) {
			tm.Alarm = -1  //  fake
			stop (tm.id)
			return
		}
		tm.Alarm = August.timer.start ({
			timeout: 200,
			callBack: ( tid, t, c ) => {
				if (tm.Smooth && tm.Player && (c & 0x10) == 0)
					tm.Player.volume ((c >> 5) + 1)
			}
		})
		blink (tm, 1)
		menu_blink (tm.Menu)
		tm.AlarmMenu = tm.Menu
		if ($Shown) {
			display_btn ("stop", tm.id)
			display_btn ((tm.Mode ? "start" : "del"), tm.id, 1)
		} else if (!window.AugustMenu || !AugustMenu.menu ("timer-alarm")) {
			self.init ()
			Chat.Win2.tab (1)
		}
	}
	function set_type ( t ) {
		$Form.setClass ("alarm", !t).setClass ("timer", t)
	}
	function display_btn ( n, id, v ) {
		$List.$(`#${n}\\:${id}`).display (v ? "inline-block" : "")
	}
	function display_btns ( tm ) {
		if ($Shown) {
			display_btn ("start", tm.id)
			display_btn ("stop", tm.id)
			display_btn ("del", tm.id)
			if (tm.Stops) {
				display_btn ("start", tm.id, 1)
				display_btn ("del", tm.id, 1)
			} else if (tm.Alarm) {
				display_btn ((tm.Mode ? "start" : "del"), tm.id, 1)
			} else {
				display_btn ("stop", tm.id, 1)
			}
		}
	}
	function error ( el ) {
		$Lock++
		el.setClass ("error", 1).on ("animationend", e => {
			el.select ()
			el.focus ()
			el.setClass ("error", 0)
			$Lock--
		}, { once: true })
	}
	function blink ( tm, b ) {
		let t = $("timer_alarm_" + tm.id, win)
		t && t.setClass ("blink", b)
	}
	function menu_blink ( i ) {
		Chat.Event.fire ("menu-blink", "timer-alarm", i)
	}
	function menu_init () {
		if (!AugustMenu.menu ("timer-alarm")) {
			august_extend (menu, august_menu_base)
			AugustMenu.insertMenu (new menu)
		}
	}
	function sort_timers () {
		let d = $TAB ? 3 : 2
		let List = []
		for (let id in $TIMERS)
			List.push (id)
		List.sort (( a, b ) => {
			let sa = $TIMERS [a].Stops ? 1 : 0
			let sb = $TIMERS [b].Stops ? 1 : 0
			return sa ^ sb ? sa - sb : ($TIMERS [a].Tic - $TIMERS [b].Tic)
		}).forEach (( t, i ) => {
			let tm = $TIMERS [t]
			if (tm.Mode == 2)
				d--
			else
				tm.Menu = i + d
		})
		return List
	}
	function list () {
		if (!$Shown)
			return
		let List = sort_timers ()
		$List.innerHTML = $tpl.tpl ().list.pattern ([{
			NUM		() { return this.$i + 1 },
			TIME		() { return `<span class=time id=time:${this.$t.id}>${this.$t.time ().clock ()}</span>` },
			TIMER		() { return `<span class=timer id=timer:${this.$t.id}>${this.$t.Tic.clock ()}</span>` },
			NAME		() { return this.$t.Name.htmlEntities () },
			TYPE		() { return "".true (!this.$t.Starts) },
			MODE		() { return this.$t.Mode },
			SOUND		() { return this.$t.Sound },
			SMOOTH		() { return "".true (this.$t.Smooth) },
			LOOP		() { return this.$t.Loop },
			ID		() { return `id=timer_alarm_${this.$t.id} ` },
			BUTTON_STOP	( t ) { return `<a id=stop:${this.$t.id} class=ctrl name=stop>${t}</a>` },
			BUTTON_START	( t ) { return `<a id=start:${this.$t.id} class=ctrl name=start>${t}</a>` },
			BUTTON_DEL	( t ) { return `<a id=del:${this.$t.id} class=ctrl name=del>${t}</a>` },
			$size		() { return List.length },
			$set		() { this.$t = $TIMERS [List [this.$i]] }
		}])
		for (let id in $TIMERS) {
			let tm = $TIMERS [id]
			display_btns (tm)
			blink (tm, ~~tm.Alarm > 0)
		}
	}
	function save ( tm ) {
		if (User.reg ()) Chat.sendCmd (37, { tm: [
			tm.id,
			tm.Name,
			tm.Starts,
			tm.Ends,
			tm.Stops,
			tm.Time,
			tm.Sound,
			tm.Mode,
			tm.Smooth,
			tm.WDays,
			tm.Loop
		].join ("\n") })
	}
	function remove ( del ) {
		if (User.reg ())
			Chat.sendCmd (37, { del })
	}
	function destroy () {
		for (let id in $TIMERS) {
			let tm = $TIMERS [id]
			if (tm.Alarm)
				stop (id)
			August.timer.stop (tm.tid)
		}
		$TIMERS = {}
	}
	function init ( d ) {
		d.split ("\n\n").forEach (t => {
			if (!t.length)
				return
			let d = t.split ("\n")
			let tm = {
				id:     +d [0],
				Name:   d [1],
				Starts:	+d [2],
				Ends:   +d [3],
				Stops:  +d [4],
				Time:   +d [5],
				Sound:  d [6],
				Mode:   +d [7],
				Smooth: +d [8],
				WDays:  +d [9],
				Loop:   +d [10],
				time:   time
			}
			if (tm.Ends < Date.now ()) {
				if (!tm.Mode)
					return remove (tm.id)
				if (tm.Starts)
					tm.Starts = Date.now ()
			}
			if (tm.Stops) {
				tm.Starts = Date.now ()
				start (tm)
				August.timer.stop (tm.tid)
			} else {
				start (tm)
			}
		})
	}
	this.done = function () {
		$Shown = 0
	}
	this.init = function ( arg ) {
		if ($Shown)
			return isFunction (arg) ? arg () : Chat.Win2.hide (1)

		if (arg === false) {
			$TIMERS = {}
			if (User.reg ())
				Chat.sendCmd (37, { get: 1 })
		}
		Chat.addCSS ("timer-alarm", () => $tpl.get (tpl => {
			$TAB = { new: " + ", list: " ... " }
			$tpl.tpl ().new  = tpl.timer_alarm_new.tpl  ({ TAB_NAME: n => { $TAB.new = n; return "" } }, 1)
			$tpl.tpl ().list = tpl.timer_alarm_list.tpl ({ TAB_NAME: n => { $TAB.list = n; return "" } }, 1)
			if (arg === false)
				return
			let TAHTML = "<form onsubmit='return false'>?</form>".format ($tpl.tpl ().new.tpl ({
				NAME:		p => August.form.input ("timer_alarm_name", "", 0, 30, `class=inp placeholder='${p}'`),
				DAY:		( p, s ) => August.form.input ("timer_alarm_day", "", s, 2, `class=inp placeholder='${p}'`),
				HOUR:		( p, s ) => August.form.input ("timer_alarm_hour", "", s, 2, `class=inp placeholder='${p}'`),
				MIN:		( p, s ) => August.form.input ("timer_alarm_min", "", s, 2, `class=inp placeholder='${p}'`),
				SEC:		( p, s ) => August.form.input ("timer_alarm_sec", "", s, 2, `class=inp placeholder='${p}'`),
				SELECT_TYPE:	( ... a ) => August.form.select ("timer_alarm_type", null, a, "class=inp", 2),
				RADIO_TYPE:	( ... a ) => August.form.radio ("timer_alarm_type", null, a, "", 2),
				SELECT_MODE:	( ... a ) => August.form.select ("timer_alarm_mode", null, a, "class=inp"),
				RADIO_MODE:	( ... a ) => August.form.radio ("timer_alarm_mode", null, a),
				SELECT_VOLUME:	( ... a ) => August.form.select ("timer_alarm_volume", null, a, "class=inp", 2),
				RADIO_VOLUME:	( ... a ) => August.form.radio ("timer_alarm_volume", null, a, "", 2),
				SELECT_SOUND:	a => August.form.select ("timer_alarm_sound", null, a, "class=inp"),
				SELECT_LOOP:	a => August.form.select ("timer_alarm_loop", null, a, "class=inp"),
				WEEKSDAYS:	a => August.form.checkbox ("timer_alarm_wday", 1, null, a, 7),
				BUTTON_LISTEN:	t => August.form.button2 ("listen", t || "", "", "class=btn"),
				BUTTON_OK:	t => August.form.button2 ("ok", t, "", "class=btn")
			}))
			let Win2 = Chat.Win2.show ($TAB ? [{ t: TAHTML, b: $TAB.new }, { t: "", b: $TAB.list }] : TAHTML + "<div></div>", 16 | 1, this)
			$Form = Chat.Win2.win ().$("form")
			$New = $TAB ? Win2 [0] : Win2.first ()
			$List = $TAB ? Win2 [1] : Win2.last ()
			$inp = { d: $Form.timer_alarm_day, h: $Form.timer_alarm_hour, m: $Form.timer_alarm_min, s: $Form.timer_alarm_sec, n: $Form.timer_alarm_name }
			$sel = { t: $Form.timer_alarm_type, m: $Form.timer_alarm_mode, v: $Form.timer_alarm_volume, s: $Form.timer_alarm_sound, l: $Form.timer_alarm_loop }
			$List.onclick = $New.onclick = $sel.t.onchange = handler
			$Lock = 0
			$Shown = 1
			set_type (1)
			list ()
			isFunction (arg) && arg ()
		}))
	}

	let $tpl = Chat.tpl (["timer-alarm-list", "timer-alarm-new"])
	let $inp = null
	let $sel = null
	let $Form = null
	let $New = null
	let $List = null
	let $Lock = 0
	let $Shown = 0
	let $TAB = null
	let $TIMERS = {}
	let self = this

	Chat.Event.on ("menu-init", menu_init)
		.on ("user-reset", destroy)
		.on ("event", ( ev, d ) => ({ TA_INIT: init }[ev] || (_ => _))(d))

	if (window.AugustMenu)
		menu_init ()
})
