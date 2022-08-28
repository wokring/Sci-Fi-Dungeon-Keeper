import {mobManager} from './MobManager.js'
import {PathHelper} from './PathHelper.js'
import {DungeonRooms} from "./DungeonLayout.js"
import {WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y} from "../modules/DungeonLayout.js"
import {modifyPower, camera} from "../modules/gui.js";
import {playSound} from "../modules/SoundPlayer.js";


const UNIT_SPRITE_WIDTH = 0.7;
const UNIT_SPRITE_HEIGHT = 0.7;
const UNIT_Z = 3;

const MOBSTATE_NONE = 0
const MOBSTATE_TREASUREHUNTING = 1;
const MOBSTATE_ESCAPE = 2;
const MOBSTATE_COMPAT = 3;

const WANDER_CHANCE = 0.33;

var hit_audio = new Audio('../sfx/EnemyHit.wav');
var kill_audio = new Audio('../sfx/EnemyDie.wav');
var escape_audio = new Audio('../sfx/EnemyGetAwayWithPower.wav');

class Unit {
	static nextId = 1;
	constructor(scene, startDungeonRoom, attack = 5, health =10)
	{
		this.id = Unit.nextId++;
		this.health = 5;
        this.attack = attack;
		this.makeSprite()
		this.scene = scene;
		scene.add(this.plane)
		this.mobState = MOBSTATE_NONE;
		//this.currentPath = new Array();
		this.dungeonRoom = startDungeonRoom;
		//console.log(startDungeonRoom);
		this.setPosition(startDungeonRoom.myWorldCoords);
		startDungeonRoom.onMobEnter(this);
		this.currentMoveTarget = null;
		this.maxSpeed = 1;
		this.isEnemy = true;
	}
	PathToTreasure()
	{
		this.mobState = MOBSTATE_TREASUREHUNTING;
		//this.currentPath = PathHelper.GetPathToTreasure(this.dungeonRoom);
		//this.nextPathTarget = this.currentPath[0];
		//console.log("treasurehunting");
			
	}
	PathToEntrance()
	{
		this.mobState = MOBSTATE_ESCAPE;
		//this.currentPath = PathHelper.GetPathToEntrance(this.dungeonRoom);
		//this.nextPathTarget = this.currentPath[0];
	}
	Update(deltaTime)
	{
		//console.log("mob #" + this.id + " mobState:" + this.mobState);
		if(this.health <= 0)
		{
			return;
		}
		switch(this.mobState)
		{
			case MOBSTATE_TREASUREHUNTING:
			{
				//do we need to get a new movement vector?
				if(this.currentMoveTarget == null)
				{
					//get the updated move target
					if(Math.random() > WANDER_CHANCE)
					{					
						this.currentMoveTarget = this.dungeonRoom.getTreasureMoveTarget();
					}
					else
					{
						this.currentMoveTarget = this.dungeonRoom.getWanderMoveTarget();
					}
					
					//if we still cant get a move target, then stop pathing
					if(this.currentMoveTarget == null)
					{
						//console.log("couldn't find path");
						this.mobState = MOBSTATE_NONE;
						return;
					}
				}
				
				//construct the movement vector
				var moveVector = new THREE.Vector2(this.currentMoveTarget.x - this.plane.position.x,
					this.currentMoveTarget.y - this.plane.position.y);
				moveVector.normalize();
				
				//move the mob
				this.plane.position.x += moveVector.x * deltaTime * this.maxSpeed;
				this.plane.position.y += moveVector.y * deltaTime * this.maxSpeed;
				
				//handle on mob entry and exit triggers
				var curRoom = this.getQuantizedRoom();
				if(curRoom !== this.dungeonRoom)
				{
					this.dungeonRoom.onMobExit(this);
					this.dungeonRoom = curRoom;
					this.dungeonRoom.onMobEnter(this);
				}
				
				//how far to our next path node?
				var sqrDist = this.getSqrdDist(this.currentMoveTarget);
				//console.log("sqrDist to current target:" + sqrDist);
				
				//handle pathing
				if(sqrDist <= 0.01)
				{
					if(this.dungeonRoom.dist_to_treasure === 0)
					{
						//console.log("reached treasure");
						this.mobState = MOBSTATE_ESCAPE;
					}
					
					//this.invalidateCurrentMoveTarget();
					if(this.dungeonRoom != null)
					{
						if(Math.random() > WANDER_CHANCE)
						{					
							this.currentMoveTarget = this.dungeonRoom.getTreasureMoveTarget();
						}
						else
						{
							this.currentMoveTarget = this.dungeonRoom.getWanderMoveTarget();
						}
					}
					
					//have we got more path nodes to get to?
					if(this.currentMoveTarget != null)
					{
						sqrDist = this.getSqrdDist(this.currentMoveTarget);
						/*console.log("arrived, next:" + this.currentMoveTarget.x + ","
							+ this.currentMoveTarget.y
							+ " sqrDist:" + sqrDist
							+ " remaining:" + this.dungeonRoom.dist_to_treasure);*/
					}
					else
					{
						//console.log("finished pathing");
						this.mobState = MOBSTATE_NONE;
					}
				}
			}
            break;
            case MOBSTATE_COMPAT:
                this.changeSprite();
                this.mobState = this.dungeonRoom.combat(this);
		}
	}
	/*getCurrentMoveTarget()
	{
		if(this.currentPath.length > 0)
		{
			return this.currentPath[0].myWorldCoords;
		}
	}*/
	/*invalidateCurrentMoveTarget()
	{
		if(this.currentPath.length > 0)
		{
			this.currentPath.shift();
		}
	}*/
	getQuantizedRoom()
	{
		var x = this.plane.position.x + UNIT_SPRITE_WIDTH/2;
		if(x > WORLD_MAX_X)
		{
			x = WORLD_MAX_X;
		}
		else if(x < WORLD_MIN_X)
		{
			x = WORLD_MIN_X;
		}
		
		var y = this.plane.position.y + UNIT_SPRITE_HEIGHT/2;
		if(y > WORLD_MAX_Y)
		{
			y = WORLD_MAX_Y;
		}
		else if(y < WORLD_MIN_Y)
		{
			y = WORLD_MIN_Y;
		}
		
		x = Math.floor(x - WORLD_MIN_X);
		y = Math.floor(y - WORLD_MIN_Y);
		//console.log(x + "," + y);
		return DungeonRooms[x][y];
	}
	getSqrdDist(otherPos)
	{
		return (this.plane.position.x - otherPos.x) * (this.plane.position.x - otherPos.x) + 
			(this.plane.position.y - otherPos.y) * (this.plane.position.y - otherPos.y);
	}
	getPosition()
	{
		return new THREE.Vector2(this.plane.position.x, this.plane.position.y);
	}
	setPosition(value) {
		//this._position = value;
		this.plane.position.x = value.x;
		this.plane.position.y = value.y;
	}
	makeSprite() {
        const geometry = new THREE.PlaneGeometry(UNIT_SPRITE_WIDTH, UNIT_SPRITE_HEIGHT);
        const A_tex = new THREE.TextureLoader().load( "../sprites/units.png" );
        A_tex.magFilter = THREE.NearestFilter
        const A_mt= new THREE.MeshBasicMaterial({ map: A_tex });
        A_mt.transparent = true;
        this.plane = new THREE.Mesh(geometry, A_mt);		
		this.plane.position.z = UNIT_Z;
	}
	takeDamage(damage)
	{
		this.health -= damage;
		if(this.health <= 0)
		{
			this.destroy();
		}
	}
	changeSprite() {
		this.plane.material.color.setHex( 0xff0000 );
		setTimeout(function () {
			this.plane.material.color.setHex( 0xffffff )
		}.bind(this),500);
	}

	destroy() {
		modifyPower(5);
		this.mobState = MOBSTATE_NONE;
		this.scene.remove(this.plane);
		playSound('../sfx/EnemyDie.wav');
	}

    resetDebuff() {
        this.debuff = [1, 1]
    }
    finishFight() {
        this.resetDebuff()
        this.fighting = false
    }
    connectedHit() {
        this.cooldown = this.interval * 1000
    }
    doCombat(d_time) {
    }
    
}

class EnemyUnit extends Unit {
    constructor(cost, health, damage, interval, speed, range, room, pos = [0,0], level = 1, dodge_chance) {
        super(cost, health, damage, interval, speed, range, room, level);
        this.dodge = dodge_chance; // dodge chance is the scaling on the trap chance some units have.
        this.last_direction = null;
    }
}

export {Unit, EnemyUnit};
