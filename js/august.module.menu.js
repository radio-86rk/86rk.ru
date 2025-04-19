//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.menu.js


function august_menu ( win ) {
	function sub_menu ( m ) {
		this.done = function () {
			if (m.OPTIONS & m.DETACH)
				return
			m.el ().setClass ("sel", 0)
			win.cancelAnimationFrame (tm)
			delMenu ()
			m.subMenu (null)
			if (!(m.OPTIONS & m.STATIC) && !(m.el () && m.el ().m == m)) {
				m.setParent (null, null)
				delete m
			}
			delete Tic [m.id]
			body.remove (menu)
		}
		this.show = function ( x, y, o ) {
			let html = m.html ()
			if (!html.length)
				return
			menu.innerHTML = html
			if (isFunction (m.post))
				m.post ()
			if (isFunction (m.tic))
				Tic [m.id] = m
			if (m.OPTIONS & m.FULLSIZE) {
				menu.s ({
					width:	"auto",
	 				height:	"auto"
	 			})
				if (menu.x > body.clientWidth - menu.offsetWidth - 20)
					menu.x = body.clientWidth - menu.offsetWidth - 20
			} else if (m.OPTIONS & m.AWIDTH && menu.clientWidth < menu.scrollWidth) {
				menu.s ({ width: Math.min (menu.clientWidth + (menu.clientWidth >> 1), menu.scrollWidth) + "px" })
			}
			if (m.OPTIONS & m.CENTER) {
				x = body.clientWidth - menu.offsetWidth >> 1
				y = body.clientHeight - menu.offsetHeight >> 1
			} else if (m.OPTIONS & m.SCREEN) {
				if (x > body.clientWidth - menu.offsetWidth)
					x = body.clientWidth - menu.offsetWidth
			}
			if (!arguments.length)
				return
			let d = o & 2 ? 10 : 3
			top = o & 1
			menu.x = x
			menu.y = y - menu.clientHeight
			menu.style.left = menu.x + "px"
			menu.style [top ? "top" : "bottom"] = menu.y + "px"
			for (let b = m.b0, i = 0; b; b >>= 1, i++) {
				if (b & 1)
					this.blink (i)
			}
			for (let b = m.b1, i = 0; b; b >>= 1, i++) {
				if (b & 1)
					this.blink (i + 32)
			}
			let ani = () => {
				if (menu.y >= y) {
					menu.style.maxHeight = `calc(100% - ${menu.y}px)`
					return
				}
				menu.y += 1 + (y - menu.y) / d | 0
				menu.style [top ? "top" : "bottom"] = menu.y + "px"
				tm = win.requestAnimationFrame (ani)
			}
			ani ()
			return this
		}
		this.blink = function ( i ) {
			let a = menu.all ("item")
			let x = Math.abs (i)
			if (x && x <= a.length)
				a [x - 1].setClass ("blink", i >= 0)
		}
		this.isActive = function () {
			return ac || (SubMenu && SubMenu.isActive ())
		}
		this.m = function () {
			return m
		}
		this.menu = function () {
			return menu
		}
		this.subMenu = function () {
			return SubMenu
		}
		function delMenu () {
			win.clearTimeout (tsm)
			m && m.done && m.done ()
			if (SubMenu) {
				SubMenu.done ()
				delete SubMenu
				SubMenu = null
			}
		}
		function newMenu ( m ) {
			if (SubMenu && m.el ().m == SubMenu.m ().el ().m) {
				if (m != SubMenu.m ())
					delete m
				return
			}
			if (m.subMenu ()) {
				delMenu ()
				SubMenu = m.subMenu ()
				return
			}
			delMenu ()
			let x = menu.offsetWidth
			let y = 0
			let p = m.el ()
			let pw = p.parent ().offsetWidth
			for (let el = p; el && el != body; el = el.offsetParent) {
				x += el.x || el.offsetLeft
				y += el.y || (!top ? el.offsetParent.offsetHeight - el.offsetHeight - el.offsetTop : el.offsetTop)
			}
			if (x > body.clientWidth - pw && x > 2 * pw)
				x -= 2 * pw - 10
			else
				x -= 10
			SubMenu = new sub_menu (m)
			SubMenu.show (x, y, top)
		}

		m.subMenu (this)
		let tm = 0, tsm = 0, ac = 1, top = 0
		let SubMenu = null
		let menu = body.append ("popup-sub-menu", { x: -1000, y: 0 })
		menu.noselect ()
		m.el ().setClass ("sel", 1)
		menu.on ("contextmenu dragstart", e => e.stop ())

		menu.onclick = function ( e ) {
			let nm = m.click (e)
			if (nm === true)
				return true
			if (nm) {
				newMenu (nm)
			} else if (!(m.OPTIONS & (m.DETACH | m.DONTHIDE))) {
				hideMenu ()
			} else if (m.OPTIONS & m.ATTACH) {
				if (m.OPTIONS & m.DETACH) {
					m.OPTIONS &= ~m.DETACH
					main.attach (m.subMenu ())
				}
				m.OPTIONS &= ~m.ATTACH
			}
			return e.stop ()
		}
		menu.onmouseover = function ( e ) {
			ac = 1
			resetTimer ()
		}
		menu.onmouseout = function () {
			ac = 0
			setTimer ()
			win.clearTimeout (tsm)
			tsm = win.setTimeout (() => {
				if (SubMenu && !SubMenu.isActive ())
					delMenu ()
			}, 500)
		}
	}

	function tic () {
		let t = August.now ()
		if (menu.h)
			timer.innerHTML = (TimerMode ? t - User.Entry : Date.now () - (new Date ()).getTimezoneOffset () * 60000).clock (8)
		for (let id in Tic)
			Tic [id].tic (t)
	}
	function show () {
		if (menu.h < menu.m.offsetHeight) {
			if (!menu.sh_d) {
				menu.sh_d = win.setTimeout (show, 400)
				return
			}
			if (menu.hd_t) {
				win.cancelAnimationFrame (menu.hd_t)
				menu.hd_t = 0
			}
			menu.sh_t = win.requestAnimationFrame (show)
			menu.h += (menu.m.offsetHeight - menu.h >> 3) + 1
			setPos ()
		} else {
			if (!Shown)
				menu.fire ("avatar", 1).fire ("modal", 1).fire ("nofocus", 1)
			Shown = 1
			win.clearTimeout (menu.hd_d)
			menu.hd_d = menu.sh_t = 0
			menu.setClass ("shown", 1)
		}
	}
	function hide () {
		if (menu.h && !SubMenu) {
			if (!menu.hd_d) {
				menu.hd_d = win.setTimeout (hide, 600)
				return
			}
			if (menu.sh_t) {
				win.cancelAnimationFrame (menu.sh_t)
				menu.sh_t = 0
			}
			menu.hd_t = win.requestAnimationFrame (hide)
			menu.h -= (menu.h >> 3) + 1
			setPos ()
		} else {
			if (Shown)
				menu.fire ("avatar").fire ("modal").fire ("nofocus")
			Shown = 0
			win.clearTimeout (menu.sh_d)
			menu.sh_d = menu.hd_t = 0
			menu.setClass ("shown", 0)
		}
	}
	function setPos () {
		menu.style [menu.t ? "bottom" : "top"] = null
		menu.style [menu.t ? "top" : "bottom"] = (menu.h - menu.m.offsetHeight) + "px"
	}
	function showMenu ( m ) {
		if (m && m.OPTIONS & m.DISABLED)
			return
		if (SubMenu) {
			SubMenu.done ()
			delete SubMenu
			SubMenu = null
		}
		if (m && m.subMenu)
			SubMenu = m.subMenu () || (new sub_menu (m)).show (m.el ().offsetLeft - m.el ().prop ("--left"), menu.getStyle ("height"), menu.t | 2)
	}
	function hideMenu () {
		showMenu ()
		hide ()
	}
	function setTimer () {
		resetTimer ()
		menu.to = win.setTimeout (hideMenu, 1500)
	}
	function resetTimer () {
		win.clearTimeout (menu.to)
	}
	function blink ( id, a ) {
		let m = List.get (id)
		if (!m)
			return
		if (a < 0) {
			if (a > -32) {
				if (!(m.b0 & (1 << -a)))
					return
				m.b0 &= ~(1 << -a)
			} else if (a > -64) {
				if (!(m.b1 & (1 << -a - 32)))
					return
				m.b1 &= ~(1 << -a - 32)
			} else {
				return
			}
			if (!(m.b0 | m.b1))
				m.el ().setClass ("blink", 0)
			cBlink--
		} else if (a) {
			if (a < 32) {
				if (m.b0 & (1 << a))
					return
				m.b0 |= (1 << a)
			} else if (a < 64) {
				if (m.b1 & (1 << a - 32))
					return
				m.b1 |= (1 << a - 32)
			} else {
				return
			}
			m.el ().setClass ("blink", 1)
			cBlink++
		} else {
			return
		}
		if (SubMenu && SubMenu.m () == m)
			SubMenu.blink (a)
		body.setClass ("blink", cBlink)
	}
	function reverse () {
		menu.append (menu.firstChild)
		menu.h = 15
		menu.t ^= 1
		setPos ()
		hide ()
	}
	this.hideMenu = function  () {
		hideMenu ()
	}
	this.attach = function  ( m ) {
		showMenu ()
		showMenu (m)
	}
	this.registerMenu = function ( id, name ) {
		if (id in MenuName)
			return false
		MenuName [id] = name
		return true
	}
	this.insertMenu = function ( m, name ) {
		if (name)
			this.registerMenu (m.id, name)
		else if (!(m.id in MenuName))
			return -1
		if (List.get (m.id))
			return -2
		if (!m.ready ())
			return -3
		List.set (m.id, m)
		let t = menu.m.firstChild.rows [0]
		let c = t.insertCell (t.cells [t.cells.length - 2].cellIndex)
		c.innerHTML = MenuName [m.id]
		c.m = m
		m.setParent (this, c)
		if (m.post)
			m.post ()
		return 1
	}
	this.removeMenu = function ( id ) {
		let m = List.get (id)
		if (!m || (m.OPTIONS & m.DONTREMOVE))
			return false
		hideMenu ()
		let c = m.el ()
		c.parent ().deleteCell (c.cellIndex)
		c.m = null
		m.setParent (null, null)
		List.delete (id)
		return true
	}
	this.renameMenu = function ( id, name ) {
		let m = List.get (id)
		if (!m)
			return false
		m.el ().textContent = name
		return true
	}
	this.menu = function ( id ) {
		return List.get (id)
	}
	this.win = function () {
		return win
	}
	this.done = function () {
		Chat.Event.un ("menu-blink", blink)
			.un ("reverse", reverse)
		August.timer.stop (t_tic)
		resetTimer ()
		showMenu ()
		touch.done ()
		for (let [id, m] of List)
			m.done && m.done ()
		List.clear ()
		body.setClass ("popup-menu", 0)
		body.remove (menu)
	}

	if (!User.ID)
		return

	let MenuName = {}
	let SubMenu = null
	let List = new Map
	let Tic = {}
	let cBlink = 0
	let TimerMode = 1
	let Shown = 0
	let body = Chat.body
	let menu = body.append ("popup-menu", { h: 15, t: Chat.Dir })
	let main = this

	body.setClass ("popup-menu", 1)
	menu.s ({ visibility: "hidden" })
	menu.noselect ()
	menu.on ("contextmenu", e => e.stop ())
	Chat.Event.on ("menu-blink", blink)
		.on ("reverse", reverse)

	let MAIN = "<table cellspacing=0 cellpadding=0 width=100%><tr><td width=100%>&nbsp;</td><td class=timer></td></tr></table>"
	let LINE = "<menu-line></menu-line>"
	if (menu.t) {
		menu.innerHTML = MAIN + LINE
		menu.m = menu.firstChild
		menu.l = menu.lastChild
	} else {
		menu.innerHTML = LINE + MAIN
		menu.m = menu.lastChild
		menu.l = menu.firstChild
	}
	let timer = menu.m.$("td.timer")
	let t_tic = August.timer.start ({ timeout: 500, callBack: tic })
	let touch = new august_touch (menu.m, {
		start ( e ) {
			this.x0 = e.pageX + +this.prop ("--left")
			this.setClass ("scroll", 1)
			return true
		},
		move ( e ) {
			this.prop ("--left", this.x0 - e.pageX)
		},
		end ( e ) {
			this.setClass ("scroll", 0)
			this.prop ("--left", (this.x0 - e.pageX).clamp (0, this.offsetWidth - this.parent ().offsetWidth))
		}
	})

	Chat.addCSS ("menu", () => {
		menu.s ({ visibility: "" })
		setPos ()
		hide ()
	})

	menu.onclick = function ( e ) {
		if (e.$ == timer) {
			TimerMode ^= 1
			e.$.setClass ("clock")
			tic ()
		} else if (e.$.m) {
			showMenu (SubMenu ? null : e.$.m)
		}
		return e.stop ()
	}
	menu.onmouseover = function ( e ) {
		show ()
		resetTimer ()
		if (e.$.m && SubMenu && SubMenu.m () != e.$.m)
			showMenu (e.$.m)
	}
	menu.onmouseout = function () {
		if (SubMenu)
			setTimer ()
		else
			hide ()
	}
}

