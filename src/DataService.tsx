import {
    Category,
    CreateCategoryDto,
    CreateLimitDto,
    CreateSavingsGoalDto,
    CreateTransactionDto,
    CreateTransferDto,
    CreateWalletDto,
    Expense,
    Income,
    TransactionsGrouped,
    UpdateCurrencyDto,
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

export const authenticate = async (accessToken: string): Promise<Response> => {
    return await fetch(api_url + "auth/verify-token/" + accessToken).then(res => {
        return res.json();
    }).then(data => {
        return data;
    })
}

export const updateCurrency = async (updateCurrencyDto: UpdateCurrencyDto) => {
    return await fetch(api_url + "user", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateCurrencyDto)
    }).then(res => res.json()).then(() => {
        return updateCurrencyDto.currency;
    })
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

export const removeWallet = async (walletId: string): Promise<string> => {
    return await fetch(api_url + "wallet/" + walletId, {
        method: 'DELETE'
    }).then(() => {
        return walletId
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

export const getCategories = async (userId: string): Promise<{
    incomes: Category[],
    expenses: Category[]
}> => {
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
}> => {
    return await fetch(api_url + 'wallet/user-wallets-overview', {
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


export const createTransfer = async (createTransferDto: CreateTransferDto) => {
    return await fetch(api_url + 'transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTransferDto)
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const createLimit = async (createLimitDto: CreateLimitDto) => {
    return await fetch(api_url + 'limit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createLimitDto)
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const getLimits = async (userId: string) => {
    return await fetch(api_url + 'limit/' + userId).then(res => res.json()).then(data => {
        return data;
    })
}

export const createSavingsGoal = async (createSavingsGoalDto: CreateSavingsGoalDto) => {
    return await fetch(api_url + 'goal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createSavingsGoalDto)
    }).then(res => res.json()).then(data => {
        return data;
    })
}

export const getSavingsGoals = async (userId: string) => {
    return await fetch(api_url + 'goal/' + userId).then(res => res.json()).then(data => {
        return data;
    })
}