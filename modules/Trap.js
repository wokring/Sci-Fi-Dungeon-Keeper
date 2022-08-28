import { RoomTree, RoomNode } from "../modules/RoomTree.js"
import {DungeonRoom} from "../modules/DungeonRoom.js"
import {scene} from "../src/main.js";

class Trap {
    constructor(uses, damage,x,y, room) {
        this.uses = uses;
        this.damage = damage;
        const mines_tex = new THREE.TextureLoader().load( '../sprites/mines.png' );
        mines_tex.magFilter = THREE.NearestFilter
        const mines_mt= new THREE.MeshBasicMaterial({ map: mines_tex });
        mines_mt.transparent = true;
        const plane = new THREE.PlaneGeometry(1, 1);
        const mines = new THREE.Mesh(plane, mines_mt);
        mines.position.x = x;
        mines.position.y = y;
        mines.position.z = 0;
        this.sprite = mines;
        this.room = room;
    }
    doHit(unit) {
        if (this.uses){
            unit.takeDamage(this.damage);
            unit.changeSprite();
            this.uses -= 1;
        }
        if (this.uses <= 0) {
            scene.remove(this.sprite);
            this.room.trap = null;
        }
    }
}

class TeleporterTrap extends Trap {
    constructor( uses = 1, damage,  curNode, tree) {
        super(uses, damage);
        this.uses = uses;
        this.tree = tree;
        this.curNode = curNode;
    }
    // doHit(unit) {
    //     if (this.uses === 0) {
    //         // do nothing
    //     } else {
    //         let hero = this.curNode.data.dungeonRoom.unit.filter(
    //             u => typeof(u.dodge) !== "undefined" && u.dodge !== null
    //         )[0];
    //         this.curNode.data.dungeonRoom.unit = this.curNode.data.dungeonRoom.unit.filter(
    //             u => typeof(u.dodge) == "undefined" || u.dodge == null
    //         );
    //         let randomNode = this.tree.getRandomNode();
    //         hero.room =  randomNode;
    //         randomNode.data.dungeonRoom.unit.push(hero);
    //         //access singleton roomtree here and get a random room in the range, then move the unit to that room
    //         this.uses -= 1
    //     }
    // }
}

export {Trap, TeleporterTrap}
