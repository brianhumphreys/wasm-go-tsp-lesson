console.log("worker downloaded");


const add1 = (num) => {
    console.log('processing');
    return num + 1;
}

const initialize = () => {
    console.log('initializing worker');
}

self.onmessage = (event) => {
    const {eventData, eventType} = event.data;

    console.log("worker");
    console.log(event.data);

    if (eventType == "START_INITIALIZATION") {
        initialize();
        self.postMessage({ eventType: "INITIALIZED", })
    }

    
    if (eventType == "START") {
        const result = add1(eventData);

        self.postMessage({ eventType: "FINISH", eventData: result });
    }
    
}