import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';

import { RootWrapper } from '../components/RootWrapper/RootWrapper.styled';

const Root = () => (
  <RootWrapper>
    <Header />
    <Outlet />
  </RootWrapper>
);

export default Root;
