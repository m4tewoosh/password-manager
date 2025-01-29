import { styled } from 'styled-components';

const errorColor = '#FF4D4F';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 64px 56px 0 56px;

  > form {
    width: 100%;
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  margin-bottom: 64px;

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

export const DocumentWrapper = styled.div`
  display: flex;
  gap: 16px;

  > .ant-form-item {
    flex: 1;
  }

  > button {
    .anticon {
      color: white;
    }
  }
`;

export const Error = styled.p`
  text-align: center;
  color: ${errorColor};
`;
