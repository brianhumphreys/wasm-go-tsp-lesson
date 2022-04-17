const doLongProcessOnMainThread = () => {
    console.log("starting process on worker thread");
    let count = 1;
    for(let i = 0; i < 10_000_000_000; i++) {
      //something
      count++;
    }
    console.log("finished!");
  }

const initialize = () => {
    console.log('initializing worker');
}

self.onmessage = (event) => {
    const {eventData, eventType} = event.data;

    if (eventType == "START_INITIALIZATION") {
        initialize();
        self.postMessage({ eventType: "INITIALIZED", })
    }

    if (eventType == "START") {
        doLongProcessOnMainThread();
        self.postMessage({ eventType: "FINISH", eventData: null });
    }
    
}