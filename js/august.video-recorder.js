//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.video-recorder.js


function august_video_recorder ( Widget, callBack, opt ) {
	function handler ( e ) {
		if (!Widget.Ready) {
		} else if (e.type == "click") {
			if (e.$ == PlayButton && !Record) {
				Play = Widget.setClass ("play")
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
			} else if ((e.$ == Video && Webcam) || (e.$ == VideoCam && !Webcam)) {
				if (Video.src)
					Webcam = Widget.setClass ("webcam")
			}
		} else if (e.type == "wheel") {
			if (e.$ == VolumeInp && VolumeInp.type == "range") {
				VolumeInp.value = VolumeInp.valueAsNumber - VolumeInp.step * e.delta ()
				VolumeInp.set ()
			}
		} else if (e.type == "change") {
			if (e.$ == ResSelect) {
				let [w, h] = e.$.value ? e.$.value.split (":") : [MAX.w, MAX.h]
				if (w > 100 && h > 100 && !Play && !Record)
					Recorder.resolution (+w, +h)
			}
		}
		e.stop ()
	}
	function player () {
		function update () {
			if (Time)
				Time.set (Video.currentTime * 1000 | 0)
			if (TrackSlider)
				TrackSlider.set (100 * Video.currentTime / Video.duration)
		}
		function init () {
			let t = Video.duration * 1000 | 0
			if (Time)
				Time.set (t)
			if (Dura)
				Dura.set (t)
		}
		this.init = function ( b ) {
			Video.src = Win.URL.createObjectURL (b)
		}
		this.play = function () {
			if (!Video.src) {
				Play = Widget.setClass ("play")
				return
			}
			if (TrackSlider && TrackSlider.get () == 100)
				TrackSlider.set (0)
			Video.play ()
			Video.currentTime += 0  //  google chrome bugfix
			Video._int = setInterval (update, 100)
		}
		this.stop = function () {
			Video.pause ()
		}
		this.done = function () {
			this.stop ()
			if (Video.src)
				Win.URL.revokeObjectURL (Video.src)
			Video.attr ("src", null)
		}

		Video.onloadedmetadata = e => {
			if (Video.duration !== Infinity)
				return init ()
			//  google chrome bugfix
			Video.currentTime = Number.MAX_SAFE_INTEGER
			Video.ontimeupdate = () => {
				init ()
				Video.currentTime = 0
				Video.ontimeupdate = null
			}
		}
		Video.onpause = e => {
			Play = 0
			Widget.setClass ("play", 0)
			clearInterval (Video._int)
			update ()
		}
	}
	function recorder ( s ) {
		this.resolution = function ( width, height ) {
			if (Recorder && Recorder.state != "inactive")
				return
			s.getVideoTracks ()[0].applyConstraints ({ width, height }).then (() => {
				Recorder = null
				VideoCam.load ()
			}).catch (e => {
				console.error ("august_video_recorder: applyConstraints", e)
			})
		}
		this.record = function () {
			if (!Recorder)
				return
			if (Time)
				Time.set (0)
			if (Dura)
				Dura.set (0)
			if (TrackSlider)
				TrackSlider.set (0)

			Webcam = 1
			Widget.setClass ("webcam", 1)
			Player.done ()
			Recorder.start (10)
		}
		this.stop = function () {
			if (Recorder && Recorder.state == "recording") {
				Record = 0
				Widget.setClass ("record", 0)
				Recorder.stop ()
			}
		}
		this.done = function () {
			if (Recorder)
				Recorder.ondataavailable = Recorder.onstop = null
			this.stop ()
			Recorder = null
			VideoCam.pause ()
			VideoCam.srcObject.getVideoTracks ()[0].stop ()
			VideoCam.srcObject.getAudioTracks ()[0].stop ()
			VideoCam.srcObject = null
		}

		let DataSize = 0
		let Starts = 0
		let Blobs = []
		let Recorder = null
		VideoCam.muted = true
		VideoCam.autoplay = true
		VideoCam.srcObject = s
		VideoCam.onplay = e => {
			Widget.setClass ("webcam", 1)
			Recorder = new MediaRecorder (s, { mimeType: Codec })
			Recorder.onstart = e => {
				Starts = VideoCam.currentTime
				DataSize = 0
			}
			Recorder.ondataavailable = e => {
				if (e.data && e.data.size > 0)
					Blobs.push (e.data), DataSize += e.data.size
				let t = VideoCam.currentTime - Starts
				if (DataSize > MAX_DATA_SIZE)
					this.stop ()
				if (Time)
					Time.set (t * 1000 | 0)
			}
			Recorder.onstop = e => {
				let VideoBlob = new Blob (Blobs, { type: "video/webm" })
				Blobs.clear ()
				Player.init (VideoBlob)
				callBack (VideoBlob)
			}
		}
		VideoCam.onresize = e => {
			if (ResSelect) {
				let w = VideoCam.videoWidth
				let h = VideoCam.videoHeight
				let val = w > h ? `${w}:${h}` : `${h}:${w}`
				ResSelect.value = val
				if (ResSelect.value != val)
					ResSelect.value = ""
			}
		}
	}
	function get_codec () {
		for (let c of ["video/webm;codecs=vp9", "video/webm;codecs=h264", "video/webm;codecs=vp8,opus"]) {
			if (MediaRecorder.isTypeSupported (c))
				return c
		}
	}
	this.done = function () {
		if (!Widget.Ready)
			return
		Widget.Ready = false
		Widget.setClass ("play", 0).setClass ("record", 0).setClass ("ready", 0)
			.un ("click change contextmenu wheel", handler)
		if (Player)
			Player.done ()
		if (Recorder)
			Recorder.done ()
		if (Track)
			Track.remove (TrackSlider.Track), TrackSlider.done ()
		Player = Recorder = TrackSlider = null
		if (VolumeInp)
			VolumeInp.un ("input", VolumeInp.set)
	}

	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
		return callBack (false, "mediaDevices is not supported")
	if (Widget.Ready)
		return

	const MAX_DATA_SIZE = 99 * 1024 * 1024
	const MAX = { w: 3840, h: 2160 }

	let Codec = get_codec ()
	let Win = Widget.ownerDocument.defaultView
	let Win2 = "chrome" in window ? window : Win
	let VideoCam = Widget.$("video#webcam")
	let Video = Widget.$("video#video")
	let PlayButton = Widget.$("video-bttn#play")
	let RecordButton = Widget.$("video-bttn#record")
	let Time = Widget.$("video-time#time")
	let Dura = Widget.$("video-time#dura")
	let Track = Widget.$("video-slider.track")
	let VolumeInp = Widget.$("video-volume>input")
	let ResSelect = Widget.$("video-res>select")

	if (!Codec)
		return callBack (false, "MediaRecorder: no codecs found")
	if (!VideoCam || !Video)
		return callBack (false, "no `video#webcam` or `video#video`")

	let TrackSlider = null
	let Player = null
	let Recorder = null
	let Play = false
	let Record = false
	let Webcam = 1

	Win2.navigator.mediaDevices.getUserMedia ({
		audio: {
			echoCancellation: true
		},
		video: {
			width:		{ ideal: opt && opt.res && opt.res.w || MAX.w, max: MAX.w },
			height:		{ ideal: opt && opt.res && opt.res.h || MAX.h, max: MAX.h },
			deviceId:	opt && opt.id || null
		}
	}).then (s => {
		Recorder = new recorder (s)
		Player = new player ()

		Widget.Ready = true
		Widget.setClass ("ready", 1).setClass ("webcam", 1).noselect ()
			.on ("click change contextmenu wheel", handler)
		for (let t of [Time, Dura]) {
			if (t) {
				t.set = function ( t ) { this.textContent = t.clock (37) }
				t.set (0)
			}
		}
		if (VolumeInp && VolumeInp.type == "range") {
			VolumeInp.set = function () {
				let p = (this.valueAsNumber - +this.min) / +this.step + .01 | 0
				if (p != this.p) {
					Video.volume = this.valueAsNumber
					this.s ({ backgroundPosition: `0 -${this.offsetHeight * p}px` })
					this.p = p
				}
			}
			VolumeInp.on ("input", VolumeInp.set).set ()
		}
		if (!Track)
			return

		TrackSlider = new august_slider (Track, v => {
			TrackSlider.Track.s ({ width: `${v}%` })
			if (!v.set)
				Video.currentTime = v * Video.duration / 100
		})
		TrackSlider.Track = Track.append ("div", { className: "track" })
		let tl = Track.$("video-timeline")
		if (tl) Track.on ("mousemove", e => {
			let max = Track.offsetWidth
			let x = e.offsetX
			e.$.up (Track, el => (x += el.offsetLeft, 1))
			x = x.clamp (0, max)
			tl.s ({ left: `${x}px` })
			tl.textContent = (Video.duration * x / max).clock (-37)
		})
		callBack (true)
	}).catch (e => {
		callBack (false, e)
	})
}
