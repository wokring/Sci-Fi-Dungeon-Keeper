class Trap {
    constructor(hit_rate, damage, debuff = null) {
        this.chance = hit_rate // ranges from 0 - 1
        this.damage = damage
        this.debuff = debuff
    }
    doHit(unit) { 
        if (this.chance == 1) {
            unit.getHit(this.damage)
        } else if ((Math.floor(Math.random() * 100) < ((this.chance / unit.dodge) * 100))) {
            if (this.debuff != null) {
                unit.getHit(this.damage, this.debuff)
            } else {
                unit.getHit(this.damage)
            }
        }
    }
}

class TeleporterTrap extends Trap {
    constructor(hit_rate, damage, uses = 1) {
        super(hit_rate, damage);
        this.uses = uses
    }
    doHit(unit) {
        if (this.uses == 0) {
            // do nothing
        } else {
            //access singleton roomtree here and get a random room in the range, then move the unit to that room
            this.uses -= 1
        }
    }
}

export {Trap, TeleporterTrap}