const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);

const N=0;
const parentRatio=0.1;
const progenyMethod="RANDOM"
const childrenRatio=1.0;
const trafficCount = 20;
const trafficDensityPer100 = 1;
const maxTrafficSpeed = 2.5;
const mutatedRatio = 0.5;
const mutationFactor = 0.1;
const crossoverProbability = 0.5;

const cars=generateCars(N);

cars.push(new Car(road.getLaneCenter(1),100,30,50,"KEYS"));

let generatedChildren = 0;

if (localStorage.getItem("topNBrains")) {
    const selectedBrains = JSON.parse(
        localStorage.getItem("topNBrains"));
    // Random crossover among the selected cars
    const numberOfChildren = Math.floor(childrenRatio * N);
    const numberOfSelectedBrains = selectedBrains.length;
    if (numberOfSelectedBrains > 0) {
        switch(progenyMethod) {
            case "LINEAR":
                linearProgenation(selectedBrains, numberOfChildren, generatedChildren, numberOfSelectedBrains);
                break;
            case "RANDOM":
            default:
                randomProgenetion(selectedBrains, numberOfChildren, generatedChildren, numberOfSelectedBrains);
        }
    }

    generatedChildren = numberOfChildren;
}

if(localStorage.getItem("bestBrain")){
    const storedBestBrain = localStorage.getItem("bestBrain");
    if (storedBestBrain != "undefined") {
        for(let i=generatedChildren;i<cars.length;i++){
            cars[i].brain=JSON.parse(storedBestBrain);
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,mutationFactor);
            }
        }
    }
}

const traffic=[];

for (let i = 0; i < trafficCount; i ++) {
    const newCar = new Car(
        road.getLaneCenter(Math.floor(random() * 3 + 1) - 1),
        random() * (-((trafficCount / trafficDensityPer100) * 100)),
        30,
        50,
        "DUMMY",
        ((random() + 1) * 0.5) * maxTrafficSpeed);
    traffic.push(newCar);
}

animate();

function save(){
    const topBrains = getTopNBrains(cars, Math.floor(N * parentRatio), traffic).map(c => c.brain);
    localStorage.setItem("bestBrain",
        JSON.stringify(topBrains[0]));
    localStorage.setItem("topNBrains",
        JSON.stringify(topBrains));
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("topNBrains");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
    
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}