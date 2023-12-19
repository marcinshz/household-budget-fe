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

export type ChartData = {
    labels: string[];
    values: number[];
}

export type PieChartData = {
    labels: string[];
    datasets: {
        data: number[],
        label: string;
    }[]
}

export type TransactionsGrouped = Record<number, Record<number, Record<number, ChartData>>>

export type WalletOverview = {
    incomes: Income[],
    incomesGrouped: TransactionsGrouped,
    expenses: Expense[],
    expensesGrouped: TransactionsGrouped,
    pies: {
        incomes: ChartData,
        expenses: ChartData
    }
}


export type DayOverview = {
    overview: ChartData
    list: Income[] | Expense[];
};

export type MonthOverview = {
    overview: ChartData
    days: Record<string, DayOverview>;
    [key: number]: DayOverview
};

export type YearOverview = {
    overview: ChartData;
    months: Record<string, MonthOverview>;
    [key: number]: MonthOverview
};
export type TransactionsGroupedTest = Record<string, YearOverview>;

export type StackBarDataSet = {
    label: string; //category name
    data: number[]; //Wartości dla danej labelki każdego dnia
    backgroundColor?: string; //raczej biore defaultowe
    stack: string; //To oddziela slupki obok siebie, jedno to bd incomes a drugie expenses
}

export type StackBarData = {
    labels: string[];//days/months/years
    datasets: StackBarDataSet[]
}

export enum StackBarVariant {
    INCOME = "Incomes",
    EXPENSE = "Expenses"
}