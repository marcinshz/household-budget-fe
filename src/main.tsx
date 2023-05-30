import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage.tsx';
import Home from './App.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
