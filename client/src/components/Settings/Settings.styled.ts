import styled from 'styled-components';

const errorColor = '#FF4D4F';

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  max-width: 300px;

  padding-top: calc(48px + 48px);

  > button {
    margin-bottom: 32px;
  }
`;

export const PasswordWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;

  > button {
    margin-block-start: 30px;

    .anticon {
      color: white;
    }
  }
`;

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;

  .ant-form-item {
    flex: 1;
    margin-bottom: unset;
  }

  .ant-input-outlined {
    border-radius: 2px;
  }

  .anticon {
    color: #bfbfbf;
  }

  .ant-input-prefix {
    margin-right: 8px;
  }
`;

export const Error = styled.p`
  text-align: center;
  color: ${errorColor};
`;
