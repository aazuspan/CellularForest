// Size of each grid cell in pixels
const grid_size = 10;

const DEBUG_MODE = false;

const world = generate_world();


// Create and populate the world grid based on window size
function generate_world() {
    // Default world parameters
    let starting_density = 0.001;
    let ignition_rate = 0.000001;

    if (DEBUG_MODE) {
        starting_density = 1;
        ignition_rate = 0;
    }

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
    canv.mouseClicked(world.ignite_at_mouse);
    noStroke();
}


// Python style range function that returns list of ints between two values
function range(start, end, increment = 1) {
    let range_array = [];
    for (let i = start; i < end; i += increment) {
        range_array.push(i);
    }
    return range_array;
}

function draw() {
    noStroke();
    frameRate(60);
    if (DEBUG_MODE) {
        console.log(frameRate());
    }
    // Dirt
    background(50, 30, 0);

    world.step(frameCount);

    // Slice to create a copy, reverse so that young trees are drawn underneath old trees
    world.trees.slice().reverse().forEach(function (tree) {
        draw_tree(tree);
    });

    // Find the tree closest to the mouse position
    let mouse_tree = world.get_closest_tree(Math.ceil(mouseY / grid_size), Math.ceil(mouseX / grid_size), 1);
    // If there was a tree found within the search distance of the mouse, draw an outline around that tree
    if (mouse_tree) {
        draw_tree_outline(mouse_tree);
    }
}

// Draw a polygon for a tree based on whether it is burning or not
function draw_tree(tree) {
    // Trees
    if (tree.burning) {
        fill(255 - 55 * tree.burn_rounds, 200 - 55 * tree.burn_rounds, 0);
    }
    // Non burning trees
    else {
        fill(tree.color_variation, 50 + tree.height - tree.color_variation, 50 - tree.color_variation);
    }
    polygon(tree.col * grid_size, tree.row * grid_size, Math.sqrt(tree.age / 6), 6);
}

// Draw an outline around the tree at the mouse position
function draw_tree_outline(tree) {
    stroke(255, 0, 0);
    fill(255, 0, 0, 100);
    polygon(tree.col * grid_size, tree.row * grid_size, Math.sqrt(tree.age / 6), 6);
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