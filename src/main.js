import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import { CreateWorld } from "../modules/create_world.js"
import { UIBuildRoom } from "../modules/UIBuildRoom.js"
import { MapTile } from "../modules/MapTile.js"
import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"
import WebGL from "../js/WebGL.js";
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import { MobManager } from "../modules/MobManager.js"
import { Unit } from "../modules/Unit.js"
const frustumSize = 10;
let camera,aspect,scene,renderer,gui;

const CLOCK = new THREE.Clock()
const CAMERA_HIDDEN_Z = 100;
const GHOST_BUILD_Z = 3;

function init(){
    scene = new THREE.Scene();
    aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    gui = [null,null,null,null,null];
    gui[0] = camera;
    camera.position.z = 5;
    bar.position.y += -4;
    bar.position.z += 3;
    gui[1] = bar;
    MobManager.getInstance().init(scene);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(bar);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown',onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    
}

const ghostGeom = new THREE.PlaneGeometry( 1, 1 );
const ghostMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1 });
const ghostPlane = new THREE.Mesh(ghostGeom, ghostMat);
let roomBuild = false;

const geometry2 = new THREE.PlaneGeometry( 10, 1 );
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const bar = new THREE.Mesh(geometry2,material2)

var mx = 0;
var my = 0;
var mouse_down = false;

const geometry = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load( '../textures/mush.png' );
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);

function animate() {
    requestAnimationFrame(animate);
	CLOCK.getDelta()
	MobManager.getInstance().update()
    var obj = cube;

    var obj2 = cube2;
    
    var x_diff = obj2.position.x - obj.position.x
    var y_diff = obj2.position.y - obj.position.y
    var nvector = ((x_diff) ** 2 + (y_diff) ** 2)**-0.5;
    if ((Math.abs(x_diff) > 0.1) || (Math.abs(y_diff) > 0.1)){
        obj.position.x += x_diff * nvector * 0.01;
        obj.position.y += y_diff * nvector * 0.01;
    }
    obj2.position.y += 0.01;

    renderer.render(scene, camera);
}

function onDocumentMouseDown( event ) {
	mouse_down = true;    

	if(roomBuild == true)
	{
		UIBuildRoom(new THREE.Vector2(mx-WORLD_MIN_X-0.5,my-WORLD_MIN_Y-0.5));

		//exit room construction mode
		roomBuild = false;
		ghostPlane.position.z = CAMERA_HIDDEN_Z;
	}
    
}
function onDocumentMouseUp( event ) {
    mouse_down = false;
}
function onDocumentMouseMove(event) {
	event.preventDefault();

	//update the coordinates of the "mouse over" room
	mx = Math.ceil(camera.position.x + aspect * frustumSize *((event.clientX/window.innerWidth)*2 -1) * 0.5 - 0.5);
	my = Math.ceil(camera.position.y + -frustumSize *((event.clientY/window.innerHeight)*2 -1) * 0.5 - 0.5);
	
	//boundary checks
	if(mx < WORLD_MIN_X+0.5)
	{
		mx = WORLD_MIN_X+0.5;
	}
	else if(mx > WORLD_MAX_X+0.5)
	{
		mx = WORLD_MAX_X+0.5;
	}
	if(my < WORLD_MIN_Y+0.5)
	{
		my = WORLD_MIN_Y+0.5;
	}
	else if(my > WORLD_MAX_Y+0.5)
	{
		my = WORLD_MAX_Y+0.5;
	}

	//click and drag the map around
	if (mouse_down){
		for (let i =0; i < 4; i++){
			if (gui[i] != null){
				gui[i].position.x -= event.movementX * 0.01;
				gui[i].position.y += event.movementY * 0.01;
			}
		}
	}
	
	//update the position of the construction ghost
	if (roomBuild == true){
		ghostPlane.position.x = mx;
		ghostPlane.position.y = my;
		//console.log("animate() ghost:" + ghost.position.x + "," + ghost.position.x);
	}
}
function onDocumentKeyDown(event) {
	//press 'a' to go into room construction mode, and create a construction ghost
	//this is a visual effect which follows the cursor
    if (event.key == 'a'){
	ghostPlane.position.x = mx;
	ghostPlane.position.y = my;
        ghostPlane.position.z = GHOST_BUILD_Z;
        roomBuild = true;
    }
}

function main() {
	init()
	//scene.add(cube);

	//scene.add(create_plane(1,3));
	//scene.add(create_plane(2,0));

	//scene.add(cube2);
    	MapTile.scene = scene;
	scene.add(ghostPlane);
	ghostPlane.position.z = CAMERA_HIDDEN_Z;
    	CreateWorld();
    
	if (WebGL.isWebGLAvailable()) {
		// var mm = MobManager.getInstance()
		// mm.createMob(new Unit(10,10,10,1,1,1,scene,[0,1],[-1,3]))
		// mm.createMob(new Unit(10,10,10,1,1,1,scene,[0,1],[3,5]))
		animate()
	} else {
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementById("container").appendChild(warning);
	}

}


window.onload = main;
export {scene}