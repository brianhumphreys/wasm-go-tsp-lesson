console.log("worker downloaded");


// add the function to handle our task
const add2 = (num) => {
    console.log('processing');
    return num + 2;
}

const initialize = () => {
    console.log('initializing worker');
}

// add on message to handle the START event
// process the message on the start 
self.onmessage = (event) => {
    const {eventData, eventType} = event.data;

    console.log("worker");
    console.log(event.data);

    if (eventType == "START_INITIALIZATION") {
        initialize();
        self.postMessage({ eventType: "INITIALIZED", })
    }

    
    if (eventType == "START") {
        const result = add2(eventData);

        self.postMessage({ eventType: "FINISH", eventData: result });
    }
    
}