//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.mps.form.js


function august_mps_form ( MPS ) {
	function smiles () {
		let handler = el => {
			if (el.dataset.a == "page")
				page (+el.dataset.p)
			else if (el.dataset.a == "group")
				group (el.value)
		}
		let load = cb => {
			if (Smiles)
				return cb ()
			if (Lock)
				return
			Lock = 1
			MPS.xhr ("cfg.smiles", smiles => {
				Lock = 0
				if (!smiles)
					return MPS.notice ("ERROR")
				Smiles = smiles
				MPS.load_tpl ("form-smiles", tpl => {
					if (!tpl)
						return MPS.notice ("ERROR")
					Smiles.Name = {}
					Smiles.List.forEach (( s, i ) => {
						let g = s [2].b2
						if (!isSet (Smiles.Group [`$${g}`]))
							g = 0
						if (!isSet (Groups [g]))
							Groups [g] = []
						Groups [g].push (s)
						Smiles.Name [s [0]] = i
					})
					if (Group == -1 || !isSet (Groups [Group])) {
						for (let g in Smiles.Group) {
							Group = g.substr (1)
							if (isSet (Groups [Group]))
								break
						}
					}
					if (!$Form.$("mps-smiles") || !tpl.form_smiles)
						return cb ()
					$Form.$("mps-smiles").innerHTML = August.html.mess (tpl.form_smiles.tpl ({
						SMILES		( a, t ) { OnPage = a ? Math.max (20, a) : 100; TypeTable = t; return "<div id=smiles></div>" },
						SMILES_TABLE	( a ) { return this.SMILES (a, 1) },
						GROUP_NAME:	`<span id=sm_group_name_${MPS.MPS.SID}></span>`
					}).tpl ({
						GROUPS_MENU:	menu_groups,
						MENU:		`<span id=sm_menu_${MPS.MPS.SID}></span>`
					}, 1))
					menu ()
					page (0)
					cb ()
				})
			}, "/" + MPS.cfg.SmilesUp, 1)
		}
		let menu = () => {
			let Len = GroupMenu ? Groups [Group].length : Smiles.List.length
			let html = ""
			if (Len > OnPage + (OnPage >> 2)) {
				let n = (Len + OnPage - (OnPage >> 2)) / OnPage | 0
				for (let i = 0; i < n; i++)
					html += `<a name=smile-panel data-a=page data-p=${i}>${i + 1}</a>`
			}
			$0($Form.$(`span#sm_menu_${MPS.MPS.SID}`), html)
		}
		let group = g => {
			if (g == Group)
				return
			Page = -1
			Group = g
			$Form.$(`select#mps_sm_group_${MPS.MPS.SID}`).value = g
			menu ()
			page (0)
			$0($Form.$(`span#sm_group_name_${MPS.MPS.SID}`), Smiles.Group [`$${g}`])
		}
		let menu_groups = () => {
			GroupMenu = Groups && Groups.length > 1
			if (!GroupMenu)
				return ""
			let opt = ""
			for (let g in Smiles.Group) {
				let id = g.substr (1)
				if (isSet (Groups [id]))
					opt += `<option value=${id}>${Smiles.Group [g]}`
			}
			return `<select name=smile-panel data-a=group id=mps_sm_group_${MPS.MPS.SID}>${opt}</select>`
		}
		let page = p => {
			if (p == Page)
				return
			let Len = GroupMenu ? Groups [Group].length : Smiles.List.length
			let Start = 0
			let End = Len
			if (Len > OnPage + (OnPage >> 2)) {
				let n = (Len + OnPage - (OnPage >> 2)) / OnPage | 0
				if (p > n)
					return
				let a = $Form.all ("a[data-a=page]")
				if (Page != -1)
					a [Page].className = ""
				a [p].className = "c"
				Start = OnPage * p
				End = Start + OnPage + (OnPage >> 2) <= Len ? Start + OnPage : Len
			} else if (p) {
				return
			}
			Page = p
			let html = ""
			let max_w = 0
			let max_h = 0
			if (TypeTable) for (let p = Start; p < End; p++) {
				let s = GroupMenu ? Groups [Group][p] : Smiles.List [p]
				let w = s [2].b0
				let h = s [2].b1
				if (max_w < w)
					max_w = w
				if (max_h < h)
					max_h = h
			}
			for (let p = Start; p < End; p++) {
				let s = GroupMenu ? Groups [Group][p] : Smiles.List [p]
				let w = s [2].b0
				let h = s [2].b1
				html += August.html.img (
					`@/smiles/${s [1].smile_fn ()}`,
					w, h, 0, "", 0, 0, MPS.cfg.smLeft + s [0] + MPS.cfg.smRight, "",
					TypeTable
						? `padding: ${max_h - h >> 1}px ${max_w - w >> 1}px ${max_h - h + 1 >> 1}px ${max_w - w + 1 >> 1}px`
						: ``,
					"smile"
				)
			}
			$0($Form.$("div#smiles"), html)
			$Mess.focus ()
		}
		let smiles = s => {
			return s.replace (RE, ( $0, $1 ) => {
				let idx = Smiles.Name [$1]
				if (!isSet (idx))
					return $0
				let sm = Smiles.List [idx]
				return "\x11??x?\x13???\x10".format (
					sm [1].smile_fn ().replace (/\.(...)$/, "$1"),
					sm [2].b0,
					sm [2].b1,
					MPS.cfg.smLeft,
					$1,
					MPS.cfg.smRight
				)
			})
		}
		let is_smile = s => {
			return RE.test (s)
		}
		let text = s => {
			return s.replace (August.html.SMILE_RE, "$6")
		}
		let show = () => {
			if (Smiles)
				$Form.setClass ("smiles")
			else
				load (show)
		}

		let Smiles = null
		let Groups = []
		let Page = -1
		let Group = -1
		let GroupMenu = 0
		let OnPage = 100
		let TypeTable = 0
		let Lock = 0
		let RE = new RegExp (
			`${MPS.cfg.smLeft.escapeRegExp ()}([0-9a-zA-Zа-яА-ЯёЁ_]+)${MPS.cfg.smLeft.escapeRegExp ()}`,
			"g"
		)

		return { show, text, load, smiles, is_smile, handler }
	}
	function color_picker ( cb ) {
		let show = btn => {
			if (cp && cp.setClass ("show")) {
				let l = btn.offsetLeft - (cp.offsetWidth - btn.offsetWidth) / 2
				let p = cp.offsetParent
				cp.pos (l.clamp (10, p.offsetWidth - cp.offsetWidth - 10), btn.offsetTop + btn.offsetHeight)
				cp.focus ()
			}
		}
		let hide = () => {
			if (cp)
				cp.setClass ("show", 0)
		}

		let cp = MPS.MPS.root.$("mps-colorpicker")
		if (cp) {
			let pcr = cp.append ("clr-pcr")
			cp.tabIndex = -1
			cp.dataset.bb = "color"
			cp.dataset.colorset.split (":").forEach (c => {
				c = c.trim ()
				if (/^#[0-9a-fA-F]{6}$/.test (c)) {
					let s = pcr.append ("span")
					s.s ({ backgroundColor: c })
					s.dataset.color = c
				}
			})
			cp.on ("click", function ( e ) {
				if (e.$.dataset.bb) {
					cp.dataset.bb = e.$.dataset.bb
				} else if (e.$.dataset.color) {
					cp.dataset.a = e.$.dataset.color
					cb (cp)
				}
				e.stop ()
			}).on ("blur", hide)
		}

		return { show, hide }
	}
	function speech2text () {
		function start () {
			if (Speech)
				return
			Speech = new SpeechRecognition
			Speech.continuous = true
			Speech.interimResults = true
			Speech.lang = "ru-RU"
			Speech.onstart = e => {
				lock (1)
			}
			Speech.onend = e => {
				stop ()
			}
			Speech.onerror = e => {
				MPS.notice (`ERROR_${e.error._.toUpperCase ()}`)
			}
			Speech.onresult = e => {
				if (!e.results)
					return Speech.stop ()
				let t = ""
				let f = e.results [e.resultIndex].isFinal
				let s = $Mess.selectionStart
				for (let i = e.resultIndex; i < e.results.length; i++)
					t += e.results [i][0].transcript
				insert (t)
				if (!f)
					$Mess.setSelectionRange (s, s + t.length)
				$Mess.scrollTop = $Mess.scrollHeight
			}
			Speech.start ()
		}
		function stop () {
			if (!Speech)
				return
			$Mess.focus ()
			Speech.stop ()
			Speech = null
			lock (0)
		}
		function lock ( v ) {
			$Mess.lock = v
			$Mess.setClass ("speech", v)
		}
		function toggle () {
			if (Speech)
				stop ()
			else
				start ()
		}

		let Speech = null
		let d = $Mess.create ("div", { className: "text" })
		d.append ($Mess.replace (d))
		d.append ("a", { className: "speech", name: "speech" })

		return { toggle, stop }
	}
	function action ( a, el ) {
		if ($ACTION [a])
			$ACTION [a](el && el.dataset && +el.dataset.m || 0)
	}
	function handler ( e ) {
		let el = e.$
		switch (e.type) {
			case "click":
				if (el.is ("MPS-BB-BTN")) {
					return panel (el)
				} else if (el.name == "send") {
					send ()
				} else if (el.name == "cancel") {
					MPS.esc_queue_exe ()
				} else if (el.name == "preview") {
					preview ()
				} else if (el.name == "smile") {
					insert (` ${el.title} `)
				} else if (el.name == "smile-panel") {
					$Smiles.handler (el)
					return e.stop ()
				} else if (el.name == "upload") {
					upload (el)
				} else if (el.name == "speech") {
					$Speech.toggle ()
					return e.stop ()
				}
				break
			case "change":
				let c = el.dataset.bb
				if (c && el.selectedIndex) {
					format (`[${c}=${el.options [el.selectedIndex].text}]`, `[/${c}]`)
					el.selectedIndex = 0
				} else if (el.name == "trans") {
					$Form.setClass ("trans", $Trans = el.checked)
					$Mess.focus ()
				} else if (el.name == "smile-panel") {
					$Smiles.handler (el)
				} else if (el == $File) {
					insert_attach (el.files)
					el.value = ""
				}
				break
			case "mouseover":
				if (el.is ("MPS-BB-BTN")) {
					el.setClass (
						"left",
						2 * el.offsetLeft + el.offsetWidth > el.offsetParent.offsetWidth
					)
				}
				break
		}
	}
	function panel ( el ) {
		if ($Mess.lock)
			return

		let m = c => (c = c.up (el => el.is ("MPS-MESS") && el.dataset.m)) ? +c.dataset.m : 0
		let list = t => `[*]${t.replaceAll ("\n", "\n[*]")}`

		let c = el.dataset.bb
		let a = el.dataset.a
		let e = el.dataset.e
		let n = el.dataset.n ? "\n" : ""
		if (c) {
			if (c == "quote" && is_comment ()) {
				let s = MPS.win.getSelection ()
				if (s.rangeCount && s.type == "Range") {
					let idx = m (s.getRangeAt (0).commonAncestorContainer)
					if (idx)
						return quote (idx), false
				}
			}
			format (
				e ? `[${c}][/${c}]${n}` : `[${c}${a ? `=${a}` : ""}]${n}`,
				e ? "" : `${n}[/${c}]${n}`,
				{ list }[c]
			)
			return false
		} else switch (el.dataset.func) {
		 	case "color":
		 		$ColorPicker.show (el)
				return true
		 	case "smiles":
				$Smiles.show ()
				break
			case "attach":
				attach ()
				break
			case "help":
				help ()
				break
			case "undo":
				undo ()
				break
			case "redo":
				redo ()
				break
			case "close-tag":
				if (new RegExp (`[^]*\\[(\\w+)[^\\]]*\\][^]*?[^]{${$Mess.value.length - $Mess.selectionStart}}$`).test ($Mess.value))
					insert (`[/${RegExp.$1}]`)
				break
		}
		$Mess.focus ()
		return true
	}
	function upload ( img, cb ) {
		img.onclick = function () {
			August.upload.click (function () {
				August.upload.preloader ().upload (this, r => {
					if (!isObject (r)) {
					} else if (r.e) {
						MPS.notice (r.e)
					} else {
						img.src = `//${MPS.HOST}/tmp/${r.t}`
						img.width = r.w
						img.height = r.h
						cb && cb ()
					}
				}, {
					id:	MPS.MPS.User.ID
				}, "upload")
			}, null, "image/webp, image/jpeg, image/png, image/gif")
		}
	}
	function insert_attach ( fs ) {
		let attach = f => {
			let hash = f.hash ()
			let idx = $AttachHash [hash]
			if (!idx) {
				$AttachCount++
				$Attachments.push (f)
				$AttachHash [hash] = $Attachments.length
				idx = $Attachments.length
			}
			insert (`[attach]${idx}[/attach]`)
		}
		if ($Mess.lock)
			return
		for (let f of fs) {
			if (!/^image\/(gif|jpg|jpeg|pjpeg|png|x-png|webp|bmp)$/.test (f.type))
				return MPS.notice ("ERROR_FILE_TYPE", "err", { FILE: f.name })
			if (RegExp.$1 == "bmp")
				August.img2webp (f, `${f.name}.webp`, attach, busy)
			else if (f.size > MPS.cfg.afs * 1024)
				return MPS.notice ("ERROR_FILE_SIZE", "err", { FILE: f.name })
			else
				attach (f)
		}
	}
	function attach () {
		($File = $File || $Form.append ("input", {
			type:     "file",
			accept:   "image/*",
			multiple: true
		})).click ()
	}
	function format ( o, c, h, so ) {
		if ($Mess.lock)
			return
		$Mess.focus ()
		let s = $Mess.value.substring (0, $Mess.selectionStart)
		let e = $Mess.value.substring ($Mess.selectionEnd, $Mess.textLength)
		let t = $Mess.value.substring ($Mess.selectionStart, $Mess.selectionEnd)
		let l = t.length
		if (so && !l)
			return insert (o)
		if (h)
			t = h (t)
		set_text (
			$Mess,
			[s, o, t, c, e],
			l && !h
				? $Mess.selectionEnd + o.length + c.length
				: $Mess.selectionStart + o.length + t.length
		)
	}
	function insert ( text ) {
		$Mess.focus ()
		let s1 = $Mess.value.substr (0, $Mess.selectionStart)
		let s2 = $Mess.value.substr ($Mess.selectionEnd)
		set_text ($Mess, [s1, text, s2], $Mess.selectionStart + text.length)
	}
	function set_text ( inp, val, cur ) {
		store_hitory ()
		let l = inp.scrollLeft
		let t = inp.scrollTop
		let w2 = inp.clientWidth >> 1
		inp.value = val.join ("")
		inp.setSelectionRange (cur, cur)
		let r = (val [0].length - val [0].search (/\s[^\s]*$/) - 1) * 10 - l - w2
		let d = Math.abs (r) < w2 ? 0 : r < 0 ? w2 + r : r - w2
		inp.scrollLeft = l + (d ? d > 0 ? d + 2 : d - 10 : 0)
		inp.scrollTop = t
	}
	function set_class ( el, cn ) {
		if (el)
			el.className = cn
	}
	function busy () {
		$Form.setClass ("form-busy")
	}
	function undo () {
		if ($History.isFirst ())
			return
		set_class ($Redo, "")
		let h = $History.prev ($History.isLast () ? { m: $Mess.value, c: $Mess.selectionStart } : void 0)
		$Mess.value = h.m
		$Mess.setSelectionRange (h.c, h.c)
		if ($History.isFirst ())
			set_class ($Undo, "inactive")
	}
	function redo () {
		if ($History.isLast ())
			return
		set_class ($Undo, "")
		let h = $History.next ()
		$Mess.value = h.m
		$Mess.setSelectionRange (h.c, h.c)
		if ($History.isLast ())
			set_class ($Redo, "inactive")
	}
	function store_hitory () {
		$LastChar = 0
		$History.setLast ()
		$History.put ({ m: $Mess.value, c: $Mess.selectionStart })
		set_class ($Undo, "")
		set_class ($Redo, "inactive")
	}
	function is_edit () {
		return $Mode & $MODE.EDIT
	}
	function is_comment () {
		return $Mode & $MODE.COMMENT
	}
	function is_preview () {
		return $Mode & $MODE.PREVIEW
	}
	function mode () {
		return $Mode
	}
	function preview_mess () {
		return $PreviewMess
	}
	function attachments ( i ) {
		return $Attachments [i - 1]
	}
	function preview () {
		let preview = () => {
			let form = $Mess.form
			let now  = Date.now () / 1000 | 0
			let edit = is_edit () ? $OrigMess : null
			let mess = {
				id: edit ? edit.id : 0,
				cc: 0,
				u: edit ? edit.u : { p: 0, n: MPS.MPS.User.Nick || (form.name.value || "").htmlEntities () || "&nbsp;", a: MPS.MPS.User.Avatar },
				d: edit ? edit.d : now,
				t: form.title ? $Smiles.smiles (form.title.value.htmlEntities ()) : "",
				m: $Smiles.smiles (MPS.TF.HTML & MPS.cfg.tf ? form.mess.value : form.mess.value.htmlEntities ("<>")),
				e: form.email ? form.email.value : "",
				w: form.www ? form.www.value : "",
				q: form.icq ? form.icq.value : "",
				f1: form.field1 ? $Smiles.smiles (form.field1.value) : "",
				f2: form.field2 ? $Smiles.smiles (form.field2.value) : "",
				f3: form.field3 ? $Smiles.smiles (form.field3.value) : "",
				ei: edit ? {
					u: { p: MPS.MPS.User.Profile, n: MPS.MPS.User.Nick },
					d: now,
					c: edit.ei && edit.ei.u.p == MPS.MPS.User.Profile
						? edit.ei.c + 1
						: 1
					}
					: void 0,
				r: edit ? edit.r : 0,
				a: edit ? edit.a : [],
				aq: edit ? edit.aq : $Mess.aq,
				vw: edit ? edit.vw : 0,
				v: false,
				f: -1,
				_v: 1
			}
			if (!is_comment ()) {
				mess.idx = 0
				$PreviewMess = mess
			} else if ($PreviewMess) {
				$PreviewMess.c.last () = mess
			} else {
				$PreviewMess = $OrigMess
				$PreviewMess.ccc = $PreviewMess.cc
				$PreviewMess.cc = 0
				if ($PreviewMess.c)
					$PreviewMess.c.push (mess)
				else
					$PreviewMess.c = [mess]
			}
			$Mode |= $MODE.PREVIEW
			$Mess.focus ()
			MPS.show_text ([$PreviewMess])
			MPS.set_class ("form", 0)
			MPS.set_class ("preview", 1)
			MPS.SB.on ()
			if (!is_comment ())
				MPS.SB.scrollToSmooth (MPS.MPS.root)
		}

		if ($Smiles.is_smile ($Mess.value))
			$Smiles.load (preview)
		else
			preview ()
	}
	function quote ( idx ) {
		let m = c => {
			for (; c; c = c.parentElement) {
				if (c.id == `mps_m_${MPS.MPS.SID}_${mess.id}`)
					return 1
			}
			return 0
		}
		let s = () => {
			let s = MPS.win.getSelection ()
			if (s.rangeCount && s.type == "Range" && m (s.getRangeAt (0).commonAncestorContainer))
				return s.toString ()
			return $Smiles.text (MPS.clear (mess.m))
		}

		let mess = MPS.get_mess (idx)
		let text = s ().htmlEntityDecode ().replace ($ATTACH_RE, ( $0, $1, $2 ) => mess.a [$2] ? `[attach${$1 || ""}]${$2}:${mess.id}[/attach]` : $0)
		insert (`[quote=${$Smiles.text (mess.u.n)}, ${mess.d.date ("d mmmm yyyy, HH:ii:ss")}]\n${text}\n[/quote]\n`)
		Object.assign ($Mess.aq, mess.aq || {}, { [mess.id]: mess.a || {} })
		if (!$Mode)
			form ()
	}
	function edit ( idx ) {
		let set = ( f, v ) => f && (f.value = v ? $Smiles.text (v).replace (/[\03\04\05\06]/g, "").htmlEntityDecode () : "")
		let mess = MPS.get_mess (idx)
		let Form = $Mess.form
		set (Form.title, mess.t)
		set (Form.mess, mess.m)
		set (Form.field1, mess.f1)
		set (Form.field2, mess.f2)
		set (Form.field3, mess.f3)
		set (Form.email, mess.e)
		set (Form.www, mess.w)
		set (Form.icq, mess.q)
		$OrigMess = mess
		$Mode = $MODE.EDIT
		$Form.className = "edit"
		$Attachments.length = mess.an || 0
		form ()
	}
	function comment ( idx ) {
		$OrigMess = MPS.get_mess (idx)
		$Mode = $MODE.COMMENT
		$Form.className = "comment"
		form ()
	}
	function form () {
		if (!$Mess)
			return
		$Scroll = MPS.SB.scroll
		MPS.set_class ($Mode ? "preview" : "form", 1)
		MPS.esc_queue ({ a: cancel, h: { module: "form", args: ["cancel"] }})
		if ($Mode)
			$Mode |= $MODE.PREVIEW, MPS.show_text ([$OrigMess])
		else
			$Mode = $MODE.WRITE, $Form.className = "form"
		if ($Form.first ().title)
			$Form.first ().title.focus ()
		else
			$Mess.focus ()
		if ($Mess.form.trans) {
			$Mess.form.trans.checked = $Trans
			$Form.setClass ("trans", $Trans)
		}
		if ($Mode == $MODE.WRITE)
			MPS.SB.off ()
		$Form.calc_height ()
	}
	function cancel () {
		if (!$Mode)
			return true
		MPS.set_class ("form", 0)
		MPS.set_class ("preview", 0)
		$Form.className = ""
		let p = is_preview ()
		let Form = $Mess.form
		let Text = { text: 1, textarea: 1, password: 1 }
		for (let f of Form)
			Text [f.type] && (f.value = "")
		if (Form.ar)
			Form.ar.value = 0
		if (Form.aw)
			Form.aw.value = 0
		if (is_comment () && $PreviewMess) {
			$PreviewMess.cc = $PreviewMess.ccc
			if ($PreviewMess.c.length == 1)
				$PreviewMess.c = null
			else
				$PreviewMess.c.length--
		}
		if ($PreviewMess)
			MPS.cleanup_text ()
		$Mode = $AttachCount = 0
		$OrigMess = $PreviewMess = null
		$Attachments.clear ()
		$AttachHash = {}
		$Mess.aq = {}
		$Mess.setHeight (null)
		$History.clear ()
		$Speech && $Speech.stop ()
		MPS.SB.on ()
		if (p) {
			MPS.show_text ()
			MPS.SB.scrollTo ($Scroll)
		}
	}
	function help () {
		MPS.HelpText.show ("mps-bbcode", "bbcode", "bbcode", $Mess.focus.bind ($Mess))
	}
	function send () {
		if ($Mess.sending)
			return
		$Mess.sending = 1
		let Form = $Mess.form
		let Text = { text: 1, textarea: 1 }
		let Data = { sess: MPS.cfg.SessID }
		for (let f of Form)
			Text [f.type] && (Data [f.name] = f.value)
		if (Form.ar && $Mode & $MODE.WRITE)
			Data.ar = Form.ar.value
		if (Form.aw && $Mode & $MODE.WRITE)
			Data.aw = Form.aw.value
		if (Form.pass && Form.pass.value)
			Data.pass = Form.pass.value.crypt (MPS.cfg.PassKey)
		else if (!MPS.MPS.User.Profile)
			Data.key = MPS.cfg.PassKey.md5 ()
		if (is_comment ())
			Data.comment = $OrigMess.id
		else if (is_edit ())
			Data.edit = $OrigMess.id
		if ($AttachCount) {
			let Form = new FormData, c = 0
			for (let n in Data)
				Form.append (n, Data [n])
			let an = {}
			$ATTACH_RE.reset ()
			for (let r; r = $ATTACH_RE.exec ($Mess.value); an [r [2]] = 1);
			$Attachments.forEach (( a, i ) => {
				if (an [i + 1])
					Form.append (`attach${i + 1}`, a), c++
			})
			if (c)
				Data = Form
		}
		MPS.xhr ("mps.send", r => {
			delete $Mess.sending
			if (!r)
				return MPS.notice ("ERROR")
			MPS.cfg.PassKey = r.pass_key
			if (r.error) {
				MPS.notice (r.error)
				$Mess.form [r.focus]?.focus ()
				return
			}
			if (r.id)
				MPS.reload (r)
			MPS.notice (r.id ? "OK1" : "OK2", "")
			cancel ()
		}, Data)
	}
	function init ( cb ) {
		MPS.load_tpl (["form", "form-panel", "form-notice"], tpl => {
			if (!tpl)
				return MPS.notice ("ERROR")
			let Container = MPS.MPS.root.$("mps-form-container")
			$Form = Container
				? Container.append ("mps-form")
				: MPS.MPS.root.$("mps-body").insert ("mps-form", MPS.MPS.root.$("mps-text").next ())
			$Form.innerHTML = "<form class=form>?</form>".format (tpl.form.tpl ({
				MPS_TITLE:	MPS.cfg.title,
				MAX_LEN:	MPS.cfg.ml,
				PROFILE:	"".true (MPS.MPS.User.Profile),
				ADMIN:		"".true (MPS.MPS.User.Admin),
				MODER:		"".true (MPS.MPS.User.Moder),
				OWNER:		"".true (MPS.MPS.User.Owner),
				SMILES:		"<mps-smiles></mps-smiles>",
				PANEL:		"<mps-panel></mps-panel>",
				COUNT:		"<mps-count>0</mps-count>",
				COUNTDOWN:	"<mps-count data-down=1>0</mps-count>",
				COLLAPSE:	"<mps-clps-btn data-a=collapse data-b=mps-collapse></mps-clps-btn>",
				SWITCH:		( ... args ) => `<mps-switch ${args.map (( a, i ) => `text${i + 1}='${a.htmlEntities ()}'`).join (" ")}></mps-switch>`,
				GROUPLIST:	tpl => {
					if (!MPS.cfg.gl || !MPS.cfg.gl.length)
						return ""
					let l = {}
					for (let g of MPS.cfg.gl)
						l [-g.id] = tpl ? tpl.tpl ({ GROUP_NAME: g.n, GROUP_COUNT: g.c }) : g.n
					return JSON.stringify (l)
				}
			}))
			$Mess = $Form.first ().mess
			if (!$Mess)
				return MPS.notice ("ERROR")

			MPS.add_notice (tpl.form_notice)
			let AttachAllow = MPS.MPS.User.Priv.test (46)
			let Keys = []
			let Panel = $Form.$("mps-panel")
			if (Panel) {
				let tf = {}
				for (let n in MPS.TF)
					tf [n] = "".true (MPS.TF [n] & MPS.cfg.tf)
				tf.ATTACHMENT = "".true (AttachAllow)
				Panel.innerHTML = tpl.form_panel.tpl (tf)
				for (let el of Panel.all ("mps-bb-btn")) {
					let k = el.dataset.key
					if (k && k.length > 1) {
						let f = k [0] == '^' ? 2 : k [0] == '~' ? 1 : 0
						if (f) {
							k = k.substr (1)
							Keys.push ({ k, f, el })
							let tt = el.attr ("tooltip")
							if (tt)
								el.attr ("tooltip", `${tt} (${["", "Alt", "Ctrl"][f]}+${k.toUpperCase ()})`)
						}
					}
				}
			}
			$ColorPicker = new color_picker (panel)
			$Mess.on ("keypress", function ( e ) {
				let r = e.handler ([
					{ k: '\'', f: 0 },
					{ k: '"', f: 4 },
					{ k: '`', f: 0 },
					{ k: '[', f: 0 },
					{ k: '{', f: 4 },
					{ k: '(', f: 4 },
					{ k: '<', f: 4 }
				], c => {
					let cl = { '[': ']', '{': '}', '(': ')', '<': '>' }
					format (c.k, cl [c.k] || c.k, null, 1)
				})
				if (!r || ($Trans && !August.translit (e, this)))
					e.stop ()
			}).on ("keydown", function ( e ) {
				let r = e.handler ({ c: 90, f: 2 }, undo)
					&& e.handler ({ c: 90, f: 6 }, redo)
					&& e.handler ([
						{ c: 13, f: 0 },
						{ c: 32, f: 0 },
						{ c: 9, f: 0 },
						{ c: 8, f: 0 },
						{ c: 8, f: 2 },
						{ c: 8, f: 4 },
						{ c: 46, f: 0 },
						{ c: 46, f: 2 },
						{ c: 46, f: 4 }
					], () => {
						if ($LastChar != e.keyCode) {
							store_hitory ()
							$LastChar = e.keyCode
						}
						if (e.keyCode == 9) {
							insert ("\t")
							e.preventDefault ()
						}
					}, true)
					&& e.handler (Keys, c => panel (c.el))
				if (r && !(e.altKey || e.ctrlKey || e.shiftKey) && e.keyCode > 32) {
					$LastChar = 0
					if ($History.isFirst ())
						store_hitory ()
				}
			}).on ("paste", function ( e ) {
				let fs = e.clipboardData.files
				if (!fs.length)
					return store_hitory ()
				if (!AttachAllow)
					return
				August.img2webp (
					fs [0],
					`paste_${++$PasteCount}_${Date.now ()}`,
					f => insert_attach ([f]),
					busy
				)
			})
			MPS.MPS.root.on ("dragstart dragover drop", e => {
				if (!$Mode)
					return
				e.stop ()
				let aa = MPS.MPS.User.Priv.test (46)
				if (e.type == "dragover")
					e.dataTransfer.dropEffect = aa ? "copy" : "none"
				else if (e.type == "drop" && aa)
					insert_attach (e.dataTransfer.files)
			})
			$Mess.aq = {}
			$Form.noselect ()
			$Form.on ("click change mouseover", handler)
			let Count = $Form.$("mps-count")
			if (Count) {
				let c = () => {
					Count.innerHTML = Count.dataset.down
						? MPS.cfg.ml - $Mess.value.length
						: $Mess.value.length
					MPS.win.setTimeout (c, 333)
				}
				c ()
			}
			if ($Mess.form.name)
				$Mess.form.value = MPS.MPS.User.Nick || ""
			$Undo = $Form.$("mps-bb-btn[data-func=undo]")
			$Redo = $Form.$("mps-bb-btn[data-func=redo]")
			set_class ($Undo, "inactive")
			set_class ($Redo, "inactive")
			$Mess.form.onsubmit = e => e.stop ()
			if ($SPEECH_OK)
				$Speech = new speech2text
			$Form.calc_height = function () {
				if (!$Mode || is_preview ())
					return
				MPS.win.cancelAnimationFrame (this.ts)
				this.ts = MPS.win.requestAnimationFrame (() => {
					$Mess.display ("none")
					let h = $Mess.form.offsetHeight
					$Mess.display ("")
					let p = ["paddingTop", "borderTopWidth", "paddingBottom", "borderBottomWidth"].reduce (( a, n ) => a + $Form.getStyle (n), 0)
					this.prop ("--height", $Form.offsetHeight - p).prop ("--form-height", h)
				})
			}
			cb && cb ()
		})
	}

	MPS.Event.on ("keydown", e => {
		if (!$Mode)
			return
		e.handler ({ c: 112, f: 0 }, help)
		&& e.handler ({ c: 13, f: 2 }, send)
		&& e.handler ({ c: 13, f: 1 }, preview)
	}).on ("resize", e => {
		$Form.calc_height ()
		if ($ColorPicker)
			$ColorPicker.hide ()
	})

	const SpeechRecognition = MPS.win.SpeechRecognition || MPS.win.webkitSpeechRecognition
	const $SPEECH_OK = MPS.win.location.protocol == "https:" && !!SpeechRecognition && !MPS.MPS.MOBILE
	const $ATTACH_RE = /\[attach(=.+?)?\](\d+)\[\/attach\]/gi
	const $MODE = {
		WRITE:		1,
		EDIT:		2,
		COMMENT:	4,
		PREVIEW:	8
	}

	const $ACTION = {
		form, cancel, quote, edit, comment
	}

	let $Form = null
	let $Mess = null
	let $Trans = 0
	let $Mode = 0
	let $Undo = null
	let $Redo = null
	let $File = null
	let $OrigMess = null
	let $PreviewMess = null
	let $Scroll = 0
	let $LastChar = 0
	let $PasteCount = 0
	let $AttachCount = 0
	let $Attachments = []
	let $AttachHash = {}
	let $History = new august_buffer (100)
	let $Smiles = new smiles
	let $ColorPicker = null
	let $Speech = null

	return {
		action, init, cancel, insert, mode,
		preview_mess, attachments, is_edit, is_comment, is_preview
	}
}
