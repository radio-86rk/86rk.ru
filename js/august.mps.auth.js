//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.mps.auth.js


function august_mps_auth ( MPS ) {
	function action ( a ) {
		if ($ACTION [a])
			$ACTION [a]()
	}
	function show () {
		if (MPS.MPS.User.Profile)
			return
		MPS.esc_queue ({ a: cancel, h: { module: "auth", args: ["cancel"] }})
		MPS.set_class ("auth", 1)
		let Container = MPS.MPS.root.$("mps-form-container")
		$Form = Container
			? Container.append ("mps-form")
			: MPS.MPS.root.$("mps-body").insert ("mps-form", MPS.MPS.root.$("mps-text").next ())
		$Form.className = "form"
		$Form.innerHTML = "<form class=auth>?</form>".format ($tpl.auth_form.tpl ())
		let f = $Form.first ()
		if (!f.name || !f.pass)
			return MPS.notice ("ERROR_TPL"), $Form.error = 1
		$Form.first ().name.value = MPS.Storage ("auth-name")
		$Form.first ().name.focus ()
	}
	function auth () {
		let f = $Form.first ()
		if ($Form.sending || $Form.error || !f.name.value || !f.pass.value)
			return
		$Form.sending = 1
		MPS.xhr ("mps.auth", r => {
			$Form.sending = 0
			if (!r)
				return MPS.notice ("ERROR")
			if (isSet (r.Error)) {
				MPS.notice (r.Error || "ERROR")
				MPS.cfg.PassKey = r.PassKey
				return
			}
			cancel ()
			MPS.reload (null, r)
			MPS.Storage ("auth-name", f.name.value)
			August.storage ("global")("auth", f.keep.checked ? JSON.stringify ({ key: r.User.AuthKey, p: r.User.Profile }) : "")
		}, {
			sess:	MPS.cfg.SessID,
			name:	f.name.value,
			pass:	f.pass.value.crypt (MPS.cfg.PassKey),
			bind:	+f.bind.checked
		})
	}
	function mode () {
		return !!$Form
	}
	function cancel () {
		if (!$Form)
			return
		let Container = MPS.MPS.root.$("mps-form-container")
		if (Container)
			Container.remove ($Form)
		else
			MPS.MPS.root.$("mps-body").remove ($Form)
		MPS.set_class ("auth", 0)
		$Form = null
	}
	function init ( cb ) {
		MPS.load_tpl ("auth-form", tpl => {
			if (tpl === false || tpl === null)
				return MPS.notice ("ERROR")
			if (tpl)
				$tpl = tpl
			cb && cb ()
		})
	}

	MPS.Event.on ("keydown", e => {
		if (!$Form)
			return
		e.handler ({ c: 13, f: 0 }, auth)
	}).on ("mouse", e => {
		if (!$Form)
			return
		if (e.type == "click") {
			if (e.$.name == "auth")
				auth ()
			else if (e.$.name == "cancel")
				MPS.esc_queue_exe ()
		}
	})

	const $ACTION = {
		auth:	show,
		cancel:	cancel
	}

	let $tpl = null
	let $Form = null

	return { action, init, mode }
}
