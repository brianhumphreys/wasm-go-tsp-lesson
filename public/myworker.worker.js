

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
  const jsArrayToWasmArray = (array) => {
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
      const result = self.global.TwoOpt(jsArrayToWasmArray(eventData));
      self.postMessage({ eventType: "FINISH", eventData: result });
    }
  };