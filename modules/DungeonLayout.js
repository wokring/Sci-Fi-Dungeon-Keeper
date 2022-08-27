import DungeonRoom from "./DungeonRoom.js"
import MapTile from "./MapTile.js"

const DungeonRooms = []; 
const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;

<<<<<<< HEAD
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
=======
function buildDungeon() {
	for(let i = 0; i < DUNGEON_HEIGHT; ++i) {
		DungeonRooms.push([]);

		for(let j = 0; j < DUNGEON_WIDTH; ++j) {
			DungeonRooms[i].push(new DungeonRoom());
>>>>>>> 7db4526 (Added enums to direction and children (json).)
		}
	}

    return DungeonRooms;
}

export default buildDungeon;
