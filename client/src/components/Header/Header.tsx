import { Link } from 'react-router-dom';
import { Button, Menu, MenuProps } from 'antd';
import { BulbOutlined, LogoutOutlined } from '@ant-design/icons';
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

const Header = () => {
  const { isLoggedIn, logoutAction } = useAuth();

  const loggedMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
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

  return (
    <S.Wrapper>
      <S.LoginMenu>
        <Button>
          <BulbOutlined />
          Change Theme
        </Button>
        <Menu
          disabledOverflow
          mode="horizontal"
          // defaultSelectedKeys={['login']} //fix after logging in and out
          items={isLoggedIn ? loggedMenuItems : notLoggedMenuItems}
        />
      </S.LoginMenu>
    </S.Wrapper>
  );
};

export default Header;
