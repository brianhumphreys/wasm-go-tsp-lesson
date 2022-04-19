
   
import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// let's generify the worker hook and try out our new worker by testing out 
// different data types
const useWorkerManager = <T, R = T>(): [R | null, (taskData: T) => void] => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  const [taskResult, setTaskResult] = useState<R | null>(null);

  useEffect(() => {
    worker1.initialize();
  });

  const runWorker = (taskData: T) => {
    worker1
      .run<T, R>(taskData) // change input and output types to Pos[]
      .then((taskResult: R | null) => {
        console.log('its returning'); // theres a problem...
        console.log('but does not print after the first call because the value does not change');
        // console.log(' but if value doesn\' change then setTaskResult won\' detect a change and we therefore cannot perform updates on outputs');
        setTaskResult(taskResult);
      }); // change type from number to Pos[]
  };

  return [taskResult, runWorker];
};

export default useWorkerManager;