import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import WebGL from "../js/WebGL.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);
function animate() {
    requestAnimationFrame(animate);
    var obj = cube;
    var obj2 = cube2;
    obj2.position.x = -2
    obj2.position.y = 2
    var angle = Math.atan((obj2.position.x - obj.position.x)/(obj2.position.y - obj.position.y));
    if (Math.abs(obj2.position.x - obj.position.x) > 0.1) {
        obj.position.x += 0.01 * Math.cos(angle);
        obj.position.y += 0.01 * Math.sin(angle);
    }
    console.log(obj2.position.x - obj.position.x)
    console.log(obj2.position.y - obj.position.y)
    
    // obj.position.x += 0.01;
    // obj.position.y += 0.01;
    renderer.render(scene, camera);
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.add(cube);
    camera.position.z = 5;

    const roomTree = new RoomTree(5, 5);
    if (WebGL.isWebGLAvailable()) {
        animate();
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById("container").appendChild(warning);
    }
}

window.onload = main;
