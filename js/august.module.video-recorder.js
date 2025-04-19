//  August Chat System
//  Copyright (c) 2021 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.video-recorder.js


August.initModule ("video-recorder", function ( win ) {
	function widget ( app ) {
		return app.videoWidget.append ("chat-recorder", {
			done () {
				this.del ()
			},
			del () {
				if (!this.recorder)
					return
				app.videoWidget.setClass ("video-recorder", 0)
				this.recorder.done ()
				this.recorder = null
				app.videoWidget.remove (this)
				$Rec.delete (app)
			}
		})
	}
	function done ( app ) {
		let r = app && $Rec.get (app)
		if (r)
			r.del ()
	}
	function reset () {
		$tpl.reset ()
		for (let [app, r] of $Rec)
			r.del ()
	}
	this.init = function ( app, css = "video-recorder", cb = null, opt = null ) {
		if (!app)
			return
		if (August.now () - $Last < 500)
			return
		if (!User.privWebcam ())
			return app.error ("deny")
		if (!app.videoWidget)
			return app.error ("error", { ERROR: "`videoWidget` not found" })
		$Last = August.now ()
		august_run (() => app.addCSS (css, () => $tpl.get (( tpl, eq ) => {
			let Rec = $Rec.get (app)
			let Ready = eq && Rec
			if (!Rec)
				$Rec.set (app, Rec = widget (app))
			if (!Ready)
				Rec.innerHTML = tpl.video_recorder.tpl (Chat.$ERROR_CFG)
			August.sync (app.win, () => {
				let Shown = app.videoWidget.setClass ("video-recorder")
				if (!Shown)
					return Rec.done ()
				Rec.recorder = new august_video_recorder (Rec.$("video-recorder"), ( r, e ) => {
					if (r === true)
						cb && cb (Rec)
					else if (r === false)
						app.error ("videorecorder", { ERROR: e }), Rec.del (), cb && cb (null)
					else
						app.Send.insertFile ("VIDEO", new File ([r], `video_${Date.now ()}`, { type: r.type }))
				}, opt)
			})
		})), [window.august_video_recorder ? null : "august.video-recorder.js"])
	}

	let $tpl = Chat.tpl ("video-recorder")
	let $Rec = new Map
	let $Last = 0

	Chat.Event.on ("app-done", done)
		.on ("user-reset", reset)
})
