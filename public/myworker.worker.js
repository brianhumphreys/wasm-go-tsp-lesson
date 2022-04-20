

  const initialize = (cb) => {
    console.log("initializing worker");
  
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

  // convert our array to a map with index values as the keys and the array values 
  // as the corrosponding map values.  We include a 'length' property so go 
  // module knows how long the map-formatted array is 
  const createWasmArray = (array) => {
    const arrayMap = {};
    for (let i =  0; i < array.length; i++) {
        arrayMap[`${i}`] = array[i];
    }
    arrayMap['length'] = array.length;
    console.log(arrayMap);
    return arrayMap;
}

  self.onmessage = (event) => {
    const { eventData, eventType } = event.data;
  
    if (eventType == "START_INITIALIZATION") {
      initialize(() => self.postMessage({ eventType: "INITIALIZED" }));
    }
  
    if (eventType == "START") {
      console.log("worker input: ", eventData);
      const result = self.global.Cost(createWasmArray(eventData));
      console.log("worker output: ", result)
      self.postMessage({ eventType: "FINISH", eventData: result });
    }
  };