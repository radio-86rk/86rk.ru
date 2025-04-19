//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.auth.js


function august_main () {
	August.init ({ Host: INIT.HOST, Version: INIT.VERSION })
	document.login.onsubmit = function () {
		this.onsubmit = e => false
		let pass_key = String.fromCharCode (... Array.from ({ length: 32 }, _ => Math.rnd (33, 127) | 0))
		let pass = this.pass.value.crypt (pass_key)
		let nick = this.nick.value
		August.xhr ()("auth-key", a => {
			this.profile.value = a.Profile
			this.auth_key.value = a.Key
			if (a.Profile)
				this.nick.attr ("name", null)
			this.pass.attr ("name", null)
			this.submit ()
		}, { nick, pass, pass_key })
		return false
	}
}
