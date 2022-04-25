const initialize = (cb) => {
  console.log("initializing worker");

  importScripts("/wasm_exec.js");

  const go = new Go();
  WebAssembly.instantiateStreaming(
    fetch("./gomodule.wasm"),
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
    // if there is only 1 or no data points, the distance will always be 0
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
    // lets lower the improvement threshold
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
      console.log(bestDistance);
      console.log(Math.round(bestDistance));
      // lets send back the cost so that we can track the cost in each iteration inside of our chart.  also record finish time now
      // for more accurate tracking on the chart.  we do not want to include the time it took this web worker to pass a message to
      // the main thread in the tracker so recording date here is best
      self.postMessage({
        eventType: "ITERATE",
        eventData: {
          path: wasmArrayToJsArray(bestRoute),
          cost: Math.round(bestDistance),
          finishTime: Date.now(),
        },
      });
    }

    // lets send back the cost so that we can track the cost in each iteration inside of our chart
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
