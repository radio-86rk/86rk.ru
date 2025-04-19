//  August Chat System
//  Copyright (c) 2023 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.radio.js


August.initModule ("radio", function ( win ) {
	function handler ( e ) {
		if (e.type == "click") {
			for (let el = e.$; el != Widget; el = el.parent ()) {
				if (el == PlayButton) {
					Widget.hasClass ("play") ? stop () : play ()
					break
				} else if (el == NextButton) {
					next ()
					break
				} else if (el == GenreList) {
					genre (e.$.dataset.idx)
					break
				}
			}
			return
		} else if (e.type == "contextmenu") {
			for (let el = e.$; el != Widget; el = el.parent ()) {
				if (el == NextButton) {
					prev ()
					break
				}
			}
		} else if (e.type == "wheel") {
			if (e.$ == Widget.$("input.volume") && e.$.type == "range") {
				e.$.value = e.$.valueAsNumber - e.$.step * e.delta ()
				volume (e.$.vol ())
			} else if (e.$.parent ().parent () == GenreList) {
				if (GenreList.hasClass ("expand")) {
					let idx = GenreList.idx + e.deltaY.sign ()
					if (idx >= 0 && idx < Radio.length)
						GenreList.set (GenreList.idx = idx)
				}
			}
		} else if (e.type == "mouseout") {
			GenreList.to = win.setTimeout (contract, 1500)
		} else if (e.type == "mouseover") {
			win.clearTimeout (GenreList.to)
		}
		return e.stop ()
	}
	function contract () {
		GenreList.setClass ("expand", 0).set ()
	}
	function station () {
		let r = Radio [Genre]
		if (!r)
			return
		let Station = Widget.$("radio-station")
		param ("genre", r.genre)
		param ("url", r.radio [r.idx].url)
		Station.innerHTML = r.radio [r.idx].name
		GenreList.first ().el (Genre).className = "cur"
		scrollText (Station)
		NextButton.setClass ("disabled", r.radio.length < 2)
		contract ()
	}
	function play () {
		let r = Radio [Genre]
		if (!r)
			return
		Widget.setClass ("connect", 1)
		August.timer.stop (Audio.stopping)
		Audio.stopping = 0
		Audio.src = `${r.radio [r.idx].url}?${Date.now ()}`
		Audio.play ().then (() => {
			Widget.setClass ("play", 1)
			param ("play", true)
		}).catch (e => {
//			Chat.con ("$!RADIO!$: ?", e.message)
		})
	}
	function stop ( cb ) {
		if (Audio.paused || Audio.error)
			return cb && cb ()
		Widget.setClass ("play", 0).setClass ("connect", 0)
		param ("play", false)
		let vol = Audio.volume
		August.timer.stop (Audio.stopping)
		Audio.stopping = August.timer.start ({ timeout: Audio.volTimeout, callBack: ( id, t, c ) => {
			Audio.volume = vol * (Audio.volSteps - c) / Audio.volSteps
			if (c == Audio.volSteps) {
				Audio.stopping = 0
				Audio.currentTime = 0
				Audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA="
				Audio.pause ()
				August.timer.stop (id)
				$0(Time, (0).clock ())
				cb && cb ()
			}
		}})
	}
	function next () {
		let r = Radio [Genre]
		if (r.radio.length < 2)
			return
		if (++r.idx == r.radio.length)
			r.idx = 0
		station ()
		stop (play)
	}
	function prev () {
		let r = Radio [Genre]
		if (r.radio.length < 2)
			return
		if (--r.idx < 0)
			r.idx = r.radio.length - 1
		station ()
		stop (play)
	}
	function genre ( idx ) {
		GenreList.setClass ("expand")
		if (isSet (idx) && Genre != idx) {
			GenreList.first ().el (Genre).className = ""
			Genre = +idx
			station ()
			stop (play)
		}
		GenreList.idx = Genre
		GenreList.set ()
	}
	function volume ( v ) {
		August.timer.stop (Audio.volUp)
		Audio.volumeSave = v / 10.
		if (!Audio.stopping)
			Audio.volume = v / 10.
		param ("volume", v)
	}
	function scrollText ( el ) {
		win.cancelAnimationFrame (el.tm)
		if (el.scrollWidth == el.clientWidth)
			return
		let s = -1
		let d = 150
		el.scrollLeft = 0
		let scr = () => {
			if (!--d) {
				let sl = el.scrollLeft
				el.scrollLeft += s
				if (el.scrollLeft == sl) {
					s = -s
					d = 150
				} else {
					d = 3
				}
			}
			el.tm = win.requestAnimationFrame (scr)
		}
		scr ()
	}
	function online () {
		if (Audio.disconnected)
			stop (play)
		Audio.disconnected = 0
	}
	function offline () {
		Audio.disconnected = !Audio.paused
		stop ()
	}
	function done () {
		stop ()
		let vol = Widget.$("radio-volume")
		if (vol && vol.vol && vol.vol.done) {
			vol.vol.done ()
			vol.vol = null
		}
	}
	function init () {
		let g = param ("genre")
		let List = ""
		Radio.forEach (( r, i ) => {
			if (g == r.genre)
				Genre = i
			List += `<span data-idx=${i}>${r.genre}</span>`
		})
		if (Genre != -1) {
			let r = Radio [Genre]
			let url = param ("url")
			for (let i = 0; i < r.radio.length; i++) {
				if (r.radio [i].url == url) {
					r.idx = i
					break
				}
			}
		} else {
			Genre = 0
		}
		GenreList.innerHTML = `<div>${List}</div>`
		GenreList.set = function ( i ) {
			this.first ().s ({ top: `-${(isSet (i) ? i : Genre) * 100}%` })
		}
		GenreList.set ()
		station ()
		$0(Time, (0).clock ())
		Widget.noselect ()
		Widget.on ("click wheel contextmenu mouseover mouseout", handler)
		Audio.oncanplay = function ( e ) {
			Widget.setClass ("connect", 0).setClass ("error", 0)
			this.errorCount = 0
			this.volume = 0
			this.volUp = August.timer.start ({ timeout: this.volTimeout, callBack: ( id, t, c ) => {
				this.volume = this.volumeSave * c / this.volSteps
				if (c == this.volSteps || this.stopping)
					August.timer.stop (id)
			}})
		}
		Audio.ontimeupdate = function ( e ) {
			$0(Time, this.currentTime.clock (-8))
		}
		Audio.onended = function ( e ) {
			if (!this.paused)
				play ()
		}
		Audio.onpause = function ( e ) {
			Widget.setClass ("play", 0)
		}
		Audio.onerror = function ( e ) {
			if (this.src.startsWith ("data:", 0))
				return
			if (win.navigator.onLine && this.errorCount++ < 3)
				return win.setTimeout (play, 1000)
			this.errorCount = 0
			Widget.setClass ("error", 1).setClass ("play", 0).setClass ("connect", 0)
		}
		let p = param ("play") == "true"
		let v = parseFloat (param ("volume"))
		let vol = Widget.$("radio-volume") || Widget.$("input.volume")
		if (vol && vol.type == "range") {
			if (v === v)
				vol.value = +vol.max * Math.sqrt (+v / +vol.max)
			vol.vol = function () {
				if (vol.attr ("graph"))
					this.prop ("--volume", (this.valueAsNumber - +this.min) / +this.step | 0)
				return +this.max * ((this.valueAsNumber / +this.max) ** 2)
			}
			vol.oninput = function ( e ) {
				volume (vol.vol ())
			}
			volume (vol.vol ())
		} else if (vol) {
			August.loadJS ("august.round-volume.js").then (() => {
				vol.vol = new august_round_volume (vol, 0, 10, volume)
				if (v !== v)
					v = 5
				vol.vol.set (v)
				p && play ()
			})
			return
		}
		p && play ()
	}
	this.list = function () {
		return Radio
	}
	this.play = function () {
		stop (play)
	}
	this.station = function () {
		station ()
	}
	this.genre = function ( idx ) {
		return isSet (idx) ? genre (idx) : Genre
	}
	this.newGenre = function ( name ) {
		GenreList.first ().append ("span", {
			innerHTML: name
		}).dataset.idx = Radio.length
		Radio.push ({
			genre:	name,
			radio:	[],
			idx:	0
		})
	}
	this.init = function ( insert ) {
		let loadTPL = () => {
			Chat.loadTPL ("radio", tpl => {
				insert (`<radio>${tpl.radio}</radio>`)
				Widget = win.Chat.root.$("radio")
				Time = Widget.$("radio-time")
				GenreList = Widget.$("radio-genre")
				PlayButton = Widget.$("radio-play")
				NextButton = Widget.$("radio-next")
				if (GenreList && PlayButton && NextButton)
					init ()
			})
		}
		if (!isFunction (insert))
			return
		if (Radio.length)
			return loadTPL ()
		Chat.loadCFG2 ("radio", ( $1, $2, $3 ) => {
			if ($1) {
				if (Radio.length && !Radio.last ().radio.length)
					Radio.length--
				Radio.push ({
					genre:	$1,
					radio:	[],
					idx:	0
				})
			} else if (Radio.length) {
				Radio.last ().radio.push ({
					name:	$2.replaceAll (" - ", " &ndash; "),
					url:	$3.trim ()
				})
			}
		}, () => {
			Chat.addCSS ("radio", loadTPL)
		}, ( l, i ) => {
			Chat.con ("$!RADIO!$: cfg error `?` line ?", l, i)
		})
	}

	let Radio = []
	let Genre = -1
	let Widget = null
	let GenreList = null
	let PlayButton = null
	let NextButton = null
	let Time = null
	let param = August.storage ("radio")
	let Audio = new win.Audio
	Audio.errorCount = 0
	Audio.volSteps = 25
	Audio.volTimeout = 20

	Chat.Event.on ("online", online)
		.on ("offline", offline)
		.on ("destroy", done)
})
