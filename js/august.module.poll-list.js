//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.poll-list.js


August.initModule ("poll-list", function ( win ) {
	function click ( e ) {
		if (e.$.dataset.a == "poll") {
			let Poll = $Modal.$("#poll")
			if (Poll) {
				let id = ~~e.$.dataset.pollid
				if (Poll.pollid != id) {
					Poll.pollid = id
					Poll.innerHTML = "".tpl_func.WIDGET ("poll", id, e.$.dataset.style || "")
				}
			}
		}
	}
	function done () {
		$Modal.un ("click", click)
		$Modal = null
	}
	function init ( path ) {
		if (!$tpl)
			$tpl = Chat.$Modules.poll.tpl ("poll-list")
		Chat.xhr ()("poll-list", list => $tpl.get (path, tpl => Chat.loadModule ("modal", [fn => {
			let HTML = tpl.poll_list.pattern ([{
				POLL_ID		() { return list [this.$i].PollID },
				QUESTION	() { return list [this.$i].Question },
				$size		() { return list ? list.length : 0 }
			}])
			$Modal = fn ({ html: HTML, options: { noescapekey: 1, close: done }})
			$Modal.on ("click", click)
		}, "poll-list"], 1)), {
			sess:	Chat.sess,
			key:	Chat.$Modules.poll.key ()
		})
	}
	this.init = function ( path ) {
		if (Chat.$Modules.poll)
			init (path)
		else
			Chat.loadModule ("poll", [path], 1, init)
	}

	let $Modal = null
	let $tpl = null
})
