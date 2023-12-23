import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import {createBrowserRouter, redirect, RouterProvider} from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage.tsx';
import HomePage from './pages/homePage/homePage.tsx';
import {Provider} from 'react-redux';
import store from './redux/store.ts';
import ErrorPage from './pages/errorPage/errorPage.tsx';
import {AuthHandler} from "./auth.ts";
import TransactionsPage from "./pages/transactionsPage/transactionsPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        loader: async () => {
            return await AuthHandler(redirect, store.dispatch);
        },
        errorElement: <ErrorPage/>
    },
    {
        path: "/transactions",
        element: <TransactionsPage/>,
        loader: async () => {
            return await AuthHandler(redirect, store.dispatch);
        },
        errorElement: <ErrorPage/>
    },

    {
        path: '/login',
        element: <LoginPage/>
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>,
)
