//  Copyright (c) 2025 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: sw.js


const VERSION = "1.2.4"
const APP_NAME  = "Emul-86RK"
const CACHE_NAME  = `${APP_NAME}-${VERSION}`

self.addEventListener ("install", e => e.waitUntil (
	caches.open (CACHE_NAME).then (c => c.addAll ([
		`./css/blue/app.css?${VERSION}`,
		`./help.ru.html?${VERSION}`,
		`./custom-conf.ru.html?${VERSION}`,
		`./debuger.ru.html?${VERSION}`,
		`./js/august.debuger_86rk.js?${VERSION}`,
		`../disassm/js/august.disassm.js?${VERSION}`
	]))
	.then (() => self.skipWaiting ())
))

self.addEventListener ("activate", e => e.waitUntil (
	caches.keys ().then (keys => Promise.all (
		keys.filter (key => key.startsWith (APP_NAME) && key != CACHE_NAME)
			.map (key => caches.delete (key))
	))
	.then (() => self.clients.claim ())
))

self.addEventListener ("fetch", e => e.request.url.startsWith ("https") && e.respondWith (
	caches.open (CACHE_NAME).then (c => c.match (e.request)
		.then (r => checkResponse (r) || fetch (e.request).then (r => (c.put (e.request, r.clone ()), r)))
	)
))

function checkResponse ( r ) {
	return r && !r.url.includes ("catalog.json.php") ? r : false
}

