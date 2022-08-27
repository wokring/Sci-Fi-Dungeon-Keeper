import { MobManager } from '../modules/MobManager.js'
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
        this.fighting = false
        this.cooldown = 0
    }
    get speed() {
        return this._speed * this.debuff[0];
    }
    set speed(value) {
        this._speed = value;
    }
    set position(value) {
        //console.log(value);
        this._position = value;
    }
    get range() {
        return this._range * this.debuff[1];
    }
    set range(value) {
        this._range = value;
    }

    get health() {
        return this._health * 2^(this.level - 1);
    }
    set health(value) {
        this._health = value / (2^(this.level - 1));
    }
    get damage() {
        return this._damage * 2^(this.level - 1);
    }
    set damage(value) {
        this._damage = value / (2^(this.level - 1));
    }
    getHit(damage, debuff = [1, 1]) {
        if (this.damage - damage <= 0) {
            MobManager.getInstance().killUnit(this)
        } else {
            this.damage -= damage;
        }
        this.debuff = debuff;
    }
    resetDebuff() {
        this.debuff = [1, 1]
    }
    finishFight() {
        this.resetDebuff()
        this.fighting = false
    }
    connectedHit() {
        this.cooldown = this.interval * 1000
    }
}

class EnemyUnit extends Unit {
    constructor(cost, health, damage, interval, speed, range, room, pos = [0,0], level = 1, dodge_chance) {
        super(cost, health, damage, interval, speed, range, room, level);
        this.dodge = dodge_chance; // dodge chance is the scaling on the trap chance some units have.
        this.last_direction = null;
    }
}

export {Unit, EnemyUnit}
