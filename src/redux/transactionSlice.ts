import {createSlice} from "@reduxjs/toolkit";
import {Income, TransactionsGrouped} from "../types";
import {getTransactionsThunk} from "./thunks.ts";

export const transactionSlice = createSlice({
    name: 'wallets',
    initialState: {
        incomes: new Array<Income>(),
        expenses: new Array<Income>(),
        incomesGrouped: {} as TransactionsGrouped,
        expensesGrouped: {} as TransactionsGrouped
    },
    reducers: {
        test: () => {

        }
    },
    extraReducers: builder => {
        builder.addCase(getTransactionsThunk.fulfilled, (state, action) => {
            state = action.payload;
            return state;
        })
    }
})

export const {test} = transactionSlice.actions
export default transactionSlice.reducer