function randomProgenetion(selectedBrains, numberOfChildren, generatedChildren, numberOfSelectedBrains) {
    while(numberOfChildren > generatedChildren) {
        const i = Math.floor(random() * numberOfSelectedBrains);
        const j = Math.floor(random() * numberOfSelectedBrains);
        cars[generatedChildren].brain = JSON.parse(JSON.stringify(selectedBrains[i]));
        cars[generatedChildren + 1].brain = JSON.parse(JSON.stringify(selectedBrains[j]));
        if (i != j)
            NeuralNetwork.crossover(cars[generatedChildren].brain, cars[generatedChildren + 1].brain, crossoverProbability);
        generatedChildren += 2;
    }
}

function linearProgenation(selectedBrains, numberOfChildren, generatedChildren, numberOfSelectedBrains) {
    let i = 0;
    let j = 0;
    while(numberOfChildren > generatedChildren) {
        cars[generatedChildren].brain = JSON.parse(JSON.stringify(selectedBrains[i]));
        cars[generatedChildren + 1].brain = JSON.parse(JSON.stringify(selectedBrains[j]));
        if (i != j)
            NeuralNetwork.crossover(cars[generatedChildren].brain, cars[generatedChildren + 1].brain, crossoverProbability);
        generatedChildren += 2;
        i += 1;
        if (i == numberOfSelectedBrains) {
            j = (j + 1) % numberOfSelectedBrains;
            i = 0;
        }
    }
}