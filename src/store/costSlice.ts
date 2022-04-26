import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddPoint,
  AlgorithmActionPayload,
  Algorithms,
  AlgorithmState,
  AllAlgorithmStates,
  CostIteration,
  CostTimeSeries,
  SetPoints,
} from "../types";

export interface CostState {
  algorithms: AllAlgorithmStates;
}

const initialState: CostState = {
  algorithms: {},
};

// create a slice that allows us to push new cost items to state without
// know existing state.  now we do not have to resubscribe whenever the callback
// for setCost changes as the cost array changes
export const counterSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    setUnsolved: (state, action: PayloadAction<AlgorithmActionPayload>) => {
      const name = action.payload.algorithmName;
      if (!!state.algorithms[name]) {
        state.algorithms[name] = {
          ...(state.algorithms[name] as AlgorithmState),
          solved: false,
        };
      }
    },
    setPoints: (state, action: PayloadAction<SetPoints>) => {
      const name = action.payload.algorithmName;

      state.algorithms[name] = {
        ...(state.algorithms[name] as AlgorithmState),
        bestRoute: action.payload.points,
      };
    },
    addPoint: (state, action: PayloadAction<AddPoint>) => {
      const name = action.payload.algorithmName;

      if (state.algorithms[name] == null) {
        state.algorithms[name] = {
          ...(state.algorithms[name] as AlgorithmState),
          bestRoute: [action.payload.newPoint],
        };
        return;
      } else {
        (state.algorithms[name] as AlgorithmState).bestRoute.push(
          action.payload.newPoint
        );
      }
    },
    addCostItem: (state, action: PayloadAction<CostIteration>) => {
      const name = action.payload.algorithmName;
      if (
        state.algorithms[name] == null ||
        !(state.algorithms[name] as AlgorithmState).cost
      ) {
        state.algorithms[name] = {
          ...(state.algorithms[name] as AlgorithmState),
          bestRoute: action.payload.bestRoute,
          bestDistance: action.payload.costItem[1],
          cost: [action.payload.costItem],
        };
        return;
      } else {
        if (
          ((state.algorithms[name] as AlgorithmState).cost as CostTimeSeries)[
            ((state.algorithms[name] as AlgorithmState).cost as CostTimeSeries)
              .length - 1
          ][1] == action.payload.costItem[1]
        ) {
          state.algorithms[name] = {
            ...(state.algorithms[name] as AlgorithmState),
            solved: true,
          };
          return;
        }
        // lets not duplicate costs on the finish message
        (
          (state.algorithms[name] as AlgorithmState).cost as CostTimeSeries
        ).push(action.payload.costItem);
        state.algorithms[name] = {
          ...(state.algorithms[name] as AlgorithmState),
          bestRoute: action.payload.bestRoute,
          bestDistance: action.payload.costItem[1],
          cost: (state.algorithms[name] as AlgorithmState).cost,
        };
      }
    },
    clearCostItems: (state, action: PayloadAction<Algorithms>) => {
      const name = action.payload;
      const algorithmState = state.algorithms[name];
      if (!!algorithmState && !!algorithmState.cost) {
        (state.algorithms[name] as AlgorithmState).cost = undefined;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCostItem, clearCostItems, addPoint, setPoints, setUnsolved } =
  counterSlice.actions;

export default counterSlice.reducer;
