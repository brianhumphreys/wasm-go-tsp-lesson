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

self.iterateGenetic = (eventType, fitness, path) => {
  // console.log("ITERATE GENETIC: " + eventType);
  // console.log(fitness);
  self.postMessage({
    eventType,
    eventData: {
      path: wasmArrayToJsArray(path),
      cost: Math.round(fitness),
      finishTime: Date.now(),
    },
  });
}

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

    self.global.Genetic(initialWasm);
  }
};
