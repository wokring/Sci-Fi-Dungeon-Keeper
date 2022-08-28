import {MapTile} from "./MapTile.js"
import {WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y,DungeonRooms} from "../modules/DungeonLayout.js"
import {scene} from "../src/main.js";
import {modifyPower} from "../modules/gui.js"

const NORTH = 1;
const SOUTH = 2;
const EAST = 4;
const WEST = 8;

const FLOOR_A = 1;
const FLOOR_B = 2;
const FLOOR_C = 3;
const FLOOR_D = 4;

var steal_audio = new Audio('../sfx/EnemyStealPower.wav');

class DungeonRoom
{
	static nextId = 1;
	constructor(dungeonIndex)
	{
		this.myDungeonIndex = dungeonIndex;
		this.myWorldCoords = new THREE.Vector2(dungeonIndex.x + WORLD_MIN_X, dungeonIndex.y + WORLD_MIN_Y);
		this.isBuilt = false;
		this.id = DungeonRoom.nextId++;
        
		this.units_present = [];
		this.trap = null;
		this.spawn = [];
		this.texture = [];
		this.sprite = null;
		this.dist_to_treasure = 99999;
	}
	CreateMapTiles()
	{
		//play sfx for build success
		this.isBuilt = true;

		let room_tex = new THREE.TextureLoader().load( '../sprites/room.png' );
		if (this.myDungeonIndex.x == 0 && this.myDungeonIndex.y == 3) {
			room_tex = new THREE.TextureLoader().load( '../sprites/spawn_room.png' );
		} else if (this.myDungeonIndex.x === 4 && this.myDungeonIndex.y === 4) {
			room_tex = new THREE.TextureLoader().load( '../sprites/trophy_room.png' );
		}
		
		room_tex.magFilter = THREE.NearestFilter
        const room_mt= new THREE.MeshBasicMaterial({ map: room_tex });
        room_mt.transparent = true;
        const plane = new THREE.PlaneGeometry(1, 1);
        const room = new THREE.Mesh(plane, room_mt);
        room.position.x = this.myWorldCoords.x;
        room.position.y = this.myWorldCoords.y;
        room.position.z = -1;
        this.sprite = room;
		scene.add(this.sprite);
	}
	getTreasureMoveTarget()
	{
		//console.log("getTreasureMoveTarget");
		//are we the treasure room?
		if(this.dist_to_treasure === 0)
		{
			return
		}
		
		//grab the adjacent rooms
		var adjRooms = this.getAdjacentRooms();
		if(adjRooms.length === 0)
		{
			//todo: error checking
			return;
		}
		
		//find which one has the lowest dist
		var closeRoom = null;
		for(var i=0; i<adjRooms.length; i++)
		{
			var checkRoom = adjRooms[i]
			if(closeRoom == null)
			{
				//we dont have a target yet
				closeRoom = checkRoom;
			}
			else if(checkRoom.dist_to_treasure < closeRoom.dist_to_treasure)
			{
				//this next room is closer than the previous one we checked
				closeRoom = checkRoom;
			}
		}
		return closeRoom.myWorldCoords;
	}
	getEntranceMoveTarget()
	{
		//
	}
	getWanderMoveTarget()
	{
		//console.log("getWanderMoveTarget");
		var adjRooms = this.getAdjacentRooms(true);
		if(adjRooms.length > 0)
		{
			var index = Math.floor(Math.random() * adjRooms.length);
			return adjRooms[index].myWorldCoords;
		}
		
	}
	getCentre()
	{
		return new THREE.Vector2(this.myWorldCoords.x + 0.5, this.myWorldCoords.y + 0.5);
	}
	getSqrdDist(otherRoom)
	{
		var otherCentre = otherRoom.getCentre();
		var myCentre = this.getCentre();
		return (myCentre.x - otherCentre.x) * (myCentre.x - otherCentre.x) + 
			(myCentre.y - otherCentre.y) * (myCentre.y - otherCentre.y);
	}
	getAngle(otherRoom)
	{
		var otherCentre = otherRoom.getCentre();
		var myCentre = this.getCentre();
		return Math.atan2(otherCentre.x - myCentre.x, otherCentre.y - myCentre.y);
	}
	getAdjacentRooms(requireWalkable=false)
	{
		var rooms = new Array();
		
		//NORTH
		if(this.myDungeonIndex.y < DungeonRooms[this.myDungeonIndex.x].length - 1)
		{
			const adjRoom = DungeonRooms[this.myDungeonIndex.x][this.myDungeonIndex.y + 1];
			//console.log("north:" + adjRoom.dist_to_treasure);
			if(!requireWalkable || adjRoom.dist_to_treasure < 999)
				rooms.push(adjRoom);
		}
		
		//SOUTH
		if(this.myDungeonIndex.y > 0)
		{
			const adjRoom = DungeonRooms[this.myDungeonIndex.x][this.myDungeonIndex.y - 1];
			//console.log("south:" + adjRoom.dist_to_treasure);
			if(!requireWalkable || adjRoom.dist_to_treasure < 999)
				rooms.push(adjRoom);
		}
		
		//EAST
		if(this.myDungeonIndex.x < DungeonRooms.length - 1)
		{
			const adjRoom = DungeonRooms[this.myDungeonIndex.x + 1][this.myDungeonIndex.y];
			//console.log("east:" + adjRoom.dist_to_treasure);
			if(!requireWalkable || adjRoom.dist_to_treasure < 999)
				rooms.push(adjRoom);
		}

		//WEST
		if(this.myDungeonIndex.x > 0)
		{
			const adjRoom = DungeonRooms[this.myDungeonIndex.x - 1][this.myDungeonIndex.y];
			//console.log("west:" + adjRoom.dist_to_treasure);
			if(!requireWalkable || adjRoom.dist_to_treasure < 999)
				rooms.push(adjRoom);
		}
		return rooms;
	}
	onMobEnter(mob)
	{
		this.units_present.push(mob);
		if(mob.isEnemy)
		{
			if (this.trap != null)
			{
				this.trap.doHit(mob);
				if (mob.health <= 0) {
					//mob is killed
					this.units_present = this.units_present.filter(unit => unit !== mob);
					mob.dungeonRoom = null;
					mob.destroy();
				} else {
					mob.dungeonRoom = this;
				}
			}
			if(this.dist_to_treasure == 0)
			{
				steal_audio.play()
				modifyPower(-25);
				mob.takeDamage(9999);
			}
		}
	}
	onMobExit(mob)
	{
		if(this.units_present.indexOf(mob) >= 0)
		{
			this.units_present.splice(this.units_present.indexOf(mob),1);
			mob.dungeonRoom = null;
		}
	}
}

export {DungeonRoom};
