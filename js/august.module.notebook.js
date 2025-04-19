//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.notebook.js


August.initModule ("notebook", function ( win ) {
	function handler ( e ) {
		if ($Lock)
			return false
		let el = e.$
		switch (e.type) {
			case "click":
				if (el.name == "img-view")
					Chat.imgView.call ($App, el)
				else if (el.is ("NB-BTN") && $BUTTON [el.id])
					$BUTTON [el.id](el.dataset.p)
				else if (is_list () && el.id == "x")
					check ()
				break
			case "change":
				if (el.is ("SELECT") && el.name == "folder")
					folder (el.value)
				else if (el.is ("SELECT") && el.name == "friends")
					$("b_find", $Win).dataset.p = el.value
				else if (el == $File)
					insert_attach (el.files), el.value = ""
				break
			case "keydown":
				if (is_write ()) {
					if (e.ctrlKey && e.keyCode == 13)
						send ($("b_send", $Win).dataset.p)
					else if (el.name == "mess" && e.keyCode == 9)
						return insert ("\x09"), false
				} else if (e.ctrlKey) switch (e.keyCode) {
					case 8:  //  backspace
						if (is_read ())
							list ()
						break
					case 38:  //  up
					case 37:  //  left
						var b = $("b_prev", $Win)
						b && view (b.dataset.p)
						break
					case 40:  //  down
					case 39:  //  right
						var b = $("b_next", $Win)
						b && view (b.dataset.p)
						break
					case 36:  //  home
						var b = $("b_last", $Win)
						b && view (b.dataset.p)
						break
					case 35:  //  end
						var b = $("b_first", $Win)
						b && view (b.dataset.p)
						break
					case 46:  //  delete
						if (is_read ()) {
							let b = $("b_del", $Win)
							b && del_mess (b.dataset.p)
						}
						break
				} else if (e.handler ({ c: 27, f: 0 }, () => Chat.Event.fire ("escape-key", e), 1)) {
					$sb && $sb.keydown (e)
				}
				return e.closeWin ()
			case "dragstart":
				e.stop ()
				return
			case "dragover":
				e.dataTransfer.dropEffect = User.privAttach () && is_write () ? "copy" : "none"
				e.stop ()
				return
			case "drop":
				if (User.privAttach ())
					insert_attach (e.dataTransfer.files)
				e.stop ()
				return
		}
		return true
	}
	function list ( find, extra ) {
		if (!User.Profile)
			return
		$Current = arguments
		hide_panel ()
		Chat.xhr (wait)("nb.list", nb => {
			$Folder = nb.FOLDER
			$body.page = "list"
			$body.innerHTML = "<form>?</form>".format ($tpl.tpl ().notebook_list.pattern (function ( _, _, tpl, _, c, html ) {
				let OnPage = +c || 100
				let LCount = Math.min (nb.TOTAL, OnPage)
				$nb = {
					List:		nb.LIST,
					OnPage:		OnPage,
					LastPage:	(nb.TOTAL - 1) / OnPage | 0,
					LCount:		LCount,
					More:		nb.TOTAL > LCount,
					Find:		nb.FIND
				}
				$tpl.tpl ().list_row = tpl
				return html
			}).tpl ({
				BUTTON_DEL:	t => $nb.LCount ? button ("del", t) : "",
				BUTTON_UNDEL:	t => $nb.LCount && nb.FOLDER == "del" ? button ("undel", t) : "",
				BUTTON_FIRST:	t => $nb.More ? button ("first", t, "f") : "",
				BUTTON_PREV:	t => $nb.More ? button ("prev", t, "p") : "",
				BUTTON_NEXT:	t => $nb.More ? button ("next", t, "n") : "",
				BUTTON_LAST:	t => $nb.More ? button ("last", t, "l") : "",
				BUTTON_LIST:	t => $nb.Find ? button ("list", t) : "",
				BUTTON_NEW:	t => button ("new", t),
				TITLE:		$Win.document.title,
				COUNT_IN:	nb.COUNT [0],
				COUNT_OUT:	nb.COUNT [1],
				COUNT_DEL:	nb.COUNT [2],
				FIND:		"".true (nb.FIND),
				FIND_NUM:	nb.FIND_NUM,
				DEL_NUM:	nb.DEL_NUM,
				UNDEL_NUM:	nb.UNDEL_NUM,
				UNREAD_NUM:	nb.UNREAD_NUM,
				TOTAL:		nb.TOTAL,
				IN:		"".true (nb.FOLDER == "in"),
				OUT:		"".true (nb.FOLDER == "out"),
				DEL:		"".true (nb.FOLDER == "del")
			}))
			$("list", $Win).onclick = function ( e ) {
				let el = e.$
				if (el.form)
					return true
				el = el.up (this, el => el.dataset.messid)
				if (el)
					read (el.dataset.messid)
				return e.stop ()
			}
			list_out (nb.FIND ? $nb.Page = 0 : $Page)
			if (window.august_scrollbar)
				$sb = new august_scrollbar ($body.$("#table_list"))
			$body.noselect ()
		}, Object.assign ({
			sess:	Chat.sess,
			id:	User.ID,
			find:	find || "",
			folder:	$Folder
		}, extra))
		Chat.Event.fire ("app-done", $App)
	}
	function read ( mid, extra ) {
		$Current = arguments
		hide_panel ()
		Chat.xhr (wait)("nb.read", m => {
			if (!m)
				return list ()
			let Editable = m.FOLDER == "out" && !m.READ && m.USER != -1
			let Reply = (m.FOLDER == "in" || m.FOLDER == "del") && m.USER && m.USER != -1
			let quote = ( m, o = 0 ) => {
				let q = []
				let t = []
				let r = ""
				let b1 = () => {
					if (q.length) {
						r += `<div class='quote${o}'>${fmt (quote (q, o ^ 1))}</div>`
						q.length = 0
					}
				}
				let b2 = () => {
					if (t.length) {
						r += t.join ("\n")
						t.length = 0
					}
				}
				for (let l of m) {
					if (l [0] == "\u276F") {
						q.push (l.substr (l [1] == " " ? 2 : 1))
						b2 ()
					} else {
						t.push (l)
						b1 ()
					}
				}
				b1 ()
				b2 ()
				return r
			}
			let fmt = m => m.replaceAll ([
				/^::(.+?)::$\s?/gm,
				/^-{4,}$\s?/gm,
				/\B--\B/gm,
				/^(={1,5}) (::)?(__)?(.+?)\3\2 \1$\s?/gm,
				/(\*\*|__|''|--)(\S(?:.*?\S)?)\1/gms
			],[
				"<center>$1</center>",
				"<hr>",
				"&mdash;",
				( ... $ ) => `<h${$[1].length}${August.html.attr ({ class: [$[2] ? "cntr" : "", $[3] ? "undr" : ""].join (" ").trim () })}>${$[4]}</h${$[1].length}>`,
				( ... $ ) => `<${$TAG [$[1]]}>${fmt ($[2])}</${$TAG [$[1]]}>`
			])
			let mess = m => August.html.mess (fmt (quote ((m.ATTR & $ATTR.HTML ? m.MESS : m.MESS.htmlEntities ()).split ("\n"))), 0x3000)
			$Folder = m.FOLDER
			$body.page = "read"
			$body.innerHTML = $tpl.tpl ().notebook_read.tpl ({
				BUTTON_DEL:	t => button ("del", t, [mid, m.NEXT]),
				BUTTON_UNDEL:	t => m.FOLDER == "del" ? button ("undel", t, [mid, m.NEXT]) : "",
				BUTTON_UNREAD:	t => m.UNREAD ? button ("unread", t, m.UNREAD) : "",
				BUTTON_FIRST:	t => m.PREV ? button ("first", t, m.FIRST) : spacer (),
				BUTTON_PREV:	t => m.PREV ? button ("prev", t, m.PREV) : spacer (),
				BUTTON_NEXT:	t => m.NEXT ? button ("next", t, m.NEXT) : spacer (),
				BUTTON_LAST:	t => m.NEXT ? button ("last", t, m.LAST) : spacer (),
				BUTTON_LIST:	t => button ("list", t),
				BUTTON_EDIT:	t => Editable ? button ("edit", t, mid) : "",
				BUTTON_REPLY:	t => Reply ? button ("reply", t, mid) : "",
				BUTTON_INFO:	t => m.USER && m.USER != -1 && m.FOLDER != "out" ? button ("info", t, m.USER) : "",
				BUTTON_FIND:	t => m.USER && m.USER != -1 ? button ("find", t, m.USER) : "",
				BUTTON_TRANS:	t => button ("trans", t),
				TITLE:		$Win.document.title,
				FIND:		"".true (m.FIND),
				IN:		"".true (m.FOLDER == "in"),
				OUT:		"".true (m.FOLDER == "out"),
				DEL:		"".true (m.FOLDER == "del"),
				ADMIN:		"".true (m.ATTR & $ATTR.ADMIN),
				AUGUST:		"".true (m.ATTR & $ATTR.AUGUST),
				NOTICE:		"".true (m.ATTR & $ATTR.NOTICE),
				SENT:		m.SENT,
				READ:		m.READ,
				NICK:		smiles (m.NICK),
				SUBJ:		smiles (m.SUBJ),
				MESS:		mess (m)
			})
			Chat.Event.fire ("insert-mess", $body.$("div#mess"))
			if (window.august_scrollbar)
				$sb = new august_scrollbar ($body.$("div#mess"))
		}, Object.assign ({
			sess:	Chat.sess,
			id:	User.ID,
			m:	mid,
			folder:	$Folder,
			find:	$nb ? $nb.Find : ""
		}, extra))
	}
	function write ( ID2, Nick, mid ) {
		$Current = arguments
		let subj = s => {
			return $Folder == "in" && /^([rR][eE](?:\[(\d+)\])?:|)\s*(.*)$/.test (s)
				? RegExp.$1
				? `Re[${+RegExp.$2 + 1}]: ${RegExp.$3}`
				: `Re: ${RegExp.$3}`
				: s
		}
		let mess = s => {
			return ($Folder == "in" ? s.replace (/^(\u276F+)?(.*?)$/gm, ( ... $ ) => `\u276F${$[1] || " "}${$[2]}`) : s)
				.replace (August.html.IMAGEATTACH_RE, ( ... $ ) => `[PICTURE:${$[6]}:${btoa ($[0])}]`)
				.replace (August.html.AUDIOATTACH_RE, ( ... $ ) => `[AUDIO:${$[3]}:${btoa ($[0])}]`)
				.replace (August.html.VIDEOATTACH_RE, ( ... $ ) => `[VIDEO:${$[3]}:${btoa ($[0])}]`)
				+ "\n\n"
		}
		hide_panel ()
		Chat.xhr (wait)("nb.write", wr => {
			$body.page = "write"
			$body.s ({ visibility: "hidden" })
			$body.innerHTML = "<form class=write>?</form>".format ($tpl.tpl ().notebook_write.tpl ({
				BUTTON_TRANS:	t => button ("trans", t),
				BUTTON_LIST:	t => button ("list", t),
				BUTTON_FRIENDS:	t => button ("friends", t),
				BUTTON_SEND:	t => button ("send", t, mid),
				BUTTON_SELECT:	t => button ("select_user", t),
				BUTTON_INFO:	t => button ("info", t),
				BUTTON_FIND:	t => button ("find", t),
				BUTTON_DEL:	t => button ("del_user", t),
				BUTTON_ATTACH:	t => User.privAttach ()     ? button ("attach", t) : "",
				BUTTON_MIC:	t => User.privDictaphone () ? button ("mic", t)    : "",
				BUTTON_WEBCAM:	t => User.privWebcam ()     ? button ("webcam", t) : "",
				BUTTON_EMOJI:	t => Chat.$Modules.emoji    ? button ("emoji", t)  : ""
			}))
			$File = null
			$Attachments = { Attach: [], Type: {} }
			let f = form ()
			if (!f.to || !f.subj || !f.mess || !wr)
				return
			f.to.value = wr.TO || Nick || ""
			f.subj.value = mid ? subj (wr.SUBJ) : ""
			f.mess.value = mid ? mess (wr.MESS) : ""
			let e_el = $("error", $Win)
			if ($("friends_list", $Win))
				$("friends_list", $Win).display ()
			if (e_el) {
				$tpl.tpl ().notebook_error = e_el.innerHTML.htmlEntityDecode ()
				e_el.innerHTML = ""
			}
			$body.s ({ visibility: "" }).setClass ("error", 0)
			if (wr.DENY)
				error ("", wr)
			else if (f.to.value)
				f.mess.focus ()
			else
				f.to.focus ()
			f.to.onblur =
			f.subj.onblur =
			f.mess.onblur = function ( e ) {
				f.blur = this
			}
			f.to.onkeypress =
			f.subj.onkeypress =
			f.mess.onkeypress = function ( e ) {
				return (!this.trans || August.translit (e, this))
			}
			f.mess.onpaste = function ( e ) {
				if (User.privAttach ()) August.img2webp (
					e.clipboardData.files [0],
					`paste_${Date.now ()}`,
					f => insert_attach ([f])
				)
			}
			Chat.Event.fire ("app-ready", $App)
		}, {
			sess:	Chat.sess,
			id:	User.ID,
			folder:	$Folder,
			tonick:	Nick || "",
			id2:	ID2 || "",
			m:	mid || ""
		})
	}
	function list_out ( p ) {
		if ($nb.More) {
			buttons_fp (p)
			buttons_ln (p != $nb.LastPage)
		}
		let list = ""
		let start = p * $nb.OnPage
		let end = Math.min (start + $nb.OnPage, $nb.List.length)
		for (let i = start; i < end; i++) {
			let m = $nb.List [i]
			list += $tpl.tpl ().list_row.tpl ({
				NUM:		i + 1,
				ID:		m [0],
				NICK:		m [1],
				SUBJ:		m [2],
				NEW:		"".true (!(m [4] & 1)),
				ADMIN:		"".true (m [4] & $ATTR.ADMIN),
				AUGUST:		"".true (m [4] & $ATTR.AUGUST),
				NOTICE:		"".true (m [4] & $ATTR.NOTICE),
				CHECK:		August.form.checkbox ("check", 0, m [0], ""),
				DATE:		( f, l ) => m [3].date (f || "d mmm yyyy, HH:ii", l)
			})
		}
		$("list", $Win).innerHTML = list
	}
	function send ( mid ) {
		let f = form ()
		if (!/\S/.test (f.to.value) || !/\S/.test (f.mess.value))
			return
		let Data = {
			sess:	Chat.sess,
			id:	User.ID,
			folder:	$Folder,
			to:	f.to.value,
			subj:	f.subj.value,
			mess:	f.mess.value,
			m:	mid || ""
		}
		let AttachCount = 0
		if ($Attachments.Attach.length) {
			let Form = new FormData
			for (let n in Data)
				Form.append (n, Data [n])
			for (let a of $Attachments.Attach) {
				if (f.mess.value.includes (`[${a.t}:${a.idx}]`))
					Form.append (a.t.toLowerCase () + a.idx, a.f), AttachCount++
			}
			AttachCount && (Data = Form)
		}
		Chat.xhr (wait, !AttachCount ? null : http => {
			$body.setClass ("progress-bar", 1)
			http.upload.onprogress = e => {
				$body.prop ("--progress-bar", (100 * e.loaded / e.total).toFixed (1) + "%")
			}
		})("nb.send", r => {
			if (r === "OK")
				return $Win.close ()
			$body.setClass ("progress-bar", 0)
			error ("", r)
		}, Data)
	}
	function error ( e, p ) {
		let e_txt = $tpl.tpl ().notebook_error.param (e, p).trim ()
		let e_el = $("error", $Win)
		if (e_txt && e_el) {
			$Win.clearTimeout (e_el.to)
			e_el.innerHTML = e_txt
			$body.setClass ("error", 1)
			e_el.to = setTimeout (() => { e_el.innerHTML = "", $body.setClass ("error", 0) }, 5000)
		}
	}
	function view ( p ) {
		if (is_read ())
			return read (p)
		if (is_list ()) {
			let cp = isSet ($nb.Page) ? $nb.Page : $Page
			let p2 = (isSet ($nb.Page)
				? {
					f: () => $nb.Page = $nb.LastPage,
					p: () => $nb.Page < $nb.LastPage ? ++$nb.Page : $nb.Page,
					n: () => $nb.Page > 0 ? --$nb.Page : $nb.Page,
					l: () => $nb.Page = 0
				}
				: {
					f: () => $Page = $nb.LastPage,
					p: () => $Page < $nb.LastPage ? ++$Page : $Page,
					n: () => $Page > 0 ? --$Page : $Page,
					l: () => $Page = 0
				}
			) [p]()
			if (p2 != cp)
				list_out (p2)
		}
	}
	function folder ( f ) {
		if (f && $Folder != f) {
			$Folder = f
			list ()
		}
	}
	function check () {
		if ($("list", $Win)) {
			for (let f of form ()) {
				if (f.type == "checkbox" && f.name == "check")
					f.checked ^= 1
			}
		}
	}
	function checked () {
		return Array.from (form ())
			.filter (f => f.checked && f.name == "check")
			.map (f => f.value)
	}
	function del_mess ( p ) {
		if (is_list ()) {
			let ch = checked ()
			if (ch.length)
				list (0, { m: "del", ch: ch })
		} else if (is_read ()) {
			let m = p.split (",")
			read (m [1], { del: m [0] })
		}
	}
	function undel_mess ( p ) {
		if (is_list ()) {
			let ch = checked ()
			if (ch.length)
				list (0, { m: "undel", ch: ch })
		} else if (is_read ()) {
			let m = p.split (",")
			read (m [1], { undel: m [0] })
		}
	}
	function is_list () {
		return $body.page == "list"
	}
	function is_read () {
		return $body.page == "read"
	}
	function is_write () {
		return $body.page == "write"
	}
	function form () {
		return $Win.document.forms [0]		
	}
	function button ( b, t, p ) {
		return `<nb-btn title='${t.htmlEntities ()}' id=b_${b}${p ? ` data-p=${p}` : ``}></nb-btn>`
	}
	function spacer () {
		return "<nb-spacer></nb-spacer>"
	}
	function buttons_fp ( v ) {
		$("b_last", $Win).style.visibility = $("b_next", $Win).style.visibility = v ? "" : "hidden"
	}
	function buttons_ln ( v ) {
		$("b_first", $Win).style.visibility = $("b_prev", $Win).style.visibility = v ? "" : "hidden"
	}
	function smiles ( m ) {
		August.html.opt (0)
		return m.replace (August.html.SMILE_RE, August.html.smile)
	}
	function mess () {
		return is_write () ? form ().mess : null
	}
	function focus () {
		mess ().focus ()
		return this
	}
	function lock ( l ) {
		$Lock = !!l
		return this
	}
	function wait ( l ) {
		$body.setClass ("wait", $Lock = l)
	}
	function insert ( text, opt = 0 ) {
		let m = mess ()
		if (!m)
			return
		m.focus ()
		let b = m.selectionStart
		let p = b + text.length
		m.value = m.value.substr (0, b) + text + m.value.substr (m.selectionEnd)
		m.setSelectionRange (opt & 1 ? b : p, p)
	}
	function insert_file ( t, f, big ) {
		if (!big && f.size > Chat.cfg.AFS * 1024)
			return error ("FILE_SIZE", { FILE: f.name, SIZE: f.size >> 10 })

		let h = f.hash ()
		let a = $Attachments.Type [t]
		if (!a)
			a = $Attachments.Type [t] = { Hash: {}, idx: 0 }
		let idx = a.Hash [h]
		if (!idx) {
			idx = a.Hash [h] = ++a.idx
			$Attachments.Attach.push ({ t, f, idx })
		}
		insert (`[${t}:${idx}]`)
	}
	function insert_attach ( fs ) {
		for (let f of fs) {
			if (/^image\/(gif|jpg|jpeg|pjpeg|png|x-png|webp)$/.test (f.type))
				insert_file ("PICTURE", f)
			else if (f.type == "image/bmp")
				August.img2webp (f, f.name + ".webp", f => insert_file ("PICTURE", f))
			else
				error ("FILE_TYPE", { FILE: f.name })
		}
	}
	function trans () {
		if (is_write ()) {
			let f = form ()
			f.to.trans =
			f.subj.trans =
			f.mess.trans = $("b_trans", $Win).setClass ("light")
			f.blur && f.blur.focus ()
			return
		}

		let tr = m => {
			for (let i = 0; i < $RUS.length; i++)
				m = m.split ($LAT [i]).join ($RUS [i])
			return m
		}

		let proc = ( n, t ) => {
			for (let el of n.childNodes) {
				if (el.nodeType == 1)
					return proc (el, t)
				if (el.nodeType == 3) {
					if (t) {
						el.oTextContent = el.textContent
						el.textContent = tr (el.textContent)
					} else {
						el.textContent = el.oTextContent
					}
				}
			}
		}

		proc ($("mess", $Win), $("b_trans", $Win).setClass ("light"))
	}
	function friends ( List ) {
		if (!User.Profile)
			return
		let l = $("friends_list", $Win)
		if (l.init)
			return l.display ((l.v ^= 1) ? "" : "none")
		Chat.xhr ()("nb.friends", list => {
			if (list === null)
				return
			let s = form ().friends
			if (s) {
				s.append (new Option ("", ""))
				for (let o of list)
					s.append (new Option (o.n, o.p))
			}
			l.init = 1
			l.display ((l.v ^= 1) ? "" : "none")
		}, {
			sess:	Chat.sess,
			id:	User.ID
		})
	}
	function del_friend () {
		let f = form ()
		let User = f.friends.value
		if (User) {
			f.friends.remove (f.friends.selectedIndex)
			Chat.sendCmd (35, { del: User })
		}
	}
	function add_nick () {
		let f = form ()
		let Nick = f.friends [f.friends.selectedIndex].text
		if (Nick && !f.to.value.toLowerCase ().includes (Nick.toLowerCase ())) {
			if (f.to.value)
				f.to.value += "; "
			f.to.value += Nick
		}
	}
	function info ( User ) {
		if (is_write ()) {
			User = form ().friends.value
		} else if (is_read ()) {
		} else {
			return
		}
		if (User)
			Chat.userinfo ({ p: User })
	}
	function attach () {
		($File = $File || $body.append ("input", {
			name:     "attach",
			type:     "file",
			accept:   "image/*",
			multiple: true
		})).click ()
	}
	function dictaphone () {
		if (!is_write ())
			return
		focus ()
		let css = "dictaphone-nb"
		Chat.loadModule ("dictaphone", [$App, css])
		if (!$CSS.includes (css))
			$CSS.push (css)
	}
	function video_recorder () {
		if (!is_write ())
			return
		focus ()
		let css = "video-recorder-nb"
		Chat.loadModule ("video-recorder", [$App, css, w => {
			if (!w)
				return
			let pwr = w.$("video-bttn#power")
			if (pwr)
				pwr.onclick = video_recorder
		}, {
			id:	Chat.VideoID
		}])
		if (!$CSS.includes (css))
			$CSS.push (css)
	}
	function hide_panel () {
		if ($App.$PanelShown)
			$App.showPanel ()
	}
	function emoji () {
		Chat.loadModule ("emoji", [$App])
	}
	function load_design ( cb ) {
		Chat.css1 ($Win, $CSS, cb)
	}
	function reinit () {
		if (!$Win.closed)
			init (true, () => $Current.callee (... $Current.arguments))
	}
	function init ( check, cb ) {
		$tpl.get (( tpl, eq ) => {
			if (check && eq)
				return load_design ()
			Chat.Event.fire ("app-done", $App)
			$Win.html (tpl.notebook.tpl ())
			$body = $Win.document.body
			$Lock = 0
			$Page = 0
			$Folder = ""
			$App.$PanelShown = 0
			$body.setClass ("app-chat", 1)
			$Win.document.onclick = $Win.document.onchange =
			$Win.document.onkeydown = $Win.ondragstart =
			$Win.ondragover = $Win.ondrop = handler
			$Win.onbeforeunload = e => {
				Chat.Event.un ("redesign", load_design)
					.un ("reinit", reinit)
					.fire ("app-done", $App)
				$WinPos = $Win.pos ()
				$sb && $sb.done ()
				$sb = null
			}
			load_design (cb)
		})
	}
	this.init = function ( ID, Nick, m ) {
		if (!User.ID)
			return
		if (!(User.Priv.test (26) || m))
			return Chat.error ("deny")
		$Win = Chat.wo ("notebook", $WinPos)
		$Win.wid = "NOTEBOOK"
		$Win.root = root
		Chat.Event.on ("redesign", load_design)
			.on ("reinit", reinit)
			.once ("user-reset", () => {
				if (!$Win.closed)
					$Win.close ()
			})
		init (false, () => {
			if (ID || Nick || !User.Profile)
				write (ID, Nick)
			else if (m)
				read (m)
			else
				list ()
		})
	}

	const $BUTTON = {
		b_first:	view,
		b_prev:		view,
		b_next:		view,
		b_last:		view,
		b_del:		del_mess,
		b_undel:	undel_mess,
		b_unread:	read,
		b_list:		list,
		b_find:		list,
		b_new:		write,
		b_send:		send,
		b_trans:	trans,
		b_friends:	friends,
		b_del_user:	del_friend,
		b_select_user:	add_nick,
		b_info:		info,
		b_attach:	attach,
		b_mic:		dictaphone,
		b_webcam:	video_recorder,
		b_emoji:	emoji,
		b_reply:	p => write ("", "", p),
		b_edit:		p => write ("", "", p)
	}

	let $tpl = Chat.tpl (["notebook", "notebook-list", "notebook-read", "notebook-write"])
	let $Win = null
	let $WinPos = null
	let $sb = null
	let $body = null
	let $nb = null
	let $Lock = 0
	let $Page = 0
	let $Folder = ""
	let $Current = null
	let $File = null
	let $Attachments = null

	const $LAT = "ya:yu:yo:ch:tsh:sh:zh:YA:YU:YO:CH:TSH:SH:ZH:Ya:Yu:Yo:Ch:Tsh:Sh:Zh:ja:ju:jo:JA:JU:JO:Ja:Ju:Jo:e':E':'':``:a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:r:s:t:u:v:w:x:y:z:':`:A:B:C:D:E:F:G:H:I:J:K:L:M:N:O:P:R:S:T:U:V:W:X:Y:Z".split (":")
	const $RUS = "яюёчщшжЯЮЁЧЩШЖЯЮЁЧЩШЖяюёЯЮЁЯЮЁэЭЬЪабцдефгхийклмнопрстуввхызьъАБЦДЕФГХИЙКЛМНОПРСТУВВХЫЗ"
	const $CSS = ["notebook"]
	const $TAG = {
		"**": "b",
		"__": "u",
		"''": "i",
		"--": "del"
	}
	const $ATTR = {
		ADMIN:	0x0002,
		AUGUST:	0x0004,
		NOTICE:	0x0008,
		HTML:	0x0100
	}
	const $App = {
		error:			( ... a ) => error ("ERROR", { ERROR: Chat.getError (... a) }),
		Send:			{ insertFile: insert_file, insert, mess, focus, lock },
		addCSS:			Chat.addCSS,
		initPanel:		Chat.initPanel,
		showPanel:		Chat.showPanel,
		$CSS:			[],
		$PanelModule:		[],
		$PanelShown:		0,
		get Event ()		{ return Chat.Event },
		get Design ()		{ return Chat.Design },
		get win ()		{ return $Win },
		get root ()		{ return $body },
		get main ()		{ return $body },
		get panel ()		{ return $body.$("nb-panel") },
		get dictWidget ()	{ return $body.$("#dictaphone") },
		get videoWidget ()	{ return $body }
	}
})
