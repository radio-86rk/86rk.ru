//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.webcam.js


August.initModule ("webcam", function ( win ) {
	function handler ( e ) {
		let el = e.$
		if (e.type == "click") {
			if (el == Video) {
				photo ()
			} else if (el == Photo) {
				Photo.toBlob (b => {
					Chat.Send.insertFile ("PHOTO", new File ([b], `photo_${Photo.time}`, { type: b.type, lastModified: Photo.time }))
				}, "image/webp", 1.)
			} else if (el.is ("IMG") && el.dataset.a == "view") {
				Chat.imgView (el)
			} else if (el.dataset.a == "close") {
				del_source (+el.dataset.id2)
				Chat.sendCmd (29, { wc: 3, ids: el.dataset.id2 })
			}
		} else if (e.type == "change") {
			if (el.name == "webcam_broadcast") {
				if (el.value == 0) {
					set_timer ()
					Viewers.clear ()
					August.timer.stop (TimerID)
					Chat.sendCmd (29, { wc: 4 })
				} else {
					Chat.sendCmd (29, { wc: 1, bc: el.value })
				}
			} else if (el.name == "webcam_period") {
				Period = +el.value
			} else if (el.name == "webcam_device") {
				Chat.VideoID = DeviceID = el.value
				Param ("id", el.value)
				stop ()
				start ()
			} else if (el.name == "webcam_res") {
				let [w, h] = el.value ? el.value.split (":") : [MAX.w, MAX.h]
				if (w > 100 && h > 100) {
					Video.srcObject.getVideoTracks ()[0].applyConstraints ({ width: +w, height: +h }).then (() => {
					}).catch (e => {
						Chat.error ("error", { ERROR: `${e.name}: ${e.message}` })
					})
				}
			}
		}
	}
	function photo () {
		visible (Photo, 1)
		rm_hint (Photo)
		Photo.getContext ("2d").drawImage (Video, 0, 0)
		Photo.time = Date.now ()
		Photo.hash = null
	}
	function send ( id ) {
		let Data = Photo.hash ? null : Photo.toDataURL ("image/webp", 1.)
		Photo.hash = Photo.hash || Data.md5 ()
		Chat.sendCmd (29, {
			wc:	5,
			add:	id,
			width:	Photo.width,
			height:	Photo.height,
			hash:	Photo.hash,
			photo:	Data
		})
	}
	function broadcast ( id ) {
		if (!Viewers.length) {
			Shown && visible (Photo)
			return
		}
		photo ()
		send (id)
		let Delay = Math.max (Period, 15) * 1000 + 1500
		TimerID = August.timer.start ({ timeout: 500, callBack: ( id, t ) => {
			set_timer ((Delay - t).clock (1))
			if (Video && Delay - t < 1000) {
				August.timer.stop (id)
				broadcast (0)
			}
		}})
	}
	function add_viewer ( id, el ) {
		if (el)
			el.setClass ("disable")
		if (Viewers.includes (id))
			return
		Viewers.push (id)
		if (Viewers.length == 1)
			broadcast (id)
		else
			send (id)
	}
	function del_viewer ( id ) {
		let idx = Viewers.indexOf (id)
		if (idx >= 0)
			Viewers.delete (idx)
		if (!Viewers.length) {
			if (Shown)
				visible (Photo)
			August.timer.stop (TimerID)
			set_timer ()
		}
	}
	function add_source ( id2 ) {
		if (!isSet (Sources [id2]))
			Chat.sendCmd (29, { wc: 2, id2 })
	}
	function del_source ( id2 ) {
		let p = Sources [id2]
		if (p) {
			p.v.parent ().remove (p.v)
			delete Sources [id2]
		}
		for (let id2 in Sources)
			return
		if (!Video)
			Chat.Win2.hide (1)
	}
	function set_timer ( t = "" ) {
		$0(Video && Video.next (), t)
	}
	function rm_hint ( el ) {
		el.parent ().attr ("hint", null)
	}
	function visible ( el, v ) {
		el.s ({ visibility: v ? "visible" : "hidden" })
	}
	function button ( c, id2 ) {
		return `<div class=button data-a=${c} data-id2=${id2}></div>`
	}
	function get_view () {
		return Views.append ("div", { className: "webcam-view" })
	}
	function set_view ( p ) {
		p.v.innerHTML = `<div data-id2=${p.id2} nick='${p.n.htmlEntities ()}'><img src=//${Chat.Host}/august/webcam/${User.ID4}/${p.id2.hex ()}/${p.hash} width=100% data-width=0 data-height=0 data-save=${p.hash} data-a=view crossorigin=use-credentials>${button ("close", p.id2)}</div>`
	}
	function view ( p ) {
		if (!Views) {
			let TAB = " &#10023; "
			$tpl.tpl ().webcam_broadcasts.tpl ({
				TAB_NAME:	n => (TAB = n, "")
			})
			Views = Shown ? Chat.Win2.add ("", TAB) : Chat.Win2.show ("", 0x16, self)
			Views.on ("click", handler)
		}
		if (p) {
			p.v = Sources [p.id2] ? Sources [p.id2].v : get_view ()
			set_view (p)
			Sources [p.id2] = p
		} else {
			for (let id2 in Sources) {
				Sources [id2].v = get_view ()
				set_view (Sources [id2])
			}
		}
	}
	function destroy () {
		Reinit = Video ? 0 : Recorder ? 6 : false
	}
	function reinit ( r ) {
		if (r && Reinit !== false) {
			self.init (Reinit)
			Reinit = false
		}
	}
	function start () {
		return navigator.mediaDevices.getUserMedia ({
			audio: false,
			video: {
				width:		Res && Res.w || MAX.w,
				height:		Res && Res.h || MAX.h,
				deviceId:	DeviceID
			}
		}).then (s => {
			Video.srcObject = s
		}).catch (e => {
			Chat.Win2.show (`${e.name}: ${e.message}`, 8)
		})
	}
	function stop () {
		if (Video) {
			Video.pause ()
			if (Video.srcObject) {
				Video.srcObject.getVideoTracks ()[0].stop ()
				Video.srcObject = null
			}
		}
	}
	async function init () {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			Chat.Win2.show ($tpl.tpl ().webcam.tpl ({
				TAB_NAME:	"",
				VIDEO:		"",
				PHOTO:		"",
				HTTPS:		"".true (win.location.protocol == "https:")
			}), 8, self)
			return
		}
		let DeviceList = await navigator.mediaDevices.enumerateDevices ().then (ds => ds.filter (d => d.kind == "videoinput").map (d => [d.deviceId, d.label]))
		DeviceID = Param ("id")
		if (!DeviceList.find (d => d [0] == DeviceID))
			Param ("id", DeviceID = DeviceList [0][0])
		Chat.VideoID = DeviceID

		let TAB1 = " &#9114; ", TAB2 = " &Xi; ", TAB3 = " &#9881; "
		$tpl.tpl ().webcam_recorder.tpl ({
			TAB_NAME:	n => (TAB1 = n, "")
		})
		let HTML2 = $tpl.tpl ().webcam.tpl ({
			TAB_NAME:	n => (TAB2 = n, ""),
			VIDEO:		h => `<div class=video hint='${(h || "").htmlEntities ()}'><video style='visibility: hidden' autoplay></video><div class=timer></div></div>`,
			PHOTO:		h => `<div class=photo hint='${(h || "").htmlEntities ()}'><canvas style='visibility: hidden'></canvas></div>`
		})
		let HTML3 = $tpl.tpl ().webcam_setup.tpl ({
			TAB_NAME:	n => (TAB3 = n, ""),
			DEVICE:		DeviceID,
			DEVICE_LIST:	DeviceList.length > 1 ? JSON.stringify (DeviceList) : null,
			RESOLUTION:	Res ? `${Res.w}:${Res.h}` : ``,
			WIDTH:		"<span id=webcam_width></span>",
			HEIGHT:		"<span id=webcam_height></span>"
		})
		let Tabs = Chat.Win2.show ([{ t: "", b: TAB1 }, { t: HTML2, b: TAB2 }, { t: HTML3, b: TAB3 }], Views ? 0x54 : 0x34, self)
		if (!Tabs)
			return

		Video = Tabs [1].$("video")
		Photo = Tabs [1].$("canvas")
		if (!Video || !Photo)
			return

		Shown = 1
		Video.onresize = e => {
			let w = Video.videoWidth
			let h = Video.videoHeight
			$0($("webcam_width", win), w)
			$0($("webcam_height", win), h)
			Photo.width  = w
			Photo.height = h
			Res = w > h ? { w, h } : { w: h, h: w }
		}
		start ().then (() => {
			if (!Video)
				return
			visible (Video, 1)
			rm_hint (Video)
			Tabs [1].on ("click", handler)
			Tabs [2].on ("change", handler)
			Chat.Win2.set (0x116)
			Chat.Win2.tab_btn (1)
			if (Views) {
				Views.un ("click", handler)
				Views = null
				view ()
			}
			Chat.Win2.tab (1)
		})
	}
	this.select = function ( n ) {
		if (n || Recorder)
			return
		Chat.Win2.show ("", 0x200)
		Chat.videoWidget = Chat.Win2.show ("", 0x13, this)
		Chat.loadModule ("video-recorder", [Chat, "video-recorder", r => {
			Recorder = r
			Shown = 1
			if (!r)
				return
			let pwr = r.$("video-bttn#power")
			if (pwr) pwr.onclick = () => {
				Chat.Win2.show ("", 0x200)
				init ()
			}
		}, {
			res:	Res,
			id:	DeviceID
		}])
	}
	this.ready = function () {
		return !!Photo
	}
	this.shown = function () {
		return Shown
	}
	this.done = function () {
		if (Recorder)
			return Recorder.del (), Recorder = null
		stop ()
		August.timer.stop (TimerID)
		Chat.sendCmd (29, { wc: 4, ids: Object.keys (Sources).join (":") })
		let Tabs = Chat.Win2.get_tabs ()
		if (Tabs && Tabs [2]) {
			Tabs [1].un ("click", handler)
			Tabs [2].un ("change", handler)
		}
		if (Views)
			Views.un ("click", handler)
		Video = Photo = Views = null
		Shown = Period = 0
		Sources = {}
		Viewers.clear ()
	}
	this.init = function ( a, p, el ) {
		if (!a && Shown)
			return Shown = 0, Chat.Win2.hide (1)
		if (!a && !User.privWebcam ())
			return Chat.error ("deny")
		Chat.addCSS ("webcam", () => $tpl.get (r => {
			switch (~~a) {
				case 0: return init ()
				case 1: return add_viewer (p, el)
				case 2: return del_viewer (p)
				case 3: return add_source (p)
				case 4: return del_source (p)
				case 5: return view (p)
				case 6: return this.select (0)
			}
		}))
	}

	const MAX = { w: 3840, h: 2160 }

	let $tpl = Chat.tpl (["webcam", "webcam-setup", "webcam-broadcasts", "webcam-recorder"])
	let Param = August.storage ("webcam", null)
	let Video = null
	let Photo = null
	let Views = null
	let Recorder = null
	let Res = null
	let DeviceID = null
	let Shown = 0
	let TimerID = 0
	let Period = 0
	let Sources = {}
	let Viewers = []
	let Reinit = false
	let self = this

	Chat.Event.on ("destroy", destroy)
		.on ("reinit", reinit)
})
