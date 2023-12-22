import {authenticate} from "./DataService.tsx";
import {RedirectFunction} from "react-router-dom";
import {setUser} from "./redux/userSlice.ts";
import {getCategoriesThunk, getLimitsThunk, getWalletsThunk} from "./redux/thunks.ts";

export async function AuthHandler(redirect: RedirectFunction, dispatch: Function): Promise<Response> {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    const currency = localStorage.getItem('CURRENCY');
    if (accessToken && userId && username && currency) {
        return await authenticate(accessToken).then((response: any) => {
            return response.username;
        }).then((data: string) => {
            if (!data) return redirect('/login');
            dispatch(setUser({username, id: userId, access_token: accessToken, currency}));
            dispatch(getWalletsThunk(userId));
            dispatch(getCategoriesThunk(userId));
            dispatch(getLimitsThunk(userId));
            return new Response(data);
        })
    }
    return redirect('/login');
}