//DTOS
export class UserCredentialsDto {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password
    }
}

export interface UserAuthenticatedDto {
    user: {
        username: string,
        password: string,
        id: string
    }
    access_token: string
}

export class CreateWalletDto {
    userId: string;
    name: string;
    balance: number;

    constructor(name: string, userId: string) {
        this.userId = userId;
        this.name = name;
        this.balance = 0;
    }
}

export class CreateTransactionDto {
    walletId: string;
    name: string;
    value: number;
    categoryId: string;
    transactionType: string;
    note: string;

    constructor(walletId: string, name: string, value: number, categoryId: string, transactionType: string, note: string) {
        this.walletId = walletId;
        this.name = name;
        this.value = value;
        this.categoryId = categoryId;
        this.transactionType = transactionType;
        this.note = note;
    }
}

export class CreateCategoryDto {
    name: string;
    userId: string;
    type: string;

    constructor(name: string, userId: string, type: string) {
        this.name = name;
        this.userId = userId;
        this.type = type;
    }
}

//CLASSES
export interface User {
    id: string;
    username: string;
}

export interface Wallet {
    id: string;
    name: string;
    balance: number;
}

export interface WalletListItem {
    id: string;
    name: string;
    balance: number;
    checked: boolean;
}

export interface Category {
    id: string;
    name: string;
    type: string;
}

export interface Income {
    category: Category;
    id: string;
    name: string;
    note: string;
    createdAt: Date;
    value: number;
}

export interface Expense {
    category: Category;
    id: string;
    name: string;
    note: string;
    createdAt: Date;
    value: number;
}

export enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense"
}

export type TransactionsGrouped = {
    labels: string[];
    datasets: { data: number[] }[];
}