//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.fast-reg.js


August.initModule ("fast-reg", function ( win ) {
	function done ( e ) {
		let valid = s => {
			let d = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
			let r = 1
			for (let ch of s)
				r &= +d.includes (ch)
			return r
		}
		let check = s => {
			return "`1234567890-=qwertyuiop[]asdfghjkl;'\\zxcvbnm,./abcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcba/.,mnbvcxz\\';lkjhgfdsa][poiuytrewq=-0987654321`".includes (s.replace (/(.)\1+/g, "$1"))
		}

		e.stop ()
		if ($Lock)
			return
		let Pass = $Form.pass1.value
		if (!Pass)
			return error ("pass1", $Form.pass1)
		if (Pass != $Form.pass2.value)
			return error ("pass2", $Form.pass2)
		if (Pass && Pass.length < 8)
			return error ("pass3", $Form.pass1)
		if (Pass && (!valid (Pass) || !/\S/.test (Pass)))
			return error ("pass4", $Form.pass1)
		if (Pass && check (Pass))
			return error ("pass5", $Form.pass1)
		if ($Form.agree1 && !$Form.agree1.checked)
			return error ("agree1")
		if ($Form.agree2 && !$Form.agree2.checked)
			return error ("agree2")

		$Lock = 1
		let Data = {
			sess:		$Info.SESS,
			pass:		Pass ? Pass.md5 () : "",
			secret_key:	$SECRET_KEY,
			secret_email:	$Form.secret_email ? $Form.secret_email.value : "",
			captcha:	$Form.captcha ? $Form.captcha.value : "",
			code:		$Form.code ? $Form.code.value : "",
			act:		"done"
		}
		for (let f of $Form) {
			if (/^uf\[(.+?)\]$/.test (f.name)) {
				if (f.type != "radio" || f.checked)
					Data [`uf[${RegExp.$1}]`] = f.value
			}
		}
		Chat.xhr ()("people.done", r => {
			if (r === "DONE") {
				$Lock = 2
				Chat.notice ("notice", "", "", { NOTICE: Chat.getError ("fr_done") })
			} else {
				if (r.ERROR == "CAPTCHA")
					captcha ()
				if (r.ERROR)
					return error (r.ERROR, null, { PARAM: r.ERROR_PARAM })
			}
			Chat.Win2.hide (1)
		}, Data)
	}
	function captcha () {
		Chat.xhr ()("people.captcha", r => {
			$("__captcha").src = `//${Chat.Host}/august/captcha/${$Info.SESS}?_${Date.now ()}`
			if ($Form.captcha)
				$Form.captcha.value = ""
		}, {
			sess:	$Info.SESS,
			a:	captcha.a,
			b:	captcha.b,
			c:	captcha.c
		})
	}
	function error ( err, el, p ) {
		if (el)
			el.focus ()
		Chat.error ("fr_" + err.toLowerCase (), p)
		$Lock = 0
	}
	this.done = function () {
		$Info = $Form = null
	}
	this.init = function () {
		if ($Lock == 2)
			return
		if ($Form)
			return Chat.Win2.hide (1)
		let [fp1, fp2] = August.fingerprint ()
		Chat.xhr ()("people.form", r => {
			if (!isObject (r) || !r.NICK.length) {
				if (r === "deny")
					Chat.error (r)
				return
			}
			$Info = r
			Chat.loadTPL ("fast-reg", tpl => Chat.addCSS ("fast-reg", () => {
				$Form = Chat.Win2.show ("<form method=post>?</form>".format (tpl.fast_reg.tpl ({
					NICK:			$Info.NICK [0].n,
					ACTIVATE_CAPTCHA:	$Info.CAPTCHA,
					ACTIVATE_CODE:		$Info.CODE,
					CAPTCHA:		( a, b, c ) => {
						if (!$Info.CAPTCHA)
							return ""
						captcha.a = a
						captcha.b = b
						captcha.c = c
						captcha ()
						return "<img id=__captcha src=data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7>"
					}
				}).tpl (Chat.$ERROR_CFG)), 1 | 2 | 64, this).first ()
				$Form.onsubmit = done
				Chat.http ().send ("php/secret-key.php", r => {
					if (r === false)
						return error ("secret"), Chat.Win2.hide (1)
					$SECRET_KEY = r
					$Lock = 0
				}, {
					key: $Info.PASSKEY
				})
			}))

		}, August.getid ({
			fp1:	fp1,
			fp2:	fp2,
			sess:	Chat.sess,
			id:	User.ID,
			act:	"new"
		}))
	}

	let $Info = null
	let $Form = null
	let $Lock = 1
	let $SECRET_KEY = ""
})
