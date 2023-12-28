import {createSlice} from "@reduxjs/toolkit";
import {SavingsGoal} from "../types.ts";
import {createGoalThunk, getGoalsThunk} from "./thunks.ts";

export const goalSlice = createSlice({
    name: 'goals',
    initialState: new Array<SavingsGoal>(),
    reducers: {
        test: () => {
        }
    },
    extraReducers: builder => {
        builder.addCase(getGoalsThunk.fulfilled, (state, action) => {
            state = action.payload
            return state;
        })
        builder.addCase(createGoalThunk.fulfilled, (state, action) => {
            state.push(action.payload);
            return state;
        })
    }
})

export const {test} = goalSlice.actions
export default goalSlice.reducer