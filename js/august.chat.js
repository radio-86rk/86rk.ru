//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.chat.js


Chat = {
	init ( win, root, cb ) {
		let ok = August.defer (6, _ => {
			this.Transport = new august_ws_transport (
				_ => this.setClass ("disconnected", 0),
				_ => this.setClass ("disconnected", 1),
				_ => this.error ("no-conn")
			)
			this.setTitle ()
			let m = INIT.MODULES ? INIT.MODULES.split (":") : void 0
			let ok = August.defer (m ? m.length : 1, _ => win.setTimeout (_ => {
				let tic = 0, wait = _ => {
					if (this.img.reduce (( a, i ) => a + +i.complete, 0) < this.img.length && ++tic < 50)
						return win.setTimeout (wait, 100)
					delete this.img
					let Auth = JSON.parse (User.set (40) && August.storage ("global")("auth") || null)
					this.auth ({
						sess:		this.sess,
						design:		this.Design,
						room:		this.Room,
						profile:	INIT.PROFILE || (Auth ? Auth.p : null),
						auth_key:	INIT.AUTH_KEY || (Auth ? Auth.key : null)
					})
				}
				wait ()
			}, 500))
			if (m)
				m.forEach (n => this.loadModule (n, [null], 1, ok))
			else
				ok ()
			cb.call (this)
			setInterval (_ => this.updateSess (), 3600000)
		})

		try {
			this.Storage = win.localStorage
		} catch ( e ) {
			this.Storage = {}
		}
		User.Set = (this.Storage.Setup || 0) & ~0xf000
		this.win = win
		this.root = root
		this.Host = INIT.HOST
		this.Version = INIT.VERSION
		this.Mobile = INIT.MOBILE
		this.Lang = INIT.LANG
		this.Dir = +!User.set (54)
		this.TouchScreen = "Touch" in window
		this.loadTPL = August.loadTPL (this, l => this.loader (l), _ => this.errCon ("tpl"))
		this.Player = new august_sound ("sounds")
		this.Event = new august_event ()
		this.setClass ("app-chat", 1).setClass ("mobile", this.Mobile).setClass ("mono", User.set (38))
		August.loadModule = ( ... $ ) => Chat.loadModule (... $)
		August.initModule = ( ... $ ) => Chat.initModule (... $)
		August.setLoader (l => this.loader (l))
		August.init ({ Host: this.Host, Version: this.Version })
		let Modules = {}
		"".define ("WIDGET", {
			root:	this.root,
			load:	( n, ... a ) => {
				if (this.$Modules [n])
					return this.loadModule (n, a, 1)
				if (isSet (Modules [n]))
					return Modules [n].push ({ n, a })
				Modules [n] = []
				this.loadModule (n, a, 1, ( js, n ) => {
					let m = Modules [n]
					m && m.forEach (a => this.loadModule (a.n, a.a, 1))
					delete Modules [n]
				})
			}
		})
		.define ("INCLUDE", {
			root:	this.root,
			load:	( n, cb ) => this.loadTPL (n, tpl => cb (tpl [n._].tpl ()))
		})
		.define ("IS_MODULE", n => "".true (this.$Modules [n]))
		.define ("MOBILE_DEVICE", _ => "".true (this.Mobile))
		.define ("USER_PROFILE", _ => "".true (User.Profile))
		.define ("CHAT_DESIGN", _ => this.Design)
		.define ("COUNTRY_NAME", $ => this.cfg.Country ? this.cfg.Country [$] || "" : $)
		.define ("COUNTRY_FLAG", $ => August.html.flag ($))
		.define ("ADDRESS", _ => win.location.hostname )
		this.Event.on ("user-reset", _ => {
			clearInterval (this.tt)
			this.tt = 0
			this.Send = null
			this.Win2.hide (1)
			this.Player.delay (0)
			this.setClass ("auth", 0).setClass ("upload", 0).avatar (0).menu.menu (0)
		}).on ("insert-sel", _ => {
			if (this.Send)
				this.Send.insertSelection ()
		}).on ("clear", _ => {
			this.clear ()
		}).on ("reverse", _ => {
			this.refresh (this.Dir ^ 1)
		}).on ("window-hidden", h => {
			if (User.ID)
				User.idle (!h)
		})
		let [fp1, fp2] = August.fingerprint ()
		august_run (_ => this.xhr ()("init", r => {
			if (!r)
				location = "403.php"
			this.sess = r.Sess
			this.update = r.Date
			this.img = []
			if (!User.set (37)) {
				r.Graph.forEach (( g, i ) => {
					this.img [i] = new Image
					this.img [i].src = `//${this.Host}/people/nick/${g}`
				})
			}
			this.xhr ()("cfg2", cfg => {
				Object.assign (this.cfg, cfg)
				this.Room = cfg.Rooms && isSet (cfg.Rooms [INIT.ROOM]) ? INIT.ROOM : 0
				ok ()
			}, `/${this.update.cfg}`, 1)
			this.loadCFG ("chat", cfg => {
				if (cfg) {
					if (cfg.flag) for (let n in cfg.flag)
						cfg.flag [n] = (p => ({ p: p [0], e: p [1], w: +p [2], h: +p [3] }))(cfg.flag [n].t.split (":"))
					if (cfg.win) for (let n in cfg.win)
						cfg.win [n] = this.w (cfg.win [n].t.split (":"))
					Object.assign (this.cfg, cfg)
				}
				ok ()
			})
			this.loadCFG ("design", d => {
				if (d) for (let n in d) {
					if (/^\w+$/.test (n)) {
						this.cfg.DesignList [n] = { n: d [n].t, t: d [n].p }
						this.cfg.DesignCount++
						if (d [n].p)
							this.cfg.TPLList [d [n].p] = n
					}
				}
				this.DefDes = this.Mobile ? INIT.DEFDESMOBI : INIT.DEFDES
				this.loadDesign (INIT.DESIGN || this.Storage.Design, ok)
			})
			this.loadCFG ("errors", r => {
				Object.assign (this.cfg, r)
				ok ()
			})
			this.loadCFG ("cmenu", r => {
				this.cfg.CMenu = r
				ok ()
			})
			this.loadCFG ("country", r => {
				this.cfg.Country = {}
				if (r) for (let n in r)
					this.cfg.Country [n.toLowerCase ()] = r [n].t
				ok ()
			})
		}, August.getid ({ fp1, fp2, ref: INIT.REF })), [!INIT.MOBILE && INIT.SB ? "august.scrollbar.js" : null])
	},
	done () {
		for (let w in this.Win) {
			if (!this.isClosed (w))
				this.Win [w].close ()
		}
		if (User.ID)
			navigator.sendBeacon (`//${this.Host}/xhr/auth.august`, august_http_params ({ id: User.ID, sess: this.sess, exit: 2 }))
		User.reset ()
		this.Event.fire ("app-done", this).unAll ()
	},
	auth ( data ) {
		this.xhr ()("auth", a => {
			if (a === "ROOM")
				return this.Transport.reconnect (_ => this.Event.fire ("ul-refresh"))
			let Form = this.form.$("form")
			if (a.PassKey && Form) {
				User.reset ()
				if (a.Error === null) {
					let [fp1, fp2] = August.fingerprint ()
					this.sess = a.Sess
					this.auth (August.getid ({
						sess:	this.sess,
						design:	this.Design,
						room:	this.Room,
						nick:	Form.pass ? Form.nick.value.trim () : "",
						pass:	Form.pass ? Form.pass.value.crypt (a.PassKey) : "",
						fp1,
						fp2
					}))
					return
				}
				this.Transport.connect ()
				if (a.Error)
					this.error (a.Error)
				if (Form.hasClass ("send"))
					this.removeFocus ()
				if (Form.hasClass ("login"))
					Form.setClass ("disabled", 0)
				else
					Form.innerHTML = this.cfg.HTML_Login.tpl ()
				Form.className = "login"
				Form.pass.type = "password"
				Form.onsubmit = e => {
					let nick = Form.nick.value.trim ()
					if (!nick)
						return Form.nick.focus (), false
					Form.onsubmit = e => false
					Form.setClass ("disabled", 1)
					this.error ().auth ({
						sess:	this.sess,
						nick:	nick,
						pass:	Form.pass.value.crypt (a.PassKey)
					})
					return false
				}
				if (a.Error == 3 || a.Error == 20) {
					Form.pass.value = ""
					Form.pass.focus ()
				} else {
					Form.nick.value = Form.nick.value.trim () || this.Storage.Nick || ""
					Form.nick.focus ()
					Form.nick.select ()
				}
			} else if (a.ID && Form) {
				User.init (a)
				this.Storage.Nick = a.Nick
				this.Storage.CID = a.CID
				this.initForm (Form)
				this.Send = new august_chat_form_main (this)
				this.Transport.reconnect (_ => User.post_init ())
				this.Event.fire ("user-init").fire ("app-ready", this)
				if (a.AuthKey)
					August.storage ("global")("auth", JSON.stringify ({ key: a.AuthKey, p: a.Profile }))
			}
		}, data)
		return this
	},
	loadCFG ( cfg, cb ) {
		this.http ().send (`php/cfg.php?cfg=${cfg}&lang=${this.Lang}`, r => {
			if (r === false)
				return cb.call (this, false)
			let re = /^(["'`])(.*?)\1\s*(?:(?:(["'`])(.+?)\3|([^\s.]+)(?:\.([^\s]+))?)(?:[ \t]+(.+))?)?$/
			let cfg = {}, c = 0, t = ""
			for (let l of r.split ("\n")) {
				if (!re.test (l))
					continue
				t += RegExp.$2
				if (!RegExp.$4 && !RegExp.$5)
					continue
				if (RegExp.$6 && !cfg [RegExp.$5])
					cfg [RegExp.$5] = {}
				if (RegExp.$4)
					cfg [RegExp.$4] = { t: t, p: RegExp.$7 }
				else if (RegExp.$6)
					cfg [RegExp.$5][RegExp.$6] = { t: t, p: RegExp.$7 }
				else
					cfg [RegExp.$5] = { t: t, p: RegExp.$7 }
				c++
				t = ""
			}
			cb.call (this, c ? cfg : null)
		})
	},
	loadCFG2 ( cfg, cb_exe, cb_ok, cb_err ) {
		this.http ().send (`php/cfg.php?cfg=${cfg}&lang=${this.Lang}`, r => {
			if (r === false)
				return cb_err.call (this, r)
			let re = /^(?:\[(.+?)(?::([-\w]+))?\])|(?:(["'`])(.*?)\3\s*(\S+)?)$/
			let t = ""
			r.split ("\n").every (( l, i ) => {
				return !l || l [0] == '#'
					? 1
					: re.test (l)
					? RegExp.$1
					? (cb_exe.call (this, RegExp.$1, RegExp.$2), t = "", 1)
					: RegExp.$5
					? (cb_exe.call (this, void 0, t + RegExp.$4, RegExp.$5), t = "", 1)
					: (t += RegExp.$4, 1)
					: (cb_err.call (this, l, i + 1), 0)
			}) && cb_ok.call (this)
		})
	},
	loadCSS ( n, cb ) {
		if (this.Design == n)
			return false
		if (isSet (this.cfg.DesignList [n]))
			;
		else if (this.Design == -1)
			n = this.DefDes
		else
			return false
		this.Design = n
		this.css (this.win, this.$CSS, _ => {
			this.$sb && this.$sb.hide ()
			this.$psb && this.$psb.hide () 
			August.sync (this.win, _ => {
				if (this.view) {
					this.view.scrollTop = this.Dir ? this.view.scrollHeight - this.view.clientHeight - 10 : 10
					this.scroll ()
				}
				cb && cb.call (this)
			})
		})
		return true
	},
	loadDesign ( n, cb ) {
		return this.loadCSS (n, _ => {
			let tpl = this.cfg.DesignList [this.Design].t
			if (tpl && tpl != this.TPL)
				;
			else if (!tpl && (!this.TPL || this.cfg.TPLList [this.TPL]))
				tpl = this.cfg.TPLList [INIT.TPL] ? "0" : INIT.TPL
			else
				return this.Event.fire ("redesign"), cb && cb.call (this)

			this.TPL = tpl
			this.root.modal = 0
			this.loadTPL (["chat-body", "chat-top", "chat-login", "chat-send", "chat-nav", "bot-music", "bot-youtube", "hidden-text"], tpl => {
				if (tpl === null)
					return this.Event.fire ("reinit", 0), cb && cb.call (this)
				this.Event.fire ("destroy").fire ("app-done", this)
				if (this.Transport)
					this.Transport.reconnect (_ => this.Event.fire ("reinit", 1))
				this.TPL_MD5 = tpl.$md5
				if (this.Win2)
					this.Win2.hide (2)
				this.root.innerHTML = tpl.chat_body.tpl ({
					TOP:	tpl.chat_top.tpl (),
					TITLE:	this.win.document.title
				})
				this.cfg.HTML_Login = tpl.chat_login
				this.cfg.HTML_Send = tpl.chat_send
				this.cfg.HTML_BotMusic = tpl.bot_music
				this.cfg.HTML_BotYouTube = tpl.bot_youtube
				this.cfg.HTML_HiddenText = tpl.hidden_text
				this.panel = this.root.$("chat-panel").$("chat-panel")
				this.form = this.root.$("chat-form")
				this.chat = this.root.$("chat-chat")
				this.view = this.root.$("chat-view")
				this.body = this.root.$("chat-body")
				this.main = this.root.$("chat-main")
				if (!(this.body && this.view && this.chat && this.form && this.panel))
					return
				this.Win2 = new august_win2 (this.win)
				this.cm = new august_cmenu (this)
				this.sc = this.lm = 0
				this.body.append (this.Win2.win ())
				this.chat.on ("mouseup", _ => this.Event.fire ("insert-sel"))
				if (window.august_scrollbar) {
					this.$sb = new august_scrollbar (this.view)
					this.$psb = new august_scrollbar (this.panel, 1)
				}
				$0(this.root.$("chat-nav"), tpl.chat_nav.tpl ())
				this.root.d = ["to-bottom", "to-top"]
				this.setClass (this.root.d [this.Dir], 1).setClass ("modal", 0)
				let Form = this.form.$("form")
				if (User.ID && Form) {
					this.initForm (Form)
					this.Send.init2 ()
					this.Event.fire ("app-ready", this)
				}
				if (this.$PanelShown && this.$PanelModule.length)
					this.$PanelModule.last ().init ()
				this.view.extend ({
					scrollEnd: { get () { return this.scrollHeight - this.scrollTop - this.clientHeight } }
				})
				cb && cb.call (this)
			}, this.TPL_MD5)
		})
	},
	addCFG ( id, cfg ) {
		if (isSet (this.cfg [id]))
			return
		this.cfg [id] = []
		this.loadCFG (cfg, m => {
			if (m) for (let a in m) {
				let x = m [a].p.match (/^(win|module)(?::|=)?(.+)?$/)
				let p = x && x [2] ? x [2].split (":") : []
				this.cfg [id].push ({
					a:	a,
					n:	m [a].t,
					mod:	x && x [1] == "module" ? p : null,
					win:	x ? x [1] == "win" ? this.w (p) : null : this.w (m [a].p ? m [a].p.split (":") : null)
				})
			}
		})
	},
	addCSS ( css, cb ) {
		css = (isArray (css) ? css : [css]).filter (css => !this.$CSS.includes (css))
		if (!css.length)
			return cb && cb ()
		css.forEach (css => this.$CSS.push (css))
		Chat.css (this.win, css, cb)
	},
	initForm ( Form ) {
		this.setClass ("auth", 1).avatar (User.Avatar)
		Form.className = "send"
		Form.innerHTML = this.cfg.HTML_Send.tpl ({
			NICK:		User.Nick,
			PROFILE:	"".true (User.Profile),
			GUEST:		"".true (!User.Profile),
			MAXMESSLEN:	this.cfg.MaxMessLen,
			TIMER:		"<chat-timer>00:00:00</chat-timer>",
			TIMER_CLOCK:	"<chat-timer data-clock=1 class=clock>00:00:00</chat-timer>"
		})
		let Timer = this.form.$("chat-timer")
		if (Timer) {
			Timer.noselect ()
			Timer.c = User.$c
			if (Timer.dataset.clock) {
				Timer.on ("click", _ => {
					Timer.c = User.$c ^= 1
				}).on ("mouseover", _ => {
					Timer.c = User.$c ^ 1
				}).on ("mouseout", _ => {
					Timer.c = User.$c
				})
			}
			this.tt = setInterval (_ => {
				let t = this.form.$("chat-timer")
				if (!t)
					return
				t.setClass ("clock", t.c)
				t.innerHTML = t.c
					? (Date.now () - (new Date ()).getTimezoneOffset () * 60000).clock (8)
					: (August.now () - User.Entry).clock ()
			}, 500)
		}
	},
	initPanel ( m ) {
		if (this.$PanelModule.last () === m)
			return
		let Last = m ? this.$PanelModule.last () : this.$PanelModule.pop ()
		if (Last)
			Last.done (this), this.panel.innerHTML = ""
		if (this.$psb)
			this.$psb.hide ()
		if (m)
			this.$PanelModule.push (m)
		else if (this.$PanelModule.length)
			this.$PanelModule.last ().init ()
		
	},
	showPanel ( cn, html ) {
		if (isSet (cn)) {
			this.$PanelShown = 1
			this.panel.className = cn
			if (html)
				this.panel.innerHTML = html
		} else if (!(this.$PanelShown ^= 1)) {
			let Last = this.$PanelModule.pop ()
			if (Last)
				Last.done (this)
			this.$PanelModule.clear ()
			this.panel.innerHTML = ""
			this.panel.className = ""
		}
		this.main.setClass ("show-panel", this.$PanelShown)
		this.scrollDefer && this.scrollDefer ()
		return this.$PanelShown
	},
	userlist ( a, l ) {
		this.Event.fire ("userlist", a, l)
	},
	updateSess ( cmd ) {
		new august_http ().send (`//${this.Host}/august/sess?sess=${this.sess}&${cmd || ""}&id=${User.ID}&${Date.now ()}`)
	},
	setTitle () {
		let t = this.cfg.Rooms ? this.cfg.Rooms [this.Room].n : this.cfg.Name
		$0(this.root.$("chat-title"), this.win.document.title = t)
		return this
	},
	goRoom ( room ) {
		if (this.Room == room || !isSet (this.cfg.Rooms [room]))
			return
		this.Transport.disconnect ()
		this.Room = room
		this.clear (1).setTitle ().auth ({ sess: this.sess, id: User.ID, r: room })
	},
	refresh ( d ) {
		this.Dir = d
		this.Transport.reconnect ()
		this.clear (1).setClass (this.root.d [this.Dir], 1).setClass (this.root.d [this.Dir ^ 1], 0)
		if (d)
			User.Set &= ~(1 << 54)
		else
			User.Set |= 1 << 54
		this.Storage.Setup = User.Set
	},
	gag () {
		User.reset ()
		this.clear (1).loadTPL ("chat-gag", tpl => {
			this.chat.innerHTML = August.html.mess (tpl ? tpl.chat_gag.tpl () : "", 0x30000)
		})
	},
	clear ( r ) {
		if (r)
			this.sc = this.lm = 0
		this.chat.innerHTML = ""
		this.$sb && this.$sb.recalc ()
		return this
	},
	loader ( l ) {
		this.setClass ("loader", this.$Loader += (l ? 1 : -1))
		return this
	},
	setClass ( n, set ) {
		this.root.setClass (n, set)
		return this
	},
	setFocus ( f ) {
		this.$Focus.unshift (f)
	},
	removeFocus () {
		this.$Focus.shift ()
	},
	focus ( e ) {
		this.$Focus [0] && this.$Focus [0].call (this, e)
	},
	setCmd ( c ) {
		Object.assign (this.Cmd, c)
	},
	sound ( s ) {
		User.Sound [s] > 0 && this.Player.play (User.Sound [s].ddd ())
	},
	isClosed ( n ) {
		let w = this.Win [n]
		return !w || w.closed
	},
	sendCmd ( a, p = {} ) {
		p.a = a
		this.Transport.send (p)
	},
	hide ( m, s ) {
		let h = ( d, h ) => {
			if (!d)
				return
			let m = d.$("span.mess")
			if (!m)
				return d.display (h ? "none" : "")
			if (!h)
				return m.setClass ("hide", 0)
			m.setClass ("hide", 1)
			m.attr ("hide", this.cfg.system [s ? "hide-self" : "hide"].t)
		}
		m.forEach (m => h ($(`ph${m < 0 ? -m : m}`, this.win), m < 0))
		this.Event.fire ("hide-mess", m, h)
		this.scroll ()
	},
	ext ( ID2, m, c, p1, p2, p ) {
		if (!this.ExeCmd)
			return
		let wid = `${User.ID4}R${ID2}`
		if (this.isClosed (wid))
			return this.sendCmd (26, { r: ID2, c: 7 })
		if (this.Win [wid].exe)
			this.Win [wid].exe (c, p1, p2, p)
		if (m)
			this.glc = m
	},
	out ( m, n ) {
		if (!isSet (n))
			this.lm++
		else if (n < 0)
			this.lm = -n
		else
			this.lm += n
		m = August.html.mess (m, User.Set)
		let me = User.toMe (m)
		let div = this.mout (m)
		m.set ("me", me)
		if (!isSet (n) || n)
			div.id = `ph${this.lm}`
		if (this.me && me && (User.Set & 7))
			div.setClass (`me${User.Set & 7}`)
		if (me && this.Player.ready ())
			this.Player.delay (User.SoundDelay), this.sound (0)
		else if (!me && User.isNick (m))
			this.sound (4)
		if (div.id)
			this.Event.fire ("chat-mess", m, this.lm)
	},
	mout ( m, opt = 0 ) {
		let e = this.view.scrollEnd
		if (User.MaxMess && this.chat.children.length > 2 * User.MaxMess && this.sc == this.view.scrollTop && this.ScrollOn && !(opt & 1)) {
			while (this.chat.children.length > User.MaxMess)
				this.chat.remove (this.Dir ? this.chat.first () : this.chat.last ())
			if (this.Dir)
				this.view.scrollTop = this.view.scrollHeight - this.view.clientHeight - e
		}
		let sh0 = this.view.scrollHeight
		let st0 = this.view.scrollTop
		let div = this.chat.insert ("div", this.Dir ? null : this.chat.first (), { className: "ph invisible", innerHTML: m })
		if (this.ScrollOn) {
			if (!this.Dir) {
				this.view.scrollTop = this.view.scrollHeight - sh0 + st0
				this.sc += this.view.scrollTop - st0
			} else if (e < 1) {
				this.sc = this.view.scrollTop
			}
			this.scroll ()
		}
		if (m.system)
			div.setClass (`s${m.system}`)
		div.setClass ("invisible", 0)
		this.Event.fire ("insert-mess", div)
		return div
	},
	scroll ( a = _ => 60 ) {
		let s = this.ScrollOn ? this.Dir ? this.view.scrollEnd : this.view.scrollTop : 0
		if (s >= 1 && (this.view.scrollTop == this.sc || s < a ())) {
			this.win.cancelAnimationFrame (this.ts)
			s = 1 + (s / User.Scroll + .5) | 0
			this.sc = this.view.scrollTop += this.Dir ? s : -s
			this.$sb && this.$sb.scrollTo (this.sc)
			if (this.win.document.hidden)
				this.scroll (a)
			else
				this.ts = this.win.requestAnimationFrame (this.scroll.bind (this, a))
		}
	},
	scrollView ( up ) {
		if (this.ScrollDisabled)
			return
		this.ScrollOn = this.Dir ^ up
		let r = up
			? Math.max (0, this.view.scrollTop - ~~(this.view.clientHeight * .9))
			: Math.min (this.view.scrollHeight, this.view.scrollTop + ~~(this.view.clientHeight * .9))
		this.win.cancelAnimationFrame (this.ts)
		let scr = _ => {
			let st = this.view.scrollTop
			this.sc = this.view.scrollTop += r - this.view.scrollTop >> 3
			this.$sb && this.$sb.scrollTo (this.sc)
			if (this.view.scrollTop - st | 0)
				this.ts = this.win.requestAnimationFrame (scr)
		}
		scr ()
	},
	scrollDefer ( d = 100 ) {
		if (this.Dir)
			this.win.setTimeout (_ => this.scroll (), d)
	},
	avatar ( a ) {
		let Avatar = this.root.$("avatar")
		if (!Avatar) {
		} else if (a) {
			Avatar.innerHTML = August.html.img (`@/people/avatar/${a.hex (4)}.${a.ext ()}`, this.cfg.AvatarWidth, this.cfg.AvatarHeight)
			Avatar.display ("block")
		} else {
			Avatar.display ()
		}
		return this
	},
	ctrl ( n, t, p ) {
		let d = []
		p.a = n
		for (let n in p)
			d.push (`data-${n}=${p [n]}`)
		return `<a name=ctrl class=ctrl ${d.join (" ")}>${t}</a>`
	},
	error ( e, p ) {
		let ce = this.root.$("chat-error")
		if (e) {
			ce.e = 1
			ce.innerHTML = `<div>${this.getError (e, p)}</div>`
			ce.setHeight ()
			this.win.clearTimeout (ce.to)
			ce.to = this.win.setTimeout (_ => this.error (), 3000)
		} else if (ce.e) {
			ce.e = 0
			ce.setHeight (0)
		}
		return this
	},
	getError ( e, p ) {
		let $Error = {
			deny:	7
		}
		if (p && p.NICK)
			p.NICK = `<nick>${p.NICK}</nick>`
		let err = this.cfg.error [$Error [e] || e]
		if (!err)
			return ""
		let t = err.t.replaceAll ("\\\\", "<br>")
		return (p ? t.tpl (p) : t).set ("p", err.p)
	},
	notice ( n, cmd, p, a ) {
		let tpl = this.cfg.notice [n] || ""
		n = tpl.t.param (p, Object.assign (a || {}, {
			CMD:	cmd,
			NICK:	a && a.NICK || ""
		}))
		return this.mout (August.html.mess (`\x11${this.cfg.Action}\x10 ${tpl.p ? `\x11${tpl.p}${/^\d$/.test (tpl.p) ? "" : "\x13"}${n}\x10` : n}`), 0x30000)
	},
	con ( m, ... a ) {
		let mess = (m.length ? m.format (... a) : m.err ? this.getError (`con-${m.err}`, a [0]) : m.notice && this.cfg.notice [m.notice] ? this.cfg.notice [m.notice].t.tpl (a [0]) : "")
			.replaceAll ([/\$!(.+?)!\$/, /\$=(.+?)=\$/], ["<span class=red>$1</span>", "<span class=green>$1</span>"])
		if (this.view && mess.length)
			this.mout (mess).setClass ("con", 1)
		else
			console.error (mess.stripTags ())
		return this
	},
	errCon ( err, ... a ) {
		return this.con ("".set ("err", err), ... a)
	},
	w ( win ) {
		return win ? { w: ~~win [0], h: ~~win [1], f: ~~win [2] } : win
	},
	wo ( p, win ) {
		if (isString (p))
			p = { wid: p, win: p }
		if (!this.isClosed (p.wid)) {
			this.Win [p.wid].focus ()
			throw true
		}
		let w = August.wo (
			"",
			p.name
				? `${p.name}_${this.cfg.ChatID}_${this.Room}_${p.id2 || 0}_${User.ID4}`
				: `${this.cfg.ChatID}_${p.wid}`,
			win || this.cfg.getWin (p.win)
		)
		if (!w) {
			this.error ("win")
			throw false
		}
		this.Win [p.wid] = w
		return w
	},
	wwo ( url, wid, name, win, id2, ex ) {
		let fwo = _ => {
			let w = August.wo ("", `${name}_${this.cfg.ChatID}_${this.Room}_${id2 || 0}_${User.ID4}`, win)
			if (!w)
				this.error ("win")
			else if (url)
				fo (w.html ("<body></body>"))
			return w
		}
		let fo = win => {
			let p = []
			if (id2)
				p.push (`id2=${id2}`)
			if (ex)
				p.push (ex)
			let f = win.document.body.append ("form", {
				action:		url.replace (/^@/, `//${this.Host}`) + (p.length ? `?${p.join ("&")}` : ``),
				acceptCharset:	"utf-8"
			})
			if (!/^(?:https?:)\/\//i.test (url)) {
				f.method = "post"
				August.form.$hidden (f, {
					sess:	this.sess,
					id:	User.ID,
					d:	this.Design
				})
			}
			f.submit ()
		}

		if (!this.isClosed (wid)) {
			let w = this.Win [wid]
			return w.focus (), w
		}
		if ((August.now () - ~~this.wwo.ct < 1000) || !(this.wwo.ct = August.now ()))
			return false
		if (!win)
			win = this.cfg.getWin (name, 67)
		if (/^(?:https?:)?\/\//i.test (url))
			this.Win [wid] = August.wo (url, "", win)
		else if (this.isClosed (wid))
			this.Win [wid] = fwo ()
		else if (win.f & 0x10000)
			fo (this.Win [wid])
		if (this.Win [wid])
			this.Win [wid].focus ()
		return this.Win [wid]
	},
	imgView ( el, cb_start, cb_end ) {
		if (el.error || (el.width == (+el.dataset.width || el.naturalWidth) && el.height == (+el.dataset.height || el.naturalHeight)))
			return
		cb_start && cb_start ()
		let ViewImg = this.root.append ("view-img", {
			className: `wait`,
			innerHTML: `<img src=${el.dataset.src || el.src} ${el.dataset.save ? "crossorigin=anonymous" : ""} referrerpolicy=no-referrer><span><b></b><b></b><b></b></span>`
		})
		let btn = ViewImg.last ()
		let img = ViewImg.first ()
		let win = this.win
		let doc = img.ownerDocument
		let mouse_move = e => {
			if (img.xy && !img.lock) {
				if (img.w (1) < 0)
					img.p ("left", img.xy.l - img.xy.x + e.pageX)
				if (img.h (1) < 0)
					img.p ("top", img.xy.t - img.xy.y + e.pageY)
			}
		}
		let mouse_up = e => {
			if (!img.xy || img.lock)
				return
			ViewImg.setClass ("movable", 0)
			img.m = img.xy.x != e.pageX || img.xy.y != e.pageY
			img.xy = null
			let lo = img.w (1)
			let to = img.h (1)
			let l = img.getStyle ("left")
			let t = img.getStyle ("top")
			if (lo < 0) {
				if (l > 0)
					img.p ("left", 0)
				else if (l < lo)
					img.p ("left", lo)
			} else if (l != img.w () >> 1) {
				img.p ("left", img.w () >> 1)
			}
			if (to < 0) {
				if (t > 0)
					img.p ("top", 0)
				else if (t < to)
					img.p ("top", to)
			} else if (t != img.h () >> 1) {
				img.p ("top", img.h () >> 1)
			}
		}
		let mouse_down = e => {
			if (img.lock || !img.fs)
				return
			ViewImg.setClass ("movable", 1)
			img.xy = {
				x: e.pageX,
				y: e.pageY,
				l: img.getStyle ("left"),
				t: img.getStyle ("top")
			}
			return true
		}
		let close = e => {
			if (e.view != win || img.close++)
				return e.stop ()
			this.Event.un ("escape-key", close)
			ViewImg.setClass ("close", 1).fire ("modal")
			if (img.un_ev)
				img.un_ev ()
			if (img.touch)
				img.touch.done ()
			win.setTimeout (_ => {
				this.root.remove (ViewImg)
				cb_end && cb_end ()
			}, ViewImg.td ("opacity"))
			e.stop ()
		}
		img.on ("load", function ( e ) {
			let tend = cb => {
				this.on ("transitionend", e => {
					cb && cb ()
					this.lock = 0
				}, { once: true })
			}
			Object.assign (this, {
				p ( p, v ) { this.s ({ [p]: `${v}px` }) },
				w ( o ) { return ViewImg.clientWidth - this.offsetWidth - (o ? 0 : this.naturalWidth - this.width) },
				h ( o ) { return ViewImg.clientHeight - this.offsetHeight - (o ? 0 : this.naturalHeight - this.height) },
				z () { this.setClass ("zoom", this.w () < 0 || this.h () < 0) },
				reset () {
					ViewImg.setClass ("ready", 0).setClass ("full-size", 0)
					this.lock = this.m = 0
					this.size ().pos ().un_ev ()
				},
				un_ev () {
					this.un ("mousedown", mouse_down)
					doc.removeEventListener ("mouseup", mouse_up)
					doc.removeEventListener ("mousemove", mouse_move)
				},
				close: 0
			})
			ViewImg.className = ""
			this.on ("click", e => {
				if (el.error || e.button != 0 || this.lock || this.m)
					return
				if (this.w () > 0 && this.h () > 0)
					return
				this.lock = 1
				if (this.fs ^= 1) {
					this.rect (this.w (1) >> 1, this.h (1) >> 1, this.width, this.height).setClass ("zoom", 0)
					ViewImg.setClass ("full-size")
					August.sync (win, _ => {
						ViewImg.setClass ("ready")
						this.rect (
							this.w () >> 1,
							this.h () >> 1,
							this.naturalWidth,
							this.naturalHeight
						)
					})
					tend (_ => {
						this.on ("mousedown", mouse_down)
						doc.addEventListener ("mouseup", mouse_up)
						doc.addEventListener ("mousemove", mouse_move)
					})
				} else {
					let w = ViewImg.clientWidth - this.offsetWidth + this.width
					let h = ViewImg.clientHeight - this.offsetHeight + this.height
					let [iw, ih] = this.offsetWidth * h > this.offsetHeight * w
						? [w, w * this.naturalHeight / this.naturalWidth + .5 | 0]
						: [h * this.naturalWidth / this.naturalHeight + .5 | 0, h]
					this.rect (w - iw >> 1, h - ih >> 1, iw, ih).setClass ("zoom", 1)
					tend (_ => this.reset ())
				}
			}).on ("dragstart", e => {
				e.stop ()
			}).on ("mouseover", e => {
				this.z ()
			}).z ()
			this.touch = new august_touch (img, {
				start:	mouse_down,
				move:	mouse_move,
				end:	mouse_up
			})
		}).on ("error", e => {
			el.error = 1
			el.setClass ("hand", 0).setClass ("error", 1)
			e.view = win
			close (e)
		}).on ("contextmenu", close).on ("abort", close)
		btn.on ("click", e => {
			if (e.$ == btn.el (0)) {
				close (e)
			} else if (e.$ == btn.el (1)) {
				if (doc.fullscreenElement)
					doc.exitFullscreen ()
				else
					ViewImg.requestFullscreen ().catch (e => Chat.errCon ("error", { MESSAGE: `${e.message} (${e.name})` }))
			} else if (e.$ == btn.el (2)) {
				fetch (img.src).then (r => r.blob ()).then (b => {
					let a = this.root.append ("a", {
						href:		win.URL.createObjectURL (b),
						download:	el.dataset.save,
						style:		"display: none"
					})
					a.click ()
					win.URL.revokeObjectURL (a.href)
					this.root.remove (a)
				})
			}
		})
		ViewImg.on ("fullscreenchange", e => {
			ViewImg.setClass ("full-screen")
			if (img.fs) {
				img.fs = 0
				img.reset ()
			}
		})
		if (!el.dataset.save)
			btn.el (2).display ()
		img.tabIndex = -1
		img.focus ()
		this.Event.on ("escape-key", close)
		ViewImg.fire ("modal", 1)
	},
	userinfo ( id ) {
		if (isNumber (id))
			id = { id2: id }
		this.wwo (
			"info.php",
			`INFO_${id.id2 ? "ID2" : id.nickid ? "NICKID" : id.p ? "PROFILE" : ""}_${id.id2 || id.nickid || id.p}`,
			"userinfo",
			null,
			id.id2 || "",
			id.nickid ? `nickid=${id.nickid}` : id.p ? `profile=${id.p}` : ``
		)
	},
	xhr ( lo, cb_http ) {
		return ( ... a ) => August.xhr (l => (lo && lo (l), this.loader (l)), cb_http, s => this.errCon ("xhr", { STATUS: s }))(... a)
	},
	css ( win, css, cb, add ) {
		August.loadCSS (win, add ? css.concat (this.$CSS.filter (s => s.isTrue ())) : css, this.Design || "0", cb, n => this.errCon ("css", { NAME: n }))
	},
	css1 ( win, css, cb ) {
		this.css (win, css, cb, 1)
	},
	tpl ( tpl, apl, lo ) {
		return new august_tpl (tpl, { APL: apl, get TPL () { return Chat.TPL } }, l => (lo && lo (l), this.loader (l)), _ => this.errCon ("tpl"))
	},
	http ( cb ) {
		return new august_http ().http (l => this.loader (l), cb)
	},
	load ( f ) {
		if (!(User.ID && f && /^(?:https?:)?\/\//i.test (f)))
			return
		August.loadJS (f).then (js => {
			js.ready || this.con ("".set ("notice", "js-loaded"), { NAME: f.replace (/^.+?\/([^\/]+)$/, "$1") })
		}).catch (_ => {
			this.errCon ("js", { NAME: f.htmlEntities () })
		})
	},
	loadModule ( n, a, f, cb, w ) {
		if (!User.ID && !f)
			return
		if (this.$Modules.hasOwnProperty (n)) {
			try {
				this.$Modules [n].init.apply (this.$Modules [n], a)
			} catch ( e ) {
			}
		} else if (n && !this.$ModulesArgs [n]) {
			this.$ModulesArgs [n] = { a, w }
			this.loader (1)
			August.loadJS (`august.module.${n}.js`).then (js => {
				this.loader ()
				cb && cb (js, n)
			}).catch (_ => {
				this.loader ()
				this.errCon ("module", { NAME: n })
				delete this.$ModulesArgs [n]
				cb && cb (null, n)
			})
		}
	},
	initModule ( n, m ) {
		let Args = this.$ModulesArgs [n]
		if (!Args)
			return
		if (isFunction (m)) {
			try {
				m = new m (this.win)
				m.$w = Args.w
				m.init.apply (m, Args.a)
				this.$Modules [n] = m
			} catch ( e ) {
				this.errCon ("error", { MESSAGE: e.message })
			}
		}
		delete this.$ModulesArgs [n]
	},
	event ( ev, p1, p2, p3 ) {
		switch (ev) {
			case "INIT":
				if (p2 & 3)
					this.ExeCmd = 1
				if (p2 & 2)
					this.glc = 0
				if (p2 & 4)
					this.clear ()
				if (p2 & 8)
					this.Send.disable ().delay (2)
				this.lm = p1
				this.TimeZone = p2 >> 4
				if (!p3)
					break
				p1 = this.chat.children.length
				p2 = p1 && !(p2 & 8 || this.view.scrollEnd < 1)
				this.ScrollOn = 0
				for (let m of p3)
					this.mout (August.html.mess (m [0], User.Set), 1).id = `ph${m [1]}`
				this.ScrollOn = 1
				if (p2)
					break
				August.sync (this.win, _ => {
					if (this.Dir && !p1)
						this.view.scrollTop = this.view.scrollHeight - (6 * this.view.clientHeight / 5 | 0)
					this.scroll (_ => this.view.scrollHeight)
				})
				break
			case "GAG":
				this.gag ()
				break
			case "CLR":
				this.clear ()
				break
			case "NO_AUTH":
				this.error ("no-auth").auth ({ sess: this.sess })
				break
			case "ERR":
				this.error (p1, p2)
				break
			case "ERR2": {
				let e = this.getError (p2, p3)
				this.notice ("error", p1, "", { ERROR: e.p ? `\x11${e.p}${e}\x10` : e })
				break
			}
			case "NOTICE":
				this.notice ("notice", p1, p2, p3 ? { NOTICE: p3 } : void 0)
				break
			case "SET": {
				let p = Math.abs (p2)
				User.Set ^= p
				this.Send.translit (User.set (39))
				this.setClass ("mono", User.set (38)).notice ("notice", p1, (User.Set ^ (p2 < 0 ? p : 0)) & p ? "ON" : "OFF")
				break
			}
			case "SET_VOLUME":
				this.Player.volume (p2)
				this.notice ("notice", p1, "", { VOLUME: this.Player.volume () })
				break
			case "SET_DELAY":
				User.SoundDelay = p2
				this.notice ("notice", p1, "", { DELAY: p2.toString ().true (1) })
				break
			case "SET_DESIGN": {
				if (!p2)
					return this.loadModule ("ext", [{ cmd: p1 }, "", "", this])
				let r = this.loadDesign (p2)
				let d = this.cfg.DesignList [p2]
				this.notice ("notice", p1, r || d ? "" : "ERROR", { DESIGN: d ? d.n : "" })
				break
			}
			case "DATE":
				this.notice ("date", p1, "", { DATE: ( f, l ) => p2.date (f, l) })
				break
			case "NOTE":
				this.sound (1)
				this.notice ("note", "", "", { "": t => this.ctrl ("note", t, { note: p1 }) })
				break
			case "PRIVATE":
				this.sound (2)
				this.notice (p2 & 0x80000 ? "room" : "private", "", "", {
					"":	t => this.ctrl ("private", t, { id: p2.w0, cmd: p2.w1 }),
					NICK:	p1,
					ROOM:	p3,
				})
				break
			case "PRIVATE2":
				this.notice ("2private", "", "", {
					ME:	p1,
					NICK:	p2
				})
				break
			case "WEBCAM":
				if (p1)
					return this.menu.webcam (p1, p2, p3)
				this.sound (3)
				this.notice ("webcam", "", "", {
					"":	t => this.ctrl ("webcam", t, { id: p2 }),
					NICK:	p3
				})
				break
			case "VOTE":
				if (!p1) {
					this.notice ("notice", "system", "VOTE")
					this.chat.all (`#__vote${p3}`).forEach (d => d.setClass ("disabled"))
					if ($(`win2_vote_${p3}`, this.win))
						this.Win2.hide (1)
					return
				}
				this.sound (5)
				this.notice ("vote", "system", "", {
					WATCH:	t => this.ctrl ("vote", t, { cmd: 0, id: p1 }),
					YES:	t => this.ctrl ("vote", t, { cmd: 1, id: p1 }),
					NO:	t => this.ctrl ("vote", t, { cmd: 2, id: p1 }),
					NICK:	p2
				}).id = `__vote${p1}`
				break
			case "MODER":
				this.sound (1)
				if (p3 == "NP")
					this.mout (p1.replace (/<\*(.+?)\*>/, ( $0, $1 ) => this.ctrl ("user", $1, { profile: p2 })))
				else if (p3 == "MPS")
					this.mout (p1.replace (/<\*(.+?)\*>/, ( $0, $1 ) => this.ctrl ("mps", $1, { mps: p2 })))
				break
			case "SET_PRIV":
				User.Priv.init (`0x${p1}`)
				this.Event.fire ("user-priv")
				break
			case "STATUS":
				User.status (p1, 1)
				break
			case "RESET":
				User.reset ()
				break
			case "HIDE":
				this.hide (p1, p2)
				break
			case "AVATAR":
				User.Avatar = p1
				this.avatar (p1)
				break
			case "UPDATE_SM":
				this.update.sm = p1
				break
			case "UPDATE_STAT":
				this.cfg.UserStatus = p1
				break
			case "K1":
				this.Send.delay (p1)
				break
			case "K2":
				location = `lock.php?${p1}`
				break
			case "EXE_CMD":
				this.ExeCmd = 1
				break
			case "EXIT":
				this.menu.exit ()
				break
			case "PRIV":
				this.loadModule ("priv", [p1, p2])
				break
			case "EXT":
				this.loadModule ("ext", [p1, p2, p3, this])
				break
			case "HELP":
				this.loadModule ("ext", [{ cmd: "help" }, p1, "", this])
				break
			default:
				this.Event.fire ("event", ev, p1, p2, p3)
		}
	},
	get dictWidget () {
		return this.main
	},
	menu: {
		menu		( v ) { Chat.setClass ("show-nav-menu", v) },
		userlist	() { Chat.$PanelShown && Chat.$PanelModule.last () === Chat.$Modules.userlist ? Chat.showPanel () : Chat.loadModule ("userlist", ["online"], 1) },
		help		() { this.text ("help") },
		rules		() { this.text ("rules") },
		reg_rules	() { this.text ("reg-rules") },
		text		( t ) { Chat.loadModule ("modal", ["chat-" + t, "text"], 1) },
		online		() { Chat.loadModule ("userlist", ["online"], 1) },
		offline		() { Chat.loadModule ("userlist", ["offline"], 1) },
		smiles		() { Chat.loadModule ("smiles", ["smiles"]) },
		mysmiles	() { Chat.loadModule ("smiles", ["mySmiles", Chat]) },
		myphrases	() { Chat.menu.phrases (0) },
		phrases		( ... a ) { Chat.loadModule ("phrases", a) },
		private		( ... a ) { Chat.loadModule ("private", a) },
		kill		( ... a ) { Chat.loadModule ("kill", a) },
		webcam		( ... a ) { Chat.loadModule ("webcam", a) },
		notebook	( ... a ) { Chat.loadModule ("notebook", a) },
		vote		( id2, vote = 0 ) { Chat.sendCmd (24, { id2, vote }) },
		ignore		( id2, ign = 2 ) { Chat.sendCmd (25, { id2, ign }) },
		miniroom	( r, c ) { Chat.sendCmd (26, { r, c }) },
		games		( p ) { if (User.ID) Chat.sendCmd (27, p) },
		myhistory	() { if (User.ID) Chat.Send.historyList () },
		attach		() { if (User.ID) Chat.Send.attachFile () },
		exit		() { if (User.ID) Chat.auth ({ id: User.ID, sess: Chat.sess, exit: 1 }) },
		admin		() { Chat.wwo ("@/admin/", "ADMIN", "admin", { f: 1027 }) }
	},
	cfg: {
		CMenu: {},
		DesignList: {},
		TPLList: {},
		DesignCount: 0,
		win: {},
		getWin ( win, f = 2 ) {
			let w = this.win [win]
			return {
				x: root.screenX || root.screenLeft,
				y: root.screenY || root.screenTop,
				w: w && w.w || 0,
				h: w && w.h || 0,
				f: w && w.f || f
			}
		}
	},
	$ERROR_CFG: {
		ERROR_CFG: cfg => {
			if (cfg) for (let e in cfg) {
				if (!Chat.cfg.error [e])
					Chat.cfg.error [e] = { t: cfg [e] }
			}
			return ""
		}
	},

	Version: 0,
	Design: -1,
	TPL: "",
	TPL_MD5: "",
	Dir: 1,
	ScrollOn: 1,
	me: 1,
	sc: 0,
	lm: 0,
	ts: 0,
	tt: 0,
	glc: 0,
	ExeCmd: 1,
	Cmd: {},
	Win: {},
	$CSS: ["main", "chat", "cmenu"],
	$PanelShown: 0,
	$PanelModule: [],
	$Modules: {},
	$ModulesArgs: {},
	$Loader: 0,
	$Focus: []
}

User = {
	init ( a ) {
		this.setup (a)
		this.Phrases = []
		for (let i = 0; i < a.Hot.length; i += 2)
			this.Phrases [a.Hot [i]] = a.Hot [i + 1]
		this.Entry = August.now ()
		this.ID = a.ID
		this.ID4 = a.ID.slice (-4)
		this.Nick = a.Nick
		this.Profile = a.Profile
		this.Status = a.Status
		this.Avatar = a.Avatar
		this.Smiles = a.Smiles || Chat.Storage.mysmiles || ""
		this.PersonalSmiles = a.PrSmiles
		this.Priv = new august_bitset (`0x${a.Priv}`)
		this.Attachments = {}
		if (this.set (62) || (!a.Profile && Chat.$Modules.menu))
			Chat.loadModule ("menu")
	},
	setup ( a ) {
		this.Set = a.Settings
		this.NickList = []
		this.nList = {}
		this.pList = []
		this.Sound = a.Sound
		this.Scroll = this.set (53) ? 5 : 30
		if (a.Volume)
			Chat.Player.volume (a.Volume)
		if (this.Set) {
			this.MaxMess = this.MAX_MESS [this.Set >> 24 & 7]
			if (a.NickList) {
				this.nList = {}
				this.nList.length = 1
				this.NickList = a.NickList.split (",")
				this.NickList.forEach (n => this.nList [n.replaceAll (" ", "").toLowerCase ()] = 1)
			}
			if (a.ProfileList) {
				this.pList = []
				a.ProfileList.forEach (p => this.pList [p] = 1)
			}
		}
		Chat.Storage.Setup = this.Set
	},
	post_init () {
		Chat.Event.fire ("user-post-init")
		if (this.set (30))
			Chat.loadModule ("timer-alarm", [false])
	},
	reset () {
		if (!this.ID)
			return
		Chat.Event.fire ("user-reset")
		this.ID = ""
		this.Nick = ""
		this.Avatar = 0
		this.Set = 0
		this.Priv.init ()
		this.Attachments = null
		this.$c = 0
		this.idle (1)
	},
	status ( s, no ) {
		if (!isSet (s))
			return this.Status >> 12 & 0x3f
		this.Status &= ~(0x3f << 12)
		this.Status |= s << 12
		Chat.Event.fire ("user-status", s)
		if (!no)
			Chat.sendCmd (32, { s })
	},
	idle ( f ) {
		if (f) {
			Chat.win.clearTimeout (this.$b)
			this.$b = 0
		} else if (!this.$b) {
			this.$b = Chat.win.setTimeout (_ => {
				this.$b = 0
				Chat.sendCmd (31)
			}, 300000)
		}
	},
	sex ( s ) {
		if (isSet (s))
			this.Status = this.Status & ~(3 << 20) | s << 20
		return this.Status >> 20 & 3
	},
	attach ( t, f, at ) {
		let h = f.hash ()
		let a = this.Attachments [t]
		if (!a)
			a = this.Attachments [t] = { Hash: {}, idx: 0 }
		let idx = a.Hash [h]
		if (idx)
			return idx
		let i = at.find (a => a.h == h)
		if (i)
			return i.idx
		idx = ++a.idx
		at.push ({ t, f, h, idx })
		return idx
	},
	setAttach ( a ) {
		this.Attachments [a.t].Hash [a.h] = a.idx
	},
	toMe ( m ) {
		if (!this.ID || m.system)
			return false
		m = m.replace (/<a class=nick data\-uid=\d+.+?a n>/g , "").stripTags ()
		return this.set (60)
			? new RegExp (`\\b${this.Nick.escapeRegExp ()}\\b`).test (m)
			: m.toLowerCase ().includes (this.Nick.toLowerCase ())
	},
	isNick ( m ) {
		return this.ID && m.system && (
			this.pList [m.profile]
			|| (/<a class=nick data\-uid=\d+>(.+?)<\/a n>/.test (m) && this.nList [RegExp.$1.stripTags ().replaceAll (" ", "").toLowerCase ()])
		)
	},
	privWebcam () {
		return !!(this.Priv.test (45))
	},
	privAttach () {
		return !!(this.Priv.test (46))
	},
	privDictaphone () {
		return !!(this.Priv.test (48))
	},
	reg () {
		return this.set (22)
	},
	set ( b ) {
		return !!(b < 32 ? this.Status & (1 << b) : this.Set & (1 << b - 32))
	},

	ID: "",
	ID4: "",
	Nick: "",
	Avatar: 0,
	Status: 0,
	Profile: 0,
	Set: 0,
	MaxMess: 50,
	SoundDelay: 30,
	Sound: 0,
	Priv: null,
	Attachments: null,
	Scroll: 30,
	PrivateSet: 0x00030000,
	MAX_MESS: [50, 100, 150, 200, 300, 500, 1000, 0],
	$a: 0,
	$b: 0,
	$c: 0
}

function august_chat_form ( chat ) {
	function send () {
		if (!Locked)
			self.$send ()
		return false
	}
	function clear () {
		if (!Locked)
			self.$clear ()
		return false
	}
	function xmm () {
		let m = ClickNick
			? imess.value.replace (new RegExp (`(${Chat.cfg.PrivateChar.escapeRegExp ()}?${ClickNick.escapeRegExp ()},?)`, "g"), "\x01$1\x01")
			: imess.value
		let r = ""
		let n = 1
		for (let i = 0; i < m.length; i++) {
			let ch = m [i].charCodeAt ()
			if (ch == 1)
				n ^= 1
			else
				r += (ch < 0x80 && n) ? XMM [ch - 0x20] || "" : m [i]
		}
		imess.value = r
	}
	function focus ( e ) {
		let el = e && e.$
		if (el && (el.type == "select-one" || el.type == "text" || el.type == "password" || el.type == "search"))
			return
		if (SetFocus)
			imess.blur (), imess.focus ()
		SetFocus = 1
	}
	function translit ( e ) {
		if (this.type != "checkbox") {
			if (e.type == "click")
				this.checked ^= 1
			else
				return
		}
		self.translit (this.checked)
	}
	function private ( e ) {
		if (this.type != "checkbox") {
			if (e.type == "click")
				this.checked ^= 1
			else
				return
		}
		self.private (this.checked)
	}
	function led ( name, checked ) {
		let ch = form [name]
		if (ch && ch.type == "checkbox") {
			ch.checked = checked
			ch = ch.parent ()
			if (ch.hasClass (name))
				ch.noselect ().setClass ("on", checked)
		}
	}
	function paste ( e ) {
		let fs = e.clipboardData.files
		if (User.privAttach () && fs.length)
			August.img2webp (fs [0], `paste_${++cPaste}_${Date.now ()}`, f => insert_attach ([f]), busy)
	}
	function keydown ( e ) {
		return kd = Locked ? !Locked : keydown2 (e)
	}
	function keypress ( e ) {
		return (e ? kd : true) && (!Translit || August.translit (e, this))
	}
	function keydown2 ( e ) {
		let Code = e.keyCombo ()
		if (Code) {
			let t = User.Phrases [Code]
			if (!t)
				return true
			self.insert (t)
			return e.stop ()
		} else if (e.keyCode == 13) {
			if (e.ctrlKey && imess.value) {
				self.pnick ()
				send ()
			} else if (!imess.value && ClickNick) {
				imess.value = `${e.ctrlKey ? Chat.cfg.PrivateChar : ""}${ClickNick}, `
				InsertNick = 1
				return false
			} else if (InsertNick) {
				imess.value = ClickNick = ""
				return false
			} else if (imess.rows && !e.shiftKey) {
				send ()
				return false
			}
		} else if (e.keyCode == 38) {
			if (e.ctrlKey)
				return true
			let h = History.prev ({ nick: ClickNick, mess: imess.value })
			if (h !== null) {
				ClickNick = h.nick
				imess.value = h.mess
				InsertNick = 0
				return false
			}
		} else if (e.keyCode == 40) {
			if (e.ctrlKey)
				return true
			let h = History.next ()
			if (h !== null) {
				ClickNick = h.nick
				imess.value = h.mess
				InsertNick = 0
				return false
			}
		} else if (e.keyCode == 33) {
			chat.scrollView (1)
			return false
		} else if (e.keyCode == 34) {
			chat.scrollView ()
			return false
		} else if (e.ctrlKey && e.altKey && User.set (39)) {
			Translit ^= 1
			led ("trans", Translit)
		}
		InsertNick = 0
		return true
	}
	function busy ( d ) {
		self.disable (d)
		Chat.setClass.call (chat, "busy", !!d)
	}
	function activate_attach () {
		chat.win.ondragstart = chat.win.ondragover = chat.win.ondrop = e => {
			if (e.type == "dragover")
				e.dataTransfer.dropEffect = User.privAttach () ? "copy" : "none"
			else if (e.type == "drop" && User.privAttach ())
				insert_attach (e.dataTransfer.files)
			return e.stop ()
		}
	}
	function insert_attach ( fs ) {
		if (Attach.length >= chat.cfg.AttachLimit || Locked)
			return
		for (let f of fs) {
			if (Attach.length < chat.cfg.AttachLimit) {
				if (/^image\/(gif|jpg|jpeg|pjpeg|png|x-png|webp)$/.test (f.type))
					self.insertFile ("PICTURE", f)
				else if (f.type == "image/bmp")
					August.img2webp (f, `${f.name}.webp`, f => self.insertFile ("PICTURE", f), busy)
				else if (/^audio\/(mpeg|ogg)$/.test (f.type))
					self.insertFile ("AUDIO", f)
				else if (/^video\/(mp4|webm|quicktime|avi)$/.test (f.type))
					self.insertFile ("VIDEO", f)
				else
					chat.error ("file-type", { FILE: f.name })
			}
		}
	}
	this.insertSelection = function () {
		if (!Locked)
			this.insert (chat.win.getSelection ().toString ())
		return this
	}
	this.insertFile = function ( t, f ) {
		if (f.size > Chat.cfg.AFS [t] * 1024)
			chat.error ("file-size", { FILE: f.name, SIZE: (f.size / 1024 | 0).numeral (), ASIZE: Chat.cfg.AFS [t].numeral () })
		else
			this.insert (`[${t}:${User.attach (t, f, Attach)}]`)
		return this
	}
	this.insert = function ( text, opt = 0 ) {
		 if (Locked && opt & 2 == 0)
			return this
		let b = imess.selectionStart
		let p = b + text.length
		imess.value = imess.value.substr (0, b) + text + imess.value.substr (imess.selectionEnd)
		imess.setSelectionRange (opt & 1 ? b : p, p)
		return this
	}
	this.nick = function ( Nick ) {
		let isDouble = _ => {
			let t = Date.now ()
			let r = (t - TimeClick) < 400
			TimeClick = r ? 0 : t
			return r
		}
	
		if (isDouble ())
			return this.pnick ()
		if (Chat.cfg.NPM && cNicks == Chat.cfg.NPM)
			return
		imess.value = `${Nick}, ${User.set (59) && ClickNick ? imess.value.replace (new RegExp (`${Chat.cfg.PrivateChar.escapeRegExp ()}?${ClickNick.escapeRegExp ()}(, )\\?`, "g"), "") : imess.value}`
		ClickNick = Nick
		cNicks++
	}
	this.pnick = function () {
		if (imess.value [0] != Chat.cfg.PrivateChar)
			imess.value = Chat.cfg.PrivateChar + imess.value
	}
	this.form = function () {
		return form
	}
	this.mess = function () {
		return imess
	}
	this.clickNick = function ( n ) {
		if (!isSet (n))
			return ClickNick
		ClickNick = n || ""
	}
	this.sentHistory = function () {
		return History
	}
	this.nofocus = function () {
		SetFocus = 0
	}
	this.cnicks0 = function () {
		cNicks = 0
	}
	this.translit = function ( t ) {
		Translit = t | 0
		led ("trans", Translit)
	}
	this.private = function ( t ) {
		Private = t | 0
		led ("private", Private)
	}
	this.disable = function ( d ) {
		if (d || this.Disabled)
			form.setClass ("disabled", this.Disabled += d ? 1 : -1)
		return this
	}
	this.focus = function ( e ) {
		focus (e)
		return this
	}
	this.lock = function ( l ) {
		Locked = !!l
		return this
	}
	this.locked = function () {
		return Locked
	}
	this.attachFile = function () {
		if (!User.ID)
			return
		if (!User.privAttach ())
			return chat.error ("deny")
		if (!File) {
			File = chat.root.append ("input", {
				type:     "file",
				accept:   "image/*",
				multiple: true
			})
			File.onchange = e => { insert_attach (File.files); File.value = "" }
		}
		File.click ()
	}
	this.send = function () {
		if (!User.ID)
			return Chat.event.call (chat, "NO_AUTH")
		if (this.Disabled || !/\S/.test (imess.value))
			return
		let nick = ClickNick
		let NoNick = !nick || !imess.value.includes (nick)
		if (Private && !NoNick)
			this.pnick ()
		let mess = imess.value.trim ()
		let max = imess.attr ("maxlength")
		if (max && max < mess.length)
			mess = mess.substr (0, max)
		if (History.last ().mess != mess)
			History.put ({ nick, mess })
		form.nick.value = NoNick ? "" : nick
		form.mess.value = mess
		imess.value = ""
		if (Attach.length) {
			let data = new FormData (form)
			data.append ("id", User.ID)
			for (let a of Attach) {
				if (mess.includes (`[${a.t}:${a.idx}]`))
					data.append (a.t.toLowerCase () + a.idx, a.f)
				else
					a.d = 1
			}
			imess.parent ().attr ("upload", "0")
			Chat.setClass.call (chat, "upload", 1)
			this.lock (1)
			new august_http (1).http (busy, http => {
				http.upload.onprogress = e => {
					imess.parent ().attr ("upload", (100 * e.loaded / e.total).toFixed ())
				}
			}).send (`//${Chat.Host}/august`, r => {
				if (r === false)
					chat.error ("upload")
				else for (let a of Attach)
					!a.d && User.setAttach (a)
				Chat.setClass.call (chat, "upload", 0)
				Attach.clear ()
				this.lock ()
			}, data)
		} else {
			let data = {}
			for (let d of form) {
				if (d.value && (d.type == "text" || d.type == "hidden"))
					data [d.name] = d.value
			}
			try {
				chat.Transport.send (data)
			} catch ( e ) {
				Chat.errCon ("error", { MESSAGE: e.message })
			}
		}
		this.cnicks0 ()
	}
	this.clear = function () {
		Attach.clear ()
		this.setMess ("")
		this.cnicks0 ()
	}
	this.setMess = function ( mess ) {
		imess.value = mess
	}
	this.xmm = function () {
		xmm ()
	}
	this.init = function () {
		let f = chat.form.$("form")
		if (form == f)
			return
		form = f
		imess = form.imess
		August.form.$hidden (form, { nick: "", mess: "", a: "" })
		imess.onpaste = paste
		imess.onkeydown = keydown
		imess.onkeypress = keypress
		form.onsubmit = send
		if (form.send)
			form.send.onclick = e => (send (), e.stop ())
		if (form.clear)
			form.clear.onclick = e => (clear (), e.stop ())
		if (form.xmm)
			form.xmm.onclick = e => (xmm (), e.stop ())
		if (form.trans)
			form.trans.onchange = translit
		if (form.private)
			form.private.onchange = private
		this.translit (User.set (39))
		activate_attach ()
		focus ()
		Chat.setFocus.call (chat, focus)
	}
	
	const XMM = " !Э№;%?э()*+б-ю.0123456789ЖжБ=Ю,\"ФИСВУАПРШОЛДЬТЩЗЙКЫЕГМЦЧНЯх/ъ:_ёфисвуапршолдьтщзйкыегмцчняХ\\ЪЁ"
	let self = this
	let History = new august_buffer (100)
	let InsertNick = 0, cNicks = 0, TimeClick = 0, Translit = 0, Private = 0, Locked = 0
	let Attach = [], SetFocus = 1, kd = false, ClickNick = "", cPaste = 0
	let File = null
	let form = null
	let imess = null
	this.$send = this.send
	this.$clear = this.clear
	this.Disabled = 0
	this.init ()
}

function august_chat_form_main ( chat ) {
	function send () {
		if (this.locked ())
			return
		this.focus ()
		chat.Win2.hide ()
		if (this.Disabled || !/\S/.test (imess.value))
			return
		let Mess = imess.value.trim ()
		if (cmd.call (this, Mess))
			return imess.value = ""
		if (LastMess != Mess) {
			LastMess = Mess
			RepeatMess = 0
		} else if (Chat.cfg.RM && ++RepeatMess >= Chat.cfg.RM) {
			imess.value = ""
			return
		}
		let Timeout = 0
		if (Chat.cfg.MPM && Chat.cfg.CPM) {
			let s = Date.now ()
			let j = MessCount % Chat.cfg.MPM
			let l = imess.value.length
			let t = 0
			af [j] = { s, l }
			for (let i = 1; i < Chat.cfg.MPM && l < Chat.cfg.CPM; i++) {
				t += af [j].s
				t -= af [j = (MessCount + Chat.cfg.MPM - i) % Chat.cfg.MPM].s
				l += af [j].l
			}
			Timeout += Chat.cfg.CPM * t < 60000 * l ? 60000 * l / Chat.cfg.CPM - t : 0
			t = s - af [(++MessCount) % Chat.cfg.MPM].s
			Timeout += t < 60000 ? 60000 - t : 0
		}
		this.send ()
		this.delay (Timeout / 1000 + 2)
		if (User.set (59) && this.clickNick ()) {
			chat.win.setTimeout (_ => {
				imess.value = `${imess.value [0] == Chat.cfg.PrivateChar ? Chat.cfg.PrivateChar : ""}${this.clickNick ()}, `
			}, 100)
		}
	}
	function clear () {
		if (this.locked ())
			return
		if (/\S/.test (imess.value))
			ErasedHistory.put ({ nick: this.clickNick (), mess: imess.value })
		this.clear ()
	}
	function cmd ( mess ) {
		if (mess [0] != "/")
			return false
		let a = mess.substr (1).split (/ +/)
		let c = a.shift ()
		if (!chat.Cmd.hasOwnProperty (c))
			return false
		try {
			chat.Cmd [c](... a)
			if (this.sentHistory ().last ().mess != mess)
				this.sentHistory ().put ({ mess })
		} catch ( e ) {
			Chat.errCon ("error", { MESSAGE: e.message })
		}
		return true
	}
	this.historyList = function () {
		let list = ( p, h, b, f ) => {
			let List = []
			h.each (( m, i ) => {
				List.push (`<a name=my-phrase-history class=list${f} data-list=${f} data-idx=${i}>${m.mess.htmlEntities ()}</a>`)
			})
			return List.length
				? p.pattern ([{
					NUM		() { return this.$i + 1 },
					PHRASE		() { return List [this.$i] },
					$size		() { return List.length },
				}], {
					TAB_NAME:	n => (b.push (n), "")
				})
				: ""
		}
		let history = _ => {
			let b = []
			let l0 = list (August.html.mess (Chat.cfg.HTML_MY [0], 0x30000), this.sentHistory (), b, 0)
			let l1 = list (August.html.mess (Chat.cfg.HTML_MY [1], 0x30000), this.erasedHistory (), b, 1)
			if (l0 || l1) {
				if (b.length == 2)
					chat.Win2.show ([{ t: l0, b: b [0] }, { t: l1, b: b [1] }])
				else
					chat.Win2.show (l0 + l1)
			}
		}

		if (chat.Win2) {
			if (isSet (Chat.cfg.HTML_MY))
				return history ()
			Chat.loadTPL (["chat-my1", "chat-my2"], r => {
				Chat.cfg.HTML_MY = [r.chat_my1, r.chat_my2]
				history ()
			})
		}
	}
	this.erasedHistory = function () {
		return ErasedHistory
	}
	this.delay = function ( t ) {
		this.disable (1)
		chat.win.setTimeout (_ => this.disable (), t * 1000 + 100)
	}
	this.reset = function () {
		RepeatMess = 0
	}
	this.init2 = function () {
		this.init ()
		this.form ().a.value = 22
		imess = this.mess ()
	}

	arguments.callee.superclass.constructor.apply (this, arguments)
	let imess = null
	let ErasedHistory = new august_buffer (100)
	let MessCount = 0
	let RepeatMess = 0
	let LastMess = ""
	let af = []
	for (let i = 0; i < Chat.cfg.MPM; i++)
		af [i] = { t: 0, l: 0 }
	this.$send = send
	this.$clear = clear
	this.init2 ()
	this.disable (1)
}

function august_win2 ( win ) {
	this.win = function () {
		return $win2 || ($win2 = win.document.createElement ("chat-win2"))
	}
	this.show = function ( c, o, m ) {
		if ($shown && $m && $m == m && !(o & 0x40))
			return
		if ($m && $m != m)
			$m.done ()
		if ($sb)
			$sb.done (), $sb = null
		$o = o || 0
		$m = m || null
		if (isArray (c)) {
			$win2.innerHTML = "<tab-view></tab-view>".repeat (c.length)
			for (let el of $win2.children)
				visible (el, 0)
			$tab = []
			$tab_btn = $win2.append ("span")
			if (o & 0x80 && m)
				$close = $win2.append ("a", { className: "close-btn", name: "close-win2" })
			c.forEach (( c, i ) => tab_add (c.t, c.b || "", $tab [i] = $win2.el (i), i))
			$cur = $tab [0]
			$cur.n = 0
			tab (0)
		} else {
			$win2.innerHTML = `<tab-view></tab-view>`
			$tab = $tab_btn = null
			$cur = $win2.first ()
			$cur.innerHTML = o & 0xc0 ? c : August.html.mess (c, 0x30000)
			if (o & 0x08)
				$cur.setClass ("center")
			if (o & 0x10)
				$cur.noselect ()
			visible ($cur)
		}
		$sb = window.august_scrollbar && !(o & 0x200) ? new august_scrollbar ($win2.first (), !!(o & 0x400)) : null
		if ($shown) {
			tab_btn (1)
		} else {
			if (!$sb)
				$cur.s ({ overflow: "hidden" })
			win.cancelAnimationFrame ($t)
			$win2.setHeight (0).display ("block")
			$shown = 2
			$win2.fire ("avatar", 1)
			Chat.setClass ("win2", 1)
			let ani = _ => {
				if ($h < 50) {
					$h += 1 + (50 - $h) / 5 | 0
					$win2.setHeight (`${$h}%`)
					$t = win.requestAnimationFrame (ani)
				} else if ($cur) {
					if (!$sb)
						$cur.s ({ overflow: "" })
					if (!(o & 0x20))
						tab_btn (1)
					$shown = 1
					$cur.scrollTop--
					$cur.scrollTop++
				}
			}
			ani ()
		}
		return $tab || $cur
	}
	this.hide = function ( h = 0 ) {
		if ($shown && (!($o & 0x02) || h)) {
			if ($m)
				$m.done ()
			win.cancelAnimationFrame ($t)
			if ($sb)
				$sb.done (), $sb = null
			else
				$cur.s ({ overflow: "hidden" })
			if ($o & 0x80)
				$win2.remove ($close)
			tab_btn (0)
			$shown = $o = 0
			$win2.fire ("avatar")
			Chat.setClass ("win2", 0)
			if (h & 2)
				$h = 1
			let ani = _ => {
				$h -= 1 + $h / 5 | 0
				if ($h) {
					$win2.setHeight (`${$h}%`)
					$t = win.requestAnimationFrame (ani)
				} else {
					$win2.display ().innerHTML = ""
					$m = $tab = $tab_btn = $cur = $close = null
				}
			}
			ani ()
		}
	}
	this.focus = function ( e ) {
		if ($o & 0x01 && e.$.isParent ($win2))
			Chat.Send.nofocus ()
	}
	this.shown = function () {
		return $shown
	}
	this.isOwn = function ( m ) {
		return $m && $m === m
	}
	this.set = function ( o ) {
		$o = o || 0
		$cur.noselect (o & 0x10 ? "none" : "auto")
	}
	this.add = function ( tc, tb ) {
		if (!$shown || !$tab)
			return
		let t = $win2.insert ("tab-view", $tab_btn)
		visible (t, 0)
		tab_add (tc, tb, t, $tab.length)
		$tab.push (t)
		tab ($tab.length - 1)
		return t
	}
	this.tab = function ( n ) {
		if ($tab_btn) {
			let c = $cur
			tab (n)
			if (!$sb && $shown == 2 && c.n != n) {
				c.s ({ overflow: "auto" })
				$cur.s ({ overflow: "hidden" })
			}
		}
	}
	this.tab_btn = function ( v ) {
		tab_btn (v)
	}
	this.set_tab_name = function ( t ) {
		$tab_btn.el ($cur.n).innerHTML = t
	}
	this.get_tab = function ( el ) {
		return $tab.indexOf (el)
	}
	this.get_tabs = function () {
		return $win2.$("tab-view")
	}
	this.close_current = function () {
		close.call (this, $cur.n)
	}
	this.close = function ( el ) {
		let idx = $tab.indexOf (el)
		if (idx != -1)
			close.call (this, idx)
		return idx
	}
	function tab ( n ) {
		$tab_btn.el ($cur.n).className = ""
		visible ($cur, 0)
		$cur = $tab [n]
		$cur.n = n
		$tab_btn.el ($cur.n).className = "cur"
		visible ($cur)
		if ($sb)
			$sb.setView ($cur)
		if ($o & 0x100)
			$m.select ($cur.n, $tab [$cur.n])
	}
	function tab_add ( tc, tb, t, i ) {
		t.innerHTML = $o & 0x04 ? tc : August.html.mess (tc, 0x30000)
		let b = $tab_btn.append ("span", { innerHTML: tb, t: i })
		b.noselect ()
		b.onclick = function ( e ) {
			if ($cur.n != this.t)
				tab (this.t)
			e.stop ()
		}
		if ($o & 0x10)
			t.noselect ()
	}
	function tab_btn ( v ) {
		if ($tab_btn)
			$tab_btn.display (v ? "block" : "none")
	}
	function visible ( el, v = 1 ) {
		el.s ({ visibility: v ? "" : "hidden", pointerEvents: v ? "" : "none", zIndex: v ? 1 : -1 })
	}
	function close ( n ) {
		$m.close (n, $tab [n])
		if ($tab.length == 1)
			return this.hide (1)
		else if (n == $tab.length - 1)
			tab ($tab.length - 2)
		else
			tab (n + 1), $cur.n--
		$win2.remove ($tab [n])
		$tab_btn.remove ($tab_btn.el (n))
		for (let i = 0; i < $tab_btn.children.length; i++)
			$tab_btn.el (i).t = i
		for (let i = n; i < $tab.length - 1; i++)
			$tab [i] = $tab [i + 1]
		$tab.length--
	}

	let $win2 = null
	let $shown = 0
	let $close = null
	let $tab = null
	let $tab_btn = null
	let $cur = null
	let $m = null
	let $o = 0
	let $t = 0
	let $h = 0
	let $sb = null
}

function august_cmenu ( chat ) {
	function hide () {
		if (uid)
			cm.fire ("modal").pos ({ top: "", left: "" })
		uid = null
	}
	function set_timer () {
		reset_timer ()
		cmt = chat.win.setTimeout (hide, 1500)
	}
	function reset_timer () {
		chat.win.clearTimeout (cmt)
	}
	function get_nick ( e ) {
		let el = e.$.up (chat.main, el => el.is ("A") && el.className == "nick")
		return el ? (el.n = el.innerHTML.stripTags (), el) : null
	}
	function menu ( e ) {
		hide ()
		let n = get_nick (e)
		if (!n)
			return true
		if (Chat.cfg.CMenu === null)
			return e.stop ()
		cm.fire ("modal", 1)
		cm.ph = n.parent ().up (chat.main, el => /^ph(\d+)(?:_\d+)?$/.test (el.id)) ? +RegExp.$1 : 0
		uid = {
			id2:	n.dataset.uid,
			nickid:	n.dataset.nickid,
			p:	n.dataset.p,
			self:	User.ID4.hex () == n.dataset.uid
		}
		let pm = {
			vote:	User.Priv.test (24),
			kill:	User.set (27),
			hide:	(User.set (29) || (uid.self && Chat.cfg.CMenu.hide && Chat.cfg.CMenu.hide.p.toLowerCase () != "moderonly")) && cm.ph,
			hideall:User.set (29) && cm.ph
		}
		let m = ""
		for (let a in Chat.cfg.CMenu) {
			if (!isSet (pm [a]) || pm [a])
				m += `<item data-a=${a}>${Chat.cfg.CMenu [a].t}</item>`
		}
		Chat.Event.fire ("cm-nick", n)
		cm.innerHTML = `<menu-title>${n.n}</menu-title>${m}`
		cm.pos (
			e.pageX > chat.main.offsetLeft + chat.main.clientWidth - cm.offsetWidth - 5 ? chat.main.clientWidth - cm.offsetWidth : e.pageX,
			e.pageY > chat.main.offsetTop + chat.main.clientHeight - cm.offsetHeight - 5 ? e.pageY - cm.offsetHeight : e.pageY
		)
		if (!st)
			set_timer ()
		return e.stop ()
	}
	function cm_click ( e ) {
		chat.win.setTimeout (hide)
		let a = e.$.dataset.a
		switch (a) {
			case "userinfo": return Chat.userinfo (uid)
			case "hide":     return Chat.sendCmd (uid.self ? 43 : 41, { m: cm.ph })
			case "hideall":  return Chat.sendCmd (42, { m: cm.ph })
		}
		Chat.menu [a] && Chat.menu [a](uid.id2)
	}
	function cm_over ( e ) {
		reset_timer ()
		return true
	}
	function click ( e ) {
		if (e.which != 1)
			return
		hide ()
		let n = get_nick (e)
		if (!n)
			return
		if (e.shiftKey) {
			if (e.ctrlKey && User.set (27))
				Chat.menu.kill (n.dataset.uid)
			else
				Chat.userinfo ({ id2: n.dataset.uid, nickid: n.dataset.nickid, p: n.dataset.p })
		} else if (e.altKey) {
			if (n.dataset.uid)
				Chat.menu.phrases (n.dataset.uid)
		} else if (e.ctrlKey) {
			menu (e)
		} else if (chat.Send) {
			chat.Send.nick (n.n.replace (/ /g, " ").replace (/&amp;/g, "&"))
		}
		return e.stop ()
	}
	function dblclick ( e ) {
		e.stop ()
	}
	function touch ( e ) {
		st = e.type == "touchstart"
		return true
	}

	let st = 0
	let cmt = 0
	let uid = null
	let cm = chat.main.append ("chat-cmenu")
	cm.noselect ()
	cm.on ("click", cm_click).on ("mouseover", cm_over).on ("mouseout", set_timer).on ("contextmenu", e => e.stop ())
	chat.main.on ("contextmenu", menu).on ("click", click).on ("dblclick", dblclick)
	if (Chat.TouchScreen)
		chat.main.on ("touchstart touchend", touch)
}

function august_ws_transport ( cb_conn, cb_disconn, cb_error ) {
	this.connect = function ( cb ) {
		if ($ws || !Chat.win.navigator.onLine)
			return
		$ws = new WebSocket (`${location.protocol.replace ("http", "ws")}//${Chat.Host}/august?cl=ex&a=21&r=${Chat.Room}&id=${User.ID}&lm=${Chat.lm}&glc=${Chat.glc}`)
		$ws.this = this
		$ws.onopen = function () {
			$ct = 0
			cb && cb ()
			cb_conn && cb_conn ()
		}
		$ws.onerror = function ( e ) {
			$ws = null
			if ($ct < 12000)
				$ct += 3000
			cb_error && cb_error ()
		}
		$ws.onclose = function () {
			let cb = this.cb
			$ws = null
			Chat.win.clearTimeout ($to)
			if (isSet ($ct))
				$to = Chat.win.setTimeout (_ => this.this.connect (cb), $ct + 100)
			cb_disconn && cb_disconn ()
			Chat.ExeCmd = 0 //?
		}
		$ws.onmessage = function ( d ) {
			let fr = new FileReader
			fr.onload = function () { eval (this.result) }
			fr.readAsText (d.data)
		}
	}
	this.reconnect = function ( cb ) {
		$ct = 0
		if ($ws)
			$ws.cb = cb, $ws.close ()
		else
			this.connect (cb)
	}
	this.disconnect = function () {
		$ct = void 0
		if ($ws)
			$ws.close ()
	}
	this.send = function ( p ) {
		if ($ws && $ws.readyState == 1)
			$ws.send (august_http_params (p))
	}
	function pwin ( m, ... a ) {
		let mp = Chat.$Modules.private
		mp && mp [m](... a)
	}

	let $ws = null
	let $ct = void 0
	let $to = 0

	let m = root
	let o = Chat.out.bind (Chat)
	let u = Chat.userlist.bind (Chat)
	let e = Chat.ext.bind (Chat)
	let ev = Chat.event.bind (Chat)
	let wev = pwin.bind (null, "event")
	let p = pwin.bind (null, "pout")
	let r = pwin.bind (null, "rout")
}

onload = function () {
	if (!INIT.OK) {
		location = "bad-browser.html"
		return
	}
	window.root = window
	window.name = "August Chat"
	window.wid = "MAIN"
	august_extend (august_chat_form_main, august_chat_form)
	Chat.init (window, $("app_chat") || document.body, function () {
		let p = ( el, n ) => { let a = el.attr (n); return a && a.split (":") }
		August.clickHandler (window, el => {
			el.blur ()
			let menu = el.attr ("menu") !== null
			if (el.attr ("module"))
				return this.loadModule (el.name, p (el, "args") || [], menu, null, this.w (p (el, "win"))), false
			if (this.menu [el.name])
				return this.menu [el.name](), false
			if (menu) {
				let name = el.name.replace (/[\W]/g, "_")
				this.wwo (el.name, name, name, this.w (p (el, "win") || [0, 0, 3]))
				return false
			}
			switch (el.name) {
				case "ctrl":
					let a = el.dataset.a
					if (a == "note")
						this.menu.notebook (0, 0, ~~el.dataset.note)
					else if (a == "webcam")
						this.menu.webcam (1, ~~el.dataset.id, el)
					else if (a == "game")
						this.menu.games ({ g: el.dataset.g, c: el.dataset.c, r: el.dataset.r, p: el.dataset.p ? JSON.parse (el.dataset.p) : null })
					else if (a == "user")
						this.userinfo ({ nickid: el.dataset.nickid, profile: el.dataset.profile })
					else if (a == "mps")
						this.wwo ("mps/", `MPS${el.dataset.mps}`, "mps", { f: 259 }, 0, `sid=${el.dataset.mps}`)
					else if (a == "close-win2")
						this.Win2.hide (1)
					else if (this.menu [a])
						this.menu [a](~~el.dataset.id, ~~el.dataset.cmd)
					break
				case "my-phrase-history":
					if (this.Send) {
						let h = (+el.dataset.list
							? this.Send.erasedHistory ()
							: this.Send.sentHistory ()).at (+el.dataset.idx)
						this.Send.clickNick (h.nick)
						this.Send.setMess (h.mess)
					}
					break
				case "expand":
					let bn = el.attr ("block")
					let ht = el.parent (bn.toUpperCase ())
					if (!ht)
						return false
					let t = ht.$(bn)
					if (t) {
						t.setHeight ()
						this.win.setTimeout (_ => t.setHeight (null), ht.setClass ("expand") ? t.td ("height") : 20)
					}
					break
				case "img-view":
					this.imgView (el, _ => this.setFocus (null), _ => (this.removeFocus (), this.focus ()))
					break
				case "smile-click":
					if (this.Send && el.dataset.x === "o")
						this.Send.insert (el.title)
					break
				case "close-win2":
					this.Win2.close_current ()
					break
				default:
					this.Event.fire ("click", el)
			}
			return false
		})
		let $bot = August.html.handler ("bot")
		let $url = August.html.handler ("url")
		let $email = August.html.handler ("email")
		let $time = August.html.handler ("time")
		let $topic = August.html.handler ("topic_code")
		let $nick = August.html.handler ("nick_code_int")
		August.html.handler ("bot", ( ... $ ) => $[1] == "m"
			? this.cfg.HTML_BotMusic.tpl ({
				SINGER:	$[2],
				TITLE:	$[3],
				SRC:	$[4]
			})
			: $[1] == "y"
			? this.cfg.HTML_BotYouTube.tpl ({
				ID:	$[2]
			})
			: $bot (... $)
		)
		.handler ("hidden_code", ( ... $ ) => this.cfg.HTML_HiddenText.tpl ({
			TEXT:		$[3],
			EXPAND:		$[1].htmlEntities (),
			COLLAPSE:	($[2] || $[1]).htmlEntities ()
		}))
		.handler ("time", ( ... $ ) => ( $[1] = (August.html.opt () & 0x80000 ? -(new Date ()).getTimezoneOffset () * 60 : this.cfg.TimeCorrect + this.TimeZone) + +$[1] + 86400, $time (... $)))
		.handler ("topic_code", ( ... $ ) => ($[1] = $[1].tpl ({ NICK: User.Nick }), $topic (... $)))
		.handler ("nick_code_int", ( ... $ ) => $[1] ? $nick (... $) : August.html.nick_code ($[3], $[2], User.ID))
		.handler ("url", INIT.CLICKABLE ? $url : ( ... $ ) => $[1])
		.handler ("email", INIT.CLICKABLE ? $email : ( ... $ ) => $[1])
		.handler ("imgHover", el => {
			if (!el.error && el.width < (+el.dataset.width || el.naturalWidth) && el.height < (+el.naturalHeight || el.dataset.height))
				el.setClass ("hand", 1)
		})
		.handler ("smHover", el => {
			el.setClass ("hand", User.ID && el.dataset.x === "o")
		})
		.handler ("flag", ( co, s ) => {
			let p = s ? "small" : "large"
			let f = this.cfg.flag && this.cfg.flag [p]
			return co && f ? August.html.img (`images/$flags.${p}/${f.p || ""}/${co}.${f.e}`, f.w, f.h, 0, "", "", "", this.cfg.Country && this.cfg.Country [co] || co, "flag") : ""
		})
		this.setFocus (e => {
			let Form = this.form.$("form")
			if (Form && Form.nick && !(e && (e.$.type == "select-one" || e.$.type == "text" || e.$.type == "password")))
				Form.nick.focus ()
		})
		this.root.on ("avatar", e => {
			let Avatar = this.root.$("avatar")
			if (!Avatar) {
			} else if (e.detail) {
				Avatar.hide = Avatar.hide ? Avatar.hide + 1 : 1
				Avatar.setClass ("hide", 1)
			} else if (!--Avatar.hide) {
				Avatar.setClass ("hide", 0)
			}
		}).on ("nofocus", e => {
			if (this.Mobile) {
				if (e.detail)
					this.setFocus (null)
				else
					this.removeFocus (), this.focus ()
			}
		}).on ("noselect", e => {
			this.root.noselect (e.detail ? "none" : "initial")
		}).on ("modal", e => {
			this.setClass ("modal", e.detail ? ++this.root.modal : this.root.modal ? --this.root.modal : 0)
		}).on ("keydown", e => {
			if (!e.handler ([{ c: 112, f: 0, t: "help" }, { c: 112, f: 1, t: "rules" }], c => this.menu.text (c.t)))
				return e.stop ()
			e.handler ({ c: 27, f: 0 }, _ => this.Event.fire ("escape-key", e), 1)
			&& e.handler ([{ c: 33, f: 0 }, { c: 34, f: 0 }, { c: 35, f: 0 }, { c: 36, f: 0 }, { c: 38, f: 0 }, { c: 40, f: 0 }], _ => this.Event.fire ("page-key", e), 1)
		}).on ("contextmenu click", e => {
			this.focus (e)
		}, true)
		ononline = _ => {
			this.Transport.connect ()
			this.Event.fire ("online")
		}
		onoffline = _ => {
			this.Event.fire ("offline")
		}
		onbeforeunload = _ => {
			this.done ()
			for (let t0 = Date.now (); Date.now () - t0 < 100;);
		}
		onerror = ( MSG, URL, LINE, COLUMN, ERROR ) => {
			if (ERROR)
				this.errCon ("jserror", { URL, LINE, COLUMN, ERROR })
			return !ERROR
		}
		onresize = this.Event.fire.bind (null, "window-resize")
		onfocus = this.Event.fire.bind (null, "window-focus", 1)
		onblur = this.Event.fire.bind (null, "window-focus", 0)
		document.onvisibilitychange = _ => this.Event.fire ("window-hidden", document.hidden)
		this.setCmd ({
			games:		() => this.load ("//august4u.ru/v2/js/august.games.js"),
			clear:		() => this.clear (),
			help:		() => this.menu.help (),
			load:		( f ) => this.load (f),
			menu:		( ... $ ) => this.loadModule ("menu", $),
			calendar:	( ... $ ) => this.loadModule ("ext", [{ cmd: "calendar" }, $[0], "", this])
		})
	})
}
