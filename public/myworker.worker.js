

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
        // print out the points array to verify that we are correctly passing 
        // our data to the worker thread
        console.log('worker!!!');
        console.log(eventData);

        // pass the points array back to verify that we are correctly returning
        // data from the worker thread back to the main thread
        self.postMessage({ eventType: "FINISH", eventData });
    }
    
}