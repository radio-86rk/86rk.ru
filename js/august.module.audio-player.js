//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.audio-player.js


August.initModule ("audio-player", function ( win ) {
	function august_player ( Player ) {
		let PlayBtn = Player.$("player-bttn#play")
		let SpeakerBtn = Player.$("player-bttn#speaker")
		let Title = Player.$("player-title")
		let Track = Player.$("player-slider.track")
		let Volume = Player.$("player-slider.volume")
		let Time = Player.$("player-time")
		let Dura = Player.$("player-dura")
		let Timedown = Player.$("player-timedown")
		let Type = Player.hasClass ("mini") ? "mini" : "normal"
		if (Title)
			Title.textContent = Player.dataset.title || Player.dataset.src
		Player.VolumeSlider = new august_slider (Volume, v => {
			VolTrack.s ({ width: `${v}%` })
			$Param (`volume.${Type}`, v)
			$Global.volume [Type] = v
			if (!v.set && Player.vh)
				Player.vh (v / 100)
			if (!v.set && Player.mh && Player.Mute)
				Player.mh (Player.Mute = 0), SpeakerBtn.setClass ("mute", 0)
		})
		let VolTrack = Volume.append ("div", { className: "track" })
		Player.VolumeSlider.set ($Global.volume [Type])
		Player.oncontextmenu = function ( e ) {
			e.stop ()
		}
		PlayBtn.oncontextmenu = function ( e ) {
			if (this.hasClass ("pause"))
				$Audio.pause (Player, () => Player.stop (0))
		}
		PlayBtn.onclick = function ( e ) {
			let Pause = this.setClass ("pause")
			Player.setClass ("play", Pause)
			if (Pause)
				$Audio.play (Player)
			else
				$Audio.pause (Player)
		}
		Player.stop = function ( t ) {
			PlayBtn.setClass ("pause", 0)
			this.setClass ("play", 0)
			this.vh = this.th = this.mh = void 0
			this.Time = t
			if (t)
				this.setTime (t)
		}
		Player.error = function () {
			this.stop (0)
			this.setClass ("error", 1)
		}
		Player.setTime = function ( t ) {
			this.Time = t
			if (Time)
				Time.innerHTML = t.clock (-3)
			if (Timedown)
				Timedown.innerHTML = (this.Dura - t).clock (-3)
			if (this.TrackSlider)
				this.TrackSlider.set (100 * t / this.Dura)
		}
		Player.setDura = function ( d ) {
			if (!isFinite (d))
				return
			this.Dura = d
			if (Dura)
				Dura.innerHTML = d.clock (-5)
			else if (Time)
				Time.attr ("dura", d.clock (-5))
		}
		Player.setHandlers = function ( vh, th, mh ) {
			Player.vh = vh
			Player.th = th
			Player.mh = mh
			Player.vh (this.VolumeSlider.get () / 100)
			Player.th (this.Time)
			Player.mh (this.Mute)
			Player.setClass ("error", 0)
		}
		Player.Dura = +Player.dataset.dura
		Player.Time = 0
		Player.Mute = 0
		Player.ID = ++$ID
		Player.setTime (0)
		Player.setDura (Player.Dura)
		Player.noselect ()

		if (SpeakerBtn) {
			SpeakerBtn.onclick = function () {
				Player.Mute = this.setClass ("mute")
				if (Player.mh)
					Player.mh (Player.Mute)
			}
		}
		if (Track) {
			let TrackTrack = Track.append ("div", { className: "track" })
			Player.TrackSlider = new august_slider (Track, v => {
				TrackTrack.s ({ width: `${v}%` })
				if (!v.set) {
					let t = v * Player.Dura / 100
					Player.setTime (t)
					if (Player.th)
						Player.th (t)
				}
			})
		}
		if (Title && Title.scrollWidth != Title.clientWidth) {
			Title.scrollLeft = 0
			let Win = Player.ownerDocument.defaultView
			let s = -1
			let d = 150
			let ani = () => {
				if (Win.Chat.body.contains (Player))
					Win.requestAnimationFrame (ani)
				if (--d)
					return
				let sl = Title.scrollLeft
				Title.scrollLeft += s
				if (Title.scrollLeft == sl) {
					s = -s
					d = 150
				} else {
					d = 3
				}
			}
			ani ()
		}
	}
	function august_audio () {
		function play ( pl ) {
			if ($Audio.stopping) {
				August.timer.stop ($Audio.stopping)
				$Audio.stopping = 0
				$Audio.pause ()
			}
			$Player = pl
			if ($Audio.ID != pl.ID) {
				$Audio.src = pl.dataset.src
				$Audio.ID = pl.ID
			}
			pl.setHandlers (volume, time, mute)
			if (!$Audio.currentTime)
				return $Audio.play ()
			$Audio.volume = 0
			$Audio.play ()
			$Audio.playing = August.timer.start ({ timeout: $VolTimeout, callBack: ( id, t, c ) => {
				$Audio.volume = $Audio.curVolume * c / $VolSteps
				if (c == $VolSteps || $Audio.stopping)
					August.timer.stop (id)
			}})
		}
		function stop ( cb ) {
			let vol = $Audio.volume
			$Audio.stopping = August.timer.start ({ timeout: $VolTimeout, callBack: ( id, t, c ) => {
				$Audio.volume = vol * ($VolSteps - c) / $VolSteps
				if (c == $VolSteps) {
					August.timer.stop (id)
					$Audio.pause ()
					$Audio.stopping = 0
					if ($Player)
						$Player.stop ($Audio.currentTime)
					cb && cb ()
				}
			}})
		}
		function volume ( v ) {
			August.timer.stop ($Audio.playing)
			$Audio.volume = $Audio.curVolume = v
		}
		function time ( v ) {
			$Audio.currentTime = v
		}
		function mute ( m ) {
			$Audio.muted = m
		}
		this.play = function ( pl ) {
			if ($Player && $Player != pl)
				stop (() => play (pl))
			else
				play (pl)
		}
		this.pause = function ( pl, cb ) {
			if (pl == $Player)
				stop (cb)
		}

		let $Audio = new win.Audio
		let $Player = null
		let $VolSteps = 30
		let $VolTimeout = 10

		$Audio.ontimeupdate = function ( e ) {
			if ($Player)
				$Player.setTime (this.currentTime)
		}
		$Audio.onended = function ( e ) {
			$Player.setDura (this.duration)
			$Player.stop (0)
			$Player = null
		}
		$Audio.onerror = function ( e ) {
			$Player.error ()
		}
	}
	function audio_attach ( ... $ ) {
		return isSet ($[2]) && isSet ($[3])
			? $tpl.audio_player.tpl ({
				SRC:	`//${Chat.Host}/attach/${$[1]}`,
				SINGER:	$[2].htmlEntities (),
				TITLE:	$[3].htmlEntities (),
				DURA:	$[4] / 1000 | 0
			})
			: $tpl.audio_player_mini.tpl ({
				SRC:	`//${Chat.Host}/attach/${$[1]}`,
				DURA:	$[4] / 1000 | 0
			})
	}
	function bot ( ... $ ) {
		return $[1] == "m"
			? $tpl.audio_player.tpl ({
				SINGER:	$[2],
				TITLE:	$[3],
				SRC:	$[4].htmlEntities (),
				DURA:	$[5]
			})
			: $BotHndlr (... $)
	}
	function init () {
		Chat.loadTPL (["audio-player", "audio-player-mini"], tpl => $tpl = tpl)
	}
	this.init = function () {
		Chat.addCSS ("audio-player".true (1), init)
	}

	let $BotHndlr = August.html.handler ("bot")
	let $Param = August.storage ("player", 50)
	let $Global = { volume: { normal: +$Param ("volume.normal"), mini: +$Param ("volume.mini") } }
	let $Audio = new august_audio ()
	let $tpl = null
	let $ID = 0

	August.html.handler ("audio_attach", audio_attach)
		.handler ("bot", bot)
	Chat.Event.on ("reinit", init)
		.on ("insert-mess", div => div.all ("audio-player").forEach (august_player))
})
