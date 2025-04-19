//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.smiles.js


August.initModule ("smiles", function ( win ) {
	this.init = function ( run, app ) {
		let exec = () => {
			if (isFunction (run))
				run ()
			else if (this [run])
				this [run](app)
			else
				Chat.con ("$!SMILES ERROR!$: `?`", run)
		}

		if ($Lock)
			return
		$tpl.get (tpl => {
			if ($Smiles)
				return exec ()
			Chat.xhr (lock)("cfg.smiles", sm => {
				$Smiles = sm
				$Date = Chat.update.sm
				exec ()
			}, `/${Chat.update.sm}`, 1)
		})
	}
	this.done = function () {
		$sb && $sb.done ()
		$sb = null
	}
	this.smiles = function () {
		if (check.call (this, "smiles"))
			show.call (this)
	}
	this.mySmiles = function ( app ) {
		let my = mysmiles (app)
		if (my)
			my.show ()
		else if (check.call (this, "mySmiles", app))
			$MySm.set (app.win.wid, new august_mySmiles (app))
	}
	this.getMySmiles = function ( app ) {
		return mysmiles (app)
	}
	this.list = function () {
		return $Smiles.List
	}
	this.tpl = function () {
		return $tpl.tpl ()
	}
	function mysmiles ( app ) {
		return app && $MySm.get (app.win.wid)
	}
	function check ( run, app ) {
		if ($Date == Chat.update.sm)
			return 1
		if ($Smiles) {
			$Smiles = null
			$Groups = null
			$GroupMenu = 0
			this.init (run, app)
		}
		return 0
	}
	function shown () {
		return Chat.Win2.shown () && Chat.Win2.win ().first ().dataset.smiles
	}
	function show () {
		if ($Groups === null) {
			$Groups = []
			$Smiles.List.forEach (s => {
				let g = s [2].b2
				if (!isSet ($Smiles.Group [`$${g}`]))
					g = 0
				if (!isSet ($Groups [g]))
					$Groups [g] = []
				$Groups [g].push (s)
			})
			$GroupMenu = $Groups.length > 1
			if ($Group == -1 || !isSet ($Groups [$Group])) {
				for (let g in $Smiles.Group) {
					$Group = g.substr (1)
					if (isSet ($Groups [$Group]))
						break
				}
			}
		}
		if (User.set (55)) {
			try {
				$Win = Chat.wo ("smiles", $WinPos)
			} catch ( e ) {
				return
			}
			if (!$Win.root) {
				$Win.html ($WIN_HTML)
				$Win.root = root
				$Body = $Win.document.body
				$Body.innerHTML = html ()
				$Win.onbeforeunload =
				$Win.document.onclick =
				$Win.document.onkeydown =
				$Win.document.onchange =
				$Win.document.oncontextmenu = handler
				load_design ()
			}
		} else if (shown ()) {
			Chat.Win2.hide (1)
			$Body = null
			return
		} else {
			$Win = win
			$Body = Chat.Win2.show (html (), 2 | 512, this)
			$Body.onclick =
			$Body.onkeydown =
			$Body.onchange =
			$Body.oncontextmenu = handler
			Chat.Win2.win ().first ().dataset.smiles = 1
		}
		if (win.august_scrollbar)
			$sb = new august_scrollbar ($("smiles", $Win))
		$Body.noselect ()
		let p = $Page
		$Page = -1
		page (p < 0 ? 0 : p)
		if ($GroupMenu && $Win) {
			$Body.$("#sm_group").value = $Group
			set_group_name ($Group)
		}
	}
	function html () {
		let sm = ( a, t ) => ($OnPage = a ? Math.max (20, a) : 100, $TypeTable = t, "<div id=smiles></div>")
		return August.html.mess ($tpl.tpl ().smiles.tpl ({
			SMILES:		a => sm (a, 0),
			SMILES_TABLE:	a => sm (a, 1),
			GROUP_NAME:	a => ($GroupNameColor = a || "", "<span id=sm_group_name></span>")
		}).tpl ({
			GROUPS_MENU:	menu_groups,
			MENU:		menu
		}))
	}
	function group ( g ) {
		if (g == $Group || !$Win)
			return
		$Page = -1
		$Group = g
		$Body.innerHTML = html ()
		$Body.$("#sm_group").value = g
		page (0)
		set_group_name (g)
		if (win.august_scrollbar)
			$sb = new august_scrollbar ($("smiles", $Win))
	}
	function menu () {
		let Len = $GroupMenu ? $Groups [$Group].length : $Smiles.List.length
		return Len <= $OnPage + ($OnPage >> 2)
			? ""
			: Array.from ({ length: (Len + $OnPage - ($OnPage >> 2)) / $OnPage | 0 }, ( _, i ) => `<a data-a=page data-page=${i} id=sm_page_${i}>${i + 1}</a>`).join ("")
	}
	function menu_groups () {
		if (!$GroupMenu)
			return ""
		let opt = ""
		for (let g in $Smiles.Group) {
			let id = g.substr (1)
			if (isSet ($Groups [id]))
				opt += `<option value=${id}>${$Smiles.Group [g]}`
		}
		return `<select id=sm_group class=inp>${opt}</select>`
	}
	function set_group_name ( i ) {
		let gn = $("sm_group_name", $Win)
		if (gn) {
			let n = $Smiles.Group [`$${i}`]
			gn.innerHTML = $GroupNameColor ? n.color ($GroupNameColor) : n
			if ($Win !== win)
				$Win.document.title = gn.parent ().textContent
		}
	}
	function page ( p ) {
		if (p == $Page || p < 0 || !$Win)
			return
		let Len = $GroupMenu ? $Groups [$Group].length : $Smiles.List.length
		let Start = 0
		let End = Len
		if (Len > $OnPage + ($OnPage >> 2)) {
			let n = (Len + $OnPage - ($OnPage >> 2)) / $OnPage | 0
			if (p > n)
				return
			if ($(`sm_page_${$Page}`, $Win))
				$(`sm_page_${$Page}`, $Win).className = ""
			$(`sm_page_${p}`, $Win).className = "c"
			Start = $OnPage * p
			End = Start + $OnPage + ($OnPage >> 2) <= Len ? Start + $OnPage : Len
		} else if (p) {
			return
		}
		$Page = p
		let html = ""
		let max_w = 0
		let max_h = 0
		if ($TypeTable) for (let p = Start; p < End; p++) {
			let s = $GroupMenu ? $Groups [$Group][p] : $Smiles.List [p]
			let w = s [2].b0
			let h = s [2].b1
			if (max_w < w)
				max_w = w
			if (max_h < h)
				max_h = h
		}
		for (let p = Start; p < End; p++) {
			let s = $GroupMenu ? $Groups [$Group][p] : $Smiles.List [p]
			let w = s [2].b0
			let h = s [2].b1
			html += August.html.img (
				`@/smiles/${s [1].smile_fn ()}`,
				w, h, 0, "", 0, 0,
				Chat.cfg.smLeft + s [0] + Chat.cfg.smRight,
				"",
				$TypeTable ? `padding: ${max_h - h >> 1}px ${max_w - w >> 1}px ${max_h - h + 1 >> 1}px ${max_w - w + 1 >> 1}px` : ``,
				"smile"
			)
		}
		$sb && $sb.scrollTo (0)
		$("smiles", $Win).innerHTML = html
		if (!User.set (55)) {
			Chat.focus ()
			if (Chat.Win2.shown () != 1)
				return
		}
		$sb && $sb.recalc ()
	}
	function next_page () {
		page ($Page + 1)
	}
	function prev_page () {
		page ($Page - 1)
	}
	function next_group () {
	}
	function prev_group () {
	}
	function load_design () {
		if (User.set (55))
			Chat.css ($Win, "smiles")
	}
	function handler ( e ) {
		let el = e.$
		switch (e.type) {
			case "click":
				if (e.which != 1)
					return
				if (el.is ("IMG")) {
					if (el.name == "smile") {
						Chat.Send.insert (el.title)
						break
					}
					el = el.parent ()
				}
				if (el.is ("A")) {
					let a = el.dataset.a
					if (a == "page")
						page (el.dataset.page)
					else if (a == "next_page")
						next_page ()
					else if (a == "prev_page")
						prev_page ()
					else if (a == "next_group")
						next_group ()
					else if (a == "prev_page")
						prev_page ()
					return e.stop ()
				}
				break
			case "keydown":
				e.closeWin ()
			case "contextmenu":
				return e.stop ()
			case "change":
				if (el.id == "sm_group")
					group (el.value)
				return
			case "beforeunload":
				if ($Win !== win)
					$WinPos = $Win.pos ()
				return
		}
		return true
	}
	function my_done ( app ) {
		let my = mysmiles (app)
		if (my) {
			if (my.shown ())
				$MySm.set (app.win.wid, null)
			else
				$MySm.delete (app.win.wid)
			my.done ()
		}
	}
	function my_init ( app ) {
		let my = mysmiles (app)
		if (my)
			$tpl.get (tpl => Chat.$Modules.smiles.mySmiles (app))
	}
	function lock ( l ) {
		$Lock = l
	}

	const $WIN_HTML = "<!doctype html><html class=smiles><head><title>Smiles</title>%?%MOBILE_DEVICE%%:%<link rel=stylesheet href=css/scrollbar.css>?%</head><body class=smiles></body></html>".tpl ()

	let $tpl = Chat.tpl (["smiles", "mysmiles"], null, lock)
	let $sb = null
	let $Smiles = null
	let $Groups = null
	let $Date = -1
	let $Page = -1
	let $Group = -1
	let $GroupMenu = 0
	let $GroupNameColor = ""
	let $OnPage = 100
	let $TypeTable = 0
	let $WinPos = null
	let $Win = null
	let $Body = null
	let $Lock = 0
	let $MySm = new Map

	Chat.addCSS ("smiles")
	Chat.Event.on ("reinit", load_design)
		.on ("redesign", load_design)
		.on ("user-reset", _ => my_done (Chat))
		.on ("app-done", my_done)
		.on ("app-ready", my_init)
})

