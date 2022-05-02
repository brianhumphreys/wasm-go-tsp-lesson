import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Algorithms, AlgorithmState, Pos } from "../types";

const useGetPoints = (algorithmName: Algorithms): Pos[] => {
    return useSelector(({cost}: RootState) => {
        return (cost.algorithms[algorithmName] as AlgorithmState).bestRoute
    })
}

export default useGetPoints;
