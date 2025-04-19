//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.emoji.js


August.initModule ("emoji", function ( win ) {
	function widget ( app ) {
		function handler ( e ) {
			switch (e.type) {
				case "scroll": {
					let Body = $Widget.$("emoji-body")
					for (let Cat = $Widget.$("nav").first (); Cat; Cat = Cat.next ()) {
						let Sec = Body.$(`section#emoji_${Cat.dataset.id}`)
						let t = Sec.offsetTop
						let b = t + Sec.offsetHeight - 1
						let s = +(this.scrollTop + this.offsetHeight >= t && this.scrollTop < b)
						if (Cat.selected != s)
							Cat.selected = +Cat.setClass ("selected")
					}
					break
				}
				case "mouseover":
					if (e.$.dataset.code && $PreviewTPL) {
						$Widget.setClass ("preview", 1)
						$Widget.$("#preview").innerHTML = $PreviewTPL.tpl ({
							EMOJI:		e.$.innerHTML,
							CODE:		e.$.dataset.code,
							ANNOTATION:	e.$.dataset.annotation
						})
					}
					break
				case "mouseout":
					if (e.$.dataset.code && !(e.relatedTarget && e.relatedTarget.dataset.code)) {
						$Widget.setClass ("preview", 0)
						$Widget.$("#preview").innerHTML = ""
					}
					break
				case "click":
					if (e.$.dataset.id) {
						scroll_to (e.$.dataset.id)
					} else if (e.$.dataset.code) {
						e.$.setClass ("click", 0)
						click (e.$.dataset.code, !!e.$.up ($Widget, el => el.id === "emoji_recent"))
						setTimeout (_ => e.$.setClass ("click", 1))
					}
					break
				case "input":
					search (e.$.value)
					break
			}
		}
		function scroll_to ( id ) {
			let Body = $Widget.$("emoji-body")
			let Sec = Body.$(`section#emoji_${id}`)
			let f = _ => {
				let s = Body.scrollTop
				let d = Sec.offsetTop - s
				Body.scrollTop += d / 8 + d.sign () | 0
				if (Body.scrollTop - s | 0)
					Body.af = requestAnimationFrame (f)
			}
			if ($Search) {
				$Widget.setClass ("search", 0)
				$Widget.$("#search").$("input").value = $Search = ""
				Body.scrollTop = 0
			}
			cancelAnimationFrame (Body.af)
			Body.scrollTop++
			f ()
		}
		function click ( c, r ) {
			app.Send.insert ($Emoji [c].e)
			if (!$Recent [c])
				$Recent [c] = { c: 0 }
			if (!$Recent [c].t || August.now () - $Recent [c].t > 2000) {
				$Recent [c].c++
				$Recent [c].t = August.now ()
			}
			if (!r)
				recent ()
		}
		function recent () {
			section (
				$Widget.$("emoji-body").$("section#emoji_recent"),
				$Category.find (c => c.id == "recent"),
				get_recent ()
			)
		}
		function search ( val ) {
			let Reset = $Search.length
			$Search = val.trim ()
			$Widget.setClass ("search", $Search.length)
			let Section = $Widget.$("emoji-body").$("section#emoji_search")
			if (!Section || !$Search.length)
				return Reset ? scroll_to ("people") : void 0
			for (let c = $Widget.$("nav").first (); c; c = c.next ())
				c.setClass ("selected", 0).selected = 0
			if ($SearchIndex === null) {
				$SearchIndex = {}
				for (let id in $Emoji) {
					let e = $Emoji [id]
					e.search = unique_array (`${id} ${e.a}`.split (/[-_\s]+/).map ($ => $.toLowerCase ())).join (" ")
				}
			}
			let IDs = Object.keys ($Emoji)
			let Search = $Search.toLowerCase ().split (/[-_,\s]+/).slice (0, 2).map (v => {
				let idx = $SearchIndex
				for (let i = 0, len = 1, ids = IDs; i < v.length; i++, len++, ids = idx.ids) {
					let ch = v [i]
					idx [ch] || (idx [ch] = {})
					idx = idx [ch]
					if (idx.ids)
						continue
					let s = {}
					idx.ids = []
					for (let id of ids) {
						let sub = v.substr (0, len)
						let p = $Emoji [id].search.indexOf (sub)
						if (p != -1) {
							s [id] = sub == id ? 0 : p + 1
							idx.ids.push (id)
						}
					}
					idx.ids.sort (( a, b ) => s [a] - s [b] || a.localeCompare (b))
				}
				return idx.ids || []
			})
			let intersect = ( a, b ) => unique_array (a.filter (v => b.includes (v)))
			section (
				Section,
				$Category.find (c => c.id == "search"),
				Search.length == 1 ? Search [0] : Search.length ? intersect (Search [0], Search [1]) : []
			)
			$Widget.$("emoji-body").scrollTop = 0
		}
		function section ( sec, cat, list ) {
			if (!sec || !cat)
				return
			sec.replaceHTML ($SectionTPL.pattern ([{
				ANNOTATION	() { return this.$e.a },
				CODE		() { return this.$e.c },
				EMOJI		() { return this.$e.e },
				$size		() { return list.length },
				$set		() { this.$e = $Emoji [list [this.$i]] }
			}], {
				CATEGORY	() { return cat.c },
				CATEGORY_ID	() { return cat.id }
			}))
		}
		function get_recent () {
			return Object.keys ($Recent)
				.sort (( a, b ) => $Recent [b].c - $Recent [a].c || $Recent [b].t - $Recent [a].t)
				.slice (0, $RECENT_LIMIT)
		}
		this.done = function () {
			let Nav = $Widget.$("nav")
			let Body = $Widget.$("emoji-body")
			let Srch = $Widget.$("#search")
			if (Nav)
				Nav.un ("click", handler)
			if (Body)
				Body.un ("scroll mouseover mouseout click", handler)
			if (Srch)
				Srch.un ("input", handler)
		}

		let $Widget = null
		let $PreviewTPL = ""
		let $SectionTPL = ""
		let $Search = ""

		$tpl.get (tpl => {
			app.showPanel ("emoji", tpl.emoji.pattern ({
				nav: [{
					CATEGORY	() { return $Category [this.$i].c },
					CATEGORY_ID	() { return $Category [this.$i].id },
					$size		() { return $Category.length },
					$set		() { return $Category [this.$i].id != "search" }
				}],
				body: [{
					CATEGORY	() { return $Category [this.$i].c },
					CATEGORY_ID	() { return $Category [this.$i].id },
					$size		() { return $Category.length },
					$set		() { this.$e = $Category [this.$i].id == "recent" ? get_recent () : $Category [this.$i].e }
				}, {
					ANNOTATION	() { return this.$e.a },
					CODE		() { return this.$e.c },
					EMOJI		() { return this.$e.e },
					$size		() { return this.$.$e.length },
					$set		() { this.$e = $Emoji [this.$.$e [this.$i]] },
					$tpl		( t ) { $SectionTPL = t }
				}]
			}))
			$Search = ""
			$Widget = app.panel.first ()
			let Nav = $Widget.$("nav")
			let Body = $Widget.$("emoji-body")
			let Srch = $Widget.$("#search")
			let Preview = $Widget.$("#preview")
			if (Nav) {
				for (let c = Nav.first (); c; c = c.next ())
					c.selected = 0
				Nav.on ("click", handler)
			}
			if (Body) {
				Body.on ("scroll mouseover mouseout click", handler)
				scroll_to ("people")
			}
			if (Srch) {
				Srch.on ("input", handler)
				let Inp = Srch.$("input")
				if (Inp) {
					Inp.onmouseenter = e => {
						if ($Search)
							Inp.focus ()
					}
				}
			}
			if (Preview) {
				$PreviewTPL = Preview.innerHTML
				Preview.innerHTML = ""
			}
		})
	}
	function unique_array ( a ) {
		return [... new Set (a)]
	}
	function reset () {
		for (let [app, w] of $Widget)
			w.done ()
		$Widget.clear ()
		$tpl.reset ()
		param ("recent", JSON.stringify ($Recent))
	}
	function nick ( n ) {
		[n.n] = $EMOJI ([n.n])
	}
	function done ( app ) {
		let w = $Widget.get (app)
		if ($Widget.delete (app))
			w.done ()
	}
	this.done = function ( app ) {
		done (app)
	}
	this.init = function ( app ) {
		let init = () => {
			if (isNull)
				return
			if ($Widget.get (app))
				return app.showPanel ()
			app.initPanel (this)
			$Widget.set (app, new widget (app))
		}
		let isNull = app === null
		app = app || Chat
		if ($Category.length)
			return init ()
		Chat.loadCFG2 ("emoji", ( $1, $2, $3 ) => {
			if ($1) {
				$Category.push ({ id: $2, c: $1, e: [] })
			} else if ($Category.length) {
				let e = $3.split (":")
				if (e.length == 2) {
					$Category.last ().e.push (e [0])
					$Emoji [e [0]] = {
						a: $2,
						c: e [0],
						e: String.fromCodePoint (... e [1].split ("-").map (c => c.hex ()))
					}
				}
			}
		}, () => {
			app.addCSS ("emoji".true (1), init)
		}, ( l, i ) => {
			Chat.con ("$!EMOJI!$: cfg error `?` line ?", l, i)
		})
	}

	const $RECENT_LIMIT = 30
	const $RE = /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u265f\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g
	const $EMOJI = $ => ($[0] = $[0].replace ($RE, "<span class=emoji \x01>$&</span \x03>"), $)

	let param = August.storage ("emoji")
	let $SearchIndex = null
	let $Category = []
	let $Emoji = {}
	let $Recent = JSON.parse (param ("recent") || "{}")
	let $Widget = new Map
	let $tpl = Chat.tpl ("emoji")
	let $MessHndlr = August.html.handler ("mess")
	let $NickHndlr = August.html.handler ("nick_code")

	Chat.Event.on ("app-done", done)
		.on ("user-reset", reset)
		.on ("cm-nick", nick)
	August.html.handler ("mess", ( ... $ ) => $MessHndlr (... $EMOJI ($)))
		.handler ("nick_code", ( ... $ ) => ($[0] = $[0].stripTags (), $NickHndlr (... $EMOJI ($))))
})
