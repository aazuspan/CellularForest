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

    if (playing) {
        world.step(frameCount);
        // If playing live, draw the live trees
        draw_trees = world.trees;
    }

    // Draw the current trees (cached or live)
    draw_frame(draw_trees);
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
    document.getElementById("info-height").value = tree.height;
    document.getElementById("info-resistance").value = tree.fire_resistance.toFixed(2);
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

// Toggle the click to ignite mode and add or remove listeners
function toggle_ignition() {
    if (click_to_ignite_active) {
        canv.mouseClicked(false);
    }
    else {
        // Create event listener for clicking to start a fire
        canv.mouseClicked(world.ignite_at_mouse);
    }

    click_to_ignite_active = !click_to_ignite_active;
}

// Toggle display of the tree info window
function toggle_info_window() {
    const window = document.getElementById("tree-info-window");

    if (window.hidden) {
        window.hidden = false;
    }
    else {
        window.hidden = true;
    }
}

// Start playback if paused
function play() {
    playing = true;
}

// Pause playback
function pause() {
    playing = false;
}

// Load trees from the previous tree cache to draw
function prev_frame() {
    pause();
    if (cache_position < world.max_cache_size) {
        // Move back in the cache of tree states
        cache_position += 1;
    }

    // Set this tree state to draw
    draw_trees = world.tree_cache[cache_position];
}

// Draw the next frame of the simulation, either live or from the cache
function next_frame() {
    pause();

    // If the user is moving through the cache instead of playing live
    if (cache_position) {
        // Move forward in the cache of tree states
        cache_position -= 1
        // Draw that tree state
        draw_trees = world.tree_cache[cache_position];
    }

    // If the user is simulating live
    else {
        world.step();
        draw_trees = world.trees;
    }
}

// Reset the world
function reset() {
    world = generate_world();
    play();
}

// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],

        // call this function on every dragmove event
        onmove: dragMoveListener,
    })

function dragMoveListener(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

