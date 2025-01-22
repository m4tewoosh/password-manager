import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';

import * as S from '../AuthForm.styled';

type FormValues = {
  email: string;
  password: string;
};

const RegisterForm = () => {
  const { registerAction } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async ({ email, password }: FormValues) => {
    try {
      setIsLoading(true);
      await registerAction(email, password);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const errorMessages = {
    required: '${label} is required',
    types: {
      email: 'Enter a valid email address',
    },
    string: {
      range: '${label} must be between ${min} and ${max} characters',
    },
  };

  return (
    <S.Wrapper>
      <S.Header>Sign Up</S.Header>
      <Form
        layout="vertical"
        onFinish={handleRegister}
        validateMessages={errorMessages}
      >
        <S.InputsWrapper>
          <Form.Item
            name="email"
            messageVariables={{ label: 'Email' }}
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
          >
            <Input
              placeholder="E-mail"
              prefix={<MailOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            messageVariables={{ label: 'Password' }}
            rules={[
              {
                required: true,
                // commented for testing purposes
                // min: 10,
                max: 100,
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>
          <S.Error>{error}</S.Error>
          <Button
            htmlType="submit"
            loading={isLoading}
            size="large"
            type="primary"
          >
            Create account
          </Button>
        </S.InputsWrapper>
      </Form>
    </S.Wrapper>
  );
};

export default RegisterForm;
