const initialize = (cb) => {
  console.log("initializing worker");

  importScripts("/wasm_exec.js");

  const go = new Go();
  WebAssembly.instantiateStreaming(
    fetch("./annealing.wasm"),
    go.importObject
  ).then((result) => {
    console.log("loaded wasm");
    go.run(result.instance);
    cb();
  });
};

const jsArrayToWasmArray = (array) => {
  const arrayMap = {};
  for (let i = 0; i < array.length; i++) {
    arrayMap[`${i}`] = array[i];
  }
  arrayMap["length"] = array.length;
  return arrayMap;
};

const wasmArrayToJsArray = (arrayMap) => {
  const array = [];
  for (let i = 0; i < arrayMap.length; i++) {
    array.push(arrayMap[`${i}`]);
  }
  return array;
};

const printPointArray = (points) => {
  points.forEach((point) => {
    console.log(`x: ${point.x}, y: ${point.y}`);
  });
};

self.onmessage = (event) => {
  const { eventData, eventType } = event.data;

  if (eventType == "START_INITIALIZATION") {
    initialize(() => self.postMessage({ eventType: "INITIALIZED" }));
  }

  if (eventType == "START") {
    if (eventData.length < 2) {
      self.postMessage({ eventType: "FINISH", eventData });
      return;
    }

    let bestOverall = eventData;
    let initialWasm = jsArrayToWasmArray(bestOverall);
    let bestFitness = self.global.Cost(initialWasm);

    // console.log("GENETIC ITERATE");
    // console.log(bestOverall);
    self.postMessage({
      eventType: "ITERATE",
      eventData: {
        path: bestOverall,
        cost: Math.round(bestFitness),
        finishTime: Date.now(),
      },
    });

    // let currentGeneration = 1;
    // const maxGeneration = 50;

    const initialTour = {
      vertices: initialWasm,
      cost: bestFitness,
    };

    let annealingState = {
      bestTour: initialTour,
      currentTour: initialTour,
      temperature: 100,
    };

    //   function run(initialTour, temperature, dropRate, delay){
    //     var startCost = cost(initialTour);
    //     var state = {bestTour:{vertices:initialTour, cost:startCost}, temperature:temperature, currentTour:{vertices:initialTour, cost:startCost}};

    //     function delayed_coolDown(){
    //         setTimeout(function(){
    //             coolDown(dropRate, state);
    //             if(state.temperature > 1) delayed_coolDown(); // loop until it's cold
    //             else state_changed('Started with cost: '+Math.floor(startCost)+', ended with cost: '+Math.floor(state.bestTour.cost), state.bestTour);
    //         }, delay);
    //     }
    //     delayed_coolDown();
    // }
    while (annealingState.temperature > 1) {
      let nextAnnealingState = self.global.CoolDown(annealingState);
      console.log("NEIGHBOR");
      console.log(annealingState);
      console.log(nextAnnealingState);
      self.postMessage({
        eventType: "ITERATE",
        eventData: {
          path: wasmArrayToJsArray(nextAnnealingState.bestTour.vertices),
          cost: Math.round(nextAnnealingState.bestTour.cost),
          finishTime: Date.now(),
        },
      });

      annealingState = nextAnnealingState;
      // const { vertices, fitness } = self.global.FindMostFit(populationMap);

      // console.log(`${currentGeneration}: GENETIC intermediate 1 ITERATE`);
      // console.log(vertices);

      // let mutations = 0;
    }

    self.postMessage({
      eventType: "FINISH",
      eventData: {
        path: wasmArrayToJsArray(annealingState.bestTour.vertices),
        cost: Math.round(annealingState.bestTour.cost),
        finishTime: Date.now(),
      },
    });
  }
};
