import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

const useArrayWorkerInvoker = (input: any[], cb: (output: any[] | null) => void) => {
    const runNumberWorker = useWorkerManager<any[]>(cb);

    return useCallback(() => {
        runNumberWorker(input);
    }, [input]);
}

export default useArrayWorkerInvoker;