function august_menu_base () {
	this.OPTIONS = this.SCREEN
	let Parent = null
	let SubMenu = null
	let Item = null

	this.html = function () {
		let r = []
		let n = this.size ()
		let c = this.current ()
		for (let i = 0; i < n; i++) {
			let m = this.item (i)
			if (m === null) {
			} else if (m.length) {
				let cls = m.class ? ` class=${m.class}` : ``
				let dis = m [0] == '!'
				let sub = m [0] == '>'
				if (dis || sub)
					m = m.substr (1)
				r.push (dis
					? `<item${cls}>${m}</item>`
					: `<item data-menu=${i} sub=${+sub} sel=${+(i == c)}${cls}>${m}</item>`
				)
			} else {
				r.push ("<div class=hr></div>")
			}
		}
		return (Chat.Dir ? r : r.reverse ()).join ("")
	}
	this.click = function ( e ) {
		let el = e.$
		for (el.m = false; el != SubMenu.menu (); el = el.parent ()) {
			if (el.dataset.menu) {
				el.m = +el.dataset.menu
				break
			}
		}
		let m = this.handler (el, el.m)
		return m ? m.setParent (this, el) : false
	}
	this.setParent = function ( p, el ) {
		Parent = p
		Item = el
		return this
	}
	this.parent = function () {
		return Parent
	}
	this.subMenu = function ( m ) {
		if (isSet (m))
			SubMenu = m
		return SubMenu
	}
	this.ready = function () {
		return true
	}
	this.current = function () {
		return -1
	}
	this.el = function () {
		return Item
	}
}

