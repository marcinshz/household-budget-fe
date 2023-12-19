import {createSlice} from "@reduxjs/toolkit";
import {WalletListItem} from "../types";
import {createWalletThunk, getWalletsThunk} from "./thunks";

export const walletSlice = createSlice({
    name: 'wallets',
    initialState: new Array<WalletListItem>(),
    reducers: {
        toggleWallet: (state, action) => {
            console.log(state, action)
            state = action.payload;
            return state;
        }
    },
    extraReducers: builder => {
        builder.addCase(createWalletThunk.fulfilled, (state, action) => {
            state.push({...action.payload, checked: true});
            return state;
        })
        builder.addCase(getWalletsThunk.fulfilled, (state, action) => {
            state = action.payload.map((wallet) => {
                return {
                    ...wallet,
                    checked: true
                }
            });
            return state
        })
    }
})

export const {toggleWallet} = walletSlice.actions
export default walletSlice.reducer