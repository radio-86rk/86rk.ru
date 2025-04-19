//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.mps.moder.js


function august_mps_moder ( MPS ) {
	function action ( a, el ) {
		if ($ACTION [a]) {
			$Action = a
			$ACTION [a](el)
		}
	}
	function info ( el ) {
		let mess = MPS.get_mess (+el.dataset.m)
		compinfo (mess, html => {
			if (!html)
				return MPS.notice ("ERROR"), $Action = null
			$Win = MPS.MPS.root.append ("mps-modal")
			$Win.innerHTML = "<div class=compinfo>??</div>".format (html, $tpl.moder_search.tpl ({
				SEARCH1	( t ) { return mess.u.p ? this.$a (t, 1) : "" },
				SEARCH2	( t ) { return this.$a (t, 2) },
				SEARCH3	( t ) { return this.$a (t, 3) },
				SEARCH4	( t ) { return this.$a (t, 4) },
				$a	( t, s ) { return `<a data-a=search data-m=${el.dataset.m} data-s=${s}>${t}</a>` }
			}))
			MPS.esc_queue (cancel)
		})
	}
	function del_form ( el ) {
		let mess = MPS.get_mess (+el.dataset.m)
		$Scroll = MPS.SB.scroll
		MPS.esc_queue (cancel)
		MPS.set_class ("moder", 1)
		MPS.show_text ([mess])
		let Container = MPS.MPS.root.$("mps-form-container")
		$Form = Container
			? Container.append ("mps-form")
			: MPS.MPS.root.$("mps-body").insert ("mps-form", MPS.MPS.root.$("mps-text").next ())
		$Form.mess = mess
		$Form.className = "moder"
		$Form.innerHTML = "<form>?</form>".format ($tpl.moder_form.tpl ({
			COMPINFO:	MPS.MPS.User.Moder ? "<mps-compinfo class=loading></mps-compinfo>" : "",
			COLLAPSE:	"<mps-clps-btn data-a=collapse data-b=mps-collapse></mps-clps-btn>",
			MODER:		"".true (MPS.MPS.User.Moder),
			SELF:		"".true (MPS.MPS.User.Profile == mess.u.p),
		}))
		MPS.SB.scrollToSmooth ($Form)
		compinfo (mess, html => {
			if (!html)
				return
			let ci = $Form.$("mps-compinfo")
			if (ci) {
				ci.className = ""
				ci.innerHTML = html
			}
		})
	}
	function del () {
		let val = n => Form [n] ? August.form.$val (Form [n]) : ""
		let Form = $Form.$("form")
		moder (r => {
			$Action = null
			MPS.esc_queue_exe ()
			MPS.reload ({ cont: r.root, reset: r.root && r.cal })
		}, {
			a:	"delete",
			mid:	$Form.mess.id,
			replace:val ("replace"),
			bl:	val ("bl"),
			lock:	val ("lock"),
			period:	val ("period"),
			mon:	val ("mon"),
			text:	val ("text"),
			comm:	val ("comm")

		})
	}
	function search ( el ) {
		MPS.esc_queue_exe ()
		let mess = MPS.get_mess (+el.dataset.m)
		let s = +el.dataset.s
		let p = s == 1
			? {
				search:	s,
				p:	mess.u.p
			}
			: s == 2
			? {
				search:	s,
				cid1:	mess.i [2],
				cid2:	mess.i [3],
				ci:	mess.i [4]
			}
			: s == 3 || s == 4
			? {
				search:	s,
				ip:	mess.i [0],
				proxy:	mess.i [1]
			}
			: null
		if (p)
			MPS.search (p)
	}
	function moder ( cb, p ) {
		let RID = MPS.RID
		MPS.xhr ("mps.moder", r => {
			if (r && r.rid == RID)
				cb (r)
		}, Object.assign ({
			sess:	MPS.cfg.SessID,
			rid:	RID
		}, p))
	}
	function compinfo ( mess, cb ) {
		let ci_html = ci => $tpl.moder_compinfo
			.define ("COUNTRY_NAME", $ => root.Chat && root.Chat.cfg.Country ? root.Chat.cfg.Country [$] || "" : $)
			.define ("COUNTRY_FLAG", $ => August.html.flag ($))
			.define ("IPv4", ip => ip.ip ())
			.xtpl ("CINFO", ci)
		if (!MPS.MPS.User.Moder || !mess.i)
			return
		if (mess.ci)
			return cb (ci_html (mess.ci))
		MPS.xhr ("compinfo", r => {
			if (!r)
				return cb (r)
			mess.ci = r
			cb (ci_html (r))
		}, {
			ip:	mess.i [0],
			proxy:	mess.i [1],
			cid1:	mess.i [2],
			cid2:	mess.i [3],
			cinfo:	mess.i [4]
		})
	}
	function send_cmd ( el ) {
		let mess = MPS.get_mess (+el.dataset.m)
		if (($Action == "accept" && !mess.am) || ($Action == "restore" && !mess.del))
			return
		moder (r => {
			if (r.ok) {
				if ($Action == "accept")
					mess.am = 0
				else if ($Action == "restore")
					mess.del = 0
				el.attr ("disabled", "")
			}
			$Action = null
		}, {
			a:	$Action,
			mid:	mess.id
		})
	}
	function mode () {
		return $Action
	}
	function help () {
		MPS.HelpText.show ("mps-moder", "moder", "moder")
	}
	function cancel () {
		if ($Win)
			MPS.MPS.root.remove ($Win)
		if ($Form)
			MPS.MPS.root.$("mps-body").remove ($Form)
		let del = $Action == "del"
		MPS.set_class ("moder", 0)
		$Form = $Action = $Win = null
		if (del) {
			MPS.show_text ()
			MPS.SB.scrollTo ($Scroll)
		}
	}
	function init ( cb ) {
		let tpl = MPS.MPS.User.Moder
			? ["moder-form", "moder-compinfo", "moder-search"]
			: ["moder-form"]
		MPS.load_tpl (tpl, tpl => {
			if (tpl === false || tpl === null)
				return MPS.notice ("ERROR")
			if (tpl)
				$tpl = tpl
			cb && cb ()
		})
	}

	MPS.Event.on ("keydown", e => {
		if (!$Action)
			return
		e.handler ({ c: 112, f: 0 }, help)
	}).on ("mouse", e => {
		if (!$Action)
			return
		if (e.type == "click") {
			if ($Action == "info") {
				if (e.$ == $Win.first ())
					MPS.esc_queue_exe ()
			} else if ($Action == "del") {
				if (e.$.name == "cancel")
					MPS.esc_queue_exe ()
				else if (e.$.name == "del")
					del ()
			}
		}
	})

	const $ACTION = {
		info:		info,
		del:		del_form,
		search:		search,
		accept:		send_cmd,
		restore:	send_cmd
	}

	let $tpl = null
	let $Form = null
	let $Win = null
	let $Action = null
	let $Scroll = 0

	return { action, init, cancel, mode }
}
