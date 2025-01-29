import { useCallback, useEffect, useState } from 'react';
import { Typography, Button, Form, Input, Checkbox } from 'antd';
import { getUser, updateUser } from 'api';
import { EditOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons';

import { User } from 'types/user';
import * as S from './Settings.styled';

type FormValues = {
  currentPassword?: string;
  newPassword?: string;
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
};

const Settings = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordEdited, setIsPasswordEdited] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  const checkIfSaveDisabled = useCallback(() => {
    const passwordModuleChanged =
      form.getFieldValue('passwordsModuleOn') !== user?.passwordsModuleOn;
    const documentsModuleChanged =
      form.getFieldValue('documentsModuleOn') !== user?.documentsModuleOn;
    const anyModuleChanged = passwordModuleChanged || documentsModuleChanged;

    const currentPassword = form.getFieldValue('currentPassword');
    const newPassword = form.getFieldValue('newPassword');

    setIsSaveDisabled(
      !(isPasswordEdited ? currentPassword && newPassword : anyModuleChanged)
    );
  }, [form, user, isPasswordEdited]);

  useEffect(() => {
    checkIfSaveDisabled();
  }, [isPasswordEdited, checkIfSaveDisabled]);

  const fetchUserData = useCallback(async () => {
    try {
      const user = await getUser();

      setUser(user);

      form.setFieldValue('passwordsModuleOn', user.passwordsModuleOn);
      form.setFieldValue('documentsModuleOn', user.documentsModuleOn);
    } catch (error) {
      console.error(error);
    }
  }, [form]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSaveSettings = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await updateUser(values);
      fetchUserData();
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Wrapper>
      <Typography.Title level={2} style={{ marginBottom: '32px' }}>
        Settings
      </Typography.Title>
      <Form
        name="settings"
        form={form}
        layout="vertical"
        onFinish={handleSaveSettings}
        onChange={() => {
          checkIfSaveDisabled();

          if (error) {
            setError('');
          }
        }}
        validateMessages={{ required: '${label} is required' }}
      >
        <S.InputsWrapper>
          <S.PasswordWrapper>
            <Form.Item
              label="Current password"
              name="currentPassword"
              required={isPasswordEdited}
              messageVariables={{ label: 'Password' }}
              rules={[
                {
                  required: isPasswordEdited,
                },
              ]}
            >
              <Input.Password
                disabled={!isPasswordEdited}
                prefix={<LockOutlined />}
                size="large"
              />
            </Form.Item>
            <Button
              size="large"
              type="primary"
              onClick={() => {
                setIsPasswordEdited((prev) => {
                  const newState = !prev;
                  if (!newState) {
                    form.resetFields(['currentPassword', 'newPassword']);
                  }
                  return newState;
                });
              }}
            >
              {isPasswordEdited ? <CloseOutlined /> : <EditOutlined />}
            </Button>
          </S.PasswordWrapper>
          {isPasswordEdited && (
            <Form.Item
              label="New password"
              name="newPassword"
              messageVariables={{ label: 'New password' }}
              rules={[
                {
                  required: isPasswordEdited,
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </Form.Item>
          )}
          <Form.Item
            label={null}
            name="passwordsModuleOn"
            messageVariables={{ label: 'Passwords module' }}
            valuePropName="checked"
          >
            <Checkbox>Passwords module</Checkbox>
          </Form.Item>
          <Form.Item
            label={null}
            name="documentsModuleOn"
            messageVariables={{ label: 'Documents module' }}
            valuePropName="checked"
          >
            <Checkbox>Documents module</Checkbox>
          </Form.Item>
          {error && <S.Error>{error}</S.Error>}

          <Button
            htmlType="submit"
            loading={isLoading}
            disabled={isSaveDisabled}
            size="large"
            type="primary"
          >
            Save
          </Button>
        </S.InputsWrapper>
      </Form>
    </S.Wrapper>
  );
};

export default Settings;
