;
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
            this.GAME.renderer = new THREE.WebGLRenderer()
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
            var $btngroup = $('<div>')
            $btngroup.addClass('btn-group-vertical col')
            var $btn = $('<button>')
            $btn.attr('type', 'button'); $btn.addClass('btn btn-secondary'); $btn.attr('data-menubutton', '0')
            $btn.text('Reset Position')
            $btngroup.append($btn)
            $btn.on('click', (e)=>{
                thisgame.GAME.test.position.set(0,0,0)
            })
            
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
            this.GAME.renderer = new THREE.WebGLRenderer()
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
    
    
})