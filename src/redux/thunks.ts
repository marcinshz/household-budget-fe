import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserAuthenticatedDto, UserCredentialsDto } from "../types";
import { signIn } from "../DataService";
import { createAccount } from "../DataService";

export const signInThunk = createAsyncThunk(
    'user/signIn',
    async (credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> => {
        return await signIn(credentials);
    }
)

export const createAccountThunk = createAsyncThunk(
    'user/createAccount',
    async (credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> => {
        return await createAccount(credentials);
    }
)