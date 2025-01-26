import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import HomePage from 'pages/client/home';
import BookPage from 'pages/client/book';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import 'styles/reset.scss';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/books",
                element: <BookPage />
            }
        ]
    },

    {
        path: "/login",
        element: <LoginPage />,
    },

    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
