// Size of each grid cell in pixels
const grid_size = 10;

const DEBUG_MODE = false;

let world = generate_world();

// P5 Canvas
let canv;

// Currently displayed frame (0 = current)
let cache_position = 0;
// List of trees to draw (used to draw cached trees or current trees)
let draw_trees = [];

let click_to_ignite_active = false;

let playing = true;


// Create and populate the world grid based on window size
function generate_world() {
    const rand_seed = get_random_seed();
    Math.seedrandom(rand_seed);

    // Default world parameters
    let starting_density = 0.01;
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
    canv = createCanvas(world.cols * grid_size, world.rows * grid_size);
    // Put the canvas in the container div
    canv.parent("container");
    noStroke();
    // Default to info window off
    toggle_info_window();
}

function draw() {
    noStroke();
    frameRate(60);

    if (DEBUG_MODE) {
        console.log(frameRate());
    }

    if (playing) {
        // If in the cache instead of live
        if (cache_position) {
            // Load the next cache trees
            load_cache(-1);
        }
        // If playing live
        else {
            world.step(frameCount);
            // If playing live, draw the live trees
            draw_trees = world.trees;
        }
    }

    // Draw the current trees (cached or live)
    draw_frame(draw_trees);

    // Update the year display
    let year_form = document.getElementById("year-form");
    year_form.value = world.year - cache_position;

    // Update parameters from sliders
    update_parameters();
}

// Update parameters based on slider values
function update_parameters() {
    world.ignition_rate = ignition_rate.element.value;
    world.sprout_rate = sprout_rate.element.value;
}

// Draw background and all trees
function draw_frame(trees) {
    // Dirt
    background(50, 30, 0);

    // Slice to create a copy, reverse so that young trees are drawn underneath old trees
    trees.slice().reverse().forEach(function (tree) {
        draw_tree(tree);
    });

    // Find the tree closest to the mouse position
    let mouse_tree = world.get_closest_tree(Math.ceil(mouseY / grid_size), Math.ceil(mouseX / grid_size), 1);
    // If there was a tree found within the search distance of the mouse
    if (mouse_tree) {
        // Draw an outline around the tree at the mouse position
        draw_tree_outline(mouse_tree);

        // Update the tree info dropdown with that tree's details
        update_tree_details(mouse_tree);
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
    if (click_to_ignite_active) {
        // Red outline
        stroke(255, 0, 0);
        // Reddish fill
        fill(255, 0, 0, 100);
    }
    else {
        // White
        stroke(255);
    }

    polygon(tree.col * grid_size, tree.row * grid_size, Math.sqrt(tree.age / 6), 6);
}

// Update the tree info dropdown forms with the details of a tree
function update_tree_details(tree) {
    document.getElementById("info-age").value = tree.age;
    document.getElementById("info-height").value = tree.height.toFixed(2);
    document.getElementById("info-resistance").value = tree.fire_resistance.toFixed(2);
}

// Create a polygon shape with n sides
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

// Load trees to draw from the cache relative to the current cache position
function load_cache(position) {
    cache_position += position;
    draw_trees = world.tree_cache[cache_position];
}

// Python style range function that returns list of ints between two values
function range(start, end, increment = 1) {
    let range_array = [];
    for (let i = start; i < end; i += increment) {
        range_array.push(i);
    }
    return range_array;
}

// Return either the value of the random seed form or the current date if empty
function get_random_seed() {
    // Get random seed value from input form
    let rand_seed = document.getElementById("random-seed-form").value;

    // If no random seed is given, use the current time
    if (!rand_seed) {
        rand_seed = Date.now();
    }

    return rand_seed;
}