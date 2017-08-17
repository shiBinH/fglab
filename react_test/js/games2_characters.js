;

const global_name = 'GAMES2'
if (!window[global_name]) window[global_name] = new Object()



;$(() => {
    'use strict'
    
    GAMES2.BALL_ANIMATION_MIXER = class extends THREE.AnimationMixer{
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
        constructor(radius ,mass) {
            super()
            const self = this
            this.mass = mass
            this.velocity = new THREE.Vector3()
            this.rayc = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 2*radius*10/40)//3.5*radius*10/40)
            this.keys = {}
            this.firePoint = new THREE.Group()
            
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
                if (self.actions && !self.actions.action['run'].isRunning()) {
                    let action = self.actions.action['standing']
                    if (action.isRunning()) return;
                    //  self.actions.stopAllAction()
                    action.play()
                    
                }

            }
            
            this.firePoint.position.set(10000, 0, 0)
            this.add(this.firePoint)
            
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

            this.weapons = {
                weap1: {
                    ammo: (() => {
                        class Projectile extends THREE.Mesh {
                            constructor(weap1_initData) {
                                super(
                                    weap1_initData.geometry.clone(true),
                                    weap1_initData.material.clone(true)
                                )
                                let initData = weap1_initData
                                this.inScene = false
                                this.active = false
                                this.castShadow = true
                                this.direction = new THREE.Vector3()
                                this.rayc = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 2*initData.radius)
                            }
                            
                            update(data) {
                                if (!this.active) return;
                                
                                let deltaPosition = this.rayc.ray.direction.clone().multiplyScalar(700 * data.dt)
                                this.position.add(deltaPosition)
                                
                                if (this.position.length() > 1000) this.deactivate()
                                this.rayc.ray.origin.add(deltaPosition)
                                
                                let intersections = this.rayc.intersectObjects(data.game.scene.children, true)
                                for (let i=0 ; i<intersections.length ; i++) {
                                    if (intersections[i].object.isSurface || intersections[i].object.isEnemy) {
                                        this.handleHit(data, intersections[i].object)
                                        break;
                                    }
                                }
                            }
                            
                            activate(data) {
                                this.position.copy(data.position)
                                this.rayc.ray.direction.copy(data.direction)
                                this.rayc.ray.origin.copy(data.position)
                                let adjust = data.direction.clone().normalize().multiplyScalar(2*this.rayc.far)
                                this.rayc.ray.origin.sub(adjust)
                                
                                this.visible = true
                                this.active = true
                            }
                            
                            deactivate(data) {
                                this.active = false
                                this.visible = false
                            }
                            
                            handleHit(data, target) {
                                this.deactivate()
                            }
                            
                        } 
                        
                        let ammo = [Projectile]
                        let initialSupply = 5
                        let projectileRadius = radius/3
                        let initData = {
                            radius: projectileRadius,
                            geometry: new THREE.SphereGeometry(projectileRadius),
                            material: new THREE.MeshBasicMaterial({color: new THREE.Color('yellow')})
                        }
                        for (let i=0 ; i<initialSupply ; i++) ammo.push(new Projectile(initData))
                        return ammo;
                    })(),
                    prev: 0,
                    cooldown: 1 / 2,
                    direction: new THREE.Vector3(1, 0, 0),
                    update: function(data) {
                        let game = data.game
                        if (game.clock.getElapsedTime()-this.prev < this.cooldown || self.weapons.weap2.progress === 1) return;
                        for (let i=1 ; i<this.ammo.length ; i++) {
                            if (this.ammo[i].active) continue;
                            this.direction.set(1, 0, 0)
                            this.direction.applyAxisAngle(new THREE.Vector3(0,0,1), self.rotation.z)
                            let activateData = {
                                direction: this.direction,
                                position: self.body.head.getWorldPosition().add(this.direction.clone().multiplyScalar(1.5 * radius))
                            }
                            if (!this.ammo[i].inScene) {
                                data.game.scene.add(this.ammo[i]); data.game.objects.env.push(this.ammo[i])
                                this.ammo[i].inScene = true
                            }
                            this.ammo[i].activate(activateData)
                            this.prev = game.clock.getElapsedTime()
                            break;
                        }
                        
                    }
                },
                weap2: {
                    progress: 0,
                    prev: 0,
                    cooldown: 2,
                    fadeTime: 0,
                    delay: 0.1,//0.1,
                    theta: (2/3)*Math.PI,
                    blades: (() => {
                        class Blade extends THREE.Mesh {
                            
                            constructor(range, lengthToHandle, lengthToTip) {
                                super (new THREE.Geometry(), new THREE.MeshBasicMaterial({color: new THREE.Color('lightgreen'), transparent: true, side: THREE.DoubleSide}))
                                this.active = false
                                this.onScene = false
                                this.range = range
                                this.lengthToHandle = lengthToHandle
                                this.lengthToTip = lengthToTip
                                this.elapsed = undefined
                                this.collisionCheck = false
                                this.checkResolution = 16
                                this.rayc = new THREE.Raycaster(
                                    new THREE.Vector3(), 
                                    new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0,0,1), range/2),
                                    0,
                                    lengthToTip
                                )
                                let rotationAxis = new THREE.Vector3(0,0,1)
                                let dir = new THREE.Vector3(lengthToTip,0,0).applyAxisAngle(rotationAxis, range/2)
                                for (let i=0, d=this.checkResolution ; i<=d ; i++) {
                                    if (i%2 === 0) {
                                        this.geometry.vertices.push(dir.clone())
                                        this.geometry.vertices.push(dir.clone().multiplyScalar(lengthToHandle/lengthToTip))
                                    }
                                    dir.applyAxisAngle(rotationAxis, -range/d)
                                }
                                for (let i=0 ; i<this.geometry.vertices.length-2 ; i++) {
                                    this.geometry.faces.push(new THREE.Face3(i, i+1, i+2))
                                }
                                this.geometry.computeBoundingSphere()
                                this.geometry.computeFaceNormals()
                                this.material.opacity = 0
                            }
                            
                            update(data) {
                                if (!this.active) return;
                                
                                if (this.elapsed >= 1) this.deactivate(data)
                                else if (this.elapsed >= 0.5) this.material.opacity -= 0.8 * data.dt / (1/2)
                                else if (this.material.opacity < 0.8) {
                                    this.material.opacity = Math.min(0.8, this.material.opacity+0.01*(this.elapsed/data.dt)*(this.elapsed/data.dt))
                                    if (this.material.opacity === 0.8 && !this.collisionCheck) {
                                        this.checkForCollisions(data)
                                        this.collisionCheck = true
                                    }
                                }
                                
                                this.elapsed += data.dt
                            }
                            
                            checkForCollisions(data) {
                                let axis = new THREE.Vector3(0,0,1)
                                this.rayc.ray.direction.applyAxisAngle(axis, this.range/2)
                                for (let i=0 ; i<=this.checkResolution ; i++) {
                                    let intersections = this.rayc.intersectObjects(data.game.objects.enemies)
                                    for (let obj=0 ; obj<intersections.length ; obj++) {
                                        if (intersections[obj].object.isEnemy) {
                                            this.onCollision()
                                        }
                                    }
                                    this.rayc.ray.direction.applyAxisAngle(axis, -this.range/this.checkResolution)
                                }
                            }
                            
                            onCollision() {
                                console.log('intersected enemy')
                            }
                            
                            activate(data, position, thetaOffset) {
                                this.visible = true
                                this.elapsed = 0
                                this.collisionCheck = false
                                this.position.copy(position)
                                this.rotation.z = thetaOffset
                                this.rayc.ray.origin.copy(position)
                                this.rayc.ray.direction.set(1,0,0).applyAxisAngle(new THREE.Vector3(0,0,1), thetaOffset)
                                if (!this.onScene) {
                                    data.game.scene.add(this); data.game.objects.env.push(this)
                                    this.onScene = true
                                }
                                this.active = true
                            }
                            
                            deactivate(data) {
                                this.active = false
                                this.visible = false
                            }
                        }
                        let blades = [Blade]
                        let range = Math.PI/2
                        let lengthToTip = 5 * radius
                        let lengthToHandle = lengthToTip/2
                        let supply = Math.floor(1/2/*cooldown*/) + 1
                        for (let i=0 ; i<supply ; i++) blades.push(new Blade(range, lengthToHandle, lengthToTip))
                        return blades;
                    })(),
                    rayc: new THREE.Raycaster(new THREE.Vector3(),((new THREE.Vector3(1, 0, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), 0.5*this.theta)).normalize(), 0, 5*radius),
                    onCast: function(data, origin, thetaOffset) {
                        this.rayc.ray.origin.copy(origin)
                        this.rayc.ray.direction.copy(((new THREE.Vector3(1, 0, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), 0.5*this.theta)).normalize())
                        this.rayc.ray.direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), thetaOffset)
                        for (let i=0, d=16 ; i<=d ; i++) {
                            let intersections = this.rayc.intersectObjects(data.game.scene.children)
                            for (let j=0 ; j<intersections.length ; j++) {
                                if (intersections[j].object.isEnemy) console.log('intersected enemy')
                            }
                            this.rayc.ray.direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.theta/d)
                        }
                        this.progress = 3
                    },
                    update: function(data) {

                        if (this.progress === 0 && data.game.clock.getElapsedTime()-this.prev>this.cooldown) {
                            this.rayc.ray.direction.copy(((new THREE.Vector3(1, 0, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), 0.5*this.theta+self.rotation.z)).normalize())
                            this.prev = data.game.clock.getElapsedTime()
                            self.actions.existingAction(self.actions.clips.standing).paused = true
                            self.actions.stopAllAction()
                            let weap2Action = self.actions.existingAction(self.actions.clips.weap2)
                            weap2Action.reset(); weap2Action.play()
                            
                            this.progress = 1
                        } else if (this.progress === 1) {
                            if (data.game.clock.getElapsedTime() - this.prev >= this.delay) {
                                for (let i=1 ; i<this.blades.length ; i++) {
                                    if (this.blades[i].active) continue;
                                    this.blades[i].activate(data, self.body.head.getWorldPosition(), self.rotation.z)
                                    break;
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
                    }
                }
                
            }
            this.weapons.weap2.onCast = this.weapons.weap2.onCast.bind(this.weapons.weap2)
            
            this.actions = new GAMES2.BALL_ANIMATION_MIXER(this, radius, radius*diameterToRadius, this.weapons.weap2.delay)
        }
        
        update(data) {
            let g = 9.8
            this.keys = data.keys
                                        
            this.velocity.x = this.velocity.x * 0.75
            this.velocity.y = this.velocity.y * 0.75
            if (Math.abs(this.velocity.x<1)) this.velocity.x = 0
            if (Math.abs(this.velocity.y<1)) this.velocity.y = 0
            
            if ((this.keys[90]) && this.velocity.z === 0) {
                this.velocity.z = 600
                if (!this.actions.checks.run) {
                    this.actions.existingAction(this.actions.clips.standing).paused = true
                    this.actions.existingAction(this.actions.clips.jump).play()
                }
            }
            this.velocity.z += -g * this.mass * data.dt
            
            if (this.keys[37]) {
                this.velocity.x = 500
                if (this.keys[38]) this.rotation.z = 3/4 * Math.PI
                else if (this.keys[40]) this.rotation.z = -3/4 * Math.PI
                else this.rotation.z = Math.PI
            } else if (this.keys[38]) {
                this.velocity.x = 500
                if (this.keys[37]) this.rotation.z = 3/4 * Math.PI
                else if (this.keys[39]) this.rotation.z = 1/4 * Math.PI
                else this.rotation.z = 1/2 * Math.PI
            } else if (this.keys[39]) {
                this.velocity.x = 500
                if (this.keys[38]) this.rotation.z = 1/4 * Math.PI
                else if (this.keys[40]) this.rotation.z = -1/4 * Math.PI
                else this.rotation.z = 0
            } else if (this.keys[40]) {
                this.velocity.x = 500
                if (this.keys[37]) this.rotation.z = -3/4 * Math.PI
                else if (this.keys[39]) this.rotation.z = -1/4 * Math.PI
                else this.rotation.z = -1/2 * Math.PI
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
            
            //if ((this.keys[37]||this.keys[38]||this.keys[39]||this.keys[40]) && !this.actions.checks.run) {
            if (!this.actions.existingAction(this.actions.clips.weap2).isRunning()) {
                if ((this.velocity.x !== 0 || this.velocity.y !==0)) {
                    if (!this.actions.checks.run ) {
                        this.actions.checks.run = true
                        this.actions.stopAllAction()
                        let run = this.actions.existingAction(this.actions.clips.run)
                        run.play()
                    } else if (this.actions.checks.run) {
                        let running = this.actions.existingAction(this.actions.clips.running)
                        if (!running.isRunning() && !this.actions.existingAction(this.actions.clips.weap2).isRunning()) {
                            running.reset()
                            running.play()
                        }
                    }
                    
                } 
                else if (this.velocity.length() === 0) {
                    this.actions.checks.run = false
                    let standing = this.actions.existingAction(this.actions.clips.standing)
                    if (!standing.isRunning()) {
                        this.actions.stopAllAction()
                        standing.play()
                    }
                }
            }

        
            if (this.keys[88]) this.weapons.weap1.update(data)
            if (this.keys[83] || this.weapons.weap2.progress > 0) this.weapons.weap2.update(data)
            this.actions.update(data.dt)

        }
    }
    
})