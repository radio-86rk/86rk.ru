//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.calendar.js


August.initModule ("calendar", function ( win ) {
	function mouse_handler ( e ) {
		if (e.$.name == "prev-year")
			prev_year ()
		else if (e.$.name == "next-year")
			next_year ()
		else if (e.$.name == "prev-month")
			prev_month ()
		else if (e.$.name == "next-month")
			next_month ()
		else if (e.$.name == "cal-month")
			month (+e.$.dataset.m)
	}
	function key_handler ( e ) {
		let r = e.handler ({ c: 37, f: 2 }, $Month ? prev_month : prev_year)
			&& e.handler ({ c: 39, f: 2 }, $Month ? next_month : next_year)
			&& e.handler ({ c: 32, f: 2 }, current_year)

	}
	function handler ( e ) {
		if (e.type == "change") {
			if (e.$.name == "calendar") {
				let o = e.$ [e.$.selectedIndex]
				$Theme = e.$.value.set ("lower", e.$.value.toLowerCase ()).set ("title", o.text).set ("alt", o.alt)
				month ($Month)
			}
		}
	}
	function prev_year () {
		$Year--
		calendar ()
	}
	function next_year () {
		$Year++
		calendar ()
	}
	function current_year () {
		$Year = new Date ().getFullYear ()
		calendar ()
	}
	function prev_month () {
		if ($Month == 1)
			$Year--, $Month = 13
		month ($Month - 1)
	}
	function next_month () {
		if ($Month == 12)
			$Year++, $Month = 0
		month ($Month + 1)
	}
	function theme ( cb ) {
		if ($Theme == "")
			return cb (null)
		let m = {
			month:	$Month,
			year:	$Year
		}
		let wait = v => $Modal.setClass ("wait", v)
		if ($Theme.alt)
			new august_http (0, "json").http (wait).send (`php/calendar.${$Theme.lower}.php`, cb, m)
		else
			August.xhr (wait)(`calendar.${$Theme.lower}`, cb, m)
	}
	function month ( m ) {
		$Month = m--
		$tpl.get (tpl => theme (data => {
			let c = August.calendar ($Year, m)
			let DOW = null
			let Alt = void 0
			$Modal.root.innerHTML = tpl.calendar_month.tpl ({
				TITLE:		$Theme.title || "",
				YEAR:		$Year,
				MONTH:		l => new Date ($Year, m).lang (l).month (),
				CALENDAR:	( p, p2 ) => (Alt = p2, August.form.select ("calendar", $Theme, { ... p, ... p2 })),
				DEF_DOW:	( ... a ) => (DOW = a, "")
			}).pattern ([{
				DOW		( ... a ) { return a [this.$i] },
				$size		() { return 7 }
			}, {
				THEME		( th ) { let tpl = th [$Theme]; return tpl && data [this.$d] ? isArray (data [this.$d]) ? data [this.$d].map (d => tpl.tpl (d)).join ("") : tpl.tpl (data [this.$d]) : "" },
				DAY		() { return this.$d || "" },
				DOW		() { return this.$d ? DOW [this.$.$i] : "" },
				CUR		() { return "".true ($Cur == (m.shl8 | this.$d)) },
				$set		() { this.$d = c [this.$.$i][this.$i] },
				$size		() { return 6 }
			}])
			if (Alt) for (let o of $Modal.$("select[name='calendar']")) {
				if (Alt [o.value])
					o.alt = 1
			}
			$Modal.root.first ().className = $Theme.lower || ""
			$Modal.focus ()
			$Modal.sb && $Modal.sb.scrollTo (0)
		}))
	}
	function calendar () {
		if (!$Modal)
			return
		$Month = 0
		$Modal.setClass ("sw")
		$tpl.get (tpl => {
			let Colors = [], Animals = []
			let ColorID = $Year % 10 >> 1
			$Modal.root.innerHTML = tpl.calendar.pattern ([{
				MONTH		( l ) { return new Date ($Year, this.$i).lang (l).month () },
				MONTH_NUM	() { return this.$i + 1 },
				$set		() { this.$c = August.calendar ($Year, this.$i) },
				$size		() { return 12 }
			}, {
				DOW		( ... a ) { return a [this.$i] },
				$set		() { this.$day = this.$.$c [this.$i] },
				$size		() { return 7 }
			}, {
				DAY		() { return this.$d || "" },
				CUR		() { return "".true ($Cur == (this.$.$.$i.shl8 | this.$d)) },
				$set		() { this.$d = this.$.$day [this.$i] },
				$size		() { return 6 }
			}], {
				YEAR:		$Year,
				PREV_YEAR:	$Year - 1,
				NEXT_YEAR:	$Year + 1,
				COLORID:	ColorID,
				COLORS:		( ... a ) => (Colors = a, ""),
				ANIMALS:	( ... a ) => (Animals = a, ""),
				COLOR:		() => Colors [ColorID],
				ANIMAL:		() => Animals [$Year % 12]
			})
			$Modal.focus ()
		})
		win.setTimeout (_ => $Modal.setClass ("sw", 0))
	}
	function done () {
		$Modal.swipe.done ()
		$Modal.un ("click", mouse_handler).un ("keydown", key_handler).un ("change", handler)
		$Modal = null
	}
	this.init = function () {
		let Now = new Date
		$Cur = Now.getMonth ().shl8 | Now.getDate ()
		Chat.loadModule ("modal", [fn => {
			$Modal = fn ({ options: { close: done }})
			$Modal.on ("click", mouse_handler).on ("keydown", key_handler).on ("change", handler)
			$Modal.swipe = $Modal.swipe (
				() => ($Month ? next_month : next_year)(),
				() => ($Month ? prev_month : prev_year)()
			)
			calendar ()
		}, "calendar"], 1)
	}

	let $tpl = Chat.tpl (["calendar", "calendar-month"])
	let $Year = new Date ().getFullYear ()
	let $Month = 0
	let $Theme = ""
	let $Modal = null
	let $Cur = 0
})
