import {DungeonFactory} from '../modules/DungeonLayout.js'
import {Unit} from '../modules/Unit.js'
var MobManager = (function(){
	class Mobs {
		constructor() {
			this.mobs = []
            this.dungeon = DungeonFactory.getInstance
		}
        init(scene) {
            // this.createMob(new Unit(10,10,10,1,1,1,scene,[0,1],[-1,3]))
            // this.createMob(new Unit(10,10,10,1,1,1,scene,[0,1],[3,5]))
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
        // arrayEquals(a, b) {
        //     return JSON.stringify(a)==JSON.stringify(b);
        // }

        getClosest(unit) {
            if (this.mobs.length < 1) {
                return [null, 0, 0, 0];
            } else {
                return this.mobs[Math.floor(Math.random() * this.mobs.length)];
            }

            // let res = [null, 0, 0, 0];
            // if (unit in this.mobs) {
            //     let min_dis = Number.MAX_SAFE_INTEGER;
            //     let temp = this.mobs.filter(mob => mob !== unit);
            //     temp.forEach(
            //         function(mob) {
            //             let dis = Math.hypot(
            //                 mob.position[0] - unit.position[0], mob.position[1] - unit.position[1]
            //             );
            //             if (min_dis > dis) {
            //                 min_dis = dis;
            //                 res = []
            //             }
            //         }
            //     );
            // }
            // const array = [...this.mobs]
            // var distance = 999999999 // set to huge number so first distance will overwrite
            //
            // array.forEach(function(item, index) {
            //     // console.log(this.arrayEquals(item.room, in_unit.room))
            //     // console.log(item.room)
            //     // console.log(in_unit.room)
            //     if ((in_unit.room === item.room) && (item !== in_unit)) {
            //         console.log("yes!")
            //
            //         var x_diff = unit.pos[0] - in_unit.pos[1];
            //         var y_diff = unit.pos[1] - in_unit.pos[1];
            //         var nvector = ((x_diff) ** 2 + (y_diff) ** 2)**0.5;
            //         if (nvector < distance) {
            //             r_unit = index;
            //             r_x = x_diff;
            //             r_y = y_diff;
            //             r_vector = nvector;
            //
            //
            //         }
            //     }
            // });
            // return [r_unit, r_x, r_y, r_vector]

        }
        update(d_time) {
            for (var i = 0; i < this.mobs.length; i++) {
                this.mobs[i].doCombat(d_time)
            }
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