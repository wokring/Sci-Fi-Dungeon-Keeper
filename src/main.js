import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import { CreateWorld } from "../modules/create_world.js"
import { MapTile } from "../modules/MapTile.js"
import WebGL from "../js/WebGL.js";
import {Spawner, SpawnManager} from "../modules/Spawner.js";

const frustumSize = 10;
let camera,aspect,scene,renderer,gui;
let ghost;
var test = false;

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
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(bar);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown',onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    
}

const plane1_1 = new THREE.PlaneGeometry( 1, 1 );

function create_plane( x, y){
    var plane =  new THREE.Mesh(plane1_1, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    plane.position.x = x;
    plane.position.y = y;
    return plane;
}

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

    if (test){
        ghost.position.x = Math.ceil(mx - 0.5);
        ghost.position.y = Math.ceil(my - 0.5);
    }
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
    if (test){
        test = false;
        ghost = null

    }
}
function onDocumentMouseUp( event ) {
    mouse_down = false;
}
function onDocumentMouseMove(event) {
    event.preventDefault();
    if (mouse_down){
        for (let i =0; i < 4; i++){
            if (gui[i] != null){
                gui[i].position.x -= event.movementX * 0.01;
                gui[i].position.y += event.movementY * 0.01;
            }
        }        
    }
    mx = camera.position.x + aspect * frustumSize *((event.clientX/window.innerWidth)*2 -1) * 0.5;
    my = camera.position.y + -frustumSize *((event.clientY/window.innerHeight)*2 -1) * 0.5;
}
function onDocumentKeyDown(event) {
    if (event.key == 'a' && !test){
        test = true;
        ghost = create_plane(0,0);
        ghost.material.opacity = 0.1;
        ghost.position.z = 3;
        scene.add(ghost);
    }
}

function main() {
    init()
    scene.add(cube);

    scene.add(create_plane(1,3));
    scene.add(create_plane(2,0));

    scene.add(cube2);
    MapTile.scene = scene;
    CreateWorld();

    const room1 = "room1";
    const room2 = "room2";
    const info1 = [1, 2, 3, 4, 5, 6, room1, [0,0],1];
    const info2 = [1, 2, 3, 4, 5, 6, room2, [0,0],1];
    const s1 = new Spawner(room1,info1, 5, 2);
    const s2 = new Spawner(room2,info2, 2, 3);
    const manager = new SpawnManager();
    manager.addSpawn(s1);
    manager.addSpawn(s2);



    if (WebGL.isWebGLAvailable()) {
        cube2.position.x = -2
        cube2.position.y = -2
        animate();
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById("container").appendChild(warning);
    }
}


window.onload = main;
