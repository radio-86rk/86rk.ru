//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.dictaphone.js


function august_dictaphone ( Widget, callBack ) {
	function handler ( e ) {
		if (!Widget.Ready) {
		} else if (e.type == "click") {
			if (e.$ == PlayButton && !Record) {
				Play = Widget.setClass ("play")
				switchMode ()
				if (Play)
					Player.play ()
				else
					Player.stop ()
			} else if (e.$ == RecordButton && !Play) {
				Record = Widget.setClass ("record")
				if (Record)
					Recorder.record ()
				else
					Recorder.stop ()
			}
		} else if (e.type == "dblclick") {
			if (e.$ == PlayButton && Play){
				Player.stop ()
				Player.reset ()
			}
		} else if (e.type == "wheel") {
			if ((e.$ == Volume || e.$ == VolumeInp) && VolumeInp.type == "range") {
				VolumeInp.value = VolumeInp.valueAsNumber - VolumeInp.step * e.delta ()
				VolumeInp.set ()
			}
		}
		e.stop ()
	}
	function player ( Wave, Time ) {
		function init ( b ) {
			let peaks = pps => {
				let sps = (b.sampleRate + pps - 1) / pps | 0
				let Peaks = []
				let absmax = 0
				let d = b.getChannelData (0)
				for (let i = 0; i < b.length; i += sps) {
					let min = 0
					let max = 0
					for (let j = 0; j < sps; j += 10) {
						let v = d [i + j] || 0
						if (max < v)
							max = v
						if (min > v)
							min = v
					}
					if (absmax < max)
						absmax = max
					if (absmax < -min)
						absmax = -min
					Peaks.push ({ min, max })
				}
				Peaks.absmax = absmax
				return Peaks
			}
			if (Wave) {
				let p = peaks (20)
				WaveCanvas.width = Wave2Canvas.width = Math.max (p.length, Wave.offsetWidth)
				WaveCanvas.height = Wave2Canvas.height = WaveCanvas.offsetHeight
				let ctx = WaveCanvas.getContext ("2d")
				ctx.fillStyle = Wave.dataset.color || "#0f0"
				ctx.fillRect (0, WaveCanvas.height >> 1, WaveCanvas.width, 1)
				let m = (WaveCanvas.height >> 1) / p.absmax
				p.forEach (( d, x ) => ctx.fillRect (x, (d.min + p.absmax) * m, 1, (d.max - d.min) * m))
				Wave2Canvas.getContext ("2d").drawImage (WaveCanvas, 0, 0, WaveCanvas.width, WaveCanvas.height)
				WaveCanvas.wave = Wave2Canvas.wave = 1
				Wave.len = p.length
				Wave.set (0)
			}
			Buffer = b
			StartPosition = LastTime = 0
		}
		function playedTime () {
			return AudioCtx.currentTime - LastTime
		}
		function time ( t ) {
			if (Wave) {
				let p = Wave.len * t / Buffer.duration + .5 | 0
				if (WaveCanvas.offsetWidth != p)
					Wave.set (p)
			}
			if (Time) {
				Time.t = t
				Time.set (t)
			}
		}
		this.play = function () {
			if (!Buffer) {
				Widget.setClass ("play", 0)
				Play = false
				return
			}
			if (Source)
				Source.disconnect ()
			LastTime = AudioCtx.currentTime
			Source = AudioCtx.createBufferSource ()
			Source.connect (Gain)
			Source.buffer = Buffer
			Source.start (0, StartPosition)
			Source.onended = () => {
				this.reset ()
				time (Buffer.duration)
				switchMode ()
			}
			let tic = () => {
				time (StartPosition + playedTime ())
				Source.tic = Win.requestAnimationFrame (tic)
			}
			tic ()
		}
		this.stop = function () {
			StartPosition += playedTime ()
			Source.stop (0)
			Source.disconnect ()
			Source.onended = null
			Time && Time.set (Buffer.duration)
			Win.cancelAnimationFrame (Source.tic)
		}
		this.reset = function () {
			Widget.setClass ("play", 0)
			Play = false
			StartPosition = 0
			Wave && Wave.set (0)
			Win.cancelAnimationFrame (Source.tic)
		}
		this.done = function () {
			if (Play)
				this.stop ()
			AudioCtx = Source = Gain = Buffer = null
			if (WaveCanvas)
				Wave.remove (WaveCanvas)
			if (Wave2Canvas)
				Wave.remove (Wave2Canvas)
		}
		this.volume = function ( v ) {
			if (!isSet (v))
				return Gain.gain.value
			Gain.gain.value = v
		}
		this.load = function ( Blob ) {
			let fr = new FileReader
			fr.onload = function () {
				AudioCtx.decodeAudioData (this.result).then (init).catch (e => {
					callBack (false, e)
				})
			}
			fr.readAsArrayBuffer (Blob)
		}

		let Buffer = null
		let WaveCanvas = Wave ? Wave.append ("canvas", { className: "play-wave" }) : null
		let Wave2Canvas = Wave ? Wave.append ("canvas", { className: "playing-wave" }) : null
		let StartPosition = 0
		let LastTime = 0
		let AudioCtx = new (window.AudioContext || window.webkitAudioContext)  //  !!! window
		let Source = null
		let Gain = AudioCtx.createGain ()
		Gain.connect (AudioCtx.destination)
		if (Wave) {
			Wave.set = p => {
				let set = ( w, l ) => Wave.props ({ "--width": w, "--left": l })
				if (!p)
					return set (0, 0)
				let l = -Wave.prop ("--left") | 0
				let w = Wave.offsetWidth
				let s = p - (w + 1 >> 1)
				let sm = WaveCanvas.offsetWidth - w
				let p2 = p - l
				if (p2 < 0 || p2 >= w)
					return
				if (s > sm && sm - l)
					l = -sm
				else if (s - l > 0 && s <= sm)
					l = -s
				else
					l = -l
				set (p + l, l)
			}
		}
	}
	function recorder ( Stream, Time ) {
		this.record = function () {
			if (Spectrum)
				Spectrum.reset ()
			let LastTime = AudioCtx.currentTime
			Recorder.ondataavailable = function ( e ) {
				Data.push (e.data)
				if (!AudioCtx)
					return
				let t = AudioCtx.currentTime - LastTime
				Time && Time.set (t)
				if (t >= TimeLimit)
					timeout ()
			}
			Recorder.onstop = function ( e ) {
				complete (new Blob (Data, { type: "audio/webm; codecs=opus" }))
				Data.clear ()
			}
			Recorder.start (100)
		}
		this.stop = function () {
			if (Recorder.state == "recording")
				Recorder.stop ()
		}
		this.done = function () {
			Stream.getAudioTracks ()[0].stop ()
			Stream = null
			if (Record)
				this.stop ()
			AudioCtx = Recorder = Source = Gain = Dest = FilterLo = FilterHi = null
		}
		this.analyser = function () {
			let Analyser = AudioCtx.createAnalyser ()
			Gain.connect (Analyser)
			return Analyser
		}
		this.volume = function ( v ) {
			if (!isSet (v))
				return Gain.gain.value
			Gain.gain.value = v
		}

		let Data       = []
		let AudioCtx   = new (Win2.AudioContext || Win2.webkitAudioContext)
		let Source     = AudioCtx.createMediaStreamSource (Stream)
		let Dest       = AudioCtx.createMediaStreamDestination ()
		let Gain       = AudioCtx.createGain ()
		let FilterLo   = AudioCtx.createBiquadFilter ()
		let FilterHi   = AudioCtx.createBiquadFilter ()
		let Recorder   = new MediaRecorder (Dest.stream, { mimeType: "audio/webm", audioBitsPerSecond: 80000 })
		Gain.connect (Dest)
		Source.connect (FilterLo)
		FilterLo.connect (FilterHi)
		FilterHi.connect (Gain)
		FilterLo.type = "lowpass"
		FilterLo.frequency.value = +Widget.dataset.lo || 8000
		FilterHi.type = "highpass"
		FilterHi.frequency.value = +Widget.dataset.hi || 100
	}
	function spectrum ( Wave, Volume ) {
		function spectrum () {
			Request = Win.requestAnimationFrame (spectrum)
			let Data = new Uint8Array (Analyser.frequencyBinCount)
			Analyser.getByteTimeDomainData (Data)

			let min = Math.min (... Data)
			let max = Math.max (... Data)
			if (WaveMin > min)
				WaveMin = min
			if (WaveMax < max)
				WaveMax = max
			let mm = (max - min) / 255
			if (Volume.mxv < mm || ++Volume.cfm == 30) {
				Volume.mxv = mm
				Volume.cfm = 0
				Volume.prop ("--peak", mm)
			}
			Volume.prop ("--level", mm)

			if (NUM_BARS) {
				let w = SpectrumCanvas.width = SpectrumCanvas.offsetWidth
				let h = SpectrumCanvas.height = SpectrumCanvas.offsetHeight
				let bw = w / NUM_BARS
				Analyser.getByteFrequencyData (Data)
				for (let i = 0; i < NUM_BARS; i++) {
					sCtx.fillStyle = `hsl(${Math.round ((i * 270) / NUM_BARS)},100%,50%)`
					sCtx.fillRect (i * bw + .25, h, bw - SPACING, -Data [i] / 255 * h)
				}
			}
			if (Record && ++TicTime == WAVE_TIC) {
				let w = WaveCanvas.width
				let h = WaveCanvas.height
				if (WaveTime == w) {
					wCtx.putImageData (wCtx.getImageData (1, 0, w - 1, h), 0, 0)
					wCtx.clearRect (w - 1, 0, 1, h)
				} else {
					WaveTime++
				}
				wCtx.fillRect (WaveTime - 1, WaveMin * h / 255, 1, (WaveMax - WaveMin) * h / 255 + .5)
				WaveMin = 255
				WaveMax = 0
				TicTime = 0
			}
		}
		this.reset = function () {
			WaveMin = 255
			WaveMax = WaveTime = TicTime = 0
			Volume.cfm = Volume.mxv = 0
			WaveCanvas.width = WaveCanvas.offsetWidth
			WaveCanvas.height = WaveCanvas.offsetHeight
			wCtx.fillStyle = Wave.dataset.color || "#0f0"
		}
		this.done = function () {
			Win.cancelAnimationFrame (Request)
			Wave.remove (SpectrumCanvas)
			Wave.remove (WaveCanvas)
			Analyser = null
		}

		let SpectrumCanvas = Wave.append ("canvas", { className: "spectrum" })
		let WaveCanvas = Wave.append ("canvas", { className: "rec-wave" })
		let sCtx = SpectrumCanvas.getContext ("2d")
		let wCtx = WaveCanvas.getContext ("2d")

		let WaveMin = 255
		let WaveMax = 0
		let WaveTime = 0
		let TicTime = 0
		let Request = 0
		const NUM_BARS = ~~Wave.dataset.bars
		const SPACING = ~~Wave.dataset.barspace
		const WAVE_TIC = 3

		let Analyser = Recorder.analyser ()
		Analyser.fftSize = NUM_BARS * 4 || 32
		Analyser.smoothingTimeConstant = .1
		Volume.cfm = Volume.mxv = 0
		spectrum ()
	}
	function complete ( b ) {
		Record = false
		callBack (b)
		if (Player)
			Player.load (b)
		if (Spectrum)
			Spectrum.reset ()
	}
	function timeout () {
		Widget.setClass ("record", 0)
		Recorder.stop ()
	}
	function switchMode () {
		VolumeInp.value = (Play ? Player : Recorder).volume ()
		VolumeInp.set ()
	}
	this.done = function () {
		if (!Widget.PreReady)
			return
		Widget.Ready = Widget.PreReady = false
		Widget.setClass ("play", 0).setClass ("record", 0).setClass ("ready", 0)
		Widget.un ("click dblclick contextmenu wheel", handler)
		if (Player)
			Player.done ()
		if (Spectrum)
			Spectrum.done ()
		if (Recorder)
			Recorder.done ()
		if (VolumeInp)
			VolumeInp.un ("input", VolumeInp.set)
		Player = Recorder = Spectrum = null
	}

	if (!window.AudioContext && !window.webkitAudioContext)
		return callBack (false, "AudioContext is not supported")
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
		return callBack (false, "mediaDevices is not supported")
	if (Widget.Ready || Widget.PreReady)
		return

	Widget.PreReady = true
	Widget.noselect ()

	let Win = Widget.ownerDocument.defaultView
	let Win2 = "chrome" in window ? window : Win
	let PlayButton = Widget.$("au-bttn#play")
	let RecordButton = Widget.$("au-bttn#record")
	let Wave = Widget.$("au-wave")
	let Time = Widget.$("au-time")
	let Volume = Widget.$("au-volume")
	let VolumeInp = Volume && Volume.$("input")

	let Player = null
	let Recorder = null
	let Spectrum = null
	let Play = false
	let Record = false
	const TimeLimit = 300

	if (Time) {
		Time.set = function ( t ) { this.textContent = t.clock (-37) }
		Time.set (0)
	}

	Win2.navigator.mediaDevices.getUserMedia ({ audio: { autoGainControl: true, noiseSuppression: true } }).then (s => {
		Recorder = new recorder (s, Time)
		Player = new player (Wave, Time)
		Widget.Ready = true
		Widget.setClass ("ready", 1)
		Widget.on ("click dblclick contextmenu wheel", handler)
		if (VolumeInp) {
			Player.volume (VolumeInp.valueAsNumber)
			if (VolumeInp.type == "range") {
				VolumeInp.set = function () {
					let p = (this.valueAsNumber - +this.min) / +this.step + .01 | 0
					if (p != this.p) {
						(Play ? Player : Recorder).volume (this.valueAsNumber)
						this.prop ("--volume", this.p = p)
					}
				}
				VolumeInp.set ()
				VolumeInp.on ("input", VolumeInp.set)
			}
		}
		if (Wave) {
			Spectrum = new spectrum (Wave, Volume)
		}
		callBack (true)
	}).catch (e => {
		callBack (false, e)
	})
}