function august_menu_main ( m ) {
	august_menu_main.superclass.constructor.apply (this, arguments)
	this.id = "main"
	let Menu = []
	let Action = []

	for (let a in m) {
		Action.push (a)
		Menu.push (m [a])
	}

	this.size = function () {
		return Menu.length
	}
	this.item = function ( i ) {
		let m = Menu [i]
		return isArray (m) ? m [Chat.Dir] : m
	}
	this.handler = function ( el, m ) {
		Chat.Event.fire (Action [m])
	}
}

function august_menu_menu () {
	august_menu_menu.superclass.constructor.apply (this, arguments)
	this.id = "menu"

	this.size = function () {
		return Chat.cfg.Menu.length
	}
	this.item = function ( i ) {
		return Chat.cfg.Menu [i].n
	}
	this.handler = function ( el, i ) {
		let m = Chat.cfg.Menu [i]
		if (!m)
			;
		else if (m.win)
			Chat.wwo (m.a, m.a.replace (/[\W]/g, ""), m.a.replace (/[\W]/g, ""), m.win)
		else if (m.mod)
			Chat.loadModule (m.a, m.mod)
		else if (Chat.menu [m.a])
			Chat.menu [m.a]()
	}
}

function august_menu_nav () {
	august_menu_nav.superclass.constructor.apply (this, arguments)
	this.id = "nav"
	let p = {
		get webcam ()	{ return User.privWebcam () },
		get attach ()	{ return User.privAttach () },
		get emoji ()	{ return Chat.$Modules.emoji }
	}

	this.size = function () {
		return Chat.cfg.NavMenu.length
	}
	this.item = function ( i ) {
		let n = Chat.cfg.NavMenu [i]
		return !(n.a in p) || p [n.a] ? n.n : null
	}
	this.handler = function ( el, i ) {
		let n = Chat.cfg.NavMenu [i]
		if (n && n.a) {
			Chat.menu [n.a]
				? Chat.menu [n.a]()
				: Chat.loadModule (n.a, void 0, 0, null, [n.win])
		}
	}
}

