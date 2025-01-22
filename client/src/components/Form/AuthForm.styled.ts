import { styled } from 'styled-components';

const errorColor = '#FF4D4F';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 500px;
  background: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 80px 64px 0 64px;

  > form {
    width: 100%;
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1;

  > div {
    flex: 1;
  }
`;

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
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

export const Header = styled.h1`
  font-size: 32px;
  font-weight: 600px;
  color: #595959;
  margin-bottom: 80px;
`;

export const Error = styled.p`
  text-align: center;
  color: ${errorColor};
`;
