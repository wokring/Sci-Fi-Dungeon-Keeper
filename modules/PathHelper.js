import {DungeonRooms} from "./DungeonLayout.js"

class PathHelper
{
	static entranceRoom;
	static treasureRoom;
	static GetPathToTreasure(startDungeonRoom)
	{
		//hardcoded preset path
		return new Array(DungeonRooms[4][7],DungeonRooms[4][6],DungeonRooms[4][5],DungeonRooms[4][4],
			DungeonRooms[4][3],DungeonRooms[4][2],DungeonRooms[4][1],DungeonRooms[4][0]);
		//return this.GetPath(startDungeonRoom, this.treasureRoom);
	}
	static GetPathToEntrance(startDungeonRoom)
	{
		return this.GetPath(startDungeonRoom, this.entranceRoom);
	}
	static GetPath(startDungeonRoom, endDungeonRoom)
	{
		//todo: this is partially working but has some unusual behaviour near the end
		//console.log("GetPath()");
		//console.log(startDungeonRoom);
		//console.log(endDungeonRoom);
		//can we generate a valid path?
		const path = new Array();
		if(startDungeonRoom == null || endDungeonRoom == null)
		{
			console.log("null argument");
			return path;
		}
		
		//start values
		var uncheckednodes = new Array(new astar_node(startDungeonRoom, 0, startDungeonRoom.getSqrdDist(endDungeonRoom)));
		var checkedNodes = new Array();
		
		while(uncheckednodes.length > 0)
		{
			var curNode = uncheckednodes.shift();
			checkedNodes.unshift(curNode);
			console.log(curNode);
			var adjRooms = curNode.dungeonRoom.getAdjacentRooms();
			for(var i=0; i<adjRooms.length; i++)
			{
				var curRoom = adjRooms[i];
				
				//check if this room is our destination
				if(curRoom == endDungeonRoom)
				{
					//we can successfully finish
					//path.push(curRoom);
					
					//dont check any more rooms
					uncheckednodes = new Array();
					break;
				}
				else
				{
					//has this room been checked before?
					var alreadyChecked = false;
					for(var j=0; j<checkedNodes.length; j++)
					{
						var checkNode = checkedNodes[j];
						if(checkNode.dungeonRoom == curRoom)
						{
							alreadyChecked = true;
							break;
						}
					}
					
					if(!alreadyChecked)
					{
						//add the current room to the unchecked list, sorting it in by distance
						var nextDist = curNode.dungeonRoom.getSqrdDist(curRoom);
						var newNode = new astar_node(curRoom,curNode.prev_dist + 1, nextDist);
						
						if(uncheckednodes.length == 0)
						{
							uncheckednodes.push(newNode);
						}
						else
						{
							for(var k=0; k<uncheckednodes.length; k++)
							{
								//is the current unchecked node farther away?
								var uncheckedNode = uncheckednodes[k];
								if(uncheckedNode.TotalDist() >= newNode.TotalDist())
								{
									//insert the node here and exit
									uncheckednodes.splice(k, 0, newNode);
									break;
								}
							}
						}
					}
					
				}
			}
		}
		//console.log(path);
		return path;
	}
}

class astar_node
{
	constructor(dungeonRoom, prev_dist, next_dist)
	{
		this.dungeonRoom = dungeonRoom;
		this.prev_dist = prev_dist;
		this.next_dist = next_dist;
	}
	TotalDist()
	{
		return this.prev_dist + this.next_dist;
	}
}

export {PathHelper};
