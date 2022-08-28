import {scene,renderer} from "../src/main.js"

import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import { Trap } from "../modules/Trap.js"
import { mobManager } from "../modules/MobManager.js"
import { Unit } from "../modules/Unit.js"
import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import {DungeonRooms} from "../modules/DungeonLayout.js"
import { MapTile } from "../modules/MapTile.js"
import { UIBuildRoom } from "../modules/UIBuildRoom.js"
import { Ally } from "./Ally.js";
import {playSound} from "../modules/SoundPlayer.js";

const ROOM_COSTP = [1000,5,3,4,1,2,3,4,5,100]
//const ROOM_COSTC = [1000,10,3,4,3,2,3,4,5,50]
const ROOM_COSTC = [1000,0,0,0,0,0,0,0,0,0]
let camera,aspect,gui,ghostPlane;
let CP_ctx,PT_ctx,CP_t,PT_t;
const plane05_1 = new THREE.PlaneGeometry( 1, 0.5 );

var mx = 0;
var my = 0;

const CAMERA_HIDDEN_Z = 100;
const GHOST_BUILD_Z = 4;
const frustumSize = 10;

var power = 100;
var circuit = 20;

// var ROOM_COSTP = 10
// var ROOM_COSTC = 2

let Build = false;
var buildType = 0;
var mouse_down = false;

function create_context(color,text){

    var context= document.createElement("canvas").getContext("2d");  
    context.canvas.height = 200;
    context.canvas.width = 400;
    context.clearRect(0, 0, 400, 200);
    context.fillStyle = color;
    context.font = "bold 140px Arial";
    context.fillText(text,0,200);
    return context
}

function update_text(new_text, old_text, texture){
    old_text.clearRect(0, 0, 400, 200);
    old_text.fillText(new_text,10,200);
    texture.needsUpdate = true;
}

