class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        random()*2-1,
                        amount
                    )
                }
            }
        });
    }

    static crossover(network1, network2, crossProb) {
        const levelCount = network1.levels.length;
        for (let i = 0; i < levelCount; i++) {
            const x = random();
            if (crossProb > x) {
                for(let j=0;j< network1.levels[i].biases.length;j++){
                    [network1.levels[i].biases[j], network2.levels[i].biases[j]] = [network2.levels[i].biases[j], network1.levels[i].biases[j]]
                }
                for(let j=0;j<network1.levels[i].weights.length;j++){
                    for(let k=0;k<network1.levels[i].weights[j].length;k++){
                        [network1.levels[i].weights[j][k], network2.levels[i].weights[j][k]] = [network2.levels[i].weights[j][k], network1.levels[i].weights[j][k]]
                    }
                }
            }
        }
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }
}

class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}