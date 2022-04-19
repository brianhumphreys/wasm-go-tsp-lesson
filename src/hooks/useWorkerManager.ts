
   
import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(cb: (taskResult: R | null) => void): ((taskData: T) => void) => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T): void => {
    worker1.run<T, R>(taskData).then(cb);
  };

  return runWorker;
};

export default useWorkerManager;