
august_run (() => {
	August.loadCSS (window, "mega", ".", err => {
		if (err)
			return
		fetch ("tpl/mega.tpl").then (r => r.text ()).then (tpl => fetch (`mega-86rk.json?${Date.now ()}`).then (r => r.json ()).then (STAT => {
			let Features = []
			let Microcode = []
			document.body.innerHTML = tpl.tpl ({
				FEATURES_LIST:	f => { for (let n in f) Features.push ({ s: STAT.FEATURES [n], t: f [n] }); return "" },
				MICROCODE_LIST:	f => { for (let n in f) Microcode.push ({ s: STAT.MICROCODE [n], t: f [n] }); return "" },
			}).pattern ({
				FEATURES: [{
					FEATURE		() { return this.$f.t },
					STAT		() { return this.$f.s },
					$size		() { return this.$list.length },
					$set		() { this.$f = this.$list [this.$n ()] },
					$list:		Features
				}],
				MICROCODE: [{
					MICROCODE	() { return this.$m.t },
					STAT		() { return this.$m.s },
					$size		() { return this.$list.length },
					$set		() { this.$m = this.$list [this.$n ()] },
					$list:		Microcode
				}]
			})
		})).catch (e => {
			alert (e.message)
		})
	}, () => {
		alert ("Не удалось загрузить файл стилей.")
	})
})
