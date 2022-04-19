
   
import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(): [R | null, (taskData: T) => void] => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  const [taskResult, setTaskResult] = useState<R | null>(null);

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T) => {
    worker1
      .run<T, R>(taskData) 
      .then((taskResult: R | null) => {
        console.log('its returning'); 
        setTaskResult(taskResult);
      }); 
  };

  return [taskResult, runWorker];
};

export default useWorkerManager;