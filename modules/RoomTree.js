const direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

class RoomNode {
    children = {
        up: null,
        down: null,
        left: null,
        right: null
    };

    constructor(parent, height, width, data, y, x) {
        this.parent = parent;
        this.height = height;
        this.width = width;
        this.data = data;
        this.y = y
        this.x = x;
    }

    get neighbours() {
        return this.children;
    }

    addRoom(grid, dir, data) {
        if (dir == direction.up) {
            if (this.y - 1 < 0) {
                console.error("Out of grid upwards.");
                return null;
            }

            this.children.up = new RoomNode(this, this.height, this.width, data, this.y-1, this.x);
            grid[this.y-1][this.x] = this.children.up;
            return this.children.up;
        } else if (dir == direction.down) {
            if (this.y + 1 > grid.length - 1) {
                console.error("Out of grid downwards.");
                return null;
            }

            this.children.down = new RoomNode(this, this.height, this.width, data, this.y+1, this.x);
            grid[this.y+1][this.x] = this.children.down;
            return this.children.down;
        } else if (dir == direction.left) {
            if (this.x - 1 < 0) {
                console.error("Out of grid leftwards.");
                return null;
            }

            this.children.left = new RoomNode(this, this.height, this.width, data, this.y, this.x-1);
            grid[this.y][this.x-1] = this.left;
            return this.left;
        } else if (dir == direction.right) {
            if (this.x + 1 > grid[0].length - 1) {
                console.error("Out of grid rightwards.");
                return null;
            }

            this.children.right = new RoomNode(this, this.height, this.width, data, this.y, this.x+1);
            grid[this.y][this.x+1] = this.children.right;
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

    constructor(height, width, grid) {
        this.#height = height;
        this.#width = width;
        this.grid = grid; 
        this.root = null;
    }

    makeRoot(row, col) {
        this.root = new RoomNode(null, this.#height, this.#width, null, row, col);
        this.grid[row][col] = this.root;
    }

    // NOTE: May not need to be static
    getRoomNodePath(start, end) {
        const queue = [start];
        const parent = new Map();
        const visited = new Set([]);

        while (Array.isArray(queue) && queue.length) {
            let node = queue.shift();

            if (node === end) {
                let path = [end];

                while (path[-1] !== start) {
                    path.unshift(parent.get(path[-1]));
                }

                return path;
            }

            if (!visited.has(node)) {
                visited.add(node);

                for (let i = 0; i < 4; ++i) {
                    let child = node.neighbours[i];

                    if (child != null && !visited.has(child)) {
                        parent.set(child, node);
                        queue.push(child);
                    }
                }
            }
        }

        return false;
    }

    maxDepth() {
        let maxDepth = 0;
        const queue = [[this.root, 1]];
        const visited = new Set([]);

        while (Array.isArray(queue) && queue.length) {
            let [node, depth] = queue.shift();
            maxDepth = Math.max(depth, maxDepth);

            if (!visited.has(node)) {
                visited.add(node);

                for (let child in node.neighbours) {

                    if (child != null && !visited.has(child)) {
                        visited.add(child);
                        queue.push([child, depth+1]);
                    }
                }
            }
        }

        return maxDepth;
    }

    getRandomNode(start) {
        let length = Math.floor(Math.random * maxDepth());
        let distance = 0;
        const stack = [start];
        const visited = new Set([]);
        const path = [start];

        while (Array.isArray(stack) && stack.length) {
            let node = stack.pop();

            if (distance == length) {
                return path;
            }

            if (!visited.has(node)) {
                visited.add(node);
                let nodes = [...node.neighbours, node.parent];
                let direction = Math.floor(Math.random() * 5);
                let n = nodes[direction];

                if (n != null && !visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                    path.push(n);
                }
            }

            distance += 1;
        }
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

    maxDepth() {
        let maxDepth = 0;
        const queue = [[this.root, 1]];
        const visited = new Set([]);

        while (Array.isArray(queue) && queue.length) {
            let [node, depth] = queue.shift();
            maxDepth = Math.max(depth, maxDepth);

            if (!visited.has(node)) {
                visited.add(node);

                for (let child in node.neighbours) {

                    if (child != null && !visited.has(child)) {
                        visited.add(child);
                        queue.push([child, depth+1]);
                    }
                }
            }
        }

        return maxDepth;
    }

    getRandomNode(start) {
        let length = Math.floor(Math.random * maxDepth());
        let distance = 0;
        const stack = [start];
        const visited = new Set([]);
        const path = [start];

        while (Array.isArray(stack) && stack.length) {
            let node = stack.pop();

            if (distance == length) {
                return path;
            }

            if (!visited.has(node)) {
                visited.add(node);
                let nodes = [...node.neighbours, node.parent];
                let direction = Math.floor(Math.random() * 5);
                let n = nodes[direction];

                if (n != null && !visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                    path.push(n);
                }
            }

            distance += 1;
        }
    }
}

export { RoomTree, RoomNode, direction };
