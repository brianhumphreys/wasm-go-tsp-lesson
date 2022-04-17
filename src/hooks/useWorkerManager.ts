import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// our manager hook is now much simplier and clean of any complicated logic that
// is prone to rerenders and other react funkiness
const useWorkerManager = () => {
    // We will reference our new manager class now instead of the Worker class directly
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  // useEffect will run once on app mount
  useEffect(() => {
    // first we want to initialize the worker.
    // If you remember from the WorkerManager class, this method
    // passes a START_INITIALIZATION message to the worker to do it's setup operations
    worker1.initialize();

    // after some time... we can call the run method and print the output
    setTimeout(() => {
      worker1.run<number, number>(2).then(console.log);
    }, 1000);
  });

};

export default useWorkerManager;
