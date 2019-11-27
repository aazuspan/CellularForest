const rows = 320;
const cols = 400;
// Size of each grid cell in pixels
const grid_size = 5;

const world = generate_world();

// Create and populate the world grid based on window size
function generate_world() {
    // Default world parameters
    const starting_density = 0.001;
    const ignition_rate = 0.000001;

    // Get current window size
    const width = window.innerWidth;
    const height = window.innerHeight;

    // TODO: Use the size of the content div container to exclude the navbar
    // Calculate number of rows and cols in the grid based on window size
    const rows = Math.ceil(height / grid_size);
    const cols = Math.ceil(width / grid_size);

    const new_world = new World(rows, cols, starting_density, ignition_rate)
    new_world.populate();

    return new_world
}


function setup() {
    const canv = createCanvas(world.cols * grid_size, world.rows * grid_size);
    // Create event listener for clicking to start a fire
    canv.mouseClicked(ignite_at_mouse);
    noStroke();
}


// Ignite a tree when it is clicked on
function ignite_at_mouse() {
    const target_row = Math.ceil(mouseY / grid_size);
    const target_col = Math.ceil(mouseX / grid_size);
    try {
        world.array[target_row][target_col].ignite();
    }
    // If there isn't a tree at that location
    catch (TypeError) {
        // Try to find a nearby tree to ignite
        const closest_tree = get_closest_tree(target_row, target_col, 10);
        // If a tree was found within the search_distance, ignite it
        if (closest_tree) {
            closest_tree.ignite();
        }
    }
}

// TODO: Implement this
// Return the closest tree to a coordinate within a specified search distance
function get_closest_tree(row, col, search_distance) {

}

function draw() {
    frameRate(60);
    // Dirt
    background(50, 30, 0);

    world.step(frameCount);

    // Slice to create a copy, reverse so that young trees are drawn underneath old trees
    world.trees.slice().reverse().forEach(function (tree) {
        // Trees
        if (tree.burning) {
            fill(255 - 55 * tree.burn_rounds, 200 - 55 * tree.burn_rounds, 0);
        }
        // Non burning trees
        else {
            fill(tree.color_variation, 50 + tree.height - tree.color_variation, 50 - tree.color_variation);
        }
        //ellipse(tree.col * grid_size, tree.row * grid_size, Math.sqrt(tree.height), Math.sqrt(tree.height));
        polygon(tree.col * grid_size, tree.row * grid_size, Math.sqrt(tree.age / 4), 6);
    })
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}