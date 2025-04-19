//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.modal.js


August.initModule ("modal", function ( win ) {
	function close ( e ) {
		if (!$Module || $Module.closed || e.view != win)
			return
		$sb && $sb.done ()
		$Options && $Options.close && $Options.close ()
		$Module.closed = 1
		$Module.setClass ("show")
		$Module.fire ("modal").un ("contextmenu", contextmenu)
		Chat.Event.un ("escape-key", close)
		win.Chat.removeFocus ()
		win.Chat.focus ()
		win.setTimeout (() => {
			if (!$Module)
				return
			win.Chat.root.remove ($Module)
			$Module = $Options = $sb = null
		}, $Module.td ("opacity"))
		if (e)
			return e.stop ()
	}
	function contextmenu ( e ) {
		if (opt ("noescapekey"))
			e.stop ()
		else
			close (e)
	}
	function show ( t ) {
		if (isObject (t)) {
			$Options = t.options
			t = t.html || ""
		}
		win.Chat.root.append ($Module)
		win.Chat.setFocus (null)
		let sb = window.august_scrollbar && !opt ("noscrollbar")
		let ctrl = $Module.append ("modal-ctrl")
		let view = $Module.append ("modal-view", { innerHTML: sb ? `<modal-view>${t}</modal-view>` : t })
		view.tabIndex = -1
		view.focus ()
		view.noselect ()
		ctrl.append ("b").on ("click", close)
		$Module.setClass ("show")
		$Module.fire ("modal", 1).on ("contextmenu", contextmenu)
		if (!opt ("noescapekey"))
			Chat.Event.on ("escape-key", close)
		if (sb)
			$sb = new august_scrollbar (view.$("modal-view"), 3)
		return Object.assign (view, {
			get root () { return sb ? view.$("modal-view") : view },
			get sb () { return $sb },
			addCSS ( css ) { addCSS (css); return this },
			setClass ( cls, set = 1 ) { $Module.setClass (cls, set); return this }
		})
	}
	function addCSS ( css ) {
		let id = `modal_css_${css.md5 ()}`
		if ($(id, win))
			return
		win.document.head.append ("link", {
			rel:	"stylesheet",
			type:	"text/css",
			href:	"data:text/css;base64," + css,
			id:	id
		})
	}
	function opt ( n ) {
		return $Options && $Options [n]
	}
	this.close = function ( e ) {
		close (e)
	}
	this.init = function ( text, css ) {
		if ($Module)
			return
		$Module = win.document.createElement ("modal-module")
		Chat.addCSS (css || [], () => {
			if (css)
				$Module.setClass (css)
			if (isFunction (text))
				return text (show)
			$Module.setClass (text)
			Chat.http ().send (`txt/${text}.${Chat.Lang}.txt`, ( r, s ) => {
				if (s < 300)
					return show (r.replaceAll (" - ", " &mdash; "))
				Chat.error ("text")
				$Module = null
			})
		})
	}

	addCSS ("bW9kYWwtbW9kdWxlIHsKCWRpc3BsYXk6IGJsb2NrOwoJcG9zaXRpb246IGFic29sdXRlOwoJei1pbmRleDogOTk5OTsKCWxlZnQ6IDA7CglyaWdodDogMDsKCXRvcDogMDsKCWJvdHRvbTogMDsKCXBhZGRpbmc6IHZhcigtLW1vZGFsLXBhZGRpbmcsIDMwcHggNiUpOwoJYmFja2dyb3VuZDogdmFyKC0tbW9kYWwtYmcsICMwMDA2KTsKCW9wYWNpdHk6IDA7Cgl0cmFuc2l0aW9uOiBvcGFjaXR5IC41czsKCS0tY3RybC1zaXplOiAxN3B4Owp9Cm1vZGFsLW1vZHVsZS5zaG93IHsKCW9wYWNpdHk6IDEgIWltcG9ydGFudDsKfQptb2RhbC1tb2R1bGU+bW9kYWwtY3RybCB7CglkaXNwbGF5OiBibG9jazsKCXBvc2l0aW9uOiBhYnNvbHV0ZTsKCXotaW5kZXg6IDI7CglyaWdodDogdmFyKC0tY3J0bC1yaWdodCwgY2FsYyg2JSArIDMwcHgpKTsKCXRvcDogdmFyKC0tY3J0bC10b3AsIDE4cHgpOwp9Cm1vZGFsLW1vZHVsZT5tb2RhbC1jdHJsPmIgewoJZGlzcGxheTogYmxvY2s7CgliYWNrZ3JvdW5kOiB1cmwoImRhdGE6aW1hZ2Uvc3ZnK3htbCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDI4IDI4Jz48cGF0aCBmaWxsPSclMjNmMDAnIGQ9J00yMy4xLDBMMTQsOS4xTDQuOSwwTDAsNC45TDkuMSwxNEwwLDIzLjFMNC45LDI4bDkuMS05LjFsOS4xLDkuMWw0LjktNC45TDE4LjksMTRMMjgsNC45TDIzLjEsMHonLz48L3N2Zz4iKSBuby1yZXBlYXQ7Cgl3aWR0aDogdmFyKC0tY3RybC13aWR0aCwgdmFyKC0tY3RybC1zaXplKSk7CgloZWlnaHQ6IHZhcigtLWN0cmwtaGVpZ2h0LCB2YXIoLS1jdHJsLXNpemUpKTsKCWJvcmRlcjogdmFyKC0tY3RybC1ib3JkZXIsIDZweCBzb2xpZCAjZmZmKTsKCWJvcmRlci1yYWRpdXM6IHZhcigtLWN0cmwtcmFkaXVzLCA1MCUpOwoJYm94LXNoYWRvdzogdmFyKC0tY3RybC1zaGFkb3csIDAgMCA1cHggIzAwYywgMCAwIDAgMXB4ICMwMGMzKTsKCWJhY2tncm91bmQtY29sb3I6IHZhcigtLWN0cmwtYmcsICNmZmYpOwoJb3BhY2l0eTogdmFyKC0tY3RybC1vcGFjaXR5LCAuOSk7CglmaWx0ZXI6IHZhcigtLWN0cmwtZmlsdGVyKTsKfQptb2RhbC1tb2R1bGU+bW9kYWwtY3RybD5iOjphZnRlciB7Cgljb250ZW50OiAiIjsKCWRpc3BsYXk6IGJsb2NrOwoJd2lkdGg6IDEwMCU7CgloZWlnaHQ6IDEwMCU7CgliYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jdHJsLWRlY29yLWJnLCAjODAwKTsKCW1peC1ibGVuZC1tb2RlOiBjb2xvcjsKfQptb2RhbC1tb2R1bGU+bW9kYWwtY3RybD5iOmhvdmVyIHsKCW9wYWNpdHk6IDE7Cn0KbW9kYWwtbW9kdWxlPm1vZGFsLWN0cmw+Yjpob3Zlcjo6YWZ0ZXIgewoJYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY3RybC1kZWNvci1ob3Zlci1iZywgI2YwMCk7Cn0KbW9kYWwtbW9kdWxlPm1vZGFsLWN0cmw+YjphY3RpdmUgewoJYm94LXNoYWRvdzogdmFyKC0tY3RybC1hY3RpdmUtc2hhZG93LCAwIDAgMCAxcHggIzAwYzMpOwoJdHJhbnNmb3JtOiB0cmFuc2xhdGUoMXB4LCAxcHgpOwp9Cm1vZGFsLW1vZHVsZT5tb2RhbC12aWV3IHsKCWZvbnQ6IHZhcigtLXZpZXctZm9udCk7Cglmb250LXdlaWdodDogdmFyKC0tdmlldy1mdyk7Cgljb2xvcjogdmFyKC0tdmlldy1jb2xvcik7CgliYWNrZ3JvdW5kOiB2YXIoLS12aWV3LWJnKTsKCWJvcmRlcjogdmFyKC0tdmlldy1ib3JkZXIpOwoJYm9yZGVyLXJhZGl1czogdmFyKC0tdmlldy1icik7CglwYWRkaW5nOiB2YXIoLS12aWV3LXBhZGRpbmcpOwoJdGV4dC1zaGFkb3c6IHZhcigtLXZpZXctdGV4dC1zaGFkb3cpOwoJYm94LXNoYWRvdzogdmFyKC0tdmlldy1zaGFkb3csIGluc2V0IDAgMCAzcHggIzAwMDQpOwoJb3ZlcmZsb3c6IGF1dG87CglvdXRsaW5lOiBub25lOwp9Cm1vZGFsLW1vZHVsZT5tb2RhbC12aWV3Pm1vZGFsLXZpZXcgewoJcGFkZGluZzogdmFyKC0tdmlldzItcGFkZGluZyk7Cn0KbW9kYWwtdmlldyB7CglkaXNwbGF5OiBibG9jazsKCXdpZHRoOiAxMDAlOwoJaGVpZ2h0OiAxMDAlOwoJcG9zaXRpb246IHJlbGF0aXZlOwoJei1pbmRleDogMTsKCWJveC1zaXppbmc6IGJvcmRlci1ib3g7Cn0KbW9kYWwtbW9kdWxlPm1vZGFsLXZpZXc+c2Nyb2xsYmFyIHsKCXJpZ2h0OiB2YXIoLS12aWV3LXNiLXJpZ2h0LCAwKTsKCW9wYWNpdHk6IHZhcigtLXZpZXctc2Itb3BhY2l0eSk7Cn0KbW9kYWwtbW9kdWxlPm1vZGFsLXZpZXcuc2Nyb2xsYmFyIHsKCW92ZXJmbG93OiB1bnNldDsKfQpAbWVkaWEgKG1heC13aWR0aDogNjgwcHgpIHsKCW1vZGFsLW1vZHVsZSB7CgkJLS1tb2RhbC1wYWRkaW5nOiAwOwoJCS0tY3J0bC1yaWdodDogMnB4OwoJCS0tY3J0bC10b3A6IDJweDsKCX0KfQoK")

	let $Module = null
	let $Options = null
	let $sb = null
})
