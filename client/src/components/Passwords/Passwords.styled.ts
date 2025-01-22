import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding-top: calc(48px + 48px);

  > button {
    margin-bottom: 32px;
  }
`;

export const Header = styled.h2`
  font-size: 38px;
  font-weight: 600;
  margin-bottom: 32px;
`;

export const PasswordsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;
