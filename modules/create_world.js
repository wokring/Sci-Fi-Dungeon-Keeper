
import { MapTile } from "../modules/MapTile.js"
import { BuildDungeon, DungeonRooms } from "../modules/DungeonLayout.js"


const NORTH = 1;
const SOUTH = 2;
const EAST = 4;
const WEST = 8;

const FLOOR_A = 1;
const FLOOR_B = 2;
const FLOOR_C = 3;
const FLOOR_D = 4;

//this file is for test game rendering

/*
walls tileset from roguelite pack PNG
spritesheet dimensions are 1184x736
number of tiles on the spritesheet are 37,23
tilesize: 32x32
*/

//load the spritesheet for the walls
const spriteImage = new THREE.ImageLoader().load('../sprites/tileset x1.png');
const spriteSource = new THREE.Source(spriteImage);
MapTile.wallSpriteSource = spriteSource;

//set the static spritesheet values for all map tiles
MapTile.wallSpriteDims = new THREE.Vector2(1184, 736);
MapTile.wallTileDims = new THREE.Vector2(32, 32);
//MapTile.wallTileDimsRelative = new THREE.Vector2(MapTile.wallTileDims.x/MapTile.wallSpriteDims.x, MapTile.wallTileDims.y/MapTile.wallSpriteDims.y);

/*
//debug these values to make sure they seem reasonable
console.log(MapTile.wallSpriteSource);
console.log(MapTile.wallTileDims);
console.log(MapTile.wallSpriteDims);
console.log(MapTile.wallTileDimsRelative);
*/

//setup the maps to store the spritesheet indices for our walls
MapTile.dirLookupTileIndex = new Map();
MapTile.dirLookupTileDims = new Map();
MapTile.dirLookupFloorIndex = new Map();

//straight walls
MapTile.dirLookupTileIndex.set("" + NORTH,new THREE.Vector2(5,22));
MapTile.dirLookupTileIndex.set("" + SOUTH,new THREE.Vector2(5,12));
MapTile.dirLookupTileIndex.set("" + EAST, new THREE.Vector2(9,20));
MapTile.dirLookupTileIndex.set("" + WEST, new THREE.Vector2(1,20));
//corner walls
MapTile.dirLookupTileIndex.set("" + (SOUTH|WEST),new THREE.Vector2(2,12));
MapTile.dirLookupTileIndex.set("" + (SOUTH|EAST),new THREE.Vector2(8,12));
MapTile.dirLookupTileIndex.set("" + (NORTH|WEST),new THREE.Vector2(2,22));
MapTile.dirLookupTileIndex.set("" + (NORTH|EAST),new THREE.Vector2(8,22));
//floors
MapTile.dirLookupFloorIndex.set("" + FLOOR_A,new THREE.Vector2(32,20));
MapTile.dirLookupFloorIndex.set("" + FLOOR_B,new THREE.Vector2(32,21));
MapTile.dirLookupFloorIndex.set("" + FLOOR_C,new THREE.Vector2(33,21));
MapTile.dirLookupFloorIndex.set("" + FLOOR_D,new THREE.Vector2(34,21));


function CreateWorld()
{
	//CreateTestRoom();
	BuildDungeon();
}

//a green background tile to debug if a tile is rendering properly
/*
const bgPlaneGeom = new THREE.PlaneGeometry(5, 5);
const bgPlaneMat = new THREE.MeshBasicMaterial( {color : 0x00ff00} );
const bgPlane = new THREE.Mesh( bgPlaneGeom, bgPlaneMat );
scene.add(bgPlane);
bgPlane.position.z = -0.001;
*/

export { CreateWorld };
