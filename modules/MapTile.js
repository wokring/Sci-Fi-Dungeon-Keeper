
//static bitflag defines for our directions
const NORTH = 1;
const SOUTH = 2;
const EAST = 4;
const WEST = 8;

const FLOOR_A = 1;
const FLOOR_B = 2;
const FLOOR_C = 3;
const FLOOR_D = 4;

const FLOOR_RENDER_DEPTH = -0.001;
const WALL_RENDER_DEPTH = 0.01;

const TILE_INDEX_FAIL = new THREE.Vector2(0,0);

class MapTile
{
	static scene;
	static wallSpriteSource;
	static wallSpriteDims;
	static wallTileDims;
	//static wallTileDimsRelative;
	static dirLookupTileIndex;
	static dirLookupTileDims;
	static dirLookupFloorIndex;
	static worldTileDefaults = new THREE.Vector2(0.2,0.2);	//in world coords
	constructor(wallDir, worldCoords, floorID)
	{
		this.myDir = wallDir;
		this.myCoords = worldCoords;
		//look up the tile index from the chosen wall direction... it is stored as a string
		//sprite sheet tile index starts from 0 in the bottom left corner
		//this.myTileIndex = new THREE.Vector2(1, 21);	
		let tileIndex;
		if(MapTile.dirLookupTileIndex.has("" + wallDir))
		{
			tileIndex = MapTile.dirLookupTileIndex.get("" + wallDir);
		}
		else
		{
			//a big red X to say broken sprite
			tileIndex = TILE_INDEX_FAIL;
		}
		
		//does this tile index have special dimensions handling? for any NORTH flag walls
		let customWallTileDims = MapTile.wallTileDims
		if(MapTile.dirLookupTileDims.has("" + wallDir))
		{
			 customWallTileDims = MapTile.dirLookupTileDims.get("" + wallDir);
		}
		const wallTileDimsRelative = new THREE.Vector2(
			customWallTileDims.x/MapTile.wallSpriteDims.x,
			customWallTileDims.y/MapTile.wallSpriteDims.y);
		
		//setup the render texture from the sprite sheet
		this.myTexture = new THREE.Texture();
		this.myTexture.source = MapTile.wallSpriteSource;
		this.myTexture.repeat.set(wallTileDimsRelative.x, wallTileDimsRelative.y);		
		this.myTexture.offset.set(tileIndex.x * wallTileDimsRelative.x, tileIndex.y * wallTileDimsRelative.y);
		this.myTexture.needsUpdate = true;
		
		//finalise the render object creation
		this.myGeom = new THREE.PlaneGeometry(
			customWallTileDims.x/MapTile.worldTileDefaults.x, 
			customWallTileDims.y/MapTile.worldTileDefaults.y);
		this.myMat = new THREE.MeshBasicMaterial( {map : this.myTexture, transparent : true} );
		this.myPlane = new THREE.Mesh( this.myGeom, this.myMat );
		MapTile.scene.add(this.myPlane);
		
		//set the desired position
		this.myPlane.position.x = worldCoords.x;
		this.myPlane.position.y = worldCoords.y;
		this.myPlane.position.z = WALL_RENDER_DEPTH;
		
		/*
		//offset for northfacing walls to handle iso view
		if(wallDir&NORTH)
		{
			this.myPlane.position.y = worldCoords.y + 1;
		}
		else
		{
			this.myPlane.position.y = worldCoords.y;
		}
		*/
		
		//floor tile index
		let floorIndex;
		if(MapTile.dirLookupFloorIndex.has("" + floorID))
		{
			floorIndex = MapTile.dirLookupFloorIndex.get("" + floorID);
		}
		else
		{
			//a big red X to say broken sprite
			floorIndex = TILE_INDEX_FAIL;
		}
		
		//render texture for the floor
		this.myFloorTexture = new THREE.Texture();
		this.myFloorTexture.source = MapTile.wallSpriteSource;
		this.myFloorTexture.repeat.set(wallTileDimsRelative.x, wallTileDimsRelative.y);		
		this.myFloorTexture.offset.set(floorIndex.x * wallTileDimsRelative.x, floorIndex.y * wallTileDimsRelative.y);
		this.myFloorTexture.needsUpdate = true;
		
		//finalise the render object creation
		/*this.myGeom = new THREE.PlaneGeometry(
			customWallTileDims.x/MapTile.worldTileDefaults.x, 
			customWallTileDims.y/MapTile.worldTileDefaults.y);*/
		this.myFloorMat = new THREE.MeshBasicMaterial( {map : this.myFloorTexture, transparent : true} );
		this.myFloorPlane = new THREE.Mesh( this.myGeom, this.myFloorMat );
		MapTile.scene.add(this.myFloorPlane);
		
		//set the desired position
		this.myFloorPlane.position.x = worldCoords.x;
		this.myFloorPlane.position.y = worldCoords.y;
		this.myFloorPlane.position.z = FLOOR_RENDER_DEPTH;		//render "below" walls
		
	}
}

export { MapTile };
