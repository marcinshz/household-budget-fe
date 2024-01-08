import {RedirectFunction} from "react-router-dom";
import {setUser} from "../redux/userSlice.ts";
import {getCategoriesThunk, getGoalsThunk, getLimitsThunk, getWalletsThunk} from "../redux/thunks.ts";
import {authenticate, createTransaction} from "../DataService.tsx";
import {CreateTransactionDto, User} from "../types.ts";

export async function AuthHandler(redirect: RedirectFunction, dispatch: Function): Promise<Response> {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    if (accessToken && userId && username) {
        return await authenticate(accessToken).then(async (response: any) => {
            return response
        }).then(async (data: User) => {
            if (!data) return redirect('/login');
            dispatch(setUser({
                username: data.username,
                id: data.id,
                access_token: accessToken,
                currency: data.currency
            }));
            if (navigator.onLine) {
                let savedTransactions = localStorage.getItem('savedTransactions');
                console.log(savedTransactions)
                if (savedTransactions) {
                    const savedTransactionsParsed: CreateTransactionDto[] = JSON.parse(savedTransactions);
                    if (savedTransactionsParsed.length) {
                        const promises = savedTransactionsParsed.map(async (transaction) => {
                            return await createTransaction(transaction);
                        })
                        Promise.all(promises).then(() => {
                            localStorage.removeItem('savedTransactions');
                        })
                    }
                    console.log('done')
                }
            }
            dispatch(getWalletsThunk(userId));
            dispatch(getCategoriesThunk(userId));
            dispatch(getLimitsThunk(userId));
            dispatch(getGoalsThunk(userId));
            return new Response(data.id + ' successfully authenticated');
        })
    }
    return redirect('/login');
}