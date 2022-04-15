console.log("worker initialized");

self.postMessage({eventType: "INITIALIZED"});
