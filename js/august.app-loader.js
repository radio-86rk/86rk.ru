//  Copyright (c) 2022 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.app-loader.js


august_run (() => {
	let Arg = Array.from (document.scripts)[0].src.match (/\?(.+?)#([-a-z\d]+)(?::([a-z]{2}))?$/)
	if (!Arg)
		return alert ("Не заданы параметры приложения.")
	August.loadJS ("/js/august.app.js", window, Arg [1]).then (async () => {
		let r = await fetch (`app.version?${Date.now ()}`)
		let v = r.ok ? await r.text () : "0"
		August.init ({ Version: v })
		August.loadJS ("app.js").then (_ => {
			if ("serviceWorker" in navigator)
				navigator.serviceWorker.register (`sw.js?${v}`)
			app.run (Arg [2], Arg [3]).august_version = Arg [1]
		}).catch (e => {
			console.log (e)
			alert ("Не удалось загрузить приложение.")
		})
	})
})

