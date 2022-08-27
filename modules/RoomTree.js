class RoomNode {
    left = null;
    middle = null;
    right = null;

    constructor(parent, height, width, data, depth, col) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.depth = depth
        this.col = col;
    }

    get neighbours() {
        return [this.left, this.middle, this.right];
    }

    addRoom(grid, direction, data) {
        if (direction == 0) {
            if (this.col - 1 < 0) {
                console.error("Out of grid to the left.");
                return null;
            }

            this.left = new RoomNode(this, this.height, this.width, data, this.depth + 1);
            grid[this.depth][this.col-1] = this.left;
            return this.left;
        } else if (direction == 1) {
            if (this.depth + 1 > grid.length - 1) {
                console.error("Out of grid to the bottom.");
                return null;
            }

            this.middle = new RoomNode(this, this.height, this.width, data, this.depth + 1);
            grid[this.depth+1][this.col] = this.middle;
            return this.middle;
        } else if (direction == 2) {
            if (this.col + 1 > grid[0].length - 1) {
                console.error("Out of grid to the right.");
                return null;
            }

            this.right = new RoomNode(this, this.height, this.width, data, this.depth + 1);
            grid[this.depth][this.col+1] = this.right;
            return this.right;
        } else {
            return null;
        }
    }
}

// NOTE: Grid generation is not implemented.
class RoomTree {
    #height = 0;
    #width = 0;
    root = null;

    constructor(height, width, grid) {
        this.#height = height;
        this.#width = width;
        this.grid = grid; // Starting node it always in 0th row but column is arbitrary.
    }

    // TODO: Don't hardcode to only be in 0th row.
    set makeRoot(col) {
        this.root = new RoomNode(null, this.#height, this.#width, null, 0, col);
        this.grid[0][col] = this.root;
    }

    getRoomNode(direction, depth) {
        const q = [this.root];
        const v = new Set([]);

        if (depth == 0) {
            return this.root;
        } 

        while (typeof q != "undefined" && q != null && q.length != null && q.length > 0) {
            let n = q.pop();

            if (n.level == depth) {
                switch (direction) {
                    case 0:
                        if (n.parent.left != null) { return n.parent.left; }
                    case 1:
                        if (n.parent.middle != null) { return n.parent.middle; } 
                    case 2:
                        if (n.parent.right != null) { return n.parent.right; }
                    default:
                        return false;
                }
            }

            if (!v.has(n)) {
                v.add(n);

                for (let i = 0; i < 3; ++i) {
                    if (n.neighbours[i] != null && !v.has(n.neighbours[i])) {
                        q.push(n.neighbours[i]);
                    }
                }
            }
        }

        return false;
    }
}

export { RoomTree, RoomNode };
