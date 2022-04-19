import { useCallback, useEffect } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number) => {
    const runWorker = useWorkerManager<number>();
 
    // no more need to listen to the taskResult since it will resolve
    // in the promise
    return useCallback(() => {
        runWorker(input).then(console.log);
    }, [input]);
}

export default useNumberWorkerInvoker;