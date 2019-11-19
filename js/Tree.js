class Tree {
    constructor(world, row, col) {
        this.world = world;
        this.row = row;
        this.col = col;
        this.burning = false;
    }

    // Random chance to ignite
    randomly_ignites() {
        if (Math.random() < this.world.ignition_rate) {
            console.log('ignition')
            return true;
        }
        else {
            return false;
        }
    }

    // Tree catches fire
    ignite() {
        this.burning = true;
    }

    // Tree ceases to exist
    die() {

    }
}