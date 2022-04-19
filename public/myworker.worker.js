importScripts("/wasm_exec.js");



const go = new Go();
WebAssembly.instantiateStreaming(
    fetch("./gomodule.wasm"),
    go.importObject
  ).then((result) => {
      console.log("loaded")
      go.run(result.instance);
      
  });

