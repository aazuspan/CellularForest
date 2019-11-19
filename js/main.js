const rows = 200;
const cols = 200;
const scale_factor = 3;

world = new World(rows, cols, 0.5, 0.0000001);
world.populate();


function setup() {
    createCanvas(cols * scale_factor, rows * scale_factor);
}

function draw() {
    background(100, 50, 0);
    noStroke();
    world.step();

    world.trees.forEach(function (tree) {
        if (tree.burning) {
            fill(255, 200, 0);
        }
        else {
            fill(0, 255, 50);
        }
        rect(tree.col * scale_factor, tree.row * scale_factor, scale_factor, scale_factor);
    })
}