(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var scene, camera, renderer;
var plane, cylinder, box, arrow;

var textures = [], models = [], deps = [];

var velocity = new THREE.Vector3(0, 35, -70);
var gravity = new THREE.Vector3(0, -10, 10);
var position = new THREE.Vector3(0, 0, 10000);
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

	loadModel();
	loadItems();

	$.when.apply(this, deps).done(function(){
		console.log("loaded: ", textures);

		createObjects();
		render();
	});
}

function loadItems(){
	deps.push(loadTexture('metal_diffuse', 'metal_diffuse.jpg'));
	deps.push(loadTexture('metal_specular', 'metal_specular.jpg'));
	deps.push(loadTexture('metal_normal', 'metal_normal.jpg'));
}

function loadTexture(name, path){
	var deferred = $.Deferred();

	var loader = new THREE.TextureLoader();
	loader.load('../img/' + path, function(texture){
		textures[name] = texture;
		deferred.resolve();
	});

	return deferred.promise();
}

function loadModel(name, path){
	var deferred = $.Deferred();

	var loader = new THREE.JSONLoader();
	loader.load('../model/' + path, function(geometry){
		models[name] = geometry;
		deferred.resolve();
	});

	return deferred.promise();
}

function loadModel(){
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
	position.set(0, 0, 10000);
	finish = false;
}

var updateCamera = function(x, y, z){
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
}

function setupScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);
	camera.position.x = 3500;
	camera.position.y = 2500;
	camera.position.z = 12000;
	camera.lookAt(scene.position);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
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
		map: textures['metal_diffuse'],
		specularMap: textures['metal_specular'],
		normalMap: textures['metal_normal'],
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

	var geometry = new THREE.BoxGeometry(400, 400, 400);
	var material = new THREE.MeshBasicMaterial({color: 0x008822, wireframe: true});
	box = new THREE.Mesh(geometry, material);
	scene.add(box);
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
},{}]},{},[1]);
