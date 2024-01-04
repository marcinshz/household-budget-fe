import {RedirectFunction} from "react-router-dom";
import {setUser} from "./redux/userSlice.ts";
import {getCategoriesThunk, getGoalsThunk, getLimitsThunk, getWalletsThunk} from "./redux/thunks.ts";
import {authenticate} from "./DataService.tsx";
import {User} from "./types.ts";

export async function AuthHandler(redirect: RedirectFunction, dispatch: Function): Promise<Response> {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    if (accessToken && userId && username) {
        return await authenticate(accessToken).then((response: any) => {
            return response
        }).then((data: User) => {
            if (!data) return redirect('/login');
            dispatch(setUser({
                username: data.username,
                id: data.id,
                access_token: accessToken,
                currency: data.currency
            }));
            dispatch(getWalletsThunk(userId));
            dispatch(getCategoriesThunk(userId));
            dispatch(getLimitsThunk(userId));
            dispatch(getGoalsThunk(userId));
            return new Response(data.id + ' successfully authenticated');
        })
    }
    return redirect('/login');
}