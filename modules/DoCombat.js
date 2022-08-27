import {MobManager} from '../modules/MobManager.js'
const MOVEMENT_CONSTANT = 0.1;
const CAMERA_FACTOR = 2;
function Fight(this_unit) {
    var mob_manager = MobManager.getInstance()
    unit_index = mob_manager.getUnit(this_unit)
    enemy, x, y, vector = mob_manager.getClosest(this_unit)
    if (enemy = null) {
        mob_manager.mobs[unit_index].finishFight()
    } else {
        mob_manager.mobs[unit_index].fighting = true
    }
    if (vector <= (this_unit.range * CAMERA_FACTOR)) {
        if (this_unit.debuff != null) {
            mob_manager.mobs[enemy].getHit(this_unit.damage, this_unit.debuff);
        } else {
            mob_manager.mobs[enemy].getHit(this_unit.damage);
        }
        mob_manager.mobs[unit_index].connectedHit()                   
    } else {
        mob_manager.mobs[unit_index].position[0] += (x/vector) * this_unit.speed * MOVEMENT_CONSTANT;
        mob_manager.mobs[unit_index].position[1] += (y/vector) * this_unit.speed * MOVEMENT_CONSTANT;
    }    
    return true;
}

// function ManageMobs(unit) {
//     dungeon = DungeonFactory.getInstance()
//     for (trap in dungeon.getRoom(unit.room).traps) {
//         trap.doHit(unit)
//     }
//     if (unit.health == 0) {
//         dungeon.getRoom(unit.room).units.splice(indexOf(dungeon.getRoom(unit.room).units), 1)
//         return
//     }
//     var f = setInterval(Fight, 100, unit, f)
       
// }
export {Fight};