import {DungeonRoom} from "./DungeonRoom.js"
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import {PathHelper} from "./PathHelper.js"
import {scene} from "../src/main.js"
import {Unit} from "../modules/Unit.js";
import {Trap} from "../modules/Trap.js";



const treasurex = 4
const treasurey = 4
var DungeonRooms = [];
var dist = [];
=======

const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;
const WORLD_MIN_X = -3;
const WORLD_MIN_Y = -3;
const WORLD_MAX_X = 4;
const WORLD_MAX_Y = 4;
var DungeonFactory = (function(){
	class Dungeon {
		constructor() {
			console.log("test");
			this.rooms = BuildDungeon();
			this.units = [];
			this.dist = init_distoT();
		}
		getRoom(position) {
			return this.rooms[position[0]][position[1]]
		}
		addUnit(unit, position) {
			unit.room = position;
			// when the room coordas are defined, change position to the entrance the unit came from
			this.rooms[position[0]][position[1]].units.push(unit);
			this.units.push(unit);
		}
	}
  
	var instance;
  
	return {
	  getInstance: function(){
		if (!instance) {
		  instance = new Dungeon();
		  delete instance.constructor;
		}
		return instance;
	  }
	};
  })();

function init_distoT(){

	for(var i=0; i<DUNGEON_WIDTH; i++)
	{
		dist.push(new Array());
		for(var j=0; j<DUNGEON_HEIGHT; j++)
		{
			dist[i][j] = 9999;
		}
	}
	dist[treasurex][treasurey] = 0;
	dist[4][3] = 1;
	dist[3][3] = 2;
	console.log(dist)
	return dist;
}


function update_dist (){
	update_dist_room(treasurex,treasurey);
	console.log(dist)

}

const x_ag = [0,1,0,-1];
const y_ag = [1,0,-1,0];
function update_dist_room (x,y){
	var d = dist[x][y]
	for (var i = 0; i < 4; i++){
		var nx = x + x_ag[i];
		var ny = y + y_ag[i];
		if (nx >= 0 && nx < DUNGEON_WIDTH){
			if (ny >= 0 && ny < DUNGEON_HEIGHT){
				var room = DungeonRooms[nx][ny]
				if(room.isBuilt && d < dist[nx][ny]){
					dist[nx][ny] = d +1;
					update_dist_room(nx,ny);
				}
			}
		}
	}

}

function BuildDungeon()
{	
	init_distoT();
	for(var i=0; i<DUNGEON_WIDTH; i++)
	{
		DungeonRooms.push(new Array());
		for(var j=0; j<DUNGEON_HEIGHT; j++)
		{
			let dungeonIndex = new THREE.Vector2(i,j);
			const newRoom = new DungeonRoom(dungeonIndex);
			DungeonRooms[i].push(newRoom);
		}
	}
	
	//setup the starting rooms
	var i = Math.ceil(DUNGEON_WIDTH/2);

	DungeonRooms[treasurex][treasurey].CreateMapTiles();
	const plane = new THREE.PlaneGeometry(0.75, 0.75);
	const PS_tex = new THREE.TextureLoader().load( '../sprites/power_source.png' );
    PS_tex.magFilter = THREE.NearestFilter
    const PS_mt= new THREE.MeshBasicMaterial({ map: PS_tex });
    PS_mt.transparent = true;
    const power_source = new THREE.Mesh(plane, PS_mt);
    power_source.position.x = treasurex + WORLD_MIN_X;
    power_source.position.z = 3;
    power_source.position.y = treasurey + WORLD_MIN_Y;
	scene.add(power_source);
	DungeonRooms[4][3].CreateMapTiles();
	DungeonRooms[3][3].CreateMapTiles();
	// for(var j=0; j<DUNGEON_HEIGHT; j++)
	// {
	// 	const curRoom = DungeonRooms[i][j];
	// 	if(j == 0)
	// 	{
	// 		//our treasure room
	// 		PathHelper.treasureRoom = curRoom;
	// 	}
	// 	else if(j == DUNGEON_HEIGHT - 1)
	// 	{
	// 		//our spawning room
	// 		PathHelper.entranceRoom = curRoom;
	// 	}
	// 	curRoom.CreateMapTiles();
	// }
	PathHelper.treasureRoom = DungeonRooms[treasurex][treasurey];
	PathHelper.entranceRoom = DungeonRooms[3][3];
	var myRoom = DungeonRooms[3][3];
	const template = [10,10,10,1,1,1,null,[0,1],[-1,3]]
	var mySpawner = new Spawner(myRoom, template, 2, 5);
	var manager = new SpawnManager();
	manager.addSpawn(mySpawner);


	return DungeonRooms
}




export { BuildDungeon, DungeonRooms, DungeonFactory,update_dist,
	WORLD_MIN_X, 
	WORLD_MIN_Y,
	WORLD_MAX_X,
	WORLD_MAX_Y,
	DUNGEON_HEIGHT,
	DUNGEON_WIDTH};
