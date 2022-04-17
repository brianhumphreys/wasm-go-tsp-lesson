import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// type the output now that the hook is getting slightly more compliated
const useWorkerManager = (): [number | null, VoidFunction] => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  const [taskResult, setTaskResult] = useState<number | null>(null);

  useEffect(() => {
    worker1.initialize();
  });

  // run worker
  const runWorker = () => {
    worker1
      .run<number, number>(Math.floor(Math.random() * 100)) // random input
      .then((result: number | null) => setTaskResult(result));
  };

  return [taskResult, runWorker];
};

export default useWorkerManager;
