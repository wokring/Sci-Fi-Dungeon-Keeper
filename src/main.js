import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import WebGL from "../js/WebGL.js"; 
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

var cube;

var mx = 0;
var my = 0;
var mouse_down = false;

function animate() {
    requestAnimationFrame(animate);

    if (test){
        ghost.position.x = Math.ceil(mx - 0.5);
        ghost.position.y = Math.ceil(my - 0.5);
    }
    var obj = cube;
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
    cube = create_plane(1,0);
    scene.add(cube);
    scene.add(create_plane(1,3));
    scene.add(create_plane(2,0));

    if (WebGL.isWebGLAvailable()) {
        animate();
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById("container").appendChild(warning);
    }
}


window.onload = main;
