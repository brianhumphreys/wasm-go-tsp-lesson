console.log("worker initialized");

// sinple fucntion that adds 1 to a number
const add1 = (input) => {
    return input + 1;
}

// specify the on message listener that listens for tasks then performs them and then 
// sends the result back to the main thread
self.onmessage = (event) => {
    const {eventData} = event.data;
    console.log("worker received eventData: ", eventData);
    self.postMessage({eventData: add1(eventData)});
}

