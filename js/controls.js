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
    if (cache_position < world.tree_cache.length - 1) {
        // Move back in the cache of tree states
        load_cache(1);
    }
}

// Draw the next frame of the simulation, either live or from the cache
function next_frame() {
    pause();

    // If the user is moving through the cache instead of playing live
    if (cache_position) {
        // Move forward in the cache of tree states
        load_cache(-1);
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

// Button listeners to toggle controls
document.getElementById("play-button").addEventListener("click", play);
document.getElementById("pause-button").addEventListener("click", pause);
document.getElementById("prev-button").addEventListener("click", prev_frame);
document.getElementById("next-button").addEventListener("click", next_frame);

// When reset button is clicked, pause world and launch modal to confirm
document.getElementById("reset-check-button").addEventListener("click", pause);
// If confirmed, reset the world
document.getElementById("reset-confirm-button").addEventListener("click", reset);
// If cancelled, start playback again
document.getElementById("reset-cancel-button").addEventListener("click", play);
document.getElementById("ignite-button").addEventListener("click", toggle_ignition);
document.getElementById("info-button").addEventListener("click", toggle_info_window);



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