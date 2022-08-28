const ATTACK = [3,10,10];
const HEALTH = [15,10,50];
const TEX = ["../sprites/romba.png","../sprites/drone.png","../sprites/blow.png"];

class Ally{
    constructor(scene,type,x,y) {
        this.attack = ATTACK[type];
        this.health = HEALTH[type];
        this.scene = scene;
        this.plane = null;
        this.makeSprite(x,y,TEX[type])
        scene.add(this.plane)
        console.log(this.health);
    }

    makeSprite(x,y,path) {
		const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const A_tex = new THREE.TextureLoader().load( path );
        A_tex.magFilter = THREE.NearestFilter
        const A_mt= new THREE.MeshBasicMaterial({ map: A_tex });
        A_mt.transparent = true;
        const A = new THREE.Mesh(geometry, A_mt);
        A.position.x = x-3;
        A.position.z = 3;
        A.position.y = y-3;
        this.plane = A;
        this.scene.add(A)
	}

    destroy() {
		this.scene.remove(this.plane);
	}

    changeSprite() {
		this.plane.material.color.setHex( 0xff0000 );
		setTimeout(function () {
			this.plane.material.color.setHex( 0xffffff )
		}.bind(this),500);
	}



}

export {Ally};