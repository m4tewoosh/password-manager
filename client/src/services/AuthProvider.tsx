import { ReactElement, useState, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authorizeUser, loginUser, logoutUser, registerUser } from 'api';
import { AuthContext } from 'context/AuthContext';

const AuthProvider = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const registerAction = async (email: string, password: string) => {
    try {
      await registerUser(email, password);

      message.success('Successfully registered! Please log in');
      navigate('/login');
    } catch (error) {
      throw new Error(error);
    }
  };

  const loginAction = async (email: string, password: string) => {
    try {
      await loginUser(email, password);

      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error);
    }
  };

  const logoutAction = async () => {
    try {
      setIsLoggedIn(false);
      await logoutUser();
    } catch (error) {
      throw new Error(error);
    }
  };

  useLayoutEffect(() => {
    const checkIfLoggedIn = async () => {
      if (!isLoggedIn) {
        try {
          await authorizeUser();
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');

          navigate('/dashboard');
        } catch (error) {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          console.error(error);
        }
      }
    };

    const { pathname } = location;

    const storedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';

    if (storedLoginStatus) {
      setIsLoggedIn(true);

      if (pathname === '/login' || pathname === '/register') {
        navigate('/dashboard');
      }

      return;
    }

    checkIfLoggedIn();
  }, [isLoggedIn, navigate, location]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        registerAction,
        loginAction,
        logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
