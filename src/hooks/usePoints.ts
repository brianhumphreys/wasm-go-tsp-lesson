import { useDispatch } from "react-redux";
import { addPoint, clearCostItems, setPoints } from "../store/costSlice";
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

  const setPointsSingularFunction = (
    algorithmName: Algorithms,
    points: Pos[]
  ) => dispatch(setPoints({ algorithmName, points }));

  const addPointSingularFunction = (algorithmName: Algorithms, newPoint: Pos) =>
    dispatch(addPoint({ algorithmName, newPoint }));

  const clearPointsSingularFunction = (algorithmName: Algorithms) =>
    dispatch(setPoints({ algorithmName, points: [] }));

  const clearCostsSingularFunction = (algorithmName: Algorithms) =>
    dispatch(clearCostItems(algorithmName));

  return {
    setPoints: setPointsFunction,
    addPoint: addPointFunction,
    clearPoints: clearPointsFunction,
    clearCostsSingular: clearCostsSingularFunction,
    setPointsSingular: setPointsSingularFunction,
    addPointSingular: addPointSingularFunction,
    clearPointsSingular: clearPointsSingularFunction,
  };
};

export default usePoints;
