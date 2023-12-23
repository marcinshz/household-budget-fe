import {createSlice} from "@reduxjs/toolkit";
import {WalletListItem} from "../types";
import {createTransferThunk, createWalletThunk, getWalletsThunk, removeWalletThunk} from "./thunks";

export const walletSlice = createSlice({
    name: 'wallets',
    initialState: new Array<WalletListItem>(),
    reducers: {
        toggleWallet: (state, action) => {
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
        builder.addCase(createTransferThunk.fulfilled, (state) => {
            return state;
        })
        builder.addCase(removeWalletThunk.fulfilled, (state, action) => {
            state = state.filter((wallet) => {
                return wallet.id !== action.payload
            })
            return state
        })

    }
})

export const {toggleWallet} = walletSlice.actions
export default walletSlice.reducer