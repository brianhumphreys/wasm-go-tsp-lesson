
const initialize = (cb) => {
  console.log("initializing worker");

  importScripts("/wasm_exec.js");

  const go = new Go();
  WebAssembly.instantiateStreaming(
    fetch("./genetic.wasm"),
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

    let startTour = eventData;
    let bestOverall = eventData;
    let initialWasm = jsArrayToWasmArray(bestOverall);
    let bestFitness = self.global.Fitness(initialWasm);

    self.postMessage({
      eventType: "ITERATE",
      eventData: {
        path: bestOverall,
        cost: Math.round(bestFitness),
        finishTime: Date.now(),
      },
    });

    let currentGeneration = 1;
    const maxGeneration = 500;

    const initialTour = {
      vertices: initialWasm,
      fitness: bestFitness
    }

    self.global.Populate(initialTour);
    const { vertices, fitness } = self.global.FindMostFit();

    let mutations = 0;

    while (maxGeneration > currentGeneration) {
      currentGeneration++;
      
      let bestCurrent = {
        vertices: jsArrayToWasmArray(vertices),
        fitness,
        mutations,
      };
      
      const {
        vertices: v,
        fitness: f,
        mutations: m,
      } = self.global.IterateGenetic(bestCurrent);


      if (f < bestFitness) {
        bestOverall = wasmArrayToJsArray(v);
        bestFitness = f;
      }
      
      self.postMessage({
        eventType: "ITERATE",
        eventData: {
          path: bestOverall,
          cost: Math.round(bestFitness),
          finishTime: Date.now(),
        },
      });
    }

    self.postMessage({
      eventType: "FINISH",
      eventData: {
        path: bestOverall,
        cost: Math.round(bestFitness),
        finishTime: Date.now(),
      },
    });
  }
};
