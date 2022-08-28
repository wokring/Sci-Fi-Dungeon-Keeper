
import WebGL from "../js/WebGL.js";
import {init_gui,camera,disableGUI,modifyPower} from "../modules/gui.js"
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

var tLeftGivePower = 3;
var tLeftPerPower = 3;
function animate() {
	var deltaTime = clock.getDelta();
	
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if(!youLose)
	{
		tLeftGivePower -= deltaTime;
		if(tLeftGivePower <= 0)
		{
			tLeftGivePower = tLeftPerPower;
			modifyPower(10);
		}
		
		mobManager.Update(deltaTime);
		waveManager.Update(deltaTime);
	}
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

var youLose = false;
function GameOver()
{
	youLose = true;
	disableGUI();

	var plane = new THREE.PlaneGeometry(8, 4);
	var PS_tex = new THREE.TextureLoader().load( '../sprites/youlose.png' );
	PS_tex.magFilter = THREE.NearestFilter
	var PS_mt= new THREE.MeshBasicMaterial({ map: PS_tex });
	PS_mt.transparent = true;
	var gameover = new THREE.Mesh(plane, PS_mt);
	gameover.position.x = 0;
	gameover.position.z = 0.1;
	gameover.position.y = 0;
	scene.add(gameover);
}

window.onload = main;
export {scene,renderer,clock,GameOver};
