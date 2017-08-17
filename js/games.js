;
/*  global THREE    */
/*  global $    */
/*  global GAMES    */
//  create GAMES object
if (!this.GAMES) this.GAMES = {};

$(()=>{
    "use strict"
    
    GAMES.SAMPLE = function(initData) {
        var thisgame = this
        this.TITLE = 'SAMPLE'
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
            this.GAME.displayWidth = initData.width || $display.width()
            this.GAME.displayHeight = initData.height || $display.height()
            this.CLOCK = new THREE.Clock()
            this.START = this.CLOCK.getElapsedTime()
            
            for (var event in this.HANDLERS.DOC) {
                for (var h in this.HANDLERS.DOC[event]) {
                    $(document).on(event, this.HANDLERS.DOC[event][h])
                }
            }
            for (var event in this.HANDLERS.WIN) {
                for (var h in this.HANDLERS.WIN[event]) {
                    $(window).on(event, this.HANDLERS.WIN[event][h])
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
            },
            WIN: {
                resize: [
                    (e) => {
                        this.GAME.displayHeight = $(this.DISPLAY).parent().height()
                        this.GAME.displayWidth = $(this.DISPLAY).parent().width()
                        this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
            			this.GAME.camera.updateProjectionMatrix()
            			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
                    }
                ]
            },
            MENU: {
                click: [
                    (e) => {
                        thisgame.GAME.test.position.set(0,0,0)
                    }
                ]
            }
        }
        this.COMMUNICATION = {
            outgoing: {
              outbox: [],
              send: (data) => {
                  console.log('received data')
              }
            },
            incoming: {
                inbox: [],
                receive: (data) => {
                    
                    let commands = data.data
                    if (commands[0] === '/cmd') {
                        if (commands[1] === 'reset') {
                            this.HANDLERS.MENU.click[0]()
                        }
                    }
                }
            }
        }
        this.RECEIVE = (data) => {
            this.COMMUNICATION.incoming.receive(data)
        }
        this.COMM = new UTIL.COMM(this.TITLE)
        this.COMM.on('incoming', this.COMMUNICATION.incoming.receive)

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
            canvas.id = this.TITLE

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
        })();
        
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
        this.gameWillUnmount = () => {
        
            let $doc = $(document)
            for (let event in this.HANDLERS.DOC) {
                for (let h=0 ; h<this.HANDLERS.DOC[event].length ; h++) $doc.off(event, null, this.HANDLERS.DOC[event][h])
            }
            let $win = $(window)
            for (let event in this.HANDLERS.WIN) {
                for (let h=0 ; h<this.HANDLERS.WIN[event].length ; h++) $win.off(event, null, this.HANDLERS.WIN[event][h])
            }
        }
        this.onresize = function() {
            this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
			this.GAME.camera.updateProjectionMatrix()
			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
        }
        
        //  attach document handlers
        
    }
    
    
    /*
    Games should follow the interface:
        Properties:
            START (float): time of game creation
            CLOCK (THREE.Clock): game clock
            GAME (Object): contains game variables
            DISPLAY (HTML5 canvas): canvas element containing THREE.js renderer
            MENU (jQuery object): jQuery object containing game menu
            MSG_BOX (Object): {
                box: $(div)
                message: (from) (message)
                announcement: (message)
            }
            HANDLERS (Object): contains DOM event handlers
        Functions:
            init(): initializes key variables
            update(data): function to be called to update renderer;
                          argument is an Object
            onresize(): adjusts THREE.js projection matrix
    */
    GAMES.TICTACTOE = function(initData) {
        var thisgame = this
        this.TITLE = 'TICTACTOE'
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
                hover: new THREE.Color('lightgrey'),
                highlight: new THREE.Color('lightgreen')
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
        this.handleIncoming = (data) => {            
            let commands = data.data
            if (commands[0] === '/cmd') {
                if (commands[1] === 'mode') {
                    if (commands[2] === 'single') this.HANDLERS.MENU.click[1]()
                    else if (commands[2] === 'multi') this.HANDLERS.MENU.click[0]()
                }
            }
        }
        this.COMM = new UTIL.COMM(this.TITLE)
        this.COMM.on('incoming', this.handleIncoming)
        this.MODES = {
            single: {
                on: false,
                turn: 0,
                first_player: 0,
                board: undefined,
                update: function(data) {
                    if (this.action.unload.on) {
                        var status = this.action.unload.update()
                        return status;
                    }
                    
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
                action: {
                    setup: {
                        on: false,
                        reset: function() {
                            thisgame.MODES.single.board = undefined
                            thisgame.MODES.single.first_player = 0
                            thisgame.MODES.single.turn = 0
                        },
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
                                            var msg = 'AI wins!'
                                            if (data.first === 0) msg = 'Player wins!'
                                            thisgame.MSG_BOX.announcement({
                                                message: msg
                                            })
                                            thisgame.COMM.trigger('outgoing', {
                                                from: thisgame.TITLE,
                                                type: 'text',
                                                data: msg,
                                                id: thisgame.COMM.id,
                                                n: thisgame.n++
                                            })
                                        } else {    //  second player wins
                                            if (data.first === 1) {
                                                thisgame.MSG_BOX.announcement({
                                                    message: 'Player wins!'
                                                })
                                                thisgame.COMM.trigger('outgoing', {
                                                    from: thisgame.TITLE,
                                                    type: 'text',
                                                    data: 'Player wins!',
                                                    id: thisgame.COMM.id,
                                                    n: thisgame.n++
                                                })
                                                thisgame.MODES.single.first_player = 0
                                            }
                                            else {
                                                thisgame.MSG_BOX.announcement({
                                                    message: 'AI wins!'
                                                })
                                                thisgame.COMM.trigger('outgoing', {
                                                    from: thisgame.TITLE,
                                                    type: 'text',
                                                    data: 'AI wins!',
                                                    id: thisgame.COMM.id,
                                                    n: thisgame.n++
                                                })
                                                thisgame.MODES.single.first_player = 1
                                            }
                                        }
                                        this.on = false
                                        thisgame.MODES.single.action.victory.on = true
                                        return;
                                    } else {
                                        if (data.board[0] === 9) {
                                            thisgame.MSG_BOX.announcement({
                                                message: 'Draw!'
                                            })
                                            thisgame.COMM.trigger('outgoing', {
                                                from: thisgame.TITLE,
                                                type: 'text',
                                                data: 'Draw!',
                                                id: thisgame.COMM.id,
                                                n: thisgame.n++
                                            })
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
                                            piece[i].position.set(pos[this.move].x, pos[this.move].y, 0.5)
                                            
                                            break;
                                        }
                                        //  return selected square's color to empty
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
                        progress: 0,
                        time: undefined,
                        squares: undefined,
                        update: function(data) {
                            if (this.progress === 0) {
                                var win_squares = this.get_win_squares(data.board)
                                this.squares = []
                                for (var i=0 ; i<=9 ; i++) this.squares.push(0)
                                for (var i=0 ; i<win_squares.length ; i++) this.squares[win_squares[i]]++;
                                this.progress = 1
                                this.time = thisgame.CLOCK.getElapsedTime()
                            } else if (this.progress === 1) {
                                var dt = (thisgame.CLOCK.getElapsedTime()-this.time)
                                var check1 = false
                                for (var i=1 ; i<=9; i++) {
                                    if (thisgame.CLOCK.getElapsedTime() - this.time < 2) check1 = true   
                                    if (this.squares[i] !== 1) continue;
                                    
                                    check1 = true
                                    if (dt<0.5) break;
                                    this.squares[i]++;
                                    thisgame.GAME.objs.sq[i].material.color = thisgame.GAME.objs.sq[0].highlight
                                    this.time = thisgame.CLOCK.getElapsedTime()
                                    break;
                                }
                                var check2 = false
                                for (var i=1 ; i<=9 ; i++) {
                                    if (this.squares[i] !== 0 || thisgame.GAME.objs.sq[i].material.opacity===0) continue;
                                    
                                    check2 = true
                                    thisgame.GAME.objs.sq[i].material.opacity = Math.max(0, thisgame.GAME.objs.sq[i].material.opacity-0.02)
                                }
                                if (!check1 && !check2) {
                                    this.progress = 2
                                } 
                                
                            } else if (this.progress === 2) {
                                this.reset()
                                thisgame.MODES.single.action.newgame.on = true
                            }
                        },
                        get_win_squares: function(board) {
                            //  returns array of winning square numbers
                            for (var i=1 ; i<=7 ; i+=3) {
                                var win = true
                                for (var j=0 ; j<2 ; j++) {
                                    if (board[i+j] === undefined || board[i+j]%2!==board[i+j+1]%2) {
                                        win = false
                                        break;
                                    }
                                }
                                if (win) {
                                    return [i, i+1, i+2];
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
                                    return [i, i+3, i+6];
                                }
                            }
                            if (board[1] !== undefined && board[1]%2 === board[5]%2 && board[5]%2 === board[9]%2) return [1, 5, 9];
                            if (board[3] !== undefined && board[3]%2 === board[5]%2 && board[5]%2 === board[7]%2) return [3, 5, 7];
                            
                            return 0;
                        },
                        reset: function() {
                            this.on = false
                            this.squares = undefined
                            this.progress = 0
                            this.time = undefined
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
                            //  reset squares
                            for (var i=1 ; i<=9 ; i++) {
                                thisgame.GAME.objs.sq[i].material.opacity = 1
                                thisgame.GAME.objs.sq[i].material.color = thisgame.GAME.objs.sq[0].empty
                            }
                            
                            //  reset to vs stage
                            this.on = false
                            action.vs.on = true
                        }
                    },
                    unload: {
                        on: false,
                        progress: 0,
                        update: function() {
                            if (this.progress === 0) {
                                for (var i=0 ; i<5 ; i++) {
                                    if (thisgame.GAME.objs.circle[i].GAME.onboard) {
                                        thisgame.GAME.scene.remove(thisgame.GAME.objs.circle[i])
                                        thisgame.GAME.objs.circle[i].GAME.onboard = false
                                        return;
                                    }
                                    if (thisgame.GAME.objs.cross[i].GAME.onboard) {
                                        thisgame.GAME.scene.remove(thisgame.GAME.objs.cross[i])
                                        thisgame.GAME.objs.cross[i].GAME.onboard = false
                                        return;
                                    }
                                }
                                this.progress++;
                            } else if (thisgame.GAME.objs.sq[1].scale.x > 60/79.5) {
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x -= 0.01
                                    thisgame.GAME.objs.sq[i].scale.y -= 0.01
                                }
                            } else {
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x = 60/79.5
                                    thisgame.GAME.objs.sq[i].scale.y = 60/79.5
                                }
                                for (var action in thisgame.MODES.single.action) {
                                    if (thisgame.MODES.single.action[action].reset) thisgame.MODES.single.action[action].reset()
                                }
                                this.progress = 0
                                this.on = false
                                thisgame.MODES.single.on = false
                                return {
                                    multi: true
                                }
                            }
                        }
                    }
                } 
            },
            multi: {
                on: false,
                board: undefined,
                first_player: 0,
                turn: 0,
                update: function(data) {
                   if (this.action.unload.status === 1) {
                       var status = this.action.unload.update()
                       return status;
                   }
                   
                    if (this.board === undefined) {     //  setup if board is undefined
                        this.board = [0]
                        this.action.setup.status = 1
                    } if (this.action.setup.status === 1) {
                        this.action.setup.update()
                    } else if (this.action.vs.status === 1) {
                        var dataObj = {
                            turn: this.turn,
                            first: this.first_player,
                            board: this.board
                        }
                        var statusObj = this.action.vs.update(dataObj)
                        if (!statusObj) {   //  if no update
                            return;
                        } else if (statusObj.victor !== undefined) {
                            var victor = statusObj.victor
                            if (victor === 0) {     //  draw
                                var msg = "Draw!"
                                thisgame.MSG_BOX.announcement({
                                    message: msg
                                })
                                thisgame.COMM.trigger('outgoing', {
                                    from: thisgame.TITLE,
                                    type: 'text',
                                    data: msg,
                                    id: thisgame.COMM.events
                                })
                                this.first_player = 1-this.first_player
                                this.turn = this.first_player
                            } else if (this.first_player === 0) {  //  first player is circle
                                var msg = "Player O"
                                if (victor === -1) {
                                    msg = "Player X"
                                    this.first_player = 1
                                    this.turn = 1
                                }
                                thisgame.MSG_BOX.announcement({
                                    message: msg + " wins!"
                                })
                                thisgame.COMM.trigger('outgoing', {
                                    from: thisgame.TITLE,
                                    type: 'text',
                                    data: msg + " wins!",
                                    id: thisgame.COMM.events
                                })
                            } else {    //   first player is cross
                                var msg = "Player X"
                                if (victor === -1) {
                                    msg = "Player O"
                                    this.first_player = 0
                                    this.turn = 0
                                }
                                thisgame.MSG_BOX.announcement({
                                    message: msg + " wins!"
                                })
                                thisgame.COMM.trigger('outgoing', {
                                    from: thisgame.TITLE,
                                    type: 'text',
                                    data: msg + " wins!",
                                    id: thisgame.COMM.events
                                })
                            }
                            this.action.vs.status = 0
                            this.action.victory.status = 1
                        } else if (statusObj.changeturn) {
                            this.turn = 1-this.turn
                        }
                    } else if (this.action.victory.status === 1) {
                        var dataObj = {
                            board: this.board
                        }
                        var status = this.action.victory.update(dataObj)
                        if (status) {
                            this.action.newgame.status = 1
                        }
                    } else if (this.action.newgame.status === 1) {
                        this.action.newgame.update({
                            board: this.board
                        })
                    }
                },
                action: {
                    setup: {
                        status: 0,
                        reset: function() {
                            thisgame.MODES.multi.board = undefined
                            thisgame.MODES.multi.first_player = 0
                            thisgame.MODES.multi.turn = 0
                        },
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
                                this.status = 0
                                thisgame.MODES.multi.action.vs.status = 1
                            }
                        },
                    },
                    vs: {
                        status: 0,
                        hover: undefined,
                        queue: undefined,
                        reset: function() {
                            this.hover = undefined
                            this.queue = undefined
                            this.status = 0
                            this.action.reset()
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
                        update: function(data) {
                            
                            if (this.action.makingmove.status === 1) {
                                var statusObj = this.action.makingmove.update()
                                if (statusObj) {    //  if finish making move
                                    var victor = this.wincheck(data.board)
                                    if (victor !== 0) {
                                        return {
                                            victor: victor
                                        }
                                    } else if (data.board[0] === 9) {
                                        return {
                                            victor: 0
                                        }
                                    }
                                }
                                return statusObj;
                            }
                            
                            if (this.queue === undefined) {
                                this.queue = []
                            } else if (this.queue.length) {
                                var move = this.queue.shift()
                                var square = move.square
                                data.board[square] = data.board[0]++;
                                
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
                                    piece[i].position.set(pos[square].x, pos[square].y, 1)
                                    
                                    break;
                                }
                                this.action.makingmove.update({
                                    move: square
                                })
                            }
                            
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
                        },
                        action: {
                            makingmove: {
                                status: 0,
                                move: undefined,
                                update: function(data) {
                                    if (this.move === undefined) {
                                        this.move = data.move
                                        this.status = 1
                                    } else {
                                        //  dehighlight selected square
                                        thisgame.GAME.objs.sq[this.move].material.color = thisgame.GAME.objs.sq[0].empty
                                        this.reset()
                                        return {
                                            changeturn: true
                                        }
                                    }
                                },
                                reset: function() {
                                    this.status = 0
                                    this.move = undefined
                                }
                            },
                            reset: function() {
                                this.makingmove.reset()
                            }
                        }
                    },
                    victory: {
                        status: 0,
                        progress: 0,
                        time: undefined,
                        squares: undefined,
                        update: function(data) {
                            if (this.progress === 0) {  //  initial
                                //  determine winning squares
                                var win_squares = this.get_win_squares(data.board)
                                this.squares = []
                                for (var i=0 ; i<=9 ; i++) this.squares.push(0)
                                for (var i=0 ; i<win_squares.length ; i++) this.squares[win_squares[i]]++;
                                this.progress = 1
                                this.time = thisgame.CLOCK.getElapsedTime()
                            } else if (this.progress === 1) {   
                                var dt = (thisgame.CLOCK.getElapsedTime()-this.time)
                                var check1 = false
                                for (var i=1 ; i<=9; i++) {     //  highlight winning squares
                                    if (thisgame.CLOCK.getElapsedTime() - this.time < 2) check1 = true   
                                    if (this.squares[i] !== 1) continue;
                                    
                                    check1 = true
                                    if (dt<0.5) break;
                                    this.squares[i]++;
                                    thisgame.GAME.objs.sq[i].material.color = thisgame.GAME.objs.sq[0].highlight
                                    this.time = thisgame.CLOCK.getElapsedTime()
                                    break;
                                }
                                var check2 = false
                                for (var i=1 ; i<=9 ; i++) {    //  blur out non-winning squares
                                    if (this.squares[i] !== 0 || thisgame.GAME.objs.sq[i].material.opacity===0) continue;
                                    
                                    check2 = true
                                    thisgame.GAME.objs.sq[i].material.opacity = Math.max(0, thisgame.GAME.objs.sq[i].material.opacity-0.02)
                                }
                                if (!check1 && !check2) {   //  if done highlighting and blurring
                                    this.progress = 2
                                } 
                                
                            } else if (this.progress === 2) {
                                this.reset()
                                thisgame.MODES.multi.action.newgame.status = 1
                            }
                        },
                        get_win_squares: function(board) {
                            //  returns array of winning square numbers
                            for (var i=1 ; i<=7 ; i+=3) {
                                var win = true
                                for (var j=0 ; j<2 ; j++) {
                                    if (board[i+j] === undefined || board[i+j]%2!==board[i+j+1]%2) {
                                        win = false
                                        break;
                                    }
                                }
                                if (win) {
                                    return [i, i+1, i+2];
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
                                    return [i, i+3, i+6];
                                }
                            }
                            if (board[1] !== undefined && board[1]%2 === board[5]%2 && board[5]%2 === board[9]%2) return [1, 5, 9];
                            if (board[3] !== undefined && board[3]%2 === board[5]%2 && board[5]%2 === board[7]%2) return [3, 5, 7];
                            
                            return 0;
                        },
                        reset: function() {
                            this.status = 0
                            this.squares = undefined
                            this.progress = 0
                            this.time = undefined
                        }
                    },
                    newgame: {
                        status: 0,
                        progress: 0,
                        update: function(data) {
                            if (this.progress === 0) {
                                thisgame.MODES.multi.action.vs.reset()
                                this.progress = 1
                            } else if (this.progress === 1) {
                                for (var i=data.board.length ; i>0 ; i--) {
                                    data.board.pop()
                                }
                                data.board[0] = 0
                                for (var i=0 ; i<=4 ; i++) {
                                    thisgame.GAME.scene.remove(thisgame.GAME.objs.circle[i])
                                    thisgame.GAME.objs.circle[i].GAME.onboard = false
                                    thisgame.GAME.scene.remove(thisgame.GAME.objs.cross[i])
                                    thisgame.GAME.objs.cross[i].GAME.onboard = false
                                }
                                for (var s=1 ; s<=9 ; s++) {
                                    thisgame.GAME.objs.sq[s].material.opacity = 1
                                    thisgame.GAME.objs.sq[s].material.color = thisgame.GAME.objs.sq[0].empty
                                }
                                this.progress = 2
                                
                            } else if (this.progress === 2) {
                                this.reset()
                                thisgame.MODES.multi.action.vs.status = 1
                            }
                        },
                        reset: function() {
                            this.status = 0
                            this.progress = 0
                        }
                    },
                    unload: {
                        status: 0,
                        progress: 0,
                        update: function() {
                            if (this.progress === 0) {
                                for (var i=0 ; i<5 ; i++) {
                                    if (thisgame.GAME.objs.circle[i].GAME.onboard) {
                                        thisgame.GAME.scene.remove(thisgame.GAME.objs.circle[i])
                                        thisgame.GAME.objs.circle[i].GAME.onboard = false
                                        return;
                                    }
                                    if (thisgame.GAME.objs.cross[i].GAME.onboard) {
                                        thisgame.GAME.scene.remove(thisgame.GAME.objs.cross[i])
                                        thisgame.GAME.objs.cross[i].GAME.onboard = false
                                        return;
                                    }
                                }
                                this.progress++;
                            } else if (thisgame.GAME.objs.sq[1].scale.x > 60/79.5) {
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x -= 0.01
                                    thisgame.GAME.objs.sq[i].scale.y -= 0.01
                                }
                            } else {
                                for (var i=1 ; i<=9 ; i++) {
                                    thisgame.GAME.objs.sq[i].scale.x = 60/79.5
                                    thisgame.GAME.objs.sq[i].scale.y = 60/79.5
                                }
                                for (var action in thisgame.MODES.multi.action) {
                                    if (thisgame.MODES.multi.action[action].reset) thisgame.MODES.multi.action[action].reset()
                                }
                                this.progress = 0
                                this.status = 0
                                thisgame.MODES.multi.on = false
                                return {
                                    single: true
                                }
                            }
                        }
                    }
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
                        //  0 <= x <= displayWidth
                        //  0 <= y <= displayHeight
                        var x = Math.min(-offset.left+e.clientX+$doc.scrollLeft(), thisgame.GAME.displayWidth)
                        var y = e.clientY+$doc.scrollTop() < offset.top ? 0 : (e.clientY+$doc.scrollTop()>offset.top+thisgame.GAME.displayHeight+$doc.scrollTop()?thisgame.GAME.displayHeight:$doc.scrollTop()+e.clientY-offset.top)
                        thisgame.GAME.mouse.coords.x = (x / thisgame.GAME.displayWidth) * 2 - 1
                        thisgame.GAME.mouse.coords.y = -(y / thisgame.GAME.displayHeight) * 2 + 1
                    }    
                ],
                click: [
                    (e)=> {
                        //  unfocus button pressed
                        if (e.target === thisgame.DISPLAY) thisgame.MENU.find('button').trigger('blur')
                        //  if single mode
                        if (thisgame.MODES.single.on) {
                            var move = thisgame.MODES.single.action.vs.hover
                            if (move !== undefined) {
                                thisgame.MODES.single.action.vs.queue.push({
                                    turn: 0,
                                    square: move
                                })
                            }
                        } else if (thisgame.MODES.multi.on) {    //  if vs mode
                            var move = thisgame.MODES.multi.action.vs.hover
                            if (move !== undefined) {
                                thisgame.MODES.multi.action.vs.queue.push({
                                    square: move
                                })
                            }
                        }
                    }
                ],
                keydown: [
                    (e)=> {
                        if (e.keyCode === 13) this.MSG_BOX.showLatest()
                    }    
                ]
            },
            WIN: {
                resize: [
                    (e) => {
                        this.GAME.displayHeight = $(this.DISPLAY).parent().height()
                        this.GAME.displayWidth = $(this.DISPLAY).parent().width()
                        this.GAME.camera.aspect = this.GAME.displayWidth / this.GAME.displayHeight
            			this.GAME.camera.updateProjectionMatrix()
            			this.GAME.renderer.setSize( this.GAME.displayWidth, this.GAME.displayHeight )
                    }
                ]
            },
            MENU: {
                click: [
                    (e)=> {
                        if (this.MODES.single.action.victory.on || this.MODES.single.action.newgame.on) return;
                        if (this.MODES.single.on) {
                            this.MODES.single.action.unload.on = true
                            return;
                        }
                        this.MODES.multi.on = true
                    },
                    (e)=> {
                        if (this.MODES.multi.action.victory.status >= 1 || this.MODES.multi.action.newgame.status >= 1) return;
                        if (this.MODES.multi.on) {
                            this.MODES.multi.action.unload.status = 1
                            return;
                        }
                        this.MODES.single.on = true
                    }
                ]
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
                    plane.material.transparent = true
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
            canvas.id = this.TITLE
            return canvas;
        })()
        
        this.MENU = (()=>{
            var $btngroup = $('<div>')
            var btns = ['2 Player', 'Single Player']
            var click_handlers = [
                this.HANDLERS.MENU.click[0],
                this.HANDLERS.MENU.click[1]
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
        this.MSG_BOX = (()=>{
            //  add communications box
            var $div = $('<div>')
            $div.width(0.4*this.GAME.displayWidth); $div.height(this.GAME.displayHeight * 0.33)
            $div.css('background-color', 'rgba(58,58,58,0.75)')
            $div.css('position', 'absolute')
            $div.css('z-index', 1200)
            return $div;
        })()
        this.MSG_BOX = {
            hide_id: undefined, //  set timeout id
            box: (()=>{ //  $(div) chat box
                //  add communications box
                var $div = $('<div>')
                $div.css({
                    'width': 0.4*this.GAME.displayWidth,
                    'height': 0.33*this.GAME.displayHeight,
                    'max-height': 0.33*this.GAME.displayHeight,
                    'max-width': 0.2*this.GAME.displayWidth,
                    'top': 0,
                    'left': 0,
                    'z-index': 1200,
                    'position': 'absolute',
                    'background-color': 'rgba(58,58,58,0.75)',
                    'text-transform': 'uppercase',
                    'display': 'none',
                    'overflow': 'hidden'
                })
                return $div;
            })(),
            message: function(info) {   //  message from sender
                var $msg = $('<div>')
                var $from = $('<b>')
                $from.text(info.from + ': '); $from.css('color', info.from_color || 'white')
                var $text = $('<span>')
                $text.text(info.message); $text.css('color', info.message_color || 'white')
                $msg.append($from); $msg.append($text)
                this.box.append($msg)
                if (this.box.children().length > 10) this.box.children(':first').remove()
                this.showLatest()
            },
            announcement: function(info) {  //  announcement in bold
                var $msg = $('<div>')
                var $text = $('<b>')
                $text.text(info.message); $text.css('color', info.message_color || 'lightgreen')
                $msg.append($text)
                this.box.append($msg)
                if (this.box.children().length > 10) this.box.children(':first').remove()
                this.showLatest()
            },
            hide: function() {  //  hides after certain time
                if (this.hide_id !== undefined) {
                    window.clearTimeout(this.hide_id)
                }
                this.hide_id = window.setTimeout(()=>{
                    this.box.hide()
                    this.hide_id = undefined
                }, 5000)
            },
            showLatest: function() {
                this.box.scrollTop(this.box.children().height() * this.box.children().length)
                this.box.show()
                this.hide()
            }
        }
        
        this.update = function() {
            //  delegate update to single/multi update
            if (this.MODES.single.on) {
                var status = this.MODES.single.update()
                if (status) {
                    if (status.multi) this.MODES.multi.on = true
                }
                
            } else if (this.MODES.multi.on) {
                status = this.MODES.multi.update()    
                if (status) {
                    if (status.single) this.MODES.single.on = true
                }
                
            }
            
    
            thisgame.GAME.renderer.render(thisgame.GAME.scene, thisgame.GAME.camera)
        }
        
        this.gameWillUnmount = () => {
            let $doc = $(document),
                $win = $(window);
            for (let event in this.HANDLERS.DOC) {
                for (let h=0 ; h<this.HANDLERS.DOC[event].length ; h++) $doc.off(event, null, this.HANDLERS.DOC[event][h])
            }
            for (let event in this.HANDLERS.WIN) {
                for (let h=0 ; h<this.HANDLERS.WIN[event].length ; h++) $win.off(event, null, this.HANDLERS.WIN[event][h])
            }
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