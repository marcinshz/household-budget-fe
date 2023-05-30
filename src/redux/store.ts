import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    },
    enhancers: [composedEnhancer]
})



export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch