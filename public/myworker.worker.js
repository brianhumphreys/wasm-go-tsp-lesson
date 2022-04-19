const initialize = (cb) => {
  console.log("initializing worker");

  // adds initialization code.  We need to add wasm_exec.js to our public folder
  importScripts("/wasm_exec.js");

  // after fetching the wasm script, we need to instanciate the go module and then
  // fetch our transpiled go script
  const go = new Go();
  WebAssembly.instantiateStreaming(fetch("../gomodule.wasm"), go.importObject).then(
    (result) => {
      console.log("finished loading Go script");
      cb();
    }
  );
};

self.onmessage = (event) => {
  const { eventData, eventType } = event.data;

  if (eventType == "START_INITIALIZATION") {
    // since the initialization is async because we fetch go scripts,
    // lets pass the postMessage function as a call back that invoked once
    // init is finished
    initialize(() => self.postMessage({ eventType: "INITIALIZED" }));
  }

  if (eventType == "START") {
    // print out the points array to verify that we are correctly passing
    // our data to the worker thread
    console.log("worker!!!");
    console.log(eventData);

    // pass the points array back to verify that we are correctly returning
    // data from the worker thread back to the main thread
    self.postMessage({ eventType: "FINISH", eventData });
  }
};
