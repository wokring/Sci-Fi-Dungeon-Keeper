import {DungeonRoom} from "./DungeonRoom.js"
import {MapTile} from "./MapTile.js"

const DungeonRooms = []; 
const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;
const WORLD_MIN_X = -3.5;
const WORLD_MIN_Y = -3.5;
const WORLD_MAX_X = 3.5;
const WORLD_MAX_Y = 3.5;

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
	
	//setup the starting rooms
	var i = Math.ceil(DUNGEON_WIDTH/2);
	for(var j=0; j<DUNGEON_HEIGHT; j++)
	{
		const curRoom = DungeonRooms[i][j];
		if(j == 0)
		{
			//our treasure room
		}
		else if(j == DUNGEON_HEIGHT - 1)
		{
			//our spawning room
		}
		curRoom.CreateMapTiles();
	}
}

export {BuildDungeon, DungeonRooms, 
	WORLD_MIN_X, 
	WORLD_MIN_Y,
	WORLD_MAX_X,
	WORLD_MAX_Y,
	DUNGEON_HEIGHT,
	DUNGEON_WIDTH};
