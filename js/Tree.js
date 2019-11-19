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
        // Meters of seed dispersal per meter of height
        this.seed_range_per_height = 0.1
        // Minimum age in years before reproducing
        this.reproductive_maturity = 10;
        // Probability of seed successfully creating a new tree
        this.seed_viability_rate = 0.01;
    }

    // Release a seed into a random neighour cell
    release_seeds() {
        // Don't waste time choosing a seed location if it won't be viable
        if (Math.random() < this.seed_viability_rate) {
            // Calculate seed range based on tree height (plus or minus)
            const seed_range = Math.ceil(this.seed_range_per_height * this.height);

            // Choose random offsets based on seed range
            let rand_row_offset = Math.round(Math.random() * -2 * seed_range + seed_range);
            let rand_col_offset = Math.round(Math.random() * -2 * seed_range + seed_range);

            // Randomly choose where the seed lands within this tree's range
            const rand_row = rand_row_offset + this.row;
            const rand_col = rand_col_offset + this.col;

            if (!this.world.is_out_of_bounds(rand_row, rand_col)) {
                // If there isn't already a tree there
                if (!this.world.array[rand_row][rand_col]) {
                    // Create the new tree
                    let new_tree = new Tree(this.world, rand_row, rand_col, 0);
                    // Place the new tree in the world
                    this.world.array[rand_row][rand_col] = new_tree;
                    // Add it to the world list
                    this.world.trees.push(new_tree);
                }
            }
        }
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