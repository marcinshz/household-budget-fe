import {
    Category,
    ChartData,
    CreateCategoryDto,
    CreateTransactionDto,
    CreateWalletDto,
    Expense,
    Income,
    TransactionsGrouped,
    UserAuthenticatedDto,
    UserCredentialsDto,
    Wallet,
    WalletListItem
} from './types';

const api_url = "http://localhost:3000/"


//AUTH CALLS
export const createAccount = async (credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> => {
    return await fetch(api_url + "user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(res => res.json()).then(async data => {
        if (data) return await signIn(credentials);
        throw new Error("Creating User Failed")
    })
}

export const signIn = async (credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> => {
    return await fetch(api_url + "auth/sign-in", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const authenticate = async (userId: string, accessToken: string): Promise<Response> => {
    // send request to backend to check token
    return true;
}

//WALLET CALLS
export const createWallet = async (walletData: CreateWalletDto): Promise<Wallet> => {
    return await fetch(api_url + "wallet", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(walletData)
    }).then(res => res.json()).then(data => {
        return data;
    })
}
export const getWallets = async (userId: string): Promise<Wallet[]> => {
    return await fetch(api_url + "wallet/user-wallets/" + userId).then(res => res.json()).then(data => {
        return data;
    })
}

//CATEGORY CALLS
export const createCategory = async (createCategoryDto: CreateCategoryDto): Promise<Category> => {
    return await fetch(api_url + "category/custom-category", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createCategoryDto)
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const getCategories = async (userId: string): Promise<{ incomes: Category[], expenses: Category[] }> => {
    return await fetch(api_url + "category/" + userId).then((res) => res.json()).then((data) => {
        return data;
    })
}

//EXPENSE CALLS
export const getExpensesFromPeriod = async (days: number, walletId: string): Promise<Expense[]> => {
    return await fetch(api_url + "expense/" + walletId + "/" + days).then((res) => res.json()).then((data) => {
        return data
    });
}

//OVERVIEW CALLS (INCOME, EXPENSE)
export const getOverview = async (userId: string, wallets: WalletListItem[]): Promise<{
    incomes: Income[],
    incomesGrouped: TransactionsGrouped,
    expenses: Expense[],
    expensesGrouped: TransactionsGrouped,
    pies: {
        incomes: ChartData,
        expenses: ChartData
    }
}> => {
    return await fetch(api_url + 'wallet/user-wallets-overview-test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId, wallets})
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const createTransaction = async (createTransactionDto: CreateTransactionDto): Promise<Income | Expense> => {
    return await fetch(api_url + createTransactionDto.transactionType, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTransactionDto)
    }).then(res => res.json()).then(data => {
        return data;
    })
}
