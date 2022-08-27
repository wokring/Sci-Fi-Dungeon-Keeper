import {DungeonFactory} from '../modules/DungeonLayout.js'
var MobManager = (function(){
	class Mobs {
		constructor() {
			this.mobs = []
            this.dungeon = DungeonFactory.getInstance
		}
		createMob(unit) {
			this.mobs.push(unit)
            return unit
		}
        getRoom(unit) {
            if (unit in this.mobs) {
                return this.dungeon.getRoom(unit.room)
            }
        }
        killMob(unit) {
            this.mobs.splice(this.mobs.indexOf(unit), 1)
            // drop current energy
        }
        getUnit(unit) {
            return this.mobs.indexOf(unit)
        }
        getUnits() {
            return this.mobs
        }
        getClosest(in_unit) {
            const array = [...this.mobs]
            var distance = 999999999 // set to huge number so first distance will overwrite
            var r_unit = null
            var r_x = null
            var r_y = null
            var r_vector = null
            array.forEach(function(item, index) {
                if ((in_unit.room == item.room) && (item != in_unit)) {
                    var x_diff = unit.pos[0] - in_unit.pos[1];
                    var y_diff = unit.pos[1] - in_unit.pos[1];
                    var nvector = ((x_diff) ** 2 + (y_diff) ** 2)**0.5;
                    if (nvector < distance) {
                        r_unit = index;
                        r_x = x_diff;
                        r_y = y_diff;
                        r_vector = nvector;
    
                    }
                }
            });
            return [r_unit, r_x, r_y, r_vector]
    
        }
	}
  
	var instance;
  
	return {
	  getInstance: function(){
		if (!instance) {
		  instance = new Mobs();
		  delete instance.constructor;
		}
		return instance;
	  }
	};
  })();

  export {MobManager};