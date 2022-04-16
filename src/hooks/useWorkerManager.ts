import { useEffect, useState } from "react";
import WorkerManager, { WorkerState } from "../workers/WorkerManager";

export interface CustomWindow {
  nextStep: boolean;
}

declare let window: CustomWindow;

// this hook will manage the worker instance and pass tasks to the worker
// as well as handle the results of the worker processes
const useWorkerManager = () => {
    // we can use the React-provided `setState()` hook to instanciate the worker class
    // and to return a reference to the worker instance
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
