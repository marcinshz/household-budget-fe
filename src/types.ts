//DTOS
export class UserCredentialsDto {
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password
    }
    username: string;
    password: string;
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
    constructor(name: string, userId: string) {
        this.userId = userId;
        this.name = name;
    }
    userId: string;
    name: string;
}

export class CreateCategoryDto {
    constructor(name: string, userId: string, type: string) {
        this.name = name;
        this.userId = userId;
        this.type = type;
    }

    name: string;
    userId: string;
    type: string;
}

//CLASSES
export interface User {
    id: string;
    username: string;
    password: string;
}

export interface Wallet {
    id: string;
    name: string;
    value: number;
}
export interface Category {
    id: string;
    name: string;
}

export interface Income {
    category: Category;
    id: string;
    name: string;
    note: string;
    createdAt: Date;
}
export interface Expense {
    category: Category;
    id: string;
    name: string;
    note: string;
    createdAt: Date;
}

