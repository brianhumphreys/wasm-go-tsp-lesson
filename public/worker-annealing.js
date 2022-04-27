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

    self.global.DistMat(eventData);
    let bestRoute = eventData;
    let bestDistance = self.global.PathCost(eventData);

    self.postMessage({
      eventType: "ITERATE",
      eventData: {
        path: wasmArrayToJsArray(bestRoute),
        cost: Math.round(bestDistance),
        finishTime: Date.now(),
      },
    });

    let improvementFactor = 1.0;
    const improvementThreshold = 0;

    while (improvementFactor > improvementThreshold) {
      const previousDistance = bestDistance;

      const wasmTour = {
        vertices: jsArrayToWasmArray(bestRoute),
        distance: bestDistance,
      };
      const { vertices, distance } = self.global.IterateTwoOpt(wasmTour);

      bestRoute = vertices;
      bestDistance = distance;

      improvementFactor = 1 - bestDistance / previousDistance;

      console.log("improvementFactor: ", improvementFactor);
      self.postMessage({
        eventType: "ITERATE",
        eventData: {
          path: wasmArrayToJsArray(bestRoute),
          cost: Math.round(bestDistance),
          finishTime: Date.now(),
        },
      });
    }

    self.postMessage({
      eventType: "FINISH",
      eventData: {
        path: wasmArrayToJsArray(bestRoute),
        cost: Math.round(bestDistance),
        finishTime: Date.now(),
      },
    });
  }
};
