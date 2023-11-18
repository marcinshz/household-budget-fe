import {authenticate} from "./DataService.tsx";
import {RedirectFunction} from "react-router-dom";
import {setUser} from "./redux/userSlice.ts";
import {getCategoriesThunk, getWalletsThunk} from "./redux/thunks.ts";

export async function AuthHandler(redirect: RedirectFunction, dispatch: Function): Promise<Response> {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    if (accessToken && userId && username) {
        return await authenticate(userId, accessToken).then((response) => {
            if (!response) {
                return redirect('/login');
            }
            dispatch(setUser({username, id: userId, access_token: accessToken}));
            dispatch(getWalletsThunk(userId));
            dispatch(getCategoriesThunk(userId));

            return response;
        });
    }
    return redirect('/login');
}