import {createAsyncThunk} from "@reduxjs/toolkit";
import {Category, CreateCategoryDto, CreateWalletDto, UserAuthenticatedDto, UserCredentialsDto, Wallet} from "../types";
import {createAccount, createCategory, createWallet, getCategories, getWallets, signIn} from "../DataService";


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

//CATEGORY THUNKS
export const createCategoryThunk = createAsyncThunk(
    'categories/createCategory',
    async (categoryData: CreateCategoryDto): Promise<Category> => {
        return await createCategory(categoryData);
    }
)

export const getCategoriesThunk = createAsyncThunk(
    'categories/getCategories',
    async (userId: string): Promise<{ incomes: Category[], expenses: Category[] }> => {
        return await getCategories(userId);
    }
)