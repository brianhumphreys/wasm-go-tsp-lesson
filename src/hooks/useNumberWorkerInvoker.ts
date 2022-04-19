import { useCallback, useEffect } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number, cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<number, number>(cb);

    return useCallback(() => {
        console.log('calling');
        runWorker(input);
        // since runWorker can change based on the initialization status of the WorkerManager
        // object, we must now update this invoker callback when runWorker() updates
    }, [input, runWorker]);


}

export default useNumberWorkerInvoker;