import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// we need to doctor our worker manager to accept an array of points
const useWorkerManager = <T, R = T>(): [R | null, (taskData: T) => void] => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  const [taskResult, setTaskResult] = useState<R | null>(null);

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T) => {
    worker1
      .run<T, R>(taskData) // change input and output types to Pos[]
      .then((taskResult: R | null) => setTaskResult(taskResult)); // change type from number to Pos[]
  };

  return [taskResult, runWorker];
};

export default useWorkerManager;