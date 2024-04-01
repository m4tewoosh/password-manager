import { Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import * as S from './RegisterForm.styled';

const RegisterForm = () => {
  return (
    <S.Wrapper>
      <S.Header>Sign Up</S.Header>
      <S.Form>
        <S.InputsWrapper>
          <Input
            name="email"
            placeholder="E-mail"
            prefix={<MailOutlined />}
            size="large"
          />
          <Input
            name="password"
            placeholder="Password"
            prefix={<LockOutlined />}
            size="large"
          />
        </S.InputsWrapper>

        <Button size="large" type="primary">
          Create account
        </Button>
      </S.Form>
    </S.Wrapper>
  );
};

export default RegisterForm;
