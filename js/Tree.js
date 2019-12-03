class Tree {
    constructor(world, row, col, age) {
        this.world = world;
        this.row = row;
        this.col = col;
        this.burning = false;
        // Number of rounds the tree has been burning for
        this.burn_rounds = 0;
        // Current age in years
        this.age = age;
        // Current height
        this.height = this.age * 2;
        // Max variation in max height between trees
        this.height_variation = 30;
        // Max height in meters
        this.max_height = 100 + Math.random() * this.height_variation;
        // Random chance for tree to die every round
        this.mortality_chance = 0.00001
        // Meters of height growth per frame
        this.growth_rate = 0.5;
        // Meters of seed dispersal per meter of height
        this.seed_range_per_height = 0.1
        // Minimum age in years before reproducing
        this.reproductive_maturity = 10;
        // Probability that tree won't catch fire (increases with age)
        this.fire_resistance = (this.age + 1) * 0.01;
        this.max_fire_resistance = 0.8;
        // Percent that fire resistance increases every year of age
        this.fire_resistance_increase = 0.001;
        // Probability of seed successfully creating a new tree
        this.seed_viability_rate = 0.01;
        // Random color variation to make visualization more interesting
        this.color_variation = Math.random() * 50;

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
        if (this.fire_resistance < this.max_fire_resistance) {
            this.fire_resistance += this.fire_resistance_increase;
        }
    }

    // Random chance to resist fire
    resists_fire() {
        if (Math.random() < this.fire_resistance) {
            return true;
        }
        return false;
    }

    // Random chance to ignite (if mature)
    randomly_ignites() {
        // Random chance to catch fire
        if (Math.random() < this.world.ignition_rate && this.age > this.reproductive_maturity) {
            return true;
        }
        return false;
    }

    // Tree catches fire
    ignite() {
        this.burning = true;
    }

    // Chance for tree to randomly die
    randomly_dies() {
        if (Math.random() < this.mortality_chance) {
            return true;
        }
        return false;
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