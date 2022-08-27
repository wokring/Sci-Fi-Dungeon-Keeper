import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import { CreateWorld } from "../modules/create_world.js"
import { MapTile } from "../modules/MapTile.js"
import WebGL from "../js/WebGL.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load( '../textures/mush.png' );
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);
function animate() {
    requestAnimationFrame(animate);
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
    console.log(obj2.position.y)
    renderer.render(scene, camera);
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.add(cube);
    scene.add(cube2);
    camera.position.z = 5;
    
    MapTile.scene = scene;
    CreateWorld();

//     const grid = [
//         [null, null],
//         [null, null]
//     ];
//     const roomTree = new RoomTree(2, 2, grid);
//     roomTree.makeRoot = 1;
//     console.log(grid[0][1]);
//     roomTree.root.addRoom(grid, 2, null);
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
