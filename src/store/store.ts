import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import workerReducer from './workers/workerSlice';

// we only have one reducer but if we had more, they would go here.
// it isn't required but you should keep the reducer key 
// consistent with the name of the reducer.
const reducer = combineReducers({
  workers: workerReducer
})

// add the combined reducers to our store
const store = configureStore({
  reducer,
})

// infer the type of our state 
export type RootState = ReturnType<typeof store.getState>

// infer the type of the dispatch function
export type AppDispatch = typeof store.dispatch

export default store;