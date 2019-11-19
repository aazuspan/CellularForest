class World {
    constructor(rows, cols, starting_density = 0.5, ignition_rate = 0.001) {
        this.rows = rows;
        this.cols = cols;
        // Initial tree density as a proportion of land cover (0-1)
        this.starting_density = starting_density;
        // Probability of a tree randomly igniting
        this.ignition_rate = ignition_rate;
        // 2D array of cells within the world
        this.array = this.build();
        // List of cells in the world (uninfected or infected)
        this.trees = [];
    }

    // Create an empty 2D array
    build() {
        let zero_array = [];
        // Create rows
        for (let row = 0; row < this.rows; row++) {
            let row_array = [];
            // Fill rows with nothing
            for (let col = 0; col < this.cols; col++) {
                row_array.push(null);
            }
            zero_array.push(row_array);
        }
        return zero_array;
    }

    // Populate the world with trees
    populate() {
        // List of empty cell coordinates in the array
        let available_coords = []

        // Calculate number of starting trees based on starting density
        const tree_count = (this.rows * this.cols) * this.starting_density;

        // Make the list of available coords from the empty initial array
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                available_coords.push([row, col]);
            }
        }

        // Create trees
        for (let i = 0; i < tree_count; i++) {
            // Index of a randomly chosen available coordinate
            let random_coord_index = Math.floor(Math.random() * available_coords.length);
            // Get the random coordinate
            let random_coord = available_coords[random_coord_index];
            // Remove the coord from available coords
            available_coords.splice(random_coord_index, 1);
            // Choose a random starting age for the tree
            let random_age = Math.floor(Math.random() * 50);
            // Create the tree
            let new_tree = new Tree(this, random_coord[0], random_coord[1], random_age);
            // Place the tree in the world
            this.array[random_coord[0]][random_coord[1]] = new_tree;
            this.trees.push(new_tree);
        }
    }

    // Check if a given coordinate is within the array
    is_out_of_bounds(row, col) {
        if (row < 0 || row > this.rows - 1 || col < 0 || col > this.cols - 1)
            return true;
        return false;
    }

    // Return a list of trees within the Moore neighborhood of a coordinate
    get_tree_neighbours(row, col) {
        const MOORE_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        let neighbours = [];

        // Check each neighbour position
        for (let i = 0; i < MOORE_OFFSETS.length; i++) {
            // If the neighbour is within the array
            if (!this.is_out_of_bounds(row + MOORE_OFFSETS[i][0], col + MOORE_OFFSETS[i][1])) {
                let neighbour = this.array[row + MOORE_OFFSETS[i][0]][col + MOORE_OFFSETS[i][1]];
                // If neighbour isn't empty
                if (neighbour) {
                    neighbours.push(neighbour);
                }
            }
        }
        return neighbours;
    }

    // Return a list of coordinates within the Moore neighborhood
    get_neighbours(row, col) {
        const MOORE_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        let neighbours = [];

        // Check each neighbour position
        for (let i = 0; i < MOORE_OFFSETS.length; i++) {
            let neighbour_coord = [row + MOORE_OFFSETS[i][0], col + MOORE_OFFSETS[i][1]]
            // If the coordinate is within the array
            if (!this.is_out_of_bounds(neighbour_coord[0], neighbour_coord[1])) {
                neighbours.push(neighbour_coord);
            }
        }
        return neighbours;
    }

    // Simulate a period of time in the world
    step(frameCount) {
        this.trees.forEach(function (tree) {
            // Burning trees
            if (tree.burning) {
                let neighbour_trees = tree.world.get_tree_neighbours(tree.row, tree.col);
                // Catch all neighbour trees on fire
                neighbour_trees.forEach(function (neighbour) {
                    neighbour.ignite();
                })

                // Tree will burn for 1 round without dying
                if (tree.burn_rounds > 1) {
                    tree.die();
                }
                else {
                    tree.burn_rounds += 1;
                }
            }
            // Not burning trees
            else {
                tree.grow();
                tree.get_older();
                tree.release_seeds();
                // Chance for tree to randomly ignite
                if (tree.randomly_ignites()) {
                    tree.ignite();
                }
            }
        })
    }
}

