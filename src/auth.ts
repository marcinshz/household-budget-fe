import {RedirectFunction} from "react-router-dom";
import {setUser} from "./redux/userSlice.ts";
import {getCategoriesThunk, getGoalsThunk, getLimitsThunk, getWalletsThunk} from "./redux/thunks.ts";

export async function AuthHandler(redirect: RedirectFunction, dispatch: Function): Promise<Response> {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    if (accessToken && userId && username) {
        /*        return await authenticate(accessToken).then((response: any) => {
                    return 'admin';
                    return response.username;
                }).then((data: string) => {
                    if (!data) return redirect('/login');
                    //TODO POBIERZ USERA Z BAZY PO ID A NIE COS TAKIEGO XD
                    dispatch(setUser({username, id: userId, access_token: accessToken, currency: 'EUR'}));
                    dispatch(getWalletsThunk(userId));
                    dispatch(getCategoriesThunk(userId));
                    dispatch(getLimitsThunk(userId));
                    dispatch(getGoalsThunk(userId));
                    return new Response(data);
                })*/
        dispatch(setUser({username, id: userId, access_token: accessToken, currency: 'EUR'}));
        dispatch(getWalletsThunk(userId));
        dispatch(getCategoriesThunk(userId));
        dispatch(getLimitsThunk(userId));
        dispatch(getGoalsThunk(userId));
        return new Response(username);
    }
    return redirect('/login');
}