function august_menu_status () {
	august_menu_status.superclass.constructor.apply (this, arguments)
	this.id = "status"

	this.ready = function () {
		return Chat.cfg.UserStatus.length
	}
	this.size = function () {
		return Chat.cfg.UserStatus.length > 1 && User.Priv.test (33)
			? Chat.cfg.UserStatus.length
			: 0
	}
	this.item = function ( i ) {
		return Chat.cfg.UserStatus [i].x
			? null
			: Chat.cfg.UserStatus [i].s [User.sex ()].stripTags ().trim ().replace (August.html.SMILE_RE, August.html.smile)
	}
	this.current = function () {
		return User.status ()
	}
	this.handler = function ( el, s ) {
		if (isSet (s))
			User.status (s)
	}
}

function august_menu_design () {
	august_menu_design.superclass.constructor.apply (this, arguments)
	this.id = "design"
	let DesignList = []
	for (let id in Chat.cfg.DesignList) {
		Chat.cfg.DesignList [id].idx = DesignList.length
		DesignList.push ({ id: id, n: Chat.cfg.DesignList [id].n })
	}

	this.size = function () {
		return DesignList.length
	}
	this.item = function ( i ) {
		return DesignList [i].n
	}
	this.current = function () {
		return Chat.cfg.DesignList [Chat.Design].idx
	}
	this.handler = function ( el, n ) {
		if (n !== false) {
			let id = DesignList [n].id
			if (Chat.loadDesign (id)) {
				Chat.Storage.Design = id == Chat.DefDes ? void 0 : id
				Chat.updateSess (`d=${id}`)
			}
		}
	}
}

