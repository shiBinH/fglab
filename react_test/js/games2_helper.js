;
/* global THREE */
window.GAMES2_HELPER = new Object();

/*
    Helper functions and classes for GAMES2 characters
*/


$(() => {
    'use strict'
    window.GAMES2_HELPER.HealthBar = class HealthBar extends THREE.Group {
        constructor(healthBarLength) {
            super()
            this.onScene = false
            this.purpose = 'health_bar'
            this.defaultLength = healthBarLength
            this.hp = 1
            let cylinderRadius = 5
            let greybar = new THREE.Mesh(
                new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, healthBarLength),
                new THREE.MeshStandardMaterial({color: new THREE.Color('grey')})
            )
            let health = new THREE.Mesh(
                new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, healthBarLength),
                new THREE.MeshStandardMaterial({color: new THREE.Color('lightgreen')})
            )
            this.full = greybar; this.health = health
            this.add(greybar); this.add(health)
        }
        
        update(newHp) {
            this.health.scale.y = Math.max(newHp, 0.01)
            this.hp = newHp
            console.log(this.hp)
            let y = 0.5 * this.defaultLength * (1-newHp)
            this.health.position.y = Math.min(y, this.defaultLength*0.5)
        }
        
    }
    
    window.GAMES2_HELPER.BALL_Weap1 = class extends THREE.Mesh {
        constructor(weap1_initData) {
            super(
                weap1_initData.geometry.clone(true),
                weap1_initData.material.clone(true)
            )
            let initData = weap1_initData
            this.inScene = false
            this.active = false
            this.castShadow = true
            this.damage = 10
            this.direction = new THREE.Vector3()
            this.rayc = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 2*initData.radius)
        }
        
        update(data) {
            if (!this.active) return;
            
            let deltaPosition = this.rayc.ray.direction.clone().multiplyScalar(700 * data.dt)
            this.position.add(deltaPosition)
            
            if (this.position.length() > 1000) this.deactivate()
            this.rayc.ray.origin.add(deltaPosition)
            
            let collisions = {}
            let intersections = this.rayc.intersectObjects(data.game.objects.enemies)
            for (let i=0 ; i<intersections.length ; i++) {
                this.handleHit(data, intersections[i])
            }
        }
        
        activate(data) {
            this.position.copy(data.position)
            this.rayc.ray.direction.copy(data.direction)
            this.rayc.ray.origin.copy(data.position)
            let adjust = data.direction.clone().normalize().multiplyScalar(this.rayc.far)
            this.rayc.ray.origin.sub(adjust)
            
            this.visible = true
            this.active = true
        }
        
        deactivate(data) {
            this.active = false
            this.visible = false
        }
        
        handleHit(data, intersection) {
            let obj = intersection.object
            if (obj.isSurface) {
                this.deactivate()
                return;
            }
            let current = obj
            while (current && current.health === undefined) current = current.parent;
            if (!current || current.health === undefined) return;
            current.health.update({damage: this.damage})
            
            this.deactivate()
        }
        
    }
    
    window.GAMES2_HELPER.BALL_Blade = class extends THREE.Mesh {
                            
        //  constructor(range, lengthToHandle, lengthToTip, ) {
        constructor(init) {
            super (new THREE.Geometry(), new THREE.MeshBasicMaterial({color: new THREE.Color('lightgreen'), transparent: true, side: THREE.DoubleSide}))
            this.active = false
            this.onScene = false
            this.range = init.range
            this.lengthToHandle = init.lengthToHandle
            this.lengthToTip = init.lengthToTip
            this.targets = init.targets
            this.onHit = init.onHit
            this.elapsed = undefined
            this.collisionCheck = false
            this.checkResolution = 16
            this.rayc = new THREE.Raycaster(
                new THREE.Vector3(), 
                new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0,0,1), init.range/2),
                0,
                init.lengthToTip
            )
            let rotationAxis = new THREE.Vector3(0,0,1)
            let dir = new THREE.Vector3(init.lengthToTip,0,0).applyAxisAngle(rotationAxis, init.range/2)
            for (let i=0, d=this.checkResolution ; i<=d ; i++) {
                if (i%2 === 0) {
                    this.geometry.vertices.push(dir.clone())
                    this.geometry.vertices.push(dir.clone().multiplyScalar(init.lengthToHandle/init.lengthToTip))
                }
                dir.applyAxisAngle(rotationAxis, -init.range/d)
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
            let collided = {};
            for (let i=0 ; i<=this.checkResolution ; i++) {
                let intersections = this.rayc.intersectObjects(this.targets)
                for (let obj=0 ; obj<intersections.length ; obj++) {
                    if (collided[intersections[obj].object.id]) continue;
                    this.onHit(data, intersections[obj])
                    collided[intersections[obj].object.id] = true
                }
                this.rayc.ray.direction.applyAxisAngle(axis, -this.range/this.checkResolution)
            }
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
    
    window.GAMES2_HELPER.BALL_Weap3 = class extends THREE.Group {
        constructor(initData) {
            super();
            this.inScene = false
            this.active = false
            this.castShadow = true
            this.damage = 25
            this.direction = new THREE.Vector3()
            this.radius = {
                head: initData.radius,
                body: 0.75 * initData.radius,
                tail: 0.5 * initData.radius
            }
            this.rayc = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 2*(this.radius.head+this.radius.body+this.radius.tail))
            let material = new THREE.MeshBasicMaterial({color: 0x3aeeff, transparent: true, opacity: 0.9})
            let head = new THREE.Mesh(
                new THREE.SphereGeometry(initData.radius, 16),
                material
            )
            let body = new THREE.Mesh(
                new THREE.SphereGeometry(this.radius.body, 16),
                new THREE.MeshBasicMaterial({color: 0x3aeeff, transparent: true, opacity: 0.75})
            )
            let tail = new THREE.Mesh(
                new THREE.SphereGeometry(this.radius.tail, 16),
                new THREE.MeshBasicMaterial({color: 0x3aeeff, transparent: true, opacity: 0.5})
            )
            this.add(head); this.add(body); this.add(tail)
            body.position.set(-this.radius.head-this.radius.body, 0, 0)
            tail.position.set(-this.radius.head-this.radius.body-this.radius.body-this.radius.tail, 0, 0)
        }
        
        update(data) {
            if (!this.active) return;
            
            let deltaPosition = this.rayc.ray.direction.clone().multiplyScalar(1500 * data.dt)
            this.position.add(deltaPosition)
            
            if (this.position.length() > 1000) this.deactivate()
            this.rayc.ray.origin.add(deltaPosition)
            
            let collisions = {}
            let intersections = this.rayc.intersectObjects(data.game.objects.enemies)
            for (let i=0 ; i<intersections.length ; i++) {
                if (collisions[intersections[i].object.id]) continue;
                collisions[intersections[i].object.id] = true
                this.handleHit(data, intersections[i])
            }
        }
        
        handleHit(data, intersection) {
            let obj = intersection.object
            if (obj.isSurface) {
                this.deactivate()
                return;
            }
            let current = obj
            while (current && current.health === undefined) current = current.parent;
            if (!current || current.health === undefined) return;
            current.health.update({damage: this.damage})
            
            this.deactivate()
        }
        
        activate(data) {
            this.rotation.z = data.rotation
            this.position.copy(data.position)
            this.rayc.ray.direction.copy(data.direction)
            this.rayc.ray.origin.copy(data.position)
            let adjust = data.direction.clone().normalize().multiplyScalar(this.rayc.far )
            this.rayc.ray.origin.sub(adjust)
            this.active = true
            this.visible = true
        }
        
        deactivate(data) {
            this.active = false
            this.visible = false
        }
    }
})
