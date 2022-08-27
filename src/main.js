
import WebGL from "../js/WebGL.js";
import {init_gui,camera} from "../modules/gui.js"
import { CreateWorld } from "../modules/create_world.js"
import { mobManager } from "../modules/MobManager.js"

const clock = new THREE.Clock();
let scene,renderer

function init(){
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);
	CreateWorld();

	mobManager.init(scene);

	init_gui()
    
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mobManager.Update(clock.getDelta());
}

function main() {
	init()
    
	if (WebGL.isWebGLAvailable()) {
		animate();
	} else {
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementById("container").appendChild(warning);
	}
}

window.onload = main;
export {scene,renderer,clock};
