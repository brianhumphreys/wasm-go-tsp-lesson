import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(): ((taskData: T) => Promise<R | null>) => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  // no more need to update a task result

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T): Promise<R | null> => {
    // instead of updating the taskResult state, just return a promise
    // from the callback that resolves the task result
    return new Promise<R | null>((resolve) => {
      worker1.run<T, R>(taskData).then((taskResult: R | null) => {
        resolve(taskResult);
      });
    });
  };

  return runWorker;
};

export default useWorkerManager;
