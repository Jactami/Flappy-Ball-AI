# Flappy Ball AI
An AI playing a clone of the famous game _Flappy Bird_ in JavaScript. This project makes use of [d3.js](https://d3js.org/) and a [neural network library](https://github.com/CodingTrain/Toy-Neural-Network-JS) by Daniel Shiffman. The entire work was also heavily inspired by a [similar project](https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_100.5_NeuroEvolution_FlappyBird/P5) from Daniel Shiffman.

## How does the AI work?
The AI is based on a neural network that decides for each frame if an agent should jump or sink. These networks are refined by a simplified genetic algorithm that tries to improve its performance over the course of several iterations. The algorithm follows a strict sequence: 

1. **Initialization**: Before the game starts, 300 agents are generated to play simultaneously. Their neural networks are completely randomly initialized.
2. **Selection**: The agent which last the longest, i.e. it managed to get the furthest in the level, is chosen as the fittest neural network. It builds the basis for the reproduction step.
3. **Mutation**:  The seleceted agent is used to reproduce the population. However, the weigths of the new neural networks are randomly modified by a slight amount. Some of the agents in this new set improve their performance while other get worse.

Step 2 and 3 are repeated indefinitely. After each round only the fittest agent will survive and reproduce. Therefore agents become more adapted to the game with each generation and perform better results.

## TODOs/ ideas for possible future implementations
- export and import of neural networks
- elaborate genetic algorithm (e.g. calculation of a fitting value and crossover are standard procedures in a genetic algorithm, but are ommitted in the current approach)