import { useCallback, useEffect } from "react";
import { Pos } from "../types";
import useWorkerManager from "./useWorkerManager";

const useWorkerInvoker = (points: Pos[]) => {
    // we want to keep the useWorker Manager Separate from 
    // the code that passes in the task data because we want the logic
    // to be separate from the data is passing to the worker.  We see here 
    // that we need to run a useCallback that listens to the length of the
    // points array.  We do not want this dependency on points.length in the 
    // manager because we might later want to run a worker that takes a map 
    // of points (which we will need when running wasm golang)
    const [taskResult, runWorker] = useWorkerManager<Pos[], Pos[]>();
    // alternatively we can just specify
    // const [taskResult, runWorker] = useWorkerManager<Pos[]>();
    // as the generic type because the R template will default to Pos[] if it
    // isn't explicitly stated what the output type will be. In this case, 
    // both the input and output of the worker task will be Pos[] so we can 
    // just say <Pos[]>  
    useEffect(() => {
        console.log('result!!!!');
        console.log(taskResult);
    }, [taskResult])
    return useCallback(() => {
        runWorker(points);
    }, [points.length]);


}

export default useWorkerInvoker;
