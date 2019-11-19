class World {
    constructor(rows, cols, starting_density = 0.5) {
        this.rows = rows;
        this.cols = cols;
        // Initial tree density as a proportion of land cover (0-1)
        this.starting_density = staring_density;
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
            // Choose a random coordinate
            let random_coord = available_coords[Math.floor(Math.random() * available_coords.length)];
            // Create the tree
            let new_tree = new Tree(this, random_coord[0], random_coord[1]);
            // Place the tree in the world
            this.array[random_coord[0]][random_coord[1]] = new_tree;
            this.trees.push(new_cell);
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

    // Return a list of coordinates within the Moore neighborhood that are empty
    get_empty_neighbours(row, col) {
        const MOORE_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        let neighbours = [];

        // Check each neighbour position
        for (let i = 0; i < MOORE_OFFSETS.length; i++) {
            let neighbour_coord = [row + MOORE_OFFSETS[i][0], col + MOORE_OFFSETS[i][1]]
            // If the coordinate is within the array
            if (!this.is_out_of_bounds(neighbour_coord[0], neighbour_coord[1])) {
                // If the cell is null
                if (!this.array[neighbour_coord[0]][neighbour_coord[1]]) {
                    neighbours.push(neighbour_coord);
                }
            }
        }
        return neighbours;
    }

    // Simulate a period of time in the world
    step() {
    }
}

