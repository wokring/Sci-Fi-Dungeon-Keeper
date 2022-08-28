
import WebGL from "../js/WebGL.js";
import {init_gui,camera} from "../modules/gui.js"
import { CreateWorld } from "../modules/create_world.js"
import {mobManager} from "../modules/MobManager.js"
import {waveManager} from "../modules/WavesManager.js"

const clock = new THREE.Clock();
let scene,renderer

function init(){
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();

    const BG_tex = new THREE.TextureLoader().load( '../sprites/BG.png' );
    BG_tex.magFilter = THREE.NearestFilter
    scene.background = BG_tex

	renderer.setSize(window.innerWidth, window.innerHeight);
	CreateWorld();

	mobManager.init(scene);
	
	//waveManager = new WaveManager();
	waveManager.init();

	init_gui()
    
}

function animate() {
	var deltaTime = clock.getDelta();
	
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	mobManager.Update(deltaTime);
	waveManager.Update(deltaTime);
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
