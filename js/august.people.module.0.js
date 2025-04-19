//  August Chat System
//  Copyright (c) 2022 by August
//  License: MIT
//  www:  http://www.august4u.net/
//  file: august.people.module.0.js


function august_people_module_0 ( INFO ) {
	function load_mps ( name, el, sid ) {
		$(`info_section_${name}`).setClass ("loading", 1)
		MAIN.collapse (el).then (_ => august_run (_ => {
			$MPS [name] = new august_mps ({
				VERSION:INIT.VERSION,
				HOST:	INIT.HOST,
				LANG:	INIT.LANG,
				SID:	sid,
				APL:	name,
				SB:	INFO.sb (),
				DESIGN:	`${name}-${MAIN.Design}`,
				User:	{ ID: INIT.USERID },
				root:	$(`info_section_${name}`)
			})
			$MPS [name].init (_ => {
				$(`info_section_${name}`).setClass ("loading")
			})
		}, [
			window.august_mps ? null : "august.mps.js"
		]))
	}
	function show_sec ( name, el ) {
		if (!el.clps || $MPS [name])
			return MAIN.collapse (el)
		August.xhr ()("people.0", r => {
			if (r && r.ID)
				return load_mps (name, el, r.ID)
			INFO.loadTPL ("no-resource", tpl => {
				$(`info_section_${name}`).innerHTML = tpl.no_resource.tpl ({
					ERROR:		"".false (r),
					AUTH:		"".true (r && r.AUTH),
					RESOURCE:	name.toUpperCase ()
				})
				MAIN.collapse (el)
			})
		}, {
			id:	INIT.USERID,
			p:	INIT.PROFILE,
			r:	name
		})
	}
	function create_mps ( name ) {
		MAIN.xhr ("people.0", r => {
			if (r && r.ID)
				load_mps (name, $(`show_${name}`), r.ID)
		}, {
			id:	INIT.USERID,
			p:	INIT.PROFILE,
			r:	name,
			m:	"create"
		})
	}
	function cfg_mps ( name ) {
		MAIN.xhr ("mps.admin", r => INFO.loadTPL (`cfg-${name}`, tpl => {
			if (!r)
				return
			let TF = $MPS [name].TF
			INFO.modal ().show ("cfg_mps", tpl [`cfg_${name}`].tpl ({
				MaxMessLen:		r.mml,
				AccessWrite:		r.aw,
				AccessComment:		r.ac,
				Bubble:			r.bb,
				MessDir:		r.md,
				CommentsDays:		r.ct / 3600 / 24 | 0,
				CommentsHours:		(r.ct % (3600 / 24)) / 3600 | 0,
				Smiles:			r.sm,
				MaxSmiles:		r.ms,
				OneSmile:		r.os,
				CutSmiles:		r.cs,
				PostInterval:		r.pi,
				MessPerHour1:		r.mph1,
				MessPerDay1:		r.mpd1,
				MessPerHour:		r.mph,
				MessPerDay:		r.mpd,
				PreModeration:		r.pm,
				PreModerationEdited:	r.pme,
				AutoAccept:		r.aa,
				Matotester:		r.mt,
				Censor:			r.cn,
				EditDays:		r.et / 3600 / 24 | 0,
				EditHours:		(r.tt % (3600 / 24)) / 3600 | 0,
				EditCount:		r.ec,
				TF_FONT_SET:		TF.FONT & r.tf,
				TF_FONT:		TF.FONT,
				TF_SIZE_SET:		TF.SIZE & r.tf,
				TF_SIZE:		TF.SIZE,
				TF_COLOR_SET:		TF.COLOR & r.tf,
				TF_COLOR:		TF.COLOR,
				TF_STYLE_SET:		TF.STYLE & r.tf,
				TF_STYLE:		TF.STYLE,
				TF_HEADING_SET:		TF.HEADING & r.tf,
				TF_HEADING:		TF.HEADING,
				TF_INDEX_SET:		TF.INDEX & r.tf,
				TF_INDEX:		TF.INDEX,
				TF_JUSIFY_SET:		TF.JUSIFY & r.tf,
				TF_JUSIFY:		TF.JUSIFY,
				TF_INDENT_SET:		TF.INDENT & r.tf,
				TF_INDENT:		TF.INDENT,
				TF_LIST_SET:		TF.LIST & r.tf,
				TF_LIST:		TF.LIST,
				TF_LINE_SET:		TF.LINE & r.tf,
				TF_LINE:		TF.LINE,
				TF_IMAGE_SET:		TF.IMAGE & r.tf,
				TF_IMAGE:		TF.IMAGE,
				TF_MEDIA_SET:		TF.MEDIA & r.tf,
				TF_MEDIA:		TF.MEDIA,
				TF_MAP_SET:		TF.MAP & r.tf,
				TF_MAP:			TF.MAP,
				TF_ROLLING_SET:		TF.ROLLING & r.tf,
				TF_ROLLING:		TF.ROLLING,
				GROUPLIST:	tpl => {
					let gl = $MPS [name].CFG.gl
					if (!gl || !gl.length)
						return ""
					let l = {}
					for (let g of gl)
						l [-g.id] = tpl ? tpl.tpl ({ GROUP_NAME: g.n, GROUP_COUNT: g.c }) : g.n
					return JSON.stringify (l)
				}
			}))
		}), {
			id:	INIT.USERID,
			sess:	$MPS [name].CFG.SessID
		})
	}
	function cfg_save ( name ) {
		let val = n => Form [n] ? Form [n].type == "checkbox" ? +Form [n].checked : Form [n].value : 0
		let Form = INFO.modal ().form ()
		MAIN.xhr ("mps.admin", r => {
			INFO.modal ().hide ()
			if (r === "error") {
				$MPS [name].notice ("ERROR")
			}
		}, {
			id:			INIT.USERID,
			sess:			$MPS [name].CFG.SessID,
			MaxMessLen:		val ("MaxMessLen"),
			AccessWrite:		val ("AccessWrite"),
			AccessComment:		val ("AccessComment"),
			Bubble:			val ("Bubble"),
			MessDir:		val ("MessDir"),
			CommentsTime:		val ("CommentsDays") * 3600 * 24 + val ("CommentsHours") * 3600,
			Smiles:			val ("Smiles"),
			MaxSmiles:		val ("MaxSmiles"),
			OneSmile:		val ("OneSmile"),
			CutSmiles:		val ("CutSmiles"),
			PostInterval:		val ("PostInterval"),
			MessPerHour1:		val ("MessPerHour1"),
			MessPerDay1:		val ("MessPerDay1"),
			MessPerHour:		val ("MessPerHour"),
			MessPerDay:		val ("MessPerDay"),
			PreModeration:		val ("PreModeration"),
			PreModerationEdited:	val ("PreModerationEdited"),
			AutoAccept:		val ("AutoAccept"),
			Matotester:		val ("Matotester"),
			Censor:			val ("Censor"),
			EditTime:		val ("EditDays") * 3600 * 24 + val ("EditHours") * 3600,
			TF:			Form.TF ? Array.from (Form.TF).reduce (( a, f ) => a | (f.checked ? +f.value : 0)) : 0
		})
	}
	function load_design () {
		for (let n in $MPS)
			$MPS [n] && $MPS [n].design (`${n}-${MAIN.Design}`, 1)
	}
	function destroy () {
		if (root.Chat) {
			root.Chat.Event.un ("redesign", load_design)
				.un ("reinit", load_design)
				.un ("people-destroy", destroy)
		}
	}

	const $MPS = {
		wall:	null,
		blog:	null
	}

	MAIN.loadCSS ("people-module-0", () => {
		MAIN.add ({
			show_wall:	show_sec.bind (null, "wall"),
			show_blog:	show_sec.bind (null, "blog"),
			create_wall:	create_mps.bind (null, "wall"),
			create_blog:	create_mps.bind (null, "blog"),
			cfg_wall:	cfg_mps.bind (null, "wall"),
			cfg_blog:	cfg_mps.bind (null, "blog"),
			cfg_wall_save:	cfg_save.bind (null, "wall"),
			cfg_blog_save:	cfg_save.bind (null, "blog")
		})
	})

	if (root.Chat) {
		root.Chat.Event.on ("redesign", load_design)
			.on ("reinit", load_design)
			.on ("people-destroy", destroy)
	}
}
