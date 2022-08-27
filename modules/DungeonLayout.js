import DungeonRoom from "./DungeonRoom.js"
import MapTile from "./MapTile.js"

const DungeonRooms = []; 
const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;

function BuildDungeon()
{
	for(var i=0; i<DUNGEON_HEIGHT; i++)
	{
		DungeonRooms.push(new Array());
		for(var j=0; j<DUNGEON_WIDTH; j++)
		{
			const newRoom = new DungeonRoom();
			newRoom.CreateMapTiles(new THREE.Vector2(i-4,j-3));
			DungeonRooms[i].push(newRoom);
		}
	}

    return DungeonRooms;
}

export default BuildDungeon;
