//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.info.js


August.initModule ("info", function ( win ) {
	this.done = function () {
	}
	this.init = function () {
		Chat.initPanel (this)
		Chat.addCSS ("info", () => {
			Chat.http ().send (`txt/chat-info.${Chat.Lang}.txt?${Chat.Version}`, ( r, s ) => {
				if (s < 300)
					Chat.showPanel ("info", r.tpl ())
				else
					Chat.error ("text")
			})
		})
	}
})
