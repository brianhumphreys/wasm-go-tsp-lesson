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
  points.forEach(point => {
    console.log(`x: ${point.x}, y: ${point.y}`)
  });
}

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

    let improvementFactor = 1.0;
    // lets lower the improvement threshold
	  const improvementThreshold = 0;

    while(improvementFactor > improvementThreshold) {
      const previousDistance = bestDistance;

      const wasmTour = {
        vertices: jsArrayToWasmArray(bestRoute),
        distance: bestDistance,
      }
      const {vertices, distance} = self.global.IterateTwoOpt(wasmTour);

      bestRoute = vertices;
      bestDistance = distance;

      improvementFactor = 1 - bestDistance / previousDistance
  
      console.log("improvementFactor: ", improvementFactor)
      self.postMessage({ eventType: "ITERATE", eventData: wasmArrayToJsArray(bestRoute) });
    }
    
    self.postMessage({ eventType: "FINISH", eventData: wasmArrayToJsArray(bestRoute) });
  }
};
