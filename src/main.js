import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import WebGL from "../js/WebGL.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

function animate() {
    requestAnimationFrame(animate);
    var obj = cube;
    obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.add(cube);
    camera.position.z = 5;

//     const grid = [
//         [null, null],
//         [null, null]
//     ];
//     const roomTree = new RoomTree(2, 2, grid);
//     roomTree.makeRoot = 1;
//     console.log(grid[0][1]);
//     roomTree.root.addRoom(grid, 2, null);
    if (WebGL.isWebGLAvailable()) {
        animate();
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById("container").appendChild(warning);
    }
}

window.onload = main;
