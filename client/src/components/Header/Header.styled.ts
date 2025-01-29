import { Layout } from 'antd';
import { styled } from 'styled-components';

const { Header } = Layout;

export const Wrapper = styled(Header)`
  position: fixed;
  top: 0;
  height: 64px;
  max-width: 100vw;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  padding: unset;
  padding-left: 16px;
`;

export const LoginMenu = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;

  .ant-menu {
    border-bottom: none;
  }
`;

export const LogoutWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
