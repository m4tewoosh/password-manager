import { message } from 'antd';
import { blue, red, gray } from '@ant-design/colors';

import { CopyOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as S from './Password.styled';

type PasswordProps = {
  id: string;
  name: string;
  username: string;
  password: string;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
};

const Password = ({
  id,
  name,
  username,
  password,
  handleEdit,
  handleDelete,
}: PasswordProps) => {
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    message.success('Password copied');
  };

  const handleDeletePassword = async () => {
    await handleDelete(id);
    message.success('Password successfully deleted');
  };

  return (
    <S.Wrapper>
      <S.PasswordData>
        <span>{name}</span>
        <span>{username}</span>
      </S.PasswordData>

      <S.ActionsWrapper>
        <button onClick={handleCopyPassword}>
          <CopyOutlined style={{ color: gray[6] }} />
        </button>
        <button onClick={() => handleEdit(id)}>
          <EditOutlined style={{ color: blue[6] }} />
        </button>
        <button onClick={handleDeletePassword}>
          <DeleteOutlined style={{ color: red[6] }} />
        </button>
      </S.ActionsWrapper>
    </S.Wrapper>
  );
};

export default Password;
