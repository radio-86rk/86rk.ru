//  Copyright (c) 2023 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: sw.js


const VERSION = location.search.substring (1)
const APP_NAME  = "ZEdit-86RK"
const CACHE_NAME  = `${APP_NAME}-${VERSION}`

self.addEventListener ("install", e => e.waitUntil (
	caches.open (CACHE_NAME).then (c => c.addAll ([
		`./fonts.json`,
		`./css/blue/app.css?${VERSION}`,
		`./css/green/app.css?${VERSION}`,
		`./css/orange/app.css?${VERSION}`,
		`./css/violet/app.css?${VERSION}`,
		`./help.ru.html?${VERSION}`,
		`./project.ru.html?${VERSION}`
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
		.then (r => r || fetch (e.request).then (r => (c.put (e.request, r.clone ()), r)))
	)
))

