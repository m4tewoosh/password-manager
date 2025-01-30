import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuProps } from 'antd';
import {
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAuth, useMobile } from 'hooks';

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
  isDarkMode: boolean;
  setIsDarkMode: (value: React.SetStateAction<boolean>) => void;
};

const Header = ({ isDarkMode, setIsDarkMode }: HeaderProps) => {
  const { isLoggedIn, logoutAction } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
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
      label: (
        <Link to="/dashboard">
          {!isMobile ? (
            <S.LogoutWrapper>
              <AppstoreOutlined />
              Dashboard
            </S.LogoutWrapper>
          ) : (
            <AppstoreOutlined />
          )}
        </Link>
      ),
    },
    {
      key: 'settings',
      label: (
        <Link to="/settings">
          {!isMobile ? (
            <S.LogoutWrapper>
              <SettingOutlined />
              Settings
            </S.LogoutWrapper>
          ) : (
            <SettingOutlined />
          )}
        </Link>
      ),
    },
    {
      key: 'logout',
      label: (
        <Link onClick={logoutAction} to="#">
          {!isMobile ? (
            <S.LogoutWrapper>
              <LogoutOutlined />
              Logout
            </S.LogoutWrapper>
          ) : (
            <LogoutOutlined />
          )}
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
          {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          {!isMobile && 'Change Theme'}
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
