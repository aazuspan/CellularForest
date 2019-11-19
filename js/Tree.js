class Tree {
    constructor(world, row, col) {
        this.world = world;
        this.row = row;
        this.col = col;
        this.burning = false;
    }

    // Random chance to ignite
    randomly_ignites() {
        if (Math.random() < this.world.ignition_rate) {
            return true;
        }
        else {
            return false;
        }
    }

    // Tree catches fire
    ignite() {
        this.burning = true;
    }

    // Tree ceases to exist
    die() {
        // Remove the tree from the cell
        this.world.array[this.row][this.col] = null;
        // Get the index of this cell in the world
        let tree_index = this.world.trees.findIndex(v => v == this);
        // Delete this cell from the list of world cells
        this.world.trees.splice(tree_index, 1);
    }
}