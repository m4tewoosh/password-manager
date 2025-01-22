import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  width: 248px;
  height: 48px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 8px 0 32px;
`;

export const PasswordData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: flex-start;

  > span {
    font-size: 12px;

    &:first-child {
      border-bottom: 1px solid #d9d9d9;
    }
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;

  > button {
    border: unset;
    background: unset;

    svg {
      font-size: 18px;
    }

    &:hover {
      cursor: pointer;
    }
  }
`;
