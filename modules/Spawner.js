import {Unit} from "../modules/Unit.js"
import {mobManager} from "../modules/MobManager.js";
import {scene} from "../src/main.js"

class Spawner{
    constructor(room, unitTemplate, spawnSpan, spawnLimit,x, y) {
        this._room = room;
        this._template = unitTemplate;
        this._units = [];

        const spawner_tex = new THREE.TextureLoader().load( '../sprites/spawner.png' );
        spawner_tex.magFilter = THREE.NearestFilter
        const spawner_mt= new THREE.MeshBasicMaterial({ map: spawner_tex });
        spawner_mt.transparent = true;
        const plane = new THREE.PlaneGeometry(0.6, 0.6);
        const spawner = new THREE.Mesh(plane, spawner_mt);
        spawner.position.x = x;
        spawner.position.y = y;
        spawner.position.z = 0;
        this.sprite = spawner;

        this._spawnSpan = spawnSpan;
        this._timeUntilNextSpawn = spawnSpan;
        this._spawnLimit = spawnLimit;
        this.spawn();
    }
    get units() {
        return this._units;
    }
    get room(){
        return this._room;
    }

    status() {
        //Check all units status right now
        let og_length = this._units.length;
        this._units = this._units.filter(unit => unit.health > 0);
        //If the spawnLimit has been reached, maintain the timer at maximum.
        //Or else we will continue the updates
        //console.log(this);
        if (this._units.length < this._spawnLimit) {
            //Update timer on unit kills
            //If the original unit count is equal to the spawn limit
            //Reset the timer to spawn
            if (this._spawnLimit - og_length === 0) {
                this._timeUntilNextSpawn = this._spawnSpan;
            }
            this._timeUntilNextSpawn--;
            if (this._timeUntilNextSpawn === 0) {
                //console.log(this);
                this.spawn();
                this._timeUntilNextSpawn = this._spawnSpan;
            }
        }
    }


    spawn() {
        //Check it reach spawn limit or not
        if (this._spawnLimit - this._units.length > 0) {
        	/*
            //console.log(this._template);
            // let mob = new Unit(...this._template);
            let mob = MobManager.getInstance().createMob(new Unit(10,10,10,1,1,1,scene,[0,1],[3,5]));
            //console.log(mob);
            this._units.push(mob);
            //fight()
            return mob;
            */
        } else {}
    }
}


class SpawnManager{
    constructor() {
        this._spawns = [];
        //Check the status of all spawn every second
        //Or we can call the function when needed
        this._intervalID = setInterval(this.status.bind(this), 1000);
    }

    addSpawn(spawn) {
        this._spawns.push(spawn);
    }

    status(){
        //Check the status of each spawn in the manager
        this._spawns.forEach(spawn => spawn.status());
    }
}
export {Spawner, SpawnManager}
