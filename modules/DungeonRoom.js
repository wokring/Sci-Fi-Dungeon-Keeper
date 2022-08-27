import {MapTile} from "./MapTile.js"

const NORTH = 1;
const SOUTH = 2;
const EAST = 4;
const WEST = 8;

const FLOOR_A = 1;
const FLOOR_B = 2;
const FLOOR_C = 3;
const FLOOR_D = 4;

class DungeonRoom
{
	constructor() {
		this.unit = [];
		this.trap = [];
		this.spawn = [];
		this.texture = [];
	}

	CreateMapTiles(worldCoords)
	{
		new MapTile(SOUTH|WEST,new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 0, 
			worldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(WEST, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 0, 
			worldCoords.y + MapTile.worldTileDefaults.y * 1), FLOOR_C);
		new MapTile(WEST, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 0, 
			worldCoords.y + MapTile.worldTileDefaults.y * 3), FLOOR_D);
		
		new MapTile(NORTH|WEST,new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 0, 
			worldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(NORTH,	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 1, 
			worldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(NORTH, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 3, 
			worldCoords.y + MapTile.worldTileDefaults.y * 4));
		
		new MapTile(NORTH|EAST,new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 4, 
			worldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(EAST, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 4, 
			worldCoords.y + MapTile.worldTileDefaults.y * 3), FLOOR_A);
		new MapTile(EAST, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 4, 
			worldCoords.y + MapTile.worldTileDefaults.y * 1), FLOOR_B);
		
		new MapTile(SOUTH|EAST,new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 4, 
			worldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(SOUTH, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 3, 
			worldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(SOUTH, 	new THREE.Vector2(
			worldCoords.x + MapTile.worldTileDefaults.x * 1, 
			worldCoords.y + MapTile.worldTileDefaults.y * 0));
	}
}

export {DungeonRoom};
