const rows = 300;
const cols = 300;
const scale_factor = 2;

world = new World(rows, cols, 0.5, 0.000001);
world.populate();


function setup() {
    createCanvas(cols * scale_factor, rows * scale_factor);
}

function draw() {
    // Dirt
    background(100, 50, 0);
    noStroke();
    world.step(frameCount);

    world.trees.forEach(function (tree) {
        // Trees
        if (tree.burning) {
            fill(255, 200, 0);
        }
        // Non burning trees
        else {
            fill(0, 255 - tree.height, 50);
        }
        rect(tree.col * scale_factor, tree.row * scale_factor, scale_factor, scale_factor);
    })
}