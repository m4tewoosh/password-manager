import styled from 'styled-components';

const errorColor = '#FF4D4F';

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

export const PasswordWrapper = styled.div`
  display: flex;
  align-items: end;
  gap: 16px;

  > button {
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
  margin-bottom: 64px;

  .ant-form-item {
    flex: 1;
    margin-bottom: unset;

    .ant-form-item-explain-error {
      position: absolute;
    }
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
