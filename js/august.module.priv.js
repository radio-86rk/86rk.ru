//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.priv.js


August.initModule ("priv", function ( win ) {
	this.init = function ( priv, nick ) {
		Chat.addCSS ("priv", () => $tpl.get (tpl => {
			let PrivList = []
			let p = new august_bitset (`0x${priv}`)
			let t = tpl.priv.tpl ({
				PRIV_LIST:	p => { for (let n in p) PrivList.push ({ b: $PRIV [n], t: p [n] }); return "" },
				NICK:		nick ? August.html.mess (nick) : ""
			}).pattern ([{
				PRIV		() { return this.$p ? this.$p.t : "" },
				ALLOW		() { return "".true (this.$p && p.test (this.$p.b)) },
				$size		() { return this.$l || this.$list.length },
				$set		() { this.$p = this.$list [this.$n ()] },
				$list:		PrivList
			}])
			Chat.Win2.show (t, 4).setClass ("priv")
		}))
	}

	const $tpl = Chat.tpl ("priv")
	const $PRIV = new Enum (
		'COLOR_NICK',		'STYLE_NICK',		'COLOR_MESS',		'STYLE_MESS',
		'GRADIENT_NICK',	'GRADIENT_MESS',	'NICK_SMILES',		'NICK_PICTURE',
		'PUBLIC_HTML',		'STYLE_HTML',		'PERSONAL_HTML',	'ACCESS',
		'NO_LIMIT_NICKS',	'PHRASES',		'INVISIBLE',		'ICON',
		'MYSTATUS',		'CENSOR_OFF',		'TIMEOUT_OFF',		'FORM_ACCESS',
		'FORM_NO_DEL',		'PRIVATE',		'PRIVATE_WIN',		'SMILES',
		'VOTE',			'MINI_ROOM',		'NOTEBOOK',		'PHOTO_ALBUM',
		'INCOGNITO',		'ARMOUR',		'SPECIAL_CHARS',	'TAGS',
		'AUTO_ANSWER',		'STATUS',		'MYSTATUS_SMILES',	'HIDE_VIEWS',
		'BOT_MEDIA',		'BOT_MEDIA_PUBLIC',	'BOT_INFO',		'BOT_INFO_PUBLIC',
		'BOT_TALK',		'BOT_TALK_PUBLIC',	'BOT_EXTERNAL',		'BOT_EXTERNAL_PUBLIC',
		'PERSONAL_SMILES',	'WEBCAM',		'ATTACHMENTS',		'AVATAR',
		'DICTAPHONE'
	)
})
