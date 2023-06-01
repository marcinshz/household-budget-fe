import { Category, CreateCategoryDto, CreateWalletDto, UserAuthenticatedDto, UserCredentialsDto, Wallet } from './types';
const api_url = "http://localhost:3000/"


//USER CALLS
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
    }).then(res => res.json()).then(data => { return data; })
}

//WALLET CALLS
export const createWallet = async (walletData: CreateWalletDto): Promise<Wallet> => {
    return await fetch(api_url + "wallet", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(walletData)
    }).then(res => res.json()).then(data => { return data; })
}
export const getWallets = async (userId: string): Promise<Wallet[]> => {
    return await fetch(api_url + "wallet/user-wallets/" + userId).then(res => res.json()).then(data => { return data; })
}

//CATEGORY CALLS
export const createCategory = async (createCategoryDto: CreateCategoryDto): Promise<Category> => {
    return await fetch(api_url + "category/custom-category", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createCategoryDto)
    }).then(res => res.json()).then(data => {return data;})
}