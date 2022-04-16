console.log('downloaded test');

// self.onmessage = (event) => {
//     console.log("new event received");

//     console.log("adding 1 to: ", event.data.eventData);

//     self.postMessage({eventData: event.data.eventData + 1});
// }

const add1 = (num) => {
    console.log('processing');
    return num + 1;
}

self.onmessage = (event) => {
    const {eventData, eventType} = event.data;

    console.log("new event received");
    if (eventType == "INITIALIZE") {
        console.log("initializing worker")
        self.postMessage({ eventType: "INITIALIZED", eventData: "woop"})
    }

    
    if (eventType == "START") {
        const result = add1(eventData);

        self.postMessage({ eventType: "FINISH", eventData: result });
    }
    
}