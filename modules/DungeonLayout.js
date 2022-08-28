import {DungeonRoom} from "./DungeonRoom.js"
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import {PathHelper} from "./PathHelper.js"
import {scene} from "../src/main.js"
import {Unit} from "../modules/Unit.js";
import {Trap} from "../modules/Trap.js";



const treasureIndexX = 4
const treasureIndexY = 7
var DungeonRooms = [];
var dist = [];

const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;
const WORLD_MIN_X = -3;
const WORLD_MIN_Y = -3;
const WORLD_MAX_X = 4;
const WORLD_MAX_Y = 4;

const DOODAD_Z = 2;

var DungeonFactory = (function(){
	class Dungeon {
		constructor() {
			console.log("test");
			this.rooms = BuildDungeon();
			this.units = [];
			this.dist = init_distoT();
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
	dist[treasureIndexX][treasureIndexY] = 0;
	//dist[4][3] = 1;
	//dist[3][3] = 2;
	//console.log(dist)
	return dist;
}


function update_dist (){
	update_dist_room(treasureIndexX,treasureIndexY);

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
					dist[nx][ny] = d + 1;
					room.dist_to_treasure = d + 1;
					update_dist_room(nx,ny);
				}
			}
		}
	}

}

function BuildDungeon()
{	
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
	
	init_distoT();
	//console.log(dist);
	
	//setup the starting rooms
	var i = Math.floor(DUNGEON_WIDTH/2);
	for(var j=0; j<DUNGEON_HEIGHT; j++)
	{
		const curRoom = DungeonRooms[i][j];
	 	if(j == 0)
	 	{
	 		//our entrance room for enemies
	 		PathHelper.entranceRoom = curRoom;
	 	}
	 	else if(j == DUNGEON_HEIGHT - 1)
	 	{
	 		//our treasure room
	 		PathHelper.treasureRoom = curRoom;
	 		PathHelper.treasureRoom.dist_to_treasure = 0;
	 	}
	 	curRoom.CreateMapTiles();
	}
	//DungeonRooms[treasureIndexX][treasureIndexY].CreateMapTiles();
	//DungeonRooms[4][3].CreateMapTiles();
	//DungeonRooms[3][3].CreateMapTiles();
	
	//PathHelper.treasureRoom = DungeonRooms[treasureIndexX][treasureIndexY];
	//PathHelper.treasureRoom.dist_to_treasure = 0;
	//PathHelper.entranceRoom = DungeonRooms[3][3];
	
	//visual sprite for the treasure room
	var plane = new THREE.PlaneGeometry(0.75, 0.75);
	var PS_tex = new THREE.TextureLoader().load( '../sprites/power_source.png' );
	PS_tex.magFilter = THREE.NearestFilter
	var PS_mt= new THREE.MeshBasicMaterial({ map: PS_tex });
	PS_mt.transparent = true;
	var power_source = new THREE.Mesh(plane, PS_mt);
	power_source.position.x = treasureIndexX + WORLD_MIN_X;
	power_source.position.z = DOODAD_Z;
	power_source.position.y = treasureIndexY + WORLD_MIN_Y;
	scene.add(power_source);
	
	//visual sprite for the entrance room
	plane = new THREE.PlaneGeometry(1, 1);
	PS_tex = new THREE.TextureLoader().load( '../sprites/entrance.png' );
	PS_tex.magFilter = THREE.NearestFilter
	PS_mt= new THREE.MeshBasicMaterial({ map: PS_tex });
	PS_mt.transparent = true;
	var entrancemarker = new THREE.Mesh(plane, PS_mt);
	entrancemarker.position.x = treasureIndexX + WORLD_MIN_X;
	entrancemarker.position.z = DOODAD_Z;
	entrancemarker.position.y = WORLD_MIN_X;
	scene.add(entrancemarker);
	
	//setup the path weightings
	update_dist();
	//console.log(dist);
	
	/*
	var myRoom = DungeonRooms[3][3];
	const template = [10,10,10,1,1,1,null,[0,1],[-1,3]]
	var mySpawner = new Spawner(myRoom, template, 2, 5);
	var manager = new SpawnManager();
	manager.addSpawn(mySpawner);*/
	
	return DungeonRooms
}
export { BuildDungeon, DungeonRooms, DungeonFactory,update_dist,
	WORLD_MIN_X, 
	WORLD_MIN_Y,
	WORLD_MAX_X,
	WORLD_MAX_Y,
	DUNGEON_HEIGHT,
	DUNGEON_WIDTH};
