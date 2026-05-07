import './App.css'
import LogInPage from './pages/LogInPage'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import SignUpPage from './pages/SignUpPage'
import { AuthProvider } from './context/AuthContext'
import Mypage from './pages/Mypage'
import ProtectedLayout from './layouts/ProtectedLayout'
import HomeLayout from './layouts/HomeLayout'
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage'
import LpDetailPage from './pages/LpDetail'
import Home from './pages/Home' 

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />, 
    errorElement: <NotFound />,
    children: [
      {

        index: true, 
        element: <Home />,
      },
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />
      },

      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "me",
            element: <Mypage />
          },
          {
            path: "lps/:lpId",
            element: <LpDetailPage />,
          },
        ]
      }
    ]
  }
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;