import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage.tsx';
import HomePage from './pages/homePage/homePage.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import ErrorPage from './pages/errorPage/errorPage.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: 'login',
    element: <LoginPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
