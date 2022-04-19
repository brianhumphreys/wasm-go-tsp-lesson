import { useCallback, useEffect } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number) => {
    // we want to keep the useWorker Manager Separate from 
    // the code that passes in the task data because we want the logic
    // to be separate from the data is passing to the worker.  We see here 
    // that we need to run a useCallback that listens the input data.  Whenever
    // the data changes, we want to update the callback that invokes the data 
    // with the new input.  We do not want this dependency on the input to be in the 
    // manager because we might later want to run a worker that takes a different
    // data type as input.

    // this worker will take a number as input and output a number so we can
    // specify useWorkerManager<numebr> to tell typescript that both the input and
    // output are numbers.  If we wanted the worker to say... turn a number into a
    // string, we could specify useWorkerManager<number, string>()
    const [taskResult, runWorker] = useWorkerManager<number>();
 
    useEffect(() => {
        // quick print to verify that we successfully received the result from 
        // the worker
        console.log('result from worker!');
        console.log(taskResult);
    }, [taskResult])
    return useCallback(() => {
        runWorker(input);
    }, [input]);


}

export default useNumberWorkerInvoker;