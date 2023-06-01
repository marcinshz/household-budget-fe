import { createSlice } from "@reduxjs/toolkit";
import { Wallet } from "../types";
import { createWalletThunk, getWalletsThunk } from "./thunks";

export const walletSlice = createSlice({
    name: 'wallets',
    initialState: new Array<Wallet>(),
    reducers: {
        test: () => { }
    },
    extraReducers: builder => {
        builder.addCase(createWalletThunk.fulfilled, (state, action) => {
            state.push(action.payload);
            return state;
        }),
            builder.addCase(getWalletsThunk.fulfilled, (state, action) => {
                state = action.payload;
                return state
            })
    }
})

export const { test } = walletSlice.actions
export default walletSlice.reducer