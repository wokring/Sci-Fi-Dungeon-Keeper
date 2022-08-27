import BuildDungeon from "./DungeonRoom.js";

const direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

class RoomNode {
    const children = {
        up: null,
        down: null,
        left = null,
        right = null
    };

    constructor(parent, height, width, data, level, gen) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.level = level
        this.gen = gen;
    }

    get neighbours() {
        return this.children;
    }

    addRoom(grid, dir, data) {
        if (dir == direction.up) {
            if (this.level - 1 < 0) {
                console.error("Out of grid upwards.");
                return null;
            }

            this.children.up = new RoomNode(this, this.height, this.width, data, this.level-1, this.gen);
            grid[this.level-1][this.gen] = this.children.up;
            return this.children.up;
        } else if (dir == direction.down) {
            if (this.level + 1 > grid.length - 1) {
                console.error("Out of grid downwards.");
                return null;
            }

            this.children.down = new RoomNode(this, this.height, this.width, data, this.level+1, this.gen);
            grid[this.level+1][this.gen] = this.children.down;
            return this.children.down;
        } else if (dir == direction.left) {
            if (this.gen - 1 < 0) {
                console.error("Out of grid leftwards.");
                return null;
            }

            this.children.left = new RoomNode(this, this.height, this.width, data, this.level, this.gen-1);
            grid[this.level][this.gen-1] = this.children.left;
            return this.children.left;
        } else if (dir== direction.right) {
            if (this.gen + 1 > grid[0].length - 1) {
                console.error("Out of grid rightwards.");
                return null;
            }

            this.children.right = new RoomNode(this, this.height, this.width, data, this.level, this.gen+1);
            grid[this.level][this.gen+1] = this.children.right;
            return this.children.right;
        } else {
            console.error(`Not valid direction specified ${dir}`);
            return null;
        }
    }
}

class RoomTree {
    #height = 0;
    #width = 0;
    root = null;

    constructor(height, width) {
        this.#height = height;
        this.#width = width;
        this.grid = BuildDungeon();
    }

    makeRoot(row, col) {
        this.root = new RoomNode(null, this.#height, this.#width, null, row, col);
        this.grid[row][col] = this.root;
    }

    getRoomNodePath(start, end) {
        const q = [start];
        const parent = new Map();
        const v = new Set([]);

        while (typeof q != "undefined" && q != null && q.length != null && q.length > 0) {
            let n = q.pop();

            if (n === end) {
                path = [end];

                while (path[-1] !== start) {
                    path.push(parent.get(path[-1]));
                }

                path.reverse();
                return path;
            }

            if (!v.has(n)) {
                v.add(n);

                for (let i = 0; i < 4; ++i) {
                    let c = n.neighbours[i];
                    if (c != null && !v.has(c)) {
                        parent.set(c, n);
                        q.push(c);
                    }
                }
            }
        }

        return false;
    }
}

export default RoomTree;
export { RoomNode, direction };