function august_mySmiles ( app ) {
	function ctrl ( e ) {
		if (Disabled)
			return false
		switch (e.$.name) {
			case "smile":
				app.Send.insert (e.$.title)
				break
			case "add":
			case "del":
				let smRE = RegExp (`${Chat.cfg.smLeft.escapeRegExp ()}([0-9a-zA-Zа-яА-ЯёЁ_]+)${Chat.cfg.smLeft.escapeRegExp ()}`, "g")
				let List = app.Send.mess ().value.match (smRE)
				if (List) {
					List = List.join (" ").replace (smRE, "$1")
					if (Mode == 0) {
						({ add, del })[e.$.name](List)
						User.Smiles = [... MySmiles].join (" ")
						if (User.reg ())
							Chat.sendCmd (33, { sm: User.Smiles })
						else
							Chat.Storage.mysmiles = User.Smiles
						Chat.Event.fire ("sm-fav-up", MySmiles)
					} else if (Mode == 1) {
						Chat.sendCmd (34, { sm: List })
						if (e.$.name == "del")
							del_personal (List)
					}
				}
				app.Send.clear ()
				break
			case "up":
				scroll_up ()
				break
			case "down":
				scroll_down ()
				break
			case "disk":
				if (!File) {
					File = app.root.append ("input", {
						type:     "file",
						accept:   "image/*",
						multiple: true
					})
					File.onchange = function () {
						let data = new FormData
						data.append ("id", User.ID)
						for (let f of File.files)
							data.append ("upload[]", f)
						new august_http (1, "json").http (d => {
							Disabled = d
							SmPersonal.setClass ("wait", d)
						}).send (`//${Chat.Host}/august?a=58&r=${app.ID2 || 0}&p=${app.Room ^ 1}`, ( r, s ) => {
							File.value = ""
							if (r === false)
								app.error ("upload")
							if (!r)
								return
							Object.assign (User.PersonalSmiles, r)
							Chat.Event.fire ("sm-pers-up")
						}, data)
					}
				}
				File.click ()
			default:
				return true
		}
		return false
	}
	function mouse_scroll ( e ) {
		if (e.deltaY < 0)
			scroll_up ()
		else if (e.deltaY > 0)
			scroll_down ()
		return e.stop ()
	}
	function buttons () {
		let b = Widget.$("div.buttons-scroll")
		if (b) b.s ({
			visibility: !!SmPersonal || SmFavourite.scrollHeight > SmFavourite.offsetHeight ? "visible" : "hidden"
		})
	}
	function scroll_up () {
		if (Mode == 0) {
			scroll (SmFavourite, -SmFavourite.offsetHeight)
		} else if (SmPersonal.scrollTop) {
			scroll (SmPersonal, -SmPersonal.offsetHeight)
		} else {
			let h = Widget.Scroll.offsetHeight
			scroll (Widget.Scroll, -h)
			scroll (Widget.$("div.buttons-control"), -h)
			Mode = 0
		}
	}
	function scroll_down () {
		if (SmFavourite.scrollTop < SmFavourite.scrollHeight - SmFavourite.offsetHeight) {
			scroll (SmFavourite, SmFavourite.offsetHeight)
		} else if (Mode == 1) {
			scroll (SmPersonal, SmPersonal.offsetHeight)
		} else if (SmPersonal) {
			let h = Widget.Scroll.offsetHeight
			scroll (Widget.Scroll, h)
			scroll (Widget.$("div.buttons-control"), h)
			Mode = 1
		}
	}
	function scroll ( el, s ) {
		let r = el.scrollTop + s
		r -= r % el.offsetHeight
		app.win.cancelAnimationFrame (el.sa)
		let scr = () => {
			let t = el.scrollTop
			el.scrollTop += (s > 0 ? 2 : -2) * devicePixelRatio
			el.sa = (el.scrollTop == t || el.scrollTop == r)
				? 0
				: app.win.requestAnimationFrame (scr)
		}
		scr ()
	}
	function smile ( s, n, mh, p = 0 ) {
		let o = +!p
		let w = s [o + 1].b0
		let h = s [o + 1].b1
		return August.html.img (
			`@/smiles/${s [o].smile_fn (p)}`,
			h > mh ? w * mh / h + .5 | 0 : w,
			h > mh ? mh : h,
			0, "", "", "",
			Chat.cfg.smLeft + n + Chat.cfg.smRight,
			"",
			h > mh ? `` : `padding: ${mh - h >> 1}px 0 ${mh - h + 1 >> 1}px`,
			"smile"
		)
	}
	function favourite_html ( my ) {
		MySmiles = my
		SmFavourite.innerHTML = Array.from (my, n => smile (Smiles.get (n), n, SmFavourite.offsetHeight)).join ("")
		buttons ()
	}
	function personal_html () {
		if (!SmPersonal)
			return
		let p = User.PersonalSmiles
		let n = n => p [n][0].hex () & 0x000fffff
		SmPersonal.innerHTML = Object.keys (p).sort (( a, b ) => n (a) - n (b)).map (n => smile (p [n], n, SmPersonal.offsetHeight, User.Profile)).join ("")
	}
	function del_personal ( List ) {
		for (let n of List.split (" "))
			delete User.PersonalSmiles [n]
		Chat.Event.fire ("sm-pers-up")
	}
	function add ( List ) {
		for (let n of List.split (" ")) {
			if (Smiles.has (n))
				MySmiles.add (n)
		}
	}
	function del ( List ) {
		for (let n of List.split (" "))
			MySmiles.delete (n)
	}
	function priv () {
		if (User.Priv.test (44) && !SmPersonal) {
			SmPersonal = Widget.Scroll.append ("div")
			app.win.setTimeout (personal_html, 100)
			SmPersonal.scrollTop = 0
		} else if (!User.Priv.test (44) && SmPersonal) {
			if (Mode) {
				scroll (Widget.$("div.buttons-control"), -Widget.Scroll.offsetHeight)
				Widget.Scroll.scrollTop = 0
				Mode = 0
			}
			Widget.Scroll.remove (SmPersonal)
			SmPersonal = null
		}
	}
	this.shown = function () {
		return Shown
	}
	this.show = function () {
		Shown = app.root.setClass ("mysmiles")
		app.scrollDefer ()
		if (!Shown && File) {
			app.root.remove (File)
			File = null
		}
	}
	this.hide = function () {
		if (Shown)
			this.show ()
	}
	this.done = function () {
		if (!Widget)
			return
		this.hide ()
		Touch && Touch.done ()
		Widget.un ("click", ctrl).un ("wheel", mouse_scroll)
		Chat.Event.un ("sm-fav-up", favourite_html)
			.un ("sm-pers-up", personal_html)
			.un ("user-priv", priv)
		app.win.removeEventListener ("resize", buttons)
		Widget.innerHTML = ""
		Widget = SmFavourite = SmPersonal = null
		Smiles.clear ()
	}
	this.init = function () {
		Widget = app.root.$("chat-mysmiles")
		if (!Widget)
			return
		Widget.noselect ()
		Widget.innerHTML = Chat.$Modules.smiles.tpl ().mysmiles.tpl ({
			SMILES: "<div class=scroll></div>"
		}).tpl (Chat.$ERROR_CFG)
		Widget.Scroll = Widget.$("div.scroll")
		if (!Widget.Scroll)
			return
		Mode = 0
		SmFavourite = Widget.Scroll.append ("div")
		add (User.Smiles)
		priv ()
		app.win.setTimeout (favourite_html, 100, MySmiles)
		Widget.Scroll.scrollTop = SmFavourite.scrollTop = Widget.$("div.buttons-control").scrollTop = 0
		Widget.on ("click", ctrl).on ("wheel", mouse_scroll)
		Chat.Event.on ("sm-fav-up", favourite_html)
			.on ("sm-pers-up", personal_html)
			.on ("user-priv", priv)
		app.win.addEventListener ("resize", buttons)
		if (!Chat.Mobile)
			return
		Touch = new august_touch (Widget.Scroll, {
			start ( e ) {
				this.sm = Mode ? SmPersonal : SmFavourite
				this.x0 = e.pageX + +this.sm.prop ("--left")
				this.sm.setClass ("scroll", 1)
				return true
			},
			move ( e ) {
				this.sm.prop ("--left", this.x0 - e.pageX)
			},
			end ( e ) {
				let i = 2 * e.dx.sign () * (20 * e.dx / e.dt) ** 2 | 0
				this.sm.setClass ("scroll", 0)
				this.sm.prop ("--left", (this.x0 - e.pageX - i).clamp (0, this.sm.scrollWidth - this.offsetWidth))
			}
		})
	}

	let Widget = null
	let SmFavourite = null
	let SmPersonal = null
	let Disabled = 0
	let Shown = 0
	let Mode = 0
	let File = null
	let Touch = null
	let MySmiles = new Set
	let Smiles = new Map
	for (let s of Chat.$Modules.smiles.list ())
		Smiles.set (s [0], s)

	app.addCSS ("mysmiles", () => {
		this.init ()
		if (SmFavourite)
			this.show ()
	})
}
