const add1 = (num) => {
    return num + 1;
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
        const result = add1(eventData);

        console.log(`received event: ${eventData} + 1 = ${result}`);

        self.postMessage({ eventType: "FINISH", eventData: result });
    }
    
}