var $ = require('../js/lib/jQuery');
var THREE = require('../js/lib/three');
var loader = require('./loader');

var scene, camera, renderer;
var plane, cylinder, turret, arrow;

var loader;

var velocity = new THREE.Vector3(0, 35, -70);
var gravity = new THREE.Vector3(0, -10, 10);
var position = new THREE.Vector3(0, 0, 8000);
var centre = new THREE.Vector3(0, 0, 0);
var up = new THREE.Vector3(0, 1, 0);
var vector = new THREE.Vector3();
var finish = false;

var up = new THREE.Vector3( 0, 1, 0 );
var axis = new THREE.Vector3();
var pt, radians, axis, tangent;

var clock = new THREE.Clock();

init();

function init(){
	setupScene();

	loadItems();
}

function loadItems(){

	var items = [
		{name: 'turret', path: 'turret.json', type: 'model'},
		{name: 'arrow', path: 'arrow.json', type: 'model'},
		{name: 'metal_diffuse', path: 'metal_diffuse.jpg', type: 'texture'},
		{name: 'metal_specular', path: 'metal_specular.jpg', type: 'texture'},
		{name: 'metal_normal', path: 'metal_normal.jpg', type: 'texture'}
	]

	loader.load(items).done(function(){
		createObjects();
		render();
	})
}

function loadArrow(){
	var scale = 10;
	var loader = new THREE.JSONLoader();
	loader.load('../model/arrow.json', function(geometry){
		arrow = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
		arrow.name = 'arrow';
		geometry.rotateZ(THREE.Math.degToRad(90));
		arrow.scale.set(scale, scale, scale);
		scene.add(arrow);
	});
}

var update = function(coords){
	velocity = new THREE.Vector3(coords.x, coords.y, coords.z);
	gravity = new THREE.Vector3(0, -10, 0);
	position.set(0, 0, 8000);
	finish = false;
}

var updateCamera = function(x, y, z){
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
}

var updateTurret = function(coords){
	turret.rotation.x = THREE.Math.degToRad(coords.turretX);
	turret.rotation.y = THREE.Math.degToRad(coords.turretY);
}

function setupScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);
	camera.position.x = 3500;
	camera.position.y = 2500;
	camera.position.z = 12000;
	camera.lookAt(scene.position);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set( 10, 10, 0 );
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function createObjects(){
	var geometry = new THREE.PlaneGeometry(20000, 20000, 1, 1);

	var repeat = 5;
	floorMaterial = new THREE.MeshPhongMaterial( {
		color: 0xdddddd,
		specular: 0x222222,
		shininess: 55,
		map: loader.getTexture('metal_diffuse'),
		specularMap: loader.getTexture('metal_specular'),
		normalMap: loader.getTexture('metal_normal'),
		normalScale: new THREE.Vector2( 1, 1 )
	} );

	floorMaterial.map.wrapS = THREE.RepeatWrapping;
	floorMaterial.map.wrapT = THREE.RepeatWrapping;
	floorMaterial.map.repeat.set(repeat, repeat);

	floorMaterial.specularMap.wrapS = THREE.RepeatWrapping;
	floorMaterial.specularMap.wrapT = THREE.RepeatWrapping;
	floorMaterial.specularMap.repeat.set(repeat, repeat);

	floorMaterial.normalMap.wrapS = THREE.RepeatWrapping;
	floorMaterial.normalMap.wrapT = THREE.RepeatWrapping;
	floorMaterial.normalMap.repeat.set(repeat, repeat);

	plane = new THREE.Mesh(geometry, floorMaterial);
	plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(-90));
	plane.name = 'plane';
	scene.add(plane);

	var scale = 400;
	var geometry = loader.getModel('turret');
	geometry.rotateX(THREE.Math.degToRad(-90));
	turret = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff }));
	turret.name = 'turret';

	turret.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = new THREE.MeshLambertMaterial( { color: 0x448800 });
            child.geometry.computeVertexNormals();
            child.material.shading = THREE.FlatShading;
        }
    } );

	turret.position.z = 8000;
	turret.scale.set(scale, scale, scale);
	scene.add(turret);

	scale = 10;
	geometry = loader.getModel('arrow');
	arrow = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0x628297}));
	arrow.name = 'arrow';
	geometry.rotateZ(THREE.Math.degToRad(90));
	arrow.scale.set(scale, scale, scale);
	scene.add(arrow);
}

function collisions(){
	
	box.updateMatrixWorld();
	vector.setFromMatrixPosition(box.matrixWorld);
	console.log("y: ", vector.y);
	if(vector.y <= -1){
		finish = true;
	}
}

function render(){
	var delta = clock.getDelta();

	if(delta > 0.016){
		delta = 0.016;
	}

	if(!finish){

		velocity.addScaledVector(gravity, delta);
		position.add(velocity);

		var v = velocity.clone().normalize();

		axis.crossVectors(up, v).normalize();
		radians = Math.acos(up.dot(v));
		arrow.quaternion.setFromAxisAngle(axis, radians);

		arrow.position.set(position.x, position.y, position.z);
		// collisions();
	}

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

//-------------------------------------------------------

var settings, gui, ctrlX, ctrlY;

var Settings = function() {
  this.x = 0,
  this.y = 35,
  this.z = -70,
  this.cameraX = 3500;
  this.cameraY = 2500;
  this.cameraZ = 12000;
  this.turretX = 0;
  this.turretY = 0;

  this.reset = function(){
    update(this.y, this.z);
  }

};


  settings = new Settings();
  gui = new dat.GUI();
  ctrlX = gui.add(settings, 'x', -30, 30);
  ctrlY = gui.add(settings, 'y', 0, 60);
  ctrlZ = gui.add(settings, 'z', -400, 0);
  ctrlTurretX = gui.add(settings, 'turretX', 0, 90);
  ctrlTurretY = gui.add(settings, 'turretY', -45, 45);
  ctrlCameraX = gui.add(settings, 'cameraX', 0, 5000);
  ctrlCameraY = gui.add(settings, 'cameraY', 0, 5000);
  ctrlCameraZ = gui.add(settings, 'cameraZ', 0, 15000);
  gui.add(settings, 'reset');

  ctrlX.onFinishChange(function(value) {
      settings.x = value;
      update(settings);
  });

  ctrlY.onFinishChange(function(value) {
      settings.y = value;
      update(settings);
  });

  ctrlZ.onFinishChange(function(value) {
      settings.z = value;
      update(settings);
  });

  ctrlTurretX.onFinishChange(function(value) {
      settings.turretX = value;
      updateTurret(settings);
  });

  ctrlTurretY.onFinishChange(function(value) {
      settings.turretY = value;
      updateTurret(settings);
  });

  ctrlCameraX.onFinishChange(function(value) {
      settings.cameraX = value;
      updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });

  ctrlCameraY.onFinishChange(function(value) {
      settings.cameraY = value;
      updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });

  ctrlCameraZ.onFinishChange(function(value) {
      settings.cameraZ = value;
      updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });


//--------------------------------------------------------