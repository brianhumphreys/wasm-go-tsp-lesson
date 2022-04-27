import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    AddPoint,
    AlgorithmActionPayload,
    Algorithms,
    AlgorithmState,
    AllAlgorithmStates,
    CostIteration, SetPoints
} from "../types";
import algorithms from "../types/algorithms";

export interface CostState {
  algorithms: AllAlgorithmStates;
}

const isSolved = (
  algorithmState: AlgorithmState,
  payload: CostIteration
): boolean => {
  const length = algorithmState.cost.length;
  if (length == 0) {
      return false;
  }
  const last = length - 1;
  return algorithmState.cost[last][1] == payload.costItem[1];
};

const initialState: CostState = {
  algorithms: algorithms.reduce(
    (accum, algorithmName) => ({
      ...accum,
      [algorithmName]: {
        solved: true,
        bestRoute: [],
        cost: [],
      },
    }),
    {} as AllAlgorithmStates
  ),
};

export const costSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    setUnsolved: (state, action: PayloadAction<AlgorithmActionPayload>) => {
      const name = action.payload.algorithmName;
      (state.algorithms[name] as AlgorithmState).solved = false;
    },
    setPoints: (state, action: PayloadAction<SetPoints>) => {
      const name = action.payload.algorithmName;
      (state.algorithms[name] as AlgorithmState).bestRoute =
        action.payload.points;
    },
    addPoint: (state, action: PayloadAction<AddPoint>) => {
      const name = action.payload.algorithmName;
      (state.algorithms[name] as AlgorithmState).bestRoute.push(
        action.payload.newPoint
      );
    },
    addCostItem: (state, action: PayloadAction<CostIteration>) => {
        console.log(action.payload);
      const name = action.payload.algorithmName;
      if (!isSolved(state.algorithms[name] as AlgorithmState, action.payload)) {
        (state.algorithms[name] as AlgorithmState).bestRoute =
          action.payload.bestRoute;
        (state.algorithms[name] as AlgorithmState).bestDistance =
          action.payload.costItem[1];
        (state.algorithms[name] as AlgorithmState).cost.push(
          action.payload.costItem
        );
      } else {
        (state.algorithms[name] as AlgorithmState).solved = true;
      }
    },
    clearCostItems: (state, action: PayloadAction<Algorithms>) => {
      const name = action.payload;
      (state.algorithms[name] as AlgorithmState).cost = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCostItem, clearCostItems, addPoint, setPoints, setUnsolved } =
  costSlice.actions;

export default costSlice.reducer;
