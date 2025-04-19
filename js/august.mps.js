//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.mps.js


function august_mps ( MPS ) {
	function mouse_handler ( e ) {
		if ($cfg.suspend)
			return true
		switch (e.type) {
			case "click":
				let a = e.$.dataset.a
				if (a && $ACTION [a]) {
					hide_pics ()
					$ACTION [a](e.$)
					e.stop ()
					return
				}
				break
			case "mousemove":
				if (e.$.is ("MPS-STARS")) {
					if (+e.$.dataset.v) {
						let i = +e.$.dataset.i
						let m = +e.$.dataset.max
						let w = (+!i + e.clientX - e.$.getBoundingClientRect ().left) / e.$.offsetWidth
						e.$.vote = i ? m * w + 1 | 0 : m * w
						e.$.el (1).s ({ width: 100 * (i ? e.$.vote / m : w).toFixed (1) + "%" }).attr ("vote", e.$.vote.locale ())
						e.$.attr ("tip", +e.ctrlKey)
					}
					return
				}
				break
			case "mouseout":
				if (e.$.is ("MPS-STARS")) {
					if (+e.$.dataset.v)
						e.$.el (1).s ({ width: 0 })
					return
				}
				break
		}
		$Event.fire ("mouse", e)
	}
	function key_handler ( e ) {
		if ($cfg.suspend)
			return true
		if (e.altKey && e.keyCode == 0x58)
			return $win.close ()
		if (!e.handler ({ c: 27, f: 0 }, esc_queue_exe))
			return
		if (no_form ()) {
			let r = e.handler ({ c: 37, f: 2 }, _ => {
				if ($Nav.prev)
					page ($Nav.prev)
			})
			&& e.handler ({ c: 39, f: 2 }, _ => {
				if ($Nav.next)
					page ($Nav.next)
			})
			&& e.handler ({ c: 36, f: 2 }, _ => {
				if ($Nav.first)
					page ($Nav.first)
			})
			&& e.handler ({ c: 35, f: 2 }, _ => {
				if ($Nav.last)
					page ($Nav.last)
			})
			&& e.handler ([{ c: 33, f: 2 }, { c: 37, f: 4 }], _ => {
				if ($Nav.first)
					page ($Nav.prev_block)
			})
			&& e.handler ([{ c: 34, f: 2 }, { c: 39, f: 4 }], _ => {
				if ($Nav.last)
					page ($Nav.next_block)
			})
			&& e.handler ({ c: 112, f: 0 }, help)
			&& key_action (e)
			if (!r)
				return hide_pics ()
		}
		$Event.fire ("keydown", e)
	}
	function key_action ( e ) {
		if ($cfg && isArray ($cfg.key_handler)) for (let k of $cfg.key_handler) {
			let a = k.KEY && $ACTION [k.ACTION]
			let f = k.KEY && ((k.KEY.ALT ? 1 : 0) | (k.KEY.CTRL ? 2 : 0) | (k.KEY.SHIFT ? 4 : 0))
			if (a && !e.handler ({ c: k.KEY.CODE, f }, a, true))
				return false
		}
		return true
	}
	function a_design ( el ) {
		design (el.dataset.d || $Des)
	}
	function a_link ( el ) {
		$win.open (el.dataset.url, el.target)
	}
	function a_userinfo ( el ) {
		if (root.Chat && root.Chat.userinfo)
			return root.Chat.userinfo ({ p: el.dataset.p })
		August.wo ($cfg.ui.tpl ({ PROFILE: el.dataset.p }), `userinfo_${el.dataset.p}`)
	}
	function a_open ( el ) {
		let b = MPS.root.$(`mps-mess#mps_m_${MPS.SID}_${el.dataset.id}`)
		b.setHeight ()
		b.remove (b.lastChild)
		b.remove (b.lastChild)
		for (let d of b.all ("mps-hide"))
			d.outerHTML = d.innerHTML
		expand (b)
	}
	function a_comments ( el ) {
		let m = get_mess (+el.dataset.m)
		let c = MPS.root.$(`mps-comment#mps_comments_${MPS.SID}_${m.id}`)
		if (!m.cc) {
			expand (c)
			c.dataset.hidden ^= 1
			return
		}
		xhr ("mps.text", r => {
			if (isString (r))
				return notice (r)
			if (r.rid != $RID)
				return
			$Text.imgs = {}
			m.c = r.c
			m.cc = 0
			c.innerHTML = $tpl.comment.pattern ([
				text_tpl ().$init (m.c, +el.dataset.m, !($Form && $Form.is_comment ()))
			])
			expand (c)
			c.dataset.hidden = 0
			get_images (r.rid)
		}, {
			sess:	$cfg.SessID,
			ut:	$cfg.ut,
			comm:	m.id,
			rid:	++$RID
		})
	}
	function a_contents () {
		if ($Form)
			$Form.cancel ()
		if (!$Nav.cont && $cfg.cont) {
			$Nav.mpp = 0
			page (~~$MPSText.page)
		}
	}
	function a_mess ( el ) {
		let m = get_mess (+el.dataset.m)
		$Nav.cont = 0
		$Nav.mpp = 1
		$MPSText.page = $Nav.page
		page (m.num - 1)
	}
	function a_page ( el ) {
		page (~~el.dataset.p)
	}
	function a_collapse ( el ) {
		get_block (el, ( b, p ) => {
			b.setHeight ()
			setTimeout (_ => {
				clearTimeout (b.to)
				if (!p.setClass ("collapse"))
					b.to = expand (b)
			}, 17)
		})
	}
	function a_copy ( el ) {
		get_block (el, b => August.copy (b, void 0, 200))
	}
	function a_toggle ( el ) {
		get_block (el, b => (el.setClass ("toggle"), b.setClass (el.dataset.class)))
	}
	function a_vote ( el ) {
		if (el.is ("A") && el.parent ().is ("MPS-VOTE")) {
			let a = el
			el = el.parent ()
			el.vote = a.dataset.v
			el.a = a
			el.hn_wait = function () {
				this.className = "wait"
				this.a.setClass ("click", 1).on ("animationend", e => {
					this.a.setClass ("click", 0)
				}, { once: true })
			}
			el.hn_done = function () {
				this.className = ""
			}
			el.hn_err = function () {
				this.className = "err"
			}
			el.hn_ok = function ( m ) {
				if (m.v === true)
					this.attr ("vote", null)
				else
					this.attr ("vote", m.v [0])
				let l = this.$("a.like")
				let d = this.$("a.dislike")
				if (l && d) {
					let r = m.rating.like ()
					l.attr ("count", r.like)
					d.attr ("count", r.dislike)
				}
			}
		}
		if (!+el.dataset.v)
			return
		el.dataset.v = 0
		if (el.is ("MPS-STARS")) {
			el.hn_wait = function () {
			}
			el.hn_done = function () {
				this.el (1).s ({ width: 0 })
			}
			el.hn_err = function () {
			}
			el.hn_ok = function ( m ) {
				this.el (0).s ({ width: m.rating.width (+this.dataset.max, +this.dataset.i).val + "%" })
			}
		}
		let up = n => {
			let t = MPS.root.$(`mps-${n}#mps_${n}_${MPS.SID}_${m.id}`)
			if (t) {
				let p = m.rating [n](+t.dataset.max)
				t.innerHTML = p.val
				t.className = `sign-${p.sign}`
			}
		}
		let m = get_mess (+el.dataset.m)
		el.hn_wait ()
		xhr ("mps.vote", r => {
			el.dataset.v = 1
			el.hn_done ()
			if (r === false)
				return
			if (isString (r))
				return el.hn_err (), notice (r)
			if (r.rid != $RID)
				return
			m.r = [r.points, r.count]
			m.v = r.vote ? [r.vote, el.dataset.max] : true
			m.v1 = 1
			up ("points")
			up ("rating")
			$0(MPS.root.$(`mps-voters#mps_voters_${MPS.SID}_${m.id}`), m.r [1])
			el.hn_ok (m)
		}, {
			sess:	$cfg.SessID,
			rid:	++$RID,
			mid:	m.id,
			vote:	el.vote,
			max:	el.dataset.max
		})
	}
	function a_auth ( el ) {
		if (!MPS.User.Profile)
			load_module (el, "auth", m => $Auth = m)
	}
	function a_form ( el ) {
		if ($cfg.aw)
			load_module (el, "form", m => $Form = m)
	}
	function a_moder ( el ) {
		load_module (el, "moder", m => $Moder = m)
	}
	function a_access_r ( el ) {
		a_access (el, "ar")
	}
	function a_access_w ( el ) {
		a_access (el, "aw")
	}
	function a_access ( el, ac ) {
		let get_tpl = cb => {
			if ($tpl.access)
				return cb ($tpl.access [ac])
			load_tpl (["access-read", "access-write"], tpl => {
				$tpl.access = {
					ar: tpl.access_read,
					aw: tpl.access_write
				}
				cb ($tpl.access [ac])
			})
		}

		let m = get_mess (+el.dataset.m)
		let b = MPS.root.$(`#__mps_mess_${m.id}`)
		if (!b)
			return
		if (b.a) {
			expand (b.a, _ => {
				b.remove (b.a)
				b.a = null
			})
			b.setClass ("access")
			if (+el.dataset.ac != m [ac]) {
				xhr ("mps.moder", r => {
					if (r && r.rid == $RID) {
						m.set_class ()
						m [ac] = r [ac]
						m.set_class ()
					}
				}, {
					sess:	$cfg.SessID,
					mid:	m.id,
					rid:	++$RID,
					ac:	ac,
					v:	+el.dataset.ac,
					a:	"access"
				})
			}
			return
		}
		get_tpl (tpl => {
			b.a = b.appendHTML (tpl.pattern ([{
				GROUP_ID	() { return -$cfg.gl [this.$i].id },
				GROUP_NAME	() { return $cfg.gl [this.$i].n },
				GROUP_COUNT	() { return $cfg.gl [this.$i].c },
				$size		() { return $cfg.gl.length }
			}], {
				ACCESS:		( id, t ) => `<a data-a=access_${{ ar: "r", aw: "w"}[ac]} data-ac=${id} data-m=${el.dataset.m} ${id == m [ac] ? "class=cur" : ""}>${t}</a>`
			}))
			expand (b.a)
			b.setClass ("access")
		})
	}
	function a_logout () {
		August.storage ("global")("auth", "")
		$Storage ("sess", "")
		const [fp1, fp2] = August.fingerprint ()
		xhr ("mps.cfg", reload.bind (null, null), August.getid ({
			fp1:	fp1,
			fp2:	fp2,
			id:	MPS.User.ID,
			sid:	MPS.SID,
			sess:	$Storage ("sess")
		}))
	}
	function a_del_text () {
		search ({ view: "del-text" })
	}
	function a_reset () {
		$Search = null
		page ($LastPage)
	}
	function a_cal_day ( el ) {
		page ({ day: +el.dataset.d })
	}
	function a_cal_mon ( el ) {
		calendar_mon (+el.dataset.m)
	}
	function a_cal_year ( el ) {
		calendar ($Nav.mon, +el.dataset.y)
	}
	function design ( d, q ) {
		if (d == $Des)
			return
		set_class ("opacity", 1)
		setTimeout (_ => load_design (d, err => {
			set_class ("opacity", 0)
			if (!err)
				$Storage ("design", $Des = d)
		}, _ => {
			if (!q)
				notice ("ERROR1")
		}), MPS.root.td ("opacity"))
	}
	function go_history ( e ) {
		let s = $History.state
		let p = s.pos
		if ($History.$pos > p && s.back)
			s = s.back
		$History.$pos = p
		if (s.page)
			page (Object.freeze (s.page))
		else if (s.exec)
			$ACTION [s.exec](... s.args || [])
		else if (s.module)
			$MODULE [s.module].action (... s.args || [])
		else if ($cfg.handler.history)
			$cfg.handler.history (s)
	}
	function put_history ( h, b, t = "", l = null ) {
		Object.assign (h, { pos: ++$History.$pos })
		let s = $History.state
		if (!s)
			return $History.replaceState (h, t, l)
		if (b)
			$History.replaceState ({ ... s, ... { back: b }}, "")
		$History.pushState (h, t, l)
	}
	function load_module ( el, n, set ) {
		let a = el instanceof HTMLElement && el.dataset.a || n
		put_history ({ module: n, args: [a] }, { module: n, args: ["cancel"] })
		if ($MODULE [n])
			return $MODULE [n].action (a, el)
		load_js (n, `august_mps_${n}`, m => set ($MODULE [n] = m).action (a, el))
	}
	function load_js ( js, ctr, set ) {
		if (!load_js.set)
			load_js.set = new Set
		if (load_js.set.has (js))
			return
		load_js.set.add (js)
		august_run (_ => {
			let m = new $win [ctr]({
				MPS:		MPS,
				SB:		$SB,
				TF:		$TF,
				Event:		$Event,
				Storage:	$Storage,
				HelpText:	$HelpText,
				cfg:		$cfg,
				win:		$win,
				xhr:		xhr,
				notice:		notice,
				search:		search,
				reload:		reload,
				clear:		clear,
				load_tpl:	load_tpl,
				add_notice:	add_notice,
				esc_queue:	esc_queue,
				esc_queue_exe:	esc_queue_exe,
				set_class:	set_class,
				get_mess:	get_mess,
				show_text:	show_text,
				cleanup_text:	cleanup_text,
				get RID ()	{ return ++$RID }
			})
			m.init (_ => set (m))
		}, [`august.mps.${js}.js`])
	}
	function load_title () {
		$Nav.cont = 0
		$MPSText.page = 0
		$MPSText.innerHTML = $tpl.title.tpl ({
			TITLE:	_ => $cfg.title || "",
			ENTRY:	t => `<a data-a=contents>${t}</a>`,
			FORM:	t => `<a data-a=form>${t}</a>`
		})
		if (!MPS.WIDGET)
			$win.document.title = $cfg.title
	}
	function load_mess ( mid ) {
		page ({ mid })
	}
	function load_day ( day ) {
		let d = day.match (/^(\d\d)-(\d\d)-(\d\d\d\d)$/)
		if (d)
			page ({ day: d [3].shl16 | d [2].shl8 | d [1] })
	}
	function show_text ( t ) {
		hide_pics ()
		if (!t && !$Nav.text && $tpl.title)
			return load_title ()
		$Nav.cur_text = t ? text_tpl ().$init (t, 0) : $Nav.text
		let HTML = (!t && $Nav.cont ? $tpl.contents : $tpl.text).pattern ([$Nav.cur_text]).trim ()
		$MPSText.innerHTML = $tpl.nav ? HTML : nav_tpl ().$html ($Nav, HTML).trim ()
		$Nav.cur_text.$post ()
	}
	function cleanup_text () {
		for (let img of $MPSText.all ("img[src^=blob]"))
			$win.URL.revokeObjectURL (img.src)
	}
	function get_mess ( i ) {
		return !i
			? $Form.preview_mess ()
			: i < 0
			? $Text [i >> 10 & 0x1fffff].c [i & 0x03ff]
			: $Text [i & 0x1fffff]
	}
	function get_block ( el, cb ) {
		let p = el.parent (el.dataset.b.toUpperCase ())
		if (p) {
			let b = p.$(el.dataset.b)
			b && cb (b, p)
		}
	}
	function expand ( el, cb ) {
		el.setHeight ()
		return setTimeout (_ => { el.setHeight (null); cb && cb () }, el.td ("height"))
	}
	function ut ( s ) {
		let r = 0
		let tt = {
			EMAIL:		0x0001,
			WWW:		0x0002,
			ICQ:		0x0004,
			TITLE:		0x0008,
			TITLE_TEXT:	0x0008,
			FIELD1:		0x0010,
			FIELD2:		0x0020,
			FIELD3:		0x0040,
			EDIT_NAME:	0x0080,
			EDIT_DATE:	0x0080,
			EDIT_COUNT:	0x0080,
			VIEWS:		0x0100,
			POINTS:		0x0200,
			RATING:		0x0200,
			VOTERS:		0x0200,
			VOTE:		0x0400,
			SVOTE:		0x0400,
			VOTE_MENU:	0x0400,
			SVOTE_MENU:	0x0400,
			VOTE_STARS:	0x0400,
			SVOTE_POINTS:	0x0600,
			RATE:		0x0600,
			REG_DATE:	0x4000,
			AVATAR:		0x8000
		}
		for (let t in tt) {
			if (new RegExp (`%${t}(?:\\((.|\n|\r)*?\\))?%`, "m").test (s))
				r |= tt [t]
		}
		return r
	}
	function esc_queue ( f ) {
		$EscQueue.push (f)
	}
	function esc_queue_exe ( a ) {
		let f = $EscQueue.pop ()
		if (isFunction (f))
			return f (a)
		if (f) {
			if (f.a)
				f.a (a)
			if (f.h)
				put_history (f.h)
		}
	}
	function hide_pics () {
		$hs && $hs.hideAll ()
	}
	function set_class ( cls, en ) {
		return MPS.root.setClass (cls, en)
	}
	function loader ( en ) {
		set_class ("loader", !!en)
	}
	function notice ( txt, cn = "err", param ) {
		let n = MPS.root.$("mps-notice")
		if (!$NoticeText || !txt || !n)
			return
		clearTimeout (n.to)
		n.className = cn
		n.innerHTML = `<div>${$NoticeText.param (txt, param)}</div>`
		n.setHeight ()
		n.to = setTimeout (_ => n.setHeight (0), 5000)
	}
	function add_notice ( n ) {
		$NoticeText += n.htmlEntityDecode ()
	}
	function form_mode () {
		return $Form && $Form.mode ()
	}
	function moder_mode () {
		return $Moder && $Moder.mode ()
	}
	function auth_mode () {
		return $Auth && $Auth.mode ()
	}
	function no_form () {
		return !(form_mode () || moder_mode () || auth_mode ())
	}
	function clear ( m ) {
		return m.replace ($MAT_RE, "$1").replace ($CNS_RE, "$1")
	}
	function html_img ( src, w, h, c ) {
		let v = w > $cfg.img_w || h > $cfg.img_h
		if (v) {
			let k = Math.max (w / $cfg.img_w, h / $cfg.img_h)
			w = w / k + .5 | 0
			h = h / k + .5 | 0
		}
		return `<img${August.html.attr ({
			"data-view":	v ? src : "",
			src:		src,
			width:		w,
			height:		h,
			class:		c ? `mps-img ${c}` : `mps-img`
		})} referrerpolicy=no-referrer loading=lazy>`
	}
	function html_iframe ( src, w, h, c, f ) {
		return `<iframe${August.html.attr ({
			src:		src,
			width:		w,
			height:		h,
			class:		c,
			allowfullscreen:f ? true : null
		})} frameborder=0 loading=lazy></iframe>`
	}
	function html ( m, f, p ) {
		f = (isSet (f) ? f : $cfg.tf) | $CF.ALWAYS_BB
		return smiles (code (m, f, p)).html (60, 0xc).replaceAll (
			[$MAT_RE, $CNS_RE, $CR_RE, $EL_RE],
			[
				MPS.User.Moder || MPS.User.Owner
					? "<span class=mat>$1</span>"
					: $cfg.mt,
				MPS.User.Moder || MPS.User.Owner
					? "<span class=censor>$1</span>"
					: $cfg.cn,
				"$1$2",
				"$1"
			]
		).nl2br ()
	}
	function user ( u ) {
		return u.p
			? `<a class=name data-a=userinfo data-p=${u.p} data-nid=${u.nid} data-n='${u.n}'>${smiles (u.n)}</a>`
			: `<span class=name>${smiles (u.n)}</span>`
	}
	function smiles ( s ) {
		return s
			? s.replace (
				August.html.SMILE_RE,
				`<img src=//${MPS.HOST}/smiles/$1.$2 width=$3 height=$5 border=0 title='$6' referrerpolicy=no-referrer>`
			)
			: ""
	}
	function code ( Str, tf, pa ) {
		let bb = ( bb, e ) => {
			let c = code (bb.e + 2, e)
			if (!c || (bb.c.code && c != bb.c))
				return t.push (bb), e
			if (c != bb.c || !(tf & bb.c.f) || (!bb.c.p && bb.p))
				return e
			if (pa && !(bb.c.f & $CF.PARA)) {
				for (let c of cc) {
					if (c.b > bb.b && c.e < e)
						return e
				}
			}
			let p = bb.p ? Str.substring (bb.p1, bb.p).trim () : ""
			if (!bb.c.p || (!p && bb.c.f & $CF.NO_PARAMS) || (p = p.match (bb.c.p))) {
				let s = Str.substring (bb.t + 1, bb.e)
				if (bb.c.f & $CF.TRIM)
					s = s.trim ()
				if (pa && bb.c.f & $CF.PARA)
					s = para (s, bb.t + 2, _ => bb.b < cc.last ().b)
				s = isString (bb.c.h)
					? bb.c.h.format (s)
					: bb.c.h (bb.c.f & $CF.GET_ARRAY ? p : p [0], s)
				if (s) {
					let b = bb.c.f & $CF.BLOCK && !s.isTrue ()
					if (bb.c.f & $CF.TRIM && b) {
						while (Str [e + 1] == ' ')
							e++
						if (Str [e + 1] == '\n')
							e++
					}
					Str = Str.subreplace (s, bb.b, e + 1)
					e = bb.b + s.length - 1
					if (pa && b) {
						while (cc.length && bb.b < cc.last ().b)
							cc.pop ()
						cc.push ({ b: bb.b, e: e + 1 })
					}
				}
			}
			return e
		}
		let para = ( s, d = 0, f = _ => true ) => {
			let p = s => s.replace (/\n$/, "").replace (/^(.*?)$\n?/gm, ( $0, $1 ) => $1 ? `<p>${$1}</p>` : `<br>`)
			let e = s.length
			while (cc.length && f ()) {
				let c = cc.pop ()
				if (c.e - d != e)
					s = s.subreplace (p, c.e - d, e)
				e = c.b - d
			}
			return e ? s.subreplace (p, 0, e) : s
		}

		const STATE = new Enum ('E', 'I', 'M', 'N', 'O', 'P', 'P2', 'Q', 'Q2')
		let st = STATE.I
		let w_re = /[\w]/
		let t = [], cc = []
		let code = ( b, e ) => $BB_CODE [Str.substring (b, e).toLowerCase ()]
		if (tf & $TF.CHAR_CODE) for (let k in $CHAR_CODE)
			Str = Str.replaceAll (k, `\x01${k}\x02`)
		for (let b, c, q, p, p1, i = 0; i < Str.length; i++) {
			let ch = Str [i]
			switch (st) {
				case STATE.I:
					if (ch == '[')			st = STATE.O, b = i
					break
				case STATE.O:
					if (ch == '/')			st = STATE.E
					else if (w_re.test (ch)
						&& !(c && c.code))	st = STATE.N
					else				st = STATE.I
					break
				case STATE.N:
					if (w_re.test (ch))		break
					else				c = code (b + 1, i)
					if (ch == ']' && c)		st = STATE.I, t.push ({ b: b, c: c, t: i })
					else if (ch == '=' && c)	st = STATE.P
					else 				st = STATE.I
					break
				case STATE.P:
					if (/['"`]/.test (ch))		st = STATE.Q, q = ch, p1 = i + 1
					else if (ch == ']')		st = STATE.I
					else if (ch != ' ')		st = STATE.P2, p1 = i
					break
				case STATE.P2:
					if (ch == ']')			st = STATE.I, t.push ({ b: b, c: c, p1: p1, p: i, t: i })
					else if (ch == '\n')		st = STATE.I
					break
				case STATE.Q:
					if (ch == q)			st = STATE.Q2, p = i
					else if (ch == '\n')		st = STATE.I
					break
				case STATE.Q2:
					if (ch == ']')			st = STATE.I, t.push ({ b: b, c: c, p1: p1, p: p, t: i })
					else if (ch != ' ')		st = STATE.I
					break
				case STATE.E:
					if (w_re.test (ch)
						&& t.length)		st = STATE.M, t.last ().e = i - 2
					else				st = STATE.I
					break
				case STATE.M:
					if (ch == ']')			st = STATE.I, i = bb (t.pop (), i), c = t.last (), c = c ? c.c : void 0
					else if (!w_re.test (ch))	st = STATE.I
					break
			}
		}
		if (pa)
			Str = para (Str)
		return tf & $TF.CHAR_CODE ? Str.replace ($CHR_RE, ( $0, $1 ) => $CHAR_CODE [$1]) : Str
	}
	function bb_font ( p, t ) {
		return `<span style='font-family: ${p}'>${t}</span>`
	}
	function bb_size ( p, t ) {
		return `<span class=font-size-${p}>${t}</span>`
	}
	function bb_color ( p, t ) {
		return t.color (p)
	}
	function bb_highlight ( p, t ) {
		let cc = p.split ("-")
		if (cc.length == 1)
			return `<span style='background: ${p}'>${t}</span>`
		let s = 100 / (cc.length - 1)
		let g = []
		let a = 0
		for (let c of cc) {
			g.push (`${c} ${a.toFixed (1)}%`)
			a += s
		}
		return `<span style='background: linear-gradient(to right, ${g.join (",")})'>${t}</span>`
	}
	function bb_notice ( p, t ) {
		return `<div class='notice ${p}'>${t}</div>`
	}
	function bb_columns ( p, t ) {
		return `<div class=columns style='grid-template-columns: ${" 1fr".repeat (p [1] || 2)}${+p [2] ? `; grid-gap: ${p [2]}em` : ``}'>${t}</div>`
	}
	function bb_list ( p, t ) {
		let l = t.replace (/\s?\[\*\]/g, "<li>")
		let m = { c: "circle", s: "square" }[p]
		let c = m ? "ul" : "ol"
		return p ? `<${c} type=${m || p}>${l}</${c}>` : `<ul>${l}</ul>`
	}
	function bb_hr ( p, t ) {
		return t && (!/^\d+$/.test (t) || t > 50) ? null : `<hr noshade ${p ? `color=${p}` : ""} size=${t || 1}>`
	}
	function bb_attach ( p, t ) {
		let [n, r] = t.split (":")
		let m = $Nav.cur_text.$m
		let a = r ? m.aq && m.aq [r] || null : m.a
		let c = p ? p.toLowerCase () : ""
		if (a && a [n]) {
			return html_img (
				`//${MPS.HOST}/attach/mps/${MPS.SID.hex (4)}${(+r || m.id).hex (4)}${a [n][0]}.${a [n][1].ext ()}`,
				a [n][1] >> 18 & 0x3fff,
				a [n][1] >> 4 & 0x3fff,
				c
			).true (c)
		}
		let at = $Form && $Form.attachments (n)
		if (!at)
			return null
		let img = new Image
		img.src = $win.URL.createObjectURL (at)
		img.onload = function () {
			let t = MPS.root.$(`#__img_${n}`)
			if (t) {
				t.innerHTML = html_img (this.src, this.width, this.height, c)
				t.replaceWith (t.content)
			}
		}
		return `<template id=__img_${n}></template>`.true (c)
	}
	function bb_img ( p, src ) {
		src = bb_nobb ("", src)
		let url = August.html.URL_RE.reset ().exec (src)
		if (!url || url [0] != src)
			return null
		let c = p ? p.toLowerCase () : ""
		let md5 = src.md5 ()
		let img = $IMGs [md5]
		if (!img)
			$Text.imgs [md5] = src
		return `<img x${md5} class='mps-img ${c}' ${img ? `width=${img.w} height=${img.h} data-view='${img.v ? `img/0/0/${encodeURI (src)}` : ``}'` : ``} src='img/${$cfg.img_w}/${$cfg.img_h}/${encodeURI (src)}' referrerpolicy=no-referrer loading=lazy>`.true (c)
	}
	function bb_youtube ( p, src ) {
		let w = p [1] && +p [1] || $cfg.video_w
		let h = p [2] && +p [2] || $cfg.video_h
		let vid = /^https:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)(.+)$/i.test (src)
			? RegExp.$1 : /^[-\w]{11}$/.test (src) ? src : null
		return vid
			? html_iframe (`https://www.youtube.com/embed/${vid}`, w, h, `mps-video ${p [3] || ""} youtube`, 1)
			: null
	}
	function bb_video ( p, src ) {
		let yt = bb_youtube (p, src)
		if (yt)
			return yt
		let w = p [1] && +p [1] || $cfg.video_w
		let h = p [2] && +p [2] || $cfg.video_h
		let vid = /^https?:\/\/(?:www\.)?(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)$/i.exec (src)
		if (vid)
			return html_iframe (`https://player.vimeo.com/video/${vid [1]}`, w, h, `mps-video ${p [3] || ""}`, 1)
		src = bb_nobb ("", src)
		let url = August.html.URL_RE.reset ().exec (src)
		return (url && url [0] == src)
			? `<video class='mps-video ${p [3] || ""}' style='width:${w}px;height:${h ? `${h}px` : `auto`}' src='${src}' referrerpolicy=no-referrer controls></video>`
			: null
	}
	function bb_flash ( p, src ) {
		src = bb_nobb ("", src)
		let url = August.html.URL_RE.reset ().exec (src)
		return (url && url [0] == src)
			? `<embed class='mps-flash ${p [3] || ""}' width='${p [1]}' height='${p [2]}' src='${src}' quality=high wmode=opaque>`
			: null
	}
	function bb_music ( p, src ) {
		let ym = /^https:\/\/music\.yandex\.ru\/album\/(\d+)\/track\/(\d+)$/i.exec (src)
		return ym
			? html_iframe (`https://music.yandex.ru/iframe/#track/${ym [2]}/${ym [1]}`, null, null, "mps-music yandex")
			: null
	}
	function bb_map ( p, src ) {
		if (/^https:\/\/yandex\.ru\/maps\/-\/(.+)$/i.test (src))
			src = "https://yandex.ru/map-widget/v1/-/" + RegExp.$1
		else if (/^https:\/\/yandex\.ru\/maps\/\?um=constructor%3A([\da-f]{64})&source=constructorLink$/i.test (src))
			src = "https://yandex.ru/map-widget/v1/?um=constructor%3A" + RegExp.$1
		else if (/^https:\/\/drive\.google\.com\/open\?id=(.+)&usp=sharing$/i.test (src))
			src = "https://www.google.com/maps/d/embed?mid=" + RegExp.$1
		else if (/^https:\/\/(?:www\.)?google\.com\/maps\/d\/(?:embed|viewer|edit)\?mid=[-\w]{33}(?:&.+)?$/i.test (src))
			src = src.replace (/viewer|edit/, "embed")
		else if (/^[\da-f]{64}$/i.test (src))
			src = "https://yandex.ru/map-widget/v1/?um=constructor%3A" + src
		else if (/^[-\w]{33}$/.test (src))
			src = "https://www.google.com/maps/d/embed?mid=" + src
		else
			return null
		return html_iframe (src, p [1] && +p [1] || "100%", p [2] && +p [2] || null, `map ${p [3] || ""} ${/^https:\/\/(?:www\.)?(google|yandex)\./.exec (src)[1]}`)
	}
	function bb_rolling ( p, t ) {
		let set = p [1].split ("|")
		if (!set.length)
			return null
		let cc = []
		for (let s of set) {
			if (/^[-a-z]+$/.test (s)) {
				let r = $ROLLING_SET [s]
				if (!r)
					return null
				cc.push (r)
			} else if (/^#[0-9a-f]{6}(?:\/\d+)?(?:-#[0-9a-f]{6}(?:\/\d+)?)+$/i.test (s)) {
				cc.push (s.replace (
					/#([0-9a-f]{6})(?:\/(\d+))?-?/gi,
					( $0, $1, $2 ) => +$2 ? $1.repeat (+$2) : $1
				))
			} else {
				return null
			}
		}
		return "<mps-rolling data-cc='?' data-d=?>?</mps-rolling>".format (
			cc.join ("|"),
			p [2],
			smiles (t).replace (
				/(<.+?>)|(&(?:[a-zA-Z]{2,}\d*|#\d+|#x[\da-fA-F]{2,});|.)/g,
				( $0, $1, $2 ) => $1 || `<span>${$2}</span>`
			)
		)
	}
	function bb_nobb ( p, t ) {
		return t.replace (August.html.SMILE_RE, "$6").replace ($CHR_RE, "$1")
	}
	function bb_code ( p, t ) {
		let ls = bb_nobb ("", t).replaceAll ("\r", "").split ("\n")
		if (ls [0] == "")
			ls.shift ()
		if (ls.last () == "")
			ls.pop ()
		return $tpl.code.replaceAll ("\n", "").pattern ([{
			LINE		() { return ls [this.$i].htmlEntities ("<>") + "\n" },
			$size		() { return ls.length },
		}], {
			HEADER:		p ? p.htmlEntities ("<>") : "",
			COPY:		( t ) => `<a data-b=mps-code data-a=copy>${t}</a>`,
			PUSH:		( a, t ) => `<a data-b=mps-code data-a=${a} title='${t.htmlEntities ()}'></a>`,
			TOGGLE:		( a, t ) => `<a data-b=mps-code data-a=toggle data-class=${a} title='${t.htmlEntities ()}'></a>`
		})
	}
	function bb_quote ( p, t ) {
		return $tpl.quote.replaceAll ("\n", "").tpl ({
			COLLAPSE:	"<mps-clps-btn data-a=collapse data-b=mps-quote></mps-clps-btn>",
			NAME:		p [1] || "",
			DATE:		p [2] || "",
			QUOTE:		t
		})
	}
	function bb_spoiler ( p, t ) {
		return $tpl.spoiler.replaceAll ("\n", "").tpl ({
			COLLAPSE:	"<mps-clps-btn data-a=collapse data-b=mps-spoiler></mps-clps-btn>",
			HEADER:		p ? p.htmlEntities ("<>") : "",
			SPOILER:	t
		})
	}
	function bb_url ( p, t ) {
		let url = bb_nobb ("", p || t)
		let r = August.html.URL_RE.reset ().exec (url)
		return (r && r [0] == url && t)
			? `<a class=link href='${url}' target=_blank>${p ? t : url}</a>`
			: null
	}
	function bb_email ( p, t ) {
		let email = p || t
		let r = August.html.EMAIL_RE.reset ().exec (email)
		return (r && r [0] == email && t)
			? `<a class=link href='mailto:${email}'>${t}</a>`
			: null
	}
	function get_images ( rid ) {
		let src = []
		for (let n in $Text.imgs)
			src.push ($Text.imgs [n].encode ())
		if (!src.length)
			return
		new august_http (0, "json").send ("php/img.php", r => {
			if (r === false || r.rid != $RID)
				return
			r.im.reverse ()
			for (let md5 in $Text.imgs) {
				let img = r.im.pop ()
				if (!img)
					continue
				MPS.root.$("mps-text").all (`img[x${md5}]`).forEach (im => {
					im.width = img.w
					im.height = img.h
					if (img.v)
						im.dataset.view = `img/0/0/${encodeURI ($Text.imgs [md5])}`
				})
				$IMGs [md5] = img
			}
		}, {
			imgs:	src.join (":"),
			w:	$cfg.img_w,
			h:	$cfg.img_h,
			rid:	rid
		})
	}
	function color_rol ( r ) {
		if (r.jsid)
			return
		let cc = []
		for (let c of r.dataset.cc.split ("|"))
			cc.push (c.match (/.{6}/g).map (c => "#" + c))
		r.jsid = $JSID
		r.cc = cc
		r.idx = 0
		r.sh = 0
		r.d = ~~r.dataset.d || 150
		delete r.dataset.d
		delete r.dataset.cc
		let tic = 0, fr = 0
		let rol = _ => {
			if (r.jsid != $JSID)
				return
			if (fr ^= 1) {
				if (r.cc.length > 1 && !(++tic % r.d)) {
					let idx = Math.random () * r.cc.length | 0
					if (r.idx != idx) {
						r.idx = idx
						r.sh = 0
					}
				} else if (++r.sh == r.cc [r.idx].length) {
					r.sh = 0
				}
				let c = r.cc [r.idx]
				r.all ("span").forEach (( s, i ) => {
					s.s ({ color: c [(r.sh + i) % c.length] })
				})
			}
			$win.requestAnimationFrame (rol)
		}
		rol ()
	}
	function search ( s ) {
		$Search = s || null
		page (0)
	}
	function reload ( p, cfg ) {
		if (cfg) {
			Object.assign ($cfg, cfg)
			$cfg.User.Priv = new august_bitset (`0x${$cfg.User.Priv}`)
			MPS.User = $cfg.User
		}
		if (p && p.reset)
			return page (0)
		if (p && p.new && $Nav.mpp == 1)
			return page ({ page: $Nav.pages })
		if (p && p.cont && $cfg.cont && $Nav.mpp == 1)
			return a_contents ()
		page ($Nav.day ? { day: $Nav.day } : $Nav.page)
	}
	function page ( p ) {
		if ($Nav.lock || $Nav.no_page)
			return

		$Nav.lock = 1
		let Params = isObject (p) && Object.isFrozen (p) ? p : (_ => {
			let one = !$Nav.cont && $Nav.mpp == 1
			let prm = Object.assign ({
				mpp:	one ? 1 : $MPSText.dataset.mpp,
				cont:	!one && ~~$cfg.cont || null
			}, isNumber (p) ? { page: p } : p, $Search)
			put_history ({ page: prm })
			return prm
		})()
		set_class ("wait-text", 1)
		hide_pics ()
		let time = ( n, t ) => $0(MPS.root.$(n), (t / 1000).locale (2, 2))
		let t0 = August.now ()
		xhr ("mps.text", r => {
			if (isString (r)) {
				notice (r)
				$Nav.lock = 0
				return
			}
			let t1 = August.now ()
			$Text = r.text
			$Text.imgs = {}
			$Nav = r.nav
			$Nav.text = text_tpl ().$init ($Text, 0, 1)
			$Nav.cur_text = $Nav.text
			let MPSNav = MPS.root.$("mps-nav")
			let HTML = ($Nav.cont ? $tpl.contents : $tpl.text).pattern ([$Nav.text]).trim ()
			let HTML_NAV = nav_tpl ().$html ($Nav, $tpl.nav ? MPSNav ? $tpl.nav : "" : HTML).trim ()
			let t2 = August.now ()
			$MPSText.innerHTML = $tpl.nav ? HTML : HTML_NAV
			$Nav.text.$post ()
			if ($tpl.nav && MPSNav)
				MPSNav.innerHTML = HTML_NAV
			if ($Nav.day)
				calendar ()
			let t3 = August.now ()
			time ("#mps_time1", t1 - t0)
			time ("#mps_time2", t2 - t1)
			time ("#mps_time3", t3 - t2)
			time ("#mps_time",  t3 - t0)
			set_class ("wait-text", 0)
			set_class ("search-mode", !!$Nav.ms)
			set_class ("del-mode", !!$Nav.dc)
			get_images (++$RID)
			$SB.scrollToSmooth (MPS.root)
			if (!$Nav.ms && !$Nav.dc)
				$LastPage = p
		}, Object.assign ({
			sess:	$cfg.SessID,
			ut:	$cfg.ut,
			lc:	~~$cfg.lc
		}, Params))
	}
	function calendar_mon ( m ) {
		let y = $Nav.year
		if (m == 0) {
			if (y == $cfg.start_year)
				return
			y--
			m = 12
		} else if (m == 13) {
			if (y == $cfg.end_year)
				return
			y++
			m = 1
		}
		calendar (m, y)
	}
	function calendar ( m, y ) {
		let Cal = MPS.root.$("mps-calendar")
		if (!$tpl.calendar || !Cal)
			return
		if (!isSet (m))
			m = $Nav.day.b1
		if (!isSet (y))
			y = $Nav.day.w1
		$Nav.mon = m
		$Nav.year = y
		let py = y - 1
		let ny = y + 1
		let c = August.calendar (y, m - 1)
		Cal.innerHTML = $tpl.calendar.pattern ([{
			DOW		( ... a ) { return a [this.$i] },
			$size		() { return 7 }
		}, {
			NUM_DAY		() { return this.$p ? m.shl8 | this.$d : "" },
			DAY		() { return this.$p ? `<a data-a=cal_day data-d=${y.shl16 | m.shl8 | this.$d}>${this.$d}</a>` : this.$d || "" },
			CUR		() { return "".true (this.$cur) },
			$set		() { this.$d = c [this.$.$i][this.$i]; this.$yd = m.shl8 | this.$d; this.$cur = (y.shl16 | this.$yd) == $Nav.day; this.$p = $Calendar && this.$yd in $Calendar [y] },
			$size		() { return 6 }
		}], {
			YEAR:		y,
			MONTH:		l => new Date (y, m - 1).lang (l).month (),
			PREV_MON:	l => new Date (y, m > 1 ? m - 2 : 11).lang (l).month (),
			NEXT_MON:	l => new Date (y, m < 12 ?  m : 0).lang (l).month (),
			PREV:		t => `<a data-a=cal_mon data-m=${m - 1}>${t}</a>`,
			NEXT:		t => `<a data-a=cal_mon data-m=${m + 1}>${t}</a>`,
			PREV_YEAR:	`<a data-a=cal_year data-y=${py < $cfg.start_year ? "0 disabled" : py}>${py}</a>`,
			NEXT_YEAR:	`<a data-a=cal_year data-y=${ny > $cfg.end_year   ? "0 disabled" : ny}>${ny}</a>`,
		})
		for (let d of Cal.all ("[day]")) {
			let p = $Calendar [y][d.attr ("day")]
			if (p && p.l)
				d.innerHTML = ($cfg.md ? p.l : p.l.reverse ()).map (t => `<div>${html (t, -1) || d.attr ("empty")}</div>`).join ("")
		}
		if (!Cal.init) {
			Cal.init = 1
			Cal.on ("wheel", e => {
				calendar_mon ($Nav.mon - e.deltaY.sign ())
				e.stop ()
			}).on ("contextmenu", e => e.stop ())
			Cal.swipe (_ => calendar_mon ($Nav.mon + 1), _ => calendar_mon ($Nav.mon - 1))
		}
	}
	function help () {
		if (MPS.APL)
			$HelpText.show (`${MPS.APL}-help`, `${MPS.APL}-help`, "help")
	}
	function help_text () {
		function close ( e ) {
			if (!$Text)
				return
			set_class ("help", 0)
			setTimeout (_ => {
				if (!$Text)
					return
				MPS.root.remove ($Text)
				$Text = null
			}, $Text.td ("opacity"))
			$cb && $cb ()
			if (e && e.type)
				return e.stop ()
		}
		function show ( text, css, cls, cb ) {
			if ($Text)
				return
			$Text = $win.document.createElement ("mps-help")
			$Text.className = cls || ""
			load_css (css, _ => new august_http ().http (loader).send (`txt/${text}.${MPS.LANG}.txt`, r => {
				MPS.root.append ($Text)
				set_class ("help", 1)
				$Text.append ("mps-help-ctrl", { innerHTML: "<b data-a=close_help></b>" })
				let text = $Text.append ("mps-help-text", { innerHTML: r })
				text.tabIndex = -1
				text.focus ()
				text.noselect ()
				$Text.on ("contextmenu", esc_queue_exe)
					.on ("mousedown", function ( e ) {
						if (e.which == 1 && e.$ == this)
							esc_queue_exe ()
					})
				esc_queue (close)
				$cb = cb
			}))
		}

		let $Text = null
		let $cb = null
		$ACTION.close_help = esc_queue_exe

		return { show }
	}
	function init ( cb, h ) {
		let init = August.defer (2, _ => {
			if (!$tpl)
				return
			let cfg_loc = null
			MPS.root.innerHTML = $tpl.main.tpl ({
				SID:		MPS.SID,
				APL:		MPS.APL,
				WIDGET:		"".true (MPS.WIDGET),
				MOBILE:		"".true (MPS.MOBILE),
				OWNER:		$cfg && $cfg.Owner && $cfg.Owner.n || null,
				OWNER_PROFILE:	$cfg && $cfg.Owner && $cfg.Owner.p || null,
				TITLE:		$cfg && $cfg.title || "",
				NAV:		"<mps-nav></mps-nav>",
				CALENDAR:	"<mps-calendar></mps-calendar>",
				NOTICE:		"<mps-notice></mps-notice>",
				FORM:		"<mps-form-container></mps-form-container>",
				PEN:		"<mps-pen-icon data-a=form></mps-pen-icon>",
				DESIGN:		( t , d ) => `<a data-a=design data-d=${d}>${t}</a>`,
				TEXT:		n => `<mps-text data-mpp=${~~n}></mps-text>`,
				LOADER:		t => `<mps-loader text="${t ? t.htmlEntities () : ""}"></mps-loader>`,
				MPS_TIME1:	t => `<span id=mps_time1>${t}</span>`,
				MPS_TIME2:	t => `<span id=mps_time2>${t}</span>`,
				MPS_TIME3:	t => `<span id=mps_time3>${t}</span>`,
				MPS_TIME:	t => `<span id=mps_time>${t}</span>`,
				WINDOW_TITLE:	t => ( $cfg && ($cfg.title = t), "" ),
				CFG:		cfg => { cfg_loc = cfg }
			})
			$tpl.main = null
			$MPSText = MPS.root.$("mps-text")
			if (!$MPSText)
				return
			$NoticeText = $tpl.notice.htmlEntityDecode ()
			$Des = MPS.DESIGN || $Storage ("design") || (cfg_loc && cfg_loc.DEFAULT_DESIGN) || "mps"
			load_design ($Des, _ => {
				MPS.root.s ({ visibility: "" })
				if ($cfg === null)
					return notice ("404")
				if (!("title" in $cfg))
					return notice ("ERROR")
				if ($cfg.deny)
					return notice ("DENY")
				const cfg_v = {
					MAX_IMAGE_WIDTH:	{ n: "img_w", v: 200 },
					MAX_IMAGE_HEIGHT:	{ n: "img_h", v: 200 },
					VIDEO_WIDTH:		{ n: "video_w", v: 640 },
					VIDEO_HEIGHT:		{ n: "video_h", v: 360 },
					MAX_EMPTY_LINES:	{ n: "el", v: 0 },
					MAX_CHAR_REPEAT:	{ n: "cr", v: 0 },
					CENSOR:			{ n: "cn", v: "***" },
					MATOTESTER:		{ n: "mt", v: "***" },
					LOAD_COMMENTS:		{ n: "lc", v: 0 },
					USER_INFO:		{ n: "ui", v: "user/%PROFILE%" },
					KEY_HANDLER:		{ n: "key_handler" }
				}
				for (let n in cfg_v) {
					$cfg [cfg_v [n].n] = cfg_loc && (n in cfg_loc) ? cfg_loc [n] : cfg_v [n].v
				}
				$cfg.handler = Object.assign ({}, h)
				$Storage ("sess", $cfg.SessID)
				new Date ().setTimeZone ($cfg.tz)
				$CR_RE = $cfg.cr ? new RegExp (`(?!<[^>]*)(\\S)((?: *\\1){${$cfg.cr - 1}})(?: *\\1)+(?![^<]*>)`, "g") : null
				$EL_RE = $cfg.el ? new RegExp (`( *(?:\n){${$cfg.el}})(?: *\n)+`, "g") : null
				$cfg.cont = !!$tpl.contents
				$cfg.ut = ut ($tpl.text) | ut ($tpl.comment).shl16
				$hs = $win.august_highslide ? new august_highslide ("mps-hs-wait", "mps-hs-img") : null
				$History.$pos = 0
				MPS.User = $cfg.User
				MPS.User.Priv = new august_bitset (`0x${$cfg.User.Priv}`)
				MPS.root.on ("keydown", key_handler).on ("click mousemove mouseout", mouse_handler)
				set_class ("mobile", MPS.MOBILE)
				addEventListener ("popstate", go_history)
				addEventListener ("scroll", e => $Event.fire ("scroll", e))
				addEventListener ("resize", e => $Event.fire ("resize", e))
				MPS.root.swipe (_ => {
					if (no_form () && $Nav.next)
						page ($Nav.next)
				}, _ => {
					if (no_form () && $Nav.prev)
						page ($Nav.prev)
				})
				if (!MPS.WIDGET)
					$win.document.title = $cfg.title
				if (MPS.MESSID)
					load_mess (MPS.MESSID)
				else if (MPS.DAY)
					load_day (MPS.DAY)
				else if ($tpl.title)
					put_history ({ exec: "load_title" }), load_title ()
				else
					page (0)
				cb && cb ()
			}, _ => {
				//  error
				$Storage ("design", "")
				design (cfg_loc.DEFAULT_DESIGN, 1)
			})
		})

		MPS.root.s ({ visibility: "hidden" })
		load_tpl ([
			"main", "title", "contents", "text", "comment", "code",
			"quote", "spoiler", "nav", "calendar", "notice"
		], tpl => {
			$tpl = tpl
			init ()
		})
		const [fp1, fp2] = August.fingerprint ()
		const Auth = JSON.parse (August.storage ("global")("auth") || null)
		xhr ("mps.cfg", cfg => {
			$cfg = cfg
			init ()
		}, August.getid ({
			fp1:	fp1,
			fp2:	fp2,
			id:	MPS.User.ID,
			sid:	MPS.SID,
			key:	Auth ? Auth.key : null,
			profile:Auth ? Auth.p : null,
			sess:	$Storage ("sess")
		}))
	}

	const nav_tpl = _ => ({
		SID () {
			return MPS.SID
		},
		NICK () {
			return MPS.User.Nick
		},
		MPS_TITLE () {
			return $cfg.title
		},
		WINDOW_TITLE ( t ) {
			$win.document.title = t.tpl ({
				MPS_TITLE:	$cfg.title,
				TITLE:		this.$n.text.$text.length && this.$n.text.$text [0].t || $cfg.title,
				PAGE:		this.$n.page_num
			})
			return ""
		},
		LINK ( url, t, c = "" ) {
			return `<a data-a=link data-url=${url} target=_mps_${MPS.SID} class=${c}>${t}</a>`
		},
		TOTAL () {
			return this.$n.total
		},
		PAGES () {
			return this.$n.pages
		},
		FIRST_NUM () {
			return this.$n.first_num
		},
		LAST_NUM () {
			return this.$n.last_num
		},
		PAGE () {
			return this.$n.page_num
		},
		DEL_COUNT () {
			return this.$n.del
		},
		CONTENTS ( t ) {
			return this.$a ("contents", t)
		},
		FORM ( t ) {
			return this.$n.dc || !$cfg.aw ? "" : this.$a ("form", t)
		},
		AUTH ( t ) {
			return this.$a ("auth", t)
		},
		FIRST ( t, v ) {
			return this.$p (this.$n.first, "first", t, v)
		},
		LAST ( t, v ) {
			return this.$p (this.$n.last, "last", t, v)
		},
		PREV ( t, v ) {
			return this.$p (this.$n.prev, "prev", t, v)
		},
		NEXT ( t, v ) {
			return this.$p (this.$n.next, "next", t, v)
		},
		NEXTBLOCK ( t ) {
			return this.$p (this.$n.last ? { page: this.$n.page1 + this.$n.max_pages } : null, "nextblock", t)
		},
		PREVBLOCK ( t ) {
			return this.$p (this.$n.first ? { page: this.$n.page1 - 1 } : "", "prevblock", t)
		},
		DEL_TEXT ( t ) {
			return this.$n.del
				? this.$a ("del_text", t.tpl ({ COUNT: this.$n.del }))
				: ""
		},
		BACK ( t ) {
			return this.$n.ms || this.$n.dc ? this.$a ("reset", t) : ""
		},
		EDIT ( a ) {
			return this.$b ("EDIT", a)
		},
		COMMENT ( a ) {
			return this.$b ("COMMENT", a)
		},
		SHOW_COMMENTS ( a ) {
			return this.$b ("SHOW_COMMENTS", a)
		},
		QUOTE ( a ) {
			return this.$b ("QUOTE", a)
		},
		INFO ( a ) {
			return this.$b ("INFO", a)
		},
		ACCEPT ( a ) {
			return this.$b ("ACCEPT", a)
		},
		DELETE ( a ) {
			return this.$b ("DELETE", a)
		},
		RESTORE ( a ) {
			return this.$b ("RESTORE", a)
		},
		ADMIN () {
			return "".true (MPS.User.Admin)
		},
		MODER () {
			return "".true (MPS.User.Moder)
		},
		OWNER () {
			return "".true (MPS.User.Owner)
		},
		PROFILE () {
			return "".true (MPS.User.Profile)
		},
		LOGGEDIN () {
			return "".true (MPS.User.Profile && !MPS.User.ID)
		},
		DISABLE () {
			return "".true (this.$n.no_page = this.$n.no)
		},
		ACCESS () {
			return "".true ($cfg.aw)
		},
		WIDGET () {
			return "".true (MPS.WIDGET)
		},
		MOBILE () {
			return "".true (MPS.MOBILE)
		},
		NORMAL_MODE () {
			return "".true (!this.$n.dc && !this.$n.ms)
		},
		DEL_MODE () {
			return "".true (this.$n.dc)
		},
		SEARCH_MODE () {
			return "".true (this.$n.ms)
		},
		DAY () {
			return this.$n.day
				? `${this.$n.day.b0.dd ()}-${this.$n.day.b1.dd ()}-${this.$n.day.w1}`
				: ``
		},
		CALENDAR () {
			return $Calendar ? "<mps-calendar></mps-calendar>" : ""
		},
		$a ( a, t ) {
			return `<a data-a=${a}>${t}</a>`
		},
		$p ( p, c, t, v ) {
			return p && isSet (p.page)
				? `<a class='${c}' data-a=page data-p=${p.page}>${t}</a>`
				: p && p.day
				? `<a class='${c}' data-a=nav_day data-d=${p.day}>${t}</a>`
				: v
				? `<a class='${c} disabled'>${t}</a>`
				: ``
		},
		$b ( m, t ) {
			return this.$n.text [m](t)
		},
		$nav:	{
			CURRENT () {
				return "".true (this.$cur ())
			},
			PAGE () {
				return this.$t (this.$back () ? this.$n.pages - this.$i : this.$i + 1)
			},
			NUM () {
				let m = Math.min ((this.$i + 1) * this.$n.mpp, this.$n.total)
				return this.$t ($cfg.nd
					? `${this.$i * this.$n.mpp + 1}-${m}`
					: `${this.$n.total - this.$i * this.$n.mpp}-${this.$n.total - m + 1}`
				)
			},
			$t ( p ) {
				return this.$cur ()
					? p
					: `<a class=page data-a=page data-p=${this.$i}>${p}</a>`
			},
			$set ( i ) {
				this.$i = i + this.$n.page1
			},
			$cols ( c ) {
				this.$init (+c)
			},
			$size () {
				return this.$n.page_count
			},
			$cur () {
				return this.$i == this.$n.page
			},
			$back () {
				return this.$tpl_name == "BACKWARD"
			},
			$init ( c ) {
				if (!this.$n.day) {
					this.$n.max_pages  = c
					this.$n.page1      = c * (this.$n.page / c | 0)
					this.$n.page_count = Math.min (this.$n.pages - this.$n.page1, c)
					this.$n.page_num   = this.$back () ? this.$n.pages - this.$n.page : this.$n.page + 1
					this.$n.first      = this.$n.page1 ? { page: 0 } : null
					this.$n.last       = this.$n.page1 + this.$n.page_count < this.$n.pages ? { page: this.$n.pages - 1 } : null
					this.$n.prev       = this.$n.page ? { page: this.$n.page - 1 } : null
					this.$n.next       = this.$n.page < this.$n.pages - 1 ? { page: this.$n.page + 1 } : null
					this.$n.prev_block = this.$n.page > this.$n.max_pages ? this.$n.page - this.$n.max_pages : this.$n.page1 - 1
					this.$n.next_block = this.$n.max_pages + (this.$n.page + this.$n.max_pages < this.$n.pages ? this.$n.page : this.$n.page1)
					return
				}
				if (this.$n.cal) {
					$Calendar = []
					let cal = Object.entries (this.$n.cal)
					let p = { d: 0, c: null }
					let day = ( d, y ) => d ? y.shl16 | d : 0
					for (let [y, c] of cal) {
						for (let d in c) {
							if (p.c)
								p.c.n = day (d, y)
							else
								$cfg.first_day = day (d, y)
							c [d] = { l: c [d], p: day (p.d, p.y) }
							p = { c: c [d], d, y }
						}
						$Calendar [+y] = c
					}
					$cfg.last_day   = day (p.d, p.y)
					$cfg.start_year = +cal [0][0]
					$cfg.end_year   = cal [1] ? +cal [1][0] : $cfg.start_year
					delete this.$n.cal
				}
				let d         = $Calendar && ($Calendar [this.$n.day.w1] || [])[this.$n.day.w0]
				this.$n.first = d && d.p ? { day: $cfg.first_day } : null
				this.$n.last  = d && d.n ? { day: $cfg.last_day } : null
				this.$n.prev  = d && d.p ? { day: d.p } : null
				this.$n.next  = d && d.n ? { day: d.n } : null
			}
		},
		$html ( nav, tpl ) {
			this.$n        = nav
			this.$nav.$n   = nav
			nav.pages      = ((nav.total - 1) / nav.mpp | 0) + 1
			nav.first_num  = nav.page * nav.mpp + 1
			nav.last_num   = nav.first_num + nav.count - 1
			nav.page1      = 0
			nav.page_count = nav.pages
			return tpl.pattern ({
				FORWARD:	[this.$nav],
				BACKWARD:	[this.$nav]
			}, _ => {
				if (!nav.max_pages)
					this.$nav.$init (nav.pages)
				return this
			})
		}
	})
	const text_tpl = _ => ({
		MPS_TITLE () {
			return $cfg.title
		},
		WINDOW_TITLE ( t ) {
			return $win.document.title = t.stripTags (), ""
		},
		PROFILE () {
			return this.$m.u.p || 0
		},
		NAME_TEXT () {
			return this.$m.u.n
		},
		NAME () {
			return `<mps-name>${user (this.$m.u)}</mps-name>`
		},
		DATE ( f, l ) {
			return (this.$m.d + $cfg.tc).date (f, l)
		},
		AVATAR () {
			return this.$m.u.a
				? `<mps-avatar><img src=//${MPS.HOST}/people/avatar/${this.$m.u.a.hex (4)}.${this.$m.u.a.ext ()} referrerpolicy=no-referrer loading=lazy></mps-avatar>`
				: ``
		},
		REG_DATE ( f, l ) {
			return this.$m.u.d ? (this.$m.u.d + $cfg.tc).date (f, l) : ""
		},
		COMMENT_COUNT () {
			return this.$cc || ""
		},
		LINK ( url, t, c = "" ) {
			return `<a data-a=link data-url=${url} target=_mps_${MPS.SID}_${this.$m.id} class=${c}>${t}</a>`
		},
		NUM ( url, r = 0 ) {
			let n = r ^ $cfg.md ? this.$m.num : $Nav.total - this.$m.num + 1
			return url && this.$m.id
				? this.LINK (url, n, "num")
				: `<span class=num>${n}</span>`
		},
		REV_NUM ( url ) {
			return this.NUM (url, 1)
		},
		SINGLE () {
			return "".true (!$Nav.mpp)
		},
		EMAIL ( a ) {
			return this.$m.e
				? `<a href='mailto:${this.$m.e}'>${a || this.$m.e}</a>`
				: ``
		},
		WWW ( a ) {
			return this.$m.w
				? `<a href='/r.php?${this.$m.w}' target=_blank>${a || this.$m.w}</a>`
				: ``
		},			
		ICQ ( a ) {
			return this.$m.q
				? `<a data-a=icq data-x=${mess.q} data-m=''>${a || mess.q}</a>`
				: ``
		},
		TITLE_TEXT () {
			return this.$m.t || ""
		},
		TITLE ( t ) {
			t = html (this.$m.t || t || "", this.$m.f)
			return $Nav.cont && this.$m.idx
				? `<a class=title data-a=mess data-m=${this.$m.idx}>${t}</a>`
				: `<span class=title>${t}</span>`
		},
		FIELD1 () {
			return this.$m.f1
				? `<span class=f1>${html (this.$m.f1, this.$m.f)}</span>`
				: ``
		},
		FIELD2 () {
			return this.$m.f2
				? `<span class=f2>${html (this.$m.f2, this.$m.f)}</span>`
				: ``
		},
		FIELD3 () {
			return this.$m.f3
				? `<span class=f3>${html (this.$m.f3, this.$m.f)}</span>`
				: ``
		},
		EDIT_PROFILE () {
			return this.$m.ei ? this.$m.ei.u.p : -1
		},
		EDIT_NAME () {
			return this.$m.ei ? user (this.$m.ei.u) : ""
		},
		EDIT_DATE ( f, l ) {
			return this.$m.ei ? (this.$m.ei.d + $cfg.tc).date (f, l) : ""
		},
		EDIT_COUNT () {
			return this.$m.ei ? this.$m.ei.c : ""
		},
		EDIT ( t ) {
			return this.$ctrl && this.$m.z ? this.$a ("edit", t) : ""
		},
		COMMENT ( t ) {
			return this.$ctrl && this.$c ? this.$a ("comment", t) : ""
		},
		SHOW_COMMENTS ( t ) {
			return this.$cc && (this.$ctrl || this.$comm || (moder_mode () == "del"))
				? this.$a ("comments", t.tpl ({ COUNT: this.$cc }))
				: ""
		},
		COMMENTS () {
			if (this.$edit)
				return ""
			if (this.$m.cc)
				return `<mps-comment data-hidden=1 id=mps_comments_${MPS.SID}_${this.$m.id}></mps-comment>`
			if (!this.$m.c)
				return ""
			this.$m.c.num = 1
			return `<mps-comment data-hidden=${~~this.$m.hc} id=mps_comments_${MPS.SID}_${this.$m.id}>${$tpl.comment.pattern ([text_tpl ().$init (this.$m.c, this.$m.idx, !this.$comm)])}</mps-comment>`
		},
		QUOTE ( t ) {
			return (this.$ctrl || this.$comm) && !$Nav.dc ? this.$a ("quote", t) : ""
		},
		INFO ( t ) {
			return this.$ctrl && this.$m.i ? this.$a ("info", t) : ""
		},
		ACCEPT ( t ) {
			return this.$ctrl && this.$m.am ? this.$a ("accept", t) : ""
		},
		DELETE ( t ) {
			return this.$ctrl && !this.$m.del && (this.$m.i || MPS.User.Owner) ? this.$a ("del", t) : ""
		},
		RESTORE ( t ) {
			return this.$ctrl && this.$m.del && (this.$m.i || MPS.User.Owner) ? this.$a ("restore", t) : ""
		},
		ACCESS_READ ( t ) {
			return this.$ctrl && !this.$m.del && MPS.User.Owner ? this.$a ("access_r", t) : ""
		},
		ACCESS_WRITE ( t ) {
			return this.$ctrl && !this.$m.del && MPS.User.Owner ? this.$a ("access_w", t) : ""
		},
		ACCEPT_DATE ( f, l ) {
			return this.$m.acc ? (this.$m.acc.d + $cfg.tc).date (f, l) : ""
		},
		ACCEPT_NAME () {
			return this.$m.acc && this.$m.acc.u ? user (this.$m.acc.u, "") : ""
		},
		DEL_DATE ( f, l ) {
			return this.$m.del ? (this.$m.del.d + $cfg.tc).date (f, l) : ""
		},
		DEL_NAME () {
			return this.$m.del && this.$m.del.u ? user (this.$m.del.u, "") : ""
		},
		VIEWS () {
			return this.$m.vw
		},
		EDIT_MODE () {
			return "".true (this.$edit)
		},
		COMMENT_MODE () {
			return "".true (this.$comm)
		},
		PREVIEW_MODE () {
			return "".true (this.$preview)
		},
		MODER_MODE () {
			return "".true (moder_mode () == "del")
		},
		CHECK () {
			return "".true (this.$ctrl && this.$m.i && this.$m.i [6] == 1)
		},
		NODEL () {
			return "".true (!this.$m.del && $Nav.dc)
		},
		NONAV () {
			return "".true ($Nav.no)
		},
		ADMIN () {
			return "".true (MPS.User.Admin)
		},
		MODER () {
			return "".true (MPS.User.Moder)
		},
		OWNER () {
			return "".true (MPS.User.Owner)
		},
		WIDGET () {
			return "".true (MPS.WIDGET)
		},
		MOBILE () {
			return "".true (MPS.MOBILE)
		},
		MESS_ID () {
			return this.$m.id
		},
		PROTOCOL () {
			return location.protocol
		},
		HOST () {
			return location.host
		},
		SID () {
			return MPS.SID
		},
		NSID () {
			return MPS.NSID ? MPS.SID.toString () : ""
		},
		RATING_STARS ( a, i ) {
			let r = this.$m.rating.width (a, i)
			return `<mps-stars id=mps_stars_${MPS.SID}_${this.$m.id} class=sw${Math.abs (r.max)} data-a=vote data-max=${r.max} data-i=${~~!!i} data-v=${this.$m.v1} data-m=${this.$m.idx}><div style='width: ${r.val}%'></div><div></div></mps-stars>`
		},
		RATING ( a ) {
			let r = this.$m.rating.rating (a)
			return `<mps-rating id=mps_rating_${MPS.SID}_${this.$m.id} class=sign-${r.sign} data-max=${r.max}>${r.val}</mps-rating>`
		},
		POINTS ( a ) {
			let p = this.$m.rating.points (a)
			return `<mps-points id=mps_points_${MPS.SID}_${this.$m.id} class=sign-${p.sign} data-max=${p.max}>${p.val}</mps-points>`
		},
		VOTERS () {
			return `<mps-voters id=mps_voters_${MPS.SID}_${this.$m.id}>${this.$m.r ? this.$m.r [1] : 0}</mps-voters>`
		},
		VOTE_STARS ( a, i ) {
			if (this.$m._v)
				return ""
			this.$m._v = 1
			return this.RATING_STARS (a, i)
		},
		VOTE_MENU ( m, a ) {
			this.$m._vm = m
			return this.VOTE (... a)
		},
		SVOTE_MENU ( m, a ) {
			this.$m._vs = 1
			this.$m._vm = m
			return this.VOTE (... a)
		},
		SVOTE ( ... a ) {
			this.$m._vs = 1
			return this.VOTE (... a)
		},
		SVOTE_POINTS ( ... a ) {
			this.$m._vp = 1
			this.$m._vs = 1
			return this.VOTE (... a)
		},
		VOTE ( ... a ) {
			let s = ~~this.$m._vs
			let vm = this.$m._vm
			let vp = this.$m._vp
			delete this.$m._vs
			delete this.$m._vm
			delete this.$m._vp
			let v0 = s ? a.length >> 1 : 1
			if (this.$m._v)
				return ""
			if (this.$m.v === false)
				return vp ? this.POINTS (s ? -v0 : a.length) : ""
			this.$m._v = 1
			if (!a.length || a.length > 10 || (s && a.length & 1 == 1))
				return ""
			if (vm && isArray (this.$m.v)) {
				let v = this.$m.v [0] / 10 | 0
				let m = this.$m.v [1]
				return `<select><option>${a [m < 0 ? (v > 0 ? v - 1 : v) - m : v - 1]}</select>`
			}
			let v = []
			a.forEach (( a, i ) => {
				let x = (s ? v0 > i ? -v0 : 1 - v0 : v0) + i
				v.push (vm ? `<option value=${x}>${a}` : `<a data-a=vote data-v=${x}>${a}</a>`)
			})
			if (vp)
				v.insert (v0, this.POINTS (s ? -v0 : a.length))
			return (vm
				? "<select ? data-v=? data-max=? data-m=? data-a=vote><option>??</select>"
				: "<mps-vote ? data-v=? data-max=? data-m=?>??</mps-vote>"
			).format (
				isArray (this.$m.v) ? "vote=" + this.$m.v [0] : "",
				this.$m.v1,
				s ? -v0 : a.length,
				this.$m.idx,
				vm || "", v.join ("")
			)
		},
		RATE ( a ) {
			let r = this.$m.rating.like ()
			let like = ( i, t, s, v, c ) => `<a class=${c} data-a=vote data-v=${v} count=${s} tooltip='${t ? t.htmlEntities () : ""}'>${i}</a>`
			return a && isArray (a.like) && isArray (a.dislike)
				? "<mps-vote ? data-v=? data-max=-1 data-m=?>??</mps-vote>".format (
					isArray (this.$m.v) ? "vote=" + this.$m.v [0] : "",
					this.$m.v1,
					this.$m.idx,
					like (a.like [0], a.like [1], r.like, 1, "like"),
					like (a.dislike [0], a.dislike [1], r.dislike, -1, "dislike")
				)
				: ""
		},
		MESS ( a, b, c ) {
			return this.$mess (a, b, c, 0)
		},
		MESS_PARA ( a, b, c ) {
			return this.$mess (a, b, c, 1)
		},
		$mess ( a1, a2, a3, p ) {
			let Mess = html (this.$m.m, this.$m.f, p)
			let Slice = ""			
			if (a1 && !form_mode ()) {
				var r, l = 0, tt = [], d = [0]
				tt.push ({ pos: 0, len: 0, p: -1, a: 0, cl: { pos: Mess.length, len: 0 } })
				$HTML_RE.reset ()
				while (r = $HTML_RE.exec (Mess)) {
					let tag = r [2].toLowerCase ()
					let len = $HTML_RE.lastIndex - r.index
					l += len
					if (r [1]) {
						let t = tt [d.last ()]
						if (!t)
							continue
						if (t.tag != tag)
							break
						t.cl = { pos: r.index, len: len, a: l }
						d.pop ()
					} else {
						tt.push ({ tag: tag, pos: r.index, len: len, p: d.last (), a: l })
						if (!$SINGLE_TAG.has (tag))
							d.push (tt.length - 1)
					}
				}
				if (d.length == 1 && (Mess.length - l) > 2 * a1) {
					tt [0].cl.a = l
					var br = Math.min (Mess.length - l >> 1, a1)
					var i = tt.length
					while (i--) {
						var t = tt [i]
						var a = t.cl || t
						if (br > a.pos + a.len - a.a) {
							br += a.a
							break
						} else if (t.cl && br > t.pos - t.a && br < t.cl.pos - t.a) {
							while (t && t.cl.pos - t.a - br < br / 5)
								a = t, t = tt [t.p]
							if (t != tt [i])
								br = a.cl.pos + a.cl.len
							else if (br < t.pos + t.len - t.a)
								br = t.pos + t.len
							else
								br += t.a
							break
						}
					}
					while (br < Mess.length && /[-a-zA-Z\u80-\uffff]/.test (Mess [br]))
						br++
					for (let d = 0; t; t = tt [t.p]) {
						if (!t.cl)
							continue
						if (br != t.cl.pos) {
							let l = Mess.length
							Mess = Mess.subreplace (
								s => `<mps-hide>${s}</mps-hide>`,
								br + d,
								t.cl.pos + d
							)
							d += Mess.length - l
						}
						br = t.cl.pos + t.cl.len
					}
					Slice = `<mps-br>${(a2 || "").replaceAll (" ", "&nbsp;")}</mps-br><a class=open data-a=open data-m=${this.$m.idx} data-id=${this.$m.id}>${a3 || ""}</a>`
				}
			}
			return `<mps-mess id=mps_m_${MPS.SID}_${this.$m.id} data-m=${this.$m.idx}>${$tpl.nav ? Mess : Mess.htmlEntities ("%")}${Slice}</mps-mess>`
		},
		$a ( a, t ) {
			return `<a data-a=${a} data-m=${this.$m.idx} text='${t}'></a>`
		},
		$rev () {
			return this.$tpl_name == "REVERSE"
		},
		$size () {
			return this.$text.length
		},
		$set ( i ) {
			this.$i = i
			this.$m = this.$text [this.$rev () ? this.$text.length - i - 1 : i]
			this.$m._v = 0
			this.$m.v1 = this.$m.v === true || (this.$m.v && this.$m.v [2]) ? 1 : 0
			if (!isSet (this.$m.idx))
				this.$m.idx = (this.$pi ? (this.$pi << 10) : 0x00200000) | i
			this.$cc = this.$m.cc || (this.$m.c ? this.$m.c.length : 0)
			this.$c = (this.$m.i || (($cfg.cm != 2 || MPS.User.Moder) && !this.$m.y && (!$cfg.mc || (this.$m.cc < $cfg.mc))))
				&& !$Nav.dc
				&& (!$Form || !($Form.is_edit () || $Form.is_preview ()))
			this.$m.num = this.$rev ()
				? $Nav.page * $Nav.mpp + $Nav.count - this.$i
				: $Nav.page * $Nav.mpp + this.$i + 1
			this.$m.rating = (function ( m ) {
				function _r ( p, m ) {
					let max = this.r_max || ((!m || m < -10 || m > 10) ? 5 : m)
					if (!this.r) {
						return {
							max:	max,
							sign:	"0",
							val:	"0"
						}
					}
					let val = Math.abs (max * this.r [0]) / 100
					return {
						max:	max,
						sign:	this.r [0] < 0 ? "n" : max < 0 && this.r [0] > 0 ? "p" : "0",
						val:	p
							? val + .5 | 0
							: this.r [1]
							? (val / this.r [1]).locale ()
							: 0
					}
				}
				function _w ( m, i ) {
					let max = (!m || m < -10 || m > 10) ? 5 : m
					let r = this.r
						? this.r [0] / this.r [1] + .5 | 0
						: 0
					return {
						max:	max,
						val:	r <= 0 ? 0 : i ? 10 * (r / 10 + .5 | 0) : r
					}
				}
				function _l () {
					let l = this.r ? (this.r [0] / 100 + this.r [1]) / 2 : 0
					let d = this.r ? this.r [1] - l : 0
					return {
						like: 	l,
						dislike:d
					}
				}
				return {
					rating:	_r.bind (m, 0),
					points:	_r.bind (m, 1),
					like:	_l.bind (m),
					width:	_w.bind (m)
				}
			})(this.$m)
		},
		$post () {
			function set_class () {
				if (this.root && this.ar)
					this.root.setClass (this.ar == 1 ? "access-r" : this.ar == -1 ? "access-x" : this.ar < -1 ? "access-s" : "")
			}

			for (let m of this.$text) {
				m.root = MPS.root.$(`#__mps_root_${m.id}`)
				m.set_class = set_class
				m.set_class ()
			}
			$JSID++
			for (let js of $JS)
				$win.document.head.append ("script", js)
			$JS.clear ()
			let r = $MPSText.all ("mps-rolling")
			r && r.forEach (color_rol)
			r = $MPSText.all ("video")
			r && r.forEach (v => v.volume = .5)
		},
		$init ( t, p, c ) {
			this.$text = t
			this.$ctrl = c && !moder_mode ()
			this.$edit = $Form && $Form.is_edit ()
			this.$comm = $Form && $Form.is_comment ()
			this.$preview = $Form && $Form.is_preview ()
			this.$pi = p || 0
			return this
		}
	})
	const scroll_el = win => ({
		get scroll () {
			return this.el.scrollTop
		},
		set scroll ( s ) {
			this.el.scrollTop = s
		},
		scrollTo ( t ) {
			this.scroll = t
		},
		scrollToSmooth ( s, dy = d => d >> 3 ) {
			let f = _ => {
				let t = this.scroll
				let d = s - t
				this.scroll += dy (d) + d.sign ()
				if (this.scroll != t)
					win.requestAnimationFrame (f)
			}
			f ()
		},
		on () {
		},
		off () {
		},
		el: win.document.scrollingElement
	})

	const xhr = function ( ... arg ) {
		August.xhr (loader)(... arg)
	}
	const load_tpl = August.loadTPL ({
		APL: MPS.APL ? `mps/${MPS.APL}` : `mps`,
		TPL: MPS.TPL || null
	}, loader)
	const load_design = function ( des, onload, onerror ) {
		MPS.root.attr ("design", des)
		load_css (des.set (`__css`, `mps_${MPS.SID}`), onload, onerror)
	}
	const load_css = function ( css, onload, onerror ) {
		August.loadCSS ($win, css, `$mps/${MPS.APL || "0"}`, onload, onerror)
	}

	const $ACTION = {
		design:		a_design,
		link:		a_link,
		userinfo:	a_userinfo,
		open:		a_open,
		comments:	a_comments,
		contents:	a_contents,
		mess:		a_mess,
		page:		a_page,
		collapse:	a_collapse,
		copy:		a_copy,
		toggle:		a_toggle,
		vote:		a_vote,
		auth:		a_auth,
		comment:	a_form,
		edit:		a_form,
		quote:		a_form,
		form:		a_form,
		info:		a_moder,
		accept:		a_moder,
		del:		a_moder,
		restore:	a_moder,
		search:		a_moder,
		access_r:	a_access_r,
		access_w:	a_access_w,
		logout:		a_logout,
		del_text:	a_del_text,
		reset:		a_reset,
		nav_day:	a_cal_day,
		cal_day:	a_cal_day,
		cal_mon:	a_cal_mon,
		cal_year:	a_cal_year,
		load_title:	load_title
	}
	const $BB_CODE = {
		font:		{ f: 0x00000001, p: /^[-\w ]+$/, h: bb_font },
		size:		{ f: 0x00000002, p: /^[1-8]$/, h: bb_size },
		color:		{ f: 0x00000004, p: /^(?:(?:#[0-9a-f]{6}(?:-#[0-9a-f]{6})*)|[a-z]+)$/i, h: bb_color },
		hl:		{ f: 0x00000004, p: /^(?:(?:#[0-9a-f]{6}(?:-#[0-9a-f]{6})*)|[a-z]+)$/i, h: bb_highlight },
		highlight:	{ f: 0x00000004, p: /^(?:(?:#[0-9a-f]{6}(?:-#[0-9a-f]{6})*)|[a-z]+)$/i, h: bb_highlight },
		h1:		{ f: 0x48000008, h: "<h1>?</h1>" },
		h2:		{ f: 0x48000008, h: "<h2>?</h2>" },
		h3:		{ f: 0x48000008, h: "<h3>?</h3>" },
		h4:		{ f: 0x48000008, h: "<h4>?</h4>" },
		h5:		{ f: 0x48000008, h: "<h5>?</h5>" },
		h6:		{ f: 0x48000008, h: "<h6>?</h6>" },
		hh1:		{ f: 0x48000008, h: "<h1><span>?</span></h1>" },
		hh2:		{ f: 0x48000008, h: "<h2><span>?</span></h2>" },
		hh3:		{ f: 0x48000008, h: "<h3><span>?</span></h3>" },
		hh4:		{ f: 0x48000008, h: "<h4><span>?</span></h4>" },
		hh5:		{ f: 0x48000008, h: "<h5><span>?</span></h5>" },
		hh6:		{ f: 0x48000008, h: "<h6><span>?</span></h6>" },
		b:		{ f: 0x00000040, h: "<b>?</b>" },
		i:		{ f: 0x00000040, h: "<i>?</i>" },
		u:		{ f: 0x00000040, h: "<u>?</u>" },
		s:		{ f: 0x00000040, h: "<s>?</s>" },
		del:		{ f: 0x00000040, h: "<s>?</s>" },
		sub:		{ f: 0x00000080, h: "<sub>?</sub>" },
		sup:		{ f: 0x00000080, h: "<sup>?</sup>" },
		big:		{ f: 0x00000002, h: "<big>?</big>" },
		small:		{ f: 0x00000002, h: "<small>?</small>" },
		tt:		{ f: 0x80040000, h: "<tt>?</tt>" },
		left:		{ f: 0x48000100, h: "<div align=left>?</div>" },
		right:		{ f: 0x48000100, h: "<div align=right>?</div>" },
		center:		{ f: 0x48000100, h: "<div align=center>?</div>" },
		fleft:		{ f: 0x48000100, h: "<div class=fleft>?</div>" },
		fright:		{ f: 0x48000100, h: "<div class=fright>?</div>" },
		indent:		{ f: 0x4c000200, h: "<div class=indent>?</div>" },
		columns:	{ f: 0x7c000400, p: /^(\d)+(?:,\s*(\d))?$/, h: bb_columns },
		notice:		{ f: 0x4c000400, p: /^[-\w]+$/, h: bb_notice },
		list:		{ f: 0x68000800, p: /^[1aics]$/i, h: bb_list },
		hr:		{ f: 0x68001000, p: /^(?:(?:#[0-9a-f]{6})|[a-z]+)$/i, h: bb_hr },
		attach:		{ f: 0x68002000, p: /^\w+$/i, h: bb_attach },
		img:		{ f: 0x68002000, p: /^\w+$/i, h: bb_img },
		youtube:	{ f: 0x78008000, p: /^(\d*),\s*(\d*)(?:,\s*(\w+))?$/i, h: bb_youtube },
		video:		{ f: 0x78008000, p: /^(\d*),\s*(\d*)(?:,\s*(\w+))?$/i, h: bb_video },
		flash:		{ f: 0x78004000, p: /^(\d*),\s*(\d*)(?:,\s*(\w+))?$/i, h: bb_flash },
		music:		{ f: 0x78008000, h: bb_music },
		map:		{ f: 0x78010000, p: /^(?:(\d+)?,\s*(\d+)?(?:,\s*([a-z]*))?)?$/, h: bb_map },
		rolling:	{ f: 0x10020000, p: /^([-a-z0-9#\/|]+)(?:,\s*(\d+))?$/i, h: bb_rolling },
		nobb:		{ f: 0x80000000, h: bb_nobb, code: 1 },
		plain:		{ f: 0x80000000, h: bb_nobb, code: 1 },
		code:		{ f: 0x28040000, p: /.+/, h: bb_code, code: 1 },
		quote:		{ f: 0xfc000000, p: /^([^,]+)(?:, *(.+))?$/, h: bb_quote },
		spoiler:	{ f: 0xec000000, p: /.+/, h: bb_spoiler },
		url:		{ f: 0xc0000000, p: /.+/, h: bb_url },
		email:		{ f: 0xc0000000, p: /.+/, h: bb_email }
	}
	const $CF = {
		ALWAYS_BB:	0x80000000,	//  bb-код будет обработан всегда, независимо от настроек
		TRIM:		0x40000000,	//  тримминг строки
		NO_PARAMS:	0x20000000,	//  параметры необязательны (при наличии {p:})
		GET_ARRAY:	0x10000000,	//  параметры в виде массива из скобочек RE
		BLOCK:		0x08000000,	//  блочный элемент
		PARA:		0x04000000	//  эти блоки поддерживают параграфы
	}
	const $TF = {
		FONT:		0x00000001,
		SIZE:		0x00000002,
		COLOR:		0x00000004,
		HEADING:	0x00000008,
		STYLE:		0x00000040,
		INDEX:		0x00000080,
		JUSIFY:		0x00000100,
		INDENT:		0x00000200,
		LIST:		0x00000800,
		LINE:		0x00001000,
		IMAGE:		0x00002000,
		FLASH:		0x00004000,
		MEDIA:		0x00008000,
		MAP:		0x00010000,
		ROLLING:	0x00020000,
		CODE:		0x00040000,
		TT:		0x00040000,
		CHAR_CODE:	0x08000000,
		HTML:		0x40000000
	}
	const $CHAR_CODE = {
		"(c)":		"&copy;",
		"(tm)":		"&#153;",
		"(r)":		"&reg;",
		" --- ":	" &mdash; ",
		" -- ":		" &ndash; ",
		"<<":		"&laquo;",
		">>":		"&raquo;"
	}
	const $ROLLING_SET = {
		"red-black":	"ff0000ee0000dd0000cc0000bb0000aa0000990000880000770000660000550000440000330000220000110000000000110000220000330000440000550000660000770000880000990000aa0000bb0000cc0000dd0000ee0000",
		"red-yellow":	"ff0000ff1100ff2200ff3300ff4400ff5500ff6600ff7700ff8800ff9900ffaa00ffbb00ffcc00ffdd00ffee00ffff00ffee00ffdd00ffcc00ffbb00ffaa00ff9900ff8800ff7700ff6600ff5500ff4400ff3300ff2200ff1100",
		"rainbow":	"ff0000ff4000ff8000ffc000ffff00c0ff0080ff0040ff0000ff0000ff4000ff8000ffc000ffff00c0ff0080ff0040ff0000ff4000ff8000ffc000ffff00ffff00c0ff0080ff0040"
	}
	const $SINGLE_TAG = new Set ([
		'area', 'bgsound', 'command', 'embed', 'param', 'source',
		'input', 'track', 'hr', 'br', 'wbr', 'dd', 'img'
	])
	const $HTML_RE = /<(\/?)([a-zA-Z][-\w]*)\b.*?>/g
	const $MAT_RE = /\03([^\03\04]+)\04/g
	const $CNS_RE = /\05([^\05\06]+)\06/g
	const $CHR_RE = /\01(.+?)\02/g

	const $win = MPS.root.ownerDocument.defaultView
	const $SB = MPS.SB || scroll_el ($win)

	let $Storage = August.storage (`MPS.${MPS.SID}`)
	let $Event = new august_event ()
	let $HelpText = new help_text
	let $History = $win.history
	let $hs = null
	let $cfg = null
	let $tpl = null
	let $Nav = {}
	let $Text = null
	let $Des = null
	let $Auth = null
	let $Form = null
	let $Moder = null
	let $Search = null
	let $LastPage = null
	let $MPSText = null
	let $NoticeText = null
	let $Calendar = null
	let $EscQueue = []
	let $JS = []
	let $IMGs = {}
	let $RID = 0
	let $JSID = 0
	let $CR_RE = null
	let $EL_RE = null
	let $MODULE = {}

	MPS.MOBILE = "orientation" in window && "Touch" in window
	MPS.WIDGET = MPS.root != $win.document.body
	set_class ("app-mps", 1)
	set_class (MPS.APL, 1)

	return {
		init,
		notice,
		design,
		page,
		put_history,
		load_module,
		load_mess,
		load_day,
		suspend_on ()	{ $cfg.suspend = 1 },
		suspend_off ()	{ $cfg.suspend = 0 },
		get MPS ()	{ return MPS },
		get CFG ()	{ return $cfg },
		get TF  ()	{ return $TF },
		get Event ()	{ return $Event }
	}
}
