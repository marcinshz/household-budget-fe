import {createSlice} from "@reduxjs/toolkit";
import {createAccountThunk, signInThunk} from "./thunks";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: "",
        username: "",
        access_token: "",
        currency: ""
    },
    reducers: {
        setUser: (state, action) => {
            state = action.payload;
            return state;
        }
    },
    extraReducers: builder => {
        builder.addCase(signInThunk.fulfilled, (state, action) => {
            const {user, access_token} = action.payload;
            state = {id: user.id, username: user.username, access_token, currency: user.currency}
            return state;
        })
        builder.addCase(createAccountThunk.fulfilled, (state, action) => {
            const {user, access_token} = action.payload;
            state = {id: user.id, username: user.username, access_token, currency: user.currency}
            return state;
        })
    }
})

export const {setUser} = userSlice.actions

export default userSlice.reducer