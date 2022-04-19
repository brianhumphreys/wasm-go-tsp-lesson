import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

// parameters are the input for the task and the call back that will be invoked with the
// output
const useNumberWorkerInvoker = (input: number, cb: (output: number | null) => void) => {
    const runNumberWorker = useWorkerManager<number>(cb);

    return useCallback(() => {
        runNumberWorker(input);
    }, [input]);
}

export default useNumberWorkerInvoker;