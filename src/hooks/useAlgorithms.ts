import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { AllAlgorithmStates } from "../types"

const useAlgorithms = (): AllAlgorithmStates => {
    return useSelector(({cost}: RootState) => {
        return cost.algorithms
    })
}

export default useAlgorithms;
