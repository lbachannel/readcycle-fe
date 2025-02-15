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
import 'styles/base.scss';
import { App } from 'antd';
import VerifySuccessPage from 'pages/client/auth/verify-success';
import VerifyFailedPage from 'pages/client/auth/verify-failed';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from 'components/auth/auth';
import ManageBookPage from './pages/admin/manage.book';
import ManageUserPage from './pages/admin/manage.user';
import ManageOrderPage from './pages/admin/manage.order';
import DashBoardPage from './pages/admin/dashboard';
import LayoutAdmin from './components/layout/layout.admin';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { StrictMode } from 'react';

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
        path: "admin",
        element: <LayoutAdmin />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashBoardPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "book",
                element: (
                    <ProtectedRoute>
                        <ManageBookPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "order",
                element: (
                    <ProtectedRoute>
                        <ManageOrderPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "user",
                element: (
                    <ProtectedRoute>
                        <ManageUserPage />
                    </ProtectedRoute>
                )
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

    {
        path: "/verify-email-success",
        element: <VerifySuccessPage />,
    },

    {
        path: "/verify-email-failed",
        element: <VerifyFailedPage />,
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <ConfigProvider locale={enUS}>
                    <RouterProvider router={router} />
                </ConfigProvider>
            </AppProvider>
        </App>
    </StrictMode>,
)
