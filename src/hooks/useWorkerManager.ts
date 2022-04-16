import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

// these are the event types that will be passed back and forth
// between the worker thread and the main thread
export enum WorkerEventType {
  INITIALIZED = "INITIALIZED", // passed once from worker once initialization is compelte
  START_INITIALIZATION = "START_INITIALIZATION", // passed once to worker on initialization
  FINISH = "FINISH", // passed from worker once task is complete
  START = "START", // passed to worker when we want the task to begin
}

// The worker will keep track of it's own state which will give us an idea of when the worker
// is ready to perform a task
export enum WorkerState {
  NOT_INITIALIZED = "NOT_INITIALIZED", // worker has been instantiated but the `initialize()` method hasn't been called
  READY = "READY", // the worker is ready to be given a task
  RUNNING = "RUNNING", // the worker is currently performing a task
  TERMINATED = "TERMINATED", // the worker has been killed and cannot perform anymore tasks
}

// this is the format of the messages that will be passed back and forth between the main thread
// and the worker thread.  The generic type 'T' will be whatever data you want to pass to the
// `run()` method.  If you want to worker to perform task on a `number` type, then specify 'T'
// as type `number`
export interface EventData<T> {
  eventType: WorkerEventType;
  eventData: T;
}

const useWorkerManager = () => {
  // we can use the React-provided `setState()` hook to instanciate the worker class
  // and to return a reference to the worker instance
  const [worker1] = useState<Worker>(new Worker("myworker.worker.js"));
  // reference to the current state of the worker.  It starts out as not initialized
  const [workerState, setWorkerState] = useState<WorkerState>(WorkerState.NOT_INITIALIZED);
    // reference to the data sent back from worker task completions
  const [taskResult, setTaskResult] = useState<number | null>(null);

  useEffect(() => {
    worker1.onmessage = (event) => {
      const { eventType, eventData }: EventData<number> = event.data;

      if (eventType == WorkerEventType.INITIALIZED) {
          console.log("received inialize-finished message from worker.  worker is now ready to process tasks.")
        // worker state is set to ready now
        setWorkerState(WorkerState.READY);
      }
    //   } else if (eventType == WorkerEventType.FINISH) {
    //     console.log("received task-finished message from worker.  worker is now ready to process another tasks.")
    //     // set state to ready
    //     setWorkerState(WorkerState.READY);
    //     // setTaskResult(eventData);
    //   } else {
    //     // something went wrong when initializing... terminate worker.
    //     worker1.terminate();
    //   }
    };

    // after setting the handler above, we can now pass the initialization message
    console.log("WHAT");
    worker1.postMessage({
      eventType: WorkerEventType.START_INITIALIZATION,
    });

    // after some time when we know the worker is initialized... tell it to perform a task
    // setTimeout(() => {
    //     worker1.postMessage({
    //         eventType: WorkerEventType.START,
    //         eventData: 1
    //       });
    // }, 1000);
  });
};

export default useWorkerManager;
