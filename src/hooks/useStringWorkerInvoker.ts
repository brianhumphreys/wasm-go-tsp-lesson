import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

const useStringWorkerInvoker = (input: string, cb: (output: string | null) => void) => {
    const runNumberWorker = useWorkerManager<string>(cb);

    return useCallback(() => {
        runNumberWorker(input);
    }, [input]);
}

export default useStringWorkerInvoker;