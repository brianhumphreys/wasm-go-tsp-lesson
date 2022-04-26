import { useDispatch } from "react-redux";
import { addPoint, setPoints } from "../store/costSlice";
import { Algorithms, Pos } from "../types";
import algorithms from "../types/algorithms";

const usePoints = () => {
  const dispatch = useDispatch();

  const setPointsFunction = (points: Pos[]) =>
    algorithms.forEach((algorithmName: Algorithms) =>
      dispatch(setPoints({ algorithmName, points }))
    );

  const addPointFunction = (newPoint: Pos) =>
    algorithms.forEach((algorithmName: Algorithms) =>
      dispatch(addPoint({ algorithmName, newPoint }))
    );

  const clearPointsFunction = () =>
    algorithms.forEach((algorithmName: Algorithms) =>
      dispatch(setPoints({ algorithmName, points: [] }))
    );

return {
    setPoints: setPointsFunction,
    addPoint: addPointFunction,
    clearPoints: clearPointsFunction,
}
};

export default usePoints;
