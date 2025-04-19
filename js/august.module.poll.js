//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.poll.js


August.initModule ("poll", function ( win ) {
	function html ( tpl, cfg ) {
		return tpl.pattern ([{
			ID		() { return `__poll_opt_${this.$o.ID}` },
			ANSWER		() { return this.$o.Answer },
			OPTION		() { return cfg.Param & $CFG.MULTIPLE ? August.form.checkbox ("option", 0, this.$o.ID, this.$o.Answer) : August.form.radio ("option", this.$o.ID, this.$o.Answer) },
			IMAGE		() { return this.$p ? August.html.img_code_int ("", `//${Chat.Host}/images/poll${Chat.cfg.ChatID}${cfg.PollID.hex (2)}${this.$o.ID.hex ()}${this.$p [0]}.${this.$p [3].ext ()}`, this.$p [1], this.$p [2], "") : "" },
			COUNT		() { return isSet (this.$o.Count) ? this.$o.Count : "" },
			PERCENT		() { return isSet (this.$o.Count) ? cfg.Summa ? (this.$o.Percent = 100 * this.$o.Count / cfg.Summa).locale () : "0" : "" },
			$size		() { return cfg.Options.length },
			$set		() { this.$o = cfg.Options [this.$i]; this.$p = this.$o.Picture }
		}], {
			QUESTION:	cfg.Question,
			TOTAL:		cfg.Summa,
			FIRST:		cfg.First,
			LAST:		cfg.Last,
			HIDDEN:		"".true (cfg.Param & $CFG.HIDDEN),
			AUTH:		"".true (cfg.Param & $CFG.AUTH),
			STOPPED:	"".true (cfg.Param & $CFG.STOPPED),
			VOTED:		"".true (cfg.Voted),
			USER_AUTH:	"".true (User.Profile)
		})
	}
	function init_result ( poll, cfg ) {
		if (cfg.Param & $CFG.HIDDEN)
			return
		let Opts = []
		for (let o of cfg.Options) {
			let opt = poll.all (`#__poll_opt_${o.ID}`)
			if (opt) {
				opt.forEach (opt => opt.prop ("--percent", o.Percent || 0))
				Opts.push ({ o: opt, c: o.Count })
				if (!Opts.fo)
					Opts.fo = opt
				if (o.Count == cfg.Max.Count)
					opt.forEach (opt => opt.setClass ("max"))
			}
		}
		let Result = poll.last ()
		Result.prop ("--max", cfg.Max.Percent || 1)
		if (Result.hasClass ("sort"))
			Opts.sort (( a, b ) => a.c - b.c)
		else if (Result.hasClass ("rsort"))
			Opts.sort (( a, b ) => b.c - a.c)
		else
			return
		for (let opt of Opts) {
			if (Opts.fo != opt.o) {
				opt.o.forEach (( o, i ) => o.parent ().insert (o, Opts.fo [i]))
				Opts.fo = opt.o
			}
		}
	}
	function init ( poll, cfg ) {
		if (!poll.option)
			return
		init_result (poll, cfg)
		poll.onclick = e => {
			let a = e.$.name
			if (a == "poll-result")
				poll.setClass ("result", 1)
			else if (a == "poll-form")
				poll.setClass ("result", 0)
			else
				return
			e.stop ()
		}
		poll.onsubmit = e => {
			e.stop ()
			if (cfg.Param & $CFG.AUTH && !User.Profile)
				return
			let Data = {
				id:	User.ID,
				sess:	Chat.sess,
				poll:	cfg.PollID,
				key:	$KEY,
				vote:	[]
			}
			for (let o of poll.option) {
				if (o.checked)
					Data.vote.push (o.value)
			}
			if (!Data.vote.length) 
				return
			August.xhr (v => poll.setClass ("wait", v))("poll.vote", r => {
				if (isString (r))
					return poll.setClass (r.toLowerCase (), 1)
				if (r.vote !== null) {
					for (let o of cfg.Options)
						o.Count = r.vote [o.ID]
				}
				cfg.Voted = true
				cfg.Last = r.last
				if (!cfg.First)
					cfg.First = r.last
				cfg.init ()
				poll.remove (poll.last ())
				poll.appendHTML (html (cfg.tpl.poll_result, cfg))
				init_result (poll, cfg)
				poll.setClass ("result", 1).setClass ("voted", 1)
			}, Data)
		}
	}
	this.tpl = function ( tpl ) {
		return new function () {
			function set ( apl ) {
				let t = Chat.tpl (tpl, apl ? `poll/${apl}` : `poll`)
				$tpl.set (apl, t)
				return t
			}
			this.get = function ( apl, cb ) {
				($tpl.get (apl) || set (apl)).get (cb)
			}
			let $tpl = new Map
		}
	}
	this.key = function () {
		return $KEY
	}
	this.init = function ( insert, poll, style = "" ) {
		if (!isFunction (insert))
			return
		Chat.xhr ()("poll.cfg", cfg => {
			if (!cfg)
				return insert ("")
			let apl = ""
			let set = ["poll"]
			if (/^(\w*)(?:\/(\w*))?(?:\/(\w*))?$/.test (style)) {
				if (RegExp.$1)
					apl = RegExp.$1
				if (RegExp.$2)
					set.push (`form-${RegExp.$2}`)
				if (RegExp.$3)
					set.push (`result-${RegExp.$3}`)
				else if (RegExp.$2)
					set.push (`result-${RegExp.$2}`)
			}
			Chat.addCSS ("poll", () => $tpl.get (apl, tpl => {
				if (!tpl.poll_form)
					return insert ("")
				if (cfg.Param & $CFG.STOPPED)
					tpl.poll_form = ""
				cfg.tpl = tpl
				cfg.init = () => {
					cfg.Summa = cfg.Options.reduce (( a, c ) => a + c.Count, 0)
					cfg.Max = cfg.Options.reduce (( a, c ) => a.Count > c.Count ? a : c)
				}
				cfg.init ()
				insert (`<form class="${set.join (" ")}" id=__poll_${++$ID}>${html (tpl.poll_form, cfg)}${html (tpl.poll_result, cfg)}</form>`)
				init ($(`__poll_${$ID}`), cfg)
			}))
		}, {
			id:	User.ID,
			sess:	Chat.sess,
			poll:	poll,
			key:	$KEY
		})
	}

	const $CFG = {
		MULTIPLE:	0x01,
		AUTH:		0x02,
		HIDDEN:		0x04,
		STOPPED:	0x10
	}
	const $KEY = String.fromCharCode (... Array.from ({ length: 40 }, _ => Math.rnd (33, 127) | 0))
	let $ID = 0
	let $tpl = this.tpl (["poll-form", "poll-result"])
})
