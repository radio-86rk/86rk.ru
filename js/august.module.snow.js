//  August Chat System
//  Copyright (c) 2020 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.snow.js


August.initModule ("snow", function ( win ) {
	function snow () {
		let p = 100 / $Count
		for (let i = 0; i < $Count; i++) {
			let Snow = win.Chat.root.append ("snow")
			Snow.className = `s${Math.rnd (1, 3) | 0} d${i}`
			Snow.s ({
				left: `${(p * i + Math.rnd (0, p)).toFixed (1)}%`,
				animationDuration: `${Math.rnd (15, 31).toFixed (1)}s`,
				animationDelay: `${Math.rnd (0, 20).toFixed (1)}s`,
				transform: `scale(${(Math.rnd (6, 10) / 10).toFixed (1)})`
			})
		}
		
	}
	this.init = function () {
		Chat.addCSS ("snow", () => {
			let style = win.document.head.append ("style")
			for (let i = 0; i < $Count; i++) {
				style.sheet.insertRule (`.app-chat>snow.d${i}::before {}`, i)
				let ss = style.sheet.cssRules [i].style
				ss.animationDuration = `${Math.rnd (4, 9).toFixed (1)}s`
				ss.opacity = (Math.rnd (4, 10) / 10).toFixed (1)
			}
			snow ()
		})
	}

	let $Count = Math.rnd (8, 16) | 0
	Chat.Event.on ("reinit", r => r && snow ())
})
