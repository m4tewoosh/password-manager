import { Outlet } from 'react-router-dom';
import AuthProvider from 'services/AuthProvider';
import Header from 'components/Header/Header';
import { RootWrapper } from 'components/RootWrapper/RootWrapper.styled';

const Root = () => (
  <AuthProvider>
    <RootWrapper>
      <Header />
      <Outlet />
    </RootWrapper>
  </AuthProvider>
);

export default Root;
