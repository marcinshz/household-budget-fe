import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { walletSlice } from "./walletSlice";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = configureStore({
    reducer: combineReducers({
        user: userSlice.reducer,
        wallets: walletSlice.reducer,
    }),
    enhancers: [composedEnhancer]
})



export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch