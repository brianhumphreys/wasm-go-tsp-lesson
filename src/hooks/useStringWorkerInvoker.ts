import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

const useStringWorkerInvoker = (input: string, cb: (output: string | null) => void) => {
    const runWorker = useWorkerManager<string, string>(cb);

    return useCallback(() => {
        runWorker(input);
    }, [input, runWorker]);
}

export default useStringWorkerInvoker;