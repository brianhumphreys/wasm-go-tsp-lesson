console.log("worker downloaded");


// add the function to handle our task
const add1 = (num) => {
    console.log('processing');
    return num + 1;
}

const initialize = () => {
    console.log('initializing worker');
}

// add on message to handle the START event
// process the message on the start 
self.onmessage = (event) => {
    const {eventData, eventType} = event.data;

    if (eventType == "START_INITIALIZATION") {
        console.log("worker received initialization event.")
        initialize();
        self.postMessage({ eventType: "INITIALIZED", })
    }

    
    // if (eventType == "START") {
    //     console.log("worker received a task with data: ", eventData);
    //     const result = add1(eventData);

    //     self.postMessage({ eventType: "FINISH", eventData: result });
    // }
    
}