function august_menu_copy ( m ) {
	august_menu_copy.superclass.constructor.apply (this, arguments)
	this.id = "_"
	this.OPTIONS = this.FULLSIZE | this.DONTREMOVE

	this.html = function () {
		return `<div class=copy>${m.text}</div>`
	}
	this.click = function ( e ) {
		return true
	}
}

August.initModule ("menu", function ( win ) {
	Object.assign (august_menu_base.prototype, {
		DONTREMOVE:	0x0001,
		DISABLED:	0x0002,
		DONTHIDE:	0x0004,
		DETACH:		0x0008,
		ATTACH:		0x0010,
		STATIC:		0x0020,
		FULLSIZE:	0x0040,
		AWIDTH:		0x0080,
		CENTER:		0x0100,
		SCREEN:		0x0200
	})
	august_extend (august_menu_copy,   august_menu_base)
	august_extend (august_menu_main,   august_menu_base)
	august_extend (august_menu_menu,   august_menu_base)
	august_extend (august_menu_nav,    august_menu_base)
	august_extend (august_menu_status, august_menu_base)
	august_extend (august_menu_design, august_menu_base)

	let Menu = {
		_:	august_menu_copy,
		main:	august_menu_main,
		menu:	august_menu_menu,
		nav:	august_menu_nav,
		status:	august_menu_status,
		design:	august_menu_design
	}
	let MenuParams = {}

	function reinit ( r ) {
		if (r)
			this.init ()
	}
	function destroy () {
		if (win.AugustMenu) {
			MenuParams = {}
			win.AugustMenu.done ()
			win.AugustMenu = null
		}
	}

	Chat.Event.on ("reinit", reinit.bind (this))
		.on ("destroy", destroy)
		.on ("user-reset", destroy)

	this.params = function ( n ) {
		return MenuParams [n]
	}
	this.init = function ( cmd, menu, ... args ) {
		if (!User.ID)
			return
		if (!win.AugustMenu) {
			win.AugustMenu = new august_menu (win)
			let cfg = []
			let id = void 0
			Chat.loadCFG2 ("popup-menu", ( $1, $2, $3 ) => {
				if ($1) {
					if (id = $2)
						cfg [id] = { m: $1, p: {} }
					if (id === "nav")
						Chat.addCFG ("NavMenu", "popup-nav")
					else if (id === "menu")
						Chat.addCFG ("Menu", "menu")
				} else if (Menu [id]) {
					if (!cfg [id].p [$3])
						cfg [id].p [$3] = $2
					else if (isArray (cfg [id].p [$3]))
						cfg [id].p [$3].push ($2)
					else
						cfg [id].p [$3] = [cfg [id].p [$3], $2]
				} else if (id) {
					if (!MenuParams [id])
						MenuParams [id] = {}
					if (!MenuParams [id][$3])
						MenuParams [id][$3] = $2
					else if (isArray (MenuParams [id][$3]))
						MenuParams [id][$3].push ($2)
					else
						MenuParams [id][$3] = [MenuParams [id][$3], $2]
				}
			}, () => {
				for (let id in cfg) {
					win.AugustMenu.registerMenu (id, cfg [id].m)
					if (Menu [id])
						win.AugustMenu.insertMenu (new Menu [id](cfg [id].p))
				}
				Chat.Event.fire ("menu-init")
			}, ( l, i ) => {
				Chat.con ("$!MENU!$: cfg error `?` line ?", l, i)
			})
			return
		}
		if (!cmd) {
			win.AugustMenu.hideMenu ()
			return
		}
		switch (cmd) {
			case "add":
			case "insert": {
				if (!menu)
					break
				if (!isSet (win [`august_menu_${menu}`]))
					return Chat.con ("$!MENU ERROR!$: `?` does not exists", menu)
				let r = win.AugustMenu.insertMenu (new win [`august_menu_${menu}`], args.length ? args.join (" ") : void 0)
				if (r == -1)
					Chat.con ("$!MENU ERROR!$: `?` is not registered", menu)
				else
					Chat.con ("MENU: ?", r == 1 ? "$=ok=$" : "$!error!$")
				return
			}
			case "del":
			case "delete":
			case "remove": {
				if (args.length)
					break
				let r = win.AugustMenu.removeMenu (menu)
				Chat.con ("MENU: ?", r == 1 ? "$=ok=$" : "$!error!$")
				return
			}
			case "rename": {
				if (!args.length)
					break
				let r = win.AugustMenu.renameMenu (menu, args.join (" "))
				Chat.con ("MENU: ?", r == 1 ? "$=ok=$" : "$!error!$")
				return
			}
			case "register": {
				if (!args.length)
					break
				let r = win.AugustMenu.registerMenu (menu, args.join (" "))
				Chat.con ("MENU: ?", r == 1 ? "$=ok=$" : "$!error!$")
				return
			}
		}
		Chat.con ("$!MENU ERROR!$: invalid arguments")
	}
})
