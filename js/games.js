;
/*  global THREE    */
/*  global $    */
/*  global GAMES    */
"use strict"
//  create GAMES object
if (!this.GAMES) this.GAMES = {};

$(()=>{
    
    GAMES.SAMPLE = function(initData) {
        var thisgame = this
        this.DOC = {
            clicked: undefined
        }
        this.START = undefined
        this.CLOCK = undefined
        this.GAME = {
            keys: {},
            velocity: new THREE.Vector3(),
            test: undefined,
            renderer: undefined,
            scene: undefined,
            camera: undefined,
            displayWidth: undefined,
            displayHeight: undefined
        }
        //  initialize and setup 
        //  key game variables and constants
        this.init = function() {
            let $display = $('#display')
            this.GAME.displayWidth = $display.width()
            this.GAME.displayHeight = $display.height()
            this.CLOCK = new THREE.Clock()
            this.START = this.CLOCK.getElapsedTime()
            
            for (var event in this.HANDLERS.DOC) {
                for (var h in this.HANDLERS.DOC[event]) {
                    $(document).on(event, this.HANDLERS.DOC[event][h])
                }
            }
        }
        this.HANDLERS = {
            DOC: {
                click: [
                    //  record last element clicked
                    (e)=>{
                        thisgame.DOC.clicked = e.target
                        if ($(e.target).attr('data-menubutton')) thisgame.DOC.clicked = thisgame.DISPLAY
                    }
                ],
                keydown: [
                    //  log keypresses
                    (e)=>{
                        if (thisgame.DOC.clicked !== thisgame.DISPLAY) return;
                        thisgame.GAME.keys[e.keyCode] = true
                    },
                    //  prevent default key actions
                    (e)=>{
                        if (e.keyCode === 17 || e.keyCode === 168) return;
                        if (thisgame.DOC.clicked === thisgame.DISPLAY ) {
                            e.preventDefault()
                            return;
                        }
                    }
                ],
                keyup: [
                    (e)=>{
                        if (thisgame.DOC.clicked !== thisgame.DISPLAY) return;
                        thisgame.GAME.keys[e.keyCode] = false
                    }
                ]
            }
        }
        this.init()
        //  create canvas element   
        this.DISPLAY = (()=>{
            var $document = $(document),
                $body = $(document.body),
                $display = $('#display')
                
            this.GAME.camera = new THREE.PerspectiveCamera(50, this.GAME.displayWidth/this.GAME.displayHeight, 1, 1000)
            this.GAME.camera.position.set(0, 0, 300)
            this.GAME.scene = new THREE.Scene()
            this.GAME.renderer = initData.renderer
            this.GAME.renderer.setSize(this.GAME.displayWidth, this.GAME.displayHeight)
            
            //	setup lights
    		var hemisphere = new THREE.HemisphereLight('white', 1)
    		hemisphere.position.set(0, 0, 100)
    		this.GAME.scene.add(hemisphere)
    		var ambient = new THREE.AmbientLight('white', 0.5)
    		this.GAME.scene.add(ambient)
    		
    		//	grid
    		var grid = new THREE.GridHelper(200, 10, new THREE.Color('yellow'))
    		grid.rotateX(Math.PI/2)
    		this.GAME.scene.add(grid)
    		
    		//	add objects
    		this.GAME.test = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshStandardMaterial())
    		this.GAME.scene.add(this.GAME.test)
    		var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 16), new THREE.MeshStandardMaterial())
    		this.GAME.test.add(sphere)
    		sphere.position.set(0, 35, 0)
    		
    		this.GAME.renderer.render(this.GAME.scene, this.GAME.camera)
            var canvas = this.GAME.renderer.domElement

            return canvas;
        })()
        this.MENU = (()=>{
            //  add button group
            var $btngroup = $('<div>')
            $btngroup.addClass('btn-group-vertical col')
            var $btn = $('<button>')
            $btn.attr('type', 'button'); $btn.addClass('btn btn-secondary'); $btn.attr('data-menubutton', '0')
            $btn.text('Reset Position')
            $btngroup.append($btn)
            $btn.on('click', (e)=>{
                thisgame.GAME.test.position.set(0,0,0)
            })
            var $col = $('<div>')
            $col.addClass('col')
            var $row = $('<div>')
            $row.addClass('row')
            $col.append($row); $row.append($btngroup)
            
            return $col;
        })()
        
        //  update function
        this.update = function(data) {
            this.GAME.test.rotation.y += Math.PI * 1/120
		    this.GAME.test.rotation.x += .7 * Math.PI * 1/120
		    this.GAME.velocity.x *= 0.9
		    this.GAME.velocity.y *= 0.9
		    
		    if (this.GAME.keys[37]) this.GAME.velocity.x += -100
		    if (this.GAME.keys[39]) this.GAME.velocity.x += 100
		    if (this.GAME.keys[38]) this.GAME.velocity.y += 100
		    if (this.GAME.keys[40]) this.GAME.velocity.y += -100
		    this.GAME.velocity.x = Math.min(600, Math.abs(this.GAME.velocity.x)) * Math.sign(this.GAME.velocity.x)
		    this.GAME.velocity.y = Math.min(600, Math.abs(this.GAME.velocity.y)) * Math.sign(this.GAME.velocity.y)
		    this.GAME.test.position.x += this.GAME.velocity.x * 1/60
		    this.GAME.test.position.y += this.GAME.velocity.y * 1/60
		    this.GAME.renderer.render(this.GAME.scene, this.GAME.camera)

        }
        this.onresize = function() {
            this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
			this.GAME.camera.updateProjectionMatrix()
			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
        }
        
        //  attach document handlers
        
    }
    
    GAMES.SAMPLE2 = function(initData) {
        var thisgame = this
        this.DOC = {
            clicked: undefined
        }
        this.START = undefined
        this.CLOCK = undefined
        this.GAME = {
            keys: {},
            velocity: new THREE.Vector3(),
            test: undefined,
            renderer: undefined,
            scene: undefined,
            camera: undefined,
            displayWidth: undefined,
            displayHeight: undefined
        }
        //  initialize and setup 
        //  key game variables and constants
        this.init = function() {
            let $display = $('#display')
            this.GAME.displayWidth = $display.width()
            this.GAME.displayHeight = $display.height()
            this.CLOCK = new THREE.Clock()
            this.START = this.CLOCK.getElapsedTime()
        }
        this.init()
        //  create canvas element   
        this.DISPLAY = (()=>{
            var $document = $(document),
                $body = $(document.body),
                $display = $('#display')
                
            this.GAME.camera = new THREE.PerspectiveCamera(50, this.GAME.displayWidth/this.GAME.displayHeight, 1, 1000)
            this.GAME.camera.position.set(0, 0, 300)
            this.GAME.scene = new THREE.Scene()
            this.GAME.renderer = initData.renderer
            this.GAME.renderer.setSize(this.GAME.displayWidth, this.GAME.displayHeight)
            
            //	setup lights
    		var hemisphere = new THREE.HemisphereLight('white', 1)
    		hemisphere.position.set(0, 0, 100)
    		this.GAME.scene.add(hemisphere)
    		var ambient = new THREE.AmbientLight('white', 0.5)
    		this.GAME.scene.add(ambient)
    		
    		//	grid
    		var grid = new THREE.GridHelper(200, 10, new THREE.Color('yellow'))
    		grid.rotateX(Math.PI/2)
    		this.GAME.scene.add(grid)
    		
    		//	add objects
    		this.GAME.test = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshStandardMaterial())
    		this.GAME.scene.add(this.GAME.test)
    		var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 16), new THREE.MeshStandardMaterial())
    		this.GAME.test.add(sphere)
    		sphere.position.set(0, 35, 0)
    		
    		this.GAME.renderer.render(this.GAME.scene, this.GAME.camera)
            var canvas = this.GAME.renderer.domElement

            return canvas;
        })()
        this.MENU = (()=>{
            var $btn = $('<button>')
            $btn.attr('type', 'button'); $btn.addClass('btn btn-secondary'); $btn.attr('data-menubutton', '0')
            $btn.text('Zoom In')
            var $btngroup = $('<div>')
            $btngroup.addClass('btn-group-vertical col')
            $btngroup.append($btn)
            $btn.on('click', (e)=>{
                thisgame.GAME.camera.position.z -= 30;
            })
            $btn = $('<button>')
            $btn.attr('type', 'button'); $btn.addClass('btn btn-secondary'); $btn.attr('data-menubutton', '1')
            $btn.text('Zoom Out')
            $btn.on('click', (e)=>{
                thisgame.GAME.camera.position.z += 30;
            })
            $btngroup.append($btn)
            return $btngroup;
        })()
        this.HANDLERS = {
            DOC: {
                click: [
                    //  record last element clicked
                    (e)=>{
                        thisgame.DOC.clicked = e.target
                        if ($(e.target).attr('data-menubutton')) thisgame.DOC.clicked = thisgame.DISPLAY
                    }
                ],
                keydown: [
                    //  log keypresses
                    (e)=>{
                        if (thisgame.DOC.clicked !== thisgame.DISPLAY) return;
                        thisgame.GAME.keys[e.keyCode] = true
                    },
                    //  prevent default key actions
                    (e)=>{
                        if (e.keyCode !== 17 && e.keyCode !== 168 && thisgame.DOC.clicked === thisgame.DISPLAY) {
                            e.preventDefault()
                            return;
                        }
                    }
                ],
                keyup: [
                    (e)=>{
                        if (thisgame.DOC.clicked !== thisgame.DISPLAY) return;
                        thisgame.GAME.keys[e.keyCode] = false
                    }
                ]
            }
        }
        //  attach document handlers
        for (var event in this.HANDLERS.DOC) {
            for (var h in this.HANDLERS.DOC[event]) {
                $(document).on(event, this.HANDLERS.DOC[event][h])
            }
        }
        
        //  update function
        this.update = function(data) {
            this.GAME.test.rotation.y += Math.PI * 1/120
		    this.GAME.test.rotation.x += .7 * Math.PI * 1/120
		    this.GAME.velocity.x *= 0.9
		    this.GAME.velocity.y *= 0.9
		    
		    if (this.GAME.keys[37]) this.GAME.velocity.x += -100
		    if (this.GAME.keys[39]) this.GAME.velocity.x += 100
		    if (this.GAME.keys[38]) this.GAME.velocity.y += 100
		    if (this.GAME.keys[40]) this.GAME.velocity.y += -100
		    this.GAME.velocity.x = Math.min(600, Math.abs(this.GAME.velocity.x)) * Math.sign(this.GAME.velocity.x)
		    this.GAME.velocity.y = Math.min(600, Math.abs(this.GAME.velocity.y)) * Math.sign(this.GAME.velocity.y)
		    this.GAME.test.position.x += this.GAME.velocity.x * 1/60
		    this.GAME.test.position.y += this.GAME.velocity.y * 1/60
		    this.GAME.renderer.render(this.GAME.scene, this.GAME.camera)

        }
        this.onresize = function() {
            this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
			this.GAME.camera.updateProjectionMatrix()
			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
        }
        
        
    }
    
    /*
    Games should follow the interface:
        Properties:
            START (float): time of game creation
            CLOCK (THREE.Clock): game clock
            GAME (Object): contains game variables
            DISPLAY (HTML5 canvas): canvas element containing THREE.js renderer
            MENU (jQuery object): jQuery object containing game menu
            HANDLERS (Object): contains DOM event handlers
        Functions:
            init(): initializes key variables
            update(data): function to be called to update renderer;
                          argument is an Object
            onresize(): adjusts THREE.js projection matrix
    */
    GAMES.TICTACTOE = function(initData) {
        //  GAMES.SAMPLE.call(this);
        var thisgame = this
        this.START = undefined
        this.CLOCK = undefined
        this.GAME = {
            renderer: undefined,
            scene: undefined,
            camera: undefined,
            displayWidth: undefined,
            displayHeight: undefined,
            objs: undefined,
            mouse: undefined
        }
        this.init = function() {
            var $display = $('#display')
            var $document = $(document)
            var $window = $(window)
            
            this.GAME.objs = {
                sq: [],
                cross: [],
                circle: []
            }
            this.GAME.objs.sq.push({
                empty: new THREE.Color('darkgrey'),
                hover: new THREE.Color('lightgrey')
            })
            this.CLOCK = new THREE.Clock()
            this.START = this.CLOCK.getElapsedTime()
            this.GAME.displayWidth = $display.width()
            this.GAME.displayHeight = $display.height()
            this.GAME.mouse = {
                coords: new THREE.Vector2(1, 1),
                rayc: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3())
            }
            
            for (var event in this.HANDLERS.DOC) {
                for (var h in this.HANDLERS.DOC[event]) {
                    $document.on(event, this.HANDLERS.DOC[event][h])
                }
            }
            for (var event in this.HANDLERS.WIN) {
                for (var h in this.HANDLERS.WIN[event]) {
                    $window.on(event, this.HANDLERS.WIN[event][h])
                }
            }
            
        }
        this.MODES = {
            single: {
                on: false,
                turn: 0,
                first_player: 0,
                board: undefined,
                update: function(data) {
                    if (this.board === undefined) { //  startup
                        console.log('single mode start')
                        this.board = [0]
                        this.action.setup.on = true
                    } else if (this.action.setup.on) {  //  setup
                        var dataObj = {
                            first: this.first_player,
                            turn: this.turn,
                            board: this.board
                        }
                        this.action.setup.update(dataObj)
                    } else if (this.action.vs.on) { //  vs
                        var dataObj = {
                            first: this.first_player,
                            turn: this.turn,
                            board: this.board
                        }
                        var ret = this.action.vs.update(dataObj)
                        if (ret !== undefined) {    //  if player made move, change turns
                            if (ret.changeturn !== undefined) {
                                this.turn = ret.changeturn
                            }
                        }
                    } else if (this.action.victory.on) {    //  victory
                        var dataObj = {
                            first: this.first_player,
                            turn: this.turn,
                            board: this.board
                        }
                        this.action.victory.update(dataObj)
                    } else if (this.action.newgame.on) {    //  new game
                        var dataObj = {
                            first: this.first_player,
                            turn: this.turn,
                            board: this.board
                        }
                        this.action.newgame.update(dataObj)
                    }
                },
                reset: function() {
                
                },
                action: {
                    setup: {
                        on: false,
                        update: function(data) {
                            //  enlarge squares
                            if (thisgame.GAME.objs.sq[1].scale.x < 79.5/60) {
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x += 0.01
                                    thisgame.GAME.objs.sq[i].scale.y += 0.01
                                }
                            }
                            else {
                                //  ensure squares arent overscaled
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x = 79.5/60
                                    thisgame.GAME.objs.sq[i].scale.y = 79.5/60
                                }
                                this.on = false
                                thisgame.MODES.single.action.vs.on = true
                            }
                        },
                        reset: function() {
                            this.on = false
                        }
                    },
                    vs: {
                        on: false,
                        queue: undefined,   //  move queue
                        hover: undefined,   //  valid square mouse is hovering
                        reset: function() {
                            this.on = false
                            this.queue = undefined
                            this.hover = undefined
                            this.action.makingmove.reset()
                        },
                        wincheck: function(board) {
                            //  returns 1 if player 1 wins
                            //  -1 if player 2 wins
                            //  0 if draw
                            for (var i=1 ; i<=7 ; i+=3) {
                                var win = true
                                for (var j=0 ; j<2 ; j++) {
                                    if (board[i+j] === undefined || board[i+j]%2!==board[i+j+1]%2) {
                                        win = false
                                        break;
                                    }
                                }
                                if (win) {
                                    return (board[i]%2===0?1:-1);
                                }
                            }
                            for (var i=1 ; i<=3 ; i++) {
                                win = true
                                for (var j=0 ; j<=3 ; j+=3) {
                                    if (board[i+j] === undefined || board[i+j]%2!==board[i+j+3]%2) {
                                        win = false
                                        break;
                                    }
                                }
                                if (win) {
                                    return (board[i]%2===0?1:-1);
                                }
                            }
                            if (board[1] !== undefined && board[1]%2 === board[5]%2 && board[5]%2 === board[9]%2) return (board[1]%2===0?1:-1)
                            if (board[3] !== undefined && board[3]%2 === board[5]%2 && board[5]%2 === board[7]%2) return (board[3]%2===0?1:-1)
                            
                            return 0;
                        },
                        AI: {
                            a: (function(){
                                function Node(id) {
                                    this.id = id
                                    this.children = []
                                    this.winrate = 0
                                }
                                function wincheck (board) {
                                  for (var i=1 ; i<=7 ; i+=3) {
                                    var win = true
                                    for (var j=0 ; j<2 ; j++) {
                                      if (board[i+j] === undefined || board[i+j]%2!==board[i+j+1]%2) {
                                        win = false
                                        break;
                                      }
                                    }
                                    if (win) {
                                      return (board[i]%2===0?1:-1);
                                    }
                                  }
                                  for (var i=1 ; i<=3 ; i++) {
                                    win = true
                                    for (var j=0 ; j<=3 ; j+=3) {
                                      if (board[i+j] === undefined || board[i+j]%2!==board[i+j+3]%2) {
                                        win = false
                                        break;
                                      }
                                    }
                                    if (win) {
                                      return (board[i]%2===0?1:-1);
                                    }
                                  }
                                  if (board[1] !== undefined && board[1]%2 === board[5]%2 && board[5]%2 === board[9]%2) return (board[1]%2===0?1:-1)
                                  if (board[3] !== undefined && board[3]%2 === board[5]%2 && board[5]%2 === board[7]%2) return (board[3]%2===0?1:-1)
                                
                                  return 0;
                                }
                                function rec1(node, board) {
                                  board[node.id] = board[0]++;
                                  var check = wincheck(board)
                                  if (check !== 0) {
                                  	node.winrate = check
                                    for (var i=9-board[0] ; i>1 ; i--) node.winrate *= i;
                                    board[node.id] = undefined
                                    board[0]--;
                                    return node.winrate;
                                  }
                                  if (board[0] === 9) {
                                  	board[node.id] = undefined
                                    board[0]--;
                                  	return 0;
                                  }
                                	for (var i=1 ; i<=9 ; i++) {
                                  	if (board[i] !== undefined) continue;
                                    node.children[i] = new Node(i)
                                    node.winrate += rec1(node.children[i], board)
                                  }
                                  board[node.id] = undefined
                                	board[0]--;
                                  return node.winrate;
                                }
                                function rec2(node, board) {
                                	board[node.id] = board[0]++;
                                  var check = wincheck(board)
                                  if (check !== 0) {
                                  	node.winrate = check*-1
                                    for (var i=9-board[0] ; i>1 ; i--) node.winrate *= i;
                                    board[node.id] = undefined
                                    board[0]--;
                                    return node.winrate;
                                  }
                                  if (board[0] === 9) {
                                    board[node.id] = undefined
                                    board[0] --;
                                    return 0;
                                  }
                                	for (var i=1 ; i<=9 ; i++) {
                                  	if (board[i] !== undefined) continue;
                                    node.children[i] = new Node(i)
                                    node.winrate += rec2(node.children[i], board)
                                  }
                                  board[node.id] = undefined
                                  board[0]--;
                                  return node.winrate;
                                }
                                var a = {
                                    a1: new Node(0),
                                    a2: new Node(0)
                                }
                                var b = [0]
                                for (var i=1 ; i<=9 ; i++) b[i] = undefined
                                for (var i=1 ; i<=9 ; i++) {
                                    a.a1.children[i] = new Node(i)
                                    rec1(a.a1.children[i], b)
                                    a.a2.children[i] = new Node(i)
                                    rec2(a.a2.children[i], b)
                                }
                                
                                return a;
                            })(),
                            check1: function(board, move) {
                                function wincheck (board) {
                                  for (var i=1 ; i<=7 ; i+=3) {
                                    var win = true
                                    for (var j=0 ; j<2 ; j++) {
                                      if (board[i+j] === undefined || board[i+j]%2!==board[i+j+1]%2) {
                                        win = false
                                        break;
                                      }
                                    }
                                    if (win) {
                                      return (board[i]%2===0?1:-1);
                                    }
                                  }
                                  for (var i=1 ; i<=3 ; i++) {
                                    win = true
                                    for (var j=0 ; j<=3 ; j+=3) {
                                      if (board[i+j] === undefined || board[i+j]%2!==board[i+j+3]%2) {
                                        win = false
                                        break;
                                      }
                                    }
                                    if (win) {
                                      return (board[i]%2===0?1:-1);
                                    }
                                  }
                                  if (board[1] !== undefined && board[1]%2 === board[5]%2 && board[5]%2 === board[9]%2) return (board[1]%2===0?1:-1)
                                  if (board[3] !== undefined && board[3]%2 === board[5]%2 && board[5]%2 === board[7]%2) return (board[3]%2===0?1:-1)
                                
                                  return 0;
                                }
                                if (board[0] === 8) return move;
                                board[move] = board[0]++;
                                for (var i=1 ; i<=9 ; i++) {
                                    if (board[i] !== undefined) continue;
                                    board[i] = board[0]++
                                    if (wincheck(board) === 1) {
                                        board[0] -= 2;
                                        board[i] = undefined
                                        board[move] = undefined
                                        return i;
                                    }
                                    board[0]--;
                                    board[i] = undefined
                                }
                                
                                
                                board[0]--;
                                board[move] = undefined
                                return move;
                            },
                            next: function(data) {  //  ideally returns next ideal move
                                var current = (data.first === 0 ? this.a.a2 : this.a.a1)
                                for (var i=0 ; i<data.board[0] ; i++) {
                                    for (var j=1 ; j<=9 ; j++) {
                                        if (data.board[j] === i) {
                                            current = current.children[j]
                                        }
                                    }
                                }
                                for (var i=1, max=-1; i<=9 ; i++) {
                                    if (current.children[i] === undefined) continue;
                                    if (max === -1) max = i
                                    else if (current.children[i].winrate>current.children[max].winrate) max = i
                                }
                                return (data.first === 1 ? max : this.check1(data.board, max));
                            }  
                        },
                        update: function(data) {
                            //  if making move animation updating
                            if (this.action.makingmove.status === 1) {
                                this.action.makingmove.update({turn: data.turn})
                                return;
                            } else if (this.action.makingmove.status === 2) {
                                this.action.makingmove.status = 0
                                return {
                                  changeturn: 1-data.turn  
                                };
                            }
                            
                            //  handle moves queue
                            if (this.queue === undefined) {
                                this.queue = []
                            } else if (this.queue.length > 0) {
                                var move = this.queue.shift()
                                if (move.turn !== data.turn) return;    //  return if queue'd move is not current player's
                                
                                if (data.turn === 0) {  //  if player turn
                                    data.board[move.square] = data.board[0]++;
                                    this.action.makingmove.update({turn: data.turn, move: move.square})
                                    //  makingmove animation
                                } else {    //   if AI turn
                                    data.board[move.square] = data.board[0]++;
                                    this.action.makingmove.update({turn: data.turn, move: move.square})
                                }
                                
                                //  determine win/lose
                                if (!this.action.makingmove.on) {
                                    //  vs stage = off; victory stage = on
                                    var winner = this.wincheck(data.board)
                                    if (winner !== 0) {
                                        if (winner === 1) { //  first player wins
                                            if (data.first === 0) console.log('Player wins!')
                                            else console.log('AI wins!')
                                        } else {    //  second player wins
                                            if (data.first === 1) {
                                                console.log('Player wins!')
                                                thisgame.MODES.single.first_player = 0
                                            }
                                            else {
                                                console.log('AI wins!')
                                                thisgame.MODES.single.first_player = 1
                                            }
                                        }
                                        this.on = false
                                        thisgame.MODES.single.action.victory.on = true
                                        return;
                                    } else {
                                        if (data.board[0] === 9) {
                                            console.log('Draw!')
                                            this.on = false
                                            thisgame.MODES.single.action.victory.on = true
                                        }
                                    }
                                    
                                }
                            } else if (data.turn === 1) {    //   if AI turn
                                var dataObj = {
                                    board: data.board,
                                    first: data.first
                                }
                                var sq = this.AI.next(dataObj)  //   get and queue next move
                                this.queue.push({   
                                    turn: 1,
                                    square: sq
                                })
                            }
                            
                            
                            //  if player turn,
                            //  highlight squares on hover
                            if (data.turn === 0) {
                                thisgame.GAME.mouse.rayc.setFromCamera(thisgame.GAME.mouse.coords, thisgame.GAME.camera)
                                var intersections = thisgame.GAME.mouse.rayc.intersectObjects(thisgame.GAME.scene.children)
                                var obj = undefined
                                
                                //  highlight on hover
                                var onboard = false //  hovering over board
                                for (var i=0 ; i<intersections.length ; i++) {
                                    if (intersections[i].object.purpose !== undefined && intersections[i].object.purpose.match(/square/)) {
                                        obj = intersections[i].object
                                        if (data.board[+obj.purpose.charAt(6)] !== undefined) {   //  skip if selected
                                            onboard = false
                                            
                                            break;  
                                        }
                                        obj.material.color = thisgame.GAME.objs.sq[0].hover
                                        this.hover = +obj.purpose.charAt(6)
                                        onboard = true
                                        
                                        break;   
                                    }
                                }
                                //  de-highlight on hover out
                                for (var i=1 ; i<=9 ; i++) {
                                    if (thisgame.GAME.objs.sq[i] === obj || data.board[+thisgame.GAME.objs.sq[i].purpose.charAt(6)] !== undefined) continue
                                    thisgame.GAME.objs.sq[i].material.color = thisgame.GAME.objs.sq[0].empty
                                }
                                //   if not on board, set hovered square to undefined
                                if (!onboard) this.hover = undefined
                            } 
                        },
                        action: {
                            makingmove: {
                                status: 0,
                                turn: undefined,
                                move: undefined,
                                reset: function() {
                                  this.status = 0
                                  this.turn = undefined
                                  this.move = undefined
                                },
                                update: function(data) {
                                    if (this.turn === undefined) {
                                        this.turn = data.turn
                                        this.move = data.move
                                        this.status = 1
                                        
                                        var piece = (data.turn === 0 ? thisgame.GAME.objs.circle : thisgame.GAME.objs.cross)
                                        for (var i=0 ; i<piece.length ; i++) {  //  add unused piece to board
                                            if (piece[i].GAME.onboard) continue;
                                            
                                            thisgame.GAME.scene.add(piece[i])
                                            piece[i].GAME.onboard = true
                                            var pos = [0,
                                                {x:-80, y:80}, {x:0, y:80}, {x:80, y:80},
                                                {x:-80, y:0}, {x:0, y:0}, {x:80, y:0},
                                                {x:-80, y:-80}, {x:0, y:-80}, {x:80, y:-80}
                                            ]
                                            piece[i].position.set(pos[this.move].x, pos[this.move].y, 0)
                                            
                                            break;
                                        }
                                        
                                        thisgame.GAME.objs.sq[this.move].material.color = thisgame.GAME.objs.sq[0].empty
                                    } else {    //  reset after animation
                                        this.turn = undefined
                                        this.move = undefined
                                        this.status = 2
                                    }
                                }
                            }
                        }
                    },
                    victory: {
                        on: false,
                        reset: function() {
                          this.on = false  
                        },
                        update: function(data) {
                            this.on = false
                            thisgame.MODES.single.action.newgame.on = true
                        }
                    },
                    newgame: {
                        on: false,
                        reset: function() {
                            this.on = false
                        },
                        update: function(data) {
                            var action = thisgame.MODES.single.action
                            action.vs.reset()   //  reset action variables
                            action.victory.reset()  //   reset victory variables
                            //  reset board
                            for (var i=data.board.length ; i>1 ; i--) {
                                data.board.pop()
                            }
                            data.board[0] = 0
                            //  reset and remove pieces
                            for (var i=0 ; i<=4 ; i++) {
                                thisgame.GAME.scene.remove(thisgame.GAME.objs.circle[i])
                                thisgame.GAME.objs.circle[i].GAME.onboard = false
                                thisgame.GAME.scene.remove(thisgame.GAME.objs.cross[i])
                                thisgame.GAME.objs.cross[i].GAME.onboard = false
                            }
                            
                            //  reset to vs stage
                            this.on = false
                            action.vs.on = true
                        }
                    }
                } 
            },
            multi: {
                on: false,
                update: function(board) {
                    
                }
                
            }
        }
        this.HANDLERS = {
            DOC: {
                mousemove: [
                    (e)=> {
                        //  update mouse coordinates
                        if (thisgame.DISPLAY === undefined) return;
                        var offset = $(thisgame.DISPLAY).offset()
                        var $doc = $(document)
                        var x = Math.min(e.clientX+$doc.scrollLeft(), thisgame.GAME.displayWidth)
                        var y = e.clientY+$doc.scrollTop() < offset.top ? 0 : (e.clientY+$doc.scrollTop()>offset.top+thisgame.GAME.displayHeight+$doc.scrollTop()?thisgame.GAME.displayHeight:$doc.scrollTop()+e.clientY-offset.top)
                        thisgame.GAME.mouse.coords.x = (x / thisgame.GAME.displayWidth) * 2 - 1
                        thisgame.GAME.mouse.coords.y = -(y / thisgame.GAME.displayHeight) * 2 + 1
                    }    
                ],
                click: [
                    (e)=> {
                        //  if single mode
                        if (thisgame.MODES.single.on) {
                            var move = thisgame.MODES.single.action.vs.hover
                            if (move !== undefined) {
                                thisgame.MODES.single.action.vs.queue.push({
                                    turn: 0,
                                    square: move
                                })
                            }
                        } else {    //  if vs mode
                            
                        }
                    }
                ]
            },
            WIN: {
                
            }
        }
        this.init()
        this.DISPLAY = (()=>{
            var $document = $(document),
                $body = $(document.body),
                $display = $('#display')
            //  setup    
            this.GAME.camera = new THREE.PerspectiveCamera(50, this.GAME.displayWidth/this.GAME.displayHeight, 1, 1000)
            this.GAME.camera.position.set(0, 0, 300)
            this.GAME.scene = new THREE.Scene()
            this.GAME.renderer = initData.renderer
            this.GAME.renderer.setSize(this.GAME.displayWidth, this.GAME.displayHeight)
            
        //  add objects
            //	lights
    		var hemisphere = new THREE.HemisphereLight('white', 1)
    		hemisphere.position.set(0, 0, 100)
    		this.GAME.scene.add(hemisphere)
    		var ambient = new THREE.AmbientLight('white', 0.5)
    		this.GAME.scene.add(ambient)
    		
    		//	grid
    		var grid = new THREE.GridHelper(240, 3, new THREE.Color('yellow'))
    		grid.rotateX(Math.PI/2)
    		//  this.GAME.scene.add(grid)
    		
    		//  add squares
    		var n = 1;
            for (var y=80 ; y>=-80 ; y-=80) {
                for (var x=-80 ; x<=80 ; x+=80) {
                    var plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 0, 0), new THREE.MeshBasicMaterial())
                    plane.purpose = 'square' + n
                    this.GAME.scene.add(plane)
                    plane.position.set(x, y, 0);
                    n++;
                    plane.material.color = thisgame.GAME.objs.sq[0].empty
                    thisgame.GAME.objs.sq.push(plane)
                }
            }
            //  add cross, circles
            for (var i=1 ; i<=5 ; i++) {
                var circle = new THREE.Mesh(new THREE.CircleGeometry(60/2, 32), new THREE.MeshBasicMaterial({color: new THREE.Color('white')}))
                thisgame.GAME.objs.circle.push(circle)
                circle.GAME = {
                    onboard: false
                }
                var cross = new THREE.Group()
                var linegeometry = new THREE.Geometry()
                linegeometry.vertices.push(new THREE.Vector3(75/(2*Math.sqrt(2)), 75/(2*Math.sqrt(2)), 0))
                linegeometry.vertices.push(new THREE.Vector3(-75/(2*Math.sqrt(2)), -75/(2*Math.sqrt(2)), 0))
                var line = new THREE.Line(linegeometry, new THREE.LineBasicMaterial({color: new THREE.Color('white'), linewidth: 20}))
                cross.add(line)
                linegeometry = new THREE.Geometry()
                linegeometry.vertices.push(new THREE.Vector3(-75/(2*Math.sqrt(2)), 75/(2*Math.sqrt(2)), 0))
                linegeometry.vertices.push(new THREE.Vector3(75/(2*Math.sqrt(2)), -75/(2*Math.sqrt(2)), 0))
                line = new THREE.Line(linegeometry, new THREE.LineBasicMaterial({color: new THREE.Color('white'), linewidth: 20}))
                cross.add(line)
                thisgame.GAME.objs.cross.push(cross)
                cross.GAME = {
                    onboard: false
                }
            }
            
            //  initial render
            this.GAME.renderer.render(this.GAME.scene, this.GAME.camera)
            var canvas = this.GAME.renderer.domElement
            return canvas;
        })()
        
        this.MENU = (()=>{
            var $btngroup = $('<div>')
            var btns = ['Reset', '2 Player', 'Single Player']
            var click_handlers = [
                (e)=>{
                    console.log('reset button pressed')
                },
                (e)=> {
                    this.MODES.multi.on = true
                },
                (e)=> {
                    this.MODES.single.on = true
                }
                
            ]
            $btngroup.addClass('btn-group-vertical col')
            var $btn;
            
            for (var i=0 ; i<btns.length ; i++) {
                $btn = $('<button>')
                $btn.attr('type', 'button'); $btn.addClass('btn btn-secondary'); $btn.attr('data-menubutton', i)
                $btn.text(btns[i])
                $btn.on('click', click_handlers[i])
                $btngroup.append($btn)
            }
            /*
                $col
                    $row
                        $btngroup
                            $btn
            */
            var $col = $('<div>')
            $col.addClass('col')
            var $row = $('<div>')
            $row.addClass('row')
            $col.append($row); $row.append($btngroup)
            
            return $col;
        })()
        
        this.update = function() {
            
            //  delegate update to single/multi update
            if (this.MODES.single.on) {
                this.MODES.single.update()
                
            } else if (this.MODES.multi.on) {
                this.MODES.multi.update()
                
            }
            
            /*
            //  no modes selected
            if (!this.MODES.multi.on && !this.MODES.single.on) return;
            thisgame.GAME.mouse.rayc.setFromCamera(thisgame.GAME.mouse.coords, thisgame.GAME.camera)
            var intersections = thisgame.GAME.mouse.rayc.intersectObjects(thisgame.GAME.scene.children)
            var obj = undefined
            
            //  highlight on hover
            for (var i=0 ; i<intersections.length ; i++) {
                if (intersections[i].object.purpose !== undefined && intersections[i].object.purpose.match(/square/)) {
                    obj = intersections[i].object
                    obj.material.color = thisgame.GAME.objs.sq[0].hover
                    
                    break;   
                }
            }
            //  de-highlight on hover out
            for (var i=1 ; i<=9 ; i++) {
                if (thisgame.GAME.objs.sq[i] === obj) continue
                thisgame.GAME.objs.sq[i].material.color = thisgame.GAME.objs.sq[0].empty
            }
            */
            
            
            thisgame.GAME.renderer.render(thisgame.GAME.scene, thisgame.GAME.camera)
        }
        
        this.onresize = function() {
            this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
			this.GAME.camera.updateProjectionMatrix()
			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
        }
        
        //  prevent default click and drag
        $(thisgame.DISPLAY).on('mousedown', (e)=>{
            e.preventDefault()
        })
    }
    
})