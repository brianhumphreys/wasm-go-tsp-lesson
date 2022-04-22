import { Dispatch, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import useWorkerManager from "./useWorkerManager";

const useTwoOptTourWorkerInvoker = (input: Pos[], cb: Dispatch<SetStateAction<Pos[]>>) => {
    const runWorker = useWorkerManager<Pos[], Pos[]>((tastResult) => {
        if (tastResult != null) {
            cb(tastResult);  
        }
        
    });

    return useCallback(() => {
        runWorker(input);
    }, [hashListOfPoints(input), runWorker]);
}

export default useTwoOptTourWorkerInvoker;
