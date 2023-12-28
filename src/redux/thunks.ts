import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    Category,
    CreateCategoryDto,
    CreateLimitDto,
    CreateSavingsGoalDto,
    CreateTransferDto,
    CreateWalletDto,
    Expense,
    Income,
    TransactionsGrouped,
    UserAuthenticatedDto,
    UserCredentialsDto,
    Wallet,
    WalletListItem
} from "../types";
import {
    createAccount,
    createCategory,
    createLimit,
    createSavingsGoal,
    createTransfer,
    createWallet,
    getCategories,
    getLimits,
    getOverview,
    getSavingsGoals,
    getWallets,
    removeWallet,
    signIn
} from "../DataService";


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

export const removeWalletThunk = createAsyncThunk(
    'wallets/removeWallet',
    async (walletId: string): Promise<string> => {
        return await removeWallet(walletId);
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
    async (userId: string): Promise<{
        incomes: Category[],
        expenses: Category[]
    }> => {
        return await getCategories(userId);
    }
)

//TRANSACTION THUNKS
export const getTransactionsThunk = createAsyncThunk(
    'transactions/getTransactions',
    async (userData: {
        id: string,
        wallets: WalletListItem[]
    }): Promise<{
        incomes: Income[],
        incomesGrouped: TransactionsGrouped,
        expenses: Expense[],
        expensesGrouped: TransactionsGrouped,
    }> => {
        return await getOverview(userData.id, userData.wallets);
    }
)

export const createTransferThunk = createAsyncThunk(
    'wallets/createTransfer',
    async (transferData: CreateTransferDto) => {
        return await createTransfer(transferData);
    }
)

//LIMIT THUNKS
export const createLimitThunk = createAsyncThunk(
    'limits/createLimit',
    async (limitData: CreateLimitDto) => {
        return await createLimit(limitData);
    }
)

export const getLimitsThunk = createAsyncThunk(
    'limits/getLimits',
    async (userId: string) => {
        return await getLimits(userId);
    }
)

//GOAL THUNKS
export const createGoalThunk = createAsyncThunk(
    'goals/createGoal',
    async (createSavingsGoalDto: CreateSavingsGoalDto) => {
        return await createSavingsGoal(createSavingsGoalDto);
    }
)

export const getGoalsThunk = createAsyncThunk(
    'goals/getGoals',
    async (userId: string) => {
        return await getSavingsGoals(userId);
    }
)


