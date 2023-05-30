import { UserAuthenticatedDto, UserCredentialsDto } from './types';
const api_url = "http://localhost:3000/"

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