import {createSlice} from "@reduxjs/toolkit";
import {createCategoryThunk, getCategoriesThunk} from "./thunks";
import {Category, TransactionType} from "../types.ts";

export const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        incomes: new Array<Category>,
        expenses: new Array<Category>,
    },
    reducers: {
        test: () => {
        }
    },
    extraReducers: builder => {
        builder.addCase(createCategoryThunk.fulfilled, (state, action) => {
            if (action.payload.type === TransactionType.INCOME) {
                state.incomes.push(action.payload);
            } else {
                state.expenses.push(action.payload);
            }
            return state;
        })
        builder.addCase(getCategoriesThunk.fulfilled, (state, action) => {
            state = action.payload;
            return state;
        })

    }
})

export const {test} = categorySlice.actions
export default categorySlice.reducer