import {createSlice} from "@reduxjs/toolkit";
import {Limit} from "../types.ts";
import {createLimitThunk, getLimitsThunk} from "./thunks.ts";

export const limitSlice = createSlice({
    name: 'limits',
    initialState: new Array<Limit>(),
    reducers: {
        test: () => {
        }
    },
    extraReducers: builder => {
        builder.addCase(createLimitThunk.fulfilled, (state, action) => {
            state.push(action.payload);
            return state;
        })
        builder.addCase(getLimitsThunk.fulfilled, (state, action) => {
            state = action.payload;
            return state;
        })
    }
})

export const {test} = limitSlice.actions
export default limitSlice.reducer