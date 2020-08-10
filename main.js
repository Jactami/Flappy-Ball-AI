var canvas;
const HEIGHT = 500;
const WIDTH = 800;
var score = 0;
var lastscore = 0;
var highscore = 0;
var agents = [];
var pipes = [];
const GRAVITY = 0.4;
const GAP = HEIGHT * 0.3;
const TOTAL = 300;
var genCounter = 1;
var gameLost;
var gamePaused = true;
var rate;

function preload() {
    // start and stop game by pressing SPACE
    document.addEventListener("keydown", function (e) {
        if (e.key === " " && !e.repeat) {
            gamePaused = !gamePaused;
        }
    });

    rate = document.getElementById("rateSlider");
    // update rate info
    rate.addEventListener("input", function (e) {
        document.getElementById("rateVal").innerHTML = rate.value;
    });

    // initial setup call
    setup();
}

// create background, initial population and first pipe + reset if population failed
function setup() {
    canvas = d3.select('body')
        .insert('svg', ':first-child')
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    canvas.append("rect")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("fill", "lightblue");

    //initial population
    if (agents.length === 0) {
        for (let i = 0; i < TOTAL; i++) {
            agents[i] = new Agent(WIDTH / 8, HEIGHT / 2);
        }
    }
    for (let i = 0; i < TOTAL; i++) {
        agents[i].show();
    }

    pipes = [];
    pipes.push(new Pipe());
    pipes[0].show();

    score = 0;
    gameLost = false;

    // setup user information
    document.getElementById("rate").innerHTML = "Simulation Rate: ";
    document.getElementById("rateVal").innerHTML = rate.value;
    document.getElementById("highScore").innerHTML = "Highscore: " + highscore;
    document.getElementById("lastScore").innerHTML = "Last Score: " + lastscore;
    document.getElementById("currentScore").innerHTML = "Current Score: " + score;
    document.getElementById("gen").innerHTML = "Generation: " + genCounter;
    document.getElementById("population").innerHTML = "Population Size: " + agents.length + " of " + TOTAL;

    // start simulation
    play();
}

// handle game logic
// perhaps refactor to avoid multiple agents[i] calls
function play() {
    // skip game logic and move straight to requestAnimFrame if game is paused
    if (!gamePaused) {
        // speed up the learning process
        for (let k = 0; k < rate.value; k++) {
            // stop execution if entire population failed
            if (gameLost) return;
            //agents falling + moving
            for (let i = agents.length - 1; i >= 0; i--) {
                agents[i].think(pipes);
                agents[i].update();
                //check if agent moves offscreen
                if (agents[i].offScreen()) {
                    dropAgent(i);
                    continue;
                }
                for (let j = pipes.length - 1; j >= 0; j--) {
                    //detect collision
                    if (agents[i].x + agents[i].r > pipes[j].x && agents[i].x - agents[i].r < pipes[j].x + pipes[j].size) {
                        if (agents[i].y - agents[i].r < pipes[j].upperHeight || agents[i].y + agents[i].r > pipes[j].lowerY) {
                            dropAgent(i);
                            continue;
                        }
                    }
                    //increase score if agent passes a pipes
                    if (agents[i].x > pipes[j].x + pipes[j].size && !pipes[j].passed.includes(agents[i])) {
                        agents[i].score++;
                        document.getElementById("currentScore").innerHTML = "Current Score: " + agents[i].score;
                        pipes[j].passed.push(agents[i]);
                    }
                }
            }
            //pipes moving
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].update();
                //create new pipes
                if (pipes[i].x < WIDTH * 0.6 && !pipes[i].checked) {
                    let pipe = new Pipe();
                    pipe.show();
                    pipes.push(pipe);
                    pipes[i].checked = true;
                }
                //delete pipes
                if (pipes[i].offScreen()) {
                    pipes[i].delete()
                    pipes.shift(i, 1);
                }
            }
        }
    }
    // create loop  
    if (!gameLost) requestAnimationFrame(play);
}

// delete an agent that failed
function dropAgent(index) {
    let agent = agents[index];
    agents[index].delete();
    agents.splice(index, 1);
    document.getElementById("population").innerHTML = "Population Size: " + agents.length + " of " + TOTAL;
    // population failed
    if (agents.length === 0) {
        gameLost = true;
        lastscore = agent.score;
        if (agent.score > highscore) {
            highscore = agent.score;
        }
        // STEP1: Selection: choose last survivor (no fitness calculation etc.)
        nextGen(agent);
    }
}

// the genetic part
function nextGen(father) {
    genCounter++;
    // STEP2: Heredity: make new population (no crossover)
    // clone father to avoid worsening
    agents[0] = new Agent(WIDTH / 8, HEIGHT / 2, father.network);
    // create children
    for (let i = 1; i < TOTAL; i++) {
        agents[i] = new Agent(WIDTH / 8, HEIGHT / 2, father.network);
        // STEP3: Mutation/ Variation
        agents[i].mutate();
    }
    // reset game
    setTimeout(function () {
        canvas.remove();
        setup();
    }, 1);
}