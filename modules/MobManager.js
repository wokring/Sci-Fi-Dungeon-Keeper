import {DungeonFactory} from '../modules/DungeonLayout.js'
import {Unit} from '../modules/Unit.js'
import {PathHelper} from "./PathHelper.js"
import {scene} from "../src/main.js"
import {playSound} from "../modules/SoundPlayer.js";

class MobManager {
	constructor() {
		this.allMobs = new Array();
	}
	init(scene)
	{
		//this.createEntranceMob();
	}
	createMobAt(startRoom)
	{
		var newMob = new Unit(scene, startRoom);
		this.allMobs.push(newMob);
		return newMob;
	}
	createEntranceMob()
	{
		var newMob = new Unit(scene, PathHelper.entranceRoom);
		this.allMobs.push(newMob);
		newMob.PathToTreasure();
		playSound("../sfx/EnemySpawn.wav");
		return newMob;
	}
	getClosest(unit) {
		if (this.mobs.length < 1) {
			return [null, 0, 0, 0];
		} else {
			return this.mobs[Math.floor(Math.random() * this.mobs.length)];
		}
	}

	Update(d_time)
	{
		for (var i=0; i < this.allMobs.length; i++)
		{
			var mob = this.allMobs[i];
			//console.log(mob);
			mob.Update(d_time);
		}
	}
}

const mobManager = new MobManager();


export {mobManager};
