class Pipe {
    constructor() {
        this.upperPipe;
        this.lowerPipe;
        this.x = WIDTH + 1;
        this.size = WIDTH * 0.05;
        this.upperY = 0;
        this.lowerY = Math.floor(((Math.random() * 0.5) + 0.1) * HEIGHT) + GAP;
        this.upperHeight = this.lowerY - 150;
        this.lowerHeight = HEIGHT - this.lowerY;
        this.vel = 5;
        this.checked = false;
        this.passed = [];
    }

    // display pipe on screen
    show() {
        //upper pipe
        this.upperPipe = canvas.append("rect")
            .attr("class", "pipe")
            .attr("x", this.x)
            .attr("y", this.upperY)
            .attr("height", this.upperHeight)
            .attr("width", this.size)
            .attr("fill", "gray")
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        //lower pipe
        this.lowerPipe = canvas.append("rect")
            .attr("class", "pipe")
            .attr("x", this.x)
            .attr("y", this.lowerY)
            .attr("height", this.lowerHeight)
            .attr("width", this.size)
            .attr("fill", "gray")
            .attr("stroke-width", 2)
            .attr("stroke", "black");
    }

    // move pipes according to its velocity
    update() {
        this.x -= this.vel;
        this.upperPipe.attr("x", this.x);
        this.lowerPipe.attr("x", this.x);
    }

    // remove pipe from screen
    delete() {
        this.upperPipe.remove();
        this.lowerPipe.remove();
    }

    // return true if pipe is off screen, false otherwise
    offScreen() {
        return this.x + this.size < 0;
    }

    // change color of pipe
    highlight() {
        this.upperPipe.attr("fill", "purple");
        this.lowerPipe.attr("fill", "purple");
    }
}