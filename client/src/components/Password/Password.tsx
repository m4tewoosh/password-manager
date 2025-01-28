import { message } from 'antd';
import { blue, red, gray } from '@ant-design/colors';

import {
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import { PasswordType } from 'types/password';
import * as S from './Password.styled';

type PasswordProps = {
  password: PasswordType;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
};

const Password = ({ password, handleEdit, handleDelete }: PasswordProps) => {
  const { id, name, username, faviconUrl } = password;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password.password);
    message.success('Copied to clipboard');
  };

  const handleDeletePassword = async () => {
    handleDelete(id);
    message.success('Password successfully deleted');
  };

  return (
    <S.Wrapper>
      <S.DataWrapper>
        {faviconUrl ? <S.WebsiteIcon src={faviconUrl} /> : <GlobalOutlined />}
        <S.PasswordData>
          <span>{name}</span>
          <span>{username}</span>
        </S.PasswordData>
      </S.DataWrapper>

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
