class RoomNode {
    constructor(parent, height, width, data, level) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.level = level;
        this.trap = 
        this.children = [];
    }

    get area() {
        return this.calcArea();
    }

    addRoom(height, width, data) {
        this.children.push(new RoomNode(this.parent, height, width, data, this.level + 1));
    }

    calcArea() {
        return this.height * this.width;
    }
}
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

class Unit {
    constructor(cost, health, damage, interval, speed, range, room, pos = [0,0], level = 1) {
        this.cost = cost
        this._health = health
        this._damage = damage
        this.interval = interval
        this._speed = speed
        this._range = range
        this.level = level
        this.position = pos // relative positon of unit in the room
        this.room = room //this is the current node of the unit.c
        this.debuff = [1,1]
    }

    get speed() {
        return this._speed * this.debuff[0]
    }
    set speed(value) {
        this._speed = value
    }
    set position(value) {
        console.log(value)
        this.position = value
    }
    get range() {
        return this._range * this.debuff[1]
    }
    set range(value) {
        this._range = value
    }

    get health() {
        return this._health * 2^(level - 1)
    }
    set health(value) {
        this._health = value / (2^(level - 1))
    }
    get damage() {
        return this._damage * 2^(level - 1)
    }
    set damage(value) {
        this._damage = value / (2^(level - 1))
    }
    getHit(damage, debuff = [1, 1]) {
        if (this.damage - damage <= 0) {
            this.damage = 0
        } else {
            this.damage -= damage
        }
        this.debuff = debuff
    }
    resetDebuff() {
        this.debuff = [1, 1]
    }
}

class EnemyUnit extends Unit {
    constructor(cost, health, damage, interval, speed, range, room, pos = [0,0], level = 1, dodge_chance) {
        super(cost, health, damage, interval, speed, range, room, level);
        this.dodge = dodge_chance; // dodge chance is the scaling on the trap chance some units have.
        this.last_direction = null
    }
}
class RoomTree {
    constructor(height, width) {
        this.root = new RoomNode(null, height, width, null, 0);
    }
}

export { RoomTree, RoomNode };
