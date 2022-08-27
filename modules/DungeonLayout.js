import {DungeonRoom} from "./DungeonRoom.js"

const DungeonRooms = new Array()
const DUNGEON_HEIGHT = 10;
const DUNGEON_WIDTH = 10;

function BuildDungeon()
{
	for(var i=0; i<DUNGEON_HEIGHT; i++)
	{
		DungeonRooms.push(new Array());
		for(var j=0; j<DUNGEON_WIDTH; j++)
		{
			DungeonRooms[i].push(new DungeonRoom());
		}
	}
	//console.log(DungeonRooms);
	
	var myroom = DungeonRooms[6][3];
}

export { BuildDungeon };
