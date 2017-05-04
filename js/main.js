;$(function(){
	"use strict"
	
	var scene, camera, renderer;
	var clock;
	var test;
		
	init()
	animate()
	
	function init() {
		clock = new THREE.Clock()
		var $document = $(document),
				$body = $(document.body)
		//	setup camera, scene, renderer
		camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000)
		camera.position.set(0, 0, 300)
		scene = new THREE.Scene()
		renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		$body.prepend(renderer.domElement)
		$document.on('resize', ()=>{
			//	update projection matrix and renderer on window resizing
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize( window.innerWidth, window.innerHeight )
		})
		//	$('#test').width(100)
		
		//	setup lights
		var hemisphere = new THREE.HemisphereLight('white', 1)
		hemisphere.position.set(0, 0, 100)
		scene.add(hemisphere)
		var ambient = new THREE.AmbientLight('white', 0.5)
		scene.add(ambient)
		
		//	add objects
		test = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshStandardMaterial())
		scene.add(test)
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 16), new THREE.MeshStandardMaterial())
		test.add(sphere)
		sphere.position.set(0, 35, 0)
		
		renderer.render(scene, camera)
		
	}
	
	function animate() {
		test.rotation.y += Math.PI * 1/120
		test.rotation.x += .7 * Math.PI * 1/120
		
		renderer.render(scene, camera)
		requestAnimationFrame(animate)
	}
})