import { useState } from 'react';
import { Typography, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks';

import * as S from '../AuthForm.styled';

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { loginAction } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }: FormValues) => {
    try {
      setIsLoading(true);
      await loginAction(email, password);
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
  };

  return (
    <S.Wrapper>
      <Typography.Title level={1} style={{ marginBottom: '80px' }}>
        Sign In
      </Typography.Title>
      <Form
        layout="vertical"
        onFinish={handleLogin}
        validateMessages={errorMessages}
      >
        <S.InputsWrapper>
          <Form.Item
            name="email"
            initialValue="a@gmail.com" // added for testing purposes
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
            initialValue="1234567890" // added for testing purposes
            messageVariables={{ label: 'Password' }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>
          {error && <S.Error>{error}</S.Error>}
          <Button
            htmlType="submit"
            loading={isLoading}
            size="large"
            type="primary"
          >
            Sign In
          </Button>
        </S.InputsWrapper>
      </Form>
    </S.Wrapper>
  );
};

export default LoginForm;
