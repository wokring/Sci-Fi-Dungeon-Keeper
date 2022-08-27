import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import { CreateWorld } from "../modules/create_world.js"
import { UIBuildRoom } from "../modules/UIBuildRoom.js"
import { MapTile } from "../modules/MapTile.js"
import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"
import WebGL from "../js/WebGL.js";
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import { MobManager } from "../modules/MobManager.js"
import { Unit } from "../modules/Unit.js"

let camera,aspect,scene,renderer,gui,ghostPlane;
let CP_ctx,PT_ctx,CP_t,PT_t;
const plane05_1 = new THREE.PlaneGeometry( 1, 0.5 );

const CLOCK = new THREE.Clock()
const CAMERA_HIDDEN_Z = 100;
const GHOST_BUILD_Z = 3;
const frustumSize = 10;
var mx = 0;
var my = 0;

let roomBuild = false;
var mouse_down = false;

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
		for (let i =0; i < 6; i++){
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

function create_context(color){

    var context= document.createElement("canvas").getContext("2d");  
    context.canvas.height = 200;
    context.canvas.width = 400;
    context.clearRect(0, 0, 400, 200);
    context.fillStyle = color;
    context.font = "bold 140px Arial";
    context.fillText("223",0,200);
    return context

}
function update_text(new_text, old_text, texture){
    old_text.clearRect(0, 0, 400, 200);
    old_text.fillText(new_text,10,200);
    texture.needsUpdate = true;
}

function init_gui(){
    const bar = new THREE.Mesh(new THREE.PlaneGeometry( 10, 1 ), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    bar.position.y += -4;
    bar.position.z += 3;

    CP_ctx = create_context("blue")
    CP_t = new THREE.CanvasTexture(CP_ctx.canvas)
    var CP_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: CP_t, }));
    CP_tp.material.transparent = true;
    CP_tp.position.x -= 4.3;
    CP_tp.position.z += 3;
    CP_tp.position.y += 2.6;

    PT_ctx = create_context("blue")
    PT_t = new THREE.CanvasTexture(PT_ctx.canvas)
    var PT_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: PT_t, }));
    PT_tp.material.transparent = true;
    PT_tp.position.x -= 4.3;
    PT_tp.position.z += 3;
    PT_tp.position.y += 3.1;

    const icon = new THREE.PlaneGeometry(0.5, 0.5);
    const CB_tex = new THREE.TextureLoader().load( '../sprites/circuit_board.png' );
    const CB_mt = new THREE.MeshBasicMaterial({ map: CB_tex });
    CB_mt.transparent = true;
    const circuit_board = new THREE.Mesh(icon, CB_mt);
    circuit_board.position.x = -5;
    circuit_board.position.y = 2.5;
    circuit_board.position.z= 3;

    const PT_tex = new THREE.TextureLoader().load( '../sprites/power_thing.png' );
    const PT_mt= new THREE.MeshBasicMaterial({ map: PT_tex });
    PT_mt.transparent = true;
    const power_thing = new THREE.Mesh(icon, PT_mt);
    power_thing.position.x = -5;
    power_thing.position.z = 3;
    power_thing.position.y = 3;
    
    scene.add(power_thing);
    scene.add(PT_tp);
    scene.add(circuit_board);
    scene.add(CP_tp);
    scene.add(bar);
   
    gui = [null,null,null,null,null,null];
    gui[0] = camera;
    gui[1] = bar;
    gui[2] = power_thing;
    gui[3] = PT_tp;
    gui[4] = circuit_board;
    gui[5] = CP_tp;

}

function init(){

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    MapTile.scene = scene;
    aspect = window.innerWidth / window.innerHeight;
        
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.z = 5;

    ghostPlane = new THREE.Mesh(new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1 }));
    ghostPlane.position.z = CAMERA_HIDDEN_Z;

    scene.add(ghostPlane);
    init_gui()
    
    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown',onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function main() {
	init()
    CreateWorld();
    
	if (WebGL.isWebGLAvailable()) {
		animate();
	} else {
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementById("container").appendChild(warning);
	}
}

window.onload = main;
export {scene}