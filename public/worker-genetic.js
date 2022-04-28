
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
    const maxGeneration = 7;

    const initialTour = {
      vertices: initialWasm,
      fitness: bestFitness
    }

    self.global.Populate(initialTour);
    const { vertices, fitness } = self.global.FindMostFit();

    let mutations = 0;

    // bestOverall

    // console.log("CROSSING")

    // const momPath = [{x:1,y:1}, {x:2,y:2}, {x:3,y:3}, {x:4,y:4}, {x:1,y:1}, {x:6,y:6}, {x:7,y:7}, {x:8,y:8}];
    // console.log(momPath)
    // const momWasm = {
    //   vertices: jsArrayToWasmArray(momPath),
    //   distance: 10,
    // };

    // const dadPath = [{x:2,y:2}, {x:6,y:6}, {x:1,y:1}, {x:8,y:8}, {x:4,y:4}, {x:1,y:1}, {x:3,y:3}, {x:7,y:7}];
    // console.log(dadPath);
    // const dadWasm = {
    //   vertices: jsArrayToWasmArray(dadPath),
    //   distance: 10,
    // };

    // const babyWasm = self.global.Cross(momWasm, dadWasm);

    // console.log("baby")
    // console.log(wasmArrayToJsArray(babyWasm.vertices));

    // console.log(mutatedTour);
    // console.log(wasmArrayToJsArray(mutatedTour.vertices));

    while (maxGeneration > currentGeneration) {
      currentGeneration++;
      
      let bestCurrent = {
        vertices: jsArrayToWasmArray(vertices),
        fitness,
        mutations,
      };
      
      // self.global.Select();
      const {
        vertices: v,
        fitness: f,
        mutations: m,
      } = self.global.IterateGenetic(bestCurrent);

      bestOverall = wasmArrayToJsArray(v);
      bestFitness = f;
      //   const previousDistance = bestFitness;

      //   const wasmTour = {
      //     vertices: jsArrayToWasmArray(bestOverall),
      //     distance: bestFitness,
      //   };
      //   const { vertices, distance } = self.global.IterateTwoOpt(wasmTour);

      //   bestOverall = vertices;
      //   bestFitness = distance;

      //   improvementFactor = 1 - bestFitness / previousDistance;

      //   console.log("improvementFactor: ", improvementFactor);
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
