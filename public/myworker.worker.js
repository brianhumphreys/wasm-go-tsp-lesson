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
        // quick print to verify that data was passed to worker
        console.log('data passed to worker!');
        console.log(eventData);
        self.postMessage({ eventType: "FINISH", eventData });
    }
    
}