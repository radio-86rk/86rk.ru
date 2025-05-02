//  Copyright (c) 2022 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: august.app-loader.js


august_run (() => {
	let Arg = Array.from (document.scripts)[0].src.match (/\?(.+?)#([-a-z\d]+):(.+?)(?::([a-z]{2}))?$/)
	if (!Arg)
		return alert ("Не заданы параметры приложения.")
	August.loadJS ("/js/august.app.js", window, Arg [1]).then (_ => {
		August.init ({ Version: Arg [3] })
		August.loadJS ("app.js").then (_ => {
			if ("serviceWorker" in navigator)
				navigator.serviceWorker.register (`sw.js?${Arg [3]}`)
			app.run (Arg [2], Arg [4]).august_version = Arg [1]
		}).catch (e => {
			console.log (e)
			alert ("Не удалось загрузить приложение.")
		})
	})
})

