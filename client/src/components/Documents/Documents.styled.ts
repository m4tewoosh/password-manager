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

export const DocumentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;
