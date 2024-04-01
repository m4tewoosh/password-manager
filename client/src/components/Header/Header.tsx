import { Link } from 'react-router-dom';
import { Menu, MenuProps } from 'antd';

import * as S from './Header.styled';

const menuItems: MenuProps['items'] = [
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
  return (
    <S.Wrapper>
      <S.LoginMenu>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="horizontal"
          items={menuItems}
        />
      </S.LoginMenu>
    </S.Wrapper>
  );
};

export default Header;
