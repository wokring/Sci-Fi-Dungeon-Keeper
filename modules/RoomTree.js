const up = 0;
const down = 1;
const left = 2;
const right = 3;

class RoomNode {
    constructor(parent, height, width, data, level, gen) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.level = level
        this.gen = gen;
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
    }

    get neighbours() {
        return this.children;
    }

    addRoom(grid, dir, data) {
        if (dir === up) {
            if (this.level - 1 < 0) {
                console.error("Out of grid upwards.");
                return null;
            }

            this.up = new RoomNode(this, this.height, this.width, data, this.level-1, this.gen);
            grid[this.level-1][this.gen] = this.up;
            return this.up;
        } else if (dir === down) {
            if (this.level + 1 > grid.length - 1) {
                console.error("Out of grid downwards.");
                return null;
            }

            this.down = new RoomNode(this, this.height, this.width, data, this.level+1, this.gen);
            grid[this.level+1][this.gen] = this.down;
            return this.down;
        } else if (dir === left) {
            if (this.gen - 1 < 0) {
                console.error("Out of grid leftwards.");
                return null;
            }

            this.left = new RoomNode(this, this.height, this.width, data, this.level, this.gen-1);
            grid[this.level][this.gen-1] = this.left;
            return this.left;
        } else if (dir === right) {
            if (this.gen + 1 > grid[0].length - 1) {
                console.error("Out of grid rightwards.");
                return null;
            }

            this.right = new RoomNode(this, this.height, this.width, data, this.level, this.gen+1);
            grid[this.level][this.gen+1] = this.right;
            return this.right;
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
                let path = [end];

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

    preOrder(node, array){
        array.push(node);
        node.neighbours().forEach(neighbor => this.preOrder(neighbor, array));
    }

    getRandomNode(){
        let preOrderArray = [];
        this.preOrder(this.root, preOrderArray);
        return preOrderArray[Math.floor(Math.random() * preOrderArray.length)];
    }
}

export { RoomNode,RoomTree };
