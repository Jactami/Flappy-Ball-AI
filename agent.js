class Agent {
    constructor(x, y, network) {
        this.x = x;
        this.y = y;
        this.r = HEIGHT * 0.03;
        this.vel = 0;
        this.body;
        this.score = 0;
        if (network) {
            this.network = network.copy();
        } else {
            this.network = new NeuralNetwork(4, 8, 1);
        }
    }

    // display agent on screen
    show() {
        this.body = canvas.append("circle")
            .attr("class", "agent")
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.r)
            .attr("fill", "red")
            .attr("stroke-width", 2)
            .attr("stroke", "darkred")
            .attr("opacity", 0.5);
    }

    // move agent according to its velocity
    update() {
        this.vel += GRAVITY;
        this.y += this.vel;
        this.body.attr("cy", this.y);
    }

    // decrease falling speed if agent decides to jump
    move() {
        this.vel = -5;
    }

    // decide if agent should jump
    think(pipes) {
        let inputs = [];
        //find the next pipe
        let nextPipe = pipes[0];
        for (let i = pipes.length - 1; i >= 0; i--) {
            if (this.x - this.r < pipes[i].x) {
                nextPipe = pipes[i];
            }
        }
        // feature extraction: normalized yPos + vel of ball, distance + gapCoordinates of next pipe
        inputs[0] = this.y / HEIGHT;
        inputs[1] = this.vel / 50;
        inputs[2] = nextPipe.x / WIDTH;
        inputs[3] = nextPipe.lowerY / HEIGHT;
        // console.log(inputs);
        let output = this.network.predict(inputs);
        if (output > 0.5) this.move();
        // console.log(output);
    }

    // remove body from screen
    delete() {
        this.body.remove();
    }

    // return true if agent is off screen, false otherwise
    offScreen() {
        return (this.y + this.r > HEIGHT || this.y < this.r);
    }

    // changes the weights of the neural network
    mutate() {
        this.network.mutate(function(val) {
            // maybe be more thoughtful about the changing function
            if (Math.random() < 0.1) {
                return val + (Math.random() * 2 - 1) * 0.5;
            } else {
                return val;
            }
        });
    }
}
