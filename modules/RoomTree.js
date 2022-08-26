class RoomNode {
    constructor(parent, height, width, data, level) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.level = level

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

class RoomTree {
    constructor(height, width) {
        this.root = new RoomNode(null, height, width, null, 0);
    }
}

export { RoomTree, RoomNode };
