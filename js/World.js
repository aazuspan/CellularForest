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


    // Ignite a tree when it is clicked on (or the closest tree)
    ignite_at_mouse() {
        const target_row = Math.ceil(mouseY / grid_size);
        const target_col = Math.ceil(mouseX / grid_size);
        try {
            world.array[target_row][target_col].ignite();
        }
        // If there isn't a tree at that location
        catch (TypeError) {
            // Try to find a nearby tree to ignite
            const closest_tree = world.get_closest_tree(target_row, target_col, 2);
            // If a tree was found within the search_distance, ignite it
            if (closest_tree) {
                closest_tree.ignite();
            }
        }
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

    // Return the closest tree to a coordinate within a specified search distance
    get_closest_tree(row, col, search_distance) {
        // Working list of all trees within the search distance
        let trees = [];

        // Find all trees within the search distance
        for (let row_offset of range(-search_distance, search_distance)) {
            for (let col_offset of range(-search_distance, search_distance)) {
                // If neighbour is in bounds, add it if it's a tree
                try {
                    let neighbour = this.array[row + row_offset][col + col_offset];
                    if (neighbour instanceof Tree) {
                        trees.push(neighbour)
                    }
                }
                catch { }
            }
        }

        // Track tree object and its distance from the coordinate so distance only has to be calculated once
        let closest_tree = { tree: null, distance: null };

        trees.forEach(function (tree) {
            // Calculate rough distance from the neighbour tree to the coordinate
            let tree_distance = tree.world.get_rough_distance(col, row, tree.col, tree.row);

            // If it is the first tree checked or if it is closer than previous checked trees
            if (!closest_tree.tree || tree_distance < closest_tree.distance) {
                closest_tree.tree = tree;
                closest_tree.distance = tree_distance;
            }
        })
        return closest_tree.tree;
    }

    // Return rough Euclidean distance between two points
    get_rough_distance(x0, y0, x1, y1) {
        // Don't bother taking square root because I'm only comparing distances and don't need accurate distance
        return (x0 - x1) ** 2 + (y0 - y1) ** 2;
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

