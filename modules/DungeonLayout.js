import {DungeonRoom} from "./DungeonRoom.js"

const DungeonRooms = []; 
const DUNGEON_HEIGHT = 10;
const DUNGEON_WIDTH = 10;

function BuildDungeon() {
	for(let i = 0; i < DUNGEON_HEIGHT; ++i) {
		DungeonRooms.push([]);

		for(let j = 0; j < DUNGEON_WIDTH; ++j) {
			DungeonRooms[i].push(new DungeonRoom());
		}
	}
}

export {BuildDungeon};
