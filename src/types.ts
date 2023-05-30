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

//CLASSES


export interface User {
    id: string;
    username: string;
    password: string;
}