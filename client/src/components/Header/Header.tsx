import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuProps } from 'antd';
import {
  BulbOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';

import * as S from './Header.styled';

const notLoggedMenuItems: MenuProps['items'] = [
  {
    key: 'register',
    label: <Link to="/register">Register</Link>,
  },
  {
    key: 'login',
    label: <Link to="/login">Login</Link>,
  },
];

type HeaderProps = {
  setIsDarkMode: (value: React.SetStateAction<boolean>) => void;
};

const Header = ({ setIsDarkMode }: HeaderProps) => {
  const { isLoggedIn, logoutAction } = useAuth();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>('');

  const handleChangeTheme = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));

      return !prev;
    });
  };

  const loggedMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'settings',
      label: (
        <Link to="/settings">
          <SettingOutlined />
        </Link>
      ),
    },
    {
      key: 'logout',
      label: (
        <Link onClick={logoutAction} to="#">
          <S.LogoutWrapper>
            Logout
            <LogoutOutlined />
          </S.LogoutWrapper>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    setCurrentPage(location.pathname.slice(1));
  }, [location.pathname]);

  return (
    <S.Wrapper>
      <S.LoginMenu>
        <Button type="default" onClick={handleChangeTheme}>
          <BulbOutlined />
          Change Theme
        </Button>
        <Menu
          disabledOverflow
          mode="horizontal"
          selectedKeys={[currentPage]}
          items={isLoggedIn ? loggedMenuItems : notLoggedMenuItems}
        />
      </S.LoginMenu>
    </S.Wrapper>
  );
};

export default Header;
