import { styled } from 'styled-components';

export const Wrapper = styled.header`
  position: fixed;
  top: 0;
  height: 48px;
  max-width: 100vw;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  padding: 0 16px 0 32px;
`;

export const LoginMenu = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const LogoutWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
