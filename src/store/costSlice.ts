import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Algorithms, CostIteration, CostTimeSeries } from "../types";

export interface CostState {
  [algorithm: string]: CostTimeSeries;
}

const initialState: CostState = {};

// create a slice that allows us to push new cost items to state without
// know existing state.  now we do not have to resubscribe whenever the callback
// for setCost changes as the cost array changes
export const counterSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    addCostItem: (state, action: PayloadAction<CostIteration>) => {
      const name = action.payload.algorithmName;
      if (!state[name] || state[name].length < 1) {
        state[name] = [action.payload.costItem]
      } else {
          // lets not duplicate costs on the finish message
          if (state[name][state[name].length - 1][1] != action.payload.costItem[1]) {
            state[name].push(action.payload.costItem)
          }
      }
    },
    clearCostItems: (state, action: PayloadAction<Algorithms>) => {
        const name = action.payload;
        if (!!state[name]) {
          state[name] = [];
        }
      },
  },
});

// Action creators are generated for each case reducer function
export const { addCostItem, clearCostItems } = counterSlice.actions;

export default counterSlice.reducer;
