;

if (!window.GAMES) window.GAMES = new Object();


;$(() => {
    'use strict'
    /*
    Games should follow the interface:
        Properties:
            GAME (Object): contains three.js game variables
            DISPLAY (HTML5 canvas): canvas element containing THREE.js renderer
            HANDLERS (Object): contains event handlers
            COMM (UTIL.COMM): UTIL.COMM object for handling input
        Functions:
            initialize(): initializes key variables
            update(data): function to be called to update renderer;
                          argument is an Object
            gameWillUnmount(): to be called before game is removed
    */
    
    /*
        GAMES.PROTO = {
            Constructor({
                title: (String),
                renderer: (Three.WebGLRenderer),
                height: (float),
                width: (float)
            })
            Properties:
                GAME (Object): contains three.js game variables,
                DISPLAY (HTML Canvas): canvas element containing THREE.js renderer
                HANDLERS: { 
                    (Event): [dom handlers for (Event)] 
                }
                COMM (UTIL.COMM): UTIL.COMM for handling incoming data
            Functions:
                initialize()
                    initializes key varaibles
                gameWillUnmount()
                    called before game is removed
                update(Object)
                    updates game
        }
    
    */
    
    GAMES.PROTO = class {
        constructor(init) {
            this._title = init.title
            this.TITLE = this._title
            this.COMM = new UTIL.COMM(this._title)
            this.KEYS = {}
            this.DISPLAY = undefined
            this.GAME = {
                clock: new THREE.Clock(),
                renderer: init.renderer,
                scene: undefined,
                camera: undefined,
                canvasWidth: init.width || 600,
                canvasHeight: init.height || 400,
                objects: undefined,
                mouse: {
                    coords: new THREE.Vector2(1, 1),
                    rayc: new THREE.Raycaster()
                }
            }
            
            this.GAME.clock.getElapsedTime()
            this.GAME.renderer.setSize(this.GAME.canvasWidth, this.GAME.canvasHeight)
            //  create canvas
            let canvas = this.GAME.renderer.domElement
            this.DISPLAY = canvas
        }
        
    }
    
    GAMES.TEST = class extends GAMES.PROTO {
        constructor(init) {
            super(
                Object.assign(
                    {
                        title: 'TEST'
                    },
                    init
                )
            )
            
            const self = this
            this.HANDLERS = {
                document: {
                    keydown: {
                      handle: function(e, keys) {
                          self.KEYS = keys
                          if (self.GAME.mouse.focused === undefined) return
                          if (self.KEYS[81]) {
                              if (e.shiftKey) self.GAME.mouse.focused.rotation.x -= Math.PI/18
                              else self.GAME.mouse.focused.rotation.x += Math.PI/18
                          }
                          if(self.KEYS[87]) {
                              if (e.shiftKey) self.GAME.mouse.focused.rotation.y -= Math.PI/18
                              else self.GAME.mouse.focused.rotation.y += Math.PI/18
                          }
                          if (self.KEYS[69]) {
                              if (e.shiftKey) self.GAME.mouse.focused.rotation.z -= Math.PI/18
                              else self.GAME.mouse.focused.rotation.z += Math.PI/18
                          }
                      }
                    },
                    keyup: {
                        handle: function(e, keys) {
                            self.KEYS = keys
                        }
                    },
                    mousemove: {
                        handle: function(e) {
                            let offset = $(self.DISPLAY).offset()
                            let $doc = $(document)
                            let x = e.clientX+$doc.scrollLeft() < offset.left ? 0 : (e.clientX+$doc.scrollLeft()>offset.left+self.GAME.canvasWidth+$doc.scrollLeft ? self.GAME.canvasWidth : $doc.scrollLeft()+e.clientX-offset.left)
                            let y = e.clientY+$doc.scrollTop() < offset.top ? 0 : (e.clientY+$doc.scrollTop()>offset.top+self.GAME.canvasHeight+$doc.scrollTop()?self.GAME.canvasHeight:$doc.scrollTop()+e.clientY-offset.top)
                            self.GAME.mouse.coords.x = (x / self.GAME.canvasWidth) * 2 - 1
                            self.GAME.mouse.coords.y = -(y / self.GAME.canvasHeight) * 2 + 1
                        }
                    },
                    click: {
                        handle: function(e) {
                            self.GAME.mouse.rayc.setFromCamera(self.GAME.mouse.coords, self.GAME.camera)
                            let intersections = self.GAME.mouse.rayc.intersectObjects(self.GAME.scene.children, true)
                            for (let i=0 ; intersections.length ; i++) {
                                //  self.GAME.mouse.focused = intersections[i].object
                                //  console.log(intersections[i].object.name)
                                break;
                            }
                        }
                    }
                },
                window: {
                    resize: {
                        handle: function(e) {
                            let $display = $(self.DISPLAY)
                            self.GAME.canvasHeight = $display.parent().height()
                            self.GAME.canvasWidth = $display.parent().width()
                			self.GAME.renderer.setSize( self.GAME.canvasWidth, self.GAME.canvasHeight )
                			if (self.GAME.camera instanceof THREE.PerspectiveCamera) {
                                self.GAME.camera.aspect = self.GAME.canvasWidth / self.GAME.canvasHeight
                            } 
                            self.GAME.camera.updateProjectionMatrix()
                        }
                    }
                }
            }
            this.PROGRESS = 0
            this.STAGES = {}
            let width = 1600
            this.GAME.camera = new THREE.OrthographicCamera(-width/2, width/2 , width/2/1.618, -width/2/1.618, 0, 3000)
            this.GAME.renderer.shadowMap.enabled = true
            this.GAME.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            //  this.GAME.camera = new THREE.PerspectiveCamera(100, this.GAME.canvasWidth/this.GAME.canvasHeight, 1, 2000)
            this.GAME.scene = new THREE.Scene()
            
            this.update = this.update.bind(this)
            this.handleIncomingData = this.handleIncomingData.bind(this)
            this.gameWillUnmount = this.gameWillUnmount.bind(this)
            
            this.GAME.objects = {
                test: undefined,
                env: [],
                players: [],
                enemies: []
            }
            this.COMM.on('incoming', this.handleIncomingData)
            
            this.initialize() 
        }
        
        
        initialize() {
            const self = this
            let game = this.GAME
            
            
            this.STAGES = {
                startup: {
                    progress: 0,
                    action: {
                        loadEnv: {
                            progress: 0,
                            update: function(data) {
                                let game = self.GAME
                                
                                if (this.progress === 2) {
                                    
                                    return -1;
                                }
                                if (this.progress === 1) return 1;
                                let bright_colors = new THREE.TextureLoader().load('images/bright.jpg', (texture) => {
                                    let container = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 32), new THREE.MeshBasicMaterial({side: THREE.BackSide, map: bright_colors}))
                                    container.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2)
                                    container.update = function(data) {
                                        this.rotation.z += 0.0001
                                        this.rotation.x += 0.00015
                                        this.rotation.y += 0.0002
                                    }
                                    game.objects.env.push(container)
                                    game.scene.add(container)
                                    
                                    this.progress = 2
                                })
                                
                                let grid = new THREE.GridHelper(1000, 20, new THREE.Color('yellow'))
                                grid.rotateX(Math.PI/2)
                                game.objects.env.push(grid)
                                //  game.scene.add(grid)

                                let directional = new THREE.DirectionalLight(0xffffff, 0.5)
                                directional.position.set(0, 0, 500)
                                directional.castShadow = true
                                //directional.shadow.mapSize.width = game.canvasWidth
                                //directional.shadow.mapSize.height = game.canvasHeight
                                directional.shadow.camera.far = 500
                                directional.shadow.camera.left = -500
                                directional.shadow.camera.right = 500
                                directional.shadow.camera.top = 500
                                directional.shadow.camera.bottom = -500
                                game.objects.env.push(directional); game.scene.add(directional)
                                
                                let hemisphere = new THREE.HemisphereLight(0xffffff, 1)
                                hemisphere.position.set(0, 0, 400)
                                game.objects.env.push(hemisphere); game.scene.add(hemisphere)
                                
                                let ambient = new THREE.AmbientLight('white', 0.5)
                                game.objects.env.push(ambient)
                                game.scene.add(ambient)
                                
                                let platform = new THREE.Mesh(new THREE.CylinderGeometry(450, 100, 500, 32), new THREE.MeshStandardMaterial({color: 0x99ccff}))
                                platform.position.set(0, 0, -200)
                                platform.rotation.x = Math.PI/2
                                platform.isSurface = true
                                platform.receiveShadow = true
                                platform.matrixAutoUpdate = false
                                platform.updateMatrix()
                                game.objects.env.push(platform)
                                game.scene.add(platform)
                                let bulgeAnchor = Object.assign(new THREE.Group(), {
                                    name: 'bulgeAnchor',
                                    radius: 200,
                                    update: function(data) {
                                        this.rotation.y += data.dt 
                                    }
                                })
                                let bulge = new THREE.Mesh(new THREE.CylinderGeometry(300, 300, 100, 32), new THREE.MeshStandardMaterial({color: new THREE.Color('lightgreen')}))
                                bulge.position.set(0, 225, 0)
                                bulge.angularV = new THREE.Vector3(0, 0, 2*Math.PI/(2*Math.PI))
                                bulge.isSurface = true; bulge.name = 'bulge'; bulge.receiveShadow = true
                                //game.objects.env.push(bulge)
                                //game.objects.env.push(bulgeAnchor);bulgeAnchor.add(bulge); platform.add(bulgeAnchor)
                                let box = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshStandardMaterial())
                                box.isEnemy = true; box.position.set(300, 0, 100)
                                game.scene.add(box); game.objects.enemies.push(box)

                                game.camera.position.set(0, -1000, 1000)
                                game.camera.lookAt(new THREE.Vector3(0, 100, 0))

                                
                                this.progress = 1
                                
                                return 1;
                            }  
                        },
                        loadTest: {
                            update: function(data) {
                                let game = self.GAME

                                let test = new GAMES2.BALL(50, 150)
                                test.position.set(0, 0, 200) 
                                game.objects.test = test
                                game.scene.add(test)
                                
                                return -1;
                            }
                        },
                    },
                    update: function(data) {
                        if (this.progress === 0) {
                            let updateStatus = this.action.loadEnv.update(data)
                            if (updateStatus === -1) {
                                this.progress = 1
                            }
                            return 1;
                        } else if (this.progress === 1) {
                            let updateStatus = this.action.loadTest.update(data)
                            if (updateStatus === -1) {
                                this.progress = 2
                            }
                            return 1;
                        } else if (this.progress === 2) {
                            return -1;
                        }
                    }
                },
                arena: {
                    progress: 0,
                    update: function(data) {
                        let env = self.GAME.objects.env,
                            players = self.GAME.objects.players,
                            test = self.GAME.objects.test
                        for (let i=0 ; i<env.length ; i++) {
                            if (env[i].update) env[i].update(data)   
                        }
                        for (let i=0 ; i<players.length ; i++) {
                            if (players[i].update) players[i].update(data)
                        }
                        if (test && test.update) test.update(data)
                        
                        return 1;
                    }
                }
            }
            
            //  add objects
            
            
        }
        
        handleIncomingData(data) {
            let commands = data.data
            if (commands[0] === '/cmd') {
                if (commands[1] === 'e') {
                    let type = commands[2].type
                    if (type === 'resize') {
                        this.HANDLERS.window.resize.handle(commands[2])
                    } else if (type === 'keydown' || type === 'keyup') {
                        this.HANDLERS.document[type].handle(commands[2], commands[3])
                    } else if (type === 'mousemove') {
                        this.HANDLERS.document[type].handle(commands[2])
                    } else if (type === 'click') {
                        this.HANDLERS.document[type].handle(commands[2])
                    }
                } else if (commands[1] === 'c') {
                    if (commands[2] === 'position') {
                        if (commands[3] === 'reset') {
                            this.GAME.objects.test.position.set(0, 0,200)
                            this.GAME.objects.test.velocity.set(0, 0, 0)
                        }
                    } else if (commands[2] === 'camera') {
                        this.GAME.camera.position.set(0, -1000, 0)
                        this.GAME.camera.lookAt(new THREE.Vector3(0, 0, 0))
                        this.GAME.camera.zoom = +commands[3]
                        this.GAME.camera.updateProjectionMatrix()
                    } else if (commands[2] === 'rayc') {
                        
                    } else if (commands[2] === 'focus') {
                        let obj = this.GAME.scene.getObjectByName(commands[3])
                        console.log(obj)
                        this.GAME.mouse.focused = obj
                        
                    } 
                }
            }
        }
        
        update(data) {
            let game = this.GAME
            let updateData = {
                dt: 1/60,
                keys: this.KEYS,
                game: game
            }
            
            
            if (this.PROGRESS === 0) {
                let updateStatus = this.STAGES.startup.update(updateData)
                if (updateStatus === -1) {
                    this.PROGRESS = 1
                }
            } else if (this.PROGRESS === 1) {
                let updateStatus = this.STAGES.arena.update(updateData)
                if (updateStatus === -1) {
                    this.PROGRESS = 2
                }
            }
            
            game.renderer.render(this.GAME.scene, this.GAME.camera)
        }
        
        gameWillUnmount() {
            
        }
    }
    
    
})