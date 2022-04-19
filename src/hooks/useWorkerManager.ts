import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// defined a callback that we can pass in when the worker passes back a result.
// perhaps we want to update the UI with the result.  If so, we can update a ref
// in the callback with the task result
const useWorkerManager = <T, R = T>(cb: (taskResult: R | null) => void): ((taskData: T) => void) => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T): void => {
    // instead of updating the taskResult state, just invoke the provided
    // callback whenever the promise resolves
    worker1.run<T, R>(taskData).then(cb);
  };

  return runWorker;
};

export default useWorkerManager;
