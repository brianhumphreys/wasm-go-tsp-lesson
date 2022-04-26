import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { Algorithms, AlgorithmState } from "../types"

const useAlgorithm = (algorithmName: Algorithms): AlgorithmState => {
    return useSelector(({cost}: RootState) => {
        return (cost.algorithms[algorithmName] as AlgorithmState);
    })
}

export default useAlgorithm;
