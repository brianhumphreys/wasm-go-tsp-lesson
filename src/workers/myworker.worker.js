

  const initialize = (cb) => {
    console.log("initializing worker");
  
    // adds initialization code.  We need to add wasm_exec.js to our public folder
    // importScripts("/wasm_exec.js");
  
    // // after fetching the wasm script, we need to instanciate the go module and then
    // // fetch our transpiled go script
    importScripts("/wasm_exec.js");

    const go = new Go();
    WebAssembly.instantiateStreaming(
        fetch("./gomodule.wasm"),
        go.importObject
      ).then((result) => {
          console.log("loaded")
          go.run(result.instance);
          cb();
      });
  };

  self.onmessage = (event) => {
    const { eventData, eventType } = event.data;
  
    if (eventType == "START_INITIALIZATION") {
      initialize(() => self.postMessage({ eventType: "INITIALIZED" }));
    }
  
    if (eventType == "START") {
      console.log("worker input: ", eventData);
      const result = self.global.Hello(eventData)
      console.log("worker output: ", result)
      self.postMessage({ eventType: "FINISH", eventData: result });
    }
  };