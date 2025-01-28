import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  // Input,
  Checkbox,
} from 'antd';
import { getUser, updateUser } from 'api';
// import { EditOutlined, LockOutlined } from '@ant-design/icons';

// import { User } from 'types/user';
import * as S from './Settings.styled';

type FormValues = {
  //   password: string;
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
};

const Settings = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  //   const [user, setUser] = useState<User | null>(null);

  const handleSaveSettings = async ({
    // password,
    passwordsModuleOn,
    documentsModuleOn,
  }: FormValues) => {
    try {
      setIsLoading(true);

      await updateUser(passwordsModuleOn, documentsModuleOn);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const errorMessages = {
    required: '${label} is required',
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await getUser();

        if (user) {
          //   setUser(user);

          form.setFieldValue('passwordsModuleOn', user.passwordsModuleOn);
          form.setFieldValue('documentsModuleOn', user.documentsModuleOn);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, [form]);

  return (
    <S.Wrapper>
      <S.Header>Settings</S.Header>
      {/* <S.SettingsWrapper></S.SettingsWrapper> */}

      <Form
        name="settings"
        form={form}
        layout="vertical"
        onFinish={handleSaveSettings}
        validateMessages={errorMessages}
        // initialValues={{ passwordsModule: true }}
      >
        <S.InputsWrapper>
          {/* <S.PasswordWrapper>
            <Form.Item
              name="password"
              //   initialValue="a" // added for testing purposes
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

            <Button size="large" type="primary" onClick={() => {}}>
              <EditOutlined />
            </Button>
          </S.PasswordWrapper> */}

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

          {/* <Form.Item
            name="documentsModule"
            messageVariables={{ label: 'Documents module' }}
            // initialValue={user?.documentsModuleOn}
          >
            <Checkbox>Documents module</Checkbox>
          </Form.Item> */}

          {/* <S.Error>{error}</S.Error> */}
          <Button
            htmlType="submit"
            loading={isLoading}
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
