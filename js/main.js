/*	global $	*/
/*	global GAMES	*/
/* global THREE	*/

;$(function(){
	"use strict"
	var loaded = false	//	if startup progress bar has loaded
	var loaded_interval_id = undefined	//	interval id of startup function
	var START = Date.now()	//	start of app
	var GAME = undefined	//	current game
	var UPDATING = false	//	if looping
	var RENDERER = new THREE.WebGLRenderer()
	
	//	test startup loading screen
	loaded_interval_id = window.setInterval(startup, 100)
	function startup() {
		//	setup progress box and bar
		if ($('#startup_progress').css('display') === 'none') {
			var $startup_progress = $('#startup_progress')
			$startup_progress.show()
			$startup_progress.width(0.4 * window.innerWidth)
			$startup_progress.css('top', window.innerHeight * 0.6)
			$startup_progress.css('left', 0.3 * window.innerWidth)
		}
		//	setup startup message
		if ($('#startup_msg').css('display') === 'none') {
			var $msg = $('#startup_msg')
			$msg.show()
			$msg.css('top', window.innerHeight * 0.3)
			$msg.css('left', window.innerWidth/2 - $msg.width()/2)
		}
	
		//	advance the bar if still loading
		if (!loaded) {
			var diff = Date.now()-START
			if (diff/1000 < 1.5) {	//	load condition 
				$('#startup_progress_bar').width(0.4 * window.innerWidth * diff/1000 / 1.5)
				$('#startup_msg').css('opacity', 1 + .5 * Math.sin(diff/1000 * Math.PI ))
				return;
			}
			$('#startup_progress_bar').width(0.4 * window.innerWidth)
			loaded = true
			return;
		}
		//	show/setup main content
		//	hide progress content
		var $display = $('#display')
		
		$display.height(window.innerHeight * 0.8)
		$('#top, #bot, #display').show()
		$('#startup').hide()
		$('#startup_progress').hide()
		window.clearInterval(loaded_interval_id)
		
	/*	after clearing */
		
		//	load game
		$('#options').on('click', 'button[role="load_game"]', (e)=>{
			console.log($(e.target).attr('data-gameid'))
			
			//	if a game is running, unload game and break update loop
			if (GAME !== undefined && UPDATING) {
				//	remove handlers attached to document/window
				if (GAME.HANDLERS !== undefined) {
					if (GAME.HANDLERS.DOC !== undefined) {
						for (var event in GAME.HANDLERS.DOC) {
							for (var i=0 ; i<GAME.HANDLERS.DOC[event].length ; i++) {
								$(document).off(event, GAME.HANDLERS.DOC[event][i])
							}
						}
					}
					if (GAME.HANDLERS.WIN !== undefined) {
						for (var event in GAME.HANDLERS.WIN) {
							for (var i=0 ; i<GAME.HANDLERS.WIN[event].length ; i++) {
								$(window).off(event, GAME.HANDLERS.WIN[event][i])
							}
						}
					}
				}
				//	remove current game
				$(GAME.DISPLAY).remove()
				if (GAME.MENU) GAME.MENU.remove()
				GAME = $(e.target).attr('data-gameid')	//	define event callback
				return;
			}
			GAME = new GAMES[$(e.target).attr('data-gameid')]({renderer: RENDERER});
			$('#display').append(GAME.DISPLAY)	//	add canvas
			$(e.target).parent().after(GAME.MENU)	//	add menu
			UPDATING = true
			console.log('game loaded')
			loop()
		})
		
		function loop() {
			//	if game is unloaded, call load game event handler
			if (typeof(GAME)==='string') {
				UPDATING = false
				$('[data-gameid="'+GAME+'"]').trigger('click')
				return;
			}
			GAME.update()
			requestAnimationFrame(loop)
		}
		
		//	add options menu
		var gameCount = 0;
		for (let game in GAMES) {
			let id = '#game' + gameCount;
			let card = $('<div>')
			card.addClass('card')
			//	card header
			let a = $('<a>')
			a.attr('data-toggle', 'collapse'); a.attr('data-parent', '#options'); a.attr('href', id)
			a.text(game)
			let h5 = $('<h5>')
			h5.addClass('mb-0')
			let cardheader = $('<div>')
			cardheader.addClass('card-header')
			h5.append(a); cardheader.append(h5); card.append(cardheader)
			//	card contents
			let btn = $('<button>')
			btn.attr('data-gameid', game); btn.attr('role', 'load_game'); btn.addClass('btn btn-secondary'); btn.text('Load')
			let btngroup = $('<div>')
			btngroup.addClass('btn-group-vertical col'); btngroup.prop('type', 'button')
			let cardblock = $('<div>')
			cardblock.addClass('card-block')
			let contents = $('<div>')
			contents.prop('id', id.substring(1)); contents.addClass('collapse')
			btngroup.append(btn); cardblock.append(btngroup); contents.append(cardblock)
			//	add to card and #options
			let $options = $('#options')
			card.append(cardheader); card.append(contents)
			$options.append(card)
			
			gameCount++;
		}
		
		//	on window resizing
		$(window).on('resize', ()=>{
			//	update projection matrix and renderer on window resizing
			if (GAME === undefined) return;
			GAME.onresize()
		})
	}

})