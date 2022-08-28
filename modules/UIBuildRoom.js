import {DungeonRooms, update_dist} from "./DungeonLayout.js"
import {DungeonRoom} from "./DungeonRoom.js"
import {MapTile} from "./MapTile.js"
import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"
import {mobManager} from "./MobManager.js"

function UIBuildRoom(buildType, quantizedWorldCoords)
{
	//array safety checks
	//console.log(quantizedWorldCoords);
	if(quantizedWorldCoords.x >= DungeonRooms.length)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.x + 
		" of DungeonRooms, which has xdimensions " + DungeonRooms.length);
		return false;
	}
	if(quantizedWorldCoords.x < 0)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.x + 
		" of DungeonRooms, which has xdimensions " + DungeonRooms.length);
		return false;
	}
	if(quantizedWorldCoords.y >= DungeonRooms[quantizedWorldCoords.x].length)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.y + 
		" of DungeonRooms, which has ydimensions " + DungeonRooms[quantizedWorldCoords.x].length);
		return false;
	}
	if(quantizedWorldCoords.y < 0)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.y + 
		" of DungeonRooms, which has ydimensions " + DungeonRooms[quantizedWorldCoords.x].length);
		return false;
	}
	//console.log("success");
	
	const chosenRoom = DungeonRooms[quantizedWorldCoords.x][quantizedWorldCoords.y];
	
	if(!CanBuild(chosenRoom))
	{
		//play sfx for build failure here

		return false;
	}
	chosenRoom.CreateMapTiles();
	
	update_dist()
	
	//for testing
	//mobManager.createMobAt(chosenRoom).PathToTreasure();
	
	return true;

}

function CanBuild(tryRoom)
{
	if(tryRoom.isBuilt)
	{
		//todo: build failure
		console.log("NOTICE: There is already a room there.");
		return false;
	}
	
	//check if adjacent rooms exist to connect to
	
	//NORTH
	if(tryRoom.myDungeonIndex.y < DungeonRooms[tryRoom.myDungeonIndex.x].length - 1)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x][tryRoom.myDungeonIndex.y + 1];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}
	
	//SOUTH
	if(tryRoom.myDungeonIndex.y > 0)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x][tryRoom.myDungeonIndex.y - 1];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}
	
	//EAST
	if(tryRoom.myDungeonIndex.x < DungeonRooms.length - 1)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x + 1][tryRoom.myDungeonIndex.y];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}

	//WEST
	if(tryRoom.myDungeonIndex.x > 0)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x - 1][tryRoom.myDungeonIndex.y];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}

	
	//couldn't find an adjacent room so we can't build here
	console.log("NOTICE: Could not find an adjacent room to connect to.");
	return false;
}

export {UIBuildRoom};
