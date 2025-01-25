import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import HomePage from './pages/client/home';
import BookPage from './pages/client/book';
import LoginPage from './pages/client/auth/login';
import RegisterPage from './pages/client/auth/register';

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        children: [
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
