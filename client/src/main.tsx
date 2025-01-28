import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  RegisterPage,
  LoginPage,
  DashboardPage,
  PasswordsPage,
  DocumentsPage,
} from 'routes/index';
import Root from 'routes/root';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'passwords',
        element: <PasswordsPage />,
      },
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
