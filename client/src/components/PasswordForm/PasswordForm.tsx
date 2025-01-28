import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  LockOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { savePassword, updatePassword } from 'api';
import { generatePassword } from 'utils/password';

import * as S from './PasswordForm.styled';

type Password = {
  id: string;
  name: string;
  username: string;
  password: string;
};

type FormValues = {
  username: string;
  name: string;
  password: string;
};

type PasswordFormProps = {
  handleCancelModal: () => void;
  fetchPasswords: () => Promise<void>;
  editedPassword?: Password | null;
};

const PasswordForm = ({
  handleCancelModal,
  fetchPasswords,
  editedPassword,
}: PasswordFormProps) => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSavePassword = async ({
    username,
    name,
    password,
  }: FormValues) => {
    try {
      setIsLoading(true);

      if (editedPassword) {
        await updatePassword(editedPassword.id, username, name, password);
      } else {
        await savePassword(username, name, password);
      }

      await fetchPasswords();
      setIsLoading(false);
      handleCancelModal();
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const errorMessages = {
    required: '${label} is required',
  };

  const generateNewPassword = useCallback(() => {
    form.setFieldValue('password', generatePassword());
  }, [form]);

  useEffect(() => {
    if (editedPassword) {
      form.setFieldValue('username', editedPassword.username);
      form.setFieldValue('name', editedPassword.name);
      form.setFieldValue('password', editedPassword.password);
      return;
    }

    generateNewPassword();
  }, [form, editedPassword, generateNewPassword]);

  return (
    <S.Wrapper>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSavePassword}
        validateMessages={errorMessages}
      >
        <S.InputsWrapper>
          <Form.Item
            name="username"
            messageVariables={{ label: 'Email / Username' }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              placeholder="Email / username"
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="name"
            messageVariables={{ label: 'Site / Application name' }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              placeholder="Site / Application name"
              prefix={<GlobalOutlined />}
              size="large"
            />
          </Form.Item>

          <S.PasswordWrapper>
            <Form.Item
              name="password"
              messageVariables={{ label: 'Password' }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input prefix={<LockOutlined />} size="large" />
            </Form.Item>

            <Button size="large" type="primary" onClick={generateNewPassword}>
              <ReloadOutlined />
            </Button>
          </S.PasswordWrapper>

          <S.Error>{error}</S.Error>
          <Button
            htmlType="submit"
            loading={isLoading}
            size="large"
            type="primary"
          >
            {editedPassword ? 'Update' : 'Save'}
          </Button>
        </S.InputsWrapper>
      </Form>
    </S.Wrapper>
  );
};

export default PasswordForm;
