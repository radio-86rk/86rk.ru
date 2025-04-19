//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.mps-loader.js


August.init ({ Host: INIT.HOST, Version: INIT.VERSION })

august_run (() => {
	if (!INIT.OK) {
		location = "bad-browser.html"
		return
	}
	try {
		window.root = window.opener && opener.root || window
	} catch ( e ) {
		window.root = window
	}
	window.name = "August MPS"
	window.wid = "MPS"
	INIT.root = $("app_mps") || document.body
	INIT.User = { ID: root.User && root.User.ID || "" }
	let MPS = new august_mps (INIT)
	MPS.init ()
}, [
	"august.mps.js", "august.highslide.js"
])
