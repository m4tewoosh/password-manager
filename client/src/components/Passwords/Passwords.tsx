import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { deletePassword, getPasswords } from 'api';
import { debounce } from 'utils/debounce';
import PasswordForm from 'components/PasswordForm/PasswordForm';
import Password from 'components/Password/Password';

import * as S from './Passwords.styled';

const { Search } = Input;

type Password = {
  id: string;
  name: string;
  username: string;
  password: string;
};

const Passwords = () => {
  const [isNewPasswordModalOpen, setIsNewPasswordModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [editedPassword, setEditedPassword] = useState<
    Password | Record<string, never>
  >({});
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);

  const handleFilterPasswords = (value: string) => {
    const filteredPasswords = passwords.filter(
      (password) =>
        password.name.toLowerCase().includes(value.toLowerCase()) ||
        password.username.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPasswords(filteredPasswords);
  };

  const handleSearch = debounce(handleFilterPasswords, 400);

  const handleEditPassword = (id: string) => {
    const password = passwords.find((password) => password.id === id);

    if (password) {
      setEditedPassword(password);
      setIsEditPasswordModalOpen(true);
    }
  };

  const handleDeletePassword = async (id: string) => {
    await deletePassword(id);
    await fetchPasswords();
  };

  const fetchPasswords = async () => {
    try {
      const passwords = await getPasswords();

      setPasswords(passwords);
      setFilteredPasswords(passwords);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <S.Wrapper>
      <S.Header>Passwords</S.Header>

      <Button
        onClick={() => setIsNewPasswordModalOpen(true)}
        size="large"
        type="primary"
      >
        Add new
        <PlusOutlined />
      </Button>

      <Search
        onSearch={handleSearch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
        placeholder="Find password"
        style={{ width: 200 }}
      />

      <S.PasswordsWrapper>
        {filteredPasswords.map((password, index) => (
          <Password
            key={index}
            id={password.id}
            name={password.name}
            username={password.username}
            password={password.password}
            handleEdit={handleEditPassword}
            handleDelete={handleDeletePassword}
          />
        ))}
      </S.PasswordsWrapper>

      <Modal
        title="Add New Password"
        open={isNewPasswordModalOpen}
        onCancel={() => setIsNewPasswordModalOpen(false)}
        footer={null}
      >
        <PasswordForm
          handleCancelModal={() => setIsNewPasswordModalOpen(false)}
          fetchPasswords={fetchPasswords}
        />
      </Modal>

      <Modal
        title="Edit Password"
        open={isEditPasswordModalOpen}
        onCancel={() => setIsEditPasswordModalOpen(false)}
        footer={null}
      >
        <PasswordForm
          fetchPasswords={fetchPasswords}
          handleCancelModal={() => setIsEditPasswordModalOpen(false)}
          editedPassword={editedPassword}
        />
      </Modal>
    </S.Wrapper>
  );
};

export default Passwords;
