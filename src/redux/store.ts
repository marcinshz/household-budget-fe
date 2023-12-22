import {applyMiddleware, combineReducers, configureStore} from "@reduxjs/toolkit";
import {userSlice} from "./userSlice";
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {walletSlice} from "./walletSlice";
import {categorySlice} from "./categorySlice.ts";
import {transactionSlice} from "./transactionSlice.ts";
import {limitSlice} from "./limitSlice.ts";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = configureStore({
    reducer: combineReducers({
        user: userSlice.reducer,
        wallets: walletSlice.reducer,
        categories: categorySlice.reducer,
        transactions: transactionSlice.reducer,
        limits: limitSlice.reducer
    }),
    enhancers: [composedEnhancer]
})


export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch