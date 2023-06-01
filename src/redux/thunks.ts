import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateWalletDto, UserAuthenticatedDto, UserCredentialsDto, Wallet } from "../types";
import { createWallet, getWallets, signIn } from "../DataService";
import { createAccount } from "../DataService";


//USER THUNKS
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

//WALLET THUNKS
export const createWalletThunk = createAsyncThunk(
    'wallets/createWallet',
    async (walletData: CreateWalletDto): Promise<Wallet> => {
        return await createWallet(walletData);
    }
)

export const getWalletsThunk = createAsyncThunk(
    'wallets/getWallets',
    async (userId: string): Promise<Wallet[]> => {
        return await getWallets(userId);
    }
)