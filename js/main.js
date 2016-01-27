var scene, camera, renderer;
var plane, cylinder, box, arrow;

var velocity = new THREE.Vector3(0, 35, -70);
var gravity = new THREE.Vector3(0, -10, 0);
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
	createObjects();

	loadModel();
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
		
		render();
	})
}

var update = function(y, z){
	velocity = new THREE.Vector3(0, y, z);
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

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function createObjects(){
	var geometry = new THREE.PlaneGeometry(2000, 20000);
	var material = new THREE.MeshBasicMaterial({color: 0x884422});
	plane = new THREE.Mesh(geometry, material);
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