function init_gui(){

    aspect = window.innerWidth / window.innerHeight;
        
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.z = 5;

    ghostPlane = new THREE.Mesh(new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1 }));
    ghostPlane.position.z = CAMERA_HIDDEN_Z;
    scene.add(ghostPlane);

    playSound("../sfx/CombatMusic.mp3", true);

    const bar_tex = new THREE.TextureLoader().load( '../sprites/bar.png' );
    bar_tex.magFilter = THREE.NearestFilter
    const bar_mt = new THREE.MeshBasicMaterial({ map: bar_tex });
    bar_mt.transparent = true;
    const bar = new THREE.Mesh(new THREE.PlaneGeometry( 10, 1.5 ), bar_mt);
    bar.position.y += -4;
    bar.position.z += 3;

    CP_ctx = create_context("blue",circuit.toString())
    CP_t = new THREE.CanvasTexture(CP_ctx.canvas)
    var CP_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: CP_t, }));
    CP_tp.material.transparent = true;
    CP_tp.position.x -= 4.3;
    CP_tp.position.z += 3;
    CP_tp.position.y += 2.6;

    PT_ctx = create_context("blue",power.toString())
    PT_t = new THREE.CanvasTexture(PT_ctx.canvas)
    var PT_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: PT_t, }));
    PT_tp.material.transparent = true;
    PT_tp.position.x -= 4.3;
    PT_tp.position.z += 3;
    PT_tp.position.y += 3.1;

    const icon = new THREE.PlaneGeometry(0.5, 0.5);
    const CB_tex = new THREE.TextureLoader().load( '../sprites/circuit_board.png' );
    CB_tex.magFilter = THREE.NearestFilter
    const CB_mt = new THREE.MeshBasicMaterial({ map: CB_tex });
    CB_mt.transparent = true;
    const circuit_board = new THREE.Mesh(icon, CB_mt);
    circuit_board.position.x = -5;
    circuit_board.position.y = 2.5;
    circuit_board.position.z= 3;

    const PT_tex = new THREE.TextureLoader().load( '../sprites/power_thing.png' );
    PT_tex.magFilter = THREE.NearestFilter
    const PT_mt= new THREE.MeshBasicMaterial({ map: PT_tex });
    PT_mt.transparent = true;
    const power_thing = new THREE.Mesh(icon, PT_mt);
    power_thing.position.x = -5;
    power_thing.position.z = 3;
    power_thing.position.y = 3;
    
    update_text(power.toString(),PT_ctx,PT_t);
    update_text(circuit.toString(),CP_ctx,CP_t);
	
    scene.add(power_thing);
    scene.add(PT_tp);
    //scene.add(circuit_board);
    //scene.add(CP_tp);
    scene.add(bar);
   
    gui = [null,null,null,null,null,null];
    gui[0] = camera;
    gui[1] = bar;
    gui[2] = power_thing;
    gui[3] = PT_tp;
    gui[4] = circuit_board;
    gui[5] = CP_tp;


    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown',onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseDown( event ) {
	mouse_down = true;    

	if(Build === true)
	{

        if (power >= ROOM_COSTP[buildType] && circuit >= ROOM_COSTC[buildType] && buildType > 0)
        {
		var x = mx-WORLD_MIN_X;
		var y = my-WORLD_MIN_Y;
		var buildSuccess = false;
		switch(buildType)
		{
			case 1:
				buildSuccess = UIBuildRoom(buildType, new THREE.Vector2(x,y));
				playSound("../sfx/BuildRoom.wav");
				break;
			case 3:
				var room = DungeonRooms[x][y];
				if (room.isBuilt && room.trap == null){
				room.trap = new Spawner(room, [(scene, room)], 40, 4,x -3 ,y -3);
				scene.add(room.trap.sprite)
				buildSuccess = true;
				}
				playSound("../sfx/BuildTrap.wav");
				break;
			case 4:
				var room = DungeonRooms[x][y];
				if(!room.isBuilt)
				{
					console.log("Notice: Cannot build trap there, the room there is not built.");
					break;
				}
				if (room.trap != null)
				{
					console.log("Notice: Cannot build trap there, already another trap present");
					break;
				}
				room.trap = new Trap(3,3,x -3 ,y -3, room);
				scene.add(room.trap.sprite)
				buildSuccess = true;
				playSound("../sfx/BuildTrap.wav");
				break;
            case 5:
                room = DungeonRooms[x][y];
		        if (!room.isBuilt)
                {
                    console.log("Notice: Cannot build trap there.");
                    break;
                }
                if (!room.add_ally(scene,1,x,y))
                {
                    console.log("Notice: nor room");
                    break;
                }
                buildSuccess = true;
                break;
            case 6:
                room = DungeonRooms[x][y];
		        if (!room.isBuilt)
                {
                    console.log("Notice: Cannot build trap there.");
                    break;
                }
                if (!room.add_ally(scene,0,x,y))
                {
                    console.log("Notice: nor room");
                    break;
                }
                buildSuccess = true;
                break;
            case 9:
                room = DungeonRooms[x][y];
		        if (!room.isBuilt)
                {
                    console.log("Notice: Cannot build trap there.");
                    break;
                }
                if (!room.add_ally(scene,2,x,y))
                {
                    console.log("Notice: nor room");
                    break;
                }
				buildSuccess = true;
				break;

		}
            if(buildSuccess)
            {
                console.log(buildType);
                power -= ROOM_COSTP[buildType];
                // circuit -= ROOM_COSTC[buildType];
            }
        }
        //exit room construction mode
        buildType = 0;
        Build = false
        ghostPlane.position.z = CAMERA_HIDDEN_Z;
        update_text(power.toString(),PT_ctx,PT_t);
        // update_text(circuit.toString(),CP_ctx,CP_t);
        
	}
    
}
function onDocumentMouseUp( event ) {
    mouse_down = false;
}
function onDocumentMouseMove(event) {
	event.preventDefault();
	//update the coordinates of the "mouse over" room
	mx = Math.ceil(camera.position.x + aspect * frustumSize *((event.clientX/window.innerWidth)*2 -1) * 0.5 - 0.4);
	my = Math.ceil(camera.position.y + -frustumSize *((event.clientY/window.innerHeight)*2 -1) * 0.5 - 0.4);
	
	//boundary checks
	if(mx < WORLD_MIN_X)
	{
		mx = WORLD_MIN_X;
	}
	else if(mx > WORLD_MAX_X)
	{
		mx = WORLD_MAX_X;
	}
	if(my < WORLD_MIN_Y)
	{
		my = WORLD_MIN_Y;
	}
	else if(my > WORLD_MAX_Y)
	{
		my = WORLD_MAX_Y;
	}

	//click and drag the map around
	if (mouse_down){
		for (let i =0; i < gui.length; i++){
			if (gui[i] != null){
				gui[i].position.x -= event.movementX * 0.01;
				gui[i].position.y += event.movementY * 0.01;
			}
		}
	}
	
	//update the position of the construction ghost
	if (Build === true){
		ghostPlane.position.x = mx;
		ghostPlane.position.y = my;
	}
}

function onDocumentKeyDown(event) {
    ghostPlane.position.x = mx;
    ghostPlane.position.y = my;
    
    //press 'a' to go into room construction mode, and create a construction ghost
    //this is a visual effect which follows the cursor
    switch(event.key) {
        case "a":
            //room
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 1;
            break;
        case "v":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 4;
            break;
        case "e":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 3;
            break;
        case "f":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 9;
            break;
        case "k":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 5;
            break;
        case "i":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 6;
            break;
        default:
            break;
    }
}

function modifyPower(powermod)
{
	power += powermod
	update_text(power.toString(),PT_ctx,PT_t);
}
function modifyCircuits(circuitmod)
{
	power += circuitmod
        update_text(circuit.toString(),CP_ctx,CP_t);
}
//update_text(circuit.toString(),CP_ctx,CP_t);

export {init_gui,camera,aspect,frustumSize,modifyPower,modifyCircuits};
