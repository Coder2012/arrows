var scene, camera, renderer;
var plane, cylinder, box;

var velocity = new THREE.Vector3(0, 35, -50);
var gravity = new THREE.Vector3(0, -15, 0);
var position = new THREE.Vector3(0, 0, 10000);
var centre = new THREE.Vector3(0, 0, 0);
var up = new THREE.Vector3(0, 1, 0);

var clock = new THREE.Clock();

init();

function init(){
	setupScene();
	createObjects();
	
	render();
}

var update = function(y, z){
	velocity = new THREE.Vector3(0, y, z);
	gravity = new THREE.Vector3(0, -10, 0);
	position.set(0, 0, 10000);
}

function setupScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);
	camera.position.x = 20000;
	camera.position.y = 1500;
	camera.position.z = 0;
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
	scene.add(plane);

	var geometry = new THREE.BoxGeometry(400, 400, 400);
	var material = new THREE.MeshBasicMaterial({color: 0x008822, wireframe: true});
	box = new THREE.Mesh(geometry, material);
	scene.add(box);
}

function collisions(){
	box.updateMatrixWorld();
	var worldPosition = box.matrixWorld;
	console.log("y: ", worldPosition.y);
	if(worldPosition.y <= 0){
		worldPosition.y = 0;
	}
}



function render(){
	var delta = clock.getDelta();

	if(delta > 0.016){
		delta = 0.016;
	}


	velocity.addScaledVector(gravity, delta);
	position.add(velocity);

	box.matrixAutoUpdate = false;
	box.matrix.setPosition(position);
	box.matrix.lookAt(centre, velocity, up);

	collisions();

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}