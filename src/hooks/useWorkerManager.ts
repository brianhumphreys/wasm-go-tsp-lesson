import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = () => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  // initialize task result with null
  const [taskResult, setTaskResult] = useState<number | null>(null);

  useEffect(() => {
    worker1.initialize();

    setTimeout(() => {
      // when the promise resolves with the result, set the task result
      // this can also be shorthanded to:
      // `worker1.run<number, number>(2).then(setTaskResult);`
      worker1
        .run<number, number>(2)
        .then((result: number | null) => setTaskResult(result));
    }, 1000);
  });

  // return the result.  the hook will return the updated result every 
  // time the worker processes a new task
  return taskResult;
};

export default useWorkerManager;
