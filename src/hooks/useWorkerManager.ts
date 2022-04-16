import { useEffect } from "react";

// export enum WorkerEventType {
//   INITIALIZED = "INITIALIZED",
//   FINISHED = "FINISHED",
// }

export interface EventData {
  eventData: number;
//   eventType: WorkerEventType;
}

const useWorkerManager = () => {

    // useEffect runs once on app start up
  useEffect(() => {

    // fetch the worker file
    const worker = new Worker("myworker.worker.js");

    // specify a listner that will handle the results of worker tasks
    worker.onmessage = (event) => {

        // "destructure" the result data from the event message
        const {eventData}: EventData = event.data;

        console.log("received task result from worker: ", eventData);
    };

    // make the call to the worker to start the task
    worker.postMessage({eventData: 1})
  }, []);
};

export default useWorkerManager;
