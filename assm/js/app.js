//  Copyright (c) 2021 by Vital72
//  License: MIT
//  www:  http://www.86rk.ru/
//  file: app.js


class assm extends app {
	init () {
		super.init ()
		let self = this


		this.app.setClass ("busy")
		August.loadJS ("august.assm.js").then (_ => {
			this.app.setClass ("busy")
			this.Assm = new august_assm
		}).catch (_ => {
			this.app.setClass ("busy")
			this.error ("Ошибка загрузки js-файла.")
		})
	}
	done () {
		super.done ()
	}
	new_file ( FileName, Code ) {
	}
	set_file ( idx ) {
	}
	empty_page () {
		this.empty_file ()
	}
	empty_file () {
		this.File = null
	}
	assm ( f ) {
		this.app.setClass ("busy")
		August.sync (window, _ => {
			this.app.setClass ("busy")
		})
	}
	keydown ( e ) {
		if (super.keydown (e))
			return true
		switch (e.keyCode) {
			case 38:  //  up
			case 40:  //  down
			case 33:  //  PgUp
			case 34:  //  PgDown
			case 36:  //  Home
			case 35:  //  End
				return true
		}
	}
	mouse ( e ) {
		if (super.mouse (e))
			return true
	}
	upload_handler ( name, bin ) {
		return true
	}
	save_handler () {
	}
}

