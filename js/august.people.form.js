//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.form.js


function august_people_form ( param, handlers ) {
	function section ( s ) {
		if (Section == s || !isSet (TPL [`form_${s}`]) || Lock.lock (0))
			return
		$("section").setClass ("show", 0)
		if (Section == "photo") {
			SetAlbum = CurAlbum
			ThumbsSec = null
		} else if (Section == "nick") {
			Cropper && Cropper.done ()
			Cropper = null
			get_nick_section ()
		} else if (Section != "") {
			for (let f of FORM) {
				if (/^uf\[(.+?)\]\[\]$/.test (f.name)) {
					if (f.type == "checkbox") {
						if (f.checked)
							Info.INFO [RegExp.$1] |= f.value
						else
							Info.INFO [RegExp.$1] &= ~f.value
					}
				} else if (/^uf\[(.+?)\]$/.test (f.name)) {
					if (f.type != "radio" || f.checked)
						Info.INFO [RegExp.$1] = f.value
				}
			}
		}
		FORM.setClass (Section, 0).setClass (s, 1)
		Section = s
		if (Section == "photo") {
			$("section").innerHTML = TPL.form_photo.tpl ({
				DENY_PHOTO:		Info.DENY_PHOTO,
				PHOTO_COUNT:		"".true (Info.PHOTO.length),
				PHOTO_MIN_WIDTH:	Info.PHOTO_MIN [0],
				PHOTO_MIN_HEIGHT:	Info.PHOTO_MIN [1],
			})
			ThumbsSec2 = $("section").$("thumbs")
			if (ThumbsSec2) {
				ThumbsSec = ThumbsSec2.cloneNode (false)
				ThumbsSec2.parent ().insert (ThumbsSec, ThumbsSec2)
				ThumbsSec2.className = "single inactive hidden"
				ThumbsSec2.setHeight (0)
				CurAlbum = -1
				CurPhoto = -1
				Lock.free ()
				ThumbsSec.setHeight ()
				album_init ()
			}
		} else if (Section == "nick") {
			$("section").innerHTML = TPL.form_nick.tpl ({
				PROFILE:		Info.PROFILE,
				SECRET_EMAIL:		Info.SECRET_EMAIL,
				ACTIVATE_CAPTCHA:	Info.CAPTCHA,
				ACTIVATE_CODE:		Info.CODE,
				NICKLIST:		"<nicklist></nicklist>",
				CAPTCHA			( a, b, c ) {
					if (!Info.CAPTCHA)
						return ""
					captcha.a = a
					captcha.b = b
					captcha.c = c
					captcha ()
					return `<img id=__captcha src=${TR_PIXEL} referrerpolicy=no-referrer>`
				},
				ACCESS			() {
					if (!Info.ACCESS)
						return ""
					return TPL.form_access.pattern ([{
						SECTION_NAME	() { return this.$a.t },
						ACCESS_SECTION	() { return this.$a.s },
						ACCESS		() { return this.$a.a },
						$size		() { return Info.ACCESS.length },
						$set		( i ) { this.$a = Info.ACCESS [i] }
					}])
				},
				AVATAR			() {
					if (!Info.ALLOW_AVATAR)
						return ""
					return TPL.form_avatar.tpl ({
						AVATAR_WIDTH:	Info.AVATAR_SIZE [0],
						AVATAR_HEIGHT:	Info.AVATAR_SIZE [1]
					})
				}
			})
			let Avatar = $("section").$("avatar")
			if (Avatar) {
				let IMG = Avatar.$("img")
				if (IMG) {
					IMG.dataset.avatar = 1
					IMG.src = Info.AVATAR_DATA || MAIN.avatar (Info.AVATAR) || TR_PIXEL
				}
			}
			FORM.secret_email.value = Info.NEW_SECRET_EMAIL || ""
			nicklist ()
		} else if (Section == "restore") {
			$("section").innerHTML = TPL.form_restore.tpl ({
			})
			nicklist ()
		} else {
			$("section").innerHTML = TPL [`form_${s}`].tpl ()
			for (let f of FORM) {
				if (/^uf\[(.+?)\]\[\]$/.test (f.name) && isSet (Info.INFO [RegExp.$1])) {
					if (f.type == "checkbox")
						f.checked = f.value & Info.INFO [RegExp.$1]
				} else if (/^uf\[(.+?)\]$/.test (f.name) && isSet (Info.INFO [RegExp.$1])) {
					if (f.type != "radio")
						f.value = Info.INFO [RegExp.$1] == "0" ? "" : Info.INFO [RegExp.$1]
					else if (f.value == Info.INFO [RegExp.$1])
						f.checked = true
				}
			}
			if (FORM [0])
				FORM [0].focus ()
		}
		$("section").setClass ("show", 1)
		ErrorSec = $("section").$("Error")
		if (ErrorSec) {
			Error.set (ErrorSec.innerHTML.htmlEntityDecode ())
			ErrorSec.innerHTML = ""
			ErrorSec.onclick = Error.hide.bind (Error)
			ErrorSec.noselect ()
		}
		if ($("title"))
			document.title = $("title").textContent
		if (SB)
			SB.scrollTo (0)
		FORM.prev = FORM.next = null
		let bs = FORM.section
		if (bs) {
			for (let b of (bs.length ? bs : [bs])) {
				let a = b.attr ("action")
				if (a == "prev" || a == "next")
					FORM [a] = b.attr ("section")
			}
		}
	}
	function get_nick_section () {
		Info.NEW_SECRET_EMAIL = FORM.secret_email.value
		if (Info.ACCESS) for (let a of Info.ACCESS)
			a.a = August.form.$val (FORM [`access[${a.s}]`])
	}
	function nicklist () {
		let nl = FORM.$("nicklist")
		if (nl) {
			nl.innerHTML = TPL.form_nicklist.pattern ([{
				NUM		() { return this.$i + 1 },
				NICK		() { return this.$n.n },
				NICKID		() { return this.$n.id },
				DATE2		( f, l ) { return this.$n.d.date (f, l) },
				$size		() { return Info.NICK.length },
				$set		( i ) { this.$n = Info.NICK [i] }
			}], {
				RESTORE:	"".true (Info.RESTORE)
			})
			for (let f of FORM) {
				if (f.name == "del_nick" && Info.NICK [Info.NICKID [f.value]].del) {
					f.checked = true
					del_nick (f)
				}
			}
			if (FORM.nick && !Info.NICK.length)
				FORM.nick.focus ()
		}
	}
	function thumbs_url ( ph ) {
		return ph.n
			? `//${MAIN.Host}/tmp/th${Info.CHATID}${Info.SESS}${ph.d.hex (4)}${ph.p}.${ph.e}`
			: `//${MAIN.Host}/people/thumb/${Info.PROFILE.hex (3)}${ph.p}.${ph.e}`
	}
	function photo_url ( ph ) {
		return ph.n
			? `//${MAIN.Host}/tmp/${Info.CHATID}${Info.SESS}${ph.d.hex (4)}${ph.p}.${ph.e}`
			: `//${MAIN.Host}/people/photo/${Info.PROFILE.hex (3)}${ph.p}.${ph.e}`
	}
	function thumb_place ( x, y, cb ) {
		let ts = this.parent ()
		this.up = 1
		this.oLeft = this.offsetLeft + ts.scrollLeft + FORM.scrollLeft
		this.oTop = this.offsetTop + ts.scrollTop + FORM.scrollTop
		let bl = ts.getStyle ("borderLeftWidth")
		let bt = ts.getStyle ("borderTopWidth")
		let ani = () => {
			if (!this.up)
				return
			let dx = x - this.oLeft
			let dy = y - this.oTop
			if (!dx && !dy) {
				this.th.parent ().remove (this.th)
				this.th = null
				this.setClass ("move", 0).pos ()
				if (!--document.move) {
					ThumbsSec.setClass ("move", 0)
					ThumbsSec2.setClass ("move", 0)
				}
				cb && cb.call (this)
				return
			}
			if (dx)
				this.oLeft += (dx >> 3) + dx.sign ()
			if (dy)
				this.oTop += (dy >> 3) + dy.sign ()
			this.set (this.oLeft - this.ml - bl, this.oTop - this.mt - bt)
			requestAnimationFrame (ani)
		}
		ani ()
		return this
	}
	function thumb_pos ( x, y ) {
		let ts = this.parent ()
		let m = ts.hasClass ("move")
		this.pos (x - (m ? ts.ol : ts.scrollLeft + FORM.scrollLeft), y - (m ? ts.ot : ts.scrollTop + FORM.scrollTop))
		return this
	}
	function thumb_moveable ( img ) {
		document.move++
		this.th = this.parent ().insert ("thumb", this, { className: "place" })
		this.setClass ("move", 1)
		if (img)
			this.th.append ("img").src = img
		return this
	}
	function thumb_move ( idx, cb ) {
		document.lock++
		let ts = this.parent ()
		let tr = ts.tr [this.idx]
		let tr2 = ts.tr [idx]
		if (!this.th) {
			this.moveable ()
			this.pos (tr.r.x1 - ts.scrollLeft - FORM.scrollLeft, tr.r.y1 - ts.scrollTop - FORM.scrollTop)
		}
		this.idx = idx
		this.attr ("num", idx + 1)
		this.place (tr2.r.x1, tr2.r.y1, function () {
			document.lock--
			tr2.el = this
			cb && cb.call (this)
		})
		return this
	}
	function thumb_rect ( o ) {
		let ts = this.parent ()
		let x = this.offsetLeft + (o & 1 ? ts.scrollLeft : 0) + (o & 2 ? FORM.scrollLeft : 0)
		let y = this.offsetTop + (o & 1 ? ts.scrollTop : 0) + (o & 2 ? FORM.scrollTop : 0)
		return new august_rect (x, y, x + this.offsetWidth, y + this.offsetHeight)
	}
	function thumbs_scroll ( e ) {
		let c = this.children
		if (document.move || c.length < 2 || !e.deltaY)
			return
		if (this.clientWidth < this.scrollWidth) {
			let w = c [1].offsetLeft - c [0].offsetLeft
			if (e.deltaY < 0)
				this.scrollLeft -= w
			else if (this.scrollLeft + this.clientWidth + (w >> 1) <= this.scrollWidth)
				this.scrollLeft += w
			return e.stop ()
		} else if (this.clientHeight < this.scrollHeight) {
			let h = c [0].offsetHeight + c [0].getStyle ("marginTop") + c [0].getStyle ("marginBottom")
			if (e.deltaY < 0)
				this.scrollTop -= h
			else if (this.scrollTop + h + this.clientHeight <= this.scrollHeight)
				this.scrollTop += h
			return e.stop ()
		}
	}
	function thumbs ( ts ) {
		ts.innerHTML = Info.ALBUM [ts.a].ph.map (idx => {
			let ph = Info.PHOTO [idx]
			return TPL.form_thumb.tpl ({
				NUM		() { return idx + 1 },
				THUMB		() { return thumbs_url (ph) },
				COMMENT		() { return (ph.nc || ph.c || "").html (30, 3) },
				DATE2		( f, l ) { return ph.d.date (f, l) }
			}).trim ()
		}).join ("")
		ts.scrollLeft = 0
		ts.scrollTop = 0
		ts.tr = []
		Array.prototype.forEach.call (ts.children, ( th, i ) => {
			let ph = Info.PHOTO [Info.ALBUM [ts.a].ph [i]]
			ph.th = th
			th.idx = i
			th.className = ph.del ? "del" : ""
			th.attr ("num", i + 1)
			th.place = thumb_place
			th.moveable = thumb_moveable
			th.rect = thumb_rect
			th.set = thumb_pos
			th.move = thumb_move
			th.ml = th.getStyle ("marginLeft")
			th.mt = th.getStyle ("marginTop")
			ts.tr [i] = { r: th.rect (), el: th }
		})
		ts.noselect ()
		ts.on ("wheel", thumbs_scroll)
		ts.ol = ts.offsetLeft
		ts.ot = ts.offsetTop
		ts.sq = function ( r ) {
			let x = this.offsetLeft - FORM.scrollLeft
			let y = this.offsetTop - FORM.scrollTop
			let s = new august_rect (x, y, x + this.offsetWidth, y + this.offsetHeight)
			return s.cross (r) ? s.intersect (r).square () : 0
		}
		ts.re = function () {
			for (let t of this.tr)
				t.r = t.el.rect ()
			this.ol = this.offsetLeft
			this.ot = this.offsetTop
		}
		ts.resize = function ( cb, arg ) {
			requestAnimationFrame (() => {
				let h = this.offsetHeight
				this.setHeight (null)
				let ch = this.offsetHeight
				this.setHeight (h)
				if (this.offsetHeight != ch) {
					this.setHeight (ch)
					if (cb) {
						document.lock++
						let wait = () => {
							if (this.offsetHeight == ch) {
								document.lock--
								return cb (arg)
							}
							setTimeout (wait, 100)
						}
						wait ()
					}
				} else if (cb) {
					cb (arg)
				}
			})
		}
	}
	function album_init () {
		let AlbumList = $("section").$("album-list")
		if (AlbumList && AlbumList.children.length == 2) {
			Info.ALBUM.forEach (a => {
				if (a.id) {
					let item = AlbumList.append ("item")
					item.textContent = a.n
					item.dataset.id = a.id
					item.attr ("count", a.ph.length)
					item.attr ("access", a.a)
					item.idx = AlbumList.children.length
					a.m = item
				}
			})
			let Item0 = AlbumList.first ()
			let Album0 = Info.ALBUM [0]
			if (Album0.n)
				Item0.textContent = Album0.n
			else
				Album0.n = Item0.textContent
			Album0.m = Item0
			Item0.idx = 1
			Item0.dataset.id = 0
			Item0.attr ("count", Album0.ph.length)
			Item0.attr ("access", Album0.a)
			AlbumList.noselect ()
			album_show (Info.ALBUM [SetAlbum])
		}
	}
	function album_show ( a ) {
		let AlbumList = $("section").$("album-list")
		AlbumList.el = a.m
		album_list (AlbumList)
		album_list (AlbumList)
	}
	function album_create ( el ) {
		let AlbumList = $("section").$("album-list")
		let name = el.attr ("new") || ""
		let item = AlbumList.append ("item")
		item.textContent = name
		item.dataset.id = Info.ALBUM.length
		item.attr ("count", 0)
		item.attr ("access", "a")
		item.idx = AlbumList.children.length
		Info.ALBUM.push ({
			id:	Info.ALBUM.length,
			a:	'a',
			n:	name,
			d:	"",
			ph:	[],
			ul:	[],
			m:	item
		})
		AlbumList.el = item
		album_list (AlbumList)
	}
	function album_list ( el ) {
		if (Lock.lock (Lock.ALBUM_LIST))
			return
		let ml = el.children
		if (el.setClass ("expand")) {
			let h = ml [0].offsetHeight
			for (let i = 1; i < ml.length; i++)
				ml [i].s ({ top: h * i + "px" })
			return
		}
		for (let i = 1; i < ml.length; i++)
			ml [i].s ({ top: 0 })
		if (ThumbsSec.a != el.el.dataset.id && isSet (el.el.dataset.id)) {
			el.insert (ml [0], ml [ml [0].idx + 1])
			el.insert (el.el, ml [0])
			ThumbsSec.a = el.el.dataset.id
			thumbs (ThumbsSec)
			ThumbsSec2.setHeight (0)
			ThumbsSec.resize (a => {
				if (a != -1) {
					ThumbsSec2.a = a
					ThumbsSec2.setHeight (null).setClass ("hidden", 0)
					thumbs (ThumbsSec2)
				}
			}, CurAlbum)
			CurAlbum = el.el.dataset.id
		}
		Lock.free (Lock.ALBUM_LIST)
	}
	function album_menu ( a, el ) {
		if (Lock.lock (Lock.ALBUM_MENU))
			return
		let menu = $("section").$("ul.album-menu")
		menu.setClass (menu.menu, 0)
		if (menu.cur)
			menu.cur.setClass ("cur", 0)
		if (!el || menu.cur == el) {
			Lock.free (Lock.ALBUM_MENU)
			menu.cur = null
			return 
		}
		menu.cur = el
		el.setClass ("cur", 1)
		menu.menu = a
		menu.setClass (a, 1)
		let Album = Info.ALBUM [CurAlbum]
		if (a == "info") {
			Album.nt = null
			FORM.album_name.focus ()
			FORM.album_name.value = Album.n
			FORM.album_descr.value = Album.d || ""
			let img = menu.$("thumb>img")
			if (img)
				img.src = Album.t ? thumbs_url (Album.t) : TR_PIXEL
		} else if (a == "access") {
			August.form.$val (FORM.album_access, Album.a)
			let ul = $("album_access").$("userlist")
			if (ul) {
				ul.innerHTML = Album.ul.map (a => `<div><a nickid=${Info.USER_LIST [a].id}>${Info.USER_LIST [a].n}</a></div>`).join ("")
				ul.display (Album.ul.length ? "" : "none")
			}
		} else if (a == "upload") {
			album_menu ()
			photo_upload ()
		} else if (a == "combine") {
			album_menu ()
			if (isSet (ThumbsSec2.a)) {
				let Album1 = Info.ALBUM [ThumbsSec.a]
				let Album2 = Info.ALBUM [ThumbsSec2.a]
				if (Album2.ph.length) {
					Album1.ph = Album1.ph.concat (Album2.ph)
					Album2.ph.length = 0
					Album1.m.attr ("count", Album1.ph.length)
					Album2.m.attr ("count", Album2.ph.length)
					delete Album2.t
					album_show (Album2)
					album_show (Album)
				}
			}
		} else if (a == "exchange") {
			album_menu ()
			if (isSet (ThumbsSec2.a))
				album_show (Info.ALBUM [ThumbsSec2.a])
		}
	}
	function album_thumb ( a ) {
		let Album = Info.ALBUM [CurAlbum]
		if (!Album.t)
			return
		let idx = (Album.nt || Album.t).th.idx
		if (a == "prev")
			idx = idx == 0 ? Album.ph.length - 1 : idx - 1
		else if (a == "next")
			idx = idx == Album.ph.length - 1 ? 0 : idx + 1
		Album.nt = Info.PHOTO [Album.ph [idx]]
		let img = $("section").$("ul.album-menu").$("thumb>img")
		if (img)
			img.src = thumbs_url (Album.nt)
	}
	function album_ok () {
		let Album = Info.ALBUM [CurAlbum]
		let menu = $("section").$("ul.album-menu")
		if (menu.menu == "info") {
			Album.n = FORM.album_name.value
			Album.d = FORM.album_descr.value
			Album.t = Album.nt || Album.t
			Album.nt = null
			$("section").$("album-list").first ().textContent = Album.n
		} else if (menu.menu == "access") {
			Album.a = August.form.$val (FORM.album_access)
			Album.m.attr ("access", Album.a)
		}
		album_menu ()
	}
	function upload () {
		let pb = $("section").$("progress-bar")
		if (pb) {
			pb.set = ( l, t ) => {
				let w = 100 * l / t | 0
				pb.prop ("--width", w + "%").attr ("width", w)
			}
			pb.set (0, 1)
			pb.className = "show"
		}
		August.upload.preloader ().upload (this, r => {
			if (pb)
				pb.className = ""
			if (!r || !isObject (r))
				return
			if (r.PHOTO.length) {
				for (let f of r.PHOTO) {
					let Album = Info.ALBUM [f.a]
					Album.ph.push (Info.PHOTO.length)
					Info.PHOTO.push ({ n: 1, c: "", ... f })
					if (Album.ph.length == 1)
						Album.t = Info.PHOTO [Album.ph [0]]
					Album.m.attr ("count", Album.ph.length)
				}
				thumbs (ThumbsSec)
				ThumbsSec.resize ()
			}
			if (r.ERROR.length) {
				let e = []
				let f = []
				for (let i of r.ERROR) {
					e.push (i.e)
					f.push ({ FILE: i.f })
				}
				Error.show (e, null, f)
			}
		}, {
			sess:	Info.SESS,
			a:	CurAlbum
		},
		"xhr/people.photo.august",
		"photo[]",
		( l, t ) => {
			if (pb)
				pb.set (l, t)
		})
	}
	function photo_upload ( ... a ) {
		if (Section != "photo" || Info.DENY_PHOTO)
			return false
		Error.hide ()
		if (a [0] && isSet (a [0].files))
			upload.call (a [0])
		else
			August.upload.multiple (1).click (upload, null, "image/webp, image/jpeg, image/png, image/tiff, image/bmp")
	}
	function photo_del ( el ) {
		el = el.child (ThumbsSec)
		if (el)
			Info.PHOTO [Info.ALBUM [CurAlbum].ph [el.idx]].del = el.setClass ("del")
	}
	function photo ( el ) {
		if (CurPhoto != -1 || document.move)
			return
		el = el.child (ThumbsSec)
		if (el)
			photo_show (el.idx)
	}
	function photo_show ( idx ) {
		if (Lock.lock (Lock.PHOTO))
			return
		let PhotoSec = $("section").$("photo")
		let Album = Info.ALBUM [CurAlbum]
		let Photo = Info.PHOTO [CurPhoto = Album.ph [idx]]
		let Thumb = ThumbsSec.children [+Photo.th.attr ("num") - 1]
		let PhotoImg = PhotoSec.$("#photo_img")
		let PhotoURL = photo_url (Photo)
		Thumb.setClass ("wait", 1)
		PhotoSec.setClass ("loaded", 0)
		PhotoImg.innerHTML = `<img src=${PhotoURL} data-view=${PhotoURL} referrerpolicy=no-referrer>`
		PhotoImg.firstChild.onload = function () {
			Thumb.setClass ("wait", 0)
			PhotoSec.setClass ("loaded", 1)
			this.width = this.naturalWidth
			this.height = this.naturalHeight
		}
		PhotoSec.setClass ("show", 1)
		$("section").$("section").setClass ("shadow", 1)
		FORM.comment.value = Photo.nc || Photo.c || ""
		FORM.comment.focus ()
		if ($("photo_num"))
			$("photo_num").textContent = idx + 1
		if ($("photo_count"))
			$("photo_count").textContent = Album.ph.length
		if (PhotoSec.Swipe)
			return
		PhotoSec.Swipe = PhotoImg.swipe (() => {
			let b = PhotoSec.$("[name=photo_page][action=next]")
			b && b.click ()
		}, () => {
			let b = PhotoSec.$("[name=photo_page][action=prev]")
			b && b.click ()
		}, 100, 1000)
	}
	function photo_page ( a ) {
		if (Lock.lock (Lock.PHOTO))
			return
		let Album = Info.ALBUM [CurAlbum]
		let Photo = Info.PHOTO [CurPhoto]
		let c = FORM.comment.value.trim ()
		if (Photo.c != c) {
			Photo.nc = c
			let Comm = ThumbsSec.all ("comm")
			if (Comm)
				Comm [Photo.th.idx].innerHTML = c.html (30, 3)
		} else if (isSet (Photo.nc)) {
			delete Photo.nc
		}
		HS.hideAll ()
		switch (a) {
			case "prev":
				if (Album.ph.length > 1)
					photo_show (Photo.th.idx == 0 ? Album.ph.length - 1 : Photo.th.idx - 1)
				break
			case "next":
				if (Album.ph.length > 1)
					photo_show (Photo.th.idx == Album.ph.length - 1 ? 0 : Photo.th.idx + 1)
				break
			case "ok":
				let PhotoSec = $("section").$("photo")
				PhotoSec.Swipe.done ()
				PhotoSec.Swipe = null
				PhotoSec.setClass ("show", 0)
				$("section").$("section").setClass ("shadow", 0)
				Lock.free (Lock.PHOTO)
				CurPhoto = -1
				break
		}
	}
	function avatar_upload ( el, dt ) {
		let file = dt.files [0]
		if (!file)
			return
		let Reader = new FileReader
		Reader.onload = function ( e ) {
			el.src = e.$.result
		}
		Reader.onerror = function ( e ) {
		}
		Reader.readAsDataURL (file)
		el.onload = function () {
			this.onload = null
			if (this.width != this.naturalWidth || this.height != this.naturalHeight) {
				this.src = AUGUST_IMG_LIB.sharpen (AUGUST_IMG_LIB.resize (
					this,
					AUGUST_IMG_LIB.area (0, 0, 1, this.naturalWidth, this.naturalHeight, this.width, this.height),
					this.width,
					this.height
				)).toDataURL (file.type, 1.)
			}
			Info.AVATAR_DATA = this.src
		}
	}
	function avatar_del () {
		let Avatar = $("section").$("avatar")
		let IMG = Avatar ? Avatar.$("img[name=avatar]") : null
		if (IMG) {
			Info.AVATAR_DATA = ""
			IMG.src = TR_PIXEL
		}
	}
	function avatar () {
		let Avatar = $("section").$("avatar")
		let IMG = Avatar ? Avatar.$("img[name=avatar]") : null
		if (IMG) {
			August.upload.multiple (0).click (function () {
				avatar_upload (IMG, this)
				this.value = ""
			}, null, "image/*")
		}
	}
	function cropper () {
		let ok = ( c, t ) => {
			CropperSec.setClass ("show", 0)
			SB && SB.on ()
			MAIN.restore ()
			if (c)
				IMG.src = Info.AVATAR_DATA = c.toDataURL (t, 1.)
		}
		let ready = r => {
			CropperSec.setClass ("ready", r)
			if (!r) {
				Cropper.bri && Cropper.bri.set (50)
				Cropper.con && Cropper.con.set (50)
				Cropper.sat && Cropper.sat.set (50)
				Cropper.blu && Cropper.blu.set (0)
				Cropper.inv && Cropper.inv.set (0)
				Cropper.hue && Cropper.hue.set (0)
			}
		}
		let busy = b => {
			CropperSec.setClass ("busy", b)
		}
		let error = e => {
			CropperSec.setClass ("error", e)
		}

		let Avatar = $("section").$("avatar")
		let IMG = Avatar ? Avatar.$("img[name=avatar]") : null
		let CropperSec = $("section").$("cropper")
		if (!CropperSec || !IMG)
			return
		CropperSec.setClass ("show", 1)
		SB && SB.off ()
		if (!Cropper) {
			CropperSec.noselect ()
			Cropper = new august_cropper ({
				holder:		CropperSec.$("crop-holder"),
				preview:	CropperSec.$("crop-preview"),
				pw:		Info.AVATAR_SIZE [0],
				ph:		Info.AVATAR_SIZE [1],
				error:		error,
				ready:		ready,
				busy:		busy,
				get:		ok,
			})
			let sl_bri = CropperSec.$("#cropper_slider_bri")
			let sl_con = CropperSec.$("#cropper_slider_con")
			let sl_sat = CropperSec.$("#cropper_slider_sat")
			let sl_blu = CropperSec.$("#cropper_slider_blu")
			let sl_inv = CropperSec.$("#cropper_slider_inv")
			let sl_hue = CropperSec.$("#cropper_slider_hue")
			Cropper.bri = sl_bri && new august_slider (sl_bri, v => {
				Cropper.set ({ brightness: v += 50 })
				$0(CropperSec.$("#cropper_bri_val"), `${v}%`)
			})
			Cropper.con = sl_con && new august_slider (sl_con, v => {
				Cropper.set ({ contrast: v += 50 })
				$0(CropperSec.$("#cropper_con_val"), `${v}%`)
			})
			Cropper.sat = sl_sat && new august_slider (sl_sat, v => {
				Cropper.set ({ saturate: v *= 2 })
				$0(CropperSec.$("#cropper_sat_val"), `${v}%`)
			})
			Cropper.blu = sl_blu && new august_slider (sl_blu, v => {
				Cropper.set ({ blur: v / 10 })
				$0(CropperSec.$("#cropper_blu_val"), v)
			})
			Cropper.inv = sl_inv && new august_slider (sl_inv, v => {
				Cropper.set ({ invert: v })
				$0(CropperSec.$("#cropper_inv_val"), `${v}%`)
			})
			Cropper.hue = sl_hue && new august_slider (sl_hue, v => {
				Cropper.set ({ huerotate: v *= 3.6 })
				$0(CropperSec.$("#cropper_hue_val"), `${v.locale ()}&deg;`)
			})
			ready (0)
		}
		MAIN.save ()
		MAIN.actions ({
			cropper_upload:		Cropper.upload.bind (Cropper, null),
			cropper_rotate90:	Cropper.rotate.bind (Cropper, 0),
			cropper_rotate270:	Cropper.rotate.bind (Cropper, 1),
			cropper_ok:		Cropper.get.bind (Cropper),
			cropper_close:		ok.bind (null, null),
			cropper_filter:		el => {
				let m = el.attr ("matrix")
				if (m !== null) {
					m = m.split (",").map (a => +a)
					if (m.length == 9) {
						let d = +el.attr ("div")
						let o = +el.attr ("offs")
						Cropper.filter ([m.slice (0, 3), m.slice (3, 6), m.slice (6, 9)], d, o)
					}
				}
			},
			cropper_expand:		el => {
				Cropper.expand (+el.attr ("expand"))
			}
		})
	}
	function add_nick () {
		Error.hide ()
		let Nick = FORM.nick.value.trim ()
		if (!Nick)
			return FORM.nick.focus ()
		MAIN.xhr ("people.nick", r => {
			if (r.ERROR) {
				if (r.ERROR == "NICK1") {
					FORM.nick.value = ""
					FORM.nick.focus ()
				} else {
					Error.show (`ERROR_${r.ERROR}`, FORM.nick, { ERROR_PARAM: r.ERROR_PARAM })
				}
				return
			}
			Info.NICKID [r.NICK.id] = Info.NICK.length
			Info.NICK.push ({
				n:	r.NICK.n,
				d:	r.NICK.d,
				id:	r.NICK.id
			})
			nicklist ()
		}, {
			sess:	Info.SESS,
			nick:	Nick
		})
	}
	function del_nick ( el ) {
		while (el = el.parent ()) {
			let NickID = el.attr ("nickid")
			if (NickID) {
				Info.NICK [Info.NICKID [NickID]].del = el.setClass ("del")
				return true
			}
		}
	}
	function exit ( ... a ) {
		August.upload.done ()
		FORM.Swipe.done ()
		Cropper && Cropper.done ()
		Cropper = null
		if (Handlers && Handlers.exit)
			return Handlers.exit (...a)
		location = "people.php"
	}
	function cancel () {
		exit (0, "cancel")
	}
	function done () {
		let valid = s => {
			let d = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
			let r = 1
			for (let ch of s)
				r &= +d.includes (ch)
			return r
		}
		let check = s => {
			return "`1234567890-=qwertyuiop[]asdfghjkl;'\\zxcvbnm,./abcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcba/.,mnbvcxz\\';lkjhgfdsa][poiuytrewq=-0987654321`".includes (s.replace (/(.)\1+/g, "$1"))
		}
		let base64_encode = s => {
			let r = ""
			for (let c of s.utf8 ())
				r += String.fromCharCode (c)
			return btoa (r)
		}

		let Pass = FORM.pass1.value
		if (FORM.cur_pass) {
			if (!/\S/.test (FORM.cur_pass.value))
				return Error.show ("ERROR1", FORM.cur_pass)
		} else if (!Pass) {
			return Error.show ("ERROR1", FORM.pass1)
		}
		if (Pass != FORM.pass2.value)
			return Error.show ("ERROR2", FORM.pass2)
		if (Pass && Pass.length < 8)
			return Error.show ("ERROR3", FORM.pass1)
		if (Pass && (!valid (Pass) || !/\S/.test (Pass)))
			return Error.show ("ERROR4", FORM.pass1)
		if (Pass && check (Pass))
			return Error.show ("ERROR5", FORM.pass1)
		if (Info.AVATAR_DATA && Info.AVATAR_DATA.length * 3 / 4 > Info.AVATAR_FILESIZE * 1024)
			return Error.show ("ERROR_AVATAR")
		if (!Info.RESTORE)
			get_nick_section ()
		let FormData = {
			sess:	Info.SESS,
			pass:	Pass ? Pass.md5 () : ""
		}
		for (let n in Info.INFO) {
			FormData [`uf[${n}]`] = Info.INFO [n]
		}
		Info.NICK.forEach (( n, i ) => {
			if (n.del)
				FormData [`nd[${i}]`] = n.id
		})
		Info.ALBUM && Info.ALBUM.forEach (( al, al_idx ) => {
			if (al.ph.length) {
				FormData [`al[${al_idx}]`] = `${al.t ? al.t.p : ""}:${al.a}:${base64_encode (al.n)}:${base64_encode (al.d)}`
				al.ph.forEach (idx => {
					let ph = Info.PHOTO [idx]
					FormData [`ph[${ph.p}]`] = isSet (ph.nc)
						? `${al_idx}:${ph.del | 0}:${ph.nc}`
						: `${al_idx}:${ph.del | 0}`
				})
			}
		})
		if (Info.ACCESS) Info.ACCESS.forEach (a => {
			FormData [`access[${a.s}]`] = a.a
		})
		if (FORM.cur_pass) {
			FormData.cur_pass = FORM.cur_pass.value.crypt (Info.PASSKEY)
			FORM.cur_pass.value = ""
		} else {
			if (FORM.captcha)
				FormData.captcha = FORM.captcha.value
			if (FORM.code)
				FormData.code = FORM.code.value
		}
		if (Info.NEW_SECRET_EMAIL)
			FormData.secret_email = Info.NEW_SECRET_EMAIL
		if (Info.AVATAR_DATA !== null)
			FormData.avatar = Info.AVATAR_DATA.replace (/^[^,]+,/, "")
		new august_http ().send ("php/secret-key.php", r => {
			if (r === false)
				return Error.show ("ERROR_SECRET")
			FormData.secret_key = r
			MAIN.xhr ("people.done", r => {
				if (r.ERROR == "CAPTCHA")
					captcha ()
				if (r.ERROR)
					return Error.show (`ERROR_${r.ERROR}`, null, { ERROR_PARAM: r.ERROR_PARAM })
				exit (r, "form")
			}, FormData)
		}, {
			key: Info.PASSKEY
		})
	}
	function captcha () {
		MAIN.xhr ("people.captcha", r => {
			$("__captcha").src = `//${MAIN.Host}/august/captcha/${Info.SESS}?_${Date.now ()}`
			if (FORM.captcha)
				FORM.captcha.value = ""
		}, {
			sess:	Info.SESS,
			a:	captcha.a,
			b:	captcha.b,
			c:	captcha.c
		})
	}
	function restore () {
		let [fp1, fp2] = August.fingerprint ()
		MAIN.xhr ("people.restore", r => {
			INIT.RESTORE = null
			if (!r)
				return MAIN.run ("index", "DONESYSTEM", true)
			if (!r.PROFILE)
				return MAIN.run ("index", "AUTH3", true)
			MAIN.loadTPL (["form", "form-restore", "form-nicklist"], tpl => {
				TPL = tpl
				Info = r
				Info.RESTORE = 1
				show_form ("restore")
			})
		}, August.getid ({
			fp1:		fp1,
			fp2:		fp2,
			profile:	INIT.PROFILE,
			restore:	INIT.RESTORE
		}))
	}
	this.getForm = function ( param, handlers ) {
		if (INIT.RESTORE)
			return restore ()
		FORM = null
		Info = null
		TPL = {}
		Section = ""
		Handlers = handlers
		let [fp1, fp2] = August.fingerprint ()
		MAIN.xhr ("people.form", r => {
			if (!isObject (r)) {
				if (handlers && handlers.exit)
					handlers.exit (r)
				return
			}
			Info = r
			INIT.PROFILE = Info.PROFILE
			let ALBUM = []
			Info.ALBUM.forEach (a => {
				ALBUM [a.id] = a
				a.ph = []
				a.ul = []
			})
			if (!ALBUM [0])
				ALBUM [0] = ({ id: 0, a: 'a', n: "", d: "", ph: [], ul: [] })
			Info.PHOTO.forEach (( ph, i ) => (ALBUM [ph.a] || ALBUM [0]).ph.push (i))
			ALBUM.forEach (a => {
				if (a.t) for (let ph of a.ph) {
					if (a.t == Info.PHOTO [ph].p) {
						a.t = Info.PHOTO [ph]
						return
					}
				}
				a.t = a.ph.length ? Info.PHOTO [a.ph [0]] : null
			})
			Info.USER_LIST.forEach (( u, idx ) => {
				let aas = new august_bitset (u.a)
				ALBUM.forEach (a => {
					if (aas.test (a.id))
						a.ul.push (idx)
				})
			})
			Info.ALBUM = ALBUM
			let tpl = [
				"form", "form-section1", "form-section2",
				"form-section3", "form-photo", "form-thumb",
				"form-nick", "form-nicklist",
				Info.ALLOW_AVATAR ? "form-avatar" : "",
				Info.ACCESS ? "form-access" : "",
				Info.PROFILE ? "" : "form-rules"
			]
			if (Info.ALLOW_AVATAR && !window.august_cropper)
				August.loadJS ("august.cropper.js").then (() => MAIN.loadCSS ("../cropper"))
			Info.AVATAR_DATA = null
			MAIN.loadTPL (tpl, tpl => {
				TPL = tpl
				if (handlers && handlers.ok)
					handlers.ok (show_form)
				else
					show_form ()
			})
		}, Object.assign (
			August.getid ({
				fp1:	fp1,
				fp2:	fp2,
				id:	root.User ? root.User.ID : ""
			}),
			param || {
				act:	INIT.ID2 ? "edit" : "new",
				sess:	INIT.ID2 ? "" : INIT.SESS
			}
		))
	}
	function show_form ( sec ) {
		let PAGE = $("form") || document.body
		PAGE.innerHTML = `<form class=form>${TPL.form}</form>`
		FORM = PAGE.firstChild
		document.move = 0
		document.lock = 0
		if (MAIN.$sb)
			SB = new MAIN.$sb (FORM)
		August.loadJS ("august.highslide.js").then (() => {
			HS = new august_highslide ("people-hs-wait", "people-hs-img")
		})
		FORM.onsubmit = function () {
			return false
		}
		PAGE.ondragstart = PAGE.ondragover = PAGE.ondrop = function ( e ) {
			if (MAIN.state ())
				return true
			if (e.type == "dragover") {
				e.dataTransfer.dropEffect = (!August.upload.busy () && Section == "photo" && !Info.DENY_PHOTO)
					|| e.$.dataset.avatar
					? "copy"
					: "none"
			} else if (e.type == "drop") {
				if (Section == "photo")
					photo_upload (e.dataTransfer)
				else if (e.$.dataset.avatar)
					avatar_upload (e.$, e.dataTransfer)
			}
			return e.stop ()
		}
		document.onmousedown = function ( e ) {
			let el = e.$
			if (Section == "photo" && e.which == 1 && el.is ("IMG") && el.name == "photo" && !this.lock) {
				let img = el.src
				if (el = el.parent ("THUMB")) {
					let x = e.clientX - el.offsetLeft + el.ml
					let y = e.clientY - el.offsetTop + el.mt
					el.up = 0
					this.thumb = { el, img, x, y }
					return true
				}
			}
		}
		document.onmouseup = function ( e ) {
			function move_end () {
				if (!document.move)
					ThumbsSec.resize (ThumbsSec2.re.bind (ThumbsSec2))
			}
			if (Section == "photo" && this.thumb) {
				let el = this.thumb.el
				this.thumb = null
				if (!this.move)
					return
				let ts = el.parent ()
				let ts1 = ts == ThumbsSec ? ThumbsSec : ThumbsSec2  //  from
				let ts2 = ts == ThumbsSec ? ThumbsSec2 : ThumbsSec  //  to
				let elr = el.rect ()
				let elr2 = el.rect (3)
				let sq = elr.square () >> 1
				if (ts.sq (elr) > sq) for (let i = 0; i < ts.tr.length; i++) {
					if (i == el.idx)
						continue
					let tr = ts.tr [i]
					if (tr.r.cross (elr2) && tr.r.intersect (elr2).square () > sq) {
						let Album = Info.ALBUM [ts.a]
						let di = i > el.idx ? 1 : -1
						ts.insert (el, i > el.idx ? tr.el.next () : tr.el)
						ts.setClass ("move", 1)
						for (let i2 = el.idx; i2 != i; i2 += di)
							ts.tr [i2 + di].el.move (i2)
						Album.ph.insert (i, Album.ph.delete (el.idx)[0])
						el.move (i)
						return
					}
				} else if (ts2.sq && ts2.sq (elr) > sq) {
					let Album1 = Info.ALBUM [ts1.a]
					let Album2 = Info.ALBUM [ts2.a]
					ts2.append (el)
					let dm = ts2.append ("thumb")
					ts2.tr.push ({ r: thumb_rect.call (dm) })
					ts1.setClass ("move", 1)
					ts2.setClass ("move", 1)
					for (var i = 0; i < ts2.tr.length - 1; i++) {
						let tr = ts2.tr [i]
						let r = Object.create (tr.r)
						r.move (-(ts2.scrollLeft + FORM.scrollLeft), -(ts2.scrollTop + FORM.scrollTop))
						if (r.cross (elr) && r.intersect (elr).square () > sq) {
							ts2.insert (el, tr.el)
							for (let i2 = i + 1; i2 < ts2.tr.length; i2++)
								ts2.tr [i2 - 1].el.move (i2, move_end)
							break
						}
					}
					for (let i2 = el.idx + 1; i2 < ts1.tr.length; i2++)
						ts1.tr [i2].el.move (i2 - 1, move_end)
					el.th.s ({ position: "absolute" })
					ts2.remove (dm)
					ts1.tr.length--
					let n = Album1.ph.delete (el.idx)[0]
					Info.PHOTO [n].a = +ts2.a
					Album2.ph.insert (i, n)
					Album1.m.attr ("count", Album1.ph.length)
					Album2.m.attr ("count", Album2.ph.length)
					if (Album1.t && Album1.t.p != Info.PHOTO [n].p)
						;
					else if (Album1.ph.length)
						Album1.t = Info.PHOTO [Album1.ph [0]]
					else
						delete Album1.t
					if (Album2.ph.length == 1)
						Album2.t = Info.PHOTO [Album2.ph [0]]
					el.move (i, move_end)
					return
				}
				el.place (el.th.offsetLeft, el.th.offsetTop)
			}
		}
		document.onmousemove = function ( e ) {
			if (Section == "photo" && this.thumb && !Lock.lock (0)) {
				if (CurPhoto == -1) {
					if (!this.thumb.el.th)
						this.thumb.el.moveable (this.thumb.img)
					this.thumb.el.set (e.clientX - this.thumb.x, e.clientY - this.thumb.y)
				} else {
					this.thumb = null
				}
			}
		}
		MAIN.$ACTION = {
			section:	[section, "section"],
			photo:		photo,
			photo_load:	photo_upload,
			photo_del:	photo_del,
			photo_page:	[photo_page, "action"],
			album_menu:	[album_menu, "action"],
			album_thumb:	[album_thumb, "action"],
			album_ok:	album_ok,
			album_list:	album_list,
			album_create:	album_create,
			add_nick:	add_nick,
			del_nick:	del_nick,
			avatar:		avatar,
			avatar_del:	avatar_del,
			cropper:	cropper,
			cancel:		cancel,
			done:		done
		}
		MAIN.keyHandler (function ( e ) {
			if (e.keyCode == 13) switch (this.name) {
				case "nick":
					return add_nick ()
				case "cur_pass":
				case "pass1":
				case "pass2":
					return done ()
				case "album_name":
					return album_ok ()
			}
			if (e.ctrlKey) switch (e.keyCode) {
				case 33:  //  page up
					if (FORM.prev)
						section (FORM.prev), e.stop ()
					break
				case 34:  //  page down
					if (FORM.next)
						section (FORM.next), e.stop ()
					break
				case 37:  //  left
					if (CurPhoto != -1)
						photo_page ("prev")
					break
				case 39:  //  right
					if (CurPhoto != -1)
						photo_page ("next")
					break
				case 13:
					if (CurPhoto != -1)
						photo_page ("ok")
					break
			}
		})
		MAIN.clickHandler (function ( a ) {
			if (isArray (a))
				return a [0](this.attr (a [1]), this)
		}, function () {
			let NickID = this.attr ("nickid")
			if (!NickID)
				return true
			if (root.Chat && root.Chat.userinfo)
				root.Chat.userinfo ({ nickid: NickID })
			else
				August.wo (`info.php?nickid=${NickID}`, `INFO_${NickID}`, { f: 3 })
			return false
		})
		FORM.Swipe = PAGE.swipe (() => {
			FORM.next && section (FORM.next)
		}, () => {
			FORM.prev && section (FORM.prev)
		}, 100, 1000)
		new Date ().setTimeZone (Info.TIMEZONE)
		Info.NICK.sort (( a, b ) => a.d - b.d)
		Info.NICKID = {}
		for (let i = 0; i < Info.NICK.length; i++)
			Info.NICKID [Info.NICK [i].id] = i
		if (sec)
			return section (sec)
		if (!TPL.form_rules)
			return section ("section1")
		new august_http ().send (`txt/chat-reg-rules.${INIT.LANG}.txt?${INIT.SESS}`, ( r, s ) => {
			section (s < 300 ? (TPL.form_rules = TPL.form_rules.tpl ({ RULES: r }), "rules") : "section1")
		})
	}

	let Error = (function () {
		let $to = 0
		let $ERRORS = ""

		function set ( e ) {
			$ERRORS = e
		}
		function hide () {
			if (ErrorSec) {
				ErrorSec.className = ""
				ErrorSec.innerHTML = ""
				ErrorSec.setHeight (null)
			}
		}
		function show ( err, el, param ) {
			if (!ErrorSec)
				return
			ErrorSec.innerHTML = html (err, param)
			ErrorSec.className = "show"
			ErrorSec.setHeight ()
			el && el.focus ()
			clearTimeout ($to)
			$to = setTimeout (hide, 5000)
		}
		function html ( err, param ) {
			return isArray (err)
				? err.map (( e, i ) => html (e, param [i])).join ("")
				: `<div><div>${$ERRORS.param (err, param).trim () || err}</div></div>`
		}
		return { show, hide, set }
	})()

	let Lock = (() => {
		let $Lock = 0
		return Object.assign ({
			lock: l => {
				if ($Lock && $Lock != l)
					return true
				$Lock = l
				return false
			},
			free: l => {
				if (l && $Lock != l)
					return false
				$Lock = 0
				return true
			}
		}, new Enum ('', 'PHOTO', 'ALBUM_MENU', 'ALBUM_LIST'))
	})()

	let FORM = null
	let Info = null
	let TPL = {}
	let Section = ""
	let SetAlbum = 0
	let CurAlbum = -1
	let CurPhoto = -1
	let ThumbsSec = null
	let ThumbsSec2 = null
	let ErrorSec = null
	let Handlers = null
	let Cropper = null
	let HS = null
	let SB = null
	let TR_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

	this.getForm (param, handlers || {
		exit () {
			location = INIT.ID2 ? `info.php?id2=${INIT.ID2}` : `people.php`
		}
	})
}
