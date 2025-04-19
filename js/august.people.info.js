//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.info.js


function august_people_info ( param, handlers ) {
	function info_handler ( info ) {
		function value ( n ) {
			return info [isNumber (n) ? "_" + n.z (4) : n]
		}
		function zero_v ( v ) {
			return v && v != "0" ? v : ""
		}
		function zero ( n ) {
			return zero_v (value (n))
		}
		function text_v ( v ) {
			return v ? v.html (50).htmlEntities ("%") : ""
		}
		function text ( n ) {
			return text_v (value (n))
		}
		function text_param ( p, n ) {
			let v = value (n)
			if (!isSet (p [v]))
				return ""
			let pp = p [v].split ("/")
			return pp.length == 2 ? pp [info.Sex - 1] : p [v]
		}
		function text_param_zero ( p, n ) {
			return p.length ? text_param (p, n) : zero (n)
		}
		function text_set ( p, n ) {
			let v = value (n)
			let r = []
			for (let i = 0; v; v >>= 1, i++) {
				if (v & 1 && isSet (p [0][i]))
					r.push (p [0][i])
			}
			return isSet (p [1]) ? r.join (p [1]) : r.join ()
		}
		function text_set_zero ( p, n ) {
			return p.length ? text_set (p, n) : zero (n)
		}

		return {
			zero_v,
			text_v,
			zero:		handlers && handlers.zero || zero,
			text:		handlers && handlers.text || text,
			text_param:	handlers && handlers.text_param || text_param,
			text_param_zero:handlers && handlers.text_param_zero || text_param_zero,
			text_set:	handlers && handlers.text_set || text_set,
			text_set_zero:	handlers && handlers.text_set_zero || text_set_zero
		}
	}
	function modal () {
		this.show = function ( ... a ) {
			if (Modal != a [0])
				Stack.push (Modal)
			let m = show (...a)
			let s = m && m.$("#__scroll") || m
			if (s) {
				s.tabIndex = -1
				s.s ({ outline: "none" }).focus ()
			}
			return this
		}
		this.hide = function () {
			show (Stack.pop ())
		}
		this.form = function () {
			return Modal && $(`modal_${Modal}`).firstChild
		}
		this.exists = function ( id ) {
			return !!$(`modal_${id}`)
		}
		this.swipe = function ( cb_left, cb_right ) {
			let m = $(`modal_${Modal}`).firstChild
			if (m.is_swiped)
				return
			m.is_swiped = true
			m.swipe (cb_left, cb_right, 100, 1000)
			m.next = cb_left
			m.prev = cb_right
		}
		function show ( m, html, className ) {
			if (Modal)
				$(`modal_${Modal}`).className = ""
			if (!m) {
				Modal = 0
				INFO.$("div.content").setClass ("shadow", 0)
				SB && SB.on ()
				return null
			}
			Modal = m
			m = modal (m)
			if (isSet (html))
				m.innerHTML = `<form>${html}</form>`
			if (isSet (className))
				m.firstChild.className = className
			m.oncontextmenu = e => e.$.form && isSet (e.$.value) ? true : e.stop ()
			m.className = "show"
			INFO.$("div.content").setClass ("shadow", 1)
			SB && SB.off ()
			return m.firstChild
		}
		function modal ( id ) {
			return $(`modal_${id}`) || INFO.append ("modal", { id: `modal_${id}` })
		}

		let Modal = 0
		let Stack = []
	}
	function show_sect ( el ) {
		let t = INFO.$(el.attr ("sect"))
		if (t)
			t.setClass ("show")
	}
	function album ( el ) {
		let a = el.attr ("album")
		if (a !== null)
			photo_init (+a)
	}
	function albums_init ( photo, al, tpl ) {
		PhotoSec = INFO.$("section[name='photo']")
		PhotoPlace = PhotoSec && PhotoSec.$("photo")
		if (!PhotoPlace)
			return
		Album = []
		CurAlbum = -1
		let id = void 0
		let AlbumSec = PhotoSec && PhotoSec.$("albums")
		if (AlbumSec && tpl) {
			let html = ""
			al.forEach (al => {
				html += tpl.tpl ({
					ID:		al.t ? al.id : "",
					NAME:		al.n,
					DESCRIPTION:	al.d,
					PHOTO:		al.t ? `//${MAIN.Host}/people/thumb/${Profile.hex (3)}${al.t}.${al.e}` : "",
					COUNT:		al.c,
					PERMIT:		al.p,
					ACCESS:		a => { let s = ['a', 'r', 's', 'x'][al.a]; return a ? a [s] || "" : s },
				})
				Album [al.id] = al
				Album [al.id].ph = []
			})
			AlbumSec.innerHTML = html
			if (MAIN.$sb && AlbumSec.attr ("scrollbar") !== null) {
				AlbumSec.parent ().insert ("albums-container", AlbumSec)
					.css ("display: block; position: relative").append (AlbumSec)
				new MAIN.$sb (AlbumSec, 1)
			}
			photo.forEach (ph => {
				Album [ph.a].ph.push (ph)
				if (!isSet (id))
					id = ph.a
			})
		} else {
			Album [0] = { ph: photo, n: "" }
			id = 0
		}
		PhotoIMG = [new Image (), new Image ()]
		PhotoPlace.append (PhotoIMG [0])
		PhotoPlace.append (PhotoIMG [1])
		PhotoIMG [0].onload = PhotoIMG [1].onload = function () {
			let comm = PhotoSec.$("comm")
			if (comm) {
				comm.innerHTML = (Photo [CurPhoto].c || "").html (30)
				comm.s ({ top: `${PhotoHeight + this.height >> 1}px` })
			}
			clearTimeout (PhotoPlace.to)
			PhotoPlace.setClass ("wait", 0).setClass (`img${PhotoIMGShown}`, 1).setClass (`img${PhotoIMGShown ^= 1}`, 0)
		}
		photo_init (id)
		PhotoPlace.swipe (photo_next, photo_prev, 100, 1000)
	}
	function photo_init ( id ) {
		if (!PhotoPlace || id == CurAlbum || !Album [id].ph.length)
			return
		CurAlbum = id
		Photo = Album [id].ph
		PhotoPlace.setClass ("one", Photo.length == 1)
		let t = PhotoSec.$("thumbs")
		if (t) {
			t = t.$("thumbs") || t
			t.innerHTML = `<ul>${Photo.map (( p, i ) => `<li name=photo_thumb data-num=${i + 1}><img src=//${MAIN.Host}/people/thumb/${Profile.hex (3)}${p.p}.${p.e} referrerpolicy=no-referrer></li>`).join ("")}</ul>`
			let l = t.firstChild
			l.n = 0
			if (!INIT.MOBILE)
				l.on ("wheel", thumbs_scroll)

			let ps = PhotoSec.$("pages")
			if (ps) {
				ps.n = 0
				ps.innerHTML = ""
			}
			if (ps && l.children.length > 1) {
				ps.cur = 1
				ps.w = l.el (1).offsetLeft - l.el (0).offsetLeft
				ps.p = l.offsetWidth / ps.w | 0
				ps.l = l
				if (ps.p < Photo.length) {
					ps.n = (l.children.length + ps.p - 1) / ps.p | 0
					ps.innerHTML = "<li>".repeat (ps.n)
					for (let i = 0; i < ps.n; i++)
						ps.el (i).idx = i
					ps.set = function ( n ) {
						let idx = (n + this.p - 1) / this.p | 0
						if (this.cur != idx) {
							this.el (this.cur).className = ""
							this.el (this.cur = idx).className = "cur"
						}
					}
					ps.onclick = function ( e ) {
						let idx = e.$.idx
						if (isSet (idx) && idx != this.cur) {
							this.l.n = Math.min (idx * this.p, Photo.length - this.p)
							this.l.prop ("--left", this.w * l.n)
							this.set (this.l.n)
						}
					}
				}
			}
			PhotoPlace.touch = new august_touch (l, {
				start ( e ) {
					this.x0 = e.pageX
					this.l0 = +this.prop ("--left")
					this.w0 = this.el (1).offsetLeft - this.el (0).offsetLeft
					this.setClass ("scroll", 1)
					return true
				},
				move ( e ) {
					this.prop ("--left", this.l0 - e.pageX + this.x0)
				},
				end ( e ) {
					this.setClass ("scroll", 0)
					e.deltaY = -(e.pageX - this.x0 - this.w0 / 2) * 100 / this.w0
					thumbs_scroll.call (this, e)
				}
			})
		}
		let mw = +PhotoPlace.attr ("max-width") || 99999
		let hs = Photo.map (p => p.w < mw ? p.h : p.h * mw / p.w + .5 | 0)
		if (Photo.length > 1) {
			hs.sort (( a, b ) => a - b)
			let a = []
			let p = hs [0]
			let n = -1
			let c = 1
			for (let i = 1; i < hs.length; i++) {
				if (hs [i] - p < 50) {
					if (n == -1)
						n = a.length
					else
						c = a [n].c
					a [n] = { h: hs [i], c: c + 1 }
				} else {
					p = hs [i]
					n = -1
					c = 1
				}
			}
			a.sort (( a, b ) => b.c == a.c ? b.h - a.h : b.c - a.c)
			PhotoHeight = a.length ? a [0].h : hs [hs.length + 1 >> 1]
		} else {
			PhotoHeight = hs [0]
		}
		delete PhotoIMG [PhotoIMGShown].dataset.view
		delete PhotoIMG [PhotoIMGShown ^ 1].dataset.view
		PhotoPlace.setHeight (PhotoHeight)
		CurPhoto = -1
		photo_view (0)
	}
	function photo_view ( p ) {
		if (p == CurPhoto || !PhotoPlace)
			return
		let t = PhotoSec.$("thumbs")
		if (t) {
			t = t.$("thumbs") || t
			let l = t.firstChild
			if (l.children.length > 1) {
				let pt = l.el (CurPhoto)
				pt && pt.setClass ("cur", 0)
				let ct = l.el (p)
				ct.setClass ("cur", 1)
				let w = l.el (1).offsetLeft - l.el (0).offsetLeft
				let ww = t.offsetWidth / w + .5 | 0
				if (l.n < ct.dataset.num - ww)
					l.prop ("--left", w * (l.n = ct.dataset.num - ww))
				else if (l.n > ct.dataset.num - 1)
					l.prop ("--left", w * (l.n = ct.dataset.num - 1))
				let ps = PhotoSec.$("pages")
				if (ps && ps.n)
					ps.set (l.n)
			}
		}
		CurPhoto = p
		let mw = +PhotoPlace.attr ("max-width")
		let w = Photo [p].w
		let h = Photo [p].h
		let src = `//${MAIN.Host}/people/photo/${Profile.hex (3)}${Photo [p].p}.${Photo [p].e}`
		let IMG = PhotoIMG [PhotoIMGShown ^ 1]
		delete PhotoIMG [PhotoIMGShown].dataset.view
		if (mw && w > mw) {
			h = h * mw / w + .5 | 0
			w = mw
			IMG.dataset.view = src
		} else {
			delete IMG.dataset.view
		}
		if (h > PhotoHeight) {
			w = w * PhotoHeight / h + .5 | 0
			h = PhotoHeight
			IMG.dataset.view = src
		}
		clearTimeout (PhotoPlace.to)
		PhotoPlace.to = setTimeout (() => PhotoPlace.setClass ("wait", 1), 200)
		IMG.src = src
		IMG.width = w
		IMG.height = h
		if ($("photo_num"))
			$("photo_num").innerHTML = ++p
		if ($("photo_count"))
			$("photo_count").innerHTML = Photo.length
		if ($("photo_prev") && $("photo_next")) {
			if (CurPhoto == Photo.length - 1) {
				$("photo_prev").display ("")
				$("photo_next").display ()
			} else if (!CurPhoto) {
				$("photo_prev").display ()
				$("photo_next").display ("")
			} else {
				$("photo_prev").display ("")
				$("photo_next").display ("")
			}
		}
	}
	function photo_prev () {
		photo_view (CurPhoto > 0 ? CurPhoto - 1 : Photo.length - 1)
	}
	function photo_next () {
		photo_view (CurPhoto < Photo.length - 1 ? CurPhoto + 1 : 0)
	}
	function photo_thumb ( el ) {
		if (el.dataset.num)
			photo_view (el.dataset.num - 1)
	}
	function thumbs_scroll ( e ) {
		let w = this.el (1).offsetLeft - this.el (0).offsetLeft
		let n = this.n + e.delta () | 0
		if (n < 0 || n > Photo.length - (this.offsetWidth / w | 0))
			n = this.n
		this.prop ("--left", w * (this.n = n))
		let ps = PhotoSec.$("pages")
		if (ps && ps.n)
			ps.set (n)
		if (e.type != "touchend")
			e.stop ()
	}
	function grouplist_stringify ( tpl, cb = _ => true) {
		let l = {}
		for (let id in GroupList) {
			let g = GroupList [id]
			if (cb (g))
				l [id] = tpl ? tpl.tpl ({ GROUP_NAME: g.n, GROUP_COUNT: g.c }) : g.n
		}
		return JSON.stringify (l)
	}
	function grouplist_html ( r, tpl ) {
		$("info_section_grouplist").innerHTML = tpl.pattern ([MAIN.list (r, {
			ID	() { return this.$u.id },
			NAME	() { return this.$u.n },
			COUNT	() { return this.$u.c || "" }
		})])
	}
	function grouplist_refresh () {
		let r = []
		for (let id in GroupList) {
			if (SELF || GroupList [id].a)
				r.push (GroupList [id])
		}
		grouplist_html (r, TPL.grouplist_table)
	}
	function grouplist ( r, tpl, el ) {
		GroupList = {}
		r.forEach (g => GroupList [g.id] = g)
		grouplist_html (SELF ? r : r.filter (g => g.a), tpl, el)
		if (el) {
			el.attr ("load", null)
			collapse (el)
		}
	}
	function create_group ( tpl ) {
		let m = Modal.show ("create_group", tpl.tpl ()).form ()
		m.handler = m.name.focus.bind (m.name)
		m.handler ()
	}
	function delete_group ( tpl ) {
		if (!GroupList)
			return
		let m = Modal.show ("delete_group", tpl.tpl ({
			GROUPLIST:	tpl => grouplist_stringify (tpl)
		})).form ()
		if (m.group_id) {
			m.handler = m.group_id.focus.bind (m.group_id)
			m.handler ()
		}
	}
	function add_to_group ( tpl ) {
		if (!GroupList)
			return
		let m = Modal.show ("add_to_group", tpl.tpl ({
			GROUPLIST:	tpl => grouplist_stringify (tpl, g => !g.a)
		})).form ()
		if (m.group_id) {
			m.handler = m.group_id.focus.bind (m.group_id)
			m.handler ()
		}
	}
	function create_group_ok () {
		let m = Modal.form ()
		let Name = m.name.value.trim ()
		let Spec = m.spec.value.trim ()
		Modal.hide ()
		if (!Name)
			return
		MAIN.sendCmd (42, r => {
			m.name.value = m.spec.value = ""
			r = JSON.parse (r)
			if (!GroupList)
				GroupList = {}
			GroupList [r.id] = {
				id:	r.id,
				d:	r.d,
				c:	0,
				n:	Name,
				s:	Spec
			}
			grouplist_refresh ()
		}, {
			group_name:	Name,
			group_spec:	Spec
		})
	}
	function delete_group_ok () {
		let m = Modal.form ()
		let id = +m.group_id.value
		Modal.hide ()
		if (!id)
			return
		MAIN.sendCmd (43, r => {
			delete GroupList [r]
			grouplist_refresh ()
		}, {
			group_id:	id
		})
	}
	function edit_group_ok () {
		let m = Modal.form ()
		let g = GroupList [m.group]
		let Name = m.name.value.trim ()
		let Spec = m.spec.value.trim ()
		Modal.hide ()
		let del = []
		for (let i of m) {
			if (i.name == "del" && i.checked)
				del.push (i.value)
		}
		if (del.length) {
			MAIN.sendCmd (45, r => {
				g.c = +r
				grouplist_refresh ()
			}, {
				del_id:		del,
				group_id:	m.group
			})
		}
		if (!Name || (Name == g.n && Spec == g.s))
			return
		MAIN.sendCmd (42, r => {
			g.n = Name
			g.s = Spec
			grouplist_refresh ()
		}, {
			group_name:	Name,
			group_spec:	Spec,
			group_id:	m.group
		})
	}
	function add_to_group_ok () {
		let m = Modal.form ()
		let id = +m.group_id.value
		Modal.hide ()
		if (!id)
			return
		MAIN.sendCmd (44, r => {
			if (+r) {
				GroupList [id].a = +r
				GroupList [id].c++
				grouplist_refresh ()
			}
		}, {
			group_id:	id,
			profile:	Profile
		})
	}
	function group ( a ) {
		let m = Modal.show ("group", TPL.group.pattern ([MAIN.list (a.LIST, {
			ID () { return this.$u.p },
		})])).form ()
		m.handler = m.name.focus.bind (m.name)
		m.handler ()
		m.name.value = GroupList [a.GROUP].n
		m.spec.value = GroupList [a.GROUP].s
		m.group = a.GROUP
	}
	function nicklist_table ( rev ) {
		if (!NickList)
			return ""
		let l = NickSort == NICK_SORT.DATE
			? NickList.slice ().sort (( a, b ) => a.d - b.d)
			: NickSort == NICK_SORT.TIME
			? NickList.slice ().sort (( a, b ) => b.t - a.t)
			: NickList.slice ()
		if (rev)
			l.reverse ()
		let Summa = l.reduce (( a, c ) => a + c.t, 0)
		return TPL.nicklist_table.pattern ([MAIN.list (l, {
			NICK	() { return this.$u.n },
			WIDTH	() { return this.$p ().toFixed () },
			PERCENT	() { return this.$p ().locale (0, 2) },
			TIME	() { return this.$u.t.time () },
			$p	() { return Summa ? 100 * this.$u.t / Summa : 0 }
		})])
	}
	function nicklist ( r, tpl, el ) {
		NickList = r
		if (el) {
			el.attr ("load", null)
			$("info_section_nicklist").innerHTML = nicklist_table ()
			collapse (el)
			if (r.length < 3)
				el.remove (el.$("menu"))
		} else {
			Modal.show ("nicklist", nicklist_table ())
		}
	}
	function sort_nicklist ( el ) {
		let s = NICK_SORT [el.attr ("sort").toUpperCase ()]
		let rev = NickSort == s && !$("info_section_nicklist").rev
		NickSort = s
		$("info_section_nicklist").rev = rev
		$("info_section_nicklist").innerHTML = nicklist_table (rev)
	}
	function refs_list ( r, tpl ) {
		if (!ADMIN)
			r = r.map (u => (u.p = u.del ? 0 : u.p, u))
		Modal.show ("refs_list", tpl.pattern ([MAIN.list (r)]))
	}
	function viewers_list ( r, tpl ) {
		Modal.show ("viewers_list", tpl.pattern ([MAIN.list (r.LIST, {
			PAGE_NUM	() { let n = this.NUM (); return n ? n + r.PAGE.p * r.PAGE.m : "" },
			COUNT		() { return this.$u && this.$u.c > 1 && this.$u.n.length ? this.$u.c : "" },
			IP		() { return this.$u ? (this.$u.ip [1] || this.$u.ip [0]).ip ().replace (/\.0$/, ".***") : "" }
		})], {
			PREV_PAGE:	r.PAGE.p ? ` id=__vl_prev name=show_viewers a=hide data-max=${r.PAGE.m} data-page=${r.PAGE.p - 1}` : "",
			NEXT_PAGE:	r.PAGE.n ? ` id=__vl_next name=show_viewers a=hide data-max=${r.PAGE.m} data-page=${r.PAGE.p + 1}` : ""
		})).swipe (
			function () { this.$("#__vl_next") && this.$("#__vl_next").click () },
			function () { this.$("#__vl_prev") && this.$("#__vl_prev").click () }
		)
	}
	function auth_fail ( r, tpl ) {
		Modal.show ("auth_fail_panel", tpl.pattern ([{
			NUM		() { return this.$i + 1 },
			DAY		( f, l ) { return this.$rd != this.$d.getDate () ? this.$d.lang (l).format (f) : "" },
			TIME		() { return this.$d.format ("HH:ii:ss") },
			WHERE		( ... a ) { return a [this.$s.w - 1] },
			ERROR		( ... a ) { return a [this.$s.e - 1] },
			NICK		() { return this.$s.n },
			IP		() { return this.$s.ci [1].ip () },
			PROXY		() { return this.$s.ci [2].ip () },
			CID1		() { return ADMIN ? `<a name=compinfo data-ci=fail data-i=${this.$i}>${this.$s.ci [3]}</a>` : this.$s.ci [3] },
			CID2		() { return ADMIN ? `<a name=compinfo data-ci=fail data-i=${this.$i}>${this.$s.ci [4]}</a>` : this.$s.ci [4] },
			ANOTHER		() { return "".true (this.$rd != this.$d.getDate () ? this.$an ^= 1 : this.$an) },
			ADMIN		() { return "".true (ADMIN) },
			SELF		() { return "".true (SELF) },
			$size		() { return r.AUTH_FAIL.length },
			$set		( i ) { this.$rd = this.$d ? this.$d.getDate () : 0; this.$s = r.AUTH_FAIL [i]; this.$d = new Date (this.$s.ci [0] * 1000) },
			$an:		0,
			$rd:		0
		}], {
			PREV_MONTH:	` id=__af_prev name=auth_fail_log a=hide data-mon=${r.MONTH + 1}`,
			NEXT_MONTH:	r.MONTH ? ` id=__af_next name=auth_fail_log a=hide data-mon=${r.MONTH - 1}` : ""
		})).swipe (
			function () { this.$("#__af_next") && this.$("#__af_next").click () },
			function () { this.$("#__af_prev") && this.$("#__af_prev").click () }
		)
		MODER && MODER.ci ("fail", r.AUTH_FAIL)
	}
	function stat_month_init ( r, tpl, el ) {
		let s = []
		r.LIST.forEach (st => s [st.m] = st)
		Stat = {
			s: s,
			f: r.LIST.length ? r.LIST [0].m : "",
			l: r.CUR_MON,
			c: r.CUR_MON
		}
		stat_month ()
	}
	function stat_month ( el ) {
		let m = el ? +el.dataset.mon || Stat.c : Stat.c
		let PrevMon = (m >> 8 & 0x0f) == 1 ? (m & 0xfff0000) - 0x10000 + (12 << 8) : m - (1 << 8)
		let NextMon = (m >> 8 & 0x0f) == 12 ? (m & 0xfff0000) + 0x10000 + (1 << 8) : m + (1 << 8)
		Modal.show ("stat_panel", TPL.stat.tpl ({
			STAT_TIME:	Stat.s [m] ? Stat.s [m].t.time () : 0,
			STAT_ENTER:	Stat.s [m] ? Stat.s [m].e : 0,
			STAT_COUNT1:	Stat.s [m] ? Stat.s [m].c1 : 0,
			STAT_COUNT2:	Stat.s [m] ? Stat.s [m].c2 : 0,
			STAT_COUNT3:	Stat.s [m] ? Stat.s [m].c3 : 0,
			PREV_MONTH:	m > Stat.f ? ` id=__sm_prev name=show_stat data-mon=${PrevMon}` : "",
			NEXT_MONTH:	m < Stat.l ? ` id=__sm_next name=show_stat data-mon=${NextMon}` : "",
			YEAR:		m.w1,
			MONTH:		f => { let d = new Date (); d.setMonth ((m >> 8 & 0x0f) - 1); return d.format (f || "mmmm") },
			ADMIN:		"".true (ADMIN),
			SELF:		"".true (SELF)
		})).swipe (
			function () { this.$("#__sm_next") && this.$("#__sm_next").click () },
			function () { this.$("#__sm_prev") && this.$("#__sm_prev").click () }
		)
		Stat.c = m
	}
	function stat_days ( r, tpl, el ) {
		let m = el ? el.dataset.mon : null
		CurMon = m ? +m : Stat.c
		let PrevMon = (CurMon >> 8 & 0x0f) == 1
			? (CurMon & 0xfff0000) - 0x10000 + (12 << 8)
			: CurMon - (1 << 8)
		let NextMon = (CurMon >> 8 & 0x0f) == 12
			? (CurMon & 0xfff0000) + 0x10000 + (1 << 8)
			: CurMon + (1 << 8)
		Modal.show ("stat_days", tpl.pattern ([{
			NUM		() { return this.$i + 1 },
			DAY		( f, l ) { return this.$rd != this.$d.getDate () ? this.$d.lang (l).format (f) : "" },
			ENTER		() { return this.$d.toTimeString ().substr (0, 8) },
			QUIT		() { return (new Date (this.$s.q * 1000)).toTimeString ().substr (0, 8) },
			TIME		() { return this.$s.t.time () },
			COUNT1		() { return this.$s.c1 },
			COUNT2		() { return this.$s.c2 },
			COUNT3		() { return this.$s.c3 },
			IP		() { return this.$s.ci [1].ip () },
			PROXY		() { return this.$s.ci [2].ip () },
			CID1		() { return ADMIN ? `<a name=compinfo data-ci=stat data-i=${this.$i}>${this.$s.ci [3]}</a>` : this.$s.ci [3] },
			CID2		() { return ADMIN ? `<a name=compinfo data-ci=stat data-i=${this.$i}>${this.$s.ci [4]}</a>` : this.$s.ci [4] },
			ANOTHER		() { return "".true (this.$rd != this.$d.getDate () ? this.$an ^= 1 : this.$an) },
			$size		() { return r.length },
			$set		( i ) { this.$rd = this.$d ? this.$d.getDate () : 0; this.$s = r [i]; this.$d = new Date (this.$s.e * 1000) },
			$an:		0,
			$rd:		0
		}], {
			PREV_MONTH:	CurMon > Stat.f ? ` id=__sd_prev name=show_stat_days data-mon=${PrevMon}` : "",
			NEXT_MONTH:	CurMon < Stat.l ? ` id=__sd_next name=show_stat_days data-mon=${NextMon}` : "",
		})).swipe (
			function () { this.$("#__sd_next") && this.$("#__sd_next").click () },
			function () { this.$("#__sd_prev") && this.$("#__sd_prev").click () }
		)
		MODER && MODER.ci ("stat", r)
	}
	function stat_param ( Param, el ) {
		let m = Modal.form ()
		Param.m = el.dataset.mon || Stat.c
		Param.d1 = m.d1 ? m.d1.value : null
		Param.d2 = m.d2 ? m.d2.value : null
	}
	function notice_edit ( tpl ) {
		let m = Modal.show ("notice_edit", tpl.tpl ()).form ()
		m.handler = m.notice.focus.bind (m.notice)
		m.handler ()
		m.notice.value = NoticeText
		NoticeMD5 = NoticeText.md5 ()
	}
	function notice_save () {
		let Notice = Modal.form ().notice.value.trim ()
		let md5 = Notice.md5 ()
		Modal.hide ()
		if (NoticeMD5 == md5)
			return
		MAIN.sendCmd (55, r => {
			NoticeMD5 = md5
			if ($("notice_txt")) {
				$("notice_txt").className = Notice.length ? "notice-txt" : ""
				$("notice_txt").innerHTML = Notice.html (50) || "&nbsp;"
			}
			if ($("notice_date")) {
				$("notice_date").innerHTML = Notice.length
					? (+r).date (NoticeDateFMT || "dd.mm.yy, HH:ii:ss")
					: ""
			}
		}, {
			profile: Profile,
			notice:  Notice
		})
	}
	function access_list_html ( tpl ) {
		return tpl.pattern ({
			PAGES: [MAIN.list (Access.PAGE_LIST, {
				TITLE	() { return this.$u ? this.$u.t : "" },
				ALLOW	() { return "".true (this.$u && this.$u.a) }
			})],
			ALBUMS: [MAIN.list (Access.ALBUM_LIST, {
				NAME	() { return this.$u ? this.$u.n : "" },
				ALLOW	() { return "".true (this.$u && this.$u.a) }
			})]
		}, {
			ACCESS_EDIT:	Access.ACCESS_EDIT
		})
	}
	function access_list ( r, tpl, el ) {
		Access = r
		if (el) {
			el.attr ("load", null)
			$("info_section_access").innerHTML = access_list_html (tpl)
			collapse (el)
		} else {
			Modal.show ("access_list", access_list_html (tpl))
		}
	}
	function access_edit ( tpl ) {
		PagesAccessSet.init ()
		AlbumsAccessSet.init ()
		let PageList = []
		let AlbumList = []
		Access.PAGE_LIST.forEach (a => {
			if (a.e) {
				PageList.push (a)
				if (a.a)
					PagesAccessSet.set (a.s)
			}
		})
		Access.ALBUM_LIST.forEach (a => {
			if (a.e) {
				AlbumList.push (a)
				if (a.a)
					AlbumsAccessSet.set (a.id)
			}
		})
		Modal.show ("access_edit", tpl.pattern ({
			PAGES: [MAIN.list (PageList, {
				TITLE	() { return this.$u ? this.$u.t : "" },
				SECTION	() { return this.$u ? this.$u.s : "" },
				ACCESS	() { return this.$u ? this.$u.a : "" },
				EDIT	() { return "".true (this.$u) }
			})],
			ALBUMS: [MAIN.list (AlbumList, {
				NAME	() { return this.$u ? this.$u.n : "" },
				ID	() { return this.$u ? this.$u.id : "" },
				ACCESS	() { return this.$u ? this.$u.a : "" },
				EDIT	() { return "".true (this.$u) }
			})]
		}))
	}
	function access_save () {
		let pas = new august_bitset
		let aas = new august_bitset
		for (let i of Modal.form ()) {
			if (i.name == "access[]") {
				if (i.checked)
					pas.set (+i.value)
			} else if (i.name == "album_access[]") {
				if (i.checked)
					aas.set (+i.value)
			}
		}
		Modal.hide ()
		if (PagesAccessSet.eq (pas) && AlbumsAccessSet.eq (aas))
			return
		MAIN.sendCmd (55, a => {
			PagesAccessSet = pas
			AlbumsAccessSet = aas
			if ($("info_section_access")) {
				Access.PAGE_LIST.forEach (a => {
					if (a.e)
						a.a = +pas.test (a.s)
				})
				Access.ALBUM_LIST.forEach (a => {
					if (a.e)
						a.a = +aas.test (a.id)
				})
				$("info_section_access").innerHTML = access_list_html (TPL.access_list)
			}
		}, {
			profile:      Profile,
			access:       pas.val ().toString (),
			album_access: aas.val ().toString ()
		})
	}
	function notebook () {
		if (INIT.NOTEBOOK)
			root.Chat.menu.notebook (0, INIT.NICK)
	}
	function edit () {
		location = `form.php?id2=${root.User.ID4.hex ()}`
	}
	function people_index () {
		location = `people.php?sess=${INIT.SESS}`
	}
	function collapse ( el ) {
		let l = el.attr ("load")
		if (el.clps && l && isSet (ACTION [l]))
			return load (ACTION [l], el)
		MAIN.collapse (el)
		if (el.clps && el.next ().attr ("name") == "photo")
			HS.hideAll ()
	}
	function load ( p, el ) {
		if (p [2]) {
			load_tpl (p [2], tpl => {
				if (!p [1])
					p [3](TPL [p [2]], el)
			})
		}
		if (!p [1])
			return
		let Param = {
			sess:    INIT.SESS,
			id:      INIT.USERID,
			profile: INIT.PROFILE,
			d:       p [1]
		}
		if (isArray (p [5]))
			p [5].forEach (p => Param [p] = el.dataset [p])
		else if (isFunction (p [5]))
			p [5](Param, el)
		MAIN.xhr ("user.data", r => {
			if (!p [2])
				return p [3](r, null, el)
			let wait = () => {
				if (!isSet (TPL [p [2]]))
					return setTimeout (wait, 100)
				p [3](r, TPL [p [2]], el)
			}
			wait ()
		}, Param)
	}
	function load_tpl ( tpl, cb ) {
		let tpl2 = []
		for (let n of isString (tpl) ? [tpl] : tpl) {
			if (!(n._ in TPL))
				tpl2.push ("info" + (n ? "-" + n.replace (/_/g, "-") : ""))
		}
		if (!tpl2.length)
			return cb (TPL)
		MAIN.loadTPL (tpl2, tpl => {
			for (let n in tpl)
				TPL [n.replace (/^info_?/, "")] = tpl [n]
			cb (TPL)
		})
	}
	function set_rank ( r, tpl ) {
		let rank = ( r, a ) => {
			return {
				RANK_NAME:		r ? r [0] : "",
				RANK_PIC:		r ? r [1] : "",
				RANK_WIDTH:		r ? r [2] : "",
				RANK_HEIGHT:		r ? r [3] : "",
				RANK_ADMIN_PROFILE:	a ? a [0] : "",
				RANK_ADMIN_NICK:	a ? a [1] : "",
				RANK_SET_DATE:		a ? a [2] : "",
				CHAT_HOST:		MAIN.Host
			}
		}
		$("rank").innerHTML = tpl.tpl (rank (r.RANK, r.RANK_ADMIN)).trim ()
	}
	function show_info ( info, tpl ) {
		info.INFO.ZN = +info.INFO.Day && +info.INFO.Month
			? +info.INFO.Day > ZBOUND [info.INFO.Month - 1]
			? +info.INFO.Month == 12
			? 1
			: +info.INFO.Month + 1
			: +info.INFO.Month
			: 0
		let M = []
		let HNDLR = new info_handler (info.INFO)
		let HTML = tpl [""].tpl ({
			SECTION:		n => tpl [n.toLowerCase ()] || ""
		}, 3).tpl ({
			"0001":			() => HNDLR.text (1),
			"0002":			() => HNDLR.text (2),
			"0003":			() => HNDLR.text (3),
			"0004":			() => HNDLR.text (4),
			"0005":			( ... a ) => HNDLR.text_param_zero (a, 5),
			"0006":			( ... a ) => HNDLR.text_param_zero (a, 6),
			"0007":			( ... a ) => HNDLR.text_param_zero (a, 7),
			"0008":			() => HNDLR.zero (8),
			"0009":			() => HNDLR.zero (9),
			"0010":			() => HNDLR.text (10),
			"0011":			() => HNDLR.text (11),
			"0012":			() => HNDLR.text (12),
			"0013":			() => HNDLR.text (13),
			"0014":			() => HNDLR.text (14),
			"0015":			() => HNDLR.text (15),
			"0016":			() => HNDLR.text (16),
			"0017":			() => HNDLR.text (17),
			"0018":			() => HNDLR.text (18),
			"0019":			() => HNDLR.text (19),
			"0020":			() => HNDLR.text (20),
			"0021":			() => HNDLR.text (21),
			"0022":			() => HNDLR.text (22),
			"0023":			() => HNDLR.text (23),
			"0024":			() => HNDLR.text (24),
			"0025":			() => HNDLR.text (25),
			"0026":			() => HNDLR.text (26),
			"0027":			() => HNDLR.text (27),
			"0028":			() => HNDLR.text (28),
			"0029":			() => HNDLR.text (29),
			"0030":			() => HNDLR.text (30),
			"0031":			() => HNDLR.text (31),
			"0032":			() => HNDLR.text (32),
			"0033":			() => HNDLR.text (33),
			"0034":			() => HNDLR.text (34),
			"0035":			() => HNDLR.text (35),
			"0036":			() => HNDLR.text (36),
			"0037":			( ... a ) => HNDLR.text_set_zero (a, 37),
			"0038":			( ... a ) => HNDLR.text_set_zero (a, 38),
			"0039":			() => HNDLR.text (39),
			"0040":			() => HNDLR.text (40),
			"0041":			() => HNDLR.text (41),
			"0042":			() => HNDLR.text (42),
			"0043":			() => HNDLR.text (43),
			"0044":			() => HNDLR.text (44),
			"0045":			() => HNDLR.text (45),
			"0046":			() => HNDLR.text (46),
			"0047":			() => HNDLR.text (47),
			SEX:			( ... a ) => HNDLR.text_param_zero (a, "Sex"),
			DAY:			() => HNDLR.zero ("Day"),
			MONTH:			( ... a ) => HNDLR.text_param_zero (a, "Month"),
			YEAR:			() => HNDLR.zero ("Year"),
			ACCESS_EDIT:		"".true (info.ACCESS_EDIT),
			ACCESS_STAT:		"".true (info.ACCESS_STAT),
			ACCESS_NICK:		"".true (info.ACCESS_NICK),
			ADMIN_PRIV:		"".true (info.ADMIN_PRIV),
			ADMIN_RANK:		"".true (info.ADMIN_RANK),
			ADMIN:			"".true (info.ADMIN),
			MODER:			"".true (info.MODER),
			SELF:			"".true (info.SELF),
			EDIT:			"".true (info.EDIT),
			ENTER:			"".true (info.ENTER),
			AUTH:			"".true (info.AUTH),
			CHECKED:		"".true (info.CHECKED),
			BLOCKED:		"".true (info.BLOCKED),
			RESTORED:		"".true (info.RESTORED),
			NEXT:			"".true (info.MODER && !info.CHECKED),
			ALBUMS:			"".true (info.ALBUM && info.ALBUM.length),
			DENY_PHOTO:		"".true (info.DENY_PHOTO),
			NO_PHOTO:		"".true (!info.PHOTO || !info.PHOTO.length),
			NOTEBOOK:		"".true (INIT.NOTEBOOK),
			SECRET_EMAIL:		"".true (info.SECRET_EMAIL),
			IP1:			info.CI1 ? (info.CI1 [1] || info.CI1 [2]). ip () : "",
			IP2:			info.CI2 ? (info.CI2 [1] || info.CI2 [2]). ip () : "",
			IP3:			info.CI3 ? (info.CI3 [1] || info.CI3 [2]). ip () : "",
			CID1_1:			info.CI1 ? info.CI1 [3] : "",
			CID2_1:			info.CI1 ? info.CI1 [4] : "",
			CID1_2:			info.CI2 ? info.CI2 [3] : "",
			CID2_2:			info.CI2 ? info.CI2 [4] : "",
			CID1_3:			info.CI3 ? info.CI3 [3] : "",
			CID2_3:			info.CI3 ? info.CI3 [4] : "",
			CID:			info.CID || "",
			COUNT_CID:		info.COUNT_CID || "",
			BACKUP:			info.BACKUP || 0,
			BACKUP1:		info.BACKUP1 || 0,
			BACKUP2:		info.BACKUP2 || 0,
			BACKUP3:		info.BACKUP3 || 0,
			BACKUP4:		info.BACKUP4 || 0,
			BACKUP5:		info.BACKUP5 || 0,
			EMAIL_SENT:		info.EMAIL_SENT || 0,
			RESTORE_DATE:		info.RESTORE_DATE || 0,
			RESTORE_BACKUP:		info.RESTORE_BACKUP || 0,
			BUSY_NICK:		info.BUSY_NICK || "",
			BUSY_PROFILE:		info.BUSY_PROFILE || "",
			NICK:			info.NICK,
			NICKID:			info.NICKID || "",
			PROFILE:		info.PROFILE || "",
			FRIENDS:		info.FRIENDS || "",
			REG_DATE:		info.REG_DATE,
			REG_TIME:		info.REG_TIME,
			ENTER_DATE:		info.ENTER_DATE || "",
			ENTER_TIME:		info.ENTER_TIME || "",
			DEL_DATE:		info.DEL_DATE || "",
			TIME:			info.TIME,
			BLOCK_REASON:		info.BLOCK_REASON || "",
			NOTICE_DATE:		info.NOTICE ? info.NOTICE [0] : "",
			NOTICE:			info.NOTICE ? HNDLR.text_v (info.NOTICE [1]) : "",
			COUNT1:			info.COUNT ? info.COUNT [0] : "",
			COUNT2:			info.COUNT ? info.COUNT [1] : "",
			COUNT3:			info.COUNT ? info.COUNT [2] : "",
			COUNT4:			info.COUNT ? info.COUNT [3] : "",
			COUNT5:			info.COUNT ? info.COUNT [4] : "",
			CHECK_PROFILE:		info.CHECK_MODER ? info.CHECK_MODER [0] : "",
			CHECK_NICK:		info.CHECK_MODER ? info.CHECK_MODER [1] : "",
			CHECK_DATE:		info.CHECK_MODER ? info.CHECK_MODER [2] : "",
			LOCK_PROFILE:		info.LOCK_MODER ? info.LOCK_MODER [0] : "",
			LOCK_NICK:		info.LOCK_MODER ? info.LOCK_MODER [1] : "",
			LOCK_NICKID:		info.LOCK_MODER ? info.LOCK_MODER [2] : "",
			LOCK_DATE:		info.LOCK_MODER ? info.LOCK_MODER [3] : "",
			VIEWS:			info.VIEWS || "",
			MY_VIEWS:		HNDLR.zero_v (info.MY_VIEWS),
			BANS:			info.BAN ? HNDLR.zero_v (info.BAN [0]) : "",
			LAST_BAN_DATE:		info.BAN ? info.BAN [1] : "",
			LAST_BAN_TIME:		info.BAN ? info.BAN [2] : "",
			REFERER_PROFILE:	HNDLR.zero_v (info.REFERER_PROFILE),
			REFERER_NICK:		info.REFERER_NICK || "",
			AUTH_FAIL:		HNDLR.zero_v (info.AUTH_FAIL),
			AVATAR:			info.AVATAR ? `<avatar><img src=${MAIN.avatar (info.AVATAR)} width=${info.AVATAR_SIZE [0]} height=${info.AVATAR_SIZE [1]} referrerpolicy=no-referrer></avatar>` : ``,
			ZODIAC:			( ... a ) => info.INFO.ZN && a [info.INFO.ZN - 1] || "",
			ZODIAC_N:		info.INFO.ZN ? info.INFO.ZN.dd () : "",
			ADDRESS:		location.hostname,
			PATH:			location.pathname.replace (/\/[^\/]+$/, ""),
			LONG_TIME:		MAIN.longTime,
			LONG_DAYS:		MAIN.longDays,
			LONG_YEARS:		MAIN.longYears,
			CHAT_HOST:		MAIN.Host,
			ID:			INIT.USERID,
			LOAD_MODULE:		n => (M.push (n.toLowerCase ()), "")
		})
		document.body.__info = true
		INFO = $("info") || document.body
		INFO.setClass ("backup", !!info.BACKUP)
		if (MAIN.$sb) {
			INFO.innerHTML = `<info-container>${HTML}</info-container>`
			SB = new MAIN.$sb (INFO.firstChild)
		} else {
			INFO.innerHTML = HTML
		}
		if (tpl.notice)
			tpl.notice.tpl ({ NOTICE_DATE: 0, DATE: ( d, f ) => NoticeDateFMT = f })
		void function ( c ) {
			if (!c)
				return
			if ((c.name || c.attr ("name")) == "collapse") {
				c.noselect ()
				if (+c.attr ("collapse"))
					collapse (c)
			} else {
				for (let el of c.children)
					arguments.callee (el)
			}
		}(INFO)
		if ($("rank"))
			set_rank (info, tpl.rank)
		albums_init (info.PHOTO, info.ALBUM, tpl.album)
		if (info.MODER || info.ADMIN_PRIV || info.ADMIN_RANK) {
			August.loadJS ("august.people.moder.js").then (() => {
				if (!MODER)
					MODER = new august_people_moder (this)
				MODER.ci ("ci", [
					null,
					{ ci: info.CI1 },
					{ ci: info.CI2 },
					{ ci: info.CI3 }
				])
			})
		}
		if (info.PHOTO && info.PHOTO.length && !HS) {
			August.loadJS ("august.highslide.js").then (() => {
				HS = new august_highslide ("people-hs-wait", "people-hs-img")
			})
		}
		for (let n of M) {
			August.loadJS (`august.people.module.${n}.js`).then (() => {
				MODULES [n] = new window [`august_people_module_${n}`](this)
			})
		}
		MAIN.$ACTION = ACTION
		MAIN.keyHandler (function ( e ) {
			let m = Modal.form ()
			e.handler ({ c: 37, f: 2 }, () => {
				if (!m && this.__info && Photo.length)
					photo_prev ()
				else if (m && m.prev)
					m.prev ()
			}, 1)
			&& e.handler ({ c: 39, f: 2 }, () => {
				if (!m && this.__info && Photo.length)
					photo_next ()
				else if (m && m.next)
					m.next ()
			}, 1)
			&& e.handler ({ c: 13, f: 2 }, () => {
				if (m && this.name == "notice")
					notice_save ()
			}, 1)
			&& e.handler ({ c: 27, f: 0 }, () => {
				if (m)
					Modal.hide ()
			}, 1)
		})
		MAIN.clickHandler (function ( a ) {
			if (a [0] && Modal.exists (a [0])) {
				if (a [4]) {
					if (isFunction (a [4]))
						a [4](this)
					else if (a [4] === true)
						a [3](TPL [a [2]], this)
				} else if (!Modal.form ()) {
					let m = Modal.show (a [0]).form ()
					m && m.handler && m.handler ()
				}
				return false
			}
			if (this.attr ("a") == "hide")
				Modal.hide ()
			load (a, this)
		})
	}
	this.getInfo = function ( param, handlers ) {
		MAIN.xhr ("people.info", info => {
			if (isString (info)) {
				if (handlers && handlers.exit)
					handlers.exit (info)
				return
			}
			document.title = info.NICK
			new Date ().setTimeZone (info.TIMEZONE)
			Profile = info.PROFILE
			NoticeText = info.NOTICE ? info.NOTICE [1] : ""
			ADMIN = info.ADMIN
			SELF = info.SELF
			INIT.SESS = info.SESS
			INIT.NICK = info.NICK
			INIT.PROFILE = info.PROFILE
			INIT.NOTEBOOK = root.Chat && root.Chat.menu && root.User.ID && info.NICK.length && !info.SELF
			MAIN.$NOW = info.NOW
			MAIN.$DIF = info.NOW - (Date.now () / 1000 | 0)
			let Sec = {
				album:		!!(info.ALBUM && info.ALBUM.length),
				photo:		!!(info.PHOTO && info.PHOTO.length),
				section1:	!!info.INFO,
				section2:	!!info.INFO,
				section3:	!!info.INFO,
				notice:		!!info.NOTICE,
				nicklist:	!!info.ACCESS_NICK,
				access:		!!(info.AUTH && info.ACCESS_FORM),
				system:		!!info.REG_DATE,
				compinfo:	!!info.CI1,
				moder:		!!(info.MODER || info.ADMIN_PRIV || info.ADMIN_RANK)
			}
			load_tpl ([""], tpl => {
				let Loads = ["rank"]
				tpl [""].tpl ({
					SECTION: n => {
						n = n.toLowerCase ()
						if (!isSet (Sec [n]))
							Loads.push (n)
					}
				}, 3)
				for (let n in Sec) {
					if (Sec [n])
						Loads.push (n)
				}
				load_tpl (Loads, tpl => {
					if (handlers && handlers.ok)
						handlers.ok (() => show_info.call (this, info, tpl), info)
					else
						show_info.call (this, info, tpl)
				})
			})
		}, Object.assign ({
			sess:	INIT.SESS,
			id:	INIT.USERID,
			id2:	INIT.ID2
		}, param))
	}
	this.info = function () {
		return INFO
	}
	this.modal = function () {
		return Modal
	}
	this.load = function ( ... a ) {
		load (... a)
	}
	this.loadTPL = function ( ... a ) {
		load_tpl (... a)
	}
	this.sb = function () {
		return SB
	}

	const NICK_SORT = new Enum ('NICK', 'DATE', 'TIME')
	const ZBOUND = [20, 20, 20, 20, 20, 21, 22, 23, 23, 23, 22, 21]
	const MODULES = {}

	let INFO = null
	let TPL = {}
	let CurAlbum = -1
	let CurPhoto = -1
	let Album = null
	let Photo = null
	let PhotoSec = null
	let PhotoPlace = null
	let PhotoIMG = null
	let PhotoIMGShown = 0
	let PhotoHeight = 0
	let Profile = 0
	let NoticeText = ""
	let NoticeMD5 = ""
	let NoticeDateFMT = ""
	let Access = null
	let CurMon = 0
	let Stat = null
	let NickList = null
	let NickSort = NICK_SORT.NICK
	let GroupList = null
	let MODER = null
	let ADMIN = 0
	let SELF = 0
	let HS = null
	let SB = null
	let Modal = new modal
	let PagesAccessSet = new august_bitset
	let AlbumsAccessSet = new august_bitset

	const ACTION = {
		create_group:	["create_group", "", "create_group", create_group],
		delete_group:	["delete_group", "", "delete_group", delete_group, true],
		add_to_group:	["add_to_group", "", "add_to_group", add_to_group, true],
		group:		["", "group", "group", group, 0, ["group"]],
		show_grouplist:	["", "grouplist", "grouplist_table", grouplist],
		show_nicklist:	["", "nicklist", "nicklist_table", nicklist],
		show_refs:	["refs_list", "refs", "refs", refs_list],
		show_viewers:	["", "viewers", "viewers", viewers_list, 0, ["max", "page"], 1],
		show_stat:	["stat_panel", "stat", "stat", stat_month_init, stat_month],
		show_stat_days:	["", "stat_days", "stat_days", stat_days, 0, stat_param],
		notice_edit:	["notice_edit", "", "notice_edit", notice_edit],
		notice_save:	notice_save,
		show_access:	["", "access", "access_list", access_list],
		access_edit:	["access_edit", "", "access_edit", access_edit],
		access_save:	access_save,
		auth_fail_log:	["", "fail", "fail", auth_fail, 0, ["mon"], 1],
		create_group_ok:create_group_ok,
		delete_group_ok:delete_group_ok,
		edit_group_ok:	edit_group_ok,
		add_to_group_ok:add_to_group_ok,
		sort_nicklist:	sort_nicklist,
		photo_prev:	photo_prev,
		photo_next:	photo_next,
		photo_thumb:	photo_thumb,
		show:		show_sect,
		album:		album,
		notebook:	notebook,
		info_edit:	edit,
		collapse:	collapse,
		index:		people_index,
		close:		Modal.hide.bind (Modal),
		cancel:		Modal.hide.bind (Modal)
	}

	INIT.USERID = root.User ? root.User.ID : ""

	this.EXIT = {
		exit ( r ) {
			if (PhotoPlace && PhotoPlace.touch)
				PhotoPlace.touch.done ()
			if (INFO)
				INFO.innerHTML = ""
			let idCSS = MAIN.idCSS ("info")
			if (idCSS)
				idCSS.disabled = true
			if (r == "FORM")
				MAIN.run ("form")
			else
				MAIN.run ("index", r)
		}
	}

	this.getInfo (param || {
			profile: INIT.PROFILE,
			nickid:  INIT.NICKID != "0" ? INIT.NICKID : "",
			nick:    INIT.NICK
		},
		Object.assign (this.EXIT, handlers || {})
	)
}
