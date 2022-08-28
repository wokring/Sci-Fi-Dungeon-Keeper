import {mobManager} from './MobManager.js'

class WaveManager
{
	constructor()
	{
		this.waveNum = 0;
		this.tLeftWave = 1;
		this.tBetweenWaves = 3;

		this.spawnsPerWave = 6 ;
		this.tLeftSpawn = 0;
		this.tBetweenSpawn = 0.75;
		this.spawnsLeft = 0;
	}
	init()
	{
	}
	Update(deltaTime)
	{
		this.tLeftWave -= deltaTime;
		//console.log("time left to next wave: " + this.tLeftWave);
		if(this.tLeftWave <= 0)
		{
			//spawn a wave
			this.waveNum++;
			this.tLeftWave = this.tBetweenWaves;
			this.spawnWave();
		}
		if(this.spawnsLeft > 0)
		{
			this.tLeftSpawn -= deltaTime;
			if(this.tLeftSpawn <= 0)
			{
				//spawn a mob in this wave
				this.tLeftSpawn = this.tBetweenSpawn;
				this.spawnMob();
				this.spawnsLeft--;
				//console.log("spawning mob, " + this.spawnsLeft + " remaining");
			}
		}
	}
	spawnWave()
	{
		//console.log("spawning wave: " + this.waveNum);
		this.spawnsLeft += this.spawnsPerWave + this.waveNum;
	}
	spawnMob()
	{
		mobManager.createEntranceMob();
	}
}

const waveManager = new WaveManager();

export {waveManager};
