//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.module.setup.js


August.initModule ("setup", function ( win ) {
	function set_form ( n, v ) {
		let f = $Form [n]
		if (!f) {
		} else if (f.type == "checkbox") {
			f.checked = !!v
		} else if (f.length) {
			if (isString (v)) for (let i = 0; i < f.length; i++) {
				if (f [i].value.toLowerCase () == v.toLowerCase ()) {
					f [i].checked = true
					return i
				}
			} else for (let i = 0; i < f.length; i++) {
				if (f [i].value == v) {
					f [i].checked = true
					return i
				}
			}
			return null
		}
	}
	function select ( select, options, selected ) {
		if (!select)
			return
		for (let opt of options) {
			let grp = select.append ("OPTGROUP")
			grp.label = opt.g
			for (let o of opt.o)
				grp.append (new Option (o [0], o [1], false, o [1] == selected))
		}
	}
	function add_nick () {
		if (/\S/.test ($Form.add_nick.value)) {
			August.form.$option ($Form.nick_list, $Form.add_nick.value)
			$Form.add_nick.value = ""
		}
		$Form.add_nick.focus ()
	}
	function adj_pic ( d ) {
		$NickVA = d
		$Form.nick.s ({ verticalAlign: -$NickVA + "px" })
	}
	function set_adj_nick ( el, d ) {
		if (el) el.onclick = function () {
			adj_pic ($NickVA + d)
			return false
		}
	}
	function ctrl_color ( n, c, t ) {
		function init ( c, inp ) {
			if (c) {
				if (gr) {
					let sc = c.split ("-")
					let c2 = sc [sc.length >> 1]
					gr.checked = sc.length > 1
					cp.el (0).prop ("--color", sc [0])
					cp.el (1).prop ("--color", sc.length > 2 && c2 || "#000000")
					cp.el (2).prop ("--color", sc.last () || "#000000")
					cp.el (1).first ().checked = sc.length > 2 && c2
				} else {
					cp.el (0).prop ("--color", c)
				}
			}
			if (gr)
				cp.setClass ("color1", !gr.checked)
			let gc = c || getc ()
			cv.innerHTML = t.color (gc)
			if (inp)
				inp.value = gc
		}
		function getc () {
			return gr && gr.checked
				? [
					cp.el (0).prop ("--color"),
					cp.el (1).first ().checked
						? cp.el (1).prop ("--color")
						: "",
					cp.el (2).prop ("--color")
				].join ("-")
				: cp.el (0).prop ("--color")
		}

		let inp = $Form [`${n}_color`]
		let gr = $Form [`${n}_gradient`]
		let cp = $Form.$(`#${n}_color`)
		let cv = $Form.$(`#${n}_color_view`)
		if (!t)
			t = cv.innerHTML
		cp.innerHTML = gr
			? `<div></div><div>${August.form.checkbox (null, 0, null, "")}</div><div></div>`
			: `<div></div>`
		init (c, inp)
		if (gr) {
			gr.onchange = cp.el (1).first ().onchange = function () {
				init (void 0, inp)
			}
		}
		inp.oninput = function () {
			init (this.value)
		}
		cp.onclick = function ( e ) {
			if (!e.$.is ("DIV"))
				return true
			let cc = e.$.prop ("--color")
			$ColorPicker.show (
				{ x: e.pageX, y: e.pageY },
				cc,
				c => {
					e.$.prop ("--color", c || cc)
					cv.innerHTML = t.color (getc ())
				},
				c => {
					e.$.prop ("--color", c)
					inp.value = getc ()
				}
			)
		}
	}
	function init_style ( n, p ) {
		let f = $Form [`${n}_font`]
		f [0].value = ""
		for (let i = 1; i < f.length; i++) {
			let l = f [i].next ()
			if (l.attr ("for") == f [i].id && /^[a-zA-Z0-9_ ]+$/.test (l.innerHTML))
				f [i].value = l.innerHTML.trim ()
		}
		let last = f [f.length - 1]
		let inp = $Form [`${n}_font_user`]
		if (inp) {
			last.value = 1
			inp.onfocus = function () {
				last.checked = true
			}
		}
		let r = set_form (`${n}_font`, p [1])
		if (r === null && inp) {
			inp.value = p [1]
			last.checked = true
		}
		let s = p [2].hex ()
		set_form (`${n}_weight`, s & 3)
		set_form (`${n}_italic`, s & 4)
	}
	function check_smiles () {
		for (let n in User.PersonalSmiles)
			return true
		return false
	}
	function smiles () {
		let p = User.PersonalSmiles
		let n = n => p [n][0].hex () & 0x000fffff
		return Object.keys (p).sort (( a, b ) => n (a) - n (b)).map (n => ({
			n:	n,
			smile:	August.html.img (`@/smiles/${p [n][0].smile_fn (User.Profile)}`, p [n][1].b0, p [n][1].b1)
		}))
	}
	function upload ( img, cb ) {
		img.onclick = function () {
			August.upload.click (function () {
				August.upload.preloader ().upload (this, r => {
					if (isObject (r)) {
						img.src = `//${Chat.Host}/tmp/${r.i}`
						img.width = r.w
						img.height = r.h
						cb && cb ()
					}
				}, {
					id:	User.ID,
					type:	img.name
				}, "august/upload")
			}, null, "image/webp, image/jpeg, image/png, image/gif")
		}
	}
	function init () {
		function set_volume ( v ) {
			$Volume = v + .5 | 0
			$0($Form.$("#volume"), $Volume)
		}
		function set_sound ( List, Sound, Button ) {
			select (List, $Sounds, Math.abs (Sound))
			if (Button) Button.onclick = function ( e ) {
				Chat.Player.play ((+$Form [`${this.name.split ("_")[1]}_sound`].value).ddd (), $Volume)
				e.stop ()
			}
		}

		let HTML = `<form class=setup>${$TPL.setup.tpl ($PANEL).tpl ()}</form>`
		if ($CFG && $CFG.DISPLAY == "PANEL") {
			Chat.Event.on ("user-reset", done)
				.on ("destroy", done)
			Chat.initPanel (this)
			Chat.showPanel ("setup", HTML)
			$Form = Chat.panel.first ()
		} else {
			let Tab = Chat.Win2.show (HTML, 1 | 2 | 64, this)
			Tab.setClass ("setup")
			$Form = Tab.first ()
		}
		$Form.onkeypress = function ( e ) {
			if (e.keyCode == 13) {
				if (e.$.name == "add_nick") {
					add_nick ()
					return false
				}
			}
		}
		$Form.noselect ().onsubmit = save
		$SaveVolume = Chat.Player.volume ()
		let GraphNick = $Setup.NICK_STYLE.indexOf ("%") + 1

		if ($Form.nick) {
			upload ($Form.nick, _ => adj_pic (0))
			adj_pic (GraphNick ? +$Setup.NICK_STYLE.substr (GraphNick) : $Setup.DB_NICK_ALIGN)
			set_form ("graphnick", $Setup.GRAPHNICK)
		}
		if ($Form.icon) {
			upload ($Form.icon)
		}
		let ns = (GraphNick ? $Setup.DB_NICK_STYLE : $Setup.NICK_STYLE).split (":")
		let ms = $Setup.MESS_STYLE.split (":")
		if ($Form.$("#n_color"))
			ctrl_color ("n", ns [0], $Setup.TEXT_NICK)
		if ($Form.$("#m_color"))
			ctrl_color ("m", ms [0])
		if ($Form.n_font)
			init_style ("n", ns)
		if ($Form.m_font)
			init_style ("m", ms)
		if ($Form.design)
			set_form ("design", Chat.Design)
		if ($Form.sex)
			set_form ("sex", $Setup.SEX)
		if ($Form.$("#n_color") || $Form.$("#m_color"))
			$ColorPicker = new august_colorPicker (Chat.root)

		set_volume (Chat.Player.volume ())
		set_sound ($Form.my_sound, User.Sound [0], $Form.play_my)
		set_sound ($Form.nb_sound, User.Sound [1], $Form.play_nb)
		set_sound ($Form.pr_sound, User.Sound [2], $Form.play_pr)
		set_sound ($Form.wc_sound, User.Sound [3], $Form.play_wc)
		set_sound ($Form.nick_sound, User.Sound [4], $Form.play_nick)
		set_sound ($Form.vote_sound, User.Sound [5], $Form.play_vote)
		set_form ("smooth_mess", $Setup.SMOOTH_MESS)
		set_form ("show_time", $Setup.SHOW_TIME)
		set_form ("local_time", $Setup.LOCAL_TIME)
		set_form ("smiles_off", $Setup.SMILES_OFF)
		set_form ("nicks_off", $Setup.NICKS_OFF)
		set_form ("mono", $Setup.MONO)
		set_form ("translit", $Setup.TRANSLIT)
		set_form ("keep_nick", $Setup.KEEP_NICK)
		set_form ("security", $Setup.SECURITY)
		set_form ("hide_views", $Setup.HIDE_VIEWS)
		set_form ("ext_menu", $Setup.EXT_MENU)
		set_form ("exactly_nick", $Setup.EXACTLY_NICK)
		set_form ("win_smiles", $Setup.WIN_SMILES)
		set_form ("keep_auth", $Setup.KEEP_AUTH)
		set_form ("auth_bind_ip", $Setup.AUTH_BIND_IP)
		set_form ("invisible", $Setup.INVISIBLE)
		set_form ("friends", $Setup.FRIENDS)
		set_form ("add_friend", $Setup.ADD_FRIENDS)
		set_form ("notify_form", $Setup.MODER_NOTIFY_FORM)
		set_form ("use_my_sound", User.Sound [0] > 0)
		set_form ("use_nb_sound", User.Sound [1] > 0)
		set_form ("use_pr_sound", User.Sound [2] > 0)
		set_form ("use_wc_sound", User.Sound [3] > 0)
		set_form ("use_nick_sound", User.Sound [4] > 0)
		set_form ("use_vote_sound", User.Sound [5] > 0)
		set_form ("dir", Chat.Dir)
		set_form ("my_phrases", $Setup.MY_PHRASES)
		set_adj_nick ($Form.$("#nick_up"), -1)
		set_adj_nick ($Form.$("#nick_down"), 1)

		if ($Form.mm)
			$Form.mm.value = $Setup.MM
		if ($Form.add_nick)
			$Form.add_nick.onfocus = function () { this.value = "" }
		if ($Form.add)
			$Form.add.onclick = e => (add_nick (), e.stop ())
		if ($Form.$("#slider"))
			new august_slider ($Form.$("#slider"), set_volume).set (Chat.Player.volume ())
		if ($Form.entry_mess)
			$Form.entry_mess.value = $Setup.ENTRY_MESS
		if ($Form.exit_mess)
			$Form.exit_mess.value = $Setup.EXIT_MESS
		if ($Form.nick_list) {
			$Form.nick_list.ondblclick = function () {
				if (this.selectedIndex >= 0)
					this.remove (this.selectedIndex)
			}
			$Form.nick_list.onkeydown = function ( e ) {
				if (this.selectedIndex >= 0 && e.keyCode == 46)
					this.remove (this.selectedIndex)
			}
			User.NickList.forEach (n => August.form.$option ($Form.nick_list, n))
		}
	}
	function save ( e ) {
		e.stop ()
		if ($Form.done)
			return

		$Form.done = 1
		let NickList = []
		if ($Form.nick_list) for (let n of $Form.nick_list)
			NickList.push (n.text)
		if ($Form.sex)
			User.sex (August.form.$val ($Form.sex))
		if (August.form.$val ($Form.dir) != Chat.Dir)
			Chat.Event.fire ("reverse")
		Chat.Send.translit ($Form.translit.checked)
		let Data = {
			id:		User.ID,
			sess:		Chat.sess,
			align:		$NickVA,
			sound_volume:	$Volume,
			nick_list:	NickList.toString (),
			ok:		"OK"
		}
		let Rename = []
		for (let f of $Form) {
			if (!f.dataset.smile) {
				let v = August.form.$val (f)
				if (v !== null && f.name && f.type != "button" && !isSet (Data [f.name]))
					Data [f.name] = v
			} else if (f.value.trim () != f.name) {
				Rename.push (`${f.name}  ${f.value.trim ()}`)
			}
		}
		if (Rename.length)
			Data.rename_smiles = Rename.join (":")
		let s = n => {
			if (!$Form [n])
				return 0
			let s = +$Form [n].value
			return $Form [`use_${n}`].checked ? s : -s
		}
		let Sound = [
			s ("my_sound"), s ("nb_sound"), s ("pr_sound"),
			s ("wc_sound"), s ("nick_sound"), s ("vote_sound")
		]
		Chat.xhr ()("setup", r => {
			done ()
			User.setup ({
				Settings:	r.SETUP,
				Volume:		$Volume,
				Sound:		Sound,
				NickList:	NickList.toString ()
			})
			Chat.loadDesign (r.DESIGN)
			Chat.setClass ("mono", User.set (38))
			Chat.Storage.Design = r.DESIGN == Chat.DefDes ? void 0 : r.DESIGN
		}, Data)
	}
	function done () {
		if ($CFG && $CFG.DISPLAY == "PANEL")
			Chat.showPanel ()
		else
			Chat.Win2.hide (1)
	}
	this.done = function () {
		if ($ColorPicker)
			$ColorPicker.hide ()
		August.upload.done ()
		Chat.Player.volume ($SaveVolume)
		$Form = $ColorPicker = $CFG = null
		$Sounds.length = 0
		Chat.Event.un ("user-reset", done)
			.un ("destroy", done)
	}
	this.init = function () {
		if ($Form)
			return done ()
		Chat.xhr ()("setup", r => {
			if (!r)
				return
			$Setup = r
			let tpl = ["setup", "setup-params", "setup-sounds"]
			for (let p in $PRIV) {
				if ($Setup [p])
					tpl.push ($PRIV [p])
			}
			if (Chat.cfg.DesignCount > 1)
				tpl.push ("setup-design")
			if (!User.Profile)
				tpl.push ("setup-sex")
			Chat.loadTPL (tpl, tpl => {
				if (tpl !== null)
					$TPL = tpl
				Chat.addCSS ("setup", () => Chat.loadCFG2 ("sounds", ( $1, $2, $3 ) => {
					if ($1)
						$Sounds.push ({ g: $1, o: [] })
					else if ($Sounds.length)
						$Sounds.last ().o.push ([$2, $3])
				}, () => {
					august_run (init.bind (this), [
						window.august_colorPicker ? null : "august.color-picker.js"
					])
				}, ( l, i ) => {
					Chat.con ("$!SETUP!$: sounds cfg file error line ?", i)
				}))
			}, $TPL.$md5)
		}, {
			id:	User.ID,
			sess:	Chat.sess,
			setup:	User.Set
		})
	}

	let $Form = null
	let $Setup = {}
	let $TPL = {}
	let $NickVA = 0
	let $Volume = 0
	let $SaveVolume = 0
	let $CFG = null
	let $ColorPicker = null
	let $Sounds = []

	Chat.Event.on ("event", ( ev, p1 ) => {
		if (ev == "SM_RENAME") {
			for (let n in p1) {
				let s = User.PersonalSmiles [n]
				if (isSet (s)) {
					delete User.PersonalSmiles [n]
					User.PersonalSmiles [p1 [n]] = s
				}
			}
			Chat.Event.fire ("sm-pers-up")
		}
	})

	const $PANEL = {
		SEX:		() => $TPL.setup_sex || "",
		MODER:		() => $TPL.setup_moder || "",
		PARAM:		() => $TPL.setup_params.tpl ({ PRIV_HIDE_VIEWS: "".true ($Setup.PRIV_HIDE_VIEWS) }, 1),
		SOUNDS:		() => $TPL.setup_sounds.tpl ({ PRIV_WEBCAM: "".true ($Setup.PRIV_WEBCAM) }, 1),
		NICK_COLOR:	() => !$Setup.PRIV_NICK_COLOR ? "" : $TPL.setup_color.tpl ({ GRADIENT_PANEL: "".true ($Setup.PRIV_NICK_GRADIENT), N: "n" }),
		NICK_STYLE:	() => !$Setup.PRIV_NICK_STYLE ? "" : $TPL.setup_style.tpl ({ N: "n" }),
		MESS_COLOR:	() => !$Setup.PRIV_MESS_COLOR ? "" : $TPL.setup_color.tpl ({ GRADIENT_PANEL: "".true ($Setup.PRIV_MESS_GRADIENT), N: "m" }),
		MESS_STYLE:	() => !$Setup.PRIV_MESS_STYLE ? "" : $TPL.setup_style.tpl ({ N: "m" }),
		PHRASES:	() => !$Setup.PRIV_PHRASES    ? "" : $TPL.setup_phrases,
		INVISIBLE:	() => !$Setup.PRIV_INVISIBLE  ? "" : $TPL.setup_invisible,
		NICK:		() => !$Setup.PRIV_NICK_GRAPH
			? ""
			: $TPL.setup_nick.tpl ({
				CHAT_HOST:		$Setup.NICK ? Chat.Host : "",
				NICK:			$Setup.NICK,
				NICK_WIDTH:		$Setup.NICK_WIDTH,
				NICK_HEIGHT:		$Setup.NICK_HEIGHT,
				NICK_MAX_WIDTH:		$Setup.NICK_MAX_WIDTH,
				NICK_MAX_HEIGHT:	$Setup.NICK_MAX_HEIGHT,
				NICK_FILESIZE:		$Setup.NICK_FILESIZE
			}),
		ICON:		() => !$Setup.PRIV_ICON
			? ""
			: $TPL.setup_icon.tpl ({
				CHAT_HOST:		$Setup.ICON ? Chat.Host : "",
				ICON:			$Setup.ICON,
				ICON_WIDTH:		$Setup.ICON ? $Setup.ICON_WIDTH : "",
				ICON_HEIGHT:		$Setup.ICON ? $Setup.ICON_HEIGHT : "",
				ICON_MAX_WIDTH:		$Setup.ICON_MAX_WIDTH,
				ICON_MAX_HEIGHT:	$Setup.ICON_MAX_HEIGHT,
				ICON_FILESIZE:		$Setup.ICON_FILESIZE
			}),
		SMILES:		() => !$Setup.PRIV_PERSONAL_SMILES || !check_smiles ()
			? ""
			: $TPL.setup_smiles.pattern ([{
				SMILE		() { return this.$list [this.$i].smile },
				SMILE_NAME	() { return this.$list [this.$i].n },
				input		( ... a ) { a [4] = `data-smile=1 ${a [4] || ""}`; return August.form.input (... a) },
				$size		() { return this.$list.length },
				$list:		smiles ()
			}]),
		DESIGN:		() => Chat.cfg.DesignCount < 2
			? ""
			: $TPL.setup_design.tpl ({
				DESIGN_LIST:	() => {
					let dl = {}
					for (let n in Chat.cfg.DesignList)
						dl [n] = Chat.cfg.DesignList [n].n
					return JSON.stringify (dl)
				}
			}),
		CFG:		cfg => ($CFG = cfg, "")
	}

	const $PRIV = {
		PRIV_NICK_GRAPH:	"setup-nick",
		PRIV_NICK_COLOR:	"setup-color",
		PRIV_NICK_GRADIENT:	"setup-color",
		PRIV_NICK_STYLE:	"setup-style",
		PRIV_MESS_COLOR:	"setup-color",
		PRIV_MESS_GRADIENT:	"setup-color",
		PRIV_MESS_STYLE:	"setup-style",
		PRIV_INVISIBLE:		"setup-invisible",
		PRIV_PHRASES:		"setup-phrases",
		PRIV_ICON:		"setup-icon",
		PRIV_PERSONAL_SMILES:	"setup-smiles",
		MODER:			"setup-moder"
	}
})
