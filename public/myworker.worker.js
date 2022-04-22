const initialize = (cb) => {
  console.log("initializing worker");

  importScripts("/wasm_exec.js");

  const go = new Go();
  WebAssembly.instantiateStreaming(
    fetch("./gomodule.wasm"),
    go.importObject
  ).then((result) => {
    console.log("loaded");
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

// function to convert was array map back to
// a js array which is the type we need for
// our setPoints state manager function
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
    console.log(eventData);

    self.global.DistMat(eventData);
    let bestRoute = eventData;
    let bestDistance = self.global.PathCost(eventData);

    // now we loop inside out worker based off of the improvement factor
    // instead of in go module
    // This allows us to take snap shot of the routes between iterations
    // in order to send them back to our canvas for intermediate updates
    let improvementFactor = 1.0;
	  const improvementThreshold = 0.01;

    while(improvementFactor > improvementThreshold) {
      const previousDistance = bestDistance;

      const wasmTour = {
        vertices: jsArrayToWasmArray(bestRoute),
        distance: bestDistance,
      }
      const {vertices, distance} = self.global.IterateTwoOpt(wasmTour);

      bestRoute = vertices;
      bestDistance = distance;


      console.log('previous distance: ', previousDistance);

      console.log('best Distance: ', bestDistance);
      // get improvement factor
      improvementFactor = 1 - bestDistance / previousDistance
  
      console.log("improvementFactor: ", improvementFactor)
      // we will see that this does not thing after the first loop because our promise 
      // in the worker manager hook has resolved.
      console.log('hello1');
      self.postMessage({ eventType: "FINISH", eventData: wasmArrayToJsArray(bestRoute) });
      console.log('hello2');
    }
    
    // this won't do anything either
    self.postMessage({ eventType: "FINISH", eventData: wasmArrayToJsArray(bestRoute) });
  }
};
