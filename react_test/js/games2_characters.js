;

const global_name = 'GAMES2'
if (!window[global_name]) window[global_name] = new Object()

;$(() => {
    'use strict'
    
    GAMES2.BALL_ANIMATION_MIXER = class extends THREE.AnimationMixer {
        constructor(ball, radius, ringDiameter, weap2Delay) {
            super(ball)
            let pi = Math.PI
            let standing_raw = {
                times: [0, pi/8, pi/4, 3*pi/8, pi/2],
                values: [
                    [].concat([0, 0, radius], [0, 0, radius+radius/16], [0, 0, radius], [0, 0, radius-radius/16], [0, 0, radius]),
                    [0, 0, 0 ,0],
                    [0, 0, 0.707, 0.707],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0.183, -0.183, -0.683, 0.683],
                    [0.183, 0.183, 0.683, 0.683]
                ]
            }
            let run_raw = {
                times: [0, 0.05, 0.10],
                values: [
                    [].concat([0, 0, 0, 0], [-0.383, 0, 0, 0.924], [-0.707, 0, 0, 0.707]),
                    [].concat([0, 0, 0.707, 0.707], [0.271, 0.271, 0.653, 0.653], [0.5, 0.5, 0.5, 0.5]),
                    [].concat([0, 0, radius/2]),
                    [].concat([0, 0, 0], [0, 0, -ringDiameter*1], [0, 0, -ringDiameter*2]),
                    [].concat([0, 0, 0], [0, 0, -ringDiameter*2.5], [0, 0, -ringDiameter*6]),
                    [].concat([0.174, 0, 0, 0.985], [0.239, -0.099, -0.370,  0.892], [0.087, -0.150, -0.853, 0.492]),
                    [].concat([0.174, 0, 0, 0.985], [0.239, 0.099, 0.370,  0.892], [0.087, 0.150, 0.853, 0.492])
                ]
            }
            let running_raw = {
                times: [0, 0.30],
                values: [
                    [].concat([0.087, -0.150, -0.853, 0.492], [0.045, -0.168, -0.951,  0.255]),
                    [].concat([0.087, 0.150, 0.853, 0.492], [0.045, 0.168, 0.951,  0.255])
                ]
            }
            let jump_raw = {
                times: [0, 0.1],
                values: [
                    [].concat([0.183, -0.183, -0.683, 0.683],[ 0.354,  -0.354, -0.612, 0.612]),
                    [].concat([0.183, 0.183, 0.683, 0.683],[ 0.354,  0.354, 0.612, 0.612]),
                ]
            }
            let weap2_raw = {
                times: [0, (2/3)*weap2Delay, (4/3)*weap2Delay, 2*weap2Delay],
                values: [
                    [].concat([0.087, 0.150, 0.853, 0.492], [ 0.133, 0.112, 0.633, 0.754], [ 0.133, -0.112, -0.633, 0.754], [0.087, -0.150, -0.853, 0.492]),
                    [].concat([0.087, -0.150, -0.853, 0.492], [ 0.133, -0.112, -0.633, 0.754],[ 0.133, 0.112, 0.633, 0.754], [0.087, 0.150, 0.853, 0.492])
                ]
            }
            
            this.clips = {
                standing: new THREE.AnimationClip('standing', pi/2, [
                    new THREE.VectorKeyframeTrack('group:body:head.position', standing_raw.times, standing_raw.values[0], THREE.InterpolateSmooth),
                    new THREE.QuaternionKeyframeTrack('group:body:head.quaternion', [0], standing_raw.values[1]),
                    new THREE.QuaternionKeyframeTrack('group:body.quaternion', [0], standing_raw.values[2]),
                    new THREE.VectorKeyframeTrack('group:body.position', [0], standing_raw.values[3]),
                    new THREE.VectorKeyframeTrack('group:body:legs:ring1.position', [0], standing_raw.values[4]),
                    new THREE.VectorKeyframeTrack('group:body:legs:ring2.position', [0], standing_raw.values[5]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:rightJoint.quaternion', [0], standing_raw.values[6]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:leftJoint.quaternion', [0], standing_raw.values[7])
                ]),
                run: new THREE.AnimationClip('run', 0.40, [
                    new THREE.QuaternionKeyframeTrack('group:body:head.quaternion', run_raw.times, run_raw.values[0]),
                    new THREE.QuaternionKeyframeTrack('group:body.quaternion', run_raw.times, run_raw.values[1]),
                    new THREE.VectorKeyframeTrack('group:body.position', [0], run_raw.values[2]),
                    new THREE.VectorKeyframeTrack('group:body:legs:ring1.position', run_raw.times.map(e=> e+0.3), run_raw.values[3]),
                    new THREE.VectorKeyframeTrack('group:body:legs:ring2.position', run_raw.times.map(e=> e+0.3), run_raw.values[3]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:rightJoint.quaternion', run_raw.times, run_raw.values[5]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:leftJoint.quaternion', run_raw.times, run_raw.values[6])
                ]),
                running: new THREE.AnimationClip('running', 0.30, [
                    new THREE.QuaternionKeyframeTrack('group:body:head:rightJoint.quaternion', running_raw.times, running_raw.values[0]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:leftJoint.quaternion', running_raw.times, running_raw.values[1])
                ]),
                jump: new THREE.AnimationClip('jump', 0.1, [
                    new THREE.QuaternionKeyframeTrack('group:body:head:rightJoint.quaternion', jump_raw.times, jump_raw.values[0]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:leftJoint.quaternion', jump_raw.times, jump_raw.values[1])
                ]),
                weap2:  new THREE.AnimationClip('weap2', 2*weap2Delay+0.25, [
                    new THREE.QuaternionKeyframeTrack('group:body:head:rightJoint.quaternion', weap2_raw.times, weap2_raw.values[0]),
                    new THREE.QuaternionKeyframeTrack('group:body:head:leftJoint.quaternion', weap2_raw.times, weap2_raw.values[1])
                ])
            }
            
            this.checks = {
                standing: false,
                run: false
            }
            
            this.prepareAction(this.clips.standing, THREE.LoopRepeat, true)
            this.prepareAction(this.clips.run, THREE.LoopOnce, true)
            this.prepareAction(this.clips.weap2, THREE.LoopOnce, true)
            this.prepareAction(this.clips.jump, THREE.LoopOnce, true)
            this.prepareAction(this.clips.running, THREE.LoopPingPong)
            
        }
        
        prepareAction(clip, loop, clamp) {
            let action = this.clipAction(clip)
            action.setLoop(loop)
            action.clampWhenFinished = clamp || false
        } 
    }
    
    GAMES2.BALL = class extends THREE.Group {
        constructor(radius ,mass, controls) {
            super()
            const self = this
            this.radius = radius
            this.mass = mass
            this.velocity = new THREE.Vector3()
            this.rayc = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 2*radius*10/40)//3.5*radius*10/40)
            this.keys = {}
            this.controls = controls || {enabled: true, up: 0, down: 0, left: 0, right: 0, weap1: 0, weap2: 0, jump: 0}
            this.hitBox = undefined
            this.timers = {
                controls: {
                    end: 0
                }
            }
            this.prev = {
                keys: {}
            }
            
            let body = new THREE.Group()
            body.name = 'body';
            body.rotation.order = "ZYX"; body.rotation.z = Math.PI/2
            //body.rotation.y = Math.PI/3
            this.add(body)
            let ball = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 16),
                new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('images/pink_texture.jpg')})
            )
            ball.rotation.order = "ZYX"; //ball.rotation.z = Math.PI/2;//ball.rotation.x = -Math.PI/3
            ball.position.z = radius
            ball.castShadow = true
            ball.name = 'head'
            ball.update = function(data) {
                if (self.mixer && !self.mixer.action['run'].isRunning()) {
                    let action = self.mixer.action['standing']
                    if (action.isRunning()) return;
                    action.play()
                }

            }
            this.hitBox = ball
            
            let eyes = new THREE.Group()
            let eye1 = new THREE.Mesh(
                new THREE.SphereGeometry(1/4 * radius, 16),
                new THREE.MeshStandardMaterial({color: 0xf442f1})
            )
            let eye2 = new THREE.Mesh(
                new THREE.SphereGeometry(1/4 * radius, 16),
                new THREE.MeshStandardMaterial({color: 0xf442f1})
            )
            eyes.add(eye1); eyes.add(eye2)
            eye1.position.set(-radius/2, 0, 0); eye2.position.set(radius/2, 0, 0)
            ball.add(eyes); eyes.position.set(0, -3/4 * radius, 1/4*radius)
            
            let diameterToRadius = 10/40
            let legs = new THREE.Group()
            legs.name = 'legs'
            legs.update = function(data) {
                return ;
                ring1.position.z = -radius*diameterToRadius/2 + (radius*diameterToRadius/2)*Math.sin(data.game.clock.getElapsedTime()*Math.PI*2)
                let speed = radius*diameterToRadius
                ring2.position.z = Math.min(-diameterToRadius*radius*1.5, ring2.position.z+speed*data.dt)
                let dist = ring1.position.z - ring2.position.z
                if (dist < radius*diameterToRadius*1.5) ring2.position.z = ring1.position.z-radius*diameterToRadius*1.5
            }
            let ring1 = new THREE.Mesh(
                new THREE.TorusGeometry(0.5 * radius, 5/*radius * diameterToRadius / 2*/, 10, 16),
                new THREE.MeshStandardMaterial({color: new THREE.Color('pink')})
            )
            ring1.name = 'ring1'
            legs.add(ring1)
            let ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.5 * radius-5*2, 5/*radius*diameterToRadius / 2*/, 10, 16),
                new THREE.MeshStandardMaterial({color: new THREE.Color('pink')})
            )
            legs.add(ring2)
            ring2.name = 'ring2'
            ring2.position.set(0, 0, 0) //-diameterToRadius*radius*1.5)
            legs.ring1 = ring1; legs.ring2 = ring2
            legs.position.set(0, 0, -diameterToRadius*radius)
            
            let shoulderToRadius = 10/40
            let leftJoint = new THREE.Group()
            let leftArm = new THREE.Mesh(
                new THREE.CylinderGeometry(radius*shoulderToRadius, radius/2 * shoulderToRadius, 3*radius*shoulderToRadius, 32),
                new THREE.MeshStandardMaterial({color: new THREE.Color('pink')})
            )
            leftArm.position.set(0, -(radius+3/4*radius), 0)
            leftJoint.add(leftArm); leftJoint.name = 'leftJoint'; leftArm.name = 'leftArm'
            leftJoint.position.set(0, 0, 0.75 * radius); 
            leftJoint.rotation.order = 'ZYX'; leftJoint.rotation.set(Math.PI/6, 0, Math.PI/2)
            ball.add(leftJoint)
            this.leftJoint = leftJoint
            
            let rightJoint = new THREE.Group()
            let rightArm = new THREE.Mesh(
                new THREE.CylinderGeometry(radius*shoulderToRadius, radius/2 * shoulderToRadius, 3*radius*shoulderToRadius, 32),
                new THREE.MeshStandardMaterial({color: new THREE.Color('pink')})
            )
            rightArm.position.set(0, -(radius+3/4*radius), 0)
            rightJoint.add(rightArm); rightJoint.name = 'rightJoint'; rightArm.name = 'rightArm'
            rightJoint.position.set(0, 0, 0.75 * radius); 
            rightJoint.rotation.order = 'ZYX'; rightJoint.rotation.set(Math.PI/6, 0, -Math.PI/2)
            ball.add(rightJoint)
            this.rightJoint = rightJoint
            
            body.add(ball); body.add(legs)
            this.body = body; body.head = ball; body.legs = legs
            
            const weap2Cooldown = 2
            this.weapons = {
                projectile_queue: [],
                weap1: {
                    cleared: true,
                    prev: 0,
                    cooldown: 1 / 2,
                    direction: new THREE.Vector3(1, 0, 0),
                    update: function(data) {
                        let game = data.game
                        if (game.clock.getElapsedTime()-this.prev < this.cooldown || self.weapons.weap2.progress === 1 || !this.cleared)  return;
                        for (let i=0 ; i<self.weapons.projectile_queue.length ; i++) {
                            if (self.weapons.projectile_queue[i].active) continue;
                            this.direction.set(1, 0, 0)
                            this.direction.applyAxisAngle(new THREE.Vector3(0,0,1), self.rotation.z)
                            let activateData = {
                                direction: this.direction,
                                position: self.body.head.getWorldPosition().add(this.direction.clone().multiplyScalar(1.5 * radius)),
                                rotation: self.rotation.z
                            }
                            if (!self.weapons.projectile_queue[i].inScene) {
                                data.game.scene.add(self.weapons.projectile_queue[i]); data.game.objects.env.push(self.weapons.projectile_queue[i])
                                self.weapons.projectile_queue[i].inScene = true
                            }
                            self.weapons.projectile_queue[i].activate(activateData)
                            this.prev = game.clock.getElapsedTime()
                            this.audio.currentTime = 0; this.audio.play()
                            if (self.weapons.projectile_queue[i] instanceof GAMES2_HELPER.BALL_Weap3) {
                                self.weapons.weap3.activated = false
                                self.weapons.weap3.prev = data.game.clock.getElapsedTime()
                                self.weapons.projectile_queue.splice(i, 1)
                                self.velocity.x = -3000
                                self.controls.enabled = false
                                self.timers.controls.end = data.game.clock.getElapsedTime() + self.weapons.weap3.cast_time
                            }
                            this.cleared = false
                            break;
                        }
                        
                    },
                    audio: (()=>{
                        let audio = document.createElement('audio')
                        audio.volume = 0.25
                        let source = document.createElement('source')
                        audio.appendChild(source)
                        source.src = 'audio/weap1_trimmed.wav'; source.type = 'audio/wav'
                        
                        return audio;
                    })()
                },
                weap2: {
                    progress: 0,
                    prev: 0,
                    cooldown: weap2Cooldown,
                    fadeTime: 0,
                    delay: 0.1,//0.1,
                    theta: (1/2)*Math.PI,
                    blades: [GAMES2_HELPER.BALL_Blade],
                    damage: 20,
                    onHit: function(data, intersection) {
                        let obj = intersection.object
                        let current = obj
                        while (current && current.health === undefined) current = current.parent;
                        if (!current || current.health === undefined) return;
                        current.health.update({damage: this.damage})
                    },
                    rayc: new THREE.Raycaster(new THREE.Vector3(),((new THREE.Vector3(1, 0, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), 0.5*this.theta)).normalize(), 0, 5*radius),
                    update: function(data) {

                        if (this.progress === 0 && data.game.clock.getElapsedTime()-this.prev>this.cooldown ) {
                            this.rayc.ray.direction.copy(((new THREE.Vector3(1, 0, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), 0.5*this.theta+self.rotation.z)).normalize())
                            this.prev = data.game.clock.getElapsedTime()
                            self.mixer.existingAction(self.mixer.clips.standing).paused = true
                            self.mixer.stopAllAction()
                            let weap2Action = self.mixer.existingAction(self.mixer.clips.weap2)
                            weap2Action.reset(); weap2Action.play()
                            this.audio.currentTime = 0; this.audio.play()
                            
                            this.progress = 1
                        } else if (this.progress === 1) {
                            if (data.game.clock.getElapsedTime() - this.prev >= this.delay) {
                                let activated = false
                                for (let i=1 ; i<this.blades.length ; i++) {
                                    if (this.blades[i].active) continue;
                                    this.blades[i].activate(data, self.body.head.getWorldPosition(), self.rotation.z)
                                    activated = true
                                    break;
                                }
                                if (!activated) {
                                    let bladeInit = {
                                        range: this.theta,
                                        lengthToTip: 5 * radius,
                                        lengthToHandle: (5/2) * radius,
                                        targets: data.game.objects.enemies,
                                        onHit: this.onHit
                                    }
                                    this.blades.push(new this.blades[0](bladeInit))
                                    this.blades[this.blades.length-1].activate(data, self.body.head.getWorldPosition(), self.rotation.z)
                                }
                                this.progress = 2
                            }
                        } else if (this.progress === 2) {
                            this.fadeTime += data.dt
                            if (data.game.clock.getElapsedTime()-this.prev >= this.cooldown) {
                                this.progress = 0
                                this.fadeTime = 0
                            }
                        } 
                    },
                    audio: (()=>{
                        let audio = document.createElement('audio')
                        audio.volume = 0.35/2
                        let source = document.createElement('source')
                        audio.appendChild(source)
                        source.src = 'audio/lightsaber_trimmed.mp3'; source.type = 'audio/mpeg'
                        
                        return audio;
                    })()
                    
                },
                weap3: {
                    stacks: 3,
                    cooldown: 5,
                    progress: 0,
                    cast_time: 0.5,
                    prev: 0,
                    last_recharge: 0,
                    activated: false,
                    ammo: [],
                    update: function(data) {
                        this.update_stacks(data)
                        if (this.stacks === 0 || data.game.clock.getElapsedTime()-this.prev < this.cast_time || this.activated) return;
                        //  setup and fire
                        for (let i=0 ; i<this.ammo.length ; i++) {
                            if (!this.ammo[i].active) {
                                self.weapons.projectile_queue.unshift(this.ammo[i])
                                break;
                            }
                        }
                        self.weapons.weap1.prev = self.weapons.weap1.prev - self.weapons.weap1.cooldown
                        this.activated = true
                        this.stacks--;
                        //this.prev = data.game.clock.getElapsedTime()
                        
                    },
                    update_stacks: function(data) {
                        if (this.stacks === 3) return
                        let elapsed = data.game.clock.getElapsedTime()
                        if (!this.last_recharge) this.last_recharge = elapsed
                        let since_last = elapsed - this.last_recharge
                        
                        if (since_last > this.cooldown) {
                            this.stacks = Math.max(Math.min(3, this.stacks+Math.floor(since_last/this.cooldown)), 0)
                            
                            if (this.stacks === 3) this.last_recharge = 0 
                            else this.last_recharge = data.game.clock.getElapsedTime()
                        }
                    }
                }
                
            }
            let initialSupply = 5
            let projectileRadius = radius/3
            let weap1InitData = {
                radius: projectileRadius,
                geometry: new THREE.SphereGeometry(projectileRadius),
                material: new THREE.MeshBasicMaterial({color: new THREE.Color('yellow')})
            }
            for (let i=0 ; i<initialSupply ; i++) this.weapons.projectile_queue.push(new GAMES2_HELPER.BALL_Weap1(weap1InitData))
            this.weapons.weap2.onHit = this.weapons.weap2.onHit.bind(this.weapons.weap2)
            this.health = {
                bar: new GAMES2_HELPER.HealthBar(2 * radius),
                full: 200,
                current: 200,
                update: function(data) {
                    this.current = Math.max(0, this.current - data.damage)
                    this.bar.update(this.current/this.full)
                }
            }
            for (let i=0 ; i<this.weapons.weap3.stacks ; i++) this.weapons.weap3.ammo.push(new GAMES2_HELPER.BALL_Weap3({radius: 0.8 * radius}))
            
            this.health.bar.rotation.z = Math.PI/2; this.health.bar.position.set(0, 0, 3 * radius)
            
            this.mixer = new GAMES2.BALL_ANIMATION_MIXER(this, radius, radius*diameterToRadius, this.weapons.weap2.delay)
        }
        
        enable_controls(data) {
            if (data.game.clock.getElapsedTime() >= this.timers.controls.end) this.controls.enabled = true
        }
        
        update(data) {
            let g = 9.8
            this.prev.keys = this.keys
            this.keys = data.keys
            this.enable_controls(data)
            const weap2On = this.mixer.existingAction(this.mixer.clips.weap2).isRunning()
            
            if (weap2On && this.controls.enabled) {
                this.velocity.x = this.velocity.x * 0.95
                this.velocity.y = this.velocity.y * 0.95
            } else {
                this.velocity.x = this.velocity.x * 0.75
                this.velocity.y = this.velocity.y * 0.75
            }
            
            if (Math.abs(this.velocity.x)<1) this.velocity.x = 0
            if (Math.abs(this.velocity.y)<1) this.velocity.y = 0
            
            if ((this.keys[this.controls.jump]) && this.velocity.z === 0) {
                this.velocity.z = 600
                if (!this.mixer.checks.run) {
                    this.mixer.existingAction(this.mixer.clips.standing).paused = true
                    this.mixer.existingAction(this.mixer.clips.jump).play()
                }
            }
            this.velocity.z += -g * this.mass * data.dt
            
            if (this.controls.enabled && !weap2On) {
                if (this.keys[this.controls.left]) {
                    this.velocity.x = Math.min(500, this.velocity.x + 200)
                    if (this.keys[this.controls.up]) this.rotation.z = 3/4 * Math.PI
                    else if (this.keys[this.controls.down]) this.rotation.z = -3/4 * Math.PI
                    else this.rotation.z = Math.PI
                } else if (this.keys[this.controls.up]) {
                    this.velocity.x = Math.min(500, this.velocity.x + 200)
                    if (this.keys[this.controls.left]) this.rotation.z = 3/4 * Math.PI
                    else if (this.keys[this.controls.right]) this.rotation.z = 1/4 * Math.PI
                    else this.rotation.z = 1/2 * Math.PI
                } else if (this.keys[this.controls.right]) {
                    this.velocity.x = Math.min(500, this.velocity.x + 200)
                    if (this.keys[this.controls.up]) this.rotation.z = 1/4 * Math.PI
                    else if (this.keys[this.controls.down]) this.rotation.z = -1/4 * Math.PI
                    else this.rotation.z = 0
                } else if (this.keys[this.controls.down]) {
                    this.velocity.x = Math.min(500, this.velocity.x + 200)
                    if (this.keys[this.controls.left]) this.rotation.z = -3/4 * Math.PI
                    else if (this.keys[this.controls.right]) this.rotation.z = -1/4 * Math.PI
                    else this.rotation.z = -1/2 * Math.PI
                }
            }
            this.translateX(this.velocity.x * data.dt)
            this.position.z += this.velocity.z * data.dt
            
            this.rayc.ray.origin.copy(this.position)
            let intersections = this.rayc.intersectObjects(data.game.objects.env)
            for (let i=0 ; i<intersections.length ; i++) {
                if (intersections[i].object.isSurface) {
                    this.position.z = intersections[i].point.z + this.rayc.far
                    this.velocity.z = 0
                    if (intersections[i].object.angularV) {
                        
                        let p = ['x', 'y', 'z']
                        let a = intersections[i].object.angularV.clone()
                        let b = intersections[i].point.clone()
                        b.z = 0
                        a.cross(b)
                        let dx = a.x * data.dt
                        let dy = a.y * data.dt
                        this.position.x += dx
                        this.position.y += dy
                        //this.position.z += v.z * data.dt
                        
                    }
                    break;
                }   
            }
            
            if (!weap2On) {
                if ((this.velocity.x !== 0 || this.velocity.y !==0) && this.controls.enabled && (this.keys[this.controls.up]||this.keys[this.controls.down]||this.keys[this.controls.left]||this.keys[this.controls.right])) {
                    if (!this.mixer.checks.run ) {
                        this.mixer.checks.run = true
                        this.mixer.stopAllAction()
                        let run = this.mixer.existingAction(this.mixer.clips.run)
                        run.play()
                    } else if (this.mixer.checks.run) {
                        let running = this.mixer.existingAction(this.mixer.clips.running)
                        if (!running.isRunning() && !this.mixer.existingAction(this.mixer.clips.weap2).isRunning()) {
                            running.reset()
                            running.play()
                        }
                    }
                    
                } 
                else if (this.velocity.length() === 0) {
                    this.mixer.checks.run = false
                    let standing = this.mixer.existingAction(this.mixer.clips.standing)
                    if (!standing.isRunning()) {
                        this.mixer.stopAllAction()
                        standing.play()
                    }
                }
            }

            if (this.keys[this.controls.weap3]) this.weapons.weap3.update(data)
            if (this.keys[this.controls.weap1] && !weap2On) this.weapons.weap1.update(data)
            else if (!this.keys[this.controls.weap1]) this.weapons.weap1.cleared = true
            if (this.keys[this.controls.weap2] || this.weapons.weap2.progress > 0) this.weapons.weap2.update(data)
            
            if (!this.health.onScene) {
                data.game.scene.add(this.health.bar)
                this.health.onScene = true
            }
            this.health.bar.position.copy(this.position); this.health.bar.position.z += 3 * this.radius

            this.mixer.update(data.dt)

        }
    }
    
})