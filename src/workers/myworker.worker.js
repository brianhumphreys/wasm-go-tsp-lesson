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
    const result = self.global.TwoOpt(jsArrayToWasmArray(eventData));
    self.postMessage({ eventType: "FINISH", eventData: wasmArrayToJsArray(result) });
  }
};
