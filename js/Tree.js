class Tree {
    constructor(world, row, col, age) {
        this.world = world;
        this.row = row;
        this.col = col;
        this.burning = false;
        // Current age in years
        this.age = age;
        // Current height
        this.height = this.age * 2;
        // Max height in meters
        this.max_height = 100;
        // Meters of height growth per 60 frames
        this.growth_rate = 2;
    }

    // Grow in height (every 60 years)
    grow() {
        if (this.height < this.max_height) {
            this.height += this.growth_rate;
        }
    }

    // Age 1 year (every 60 frames)
    get_older() {
        this.age += 1;
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