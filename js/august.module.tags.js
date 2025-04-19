//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.tags.js


August.initModule ("tags", function ( win ) {
	function key_handler ( e ) {
		$sb && $sb.keydown (e)
		return e.closeWin ()
	}
	function load_design ( cb ) {
		Chat.css ($Win, ["main", "chat", "tags"], cb)
		$sb && $sb.hide ()
	}
	function reinit ( r ) {
		load_design ()
	}
	this.init = function () {
		$Win = Chat.wo ("tags", $WinPos || this.$w)
		Chat.xhr ()("cfg.param", cfg => Chat.xhr ()("cfg.tags", tags => Chat.loadTPL ("tags", tpl => {
			let tt = []
			for (let t in tags)
				tt.push (t)
			$Win.html (August.html.mess (tpl.tags.pattern ([
				{
					TAG	() { return tt [this.$i] },
					$set	() { this.$ph = tags [tt [this.$i]] },
					$size	() { return tt.length }
				}, {
					ACTION:	`\x11${cfg.Action}\x10`,
					NICK:	User.Nick,
					PHRASE	() { return this.$.$ph [this.$i] },
					$size	() { return this.$.$ph.length }
				}
			]), 0x30000))
			let Body = $Win.document.body
			Body.setClass ("app-chat", 1).s ({ visibility: "hidden" })
			load_design (() => {
				Body.setClass ("click", User.ID).s ({ visibility: "" })
				Chat.Event.on ("redesign", load_design)
					.on ("reinit", reinit)
				$Win.document.onkeydown = key_handler
				Body.onclick = function ( e ) {
					if (e.$.is ("TAG") && User.ID)
						Chat.Send.insert (`/${e.$.innerHTML}`)
				}
				$Win.onbeforeunload = function () {
					Chat.Event.un ("redesign", load_design)
						.un ("reinit", reinit)
					$WinPos = this.pos ()
					$sb && $sb.done ()
					$sb = null
				}
				if (window.august_scrollbar)
					$sb = new august_scrollbar (Body.$("chat-view"))
			})
		}),
		`/${cfg ["@SERVER/TAGS_UPDATE"]}`, 1),
		{ param: "Action @SERVER/TAGS_UPDATE" })
	}

	let $Win = null
	let $WinPos = null
	let $sb = null
})
