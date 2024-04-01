import { styled } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 500px;
  background: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: 4px;
  padding: 80px 30px 92px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  .ant-btn {
    border-radius: 2px;
  }
`;

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
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
  margin-bottom: 64px;
`;
