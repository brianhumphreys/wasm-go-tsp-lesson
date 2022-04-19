importScripts("/wasm_exec.js");

function createWasmArray (array) {
    const arrayMap = {};
    for (let i =  0; i < array.length; i++) {
        arrayMap[`${i}`] = array[i];
    }
    arrayMap['length'] = array.length;
    console.log(arrayMap);
    return arrayMap;
}

function twoOpt() {

    // console.log(self.global.distance([10, 10], [13, 14]));

    console.log('yup');
    // const array = [{x: 10, y: 10}, {x: 13, y: 14}, {x: 45, y: 17}, {x: 18, y: 5}, {x: 8, y: 18}, {x: 44, y: 12}, {x: 45, y: 3}, {x: 54, y: 31}, {x: 65, y: 36}, {x: 9, y: 18}]
    // console.log(self.global.twoOpt(createWasmArray(array)));
    
}

const go = new Go();
WebAssembly.instantiateStreaming(
    fetch("./gomodule.wasm"),
    go.importObject
  ).then((result) => {
      console.log("faclk")
      go.run(result.instance);
      twoOpt();
      
  });

